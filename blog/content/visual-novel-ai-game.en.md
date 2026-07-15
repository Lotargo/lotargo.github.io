---
slug: "visual-novel-ai-game"
lang: "en"
translation: "visual-novel-ai-game.ru.md"
title: "Visual Novel: Starting an AI Game That Breaks the Fourth Wall"
date: "2026-07-15"
type: "AI game development"
description: "A public concept note about an AI-powered game combining free dialogue, persistent memory, dynamic scenes, ComfyUI generation, and adaptive music."
assets:
  - "../assets/visual-novel-ai-game/images/main-menu.avif"
  - "../assets/visual-novel-ai-game/images/layered-apartment.avif"
  - "../assets/visual-novel-ai-game/images/layered-classroom.avif"
  - "../assets/visual-novel-ai-game/images/layered-park.avif"
  - "../assets/visual-novel-ai-game/images/cinematic-cafe.avif"
  - "../assets/visual-novel-ai-game/images/cinematic-rainy-city.avif"
  - "../assets/visual-novel-ai-game/images/cinematic-library.avif"
---

# Visual Novel: Starting an AI Game That Breaks the Fourth Wall

I have started designing a project at the boundary between an AI chat, a visual novel, and a stateful game. The player should feel that they entered a character's living space and continued a shared story, not that they opened another messenger window.

> The central object is not the message history. It is the current state of the scene.

*The illustrations below are early visual concepts generated specifically for this project.*

![AI-generated main menu concept](../assets/visual-novel-ai-game/images/main-menu.avif)

The character may remember previous visits, greet the player first, continue unfinished topics, move between locations, change clothing or mood, and offer contextual actions as buttons. All proactive behavior remains optional.

## Layered scenes

The ordinary mode uses reusable backgrounds, transparent character sprites, effects, dialogue, and choices. This keeps everyday interactions fast while allowing the location, outfit, pose, and expression to change independently.

![Evening apartment](../assets/visual-novel-ai-game/images/layered-apartment.avif)
![Classroom](../assets/visual-novel-ai-game/images/layered-classroom.avif)
![Park at sunset](../assets/visual-novel-ai-game/images/layered-park.avif)

The production pipeline may combine alpha generation, background removal, chroma key as a fallback, Canvas or WebGL compositing, edge cleanup, color matching, and character LoRA adapters.

## Cinematic scenes

Important moments switch to a complete CG mode where ComfyUI generates the character and environment together. Dialogue, choices, music, and world state continue while the generated frame remains active.

![Evening cafe](../assets/visual-novel-ai-game/images/cinematic-cafe.avif)
![Rainy neon city](../assets/visual-novel-ai-game/images/cinematic-rainy-city.avif)
![Quiet library](../assets/visual-novel-ai-game/images/cinematic-library.avif)

## Architecture and plans

A scene director works alongside the dialogue model. The model proposes a structured `scene_patch`, while deterministic code validates memory, location, outfit, visual updates, music, and transitions.

Music is part of the scene state, not background filler. Character and location themes may have calm, evening, tense, romantic, and cinematic variations.

The first prototype will compare a Tauri + Svelte + Canvas/WebGL route with a Godot-based route. The same core should eventually support local, hybrid, and cloud AI execution.

Development is divided into three phases: a polished visual MVP, a full game and scene engine, and preparation for desktop/Steam and web distribution.

The project repository will remain private. Public progress will appear as periodic blog articles with interface iterations, architecture notes, generated concepts, short demonstrations, technical experiments, and conclusions from failed approaches.
