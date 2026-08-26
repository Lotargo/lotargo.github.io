/*
  Bilingual portfolio projects database.
  Translatable fields contain object format { en: "...", ru: "..." }.
  Non-translatable or identical fields remain simple strings.
*/

window.PORTFOLIO_PROJECTS = [
  {
    "title": "Sonata AI",
    "index": "01",
    "category": "AI",
    "status": {
      "en": "Research platform / public technical dossier",
      "ru": "Исследовательская платформа / публичное техническое досье"
    },
    "description": {
      "en": "An experiment in building low-level AI systems without leaning on a ready-made ML runtime. The public side gathers architecture notes, experimental results, benchmarks, and known limitations.",
      "ru": "Эксперимент с низкоуровневой реализацией ИИ-систем без привычной зависимости от готового ML-рантайма. Публичная часть проекта собирает архитектурные заметки, результаты экспериментов, бенчмарки и известные ограничения."
    },
    "proof": {
      "en": "Technical dossier, notes, test results, and benchmarks",
      "ru": "Техническое досье, заметки, результаты тестов и бенчмарков"
    },
    "stack": {
      "en": "Free Pascal, x86-64 Assembly, CUDA C++, custom runtime",
      "ru": "Free Pascal, ассемблер x86-64, CUDA C++, собственный runtime"
    },
    "image": "./assets/img/sonata.png",
    "landingUrl": "https://lotargo.github.io/public_sonata_ai_landing/",
    "repoUrl": "https://github.com/Lotargo/public_sonata_ai_landing"
  },
  {
    "title": "memory_plugin",
    "index": "02",
    "category": "RAG",
    "status": {
      "en": "Open source / local tools for AI coding agents",
      "ru": "Open-source / локальные инструменты для AI coding agents"
    },
    "description": {
      "en": "Memory and context for coding agents that would otherwise forget everything between sessions. It combines persistent notes, hybrid RAG, persona settings, and repository-aware context while staying local and portable across multiple CLI clients.",
      "ru": "Память и контекст для coding agents, которые обычно забывают всё между сессиями. Проект объединяет постоянные заметки, гибридный RAG, настройки персоны и контекст репозитория, сохраняя данные локально и оставаясь переносимым между несколькими CLI-клиентами."
    },
    "proof": {
      "en": "Live landing, npm package, public repository, documentation, and tests",
      "ru": "Рабочий лендинг, npm-пакет, публичный репозиторий, документация и тесты"
    },
    "stack": "Node.js, MCP, SQLite FTS5, local embeddings, Turso",
    "image": "./assets/img/memory_plugin.webp",
    "landingUrl": "https://lotargo.github.io/memory_plugin/",
    "repoUrl": "https://github.com/Lotargo/memory_plugin"
  },
  {
    "title": "3D Face Reconstruction",
    "index": "03",
    "category": "3D",
    "status": {
      "en": "R&D prototype / browser 3D demo",
      "ru": "R&D-прототип / браузерное 3D-демо"
    },
    "description": {
      "en": "An attempt to turn a few ordinary smartphone photos into a head asset ready for further work: geometry reconstruction, UVs, textures, material masks, mesh diagnostics, and a browser viewer.",
      "ru": "Попытка превратить несколько обычных фотографий со смартфона в пригодный для дальнейшей работы трёхмерный ассет головы: от реконструкции геометрии и UV до текстур, масок материалов, диагностики mesh и просмотра результата прямо в браузере."
    },
    "proof": {
      "en": "Three.js demo, GLB/OBJ/PLY export, reconstruction pipeline, diagnostics, and research notes",
      "ru": "Three.js-демо, экспорт GLB/OBJ/PLY, pipeline реконструкции, диагностика и исследовательские заметки"
    },
    "stack": "Python, PyTorch, DECA, FLAME2023, Three.js, GLB/OBJ/PLY",
    "image": "./assets/img/3d_face_reconstruction.png",
    "landingUrl": "https://lotargo.github.io/3D_Face_Reconstruction/",
    "repoUrl": "https://github.com/Lotargo/3D_Face_Reconstruction"
  },
  {
    "title": "Nexus API Balancer",
    "index": "04",
    "category": "INFRA",
    "status": {
      "en": "Infrastructure project",
      "ru": "Инфраструктурный проект"
    },
    "description": {
      "en": "A gateway between an application and multiple AI providers, where routing, keys, and model selection stop being every client's problem. Priorities, isolation, balancing, and an OpenAI-compatible interface live in one infrastructure layer.",
      "ru": "Шлюз между приложением и несколькими AI-провайдерами, где маршрутизация, ключи и модели перестают быть заботой каждого отдельного клиента. Приоритеты, изоляция, балансировка и OpenAI-совместимый интерфейс собраны в отдельный инфраструктурный слой."
    },
    "proof": {
      "en": "Live landing, repository, and architecture documentation",
      "ru": "Рабочий лендинг, репозиторий и архитектурная документация"
    },
    "stack": "Rust, Tokio, Axum, SQLx, SQLite, JWT, Scalar",
    "image": "./assets/img/nexus.png",
    "landingUrl": "https://lotargo.github.io/Nexus_API_Balancer/",
    "repoUrl": "https://github.com/Lotargo/Nexus_API_Balancer"
  },
  {
    "title": "Academic Pipeline Engine",
    "index": "05",
    "category": "AGENTIC",
    "status": {
      "en": "Local agentic workspace",
      "ru": "Локальная агентная среда"
    },
    "description": {
      "en": "A workspace for jobs where one model call is not enough: gather material, research, write a document, review it, and produce a finished file. Inside are artifact routing, a Writer/Reviewer loop, OCR, web research, and a reproducible document pipeline.",
      "ru": "Рабочее пространство для задач, где одного запроса к модели недостаточно: нужно собрать материалы, провести исследование, написать документ, проверить результат и получить готовый файл. Внутри — маршрутизация артефактов, Writer/Reviewer-контур, OCR, web research и воспроизводимый pipeline генерации документов."
    },
    "proof": {
      "en": "Live landing, repository, and workflow documentation",
      "ru": "Рабочий лендинг, репозиторий и документация процессов"
    },
    "stack": "Python, FastAPI, Next.js, React, TypeScript, SQLite, Docker",
    "image": "./assets/img/academic_pipeline.png",
    "landingUrl": "https://lotargo.github.io/Academic-Pipeline-Engine/",
    "repoUrl": "https://github.com/Lotargo/Academic-Pipeline-Engine"
  },
  {
    "title": "CSS-Server",
    "index": "06",
    "category": "RUNTIME",
    "status": {
      "en": "Browser runtime experiment",
      "ru": "Эксперимент с браузерным runtime"
    },
    "description": {
      "en": "The question was simple: how far can CSS go if it is used not only to style a page, but as part of the computation itself? The result became an experiment with DOM as memory, a CSS evaluation layer, and a static runtime shell.",
      "ru": "Вопрос был довольно простой: насколько далеко можно зайти, если использовать CSS не только для оформления страницы, но и как часть вычислительного механизма? Из этого вырос эксперимент с DOM как памятью, CSS evaluation layer и статической runtime-оболочкой."
    },
    "proof": {
      "en": "Live demo, repository, and browser-runtime proof module",
      "ru": "Рабочее демо, репозиторий и proof-модуль браузерного runtime"
    },
    "stack": "Rust, Tauri, HTML, CSS, SCSS, JavaScript, SQLite",
    "image": "./assets/img/css_server.png",
    "landingUrl": "https://lotargo.github.io/css-server/",
    "repoUrl": "https://github.com/Lotargo/css-server"
  },
  {
    "title": "ComfyUI Meta Viewer",
    "index": "07",
    "category": "UI",
    "status": {
      "en": "Local tool",
      "ru": "Локальный инструмент"
    },
    "description": {
      "en": "A gallery for ComfyUI images that sees more than the image itself: prompts, metadata, workflow graph, generation settings, and local history. Instead of another folder with thousands of PNGs, it becomes an actual place to browse and search.",
      "ru": "Галерея для изображений из ComfyUI, которая умеет видеть за картинкой больше самой картинки: промпты, метаданные, workflow-граф, параметры генерации и локальную историю. Вместо очередной папки с тысячами PNG получается нормальное пространство для просмотра и поиска."
    },
    "proof": {
      "en": "Live landing, public repository, and gallery interface",
      "ru": "Рабочий лендинг, публичный репозиторий и интерфейс галереи"
    },
    "stack": "Python, Flask, SQLite, Pydantic, Pillow, Vanilla JS, Fuse.js",
    "image": "./assets/img/comfyui_meta_viewer.png",
    "landingUrl": "https://lotargo.github.io/ComfyUI-Meta-Viewer/",
    "repoUrl": "https://github.com/Lotargo/ComfyUI-Meta-Viewer"
  },
  {
    "title": "Necromancer",
    "index": "08",
    "category": "AI",
    "status": {
      "en": "Experimental application",
      "ru": "Экспериментальное приложение"
    },
    "description": {
      "en": "A local AI chat that was allowed to have a personality of its own. Behind the retro CRT interface are PostgreSQL history, provider balancing, RAG, search, and several languages joined into one slightly strange but working system.",
      "ru": "Локальный AI-чат, которому захотелось дать собственный характер. За ретро-CRT интерфейсом скрываются история в PostgreSQL, балансировка провайдеров, RAG, поиск и несколько языков, соединённых в одну немного странную, но работающую систему."
    },
    "proof": {
      "en": "Live landing, repository, and a fully stylized working interface",
      "ru": "Рабочий лендинг, репозиторий и полноценный стилизованный интерфейс"
    },
    "stack": "Free Pascal, PHP, Lua/LuaJIT, PostgreSQL, Docker, JavaScript, Canvas",
    "image": "./assets/img/necromancer.png",
    "landingUrl": "https://lotargo.github.io/Necromancer/",
    "repoUrl": "https://github.com/Lotargo/Necromancer"
  },
  {
    "title": "Verification Lab",
    "index": "09",
    "category": "VERIFY",
    "status": {
      "en": "Reproducibility lab",
      "ru": "Лаборатория воспроизводимости"
    },
    "description": {
      "en": "Some experiments are more interesting for how well they can disprove a hypothesis than for confirming it. This collection covers retrieval integrity, analytical correctness, edge states, and SAT-style checks with reproducible scenarios.",
      "ru": "Некоторые эксперименты интереснее не тем, что подтверждают гипотезу, а тем, насколько хорошо способны её опровергнуть. Здесь собраны проверки retrieval-pipeline, аналитической корректности, пограничных состояний и SAT-задач с воспроизводимыми сценариями."
    },
    "proof": {
      "en": "Repository, reports, and reproducibility packs",
      "ru": "Репозиторий, отчёты и пакеты для повторной проверки результатов"
    },
    "stack": {
      "en": "Python, symbolic checks, numerical verification, SAT/DPLL/CDCL",
      "ru": "Python, символьные проверки, численная верификация, SAT/DPLL/CDCL"
    },
    "image": "",
    "landingUrl": "https://github.com/Lotargo/verification-lab-1",
    "repoUrl": "https://github.com/Lotargo/verification-lab-1"
  },
  {
    "title": "Search Routers",
    "index": "10",
    "category": "RUNTIME",
    "status": {
      "en": "Proof of concept",
      "ru": "Proof of Concept"
    },
    "description": {
      "en": "A small experiment asking how much infrastructure simple LLM routing really needs. The two-stage route was deliberately built with an unusually low-level stack to strip away ready-made abstractions and see what remains.",
      "ru": "Небольшой эксперимент о том, сколько на самом деле нужно инфраструктуры для простого LLM-routing. Двухэтапный маршрут был специально реализован в необычно низкоуровневом стеке, чтобы убрать как можно больше готовых абстракций и посмотреть, что останется."
    },
    "proof": {
      "en": "Repository, architecture description, and experimental implementation",
      "ru": "Репозиторий, описание архитектуры и экспериментальная реализация"
    },
    "stack": {
      "en": "Free Pascal, x86-64 Assembly, Groq API, curl/OpenSSL",
      "ru": "Free Pascal, ассемблер x86-64, Groq API, curl/OpenSSL"
    },
    "image": "",
    "landingUrl": "https://github.com/Lotargo/Search_Routers",
    "repoUrl": "https://github.com/Lotargo/Search_Routers"
  },
  {
    "title": "The Living Bunker",
    "index": "11",
    "category": "AGENTIC",
    "status": {
      "en": "Active prototype",
      "ru": "Активный прототип"
    },
    "description": {
      "en": "A sandbox where several AI agents share one world but see it differently, know different things, and cannot freely exchange every piece of information. The interesting part is not one agent in isolation, but the behavior that appears between them.",
      "ru": "Песочница, где несколько AI-агентов существуют в общем мире, но видят его по-разному, знают не всё и не могут свободно обмениваться любой информацией. Главный интерес здесь не в отдельном агенте, а в поведении, которое появляется между ними."
    },
    "proof": {
      "en": "Repository, prototype description, and reproducible scenarios",
      "ru": "Репозиторий, описание прототипа и воспроизводимые сценарии"
    },
    "stack": "Python, Flask, TypeScript/JavaScript, Groq, Cerebras, Pillow, pytest",
    "image": "",
    "landingUrl": "https://github.com/Lotargo/The-Living-Bunker",
    "repoUrl": "https://github.com/Lotargo/The-Living-Bunker"
  }
];
