# All Tests Green, Vector Search Dead

For two days my RAG plugin searched documents without using a single vector. Twelve test suites passed the whole time, benchmarks were not run, and nobody noticed anything because BM25 kept returning reasonable results. I found it by accident — and only because a test script imported the wrong module.

![Hybrid RAG memory for AI agents](assets/images/memory-plugin-hero.avif "@lotargo/memory_plugin — local hybrid memory for coding agents")

## The project

`@lotargo/memory_plugin` is a long-term memory system for AI agents. It keeps two layers: user notes in Markdown and a RAG document store in SQLite. Retrieval is hybrid — BM25 through FTS5 and dense vectors through ONNX, combined with relative score fusion. Everything runs locally, with no external APIs.

The vector half is not decoration. It is what carries cross-lingual queries: ask in Russian, find it in English documentation. BM25 cannot do that at all — there is zero lexical overlap to work with.

## How it surfaced

I was finishing a project audit and verifying a small fix in the benchmark report generator. I wrote a script that imported the rendering function — and instead of a quick check I got a full ONNX benchmark run. That was a separate defect in itself: the module started measuring as an import side effect.

While it ran, I watched the results table. It said this:

| Strategy | MRR@5 |
| --- | ---: |
| BM25 | 0.6706 |
| Dense Vector | **0** |
| Hybrid RRF | 0.6706 |
| Hybrid RSF | 0.6706 |

Zero for vectors. All twenty-one queries MISSED. More telling: both hybrid modes returned exactly the BM25 numbers. Fusion was running fine — it simply had nothing to fuse.

## The cause

Embeddings were computed correctly; I checked that first by calling the model directly. Vectors were written to the database: 1536 bytes per chunk, exactly 384 float32 values. They were read back too. And then:

```js
let vecSub = r.vector;
if (typeof vecSub === "string") {
  vecSub = Buffer.from(vecSub, "base64");
} else if (vecSub.type === "Buffer" && Array.isArray(vecSub.data)) {
  vecSub = Buffer.from(vecSub.data);
} else if (Array.isArray(vecSub)) {
  vecSub = Buffer.from(vecSub);
}
if (!Buffer.isBuffer(vecSub) || vecSub.byteLength < vectorDim * 4) continue;
```

That last line killed retrieval. The engine runs on the built-in `node:sqlite` module, and it returns BLOB columns as `Uint8Array` — not `Buffer`. None of the three normalization branches matched, `Buffer.isBuffer()` returned `false`, and `continue` discarded the row. Every row. Every time.

> `Buffer` extends `Uint8Array`, but not the other way round. A `Buffer.isBuffer()` check against `node:sqlite` data is a silent `continue` over the entire result set.

The uncomfortable part: before that guard existed, the code worked precisely because it was simpler. `Uint8Array` fell through every branch and went straight into `tempView.set(vecSub.subarray(...))`. `Uint8Array` has `subarray`. Everything scored fine.

The guard arrived in a commit titled "await missing async calls, security fixes, and dead code cleanup". A defensive line written with good intentions disabled half the engine.

## Why the tests stayed silent

This is more interesting than the bug itself.

The project has twelve test files: unit, integration, cloud. All green. They share one detail — every one of them does this:

```js
await ingestDocument({
  content: "...",
  generateEmbeddings: false,
  customDb: db,
});
```

`generateEmbeddings: false`. That was a deliberate and reasonable decision: tests should not pull a two-gigabyte model or depend on the network. The whole run finishes in 41 seconds and works offline.

But the consequence is that the dense half of the engine was never exercised. The single `hybridQuery` call in the integration tests also ran with `generateEmbeddings: false`, and in that mode the function deliberately switches to `lexical_only`. So the "hybrid retrieval" test was testing BM25.

The tests confirmed that vectors were **written** — correct size, non-zero. That anything would later **read** them was never asserted.

## Two more places

Once I understood the cause, I searched the codebase for the same mistake. It appeared twice more:

- in the cloud sync queue — `hybrid-sync` was pushing **empty** vectors to the cloud;
- in snapshot export — snapshots were saved without vectors.

Both repeated the same `if/else if` chain ending in `Buffer.isBuffer()`. Both failed silently: no exception, no warning in the log.

The fix is one normalization function shared by all three call sites:

```js
export function toVectorBytes(value) {
  if (value === null || value === undefined) return null;
  if (typeof value === "string") return new Uint8Array(Buffer.from(value, "base64"));
  if (value instanceof Uint8Array) return value; // covers Buffer too
  if (ArrayBuffer.isView(value)) return new Uint8Array(value.buffer, value.byteOffset, value.byteLength);
  if (value instanceof ArrayBuffer) return new Uint8Array(value);
  if (value.type === "Buffer" && Array.isArray(value.data)) return new Uint8Array(value.data);
  if (Array.isArray(value)) return new Uint8Array(value);
  return null;
}
```

Order matters: `value instanceof Uint8Array` comes before `ArrayBuffer.isView` because it already covers both `Buffer` and whatever `node:sqlite` hands back, with no extra copying.

## What I added so it cannot repeat

A unit test on the normalization function is not enough. It verifies type conversion but never answers the question that matters: does retrieval actually work?

So there is now a separate smoke test with **real** embeddings. It is not part of `npm test` — it loads the model and that is slow. It runs before a release via `npm run smoke` and asserts what nothing else did:

```js
const cosines = hits.map((h) => h.cosine_sim ?? 0);
assert.ok(
  cosines.some((c) => c > 0),
  "at least one hit carries a non-zero cosine similarity — " +
  "a zero here means the dense half of the engine is dead"
);
```

Plus a cross-lingual check: a Russian query must reach an English document. Lexical search cannot fake that — if the test passes, the vector path is alive.

Then I reintroduced the bug and confirmed the test fails. A regression test that has never been verified against the actual defect is an assumption, not a guarantee.

The test reuses the model weights already cached in the data directory, so it does not re-download two gigabytes.

## What I took away

**Type guards at a driver boundary are riskier than they look.** `Buffer.isBuffer()` reads like sensible defence. Against `node:sqlite` data it is a filter that rejects everything. If you add a guard like that, first find out what the driver actually returns.

**Fast offline tests create blind spots, and those need to be explicit.** Disabling embeddings in tests was the right call: forty seconds instead of several minutes, no network. The mistake was not covering the disabled half anywhere else. Every "let's skip the heavy part for speed" has a price — the only question is whether you know about it.

**Silent degradation is worse than a crash.** Had retrieval thrown, I would have known within a minute. Instead it fell back to BM25 and kept producing plausible answers. That is typical for hybrid systems: the fallback path masks the failure of the primary one.

**A missing signal is still a signal.** A zero in a metrics column does not look like an error. It looks like a number.

## Current state

The fix shipped in `1.6.0` together with the audit results: ninety-two items across publishing, security, code quality, tests, and documentation. A fresh benchmark run produced MRR@5 0.9286 and Recall@5 100% for hybrid RSF — byte-for-byte identical to the reference measurement taken before the bug appeared. The fix restored behaviour rather than tuning numbers.

The package is MIT-licensed: [npmjs.com/package/@lotargo/memory_plugin](https://www.npmjs.com/package/@lotargo/memory_plugin), sources at [github.com/Lotargo/memory_pugin](https://github.com/Lotargo/memory_pugin).

One more thing worth noting: I found this because of another defect — importing a module launched a benchmark as a side effect. I fixed that too. But without it, the bug would have waited for the next manual run.
