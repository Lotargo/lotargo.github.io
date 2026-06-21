/*
  Bilingual portfolio projects database.
  Translatable fields contain object format { en: "...", ru: "..." }.
  Non-translatable or identical fields remain simple strings.
*/

window.PORTFOLIO_PROJECTS = [
  {
    title: "Sonata AI",
    index: "01",
    category: "AI",
    status: {
      en: "Closed-core research / public evidence dossier",
      ru: "Исследование с закрытым кодом / публичное досье"
    },
    description: {
      en: "Custom low-level AI research platform presented through a public evidence archive: runtime notes, benchmarks, limitations, and claim boundaries.",
      ru: "Собственная низкоуровневая платформа исследований ИИ, представленная через публичный архив: примечания к рантайму, бенчмарки, ограничения и границы возможностей."
    },
    proof: {
      en: "Evidence dossier, technical notes, benchmark-oriented public page",
      ru: "Досье результатов, технические заметки, публичная страница бенчмарков"
    },
    stack: {
      en: "Free Pascal, x86-64 Assembly, CUDA C++, custom runtime",
      ru: "Free Pascal, ассемблер x86-64, CUDA C++, собственный рантайм"
    },
    image: "./assets/img/sonata.png",
    landingUrl: "https://lotargo.github.io/public_sonata_ai_landing/",
    repoUrl: "https://github.com/Lotargo/public_sonata_ai_landing"
  },
  {
    title: "Nexus API Balancer",
    index: "02",
    category: "INFRA",
    status: {
      en: "Public infrastructure project",
      ru: "Публичный инфраструктурный проект"
    },
    description: {
      en: "AI provider gateway and key balancer with routing, isolation, OpenAI-compatible behavior, and service architecture boundaries.",
      ru: "Шлюз и балансировщик ключей провайдеров ИИ с маршрутизацией, изоляцией, поведением в стиле OpenAI и архитектурными границами."
    },
    proof: {
      en: "Live landing, repository, infrastructure-oriented documentation",
      ru: "Работающий лендинг, репозиторий, инфраструктурная документация"
    },
    stack: "Rust, Tokio, Axum, SQLx, SQLite, JWT, Scalar",
    image: "./assets/img/nexus.png",
    landingUrl: "https://lotargo.github.io/Nexus_API_Balancer/",
    repoUrl: "https://github.com/Lotargo/Nexus_API_Balancer"
  },
  {
    title: "Academic Pipeline Engine",
    index: "03",
    category: "AGENTIC",
    status: {
      en: "Public local-first agentic workspace",
      ru: "Публичная локальная агентная среда"
    },
    description: {
      en: "Structured document generation workspace with artifact routing, reviewer loops, OCR/web research flow, exports, and reproducible pipelines.",
      ru: "Среда генерации структурированных документов с маршрутизацией артефактов, циклом рецензирования, поиском и OCR, экспортом и воспроизводимыми конвейерами."
    },
    proof: {
      en: "Live landing, repository, workflow documentation",
      ru: "Работающий лендинг, репозиторий, документация процессов"
    },
    stack: "Python, FastAPI, Next.js, React, TypeScript, SQLite, Docker",
    image: "./assets/img/academic_pipeline.png",
    landingUrl: "https://lotargo.github.io/Academic-Pipeline-Engine/",
    repoUrl: "https://github.com/Lotargo/Academic-Pipeline-Engine"
  },
  {
    title: "CSS-Server",
    index: "04",
    category: "RUNTIME",
    status: {
      en: "Public static runtime experiment",
      ru: "Публичный эксперимент статического рантайма"
    },
    description: {
      en: "Boundary test for static browser computation: DOM-as-memory, CSS evaluation layer, calculator proof module, and static runtime shell.",
      ru: "Тестирование лимитов статических вычислений в браузере: DOM-как-память, слой вычисления CSS, калькулятор и оболочка статического рантайма."
    },
    proof: {
      en: "Live landing, repository, browser-runtime proof module",
      ru: "Работающий лендинг, репозиторий, модуль подтверждения рантайма в браузере"
    },
    stack: "Rust, Tauri, HTML, CSS, SCSS, JavaScript, SQLite",
    image: "./assets/img/css_server.png",
    landingUrl: "https://lotargo.github.io/css-server/",
    repoUrl: "https://github.com/Lotargo/css-server"
  },
  {
    title: "ComfyUI Meta Viewer",
    index: "05",
    category: "UI",
    status: {
      en: "Public local-first tooling",
      ru: "Публичный локальный инструмент"
    },
    description: {
      en: "Local gallery and metadata manager for generated images, prompt extraction, workflow graph inspection, search, and persistent cache.",
      ru: "Локальная галерея и менеджер метаданных генераций: извлечение промптов, инспекция графа воркфлоу, поиск и кэширование."
    },
    proof: {
      en: "Live landing, repository, gallery interface",
      ru: "Работающий лендинг, репозиторий, интерфейс галереи"
    },
    stack: "Python, Flask, SQLite, Pydantic, Pillow, Vanilla JS, Fuse.js",
    image: "./assets/img/comfyui_meta_viewer.png",
    landingUrl: "https://lotargo.github.io/ComfyUI-Meta-Viewer/",
    repoUrl: "https://github.com/Lotargo/ComfyUI-Meta-Viewer"
  },
  {
    title: "Necromancer",
    index: "06",
    category: "AI",
    status: {
      en: "Public experimental application",
      ru: "Публичное экспериментальное приложение"
    },
    description: {
      en: "Cyber-occult local AI chat system with retro CRT interface, PostgreSQL history, provider balancer, RAG/search tools, and atmospheric UI.",
      ru: "Кибероккультный локальный чат с ИИ: ретро-интерфейс на базе ЭЛТ, история в PostgreSQL, балансировщик провайдеров, RAG/инструменты поиска и атмосферный дизайн."
    },
    proof: {
      en: "Live landing, repository, stylized working interface",
      ru: "Работающий лендинг, репозиторий, стилизованный рабочий интерфейс"
    },
    stack: "Free Pascal, PHP, Lua/LuaJIT, PostgreSQL, Docker, JS, Canvas",
    image: "./assets/img/necromancer.png",
    landingUrl: "https://lotargo.github.io/Necromancer/",
    repoUrl: "https://github.com/Lotargo/Necromancer"
  },
  {
    title: "Verification Lab",
    index: "07",
    category: "VERIFY",
    status: {
      en: "Public reproducibility lab",
      ru: "Публичная лаборатория воспроизводимости"
    },
    description: {
      en: "Verification-oriented experiments around retrieval integrity, analytical correctness, adversarial rejection, singular states, and SAT-style checks.",
      ru: "Эксперименты по верификации: целостность поиска, аналитическая корректность, фильтрация состязательных промптов и SAT-проверки."
    },
    proof: {
      en: "Repository, reports, reproducibility packs",
      ru: "Репозиторий, отчеты, пакеты для воспроизведения результатов"
    },
    stack: {
      en: "Python, symbolic checks, numerical verification, SAT/DPLL/CDCL",
      ru: "Python, символьные проверки, численная верификация, SAT/DPLL/CDCL"
    },
    image: "",
    landingUrl: "https://github.com/Lotargo/verification-lab-1",
    repoUrl: "https://github.com/Lotargo/verification-lab-1"
  },
  {
    title: "Search Routers",
    index: "08",
    category: "RUNTIME",
    status: {
      en: "Proof of concept",
      ru: "Концепт (Proof of concept)"
    },
    description: {
      en: "Minimal two-stage LLM routing pipeline implemented with low-level constraints to test how little runtime support is needed for routing logic.",
      ru: "Минималистичный двухэтапный конвейер маршрутизации LLM, реализованный в жестких рамках с целью проверки минимально необходимых ресурсов."
    },
    proof: {
      en: "Repository, architecture probe, unusual implementation stack",
      ru: "Репозиторий, исследование архитектуры, нестандартный стек реализации"
    },
    stack: {
      en: "Free Pascal, x86-64 Assembly, Groq API, curl/OpenSSL",
      ru: "Free Pascal, ассемблер x86-64, Groq API, curl/OpenSSL"
    },
    image: "",
    landingUrl: "https://github.com/Lotargo/Search_Routers",
    repoUrl: "https://github.com/Lotargo/Search_Routers"
  },
  {
    title: "The Living Bunker",
    index: "09",
    category: "AGENTIC",
    status: {
      en: "Active prototype",
      ru: "Активный прототип"
    },
    description: {
      en: "Observable multi-agent society sandbox for roles, asymmetric perception, constrained communication, repeatable scenarios, and emergent behavior.",
      ru: "Песочница симуляции мультиагентного сообщества с ролями, асимметричным восприятием, ограниченной коммуникацией и эмерджентным поведением."
    },
    proof: {
      en: "Repository, prototype description, agent-sandbox structure",
      ru: "Репозиторий, описание прототипа, структура песочницы агентов"
    },
    stack: "Python, Flask, TypeScript/JavaScript, Groq, Cerebras, Pillow, pytest",
    image: "",
    landingUrl: "https://github.com/Lotargo/The-Living-Bunker",
    repoUrl: "https://github.com/Lotargo/The-Living-Bunker"
  }
];
