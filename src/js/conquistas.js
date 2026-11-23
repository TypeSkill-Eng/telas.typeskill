// =========================================================
// TypeSkill — conquistas.js (tela Conquistas)
// Mostra todas as conquistas do medalhas.js, por categoria,
// com filtro (todas / ganhas / bloqueadas), e os prêmios de combo.
// =========================================================
(function () {
  'use strict';
  var $ = function (id) { return document.getElementById(id); };
  var NIVEIS = { bronze: 'Bronze', prata: 'Prata', ouro: 'Ouro', diamante: 'Diamante' };
  // mesmos prêmios de combo do praticar.js
  var PREMIOS = [
    { id: 'dedos-quentes', combo: 20, nome: 'Dedos Quentes', nivel: 'bronze', icone: '🔥' },
    { id: 'em-chamas', combo: 50, nome: 'Em Chamas', nivel: 'prata', icone: '☄️' },
    { id: 'imparavel', combo: 100, nome: 'Imparável', nivel: 'ouro', icone: '⚡' },
    { id: 'mestre', combo: 200, nome: 'Mestre do Teclado', nivel: 'diamante', icone: '👑' },
    { id: 'lenda', combo: 350, nome: 'Lenda TypeSkill', nivel: 'diamante', icone: '🐉' }
  ];

  var lista = Medalhas.lista();
  var filtro = 'todas';
  var data = function (t) { return new Date(t).toLocaleDateString('pt-BR'); };

  // ---------- resumo ----------
  var ganhas = lista.filter(function (m) { return m.ok; });
  $('c-total').textContent = ganhas.length + ' de ' + lista.length;
  $('c-barra').style.width = (ganhas.length / lista.length * 100) + '%';
  $('c-niveis').innerHTML = Object.keys(NIVEIS).map(function (n) {
    var feitas = ganhas.filter(function (m) { return m.nivel === n; }).length;
    var total = lista.filter(function (m) { return m.nivel === n; }).length;
    return '<li>' + Medalhas.html({ nivel: n, cat: 'Missões', nome: NIVEIS[n] }, 'medalha--p') + '<span><b>' + feitas + '/' + total + '</b><small>' + NIVEIS[n] + '</small></span></li>';
  }).join('');
  var proxima = lista.filter(function (m) { return !m.ok; }).sort(function (a, b) { return b.pct - a.pct; })[0];
  if (proxima) {
    $('c-proxima').innerHTML = Medalhas.html(proxima, 'medalha--g') +
      '<div><small>Mais perto de ganhar</small><b>' + proxima.nome + '</b><p>' + proxima.desc + '</p>' +
      '<div class="barra-t"><span style="width:' + proxima.pct + '%"></span></div>' +
      '<small>' + proxima.atual + ' / ' + proxima.alvo + (proxima.unidade ? ' ' + proxima.unidade : '') + '</small></div>';
  } else {
    $('c-proxima').innerHTML = Medalhas.html({ nivel: 'diamante', cat: 'Missões' }, 'medalha--g') + '<div><b>Você ganhou todas!</b><p>Lenda absoluta do teclado.</p></div>';
  }

  // ---------- cartões por categoria ----------
  function cartao(m) {
    return '<li class="conquista' + (m.ok ? ' conquista--ok' : '') + '">' +
      Medalhas.html(m) +
      '<div class="conquista__texto"><b>' + m.nome + '</b><p>' + m.desc + '</p>' +
      (m.ok
        ? '<small class="conquista__data">✓ Ganha em ' + data(m.quando) + ' · ' + NIVEIS[m.nivel] + '</small>'
        : '<div class="barra-t"><span style="width:' + m.pct + '%"></span></div><small>' + m.atual + ' / ' + m.alvo + (m.unidade ? ' ' + m.unidade : '') + ' · ' + NIVEIS[m.nivel] + '</small>') +
      '</div></li>';
  }
  function montar() {
    var visiveis = lista.filter(function (m) { return filtro === 'todas' || (filtro === 'ganhas' ? m.ok : !m.ok); });
    var categorias = [];
    visiveis.forEach(function (m) { if (categorias.indexOf(m.cat) < 0) categorias.push(m.cat); });
    $('c-lista').innerHTML = categorias.length ? categorias.map(function (cat) {
      var itens = visiveis.filter(function (m) { return m.cat === cat; });
      var feitas = lista.filter(function (m) { return m.cat === cat && m.ok; }).length;
      var total = lista.filter(function (m) { return m.cat === cat; }).length;
      return '<section class="cartao-t"><h2 class="cartao-t__titulo">' + cat + '<small>' + feitas + ' / ' + total + '</small></h2>' +
        '<ul class="conquistas">' + itens.map(cartao).join('') + '</ul></section>';
    }).join('') : '<div class="cartao-t vazio"><b>Nada por aqui ainda</b>' + (filtro === 'ganhas' ? 'Termine uma sessão no Praticar para ganhar a primeira conquista!' : 'Você já ganhou todas!') + '</div>';
  }
  document.querySelectorAll('[data-filtro]').forEach(function (b) {
    b.addEventListener('click', function () {
      filtro = b.dataset.filtro;
      document.querySelectorAll('[data-filtro]').forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); });
      montar();
    });
  });
  montar();

  // ---------- prêmios de combo (ganhos no Praticar) ----------
  var premios = Progresso.ler().premios;
  $('c-premios').innerHTML = PREMIOS.map(function (p) {
    var n = premios[p.id] || 0;
    return '<li class="premio' + (n ? '' : ' premio--nao') + '">' +
      Medalhas.html({ nivel: p.nivel, cat: 'Combo', nome: p.nome, ok: n > 0 }, 'medalha--p') +
      '<span><b>' + p.nome + '</b><small>' + p.combo + ' acertos seguidos</small></span>' +
      '<strong>' + (n ? n + '×' : '—') + '</strong></li>';
  }).join('');
})();
