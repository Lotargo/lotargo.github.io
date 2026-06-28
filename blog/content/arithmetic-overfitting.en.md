---
slug: "arithmetic-overfitting"
lang: "en"
translation: "arithmetic-overfitting.ru.md"
title: "When a Tiny Mamba Learns Arithmetic"
date: "2026-06-28"
type: "AI stability"
description: "A technical article about overfitting a 380k parameter Mamba model on two-digit addition, GPU overflow failure modes, state-space stability, and why the final plateau mattered."
---

# When a Tiny Mamba Learns Arithmetic

The experiment looked small on purpose: train a 380k parameter, 6-layer Mamba-style model on 1,000 examples of two-digit addition without carry. The point was not to solve arithmetic in general. The point was to ask a sharper engineering question: can the model overfit a tiny deterministic task without losing numerical stability?

The answer was mixed in the most useful way. The fourth run stayed stable for 1,000 epochs and produced the target sanity-check answer `21+48=69`, but exact-match accuracy stayed low: 1.9% on train and 2.5% on validation. That gap is the story.

## Four runs, one stable path

The first attempts showed two separate failure modes. Increasing batch size improved GPU utilization but exposed unstable state-space dynamics. Adding parameter clamping stabilized the recurrent matrix, but a high learning rate still pushed the optimizer into overflow. The successful configuration was more conservative: batch size 256, learning rate `3e-4`, and post-step clamping.

| Run | Batch | LR | Clamp | Outcome |
| --- | ---: | ---: | --- | --- |
| 1 | 128 | `1e-3` | no | manually stopped |
| 2 | 256 | `1e-3` | no | FPU overflow at epoch 400 |
| 3 | 512 | `1e-3` | yes | NaN / FPU overflow |
| 4 | 256 | `3e-4` | yes | stable to epoch 1000 |

## What stability actually meant

The key stability principle was simple: the diagonal state transition must remain contracting. If the recurrent state parameter drifts above zero, the scan turns from a decaying system into an expanding one. On GPU, that showed up as invalid floating point operations.

Clamping the state parameter to a negative range kept the recurrence stable. It did not solve optimization by itself, but it separated architectural instability from optimizer instability.

## The plateau

The loss curve tells the second half of the story:

| Epoch | Loss |
| ---: | ---: |
| 1 | 3.0245 |
| 100 | 0.8238 |
| 200 | 0.2522 |
| 600 | 0.2299 |
| 1000 | 0.2261 |

Most of the learning happened early. From epoch 200 to 1000, the model only improved by 0.0261 loss points. That plateau suggests the fixed learning rate was too coarse for the final stage, and the large batch size removed the stochastic noise that can help escape shallow traps.

## Why exact match stayed low

The model was not random. It often learned the magnitude and partial structure of the answer, but it failed in ways that matter for exact-match evaluation.

Two error classes dominated:

- off-by-one or digit-level approximations, such as `41+41 -> 84` instead of `82`;
- generation truncation, where the two-token decode budget was too strict after an unwanted token.

This is why the model could pass the sanity check `21+48=69` while still failing the broader exact-match metric.

## What this changes next

The next experiment should not only train longer. It should change the task interface and the optimizer loop:

- add explicit scratchpad tokens so intermediate arithmetic can be represented in the sequence;
- add learning-rate decay when the loss window flattens;
- evaluate with a generation budget that can tolerate a stray separator token;
- track off-by-one and truncation errors separately from total exact match.

The lesson is useful precisely because the model did not reach 100%. The run proved that the state-space core can be made stable, and it exposed the next bottleneck: not recurrence explosion, but the training protocol around a fragile symbolic task.
