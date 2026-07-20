/* ══════════════════════════════════════════════════════════════
   Abans Que Tanqui · site.js — VERSIÓ ACTUALITZADA
   Substitueix assets/site.js del repositori per aquest fitxer
   (reanomenant-lo site.js). Canvis marcats amb [NOU]:
   - Nav: enllaç «FAQ»
   - Footer «Participa»: enllaç al formulari de detecció
   - Footer «Més»: FAQ i Guia de drets
   ══════════════════════════════════════════════════════════════ */
(function () {
  var dir = location.pathname.replace(/\/[^\/]*$/, '');
  var depth = dir.split('/').filter(Boolean).length;
  var base = depth > 0 ? '../'.repeat(depth) : '';

  var pagina = (location.pathname.split('/').pop() || 'index.html');

  var enllacos = [
    { href: 'projecte.html',   text: 'Projecte' },
    { href: 'descobreix.html', text: 'Descobreix' },
    { href: 'actualitat.html', text: 'Actualitat' },
    { href: 'recursos.html',   text: 'Recursos' },
    { href: 'faq.html',        text: 'FAQ' },        /* [NOU] */
    { href: 'contacte.html',   text: 'Contacte' }
  ];

  function actiu(href) { return href === pagina ? ' actiu' : ''; }

  var navLinks = enllacos.map(function (e) {
    return '<a class="' + actiu(e.href).trim() + '" href="' + base + e.href + '">' + e.text + '</a>';
  }).join('');

  var mobileLinks = enllacos.map(function (e) {
    return '<a class="' + actiu(e.href).trim() + '" href="' + base + e.href + '">' + e.text + '</a>';
  }).join('');

  var navHTML =
    '<nav class="aqt-nav">' +
      '<a class="nav-logo" href="' + base + 'index.html"><img src="' + base + 'img/logo-aqt.png" alt="Abans Que Tanqui"></a>' +
      '<div class="nav-links">' + navLinks +
        '<a class="nav-cta' + actiu('contacte.html') + '" href="' + base + 'contacte.html">Participa</a>' +
      '</div>' +
      '<button class="nav-burger" id="aqt-burger" aria-label="Menú" aria-expanded="false"><span></span><span></span><span></span></button>' +
    '</nav>' +
    '<div class="aqt-nav-mobile" id="aqt-mobile">' + mobileLinks +
      '<a class="nav-cta-m" href="' + base + 'contacte.html">Participa</a>' +
    '</div>';

  var footerHTML =
    '<footer class="aqt-footer">' +
      '<div class="footer-grid">' +
        '<div>' +
          '<div class="footer-brand"><img src="' + base + 'img/logo-footer.png" alt="Abans Que Tanqui"></div>' +
          '<div class="footer-desc">Projecte de recerca i exploració sobre la transformació del comerç de proximitat. En construcció a Catalunya.</div>' +
          '<div class="footer-social">' +
            '<a href="https://www.instagram.com/abansquetanqui/" target="_blank" rel="noopener" title="Instagram"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.6)" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/></svg></a>' +
            '<a href="' + base + 'contacte.html" title="Correu"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.6)" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M22 7l-10 7L2 7"/></svg></a>' +
          '</div>' +
        '</div>' +
        '<div class="footer-col">' +
          '<div class="footer-col-title">Projecte</div>' +
          '<a href="' + base + 'projecte.html">Projecte</a>' +
          '<a href="' + base + 'projecte.html">Com funciona</a>' +
        '</div>' +
        '<div class="footer-col">' +
          '<div class="footer-col-title">Participa</div>' +
          '<a href="' + base + 'contacte.html">Suma&#39;t</a>' +
          '<a href="' + base + 'coneixes-un-comerc.html">Coneixes un comerç en risc?</a>' + /* [NOU] */
          '<a href="' + base + 'guia-drets.html">Tens un comerç?</a>' +                    /* [NOU: abans apuntava a contacte] */
          '<a href="' + base + 'contacte.html">Contacte</a>' +
        '</div>' +
        '<div class="footer-col">' +
          '<div class="footer-col-title">Més</div>' +
          '<a href="' + base + 'descobreix.html">Mapa de casos</a>' +
          '<a href="' + base + 'actualitat.html">Actualitat</a>' +
          '<a href="' + base + 'recursos.html">Recursos</a>' +
          '<a href="' + base + 'calculadora.html">Calculadora</a>' +
          '<a href="' + base + 'faq.html">Preguntes freqüents</a>' +   /* [NOU] */
          '<a href="' + base + 'guia-drets.html">Guia de drets</a>' +  /* [NOU] */
        '</div>' +
      '</div>' +
      '<div class="footer-bottom">' +
        '<span class="footer-copy">© 2026 Abans Que Tanqui · Projecte en construcció · Barcelona</span>' +
        '<span class="footer-entity">En fase de constitució · 2026</span>' +
      '</div>' +
    '</footer>';

  function mount() {
    var navSlot = document.getElementById('site-nav');
    var footSlot = document.getElementById('site-footer');
    if (navSlot) navSlot.outerHTML = navHTML;
    else document.body.insertAdjacentHTML('afterbegin', navHTML);
    if (footSlot) footSlot.outerHTML = footerHTML;
    else document.body.insertAdjacentHTML('beforeend', footerHTML);

    var burger = document.getElementById('aqt-burger');
    var mobile = document.getElementById('aqt-mobile');
    if (burger && mobile) {
      burger.addEventListener('click', function () {
        var open = burger.classList.toggle('open');
        mobile.classList.toggle('open');
        burger.setAttribute('aria-expanded', open ? 'true' : 'false');
      });
      mobile.querySelectorAll('a').forEach(function (a) {
        a.addEventListener('click', function () {
          burger.classList.remove('open');
          mobile.classList.remove('open');
        });
      });
    }
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mount);
  else mount();
})();
