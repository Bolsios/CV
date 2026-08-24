/* ============================================================
   CV Josseph Bolsios - script.js
   ============================================================ */

// 1. DETECCION DE IFRAME - Inmediata para evitar flash
(function detectIframe() {
  var inModal = window.location.search.indexOf('inModal=true') !== -1;
  var inFrame = (function() { try { return window.self !== window.top; } catch(e) { return true; } })();
  if (inModal || inFrame) document.documentElement.classList.add('is-iframe');
})();

document.addEventListener('DOMContentLoaded', function() {
  var isIframe = document.documentElement.classList.contains('is-iframe');

  // 2. MODAL GLOBAL DE IFRAME
  if (!isIframe) {
    if (!document.getElementById('globalIframeModal')) {
      document.body.insertAdjacentHTML('beforeend',
        '<div class="modal-overlay" id="globalIframeModal">' +
          '<div class="modal-card" id="globalModalCard" style="padding:0;">' +
            '<button class="modal-close" id="closeGlobalIframeBtn">&times;</button>' +
            '<div style="flex:1;overflow:hidden;border-radius:0 0 10px 10px;">' +
              '<iframe id="globalIframe" src="" style="width:100%;height:100%;border:none;background:#fff;"></iframe>' +
            '</div>' +
          '</div>' +
        '</div>');
    }

    var modal    = document.getElementById('globalIframeModal');
    var iframe   = document.getElementById('globalIframe');
    var closeBtn = document.getElementById('closeGlobalIframeBtn');

    function openIframeModal(href) {
      iframe.src = href + (href.indexOf('?') !== -1 ? '&' : '?') + 'inModal=true';
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
    function closeIframeModal() {
      modal.classList.remove('active');
      document.body.style.overflow = '';
      setTimeout(function() { iframe.src = ''; }, 300);
    }

    closeBtn.addEventListener('click', closeIframeModal);
    modal.addEventListener('click', function(e) { if (e.target === modal) closeIframeModal(); });
    document.addEventListener('keydown', function(e) { if (e.key === 'Escape') closeIframeModal(); });

    document.querySelectorAll('a').forEach(function(link) {
      var href = link.getAttribute('href');
      if (href && href.endsWith('.html') && !href.startsWith('http') && !href.startsWith('//')) {
        link.addEventListener('click', function(e) {
          if (e.ctrlKey || e.metaKey || e.button === 1) return;
          e.preventDefault();
          openIframeModal(href);
        });
      }
    });
  }

  // 3. MODAL DE CONTACTO
  var openContactBtn  = document.getElementById('openContactBtn');
  var closeContactBtn = document.getElementById('closeContactBtn');
  var contactModal    = document.getElementById('contactModal');
  if (openContactBtn && contactModal) {
    openContactBtn.addEventListener('click', function() { contactModal.classList.add('active'); });
    closeContactBtn.addEventListener('click', function() { contactModal.classList.remove('active'); });
    contactModal.addEventListener('click', function(e) { if (e.target === contactModal) contactModal.classList.remove('active'); });
  }

  // 4. SCROLL SUAVE
  var navbar  = document.querySelector('.navbar');
  var navbarH = navbar ? navbar.offsetHeight : 72;
  document.querySelectorAll('.nav-links a[href^="#"]').forEach(function(link) {
    link.addEventListener('click', function(e) {
      var target = document.querySelector(link.getAttribute('href'));
      if (target) { e.preventDefault(); window.scrollTo({ top: target.offsetTop - navbarH - 10, behavior: 'smooth' }); }
    });
  });

  // 5. NAVBAR SCROLL
  if (navbar) {
    window.addEventListener('scroll', function() {
      navbar.style.background = '#ffffff';
      navbar.style.boxShadow  = window.scrollY > 50 ? '0 2px 16px rgba(0,0,0,0.12)' : '0 2px 12px rgba(0,0,0,0.08)';
    });
  }

  // 6. SLIDER TIPO PRESENTACION - Corta cada 2 parrafos o en cada H3/DIV
  var desc = document.querySelector('.description');
  if (desc && !desc.querySelector('.pres-slider')) {
    var children = Array.from(desc.children);
    desc.innerHTML = '';

    // Agrupar contenido en slides
    var groups  = [];
    var current = [];
    var pCount  = 0; // contador de parrafos en el slide actual

    children.forEach(function(child) {
      var tag = child.tagName;

      // Iniciar nuevo slide en: H3, o cada 2 parrafos P, o DIV de subtema (no tech-tags)
      var isH3   = (tag === 'H3');
      var isDiv  = (tag === 'DIV' && !child.classList.contains('tech-tag-container'));
      var is2P   = (tag === 'P' && pCount >= 2 && current.length > 0);

      if ((isH3 || isDiv || is2P) && current.length > 0) {
        groups.push(current);
        current = [];
        pCount  = 0;
      }

      if (tag === 'P') pCount++;
      current.push(child);
    });
    if (current.length > 0) groups.push(current);

    // Si solo hay 1 grupo y tiene muchos parrafos, forzar corte cada 2
    if (groups.length === 1 && groups[0].filter(function(el){ return el.tagName === 'P'; }).length > 2) {
      var allChildren = groups[0];
      groups  = [];
      current = [];
      pCount  = 0;

      allChildren.forEach(function(child) {
        if (child.tagName === 'P' && pCount >= 2 && current.length > 0) {
          groups.push(current);
          current = [];
          pCount  = 0;
        }
        if (child.tagName === 'P') pCount++;
        current.push(child);
      });
      if (current.length > 0) groups.push(current);
    }

    // Construir slider
    var slider = document.createElement('div');
    slider.className = 'pres-slider';

    var track = document.createElement('div');
    track.className = 'pres-track';
    slider.appendChild(track);

    var slides = groups.map(function(group, i) {
      var slide = document.createElement('div');
      slide.className = 'pres-slide';

      var num = document.createElement('span');
      num.className = 'slide-num';
      num.textContent = (i + 1) + ' / ' + groups.length;
      slide.appendChild(num);

      group.forEach(function(el) { slide.appendChild(el); });
      track.appendChild(slide);
      return slide;
    });

    // Controles
    var controls = document.createElement('div');
    controls.className = 'pres-controls';

    var prevBtn = document.createElement('button');
    prevBtn.className = 'pres-btn pres-prev';
    prevBtn.innerHTML = '&#8592;';
    prevBtn.setAttribute('aria-label', 'Anterior');

    var dotsWrap = document.createElement('div');
    dotsWrap.className = 'pres-dots';

    var nextBtn = document.createElement('button');
    nextBtn.className = 'pres-btn pres-next';
    nextBtn.innerHTML = '&#8594;';
    nextBtn.setAttribute('aria-label', 'Siguiente');

    var dots = slides.map(function(slide, i) {
      var dot = document.createElement('button');
      dot.className = 'pres-dot' + (i === 0 ? ' active' : '');
      dot.setAttribute('aria-label', 'Slide ' + (i + 1));
      dotsWrap.appendChild(dot);
      return dot;
    });

    controls.appendChild(prevBtn);
    controls.appendChild(dotsWrap);
    controls.appendChild(nextBtn);
    slider.appendChild(controls);
    desc.appendChild(slider);

    // Logica
    var currentIdx = 0;

    function goTo(idx) {
      if (idx < 0) idx = slides.length - 1;
      if (idx >= slides.length) idx = 0;
      currentIdx = idx;
      track.style.transform = 'translateX(-' + (idx * 100) + '%)';
      dots.forEach(function(d, i) { d.classList.toggle('active', i === idx); });
      // Actualizar contador en cada slide
      slides.forEach(function(s) {
        var n = s.querySelector('.slide-num');
        if (n) n.textContent = (currentIdx + 1) + ' / ' + slides.length;
      });
    }

    prevBtn.addEventListener('click', function() { goTo(currentIdx - 1); });
    nextBtn.addEventListener('click', function() { goTo(currentIdx + 1); });
    dots.forEach(function(dot, i) { dot.addEventListener('click', function() { goTo(i); }); });

    // Swipe movil
    var touchX = 0;
    track.addEventListener('touchstart', function(e) { touchX = e.touches[0].clientX; }, {passive:true});
    track.addEventListener('touchend', function(e) {
      var diff = touchX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 50) goTo(diff > 0 ? currentIdx + 1 : currentIdx - 1);
    }, {passive:true});

    // Teclado (solo cuando el modal esta abierto)
    document.addEventListener('keydown', function(e) {
      if (!document.documentElement.classList.contains('is-iframe')) return;
      if (e.key === 'ArrowRight') goTo(currentIdx + 1);
      if (e.key === 'ArrowLeft')  goTo(currentIdx - 1);
    });
  }

  // 7. STAGGER ANIMACIONES
  document.querySelectorAll('.list-item').forEach(function(el, i) {
    el.style.animationDelay = (i * 0.08) + 's';
  });

});

window.populateDemo = function(p) { console.log('populateDemo', p); };
