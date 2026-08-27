(function () {
  'use strict';

  var ITP_PCT      = 10;
  var NOTARIA      = 3000;
  var CUSTODIA_PCT = 1.5;
  var LLOGUER_M2   = 16.85;
  var LTV_MAX      = 80;

  var eur = new Intl.NumberFormat('ca-ES', { maximumFractionDigits: 0 });

  function $(id) { return document.getElementById(id); }
  function num(id) { var el = $(id); return el ? parseFloat(el.value) : 0; }
  function set(id, txt) { var el = $(id); if (el) el.textContent = txt; }

  function quotaPrestec(capital, tipusAnual, anys) {
    var r = tipusAnual / 100 / 12;
    var n = Math.round(anys * 12);
    if (n <= 0) return 0;
    if (r === 0) return capital / n;
    return capital * r / (1 - Math.pow(1 + r, -n));
  }

  function calcula() {
    var preu     = num('sl-preu');
    var m2       = num('sl-m');
    var reforma  = num('sl-reforma');
    var veinat   = num('sl-veinat');
    var entitats = num('sl-entitats');
    var comerc   = num('sl-comerc');
    var tipus    = num('sl-int');
    var anys     = num('sl-anys');
    var carencia = num('sl-carencia');
    var mitjana  = num('sl-mitjana');

    var itp   = preu * ITP_PCT / 100;
    var total = preu + itp + NOTARIA + reforma;

    var propi   = veinat + entitats;
    var prestec = Math.max(0, total - propi);
    var ltv     = total > 0 ? prestec / total * 100 : 0;

    var custodia = preu * CUSTODIA_PCT / 100 / 12;
    var anysAmort = Math.max(1, anys - carencia);

    var f1 = prestec * tipus / 100 / 12 + custodia;
    var f2 = quotaPrestec(prestec, tipus, anysAmort) + custodia;
    var f3 = custodia;

    var mercat = LLOGUER_M2 * m2;
    var socies = mitjana > 0 ? Math.ceil(veinat / mitjana) : 0;

    function estalvi(q) {
      if (!mercat) return 0;
      return Math.round((1 - q / mercat) * 100);
    }

    set('v-preu',     eur.format(preu) + ' €');
    set('v-m',        eur.format(m2) + ' m²');
    set('v-reforma',  eur.format(reforma) + ' €');
    set('v-veinat',   eur.format(veinat) + ' €');
    set('v-entitats', eur.format(entitats) + ' €');
    set('v-comerc',   eur.format(comerc) + ' €');
    set('v-int',      tipus.toFixed(2).replace('.', ',') + ' %');
    set('v-anys',     anys + ' anys');
    set('v-carencia', carencia + (carencia === 1 ? ' any' : ' anys'));
    set('v-mitjana',  eur.format(mitjana) + ' €');

    set('r-itp',     eur.format(itp));
    set('r-total',   eur.format(total));
    set('r-propi',   eur.format(propi));
    set('r-prestec', eur.format(prestec));
    set('r-ltv',     Math.round(ltv) + '%');

    set('r-f1', eur.format(Math.round(f1)));
    set('r-f2', eur.format(Math.round(f2)));
    set('r-f3', eur.format(Math.round(f3)));
    set('r-e1', estalvi(f1) + '%');
    set('r-e2', estalvi(f2) + '%');
    set('r-e3', estalvi(f3) + '%');

    var fila1 = document.querySelector('.fase-carencia');
    if (fila1) fila1.style.display = carencia > 0 ? '' : 'none';
    set('r-fase1-anys', carencia === 1 ? 'Any 1' : 'Anys 1–' + carencia);
    set('r-fase2-anys', 'Anys ' + (carencia + 1) + '–' + anys);
    set('r-fase3-anys', 'Any ' + (anys + 1) + ' endavant');

    set('r-mercat', eur.format(Math.round(mercat)));
    set('r-socies', socies);
    set('r-mitjana-txt', eur.format(mitjana));
    set('r-comerc-txt', eur.format(comerc));

    var warn = $('warn');
    if (warn) warn.classList.toggle('show', ltv > LTV_MAX);

    var nota = $('cas-real-nota');
    if (nota) {
      var actiu = document.querySelector('.preset.on');
      nota.style.display = (actiu && actiu.dataset.casreal === '1') ? 'block' : 'none';
    }

    sincronitzaPresets(preu, m2);
  }

  function sincronitzaPresets(preu, m2) {
    var presets = document.querySelectorAll('.preset');
    for (var i = 0; i < presets.length; i++) {
      var p = presets[i];
      var coincideix = parseFloat(p.dataset.preu) === preu && parseFloat(p.dataset.m) === m2;
      p.classList.toggle('on', coincideix);
      p.setAttribute('aria-pressed', coincideix ? 'true' : 'false');
    }
  }

  function init() {
    var sliders = document.querySelectorAll('input[type=range]');
    for (var i = 0; i < sliders.length; i++) {
      sliders[i].addEventListener('input', calcula);
    }

    var presets = document.querySelectorAll('.preset');
    for (var j = 0; j < presets.length; j++) {
      presets[j].addEventListener('click', function () {
        var slPreu = $('sl-preu');
        var slM = $('sl-m');
        if (slPreu) slPreu.value = this.dataset.preu;
        if (slM) slM.value = this.dataset.m;
        calcula();
      });
      presets[j].addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); this.click(); }
      });
    }

    var toggle = $('adv-toggle');
    var adv = $('adv');
    if (toggle && adv) {
      toggle.addEventListener('click', function () {
        var obert = adv.classList.toggle('open');
        toggle.setAttribute('aria-expanded', obert ? 'true' : 'false');
        toggle.innerHTML = obert
          ? '⚙ Ajusta el finançament ▴'
          : '⚙ Ajusta el finançament ▾';
      });
    }

    calcula();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
