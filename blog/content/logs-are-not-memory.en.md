---
slug: "logs-are-not-memory"
lang: "en"
translation: "logs-are-not-memory.ru.md"
title: "Logs ≠ Memory: Why Research Projects Need ClickHouse and a DS/ML Layer"
date: "2026-06-29"
type: "Research infrastructure"
description: "A technical note about treating experimental systems as data sources: why logs are not enough, where DS/ML tools fit, and why ClickHouse is a better home for event telemetry than PostgreSQL."
assets: []
---

# Logs ≠ Memory: Why Research Projects Need ClickHouse and a DS/ML Layer

A small project can survive on `print`, terminal history, and a few screenshots. A research project cannot.

The moment a system starts producing versions, sweeps, candidate traces, evaluator verdicts, latency samples, failed runs, penalty curves, and reproducibility bundles, it stops being only a program. It becomes a source of experimental data.

That is the moment where a DS/ML layer becomes part of engineering hygiene, not decoration.

## The problem is not storage. The problem is memory.

Logs answer the question: what happened somewhere?

A research database answers better questions: what changed after a commit, which backend fails more often, which configs converge faster, which domains produce evaluator disagreements, which successful runs were affected by shortcuts, and which result can still be reproduced two months later.

A terminal log is a trace. A dataset is memory.

## Postgres is state. ClickHouse is observation.

PostgreSQL is excellent when the system needs consistent state: users, tasks, relations, configs, artifact metadata, queues, permissions, and application objects.

ClickHouse is built for a different type of data: append-only analytical events. Its official docs describe it as a high-performance column-oriented SQL DBMS for OLAP. OLAP queries routinely aggregate over large datasets, and columnar layout helps because analytical queries usually read only a subset of columns.

> Postgres stores what the system is. ClickHouse stores what the system did.

| Layer | Best fit | Why |
|---|---|---|
| PostgreSQL | current state | transactions, relations, constraints, integrity |
| ClickHouse | event history | append-only metrics, time-series, aggregations, high ingest |
| verification-lab | evidence | manifests, hashes, CSV/JSONL exports, audit reports |

## Why this matters for research systems

A single successful run is not enough. A research system needs to preserve behavior across many runs.

For Hermes, events include run id, commit SHA, opcode, payload size, response size, latency, CRC status, backend path, status, and error type.

For AGI-lite, events include version, domain, seed, candidate id, AST size and depth, penalty, fitness, verdict, evaluator, and integrity mode.

For Sonata, events include epoch, step, loss, teacher-forced accuracy, parse success, format validity, loop rate, autoregressive exact match, and gate status.

These are not business records. They are observations.

## DS/ML is not only model training

In this context, DS/ML tools are not there to make the project sound fashionable. They are there to stop the researcher from guessing.

A minimal analysis layer can answer whether latency actually improved, whether a lower penalty correlates with smaller ASTs or only with bloat, whether a new evaluator reduces invalid candidates or hides them, whether a deeper model reduces loss while making free generation worse, and whether timeouts cluster around one domain, opcode, or commit.

This is not big data theatre. It is basic experimental hygiene.

## The architecture I want

The clean split is simple:

- engine or experiment emits events;
- event logger writes them to ClickHouse;
- Python, Polars, or notebooks analyze them;
- CSV, JSONL, and MANIFEST files are exported;
- final bundles go to verification-lab-1.

The responsibility split is also simple:

- Postgres stores state and relations;
- ClickHouse stores observations and metrics;
- verification-lab stores evidence and reproducibility bundles.

A compact event table is enough for the first iteration. It can contain timestamp, project, run id, commit SHA, event type, metric name, metric value, domain, backend, status, config JSON, and payload JSON.

This is not the final schema. It is a starting point. In early research infrastructure, stable event writing matters more than perfect normalization.

## Why ClickHouse fits the event stream

Research telemetry is usually appended rather than edited. It is filtered by time, project, run, domain, backend, or status. It is aggregated with count, average, quantile, countIf, and group-by queries. It is often wide enough that most queries read only a few columns. It eventually becomes too large for grep-based investigation.

ClickHouse's MergeTree family is designed for high ingest and large data volumes: inserts create parts, and background merges compact those parts over time. That model is a natural fit for event telemetry.

## The important boundary: data is not evidence yet

ClickHouse can tell me what happened. It does not prove that the result is publishable.

That is why the analytical layer should export evidence bundles into verification-lab-1. ClickHouse is queryable memory. verification-lab-1 is reproducibility evidence.

## The real reason to do this

The danger in research projects is not only that a system fails. The danger is that it works once, beautifully, accidentally — and you mistake that for a law.

A DS/ML layer helps separate progress from noise, discovery from overfit, stability from one lucky run, benchmark from demo, and verification from a pretty log.

Not because every project needs enterprise analytics. Not because every graph is science. But because a research system without analytical memory remembers mostly the developer's last emotion.

A research system with structured telemetry can remember distributions, regressions, failures, and evidence.

## References

- [ClickHouse: What is ClickHouse?](https://clickhouse.com/docs/intro)
- [ClickHouse: MergeTree table engine](https://clickhouse.com/docs/engines/table-engines/mergetree-family/mergetree)
- [PostgreSQL: About](https://www.postgresql.org/about/)
