# When Agent Memory Becomes Runtime State

Long-term memory for an AI agent stops being a list of saved facts surprisingly quickly. A small notebook is enough at first; then search appears, memory has to be separated by project, and eventually persistent instructions start changing not what the model knows, but how it behaves. At that point memory becomes part of the agent's runtime state — bringing new problems around isolation, reproducibility, and hidden dependencies along with the convenience.

![memory_plugin architecture](assets/01_hero_banner.avif "Local-first memory, hybrid RAG, and agent personalization as one runtime environment")

This article grew out of building [`@lotargo/memory_plugin`](https://github.com/Lotargo/memory_plugin), but it is not a feature tour. The more interesting path is the architectural transition itself: **notes → memory → RAG → persona → persistent agent state** — and what changes once an agent genuinely remembers across sessions.

## Memory is not chat history

The simplest long-term memory implementation is almost trivial: a text file where the user or agent keeps short notes.

```text
Project uses PostgreSQL.
Prefer concise answers.
Do not introduce abstractions without a concrete need.
```

At small scale this works extremely well. The records are human-readable, versionable, and cheap to maintain. The problem begins precisely when the memory becomes useful: useful records accumulate.

If every new session starts with the complete archive, long-term memory slowly turns into another way to saturate the context window. The fact that a model can technically accept a large context does not mean it should receive everything you know on every call.

![Project evolution](assets/02_project_evolution.avif "Evolution from a simple notebook to structured memory, RAG, persona, and shared agent state")

In `memory_plugin`, the path was incremental. A Notebook of short facts came first. Structured records and project scopes followed. Then detailed material needed retrieval. After that it became clear that descriptive facts and behavioral instructions should not be treated as the same kind of memory. The `fact` / `directive` distinction led naturally to persona as persistent cross-client state.

Each layer solved a limitation of the previous one rather than replacing it.

## Context budget: storing everything is not the same as sending everything

Two resources are often conflated: **the size of long-term storage** and **the size of the model's active context**.

The first can be effectively huge. The second is always finite, even when context windows are measured in hundreds of thousands of tokens. And this is not merely a token-price problem. A large noisy context makes it harder to distinguish the details that actually matter.

![Context budget reality](assets/09_context_budget_reality.avif "A large raw history competes with compact hot memory plus selective RAG retrieval")

A useful memory architecture therefore optimizes not for maximum prompt injection, but for **maximum availability with minimum active context**.

```text
store broadly
    ↓
keep high-signal state small
    ↓
retrieve relevant detail on demand
    ↓
expand the full source only when needed
```

That leads to the hot/cold split.

## Hot memory and Cold RAG

**Hot memory** is the small set of information worth keeping close almost all the time: architectural constraints, preferences, active agreements, stable user facts.

**Cold memory** contains decisions, investigations, long notes, handoffs, documents, reports, and experiment history. It should remain accessible without living in every prompt.

![Hot Memory vs Cold RAG](assets/03_hot_memory_vs_cold_rag.avif "Small always-on memory for high-signal context and a larger library retrieved through RAG on demand")

In practice these become different interfaces for the agent. In `memory_plugin`, a concise statement can live in the Notebook while a detailed investigation becomes a RAG Memory Note. Document retrieval combines SQLite FTS5/BM25 with local dense embeddings, and results can be discovered as a compact index, used as snippets, or expanded to the complete source.

The specific ranking algorithm is secondary to the contract:

> **Memory should be large. Active context should stay small.**

The agent's workflow changes accordingly. Instead of “remember everything,” it becomes: find the right source, verify its identity, then expand only the fragment or document needed now.

## Memory needs to know which project it belongs to

The next problem appears as soon as one agent is used across several repositories.

Suppose project A uses FastAPI and project B uses Django. If both are just records in one global notebook, the model has little structural reason not to carry a decision from one project into the other.

Long-term memory therefore needs not only retrieval, but **scope**.

```text
global
  ├── user preferences
  └── reusable knowledge

project A
  ├── architecture
  ├── decisions
  └── investigations

project B
  ├── architecture
  ├── decisions
  └── investigations
```

My implementation makes Git identity — primarily the normalized remote — more important than the absolute filesystem path. A repository can move to a different directory or machine and still resolve to the same logical memory.

This suggests an important rule: **`all` should not mean “everything this agent has ever seen.”** For a working agent, a safer interpretation is “global + current project.” Other projects should remain outside the retrieval boundary.

## Fact and Directive: knowledge and behavior are different things

Up to this point memory can still be described as a knowledge base. Then a record like this appears:

```text
Prefer concise answers and challenge unnecessary abstractions.
```

That is not a fact about the world or the project. It is an instruction the agent should actively apply.

![Fact vs Directive](assets/04_fact_vs_directive.avif "Facts describe context; directives configure active agent behavior")

The distinction is structural:

| Type | Question | Example |
| --- | --- | --- |
| `fact` | What does the agent know? | “The project uses PostgreSQL 16” |
| `directive` | How should the agent act? | “Inspect the existing architecture before adding abstractions” |

Both can share physical storage, but semantically merging them is dangerous. A fact should help the model interpret the task. A directive should become part of active configuration.

This is the point where ordinary persistent memory quietly becomes personalization.

## Persona is runtime state

The word *persona* is often reduced to cosmetics: “be friendly,” “talk like a pirate,” “use emoji.” That definition is too narrow for working agents.

Persistent directives can influence:

- degree of autonomy;
- preferred architectural style;
- explanation format;
- willingness to challenge assumptions;
- attitude toward risky changes;
- tool-use conventions;
- level of initiative;
- the communication pattern expected by a specific user.

![Persona as runtime state](assets/05_persona_as_runtime_state.avif "The same model can behave differently under different persistent profiles")

The model weights did not change. The provider did not change. The model version did not change. Yet the working behavior did.

That makes persona more useful to think of as **runtime state** than as a UI preference:

```text
output = f(model, prompt, tools, retrieved knowledge, persistent directives)
```

Removing the final argument can change the result as noticeably as changing the tool set or the system prompt.

This leads to the central distinction:

> **RAG answers what the agent knows. Persona shapes how it uses that knowledge.**

## How strongly can persistent directives affect behavior?

In practice the effect can be stronger than expected from a one-off system prompt. There is no mystery involved: a persistent instruction repeatedly becomes part of the agent's working norm and therefore shapes how later requests are interpreted.

Directives can influence how readily a model:

- asks for clarification instead of acting;
- selects a conservative strategy;
- challenges a user's assumption;
- chooses a cautious or refusal-oriented interpretation of an ambiguous request;
- continues an established working style without having the rules explained again.

This observation needs careful wording. **Persistent persona does not rewrite model weights and does not remove built-in safety mechanisms.** Higher-priority platform and safety instructions remain authoritative. Persistent context can, however, affect how ambiguous cases are interpreted and which of several allowed response strategies the model selects. The effect is simply easier to observe in models whose behavioral constraints are less rigidly expressed.

That is exactly why persistent personalization deserves the same engineering attention as other runtime components.

## Persistent persona has its own failure modes

Once an instruction survives a session, a mistake can survive the session too.

Possible failures include:

- a preference that is no longer current;
- conflicting directives;
- an accidental habit promoted into a durable rule;
- an excessively aggressive or cautious persona;
- an incorrect fact that continues influencing decisions;
- instruction poisoning through uncontrolled writes to long-term memory.

Persistent state therefore needs a lifecycle: stable identifiers, updates, superseding, deletion, scopes, and some way to explain **why a particular instruction is active now**.

“An agent that remembers everything” sounds attractive until it becomes very good at remembering what should have been forgotten.

## CLI as provider: the hidden runtime layer

Another problem became much easier to see once persistent persona existed.

Tools such as OpenCode or Codex are not always used interactively. A developer can place a CLI between an application and the LLM and use it as a ready-made provider/runtime layer: the CLI already handles accounts, models, tools, and agent execution.

The mental model is often:

```text
Application → CLI → Model
```

The real path can be much longer.

![Configuration bleed in CLI-as-Provider](assets/06_cli_provider_configuration_bleed.avif "Global plugins, MCP, skills, memory, and persona can silently become part of an application's runtime when a CLI is used as a provider")

```text
Application
    ↓
CLI runtime
    ├── global config
    ├── plugins
    ├── MCP servers
    ├── skills
    ├── prompts
    ├── memory
    └── persona
    ↓
Model
```

When the CLI runs inside the user's normal environment, all of this becomes **ambient agent state**: state that the application never declared directly but that still influences the output.

I think of the resulting effect as **Configuration Bleed in CLI-as-Provider Architectures**.

`memory_plugin` does not create this class of problem. It merely makes it easy to observe because memory and persona have visible behavioral effects. A global MCP server, skill, or user prompt can leak into the same runtime in exactly the same way.

## Agent state is a dependency even when it is absent from the lockfile

The application's visible dependency tree may look harmless:

```text
App
└── CLI runtime
```

The execution dependency tree is different.

![Agent State Is a Dependency](assets/08_agent_state_is_dependency.avif "Runtime behavior depends on hidden config, plugins, MCP, memory, and persona in addition to the CLI itself")

The uncomfortable part is that those dependencies may not appear in:

- `package.json`;
- `requirements.txt`;
- a lockfile;
- the Dockerfile;
- application source code.

A global plugin update or persona change can alter the behavior of an application that never imports that plugin.

From a reproducibility perspective, this is a real hidden dependency.

## Ambient state contaminates benchmarks

Consider a simple benchmark:

```text
Model A vs Model B
```

If Model A is reached through a CLI with accumulated memory, coding skills, and persona while Model B runs in a clean profile, the actual comparison is:

```text
Model A + Agent State A
        vs
Model B + Agent State B
```

It is easy to attribute the result to the model even though part of the advantage came from the environment.

Serious comparisons therefore benefit from a **clean-profile baseline**: a separate HOME/config directory, a fixed tool set, no personal memory, and every instruction explicitly recorded. Persistent state can then be added as its own experimental variable.

Otherwise the benchmark measures not just the model, but the life history of the CLI used to reach it.

## Production isolation: personal agent and provider are different environments

If a CLI becomes part of an application, it should get its own runtime profile.

![CLI runtime isolation](assets/07_cli_runtime_isolation.avif "A personal CLI keeps memory and persona while a provider CLI uses a minimal controlled configuration")

A minimal split can look like this:

```text
Personal CLI
HOME=/home/user
  memory
  persona
  skills
  plugins

Provider CLI
HOME=/isolated/provider
  minimal config
  required integration only
  no personal memory
  no global persona
```

Practical isolation options are familiar:

- separate `HOME` or config directory;
- separate CLI profile;
- separate system user;
- container;
- explicitly disabled global plugins, MCP servers, and skills;
- a minimal fixed environment for tests and production.

The broader point is to treat agent state with roughly the same care already given to credentials and environment variables. Personalization is not a defect — it is what gives the agent continuity. But continuity without boundaries becomes implicit coupling.

## From a stateless model to a persistent working environment

Long-term memory ultimately changes what we mean by “the agent.”

A stateless approximation is:

```text
agent ≈ model + prompt + tools
```

A persistent system is closer to:

```text
agent ≈ model
      + tools
      + hot memory
      + retrievable knowledge
      + project scope
      + persona/directives
      + runtime configuration
```

![Guiding principle](assets/10_guiding_principle.avif "RAG answers what the agent knows; persona shapes how that knowledge is used")

The conclusion I keep coming back to is simple:

**Memory provides continuity of knowledge. RAG provides selective access to that knowledge. Persona provides continuity of behavior. Isolation defines where that behavior is allowed to apply.**

That is the point where “LLM memory” stops being a convenient notebook and becomes part of runtime architecture.

[`@lotargo/memory_plugin`](https://github.com/Lotargo/memory_plugin) is one practical implementation of this idea: a local-first Notebook, hybrid RAG, project scopes, and persistent persona across multiple AI coding clients. But the principle is broader than any one project. As agent systems acquire more durable state, we can no longer afford to treat that state as an invisible UI preference.
