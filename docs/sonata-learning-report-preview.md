# Sonata research article: authoring and release

Report version: 1.0, dated 2026-10-30. The user authorized website publication and a short Russian Telegram edition.

## Edit and render

Semantic sources:

- `blog/content/sonata-learning-report.ru.md`
- `blog/content/sonata-learning-report.en.md`
- `blog/content/sonata-learning-report.tg-RU.md`
- `blog/content/sonata-learning-report.article.json`

Use the article-specific entry point, which calls the shared Markdown renderer and bundle validator with the research template:

```powershell
python scripts/prepare_sonata_article.py
```

This prepares `blog/posts/sonata-learning-report.html` and the local blog manifest entry. It does not commit, push, create a staged import bundle, or contact a publishing service. Do not hand-edit the generated page. The generic bundle install command uses the ordinary blog template; use the command above to retain the research layout.

## Preview

```powershell
python -m http.server 4173 --bind 127.0.0.1
```

Open <http://127.0.0.1:4173/blog/posts/sonata-learning-report.html?lang=ru> or <http://127.0.0.1:4173/blog/>. Change `lang=ru` to `lang=en` for English. The existing language and theme controls remain available. Tables scroll independently on narrow screens; chart images open in the existing viewer.

## Scope and provenance

The article contains seven main tables and one runtime appendix table, two unchanged experiment plots, one bilingual responsive SVG architecture figure, three original metrics CSV files, a numerical summary and checksums of the supplied artifacts. The learning experiments are dated 2026-10-16; the B3 runtime appendix is dated 2026-10-27. These are archived measurements, not new runs.

The appendix uses NVIDIA pretrained weights and remains distinct from the models trained from scratch. Held-out names are held out from the current fact-training stage, not necessarily from earlier language or BPE training. The mixed-length comparison matches updates and sequences, but processes 58.33% more tokens. The source CSV `train_batch` accuracy/count fields are placeholders, as explained in the article.

The production template supplies canonical, Open Graph and Twitter metadata with `index, follow`. The article category has no draft label. Onsite notifications remain disabled via `post.notify`; this setting is separate from Telegram publishing.

The dedicated `.tg-RU.md` is a short Russian edition with a link to the full article. Existing `distribution.telegram.ru` settings select `photo-caption` with `architecture-preview.jpg`, a browser rendering of the approved wide Russian diagram. The image is uploaded directly, so its delivery does not depend on the timing of GitHub Pages deployment. The normal push-to-main workflow publishes or updates it in the configured blog channel and records the result in `blog/content/telegram-publications.json`. Publication source hashes prevent duplicate posts. No article-specific opt-out mechanism was added.

Dry-run the dedicated Telegram edition:

```powershell
python -m scripts.publish_telegram_article --root . --slug sonata-learning-report --dry-run
```

## Verification, 2026-10-30

- Shared bundle/renderer suite: 7 tests passed.
- Article preparation and bundle validation passed; a second render produced identical HTML and blog metadata.
- Checked 15 distinct local page/asset URLs: HTTP 200. All in-page link targets resolve and IDs are unique.
- Verified the original ten public artifact checksums; the release additionally includes the JPEG preview. Both plots and the three CSV files retain their original bytes. Detailed source provenance is retained privately outside the article assets.
- Browser checks: RU/EN, light/dark, 1440×900 and 1920×1080 desktop, 390×844 and 430×932 mobile. No horizontal page overflow; tables scroll independently and accept keyboard focus.
- Chart viewer opened full-resolution images, advanced with ArrowRight and returned focus after Escape. Table ArrowRight scrolling was observed.
- Blog card appears first locally; article Previous navigation points to the preceding post. No browser console warnings or errors were observed.
- These checks describe local review before publication. No new model execution was performed. Release verification must check GitHub Pages and Telegram publication state separately.

## Provenance revision, 2026-10-30

The title, lead, abstract and introduction now state that both the neural implementation and the trained weight lineage originate in Sonata. Section 2.1 and Table 1 separate custom tensor/autograd/layer/training code from established mathematical ideas, low-level CUDA/cuBLAS dependencies, tokenization tools and external datasets. The NVIDIA checkpoint remains a separate appendix. Implementation provenance was inspected locally; no source code or source archives were copied into the article.

## Architecture wording revision, 2026-10-30

The no-PyTorch/TensorFlow-module-or-autograd statement is bold in both abstracts. Section 2.2 describes independent architecture research, the dense/sigmoid delta parameterization, and the parallel recurrent/attention/SwiGLU prototype. The reported learning profile remains explicitly recurrent-only. Public repository revision IDs and private source receipts have been removed; artifact-checksums.json covers only the supplied figures, metrics and summary. The detailed pre-existing source audit remains in local Git metadata.

The formal keyword block has also been removed from both languages. Current checks passed: bold framework-independence statement, architecture subsection and scope, sequential table numbering, valid local links, ten public artifact checksums, absence of private revision IDs, HTTP 200 and deterministic rendering. The updated architecture section was inspected in the browser.

## Architecture diagram, 2026-10-30

Figure 1 shows the shared native engine, a separate three-branch hybrid prototype and the measured 4,504,192-parameter recurrent profile for language/dialogue/facts. Solid arrows indicate tensor flow; dashed connectors indicate use of the common engine. Green outlines and explicit labels identify the measured profile. Other smaller experiments remain listed in Table 2.

The four vector assets provide RU/EN wide and stacked layouts. The article-specific renderer emits a picture element that selects the stacked SVG at widths up to 680px; the existing image viewer retains the wide full source. Source-layout links remain available. SVGs contain title/description text, no scripts, external assets or raster wrappers.

To edit the diagram, change scripts/draw_sonata_architecture.py, then run:

```powershell
python scripts/draw_sonata_architecture.py
python scripts/prepare_sonata_article.py
```

The article preparation command refreshes the public artifact checksums. Learning-curve captions are renumbered as Figures 2 and 3.

Diagram verification passed: all four SVGs parsed; browser text-bound and overlap checks passed for RU/EN wide and stacked layouts. Native picture selection loaded 1600×1130 wide diagrams on desktop and 800×2140 stacked diagrams at a 390px viewport in both languages, without page overflow. The diagram opened as image 1/3 with its localized caption and retained wide full source. Eighteen distinct local URLs returned HTTP 200; all ten artifact checksums and deterministic SVG/HTML regeneration passed.

## Release verification, 2026-10-30

- All 24 shared bundle, renderer, Telegram publisher and Telegram preview tests passed.
- The dedicated Telegram photo caption renders to 799 visible characters against a project limit of 900; its dry run selects the approved JPEG and the new-post action.
- All eleven release artifact checksums passed, including the JPEG preview. Twenty-one local page/asset URLs returned HTTP 200.
- Scoped Git attributes preserve article asset bytes across checkouts; staged Git blobs are verified against the public SHA-256 manifest.
- Repeated article rendering produced identical HTML, artifact checksums and blog metadata. The final page contains sixteen labelled tables, two responsive diagram pictures, unique element IDs and resolving internal anchors.
- Production canonical/social metadata and `index, follow` were verified. The final rendered Russian page states implementation and weight provenance and report version 1.0.
- No private source paths or repository revision IDs were found in the public page. JavaScript syntax and Git whitespace checks passed.
