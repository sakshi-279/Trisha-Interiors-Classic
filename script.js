/**
 * Trisha Interiors And Designs - Core Interactive Logic
 * Founder: Rushikesh Mane | Kamgar Chowk, CIDCO, Chhatrapati Sambhajinagar
 */

document.addEventListener('DOMContentLoaded', () => {
  initMobileNav();
  initStickyHeader();
  initBeforeAfterSlider();
  initPortfolioFilters();
  initPortfolioLightbox();
  initEstimator();
  initFaqAccordion();
  initModals();
  initContactForms();
  initStatsCounter();
});

/* ==========================================================================
   1. Mobile Navigation
   ========================================================================== */
function initMobileNav() {
  const toggleBtn = document.getElementById('mobileMenuToggle');
  const closeBtn = document.getElementById('mobileMenuClose');
  const drawer = document.getElementById('mobileMenuDrawer');
  const links = document.querySelectorAll('.mobile-nav-link');

  if (!toggleBtn || !drawer) return;

  function openMenu() {
    drawer.classList.remove('translate-x-full');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    drawer.classList.add('translate-x-full');
    document.body.style.overflow = '';
  }

  toggleBtn.addEventListener('click', openMenu);
  if (closeBtn) closeBtn.addEventListener('click', closeMenu);

  links.forEach(link => {
    link.addEventListener('click', closeMenu);
  });
}

/* ==========================================================================
   2. Sticky Header
   ========================================================================== */
function initStickyHeader() {
  const header = document.getElementById('mainHeader');
  if (!header) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('shadow-xl', 'bg-opacity-95');
    } else {
      header.classList.remove('shadow-xl', 'bg-opacity-95');
    }
  });
}

/* ==========================================================================
   3. Draggable Before / After Image Slider
   ========================================================================== */
function initBeforeAfterSlider() {
  const container = document.getElementById('baSliderContainer');
  const beforeWrapper = document.getElementById('baBeforeWrapper');
  const handle = document.getElementById('baHandle');

  if (!container || !beforeWrapper || !handle) return;

  let isDragging = false;

  function setSliderPosition(x) {
    const rect = container.getBoundingClientRect();
    let posX = x - rect.left;
    if (posX < 0) posX = 0;
    if (posX > rect.width) posX = rect.width;

    const percentage = (posX / rect.width) * 100;
    beforeWrapper.style.width = `${percentage}%`;
    handle.style.left = `${percentage}%`;
  }

  // Mouse Events
  handle.addEventListener('mousedown', () => { isDragging = true; });
  window.addEventListener('mouseup', () => { isDragging = false; });
  window.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    setSliderPosition(e.clientX);
  });

  // Touch Events
  handle.addEventListener('touchstart', () => { isDragging = true; }, { passive: true });
  window.addEventListener('touchend', () => { isDragging = false; });
  window.addEventListener('touchmove', (e) => {
    if (!isDragging) return;
    setSliderPosition(e.touches[0].clientX);
  }, { passive: true });

  // Direct container click
  container.addEventListener('click', (e) => {
    setSliderPosition(e.clientX);
  });
}

/* ==========================================================================
   4. Portfolio Category Filtering
   ========================================================================== */
function initPortfolioFilters() {
  const filterBtns = document.querySelectorAll('.portfolio-filter-btn');
  const items = document.querySelectorAll('.portfolio-item');

  if (!filterBtns.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => {
        b.classList.remove('bg-gold-primary', 'text-slate-950', 'border-gold-primary');
        b.classList.add('bg-zinc-900', 'text-zinc-400', 'border-zinc-800');
      });

      btn.classList.add('bg-gold-primary', 'text-slate-950', 'border-gold-primary');
      btn.classList.remove('bg-zinc-900', 'text-zinc-400', 'border-zinc-800');

      const filterValue = btn.getAttribute('data-filter');

      items.forEach(item => {
        const category = item.getAttribute('data-category');
        if (filterValue === 'all' || category === filterValue) {
          item.style.display = 'block';
          setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'scale(1)';
          }, 10);
        } else {
          item.style.opacity = '0';
          item.style.transform = 'scale(0.95)';
          setTimeout(() => {
            item.style.display = 'none';
          }, 200);
        }
      });
    });
  });
}

/* ==========================================================================
   5. Portfolio Lightbox Modal
   ========================================================================== */
function initPortfolioLightbox() {
  const modal = document.getElementById('lightboxModal');
  const imgElement = document.getElementById('lightboxImg');
  const titleElement = document.getElementById('lightboxTitle');
  const descElement = document.getElementById('lightboxDesc');
  const closeBtn = document.getElementById('lightboxClose');
  const triggerBtns = document.querySelectorAll('.open-lightbox');

  if (!modal || !imgElement) return;

  triggerBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const parent = btn.closest('.portfolio-item');
      if (!parent) return;

      const img = parent.querySelector('img');
      const title = parent.querySelector('.portfolio-title')?.textContent || 'Project Design';
      const desc = parent.querySelector('.portfolio-desc')?.textContent || 'Bespoke Interior by Trisha Interiors';

      imgElement.src = img.src;
      imgElement.alt = title;
      if (titleElement) titleElement.textContent = title;
      if (descElement) descElement.textContent = desc;

      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  });

  function closeLightbox() {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeLightbox();
  });
}

/* ==========================================================================
   6. Interactive Project Cost Estimator Calculator
   ========================================================================== */
function initEstimator() {
  const spaceSelect = document.getElementById('calcSpace');
  const scopeSelect = document.getElementById('calcScope');
  const finishSelect = document.getElementById('calcFinish');
  const outputBudget = document.getElementById('estBudget');
  const outputTimeline = document.getElementById('estTimeline');
  const outputFeatures = document.getElementById('estFeatures');
  const waBtn = document.getElementById('calcWhatsAppBtn');

  if (!spaceSelect || !outputBudget) return;

  const basePricing = {
    '1bhk': { baseMin: 2.8, baseMax: 4.2, days: '35 - 45 Days', sqft: '~550 - 650 sq.ft' },
    '2bhk': { baseMin: 4.5, baseMax: 7.0, days: '45 - 60 Days', sqft: '~850 - 1100 sq.ft' },
    '3bhk': { baseMin: 7.5, baseMax: 12.0, days: '60 - 75 Days', sqft: '~1300 - 1800 sq.ft' },
    'villa': { baseMin: 14.0, baseMax: 25.0, days: '75 - 110 Days', sqft: '2500+ sq.ft Villa / Duplex' },
    'commercial': { baseMin: 3.5, baseMax: 8.5, days: '30 - 50 Days', sqft: 'Modern Kiosks / Retail / Office' },
    'design_only': { baseMin: 0.35, baseMax: 0.95, days: '10 - 20 Days', sqft: '2D/3D + Vastu Blueprint' }
  };

  const scopeMultipliers = {
    'turnkey': { mult: 1.0, label: 'Complete Turnkey (Design + Materials + Full Execution)' },
    'woodwork': { mult: 0.65, label: 'Modular Kitchen, Wardrobes & Woodwork Only' },
    'renovation': { mult: 0.80, label: 'Full Home Renovation & Modernization' }
  };

  const finishMultipliers = {
    'premium': { mult: 1.0, label: 'Premium Contemporary (High Quality Laminates & Finishes)' },
    'luxury': { mult: 1.45, label: 'Ultra Luxury Royal (Acrylic/PU, Fluted Glass, Quartz & Gold Profile)' }
  };

  function updateEstimate() {
    const spaceKey = spaceSelect.value || '2bhk';
    const scopeKey = scopeSelect ? scopeSelect.value : 'turnkey';
    const finishKey = finishSelect ? finishSelect.value : 'premium';

    const spaceData = basePricing[spaceKey] || basePricing['2bhk'];
    const scopeData = scopeMultipliers[scopeKey] || scopeMultipliers['turnkey'];
    const finishData = finishMultipliers[finishKey] || finishMultipliers['premium'];

    const totalMultiplier = scopeData.mult * finishData.mult;
    const finalMin = (spaceData.baseMin * totalMultiplier).toFixed(1);
    const finalMax = (spaceData.baseMax * totalMultiplier).toFixed(1);

    outputBudget.textContent = `₹${finalMin} Lakh - ₹${finalMax} Lakh*`;
    if (outputTimeline) outputTimeline.textContent = spaceData.days;

    if (outputFeatures) {
      if (spaceKey === 'design_only') {
        outputFeatures.innerHTML = `
          <li class="flex items-center gap-2"><span class="text-amber-400">✓</span> Full 2D Floor Layout & Furniture Plan</li>
          <li class="flex items-center gap-2"><span class="text-amber-400">✓</span> Realistic 3D Renders & Lighting Guides</li>
          <li class="flex items-center gap-2"><span class="text-amber-400">✓</span> Vastu Shastra Directional Alignment</li>
          <li class="flex items-center gap-2"><span class="text-amber-400">✓</span> Bill of Quantities (BOQ) for Contractors</li>
        `;
      } else {
        outputFeatures.innerHTML = `
          <li class="flex items-center gap-2"><span class="text-amber-400">✓</span> 100% Vastu-Compliant Space Planning</li>
          <li class="flex items-center gap-2"><span class="text-amber-400">✓</span> High-Definition 3D Renders & Walkthrough</li>
          <li class="flex items-center gap-2"><span class="text-amber-400">✓</span> Complete Turnkey Material Procurement & Execution</li>
          <li class="flex items-center gap-2"><span class="text-amber-400">✓</span> Dedicated On-Site Supervision by Rushikesh Mane</li>
          <li class="flex items-center gap-2"><span class="text-amber-400">✓</span> Branded Hardware & Anti-Termite Marine Plywood</li>
        `;
      }
    }

    if (waBtn) {
      const spaceTitle = spaceSelect.options[spaceSelect.selectedIndex].text;
      const text = encodeURIComponent(
        `Hello Rushikesh ji, I checked the estimate on Trisha Interiors website for:
• Space: ${spaceTitle}
• Scope: ${scopeData.label}
• Finish Grade: ${finishData.label}
• Est. Budget: ₹${finalMin} - ₹${finalMax} Lakh
I would like to schedule a site consultation at CIDCO / Chhatrapati Sambhajinagar.`
      );
      waBtn.href = `https://wa.me/917517855177?text=${text}`;
    }
  }

  spaceSelect.addEventListener('change', updateEstimate);
  if (scopeSelect) scopeSelect.addEventListener('change', updateEstimate);
  if (finishSelect) finishSelect.addEventListener('change', updateEstimate);

  updateEstimate();
}

/* ==========================================================================
   7. FAQ Accordion
   ========================================================================== */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const trigger = item.querySelector('.faq-trigger');
    const answer = item.querySelector('.faq-answer');
    const icon = item.querySelector('.faq-icon');

    if (!trigger || !answer) return;

    trigger.addEventListener('click', () => {
      const isOpen = !answer.classList.contains('hidden');

      // Close others
      faqItems.forEach(other => {
        other.querySelector('.faq-answer')?.classList.add('hidden');
        other.querySelector('.faq-icon')?.classList.remove('rotate-180');
      });

      if (!isOpen) {
        answer.classList.remove('hidden');
        if (icon) icon.classList.add('rotate-180');
      }
    });
  });
}

/* ==========================================================================
   8. Modals (Consultation Booking)
   ========================================================================== */
function initModals() {
  const openButtons = document.querySelectorAll('.open-consult-modal');
  const modal = document.getElementById('consultModal');
  const closeBtn = document.getElementById('consultModalClose');

  if (!modal) return;

  function openConsultModal() {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeConsultModal() {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }

  openButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openConsultModal();
    });
  });

  if (closeBtn) closeBtn.addEventListener('click', closeConsultModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeConsultModal();
  });
}

/* ==========================================================================
   9. Contact & Consultation Form Handling
   ========================================================================== */
function initContactForms() {
  // Main contact form
  const contactForm = document.getElementById('mainContactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('contactName')?.value.trim();
      const phone = document.getElementById('contactPhone')?.value.trim();
      const service = document.getElementById('contactService')?.value;
      const message = document.getElementById('contactMessage')?.value.trim();

      if (!name || !phone) {
        showToast('Please fill in your name and phone number.', 'error');
        return;
      }

      const waText = encodeURIComponent(
        `*New Inquiry from Trisha Interiors Website*\nName: ${name}\nPhone: ${phone}\nService: ${service}\nMessage: ${message}`
      );
      
      showToast('Thank you! Redirecting you to WhatsApp for direct chat...', 'success');
      
      setTimeout(() => {
        window.open(`https://wa.me/917517855177?text=${waText}`, '_blank');
        contactForm.reset();
      }, 900);
    });
  }

  // Modal consult form
  const modalForm = document.getElementById('modalConsultForm');
  if (modalForm) {
    modalForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('modalName')?.value.trim();
      const phone = document.getElementById('modalPhone')?.value.trim();
      const type = document.getElementById('modalType')?.value;
      const date = document.getElementById('modalDate')?.value;

      if (!name || !phone) {
        showToast('Please provide your name and phone number.', 'error');
        return;
      }

      const waText = encodeURIComponent(
        `*Consultation Request - Trisha Interiors*\nName: ${name}\nPhone: ${phone}\nProject Type: ${type}\nPreferred Date: ${date || 'Earliest available'}`
      );

      const modal = document.getElementById('consultModal');
      if (modal) modal.classList.remove('active');
      document.body.style.overflow = '';

      showToast('Consultation request received! Opening WhatsApp with Rushikesh Mane...', 'success');
      setTimeout(() => {
        window.open(`https://wa.me/917517855177?text=${waText}`, '_blank');
        modalForm.reset();
      }, 800);
    });
  }
}

/* ==========================================================================
   10. Toast Notification System
   ========================================================================== */
function showToast(message, type = 'success') {
  let toast = document.getElementById('luxuryToast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'luxuryToast';
    toast.className = 'fixed bottom-6 right-6 z-50 px-6 py-4 rounded-xl shadow-2xl transition-all duration-300 transform translate-y-20 opacity-0 flex items-center gap-3 border text-sm font-medium';
    document.body.appendChild(toast);
  }

  if (type === 'success') {
    toast.className = 'fixed bottom-6 right-6 z-50 px-6 py-4 rounded-xl shadow-2xl transition-all duration-300 transform translate-y-0 opacity-100 flex items-center gap-3 border border-amber-500/40 bg-zinc-900 text-amber-200';
    toast.innerHTML = `<svg class="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg> <span>${message}</span>`;
  } else {
    toast.className = 'fixed bottom-6 right-6 z-50 px-6 py-4 rounded-xl shadow-2xl transition-all duration-300 transform translate-y-0 opacity-100 flex items-center gap-3 border border-red-500/40 bg-zinc-900 text-red-200';
    toast.innerHTML = `<svg class="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg> <span>${message}</span>`;
  }

  setTimeout(() => {
    toast.classList.add('translate-y-20', 'opacity-0');
    toast.classList.remove('translate-y-0', 'opacity-100');
  }, 4000);
}

/* ==========================================================================
   11. Stats Counter Animation
   ========================================================================== */
function initStatsCounter() {
  const statElements = document.querySelectorAll('.counter-stat');
  if (!statElements.length) return;

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseFloat(el.getAttribute('data-target') || '0');
        const suffix = el.getAttribute('data-suffix') || '';
        const isDecimal = target % 1 !== 0;
        let current = 0;
        const duration = 1600;
        const steps = 40;
        const increment = target / steps;
        const stepTime = duration / steps;

        const timer = setInterval(() => {
          current += increment;
          if (current >= target) {
            current = target;
            clearInterval(timer);
          }
          el.textContent = (isDecimal ? current.toFixed(1) : Math.floor(current)) + suffix;
        }, stepTime);

        obs.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  statElements.forEach(stat => observer.observe(stat));
}
