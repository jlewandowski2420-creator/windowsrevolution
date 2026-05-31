/* ═══════════════════════════════════════════════════════
   WINDOWS REVOLUTION — JavaScript
   Mobile nav · Lightbox · Gallery filter · Form validation
   ═══════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // ─── MOBILE NAV ───
  const hamburger = document.querySelector('.hamburger');
  const mainNav = document.querySelector('.main-nav');
  
  if (hamburger && mainNav) {
    hamburger.addEventListener('click', () => {
      const isOpen = mainNav.classList.toggle('open');
      hamburger.classList.toggle('open');
      hamburger.setAttribute('aria-expanded', isOpen);
    });

    // Close nav when clicking a link (mobile)
    mainNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('open');
        mainNav.classList.remove('open');
      });
    });

    // Close nav when clicking outside
    document.addEventListener('click', (e) => {
      if (!hamburger.contains(e.target) && !mainNav.contains(e.target)) {
        hamburger.classList.remove('open');
        mainNav.classList.remove('open');
      }
    });
  }

  // ─── ACTIVE NAV LINK ───
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.main-nav a').forEach(link => {
    const href = link.getAttribute('href') || '';
    if (href === currentPage || (currentPage === 'index.html' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  // ─── LIGHTBOX ───
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxClose = document.querySelector('.lightbox-close');
  const lightboxPrev = document.querySelector('.lightbox-prev');
  const lightboxNext = document.querySelector('.lightbox-next');
  
  let galleryImages = [];
  let currentIndex = 0;

  if (lightbox && lightboxImg) {
    // Collect all gallery images (use AFTER image for lightbox)
    document.querySelectorAll('.gallery-item').forEach((item, i) => {
      const imgs = item.querySelectorAll('img');
      const img = imgs[imgs.length - 1]; // use last (AFTER) image
      if (img) {
        galleryImages.push({ src: img.src, alt: img.alt });
        item.addEventListener('click', () => openLightbox(i));
        item.style.cursor = 'pointer';
      }
    });

    function openLightbox(index) {
      currentIndex = index;
      const img = galleryImages[index];
      lightboxImg.src = img.src;
      lightboxImg.alt = img.alt;
      lightbox.classList.add('open');
      document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
      lightbox.classList.remove('open');
      document.body.style.overflow = '';
    }

    function prevImage() {
      currentIndex = (currentIndex - 1 + galleryImages.length) % galleryImages.length;
      const img = galleryImages[currentIndex];
      lightboxImg.src = img.src;
      lightboxImg.alt = img.alt;
    }

    function nextImage() {
      currentIndex = (currentIndex + 1) % galleryImages.length;
      const img = galleryImages[currentIndex];
      lightboxImg.src = img.src;
      lightboxImg.alt = img.alt;
    }

    if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
    if (lightboxPrev) lightboxPrev.addEventListener('click', prevImage);
    if (lightboxNext) lightboxNext.addEventListener('click', nextImage);
    
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (!lightbox.classList.contains('open')) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') prevImage();
      if (e.key === 'ArrowRight') nextImage();
    });
  }

  // ─── GALLERY FILTER ───
  const filterBtns = document.querySelectorAll('.filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');

  if (filterBtns.length && galleryItems.length) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        const filter = btn.dataset.filter;
        
        galleryItems.forEach(item => {
          if (filter === 'all' || item.dataset.category === filter) {
            item.style.display = 'block';
          } else {
            item.style.display = 'none';
          }
        });

        // Rebuild gallery array for lightbox (use AFTER image)
        galleryImages = [];
        document.querySelectorAll('.gallery-item[style*="display: block"], .gallery-item:not([style*="display: none"])').forEach(item => {
          const imgs = item.querySelectorAll('img');
          const img = imgs[imgs.length - 1];
          if (img) galleryImages.push({ src: img.src, alt: img.alt });
        });
      });
    });
  }

  // ─── LANGUAGE SWITCHER ───
  // i18n is handled by js/i18n.js — loaded before main.js
  // The lang-switch buttons use data-lang attributes
  // and are wired up by the i18n engine on DOMContentLoaded

  // ─── CONTACT FORM ───
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;
      
      // Basic validation
      const name = contactForm.querySelector('#name')?.value.trim();
      const email = contactForm.querySelector('#email')?.value.trim();
      const phone = contactForm.querySelector('#phone')?.value.trim();
      const message = contactForm.querySelector('#message')?.value.trim();
      
      if (!name || !email || !phone || !message) {
        showFormMessage('Vul alle verplichte velden in.', 'error');
        return;
      }
      
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        showFormMessage('Voer een geldig e-mailadres in.', 'error');
        return;
      }

      // Simulate submission
      submitBtn.textContent = 'Verzenden...';
      submitBtn.disabled = true;
      
      setTimeout(() => {
        showFormMessage('Bedankt! We nemen binnen 30 minuten contact met u op.', 'success');
        contactForm.reset();
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
      }, 1200);
    });
  }

  function showFormMessage(msg, type) {
    const existing = document.querySelector('.form-message');
    if (existing) existing.remove();
    
    const el = document.createElement('div');
    el.className = `form-message form-message--${type}`;
    el.textContent = msg;
    el.style.cssText = `
      padding: 1rem; border-radius: 8px; margin-bottom: 1rem; font-weight: 600; font-size: .9rem;
      ${type === 'success' ? 'background: #e8f5e9; color: #2e7d32;' : 'background: #ffebee; color: #c62828;'}
    `;
    contactForm.insertBefore(el, contactForm.firstChild);
    
    setTimeout(() => el.remove(), 5000);
  }

  // ─── SMOOTH SCROLL FOR ANCHOR LINKS ───
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // ─── STICKY HEADER SCROLL EFFECT ───
  let lastScroll = 0;
  const header = document.querySelector('.site-header');
  
  if (header) {
    window.addEventListener('scroll', () => {
      const currentScroll = window.pageYOffset;
      if (currentScroll > 80) {
        header.style.boxShadow = '0 4px 20px rgba(0,0,0,.3)';
      } else {
        header.style.boxShadow = '0 2px 12px rgba(0,0,0,.2)';
      }
      lastScroll = currentScroll;
    });
  }

  // ─── SCROLL ANIMATIONS ───
  const observerOptions = { threshold: 0.1, rootMargin: '0px 0px -50px 0px' };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('fade-in');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document.querySelectorAll('.service-card, .review-card, .trust-item, .gallery-item').forEach(el => {
    observer.observe(el);
  });

  // ─── CURRENT YEAR ───
  const yearEl = document.getElementById('current-year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  // ─── LANGUAGE SWITCHER (handled by I18N — i18n.js) ───
  // I18N.init() wires buttons, loads saved language, and updates all [data-i18n] elements
  // Listen for language changes to update dynamic content (alt attributes, aria labels)
  window.addEventListener('langchange', () => {
    // Update image alt attributes
    document.querySelectorAll('[data-i18n-alt]').forEach(img => {
      const key = img.getAttribute('data-i18n-alt');
      if (I18N && I18N.t) img.alt = I18N.t(key);
    });
  });

  // ─── MOBILE CTA HIDE/SHOW ON SCROLL ───
  let lastScrollY = 0;
  let ticking = false;
  const mobileCta = document.querySelector('.mobile-cta');

  if (mobileCta) {
    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const currentScrollY = window.pageYOffset;
          if (currentScrollY > lastScrollY && currentScrollY > 200) {
            mobileCta.classList.add('hidden');
          } else {
            mobileCta.classList.remove('hidden');
          }
          lastScrollY = currentScrollY;
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }

  // ─── FAQ TOGGLE ───
  document.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
      const answer = btn.nextElementSibling;
      const isOpen = answer.classList.toggle('open');
      btn.classList.toggle('open');
      btn.setAttribute('aria-expanded', isOpen);
    });
  });

  // ─── COOKIE CONSENT BANNER ───
  const cookieBar = document.getElementById('cookie-bar');
  if (cookieBar && !localStorage.getItem('wr-cookie-consent')) {
    cookieBar.classList.add('cookie-bar--visible');
    const acceptBtn = cookieBar.querySelector('.cookie-btn--accept');
    const declineBtn = cookieBar.querySelector('.cookie-btn--decline');
    if (acceptBtn) acceptBtn.addEventListener('click', () => {
      localStorage.setItem('wr-cookie-consent', 'accepted');
      cookieBar.classList.remove('cookie-bar--visible');
    });
    if (declineBtn) declineBtn.addEventListener('click', () => {
      localStorage.setItem('wr-cookie-consent', 'declined');
      cookieBar.classList.remove('cookie-bar--visible');
    });
  }

});
