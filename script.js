/* ============================================================
   CV Josseph Steven Bolsios Cortés — script.js
   Formix Executive Dark & Volcanic Orange OS (Zero-Scroll + 100% Mobile)
   ============================================================ */

// 1. DETECCIÓN INMEDIATA DE IFRAME
(function detectIframe() {
  var inModal = window.location.search.indexOf('inModal=true') !== -1;
  var inFrame = (function () {
    try {
      return window.self !== window.top;
    } catch (e) {
      return true;
    }
  })();
  if (inModal || inFrame) {
    document.documentElement.classList.add('is-iframe');
  }
})();

// 2. CONMUTADOR DE VISTAS FORMIX ZERO-SCROLL (0..3)
window.switchCockpitView = function (viewIndex) {
  var views = document.querySelectorAll('.cockpit-view');
  var navLinks = document.querySelectorAll('.formix-nav-pill button.formix-nav-link');
  var mobSubtabs = document.getElementById('mobileSubtabs');

  views.forEach(function (v, idx) {
    v.classList.toggle('active', idx === viewIndex);
  });

  navLinks.forEach(function (link, idx) {
    link.classList.toggle('active', idx === viewIndex);
  });

  if (mobSubtabs) {
    mobSubtabs.classList.toggle('hidden-on-subview', viewIndex !== 0);
  }

  // Asegurar reproducción fluida del video ilustrativo al abrir "Estudios & Títulos"
  var eduVid = document.getElementById('eduShowcaseVideo');
  if (eduVid && viewIndex === 3) {
    eduVid.play().catch(function () {});
  }

  // En móvil, hacer scroll suave al inicio al cambiar de pestaña
  if (window.innerWidth <= 1080) {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
};

// 2B. CONTROL INTERACTIVO DE CAPÍTULOS DEL VIDEO ILUSTRATIVO (VISTA 04)
window.seekEduVideo = function (chapIndex) {
  var eduVid = document.getElementById('eduShowcaseVideo');
  if (!eduVid) return;
  eduVid.currentTime = chapIndex * 4.0 + 0.05;
  eduVid.play().catch(function () {});
  updateEduVideoButtons(chapIndex);
};

function updateEduVideoButtons(activeIdx) {
  var btns = document.querySelectorAll('.edu-chap-btn');
  btns.forEach(function (btn, idx) {
    var isAct = idx === activeIdx;
    btn.classList.toggle('active', isAct);
    btn.style.background = isAct ? 'rgba(255,81,26,0.16)' : 'rgba(255,255,255,0.04)';
    btn.style.borderColor = isAct ? 'var(--orange-core)' : 'rgba(255,255,255,0.08)';
    btn.style.color = isAct ? '#ffffff' : 'var(--text-secondary)';
    btn.style.fontWeight = isAct ? '700' : '600';
  });
}

// 3. CONMUTADOR DE SUB-SECCIONES EN CELULAR (VISTA 01)
window.switchMobCol = function (colIndex) {
  var col0 = document.getElementById('mob-col-0');
  var colEclipse = document.getElementById('mob-col-eclipse');
  var col1 = document.getElementById('mob-col-1');
  var col2 = document.getElementById('mob-col-2');
  var btns = document.querySelectorAll('.mob-sub-btn');

  if (col0) col0.classList.toggle('mob-active', colIndex === 0);
  if (colEclipse) colEclipse.classList.toggle('mob-active', colIndex === 0);
  if (col1) col1.classList.toggle('mob-active', colIndex === 1);
  if (col2) col2.classList.toggle('mob-active', colIndex === 2);

  btns.forEach(function (btn, idx) {
    btn.classList.toggle('active', idx === colIndex);
  });
};

document.addEventListener('DOMContentLoaded', function () {
  var isIframe = document.documentElement.classList.contains('is-iframe');

  // 4. MODAL GLOBAL DE IFRAME PARA SUB-PÁGINAS DE PROYECTOS Y CERTIFICADOS
  if (!isIframe) {
    if (!document.getElementById('globalIframeModal')) {
      var modalHTML =
        '<div class="modal-overlay" id="globalIframeModal">' +
          '<div class="modal-card" style="padding:0; overflow:hidden;">' +
            '<button class="modal-close" id="closeGlobalIframeBtn" aria-label="Cerrar ventana">&times;</button>' +
            '<div style="flex:1; width:100%; height:100%; overflow:hidden; border-radius:18px; background:#0c0c10;">' +
              '<iframe id="globalIframe" src="" style="width:100%; height:100%; border:none; background:#0c0c10;"></iframe>' +
            '</div>' +
          '</div>' +
        '</div>';
      document.body.insertAdjacentHTML('beforeend', modalHTML);
    }

    var modal = document.getElementById('globalIframeModal');
    var iframe = document.getElementById('globalIframe');
    var closeBtn = document.getElementById('closeGlobalIframeBtn');

    function openIframeModal(href) {
      var sep = href.indexOf('?') !== -1 ? '&' : '?';
      iframe.src = href + sep + 'inModal=true';
      modal.classList.add('active');
    }

    function closeIframeModal() {
      modal.classList.remove('active');
      setTimeout(function () {
        iframe.src = '';
      }, 250);
    }

    if (closeBtn) closeBtn.addEventListener('click', closeIframeModal);
    if (modal) {
      modal.addEventListener('click', function (e) {
        if (e.target === modal) closeIframeModal();
      });
    }
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeIframeModal();
    });

    // Interceptar enlaces a sub-páginas .html locales (excepto páginas principales y el demo independiente de NEXTIME Pro)
    var rootPages = ['index.html', 'exp.html', 'portfolio.html', 'nextime.html'];
    document.querySelectorAll('a').forEach(function (link) {
      var href = link.getAttribute('href');
      if (!href) return;
      var cleanHref = href.split('#')[0].split('?')[0];
      var isRootPage = rootPages.indexOf(cleanHref) !== -1;

      if (
        cleanHref.endsWith('.html') &&
        !isRootPage &&
        !href.startsWith('http') &&
        !href.startsWith('//') &&
        !link.hasAttribute('download')
      ) {
        link.addEventListener('click', function (e) {
          if (e.ctrlKey || e.metaKey || e.button === 1) return;
          e.preventDefault();
          openIframeModal(href);
        });
      }
    });
  }

  // 5. MODAL DE CONTACTO
  var eduVid = document.getElementById('eduShowcaseVideo');
  if (eduVid) {
    eduVid.addEventListener('timeupdate', function () {
      var idx = Math.floor(eduVid.currentTime / 4.0) % 6;
      updateEduVideoButtons(idx);
    });
  }

  var closeContactBtn = document.getElementById('closeContactBtn');
  var contactModal = document.getElementById('contactModal');
  var contactTriggers = document.querySelectorAll('#openContactBtn, .js-open-contact');

  if (contactModal) {
    contactTriggers.forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        contactModal.classList.add('active');
      });
    });

    if (closeContactBtn) {
      closeContactBtn.addEventListener('click', function () {
        contactModal.classList.remove('active');
      });
    }

    contactModal.addEventListener('click', function (e) {
      if (e.target === contactModal) contactModal.classList.remove('active');
    });
  }

  // 6. SLIDER DE DIAPOSITIVAS EN SUB-PÁGINAS (.description)
  var desc = document.querySelector('.description');
  if (desc && !desc.querySelector('.pres-slider')) {
    var mainTitle = desc.querySelector('h2');
    var rawNodes = Array.from(desc.children);
    var groups = [];
    var currentGroup = [];

    rawNodes.forEach(function (node) {
      if (node === mainTitle) return;
      var tag = node.tagName;
      if ((tag === 'H3' || tag === 'DIV') && currentGroup.length > 0) {
        groups.push(currentGroup);
        currentGroup = [];
      }
      currentGroup.push(node);
    });
    if (currentGroup.length > 0) {
      groups.push(currentGroup);
    }

    if (groups.length > 1) {
      desc.innerHTML = '';

      var slider = document.createElement('div');
      slider.className = 'pres-slider';

      var track = document.createElement('div');
      track.className = 'pres-track';

      groups.forEach(function (group, idx) {
        var slide = document.createElement('div');
        slide.className = 'pres-slide';

        var badge = document.createElement('span');
        badge.className = 'slide-num';
        badge.textContent = 'SECCIÓN 0' + (idx + 1) + ' / 0' + groups.length;
        slide.appendChild(badge);

        if (idx === 0 && mainTitle) {
          slide.appendChild(mainTitle.cloneNode(true));
        }

        group.forEach(function (el) {
          slide.appendChild(el);
        });

        track.appendChild(slide);
      });

      slider.appendChild(track);

      var controls = document.createElement('div');
      controls.className = 'pres-controls';

      var prevBtn = document.createElement('button');
      prevBtn.className = 'pres-btn';
      prevBtn.innerHTML = '&#8592;';
      prevBtn.setAttribute('aria-label', 'Anterior');

      var nextBtn = document.createElement('button');
      nextBtn.className = 'pres-btn';
      nextBtn.innerHTML = '&#8594;';
      nextBtn.setAttribute('aria-label', 'Siguiente');

      var dotsWrap = document.createElement('div');
      dotsWrap.className = 'pres-dots';

      var currentIdx = 0;
      var dots = groups.map(function (_, i) {
        var d = document.createElement('button');
        d.className = 'pres-dot' + (i === 0 ? ' active' : '');
        d.setAttribute('aria-label', 'Ir a sección ' + (i + 1));
        d.addEventListener('click', function () {
          goToSlide(i);
        });
        dotsWrap.appendChild(d);
        return d;
      });

      function goToSlide(index) {
        if (index < 0) index = groups.length - 1;
        if (index >= groups.length) index = 0;
        currentIdx = index;
        track.style.transform = 'translateX(-' + currentIdx * 100 + '%)';
        dots.forEach(function (d, i) {
          d.classList.toggle('active', i === currentIdx);
        });
      }

      prevBtn.addEventListener('click', function () {
        goToSlide(currentIdx - 1);
      });
      nextBtn.addEventListener('click', function () {
        goToSlide(currentIdx + 1);
      });

      controls.appendChild(prevBtn);
      controls.appendChild(dotsWrap);
      controls.appendChild(nextBtn);

      slider.appendChild(controls);
      desc.appendChild(slider);
    }
  }
});

window.populateDemo = function (payload) {
  console.log('populateDemo called', payload);
};
