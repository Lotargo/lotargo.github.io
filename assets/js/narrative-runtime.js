(function () {
  const grid = document.querySelector('[data-js="project-grid"]');

  function relabelProjectDetails() {
    const ru = document.documentElement.lang === 'ru';
    const label = ru ? 'Материалы: ' : 'Materials: ';

    document.querySelectorAll('.card-proof').forEach((element) => {
      const current = element.textContent || '';
      const value = current.replace(/^(?:Proof|Подтверждение|Materials|Материалы):\s*/i, '');
      const next = label + value;
      if (current !== next) element.textContent = next;
    });
  }

  relabelProjectDetails();

  if (grid) {
    new MutationObserver(relabelProjectDetails).observe(grid, {
      childList: true,
      subtree: true
    });
  }

  new MutationObserver((mutations) => {
    if (mutations.some((mutation) => mutation.attributeName === 'lang')) {
      queueMicrotask(relabelProjectDetails);
    }
  }).observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['lang']
  });
})();
