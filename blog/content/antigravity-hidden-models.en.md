# Antigravity's Hidden Models

The model picker in agy and the IDE shows only part of Antigravity's capabilities. Connecting to the native engine gave me a broader catalog: older Gemini models, Tab helpers and an image generator. These can become components of custom tools and pipelines under a Pro or Ultra subscription.

![An AI engine cutaway reveals text, image and completion modules behind a small model picker.](assets/images/hidden-catalog-hero.avif "A broader engine catalog sits behind the interface's model picker.")

I built [Antigravity Engine SDK for Python and Go](https://github.com/Lotargo/antigravity_engine_sdk) to work with that catalog. The repository includes setup instructions, examples and a testbench. The SDK connects to the installed engine without launching agy or the Antigravity interface. The server and account still determine model access.

## What becomes available

- **Older Gemini models.** Gemini 3 Flash and variants of Gemini 2.5 Flash continued to answer in the checks. I find them particularly interesting for text recognition, image understanding and data extraction. Age alone does not make a model useless.
- **Tab models.** Completion models could be called for ordinary text tasks. This opens experiments with compact classifiers and routers. Native edits and code-navigation targets also work in a custom editor.
- **Images.** The dedicated image tool produced a real 1024 × 1024 JPEG. Reference images can be passed through; the quality of particular editing operations still needs evaluation.

![The agy / IDE picker is compared with additional models and tools in the native engine.](assets/images/selector-and-native-catalog.avif "Examples of capabilities beyond the main model picker.")

Here, “hidden” means absent from the usual interface selection. A model removed from the picker may continue to work. If the server has disabled it, the SDK cannot change that.

## Building a pipeline

An application can distribute work across models rather than relying on one long conversation:

**Document → recognition → classification → field validation → storage.**

Or:

**Brief → image generation → result analysis → revised brief.**

![Recognition, classification and image generation connect into an application pipeline.](assets/images/specialist-model-pipeline.avif "A possible composition: each model handles one stage.")

Application code validates answers, handles errors and sends ambiguous results to a person. A classifier might only need to select one of a few labels; required-field checks are better handled with ordinary code.

The individual components have been checked. End-to-end quality and Tab's suitability for a particular classification task still need evaluation on relevant data.

## Why subscription economics matter

Pro costs about $20 a month. The broader model collection is what makes it interesting: OCR, text, completion and image tasks would otherwise call for a selection of separate services and APIs. [Google One pricing](https://one.google.com/about/plans).

In the experiments, calls to some older and helper models were not accompanied by a noticeable decrease in the displayed quota. **The exact effect on limits could not be established.** Different accounting for system calls remains a hypothesis, not a confirmed Google policy.

![One subscription connects to several models, while a question mark represents unknown quota consumption.](assets/images/subscription-and-quota-observation.avif "One subscription, several capabilities. Exact quota consumption is unknown.")

This does not promise unlimited access or measured savings of “$20 instead of hundreds.” The ability to compose several tools under one subscription is already an interesting property to explore.

Pro and Ultra affect models and limits. After a plan change, the SDK can refresh the catalog and verify access. We do not yet have a controlled comparison of the two plans' hidden catalogs. [Plans and quotas](https://antigravity.google/docs/plans).

## What to keep in mind

Checks ran on Windows on October 19–23, 2026, using engine builds 2.23.1–2.25.0. Text calls, vision, image generation and editor commands were confirmed. Comparative OCR quality and exact subscription consumption remain open questions; details are retained in the [verification record](../assets/antigravity-hidden-models/verification.txt).

This is research into an internal protocol. Google treats third-party access through an Antigravity sign-in as a violation of its terms; a paid subscription does not remove that restriction. [Google FAQ](https://antigravity.google/docs/faq).

The illustrations were made with GPT Image and depict concepts.
