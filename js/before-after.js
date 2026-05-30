/* ═══════════════════════════════════════════════════════
   BEFORE / AFTER IMAGE SLIDER — curtain effect
   Drag the divider to reveal before/after
   ═══════════════════════════════════════════════════════ */

(function() {
  'use strict';

  function initSliders() {
    document.querySelectorAll('.ba-slider').forEach(container => {
      if (container.dataset.baInit) return;
      container.dataset.baInit = '1';

      const beforeImg = container.querySelector('.ba-before');
      const divider = container.querySelector('.ba-divider');
      const handle = container.querySelector('.ba-handle');
      
      if (!beforeImg || !divider || !handle) return;
      
      let dragging = false;
      let containerRect;

      function updatePosition(clientX) {
        containerRect = container.getBoundingClientRect();
        let x = clientX - containerRect.left;
        x = Math.max(0, Math.min(x, containerRect.width));
        const pct = (x / containerRect.width) * 100;
        
        beforeImg.style.clipPath = `inset(0 ${100 - pct}% 0 0)`;
        divider.style.left = pct + '%';
        handle.style.left = pct + '%';
      }

      // Mouse events
      handle.addEventListener('mousedown', (e) => {
        e.preventDefault();
        dragging = true;
        container.style.cursor = 'ew-resize';
        handle.style.cursor = 'grabbing';
      });

      window.addEventListener('mousemove', (e) => {
        if (!dragging) return;
        e.preventDefault();
        updatePosition(e.clientX);
      });

      window.addEventListener('mouseup', () => {
        if (!dragging) return;
        dragging = false;
        container.style.cursor = '';
        handle.style.cursor = '';
      });

      // Touch events
      handle.addEventListener('touchstart', (e) => {
        e.preventDefault();
        dragging = true;
        container.style.cursor = 'ew-resize';
        handle.style.cursor = 'grabbing';
      }, { passive: false });

      window.addEventListener('touchmove', (e) => {
        if (!dragging) return;
        e.preventDefault();
        updatePosition(e.touches[0].clientX);
      }, { passive: false });

      window.addEventListener('touchend', () => {
        if (!dragging) return;
        dragging = false;
        container.style.cursor = '';
        handle.style.cursor = '';
      });

      // Click on the container to quickly reposition
      container.addEventListener('click', (e) => {
        if (e.target === handle || handle.contains(e.target)) return;
        updatePosition(e.clientX);
      });

      // Arrow key navigation
      container.setAttribute('tabindex', '0');
      container.addEventListener('keydown', (e) => {
        containerRect = container.getBoundingClientRect();
        let currentLeft = parseFloat(divider.style.left) || 50;
        if (e.key === 'ArrowLeft') currentLeft = Math.max(0, currentLeft - 2);
        if (e.key === 'ArrowRight') currentLeft = Math.min(100, currentLeft + 2);
        if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
          e.preventDefault();
          beforeImg.style.clipPath = `inset(0 ${100 - currentLeft}% 0 0)`;
          divider.style.left = currentLeft + '%';
          handle.style.left = currentLeft + '%';
        }
      });

      // Initialize at 50/50
      beforeImg.style.clipPath = 'inset(0 50% 0 0)';
      divider.style.left = '50%';
      handle.style.left = '50%';
    });
  }

  // Init on load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSliders);
  } else {
    initSliders();
  }

  // Re-init after i18n language switch (DOM may change)
  window.addEventListener('langchange', () => {
    setTimeout(initSliders, 50);
  });

})();
