---
slug: "testing-web-app-ai-sandbox"
lang: "en"
translation: "testing-web-app-ai-sandbox.ru.md"
title: "The Browser Exists, but localhost Does Not: Testing a Web App Inside an AI Sandbox"
date: "2026-07-10"
type: "AI-assisted development"
description: "A practical look at what can actually be verified inside an AI sandbox when a GitHub connector is available, backend execution is partial, Chromium is installed, but browser navigation to localhost is blocked."
---

# The Browser Exists, but localhost Does Not: Testing a Web App Inside an AI Sandbox

Recently I decided to test not another framework, but the AI agent's working environment itself. The question was simple: if an agent can see a GitHub repository, work with files, and has a sandbox, can it start a web application and verify it in a browser on its own?

The answer was more interesting than a plain yes or no. The environment really did contain Node.js, Chromium, and Playwright. Local processes and HTTP servers could run. But direct browser navigation to `localhost`, `127.0.0.1`, and even `file://` was blocked by environment policy.

The main lesson is that having a browser does not automatically mean having full browser-to-server E2E. That does not make the sandbox useless. It only means verification should be split into layers, with each available channel used for the job it can actually perform.

## The starting point

The experiment used a small Link Saver:

- Node.js and Express on the backend;
- plain HTML, CSS, and JavaScript on the frontend;
- a JSON file for persistence;
- `node:test` for tests;
- a GitHub connector for reading and changing the repository.

I did not ask the agent to change the code. The task was purely exploratory: get the repository into the sandbox, start the server, and find out whether real browser verification was available.

## First boundary: a GitHub connector is not `git clone`

The connector is useful for working with the remote repository:

- reading files;
- retrieving commits and diffs;
- creating and updating files;
- writing changes back to a branch.

That does not necessarily mean the repository can be materialized into the sandbox filesystem with one operation.

A direct `git clone` also failed because the terminal could not resolve `github.com`. The local copy therefore had to be assembled from files read through the connector.

This distinction matters:

```text
GitHub connector access != network access from the runtime
```

An agent may reach the GitHub API through a separate trusted channel while the terminal itself still has no ordinary outbound internet access.

## Second boundary: the runtime exists, the dependency network does not

Node.js was present in the sandbox, but `pnpm` and a ready `node_modules` directory were not. Corepack existed, yet it could not download the package manager or dependencies from the npm registry because of network restrictions.

As a result, backend code split into two categories.

Modules using only the Node.js standard library could still run:

- URL validation;
- JSON storage;
- filesystem operations;
- creating and deleting records;
- checking that data survives reinitialization.

Parts depending on external packages could not be started immediately:

- the Express application;
- Express routes;
- the npm HTML parser.

The problem was not an inability to test backend code in general. The problem was only the absence of preinstalled external dependencies.

## Third boundary: Chromium is installed, navigation is forbidden

The environment contained Chromium and Python Playwright. The headless browser launched, JavaScript executed, and the DOM was available.

But attempts to open the following addresses all ended the same way:

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

This was not CORS, an Express failure, a missing server, or a Playwright error. A local static server answered requests through `curl`, but browser navigation itself was blocked by administrative policy.

Flags such as `--disable-web-security` or `--no-sandbox` are therefore unlikely to solve the problem. They control different security layers and do not necessarily override URL policy.

## What can still be verified

Once the capabilities were separated, the environment became much more useful.

| Layer | Status | Verification path |
| --- | --- | --- |
| Pure backend logic | Available | `node --test`, temporary directories, mock `fetch` |
| JSON persistence | Available | Real sandbox filesystem |
| Local HTTP server | Available | Node `fetch`, `curl`, API test client |
| Frontend DOM and CSS | Available | `page.setContent()` |
| Frontend JavaScript | Available | Load the real `app.js` in Playwright |
| Browser screenshots | Available | Headless Chromium |
| Direct `page.goto(localhost)` | Blocked | Environment policy |
| Installing npm packages | Unavailable without cache | No registry access |
| Real browser-to-server E2E | Not directly available | Requires a bridge or external CI environment |

The most useful finding was `page.setContent()`. HTML can be read from disk and injected directly into the browser, then CSS and JavaScript can be attached. Playwright can still:

- locate elements;
- click buttons;
- fill inputs;
- inspect form states;
- read computed styles;
- collect console errors;
- take screenshots.

So the frontend can still be tested almost fully if its network boundary is replaced with a controlled adapter.

## Architectural workaround instead of bypassing policy

The most interesting option is not to disable the administrative block, but to build a bridge between the browser and Node.js.

```text
Playwright page
    -> window.fetch adapter
    -> page.exposeFunction()
    -> Node.js fetch
    -> real Express API
    -> JSON storage
```

The browser never opens `localhost` and never sends the direct network request. The frontend calls an overridden `window.fetch`, which forwards the request into a Node.js function. Node then calls the real Express server and returns the result to the page.

A simplified version looks like this:

```js
await page.exposeFunction('__backendRequest', async ({ path, method, body }) => {
  const response = await fetch(`http://127.0.0.1:${port}${path}`, {
    method,
    body,
    headers: { 'content-type': 'application/json' }
  });

  return {
    status: response.status,
    body: await response.text()
  };
});

await page.evaluate(() => {
  window.fetch = async (input, options = {}) => {
    const url = new URL(input, 'http://link-saver.test');
    const result = await window.__backendRequest({
      path: `${url.pathname}${url.search}`,
      method: options.method || 'GET',
      body: options.body
    });

    return new Response(result.body, { status: result.status });
  };
});
```

This is not 100% E2E in the strict sense because Node, not Chromium, performs the network hop. But the functional value is high:

- the real frontend code runs;
- the real backend runs;
- real data is persisted;
- Playwright interacts with the real DOM;
- loading, errors, delete, and favourites can be checked;
- browser policy is not violated.

## A better verification ladder

Instead of one large instruction such as “start the app and test it in the browser,” I would use five layers.

### 1. Unit tests for pure modules

Test separately:

- URL parsing;
- title extraction;
- storage;
- deletion regressions;
- error mapping;
- state transformations.

### 2. Backend integration

Start the server on a random port and call it through Node `fetch` or the test runner's API client.

```text
node:test -> Node fetch -> Express -> storage
```

### 3. Frontend browser tests with a mock API

Load the HTML through `page.setContent()`, attach CSS and JavaScript, and replace `window.fetch` with predictable mock responses.

This is ideal for UI states without depending on the backend.

### 4. Browser-to-Node bridge

Connect the real frontend to the real backend through `page.exposeFunction()`.

This becomes an almost complete functional test of the whole system.

### 5. Real E2E in an external environment

Leave only the one check the sandbox fundamentally cannot perform to GitHub Actions, WSL, Codespaces, or a normal local machine:

```text
Chromium -> localhost -> Express -> persistence
```

The sandbox restrictions no longer block development. They only determine which layer performs each check.

## Why this matters for AI-assisted development

The question “does the agent have a browser?” is too coarse. Better questions are:

- can the browser launch;
- can it execute JavaScript;
- is `page.goto` allowed;
- is `localhost` reachable from the browser process;
- is `localhost` reachable from the Node process;
- can dependencies be installed;
- is a local package cache available;
- can the connector materialize a repository;
- can the agent take screenshots and perform DOM assertions.

This is not a binary capability. It is a capability matrix.

A good agent should not pretend to have completed full verification when the environment prevents it. It should:

1. identify the boundaries of the environment;
2. test each hypothesis separately;
3. run the maximum available verification;
4. record honestly what remains unverified;
5. move only the unavailable layer to an external environment.

## Conclusion

An AI sandbox can be much more capable than it first appears after an `ERR_BLOCKED_BY_ADMINISTRATOR` response.

Yes, direct browser-to-localhost E2E may be forbidden. A GitHub connector may not provide a local checkout. The package registry may be unreachable.

But the environment may still support:

- pure backend tests;
- persistence checks on a real filesystem;
- local HTTP processes;
- API verification through Node;
- frontend rendering in Chromium;
- JavaScript execution and DOM assertions;
- screenshots;
- a controlled bridge from the browser to the real backend.

The main mistake is treating the sandbox like an ordinary laptop with a browser. It is a different environment with separate access channels. Once those channels are mapped by layer, the restrictions stop being a dead end and become a normal architecture problem.