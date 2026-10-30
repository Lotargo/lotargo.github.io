# Sonata: A Neural Engine Built from Scratch in Free Pascal and CUDA

Sonata is a neural engine being developed from scratch in Free Pascal and CUDA. The project implements tensors, a computation graph, automatic differentiation, neural layers, an optimizer and model execution. This article investigates training our own models on that engine from freshly initialized parameters, without importing pretrained neural weights.

**Abstract.** We present a custom neural computation implementation and its experimental evaluation. The tensor engine, differentiation graph, forward and backward passes, layers and training are implemented in Sonata code; **this path does not use ready-made PyTorch or TensorFlow neural modules or autograd**. Sonata develops through our own research into a modular hybrid architecture: publications on automatic differentiation, Mamba/SSMs and other neural methods provide a research foundation and ideas for our own structures, parameterizations and combinations of computation. The reported learning results concern a specific Mamba-inspired Sonata profile. A six-layer, 4,504,192-parameter model learns English text from scratch. After task-specific fact training, performance changes from 0/72 to 72/72 on familiar-format contexts and from 0/72 to 70/72 on longer inputs. Transfer beyond task-training coverage is evaluated separately. Verification includes control models, paired fact changes, CPU/CUDA comparisons, independently recomputed metrics and fresh weight reloads.

[TOC]

## 1. Introduction {#en-introduction}

Sonata is being developed as a modular neural system with its own tensor operations, automatic differentiation, optimizers and CPU/CUDA execution. The motivation includes control over the computation path and investigation of its efficiency. Lower overhead relative to other stacks is a testable hypothesis; using Pascal alone does not establish a resource or speed advantage.

“From scratch” refers to two separate outcomes in this work: developing the computation implementation and obtaining weights through our own training. Layer classes, their composition into a model, gradient computation and parameter-update loops are written in the project. The 4.50M-parameter model starts language learning from freshly initialized parameters; dialogue and fact training continue its own saved weights. A downloaded neural network or a framework composition of imported trainable blocks is not the foundation of this experiment.

This report asks four questions: do the models learn the specified dependencies; how does the training regime affect transfer; what skills does a small language model acquire; and do the backends agree numerically? Tasks with unambiguous answers precede experiments with English text and a limited fact domain.

The learning experiments ran on 16 October 2026. A separate appendix covers execution of a pretrained NVIDIA checkpoint at the stage completed on 27 October. This report is dated 30 October 2026, version 1.0. Training our own models and executing external weights are treated separately.

## 2. Models and Implementation {#en-models}

### 2.1. Implementation, Ideas and Weight Provenance {#en-provenance}

The project combines our own research and development with the study of published work. Mamba [1], Adam [4], RMSNorm [5] and automatic differentiation methods [6] provide mathematical foundations and research context. Our own computation blocks, their composition and training in Sonata are developed on that basis. The network's constituent layers are implemented within the project and use its tensor engine and differentiation rules.

**Table 1. Provenance of the trained system's components.**
{.table-caption}

| Component | Origin | What these experiments use |
|---|---|---|
| Tensor engine and autograd | Custom Sonata implementation | Tensors, operation graph, backward rules and gradient accumulation |
| Neural layers and model | Custom Sonata implementation | Embedding, Linear, RMSNorm, Mamba blocks and their composition into a language model |
| Training and weight handling | Custom Sonata implementation | Adam, clipping, training loop, serialization, reload and generation |
| GPU computation | Sonata CUDA code and low-level cuBLAS | Custom kernels, including Mamba scan/backward; cuBLAS matrix operations |
| Neural weights | Learned in Sonata | Fresh initialization, followed by language, dialogue and fact stages |
| Training data | External corpora and experiment generators | Selected TinyDialogues/LIGHT data and synthetic tasks |
| Tokenizer preparation | External tokenizers library | An experiment-specific BPE vocabulary fitted only on training text |

Free Pascal, CUDA, cuBLAS and supporting Python libraries provide the development tools: a compiler, GPU access, basic linear algebra and data preparation. Sonata's own code defines the trained network, its computation graph and parameter-update rules. PyTorch and vLLM serve separate external reference checks in the Nemotron work described in Appendix A.

### 2.2. Custom Architecture and Hybrid Components {#en-architecture}

Sonata is an independently developed experimental modular architecture. Published work provides ideas; our design choices cover the computation graph, block parameterization, composition, differentiation rules and CPU/CUDA execution. The architecture evolves alongside our own experiments and verification.

The diagram shows a shared computation engine and two separate model profiles. The hybrid prototype combines three branches; the language, dialogue and fact experiments use a 4,504,192-parameter recurrent profile. Dashed connections indicate use of the engine, while solid arrows show tensor flow within each profile.

![The shared Sonata engine supports two separate configurations: a recurrent, attention and MLP hybrid, and the measured six-block recurrent profile without attention or the separate MLP branch](assets/sonata-architecture-en.svg "Figure 1. Sonata's custom engine and model profiles. The green outline marks the configuration used for language, dialogue and fact results; other experiments use the configurations in Table 2. Narrow screens use a stacked diagram layout.")

Vector diagram: [wide layout](../assets/sonata-learning-report/sonata-architecture-en.svg) · [stacked layout](../assets/sonata-learning-report/sonata-architecture-en-mobile.svg).

The Mamba-inspired block used in the trained profile is our own variation of a selective recurrent model. It uses a dense projection of the time-step parameter Δ followed by a sigmoid transformation. By comparison, the standard configuration of the pinned original Mamba implementation [7] uses a low-rank Δ projection and softplus. This is a concrete parameterization difference: sharing an SSM idea does not make the blocks identical or their weights interchangeable.

Hybridization concerns combining different information-processing mechanisms. The project includes an experimental block with three parallel branches: Mamba-inspired recurrence, causal attention and SwiGLU/MLP. Their outputs are combined as a weighted sum, `H(x) = αR(x) + βA(x) + γF(x)`, with coefficients set by configuration. Attention in this prototype has a CPU implementation. Expert routing and interaction between neural components and symbolic computation are also research directions.

The learning measurements in this article come from a recurrent-block profile without the attention and separate MLP branches of the hybrid prototype. Joint training of the full hybrid and measuring its contribution are separate experimental tasks. This distinguishes Sonata's broader architecture from the precisely defined configuration that produced the reported results.

### 2.3. Trained Configurations {#en-configurations}

In the sequence experiments, “Sonata Mamba” denotes the custom Mamba-inspired block described above. The language configuration consists of an embedding, six RMSNorm/Mamba/residual blocks, a final RMSNorm and a linear language-model head. This trained configuration has no attention. The ByteLevel BPE vocabulary contains 2,048 tokens.

Native Sonata performs the forward pass, backward pass and parameter updates. Python prepares data, launches binaries, checks exported values and plots metrics. Training uses FP32 and Adam; these results do not cover AMP or quantized training.

**Table 2. Tested configurations and training budgets.**
{.table-caption}

| Task | Parameters | Adam updates | Initializations | Backend |
|---|---:|---:|---|---|
| Same-sign classification, MLP | 82 | 300 | 17 / 29 / 43 | CPU |
| First-symbol recall, delay 4 | 1,561 | 600 | 17 / 29 / 43 | CPU |
| First-symbol recall, mixed lengths | 1,561 | 1,200 | 17 / 29 / 43 | CPU |
| First-symbol recall, delays up to 512 | 629,385 | 1,200 | 17 | CUDA |
| Language stage | 4,504,192 | 4,200 | 17 | CUDA |
| Dialogue stage | 4,504,192 | 2,100 more | same weight lineage | CUDA |
| Contextual facts | 4,504,192 | 4,000 more | same weight lineage | CUDA |

The MLP, small CPU Mamba and 629K-parameter CUDA model are separate configurations. The final three stages continue one weight lineage. Adam is reset between the language, dialogue and fact stages: these are weights-only continuations rather than full training-state resumes.

CPU experiments ran on an Intel Xeon at 2.20 GHz under Linux. CUDA training used an NVIDIA RTX PRO 6000 Blackwell Server Edition, FPC 3.2.2 and CUDA 13.0.88, with TF32 disabled. Saved weights were also checked on a Windows CPU. Native wall times, including periodic evaluation and saving, were 1,055.872 s for language, 550.440 s for dialogue and 1,020.978 s for facts. Provisioning, compilation and separate tests are excluded.

## 3. Experimental Protocol {#en-protocol}

### 3.1. Splits and Checkpoint Selection {#en-splits}

Training, validation and test sets follow task-specific separation rules. Coordinates do not overlap in the sign task. Recall tasks separate distractor combinations, with each combination represented by all four target digits.

The language corpus uses selected TinyDialogues conversations [2] and LIGHT dialogues [3]. BPE is trained only on training text. Both sides of a LIGHT episode stay in the same split, as do identical normalized location descriptions. This is not exhaustive semantic deduplication of similar phrases.

Checkpoints are selected by validation cross-entropy. Test results do not select weights, budgets or stopping points. No further training followed inspection of the corresponding tests in these experiments. Repeated initializations share test inputs: evaluating three models on 512 inputs does not create 1,536 independent examples.

### 3.2. Metrics and Free Generation {#en-metrics}

Cross-entropy is averaged over supervised positions, excluding padding. Perplexity is defined as `PPL = exp(CE)`. Language evaluation supplies the correct preceding tokens, so PPL measures teacher-forced token prediction rather than free-answer accuracy.

Free generation is evaluated separately. The model receives its previously selected tokens, chooses from the full vocabulary and stops at EOS or a specified boundary. The fact experiment uses greedy decoding with at most 32 new tokens, without external retrieval, candidate reranking or a gold answer prefix.

The `slot_correct` metric requires the target value and excludes other values of the same type from the test vocabulary. Full normalized response match is computed separately. A strict pair requires both requests with a changed target fact to receive their respective correct, different answers. These metrics apply to the specified task rather than the complete semantics of arbitrary conversation.

## 4. Results {#en-results}

### 4.1. Nonlinear Learning and Controls {#en-signs}

The MLP `Linear(2,16) → ReLU → Linear(16,2)` learned whether two numbers have the same sign. Train/validation/test contained 256/128/512 inputs. Each of three initializations reached 512/512 correct test answers, up from 52.54–65.82% before training.

Controls used a linear network and the same MLP with training labels shuffled once, with the same budget. The table reports accuracy after validation-based checkpoint selection.

**Table 3. Sign-task controls on a shared 512-input test set.**
{.table-caption}

| Variant | Seed 17 | Seed 29 | Seed 43 |
|---|---:|---:|---:|
| MLP, correct training labels | 100% | 100% | 100% |
| Linear network | 47.66% | 41.80% | 48.63% |
| MLP, shuffled training labels | 50.78% | 64.84% | 55.08% |

For shuffled labels at seed 29, the initial checkpoint was selected because validation CE did not improve. A separate grid extending beyond the training range yielded 88/100, with near-zero errors. A direct program solves the sign rule; this experiment checks whether the network learns the dependency.

### 4.2. First-Symbol Recall and Length Transfer {#en-recall}

The sequence task maps an input such as `3abcd?` to its first digit. After training at delay 4, a one-layer, 1,561-parameter Mamba solved 512/512 new inputs for each of three initializations. Replacing the first symbol with `?` reduced accuracy to 25%, as expected when identical corrupted inputs correspond to four equally likely answers.

Fresh models were then compared using matched initial seeds and 1,200 updates: training only at delay 4 versus training at delays 2/4/8/16. Delays 24–128 did not participate in checkpoint selection.

**Table 4. CPU Mamba transfer beyond training lengths; 512 inputs per delay.**
{.table-caption}

| Delay | Fixed delay 4, range across three seeds | Mixed, seed 17 | Mixed, seed 29 | Mixed, seed 43 |
|---:|---:|---:|---:|---:|
| 24 | 25.00–61.33% | 100% | 100% | 100% |
| 32 | 25.00–49.41% | 100% | 100% | 100% |
| 64 | 25% | 52.54% | 100% | 66.60% |
| 128 | 25% | 25% | 100% | 25% |

Both new regimes processed 38,400 sequences. Mixed-length training processed 364,800 input tokens versus 230,400, an increase of 58.33%. The comparison matches updates and sequences, but not tokens, compute or data diversity. It measures the changed regime without isolating a single causal factor.

A four-layer, 629,385-parameter CUDA Mamba trained at delays 4/16/64/128/256/512. It achieved 64/64 at each tested delay: 16/64/128/256/512/1024/2048/4096. Adding competing digits to the distractors yielded 16/64 at delays 128/512/1024. This is one seed and synthetic single-symbol recall; long-document language understanding was not measured.

### 4.3. Language Learning from Scratch {#en-language}

The six-layer Mamba first learned language on TinyDialogues, then dialogue responses on a LIGHT/TinyDialogues mixture. The following evaluations use the same held-out files for all four checkpoints.

**Table 5. Teacher-forced perplexity on fixed language tests; lower is better.**
{.table-caption}

| Test | Initial | After language | After dialogue | After facts |
|---|---:|---:|---:|---:|
| TinyDialogues language, 20,031 tokens | 2976.15 | 10.24 | 13.59 | 16.39 |
| TinyDialogues responses, 3,710 tokens | 2896.79 | 11.82 | 13.71 | 16.16 |
| LIGHT responses, 2,855 tokens | 2823.95 | 118.60 | 37.73 | 122.95 |

![Two cross-entropy plots showing language learning and subsequent dialogue-response training](assets/language-learning.png "Figure 2. Recorded language and dialogue learning curves. CE is measured over supervised tokens; the stages use different tasks and masks.")

All responses to 31 selected prompts were separately retained: seven manual probes and 24 prompts from separate test dialogues. After both the language and dialogue stages, all 31 greedy responses ended with EOS. This establishes the termination behavior; meaning is assessed from the responses themselves. One literal response after the dialogue stage is:

> Well, plants need water to grow, and plants need water to grow. They need water to grow big and strong.

The response is coherent but repetitive. Key and dog-name probes revealed weak use of supplied facts, motivating a separate task-training experiment.

### 4.4. Facts in a Limited Training Domain {#en-grounding}

The fact curriculum contains 24,000 training and 600 validation examples: a dog's name among a cat's name, a character's role among a neighbor's role, and the requested key among another key. It uses 12 training names, three wording variants and up to three distracting dialogue pairs. Some examples omit the requested fact and target `I do not know.`. Fact batches account for 90% of updates; the remaining 10% rehearse selected earlier TinyDialogues responses.

The frozen test has 319 requests: four groups of 72, 24 absent-fact requests and seven previous manual probes. The four fact groups include 144 counterfactual pairs, making observations dependent. New full contexts do not guarantee that every tuple of values is new.

**Table 6. Free generation before and after task-specific fact training.**
{.table-caption}

| Test | Before | After | Scope |
|---|---:|---:|---|
| New contexts, familiar values and wording | 0/72 | 72/72 | Learning within the domain |
| Longer contexts, up to 277 BPE tokens | 0/72 | 70/72 | Length transfer; training prompts have 80–179 tokens |
| Requested fact absent | 0/24 | 24/24 | Answering “I do not know” |
| New wording | 0/72 | 7/72 | Transfer beyond three training variants |
| All questions in contexts with reserved names | 0/72 | 48/72 | Familiar roles and colors alongside other names |
| Reserved-name questions only; subset of the preceding row | 0/24 | 0/24 | Reproducing a name outside task-training coverage |

![Fact-learning curve and frozen test results: 72/72 familiar-format contexts, 70/72 longer inputs and weak transfer to new wording](assets/contextual-facts.png "Figure 3. Fact training and frozen tests. Reserved names in the plot denotes the full 48/72 group; questions specifically asking for the reserved name yield 0/24.")

Both members of 36/36 familiar-format changed-fact pairs were answered correctly, as were 34/36 longer-context pairs. This establishes answer dependence on the target fact within the tested format.

Pip, Nell, Zed, Tess, Otto and Milo are excluded from the current training/validation sets and 4,096 rehearsal records. Earlier language learning and BPE training were not split by these names. “Reserved name” therefore describes the current task-training holdout, not a demonstrated first encounter with the spelling.

## 5. Execution Verification and Available Data {#en-verification}

Behavioral evaluation is supplemented by numerical checks. A small model supports comparison of all parameter gradients; the larger trained model supports sampled logit and generation comparisons. These scopes remain part of the interpretation.

**Table 7. Verification before and after the language experiment.**
{.table-caption}

| Object | Method | Result and scope |
|---|---|---|
| Small two-layer Mamba | Matched CPU/CUDA weights and inputs | Maximum logit difference 6.70 × 10⁻⁷; gradient difference 8.94 × 10⁻⁷ across 30 tensors |
| CE metric | Independent recomputation from logits | Difference up to 1.16 × 10⁻⁷ in the small probe |
| Causality and generation | Future-token changes; autoregressive steps versus full forward | Causality checked; eight tested argmax tokens agreed |
| Trained dialogue Mamba | CPU/CUDA on two 32-token prefixes | Maximum logit difference 1.3828 × 10⁻⁵; argmax agreed at 64 positions |
| Serialization and Windows inference | Fresh process and Linux-weight reload | CUDA CSV was byte-identical; Windows matched 64 argmax positions and selected real responses |
| Memory verification | Compute-sanitizer on the small gradient probe | Zero errors; large training was outside sanitizer |

Before the heavy CUDA experiment, 159 gradient ABI cases and 18,575 checked-optimizer assertions passed. A 256³ GEMM was compared with NumPy float64, giving a maximum absolute error of 1.40524409 × 10⁻⁶. These are specific numerical probes rather than exhaustive coverage of all sizes and models.

The fact scorer was checked with correct, incorrect and distractor-containing control answers. All 24,600 native corpus records were checked for text/token agreement, masks, padding and EOS; rebuilding 11 corpus files was byte-identical. Before/after responses were scored using the same current decoder.

This version includes [summary data](../assets/sonata-learning-report/results.json), [language-stage metrics](../assets/sonata-learning-report/language-metrics.csv), [dialogue-stage metrics](../assets/sonata-learning-report/dialogue-metrics.csv), [fact-training metrics](../assets/sonata-learning-report/grounding-metrics.csv) and [checksums of the supplied files](../assets/sonata-learning-report/artifact-checksums.json). In the raw CSV files, `train_batch` accuracy and supervised_tokens fields are zero placeholders, not measurements; loss and separate validation rows are used as recorded.

Sonata's source code is currently in a private repository. This version provides the protocol, tables, figures and metric files for external examination. Saved models were checked by reloading their weights in fresh processes; Adam and RNG state were not saved with them. The language pilot uses a decoder that recomputes the growing full prefix. A streaming cache, full training-state recovery and long memory testing require separate validation.

## 6. Discussion {#en-discussion}

The results show a progression from a simple nonlinear dependency to sequences, English text and contextual facts. Linear-network, shuffled-label and erased-symbol controls help relate behavior to the specified task. The length comparison shows that changing the training regime can substantially affect transfer.

With minimal fact-domain coverage, the familiar format was learned. Weak transfer to other names and wording motivates a further question: how does broader data diversity change performance while preserving a separate test? This experiment does not isolate the effects of corpus coverage, model capacity or training choices. Assigning one established cause would be premature.

Specialization also changed earlier language metrics: LIGHT PPL increased from 37.73 to 122.95 after fact training. LIGHT was not included in that stage's rehearsal data. Measuring a new skill should be accompanied by checks of previously acquired behavior.

CPU experiments use three initializations; the larger GPU experiments use one. Models trained from scratch have not yet been compared with an external architecture at matched data and compute budgets. The scope of this work is therefore learning and behavior in specific configurations, together with the stated execution-verification coverage.

## 7. References {#en-references}

1. Gu A., Dao T. [Mamba: Linear-Time Sequence Modeling with Selective State Spaces](https://arxiv.org/abs/2312.00752). Original Mamba research.
2. Feng S. Y., Goodman N. D., Frank M. C. [Is Child-Directed Speech Effective Training Data for Language Models?](https://aclanthology.org/2024.emnlp-main.1231/). EMNLP 2024. [TinyDialogues code and data](https://github.com/styfeng/TinyDialogues).
3. Urbanek J. et al. [Learning to Speak and Act in a Fantasy Text Adventure Game](https://arxiv.org/abs/1903.03094). [LIGHT project](https://parl.ai/projects/light/).
4. Kingma D. P., Ba J. [Adam: A Method for Stochastic Optimization](https://arxiv.org/abs/1412.6980). The optimization method implemented in Sonata's training path.
5. Zhang B., Sennrich R. [Root Mean Square Layer Normalization](https://arxiv.org/abs/1910.07467). The RMSNorm method.
6. Baydin A. G., Pearlmutter B. A., Radul A. A., Siskind J. M. [Automatic Differentiation in Machine Learning: a Survey](https://jmlr.org/papers/v18/17-468.html). JMLR, 2018. Mathematical and implementation background on automatic differentiation.
7. Gu A., Dao T. [Original Mamba implementation, version v2.2.4](https://github.com/state-spaces/mamba/blob/v2.2.4/mamba_ssm/modules/mamba_simple.py). Used for the specific parameterization comparison.
8. Sonata experiments: numerical summaries are supplied in results.json and file checksums in artifact-checksums.json. Archived figures retain the recorded measurements.

## Appendix A. Executing Pretrained Nemotron Weights {#en-runtime-appendix}

A separate line of work executes the `NVIDIA-Nemotron-3.5-Lightning-30B-A3B-NVFP4` checkpoint in Sonata, using NVIDIA's pretrained weights. The latest B3 stage ran 67 requests through all 52 layers, passing 20/20 application checks and six cache-reusing continuations. Intermediate model tensors and states remain on GPU; CPU execution is a separate complete backend.

**Table A1. Native decode on one A100 80 GB, batch 1.**
{.table-caption}

| Context | Previous native path, tokens/s | GPU-resident, tokens/s | Ratio |
|---:|---:|---:|---:|
| 512 | 10.40 | 30.22 | 2.90× |
| 2048 | 10.23 | 29.32 | 2.87× |
| 8192 | 9.88 | 26.10 | 2.64× |

There is one measured run per configuration after warmups. Throughput covers decode, excluding weight loading and prefill. At context 8192, prefill takes 56.936 s. Both paths use the same checkpoint, F32 storage and F64 attention; the gain combines residency and kernel changes. This comparison does not isolate the implementation language or CPU/GPU transport alone.

At the preceding stage, native execution and pinned vLLM both achieved 20/20 application results; generated IDs agreed on 21/21 quality/dialogue/repeat prompts. The external runtime is a behavioral witness, while Sonata's mathematical contract comes from the checkpoint and R_emu reference. vLLM was not rebenchmarked at B3; the preceding external measurements belong to a different GPU session and execution configuration.

A separate canonical F64 profile passes two full-depth R_emu diagnostic cases with logit normalized L2 up to 3.871 × 10⁻¹⁵. The original F32 profile still fails F1/F2/F4, leaving broader numerical acceptance open. These results concern execution of a pretrained model and do not compare the quality of our from-scratch Mamba with Nemotron.
