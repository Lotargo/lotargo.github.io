---
title: "Starting the development log"
date: "2026-06-28"
type: "Site architecture"
description: "A short note on why the portfolio now has a blog layer and how static pages can still feel alive."
---

# Starting the development log

A static portfolio can still feel alive when it has a place for small, dated updates and engineering notes.

This blog starts as a simple layer beside the landing page. The immediate goal is not a publishing platform with a heavy build pipeline. The goal is a quiet archive for decisions: what changed, why a project is shaped a certain way, what tradeoffs were accepted, and what should be inspected next.

Markdown source files live in `blog/content/`, rendered post pages live in `blog/posts/`, and images for future notes can live in `blog/assets/`. That keeps the public site easy to host on GitHub Pages while leaving room for a generator later.

The notification center on the landing page is part of the same idea: static data, but presented like a living product surface.
