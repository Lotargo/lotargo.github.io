---
slug: "testing-web-app-ai-sandbox"
lang: "en"
translation: "testing-web-app-ai-sandbox.ru.md"
title: "Coding Without Codex: How Far Regular ChatGPT Can Go"
date: "2026-07-10"
type: "AI-assisted development"
description: "A practical experiment in how much real repository work, backend testing, and browser verification can be done in regular ChatGPT Chat without spending the shared Codex and ChatGPT Work agentic allowance."
---

# Coding Without Codex: How Far Regular ChatGPT Can Go

ChatGPT at `chatgpt.com` is usually treated as a general assistant: discuss architecture, explain an error, generate a small code fragment. For serious repository work, people tend to open Codex because it provides the familiar agentic tools, a working tree, a terminal, and an interface closer to an IDE.

That habit has a cost. Codex and the newer ChatGPT Work experience draw from the same agentic usage pool. Regular Chat messages are accounted for separately and are available in a much broader volume on paid personal plans. That creates a practical question:

> How far can software development go inside regular ChatGPT Chat without starting Codex or Work?

This article is about that experiment. Not Codex, not Work, and not a local agent inside an IDE. I used ordinary ChatGPT Chat, a GitHub connector, the file sandbox, and the execution tools available there.

## Three product surfaces that are easy to confuse

As of July 2026, the boundary looks like this:

- **ChatGPT Chat** is the normal conversation surface. It can use connected apps and plugins, read data from external services, perform permitted actions, work with files, and use the built-in sandbox.
- **ChatGPT Work** is a separate experience for longer research and deliverable-oriented tasks.
- **Codex** is the specialized coding agent for writing, reviewing, and shipping code through ChatGPT, IDE integrations, and the CLI.

OpenAI explicitly states that Codex, ChatGPT Work, and several other agentic products use the same agentic usage pool. Regular Chat messages are separate; Plus and Pro list messages and interactions as unlimited, subject to abuse guardrails.

This does not mean Chat replaces Codex. It means there is a large, underestimated space between “talk about code” and “launch a full coding agent.”

## Why regular Chat can do more than give advice

Through the connected GitHub app, ChatGPT can do more than read a pasted snippet. Depending on permissions, it can:

- read repository files;
- inspect commits and diffs;
- create and update files;
- write changes to a branch;
- work with project documentation, tasks, and structure;
- bring files into the sandbox for local analysis;
- execute Python and system commands in an isolated environment.

That makes regular Chat capable of handling a substantial set of bounded tasks:

- preparing `AGENTS.md`, plans, and skills;
- code review;
- targeted fixes;
- creating small modules;
- writing unit tests;
- analyzing test output;
- updating README files and technical documentation;
- working with GitHub without manually copying files.

The limits remain real. Chat does not gain access to the user's hardware, local IDE, or unrestricted network, and it may not be able to run Docker. But most small and medium tasks do not require those things.

## The experiment: Link Saver in regular Chat

The test project was a small Link Saver:

- Node.js and Express on the backend;
- plain HTML, CSS, and JavaScript on the frontend;
- a JSON file for persistence;
- `node:test` for tests;
- a GitHub connector for repository access.

The goal was exploratory. I asked ChatGPT in regular Chat mode to obtain the code, run every available verification step, and determine how close it could get to real browser-to-server E2E.

## First boundary: a GitHub connector is not `git clone`

The GitHub connector works well with the remote repository, but it does not necessarily expose a one-click operation that materializes the entire repository into the sandbox filesystem.

A direct `git clone` also failed because the terminal could not resolve `github.com`. The local copy had to be assembled from files read through the connector's separate trusted channel.

```text
GitHub connector access != network access from the runtime
```

This distinction matters. ChatGPT's GitHub integration and the container's outbound network are separate access surfaces.

## Second boundary: the runtime exists, but the dependency network may not

Node.js was present in the sandbox, but `pnpm` and a ready `node_modules` directory were not. Corepack existed, yet it could not download the package manager or dependencies from the npm registry.

The backend therefore split into two categories.

Code using only the Node.js standard library could run immediately:

- URL validation;
- JSON storage;
- filesystem operations;
- creating and deleting records;
- checking that data survives reinitialization.

Parts that depended on external packages could not start without preparation:

- the Express application;
- Express routes;
- the npm HTML parser.

So backend testing is available in regular Chat. The exact boundary is set by the sandbox contents and dependency availability, not by the Chat surface itself.

## Third boundary: Chromium exists, but localhost may be closed

The environment contained Chromium and Playwright. The headless browser launched, executed JavaScript, exposed the DOM, computed CSS, and produced screenshots.

Direct navigation to local addresses was blocked:

```text
http://127.0.0.1:<port>/
http://localhost:<port>/
http://0.0.0.0:<port>/
file:///.../index.html
```

Chromium returned:

```text
net::ERR_BLOCKED_BY_ADMINISTRATOR
```

The same local HTTP server still answered through `curl`. The application was running; the block existed specifically at the browser-navigation policy layer.

## What can actually be verified in Chat

| Layer | Status | Verification path |
| --- | --- | --- |
| Pure backend logic | Available | `node --test`, temporary directories, mock `fetch` |
| JSON persistence | Available | Real sandbox filesystem |
| Local HTTP server | Available | Node `fetch`, `curl`, API test client |
| Frontend DOM and CSS | Available | `page.setContent()` |
| Frontend JavaScript | Available | Load the real `app.js` in Playwright |
| Browser screenshots | Available | Headless Chromium |
| Direct `page.goto(localhost)` | Blocked | Environment policy |
| Installing npm packages | Depends on cache and network | Registry was unavailable in this experiment |
| Real browser-to-server E2E | Not directly available | Requires a bridge or an external CI environment |

The most useful finding was `page.setContent()`. HTML can be read from disk and injected directly into Chromium, then the real CSS and JavaScript can be attached. Playwright can still:

- locate elements;
- click buttons;
- fill inputs;
- inspect form states;
- read computed styles;
- collect console errors;
- take screenshots.

That is already real frontend verification, not merely “ChatGPT wrote some code,” even though the browser cannot navigate directly to localhost.

## Bridging the browser to the real backend

There is no need to break the administrative policy. The missing network hop can be replaced with an architectural adapter:

```text
Playwright page
    -> window.fetch adapter
    -> page.exposeFunction()
    -> Node.js fetch
    -> real Express API
    -> JSON storage
```

The browser calls an overridden `window.fetch`. The request crosses into Node.js through `page.exposeFunction()`. Node then calls the real Express server and returns the response to the page.

This is not strict 100% E2E because Node, not Chromium, performs the HTTP hop. Functionally, however, it verifies:

- the real frontend code;
- the real backend;
- persistence;
- DOM and user interactions;
- loading, error, delete, and favourite flows.

The final route, `Chromium -> localhost -> Express`, can be left to GitHub Actions, WSL, Codespaces, or a local machine.

## When regular Chat is enough

Chat is a good fit when a task is bounded and can be decomposed into verifiable steps:

- documentation and architecture work;
- a small feature or fix;
- code review and regression analysis;
- unit and API tests;
- static frontend work;
- GitHub operations through a connector;
- analysis of files, logs, and test output;
- artifacts that do not require full local infrastructure.

Codex is the better choice when the work needs:

- long autonomous operation across a large code tree;
- a familiar IDE or CLI environment;
- parallel agents and worktrees;
- complex refactors and migrations;
- active dependency installation;
- local tools and a developer browser;
- a multi-step task where constant manual steering costs more than the agentic allowance.

Work is useful for long research and deliverable tasks where the agent needs to assemble a substantial final result independently.

The key distinction is not whether code is involved. It is how much autonomy and infrastructure the task requires.

## Why OpenAI has an unusual product combination here

This is not a claim that other companies' models are worse at coding. The point is the product combination.

A single regular ChatGPT conversation can combine:

- a strong reasoning model;
- an almost inexhaustible message allowance for normal Plus or Pro use;
- GitHub and other connected apps with read and write actions;
- a file sandbox;
- code execution;
- a browser runtime and screenshots;
- writing changes back to the repository.

Google AI Studio offers a powerful playground, code execution, Google Search, URL Context, Computer Use, and File Search. But it is a different workflow. Google's official documentation describes AI Studio primarily as an environment for prototyping with the Gemini API, while custom integrations rely on function calling and execution in the user's own application. An equivalent ready-made GitHub repository connector with write actions is not listed among the built-in tools.

The official Gemini app is also capable, but its usage limits have a more visible effect on long iterative sessions. In my workflow, the combination of regular chat, connected apps, a sandbox, and a broad message allowance is therefore unusually strong in OpenAI's product.

This is a product-ergonomics assessment as of July 2026, not a permanent model ranking. Limits and product surfaces can change.

## A better verification ladder

Instead of one instruction such as “start the app and test it in the browser,” use several layers:

1. Unit tests for pure modules.
2. Backend integration through Node `fetch`.
3. Frontend browser tests with a mock API.
4. A browser-to-Node bridge with the real backend.
5. One true E2E check in an external environment.

A good AI assistant should not pretend that an unavailable check was completed. It should map the environment, run the maximum available verification, and leave only the genuinely impossible layer to external CI.

## Conclusion

Regular ChatGPT Chat is significantly underestimated as a development tool.

It is not the Codex IDE. It does not receive access to the user's Docker installation, GPU, or local terminal. The sandbox may have no network, and the browser may be forbidden from opening localhost.

Even with those limits, Chat can still:

- work with a real GitHub repository;
- write and update code;
- run pure backend tests;
- verify persistence;
- start local HTTP processes;
- inspect APIs through Node;
- execute frontend code in Chromium;
- assert DOM and CSS behavior;
- take screenshots;
- write the result back to the repository.

For a small or medium task, Codex is often convenient but not mandatory. A substantial part of development can happen in regular Chat, preserving the shared Work and Codex agentic allowance for the tasks that genuinely need an autonomous IDE-like environment.

## Sources

- [OpenAI: Using Codex with your ChatGPT plan](https://help.openai.com/en/articles/11369540-codex-in-chatgpt)
- [OpenAI: ChatGPT plans and feature limits](https://chatgpt.com/pricing/)
- [OpenAI: Apps in ChatGPT](https://help.openai.com/en/articles/11487775-connectors-in-chatgpt)
- [OpenAI: Codex](https://openai.com/codex/)
- [Google: Google AI Studio quickstart](https://ai.google.dev/gemini-api/docs/ai-studio-quickstart)
- [Google: Using Tools with Gemini API](https://ai.google.dev/gemini-api/docs/tools)
- [Google: Gemini Apps limits](https://support.google.com/gemini/answer/16275805)
