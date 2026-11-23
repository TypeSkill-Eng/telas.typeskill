// =========================================================
// TypeSkill — estatisticas.js (tela Progresso)
// Números gerais, gráficos de velocidade e precisão, calendário
// de atividade, resultado por tipo de treino, teclas que mais
// erra e histórico. Tudo da conta logada (progresso.js).
// Os gráficos são desenhados em SVG aqui mesmo (sem biblioteca).
// =========================================================
(function () {
  'use strict';
  var $ = function (id) { return document.getElementById(id); };
  var NOMES = { letras: 'Letras', palavras: 'Palavras', frases: 'Frases', texto: 'Texto', facil: 'Fácil', medio: 'Médio', dificil: 'Difícil' };
  var p = Progresso.ler();
  var r = Progresso.resumo(p);
  var sessoes = p.sessoes;   // mais nova primeiro
  var tempo = function (ms) { var m = Math.round(ms / 60000); return m < 60 ? m + ' min' : Math.floor(m / 60) + 'h ' + (m % 60) + 'm'; };
  var dataCurta = function (t) { return new Date(t).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }); };

  // ---------- números ----------
  $('e-sessoes').textContent = r.sessoes;
  $('e-tempo').textContent = tempo(r.minTotal * 60000);
  $('e-ppm').textContent = r.recordePpm;
  $('e-precisao').textContent = r.sessoes ? r.precisao + '%' : '—';
  $('e-precisao-extra').textContent = r.deltaPrecisao === null ? 'média das 5 últimas' : (r.deltaPrecisao >= 0 ? '▲ +' : '▼ ') + r.deltaPrecisao + '% vs. 5 anteriores';
  $('e-sequencia').textContent = r.sequencia + (r.sequencia === 1 ? ' dia' : ' dias');
  $('e-sequencia-extra').textContent = 'melhor: ' + r.melhorSequencia + (r.melhorSequencia === 1 ? ' dia' : ' dias');
  $('e-nivel').textContent = r.nivel;
  $('e-nivel-extra').textContent = r.xp.toLocaleString('pt-BR') + ' XP no total';

  if (!sessoes.length) {
    document.querySelectorAll('[data-precisa-sessao]').forEach(function (el) {
      el.innerHTML = '<div class="vazio"><b>Sem sessões ainda</b>Faça sua primeira sessão no <a href="praticar.html">Praticar</a> e os gráficos aparecem aqui.</div>';
    });
  } else {
    var ultimas = sessoes.slice(0, 30).reverse();   // antiga → nova
    grafico($('g-ppm'), ultimas, function (s) { return s.ppm; }, ' PPM', 0);
    grafico($('g-precisao'), ultimas, function (s) { return s.precisao; }, '%', null);
    porTipo();
    teclas();
    historico();
  }
  calendario();

  // ---------- gráfico de linha com área e dica ao passar o mouse ----------
  function grafico(caixa, dados, valor, unidade, minimoFixo) {
    var L = 560, A = 200, m = { e: 36, d: 12, t: 12, b: 26 };
    var vals = dados.map(valor);
    var max = Math.max.apply(null, vals), min = minimoFixo === null ? Math.min.apply(null, vals) : minimoFixo;
    if (minimoFixo === null) { min = Math.max(0, Math.floor((min - 5) / 5) * 5); max = Math.min(100, Math.ceil((max + 2) / 5) * 5); }
    else { max = Math.max(20, Math.ceil(max * 1.15 / 20) * 20); }   // marcas redondas: 0, 15, 30, 45, 60...
    if (max === min) max = min + 10;
    var x = function (i) { return m.e + (dados.length === 1 ? (L - m.e - m.d) / 2 : i * (L - m.e - m.d) / (dados.length - 1)); };
    var y = function (v) { return m.t + (1 - (v - min) / (max - min)) * (A - m.t - m.b); };
    var linhas = '', rotulos = '';
    for (var k = 0; k <= 4; k++) {
      var v = min + (max - min) * k / 4, yy = y(v).toFixed(1);
      linhas += '<line x1="' + m.e + '" x2="' + (L - m.d) + '" y1="' + yy + '" y2="' + yy + '" class="g-grade"/>';
      rotulos += '<text x="' + (m.e - 8) + '" y="' + yy + '" class="g-eixo" text-anchor="end" dominant-baseline="middle">' + Math.round(v) + '</text>';
    }
    var pts = vals.map(function (v, i) { return x(i).toFixed(1) + ',' + y(v).toFixed(1); });
    var area = 'M' + x(0).toFixed(1) + ',' + y(min) + 'L' + pts.join('L') + 'L' + x(vals.length - 1).toFixed(1) + ',' + y(min) + 'Z';
    var datas = '<text x="' + x(0) + '" y="' + (A - 6) + '" class="g-eixo">' + dataCurta(dados[0].quando) + '</text>' +
      (dados.length > 1 ? '<text x="' + x(dados.length - 1) + '" y="' + (A - 6) + '" class="g-eixo" text-anchor="end">' + dataCurta(dados[dados.length - 1].quando) + '</text>' : '');
    var ultimo = vals.length - 1;
    caixa.innerHTML =
      '<svg viewBox="0 0 ' + L + ' ' + A + '" class="g-svg" role="img" aria-label="Gráfico das últimas ' + dados.length + ' sessões">' +
        linhas + rotulos + datas +
        '<path d="' + area + '" class="g-area"/>' +
        '<polyline points="' + pts.join(' ') + '" class="g-linha"/>' +
        '<circle cx="' + x(ultimo) + '" cy="' + y(vals[ultimo]) + '" r="4.5" class="g-ponto"/>' +
        '<text x="' + Math.min(x(ultimo), L - m.d - 4) + '" y="' + (y(vals[ultimo]) - 12) + '" class="g-valor" text-anchor="end">' + vals[ultimo] + unidade + '</text>' +
        '<line class="g-mira" y1="' + m.t + '" y2="' + (A - m.b) + '" visibility="hidden"/>' +
        '<circle class="g-ponto g-ponto--mira" r="5" visibility="hidden"/>' +
      '</svg><div class="g-dica" hidden></div>';
    var svg = caixa.querySelector('svg'), mira = caixa.querySelector('.g-mira'), bola = caixa.querySelector('.g-ponto--mira'), dica = caixa.querySelector('.g-dica');
    function mostrar(ev) {
      var b = svg.getBoundingClientRect();
      var px = (ev.clientX - b.left) / b.width * L;
      var i = dados.length === 1 ? 0 : Math.round((px - m.e) / ((L - m.e - m.d) / (dados.length - 1)));
      i = Math.max(0, Math.min(dados.length - 1, i));
      var s = dados[i];
      mira.setAttribute('x1', x(i)); mira.setAttribute('x2', x(i)); mira.setAttribute('visibility', 'visible');
      bola.setAttribute('cx', x(i)); bola.setAttribute('cy', y(vals[i])); bola.setAttribute('visibility', 'visible');
      dica.hidden = false;
      dica.innerHTML = '<b>' + vals[i] + unidade + '</b><span>' + new Date(s.quando).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' }) + '</span><span>' + NOMES[s.tipo] + ' · ' + NOMES[s.dificuldade] + '</span>';
      var esquerda = x(i) / L * b.width;
      dica.style.left = Math.min(b.width - dica.offsetWidth, Math.max(0, esquerda - dica.offsetWidth / 2)) + 'px';
      dica.style.top = Math.max(0, y(vals[i]) / A * b.height - dica.offsetHeight - 12) + 'px';
    }
    svg.addEventListener('pointermove', mostrar);
    svg.addEventListener('pointerleave', function () { mira.setAttribute('visibility', 'hidden'); bola.setAttribute('visibility', 'hidden'); dica.hidden = true; });
  }

  // ---------- calendário: minutos por dia nas últimas 12 semanas ----------
  function calendario() {
    var minutos = {};
    sessoes.forEach(function (s) { var d = Progresso.dia(s.quando); minutos[d] = (minutos[d] || 0) + (s.tempoMs || 0) / 60000; });
    var hoje = new Date(); hoje.setHours(12, 0, 0, 0);
    var inicio = new Date(hoje); inicio.setDate(inicio.getDate() - inicio.getDay() - 7 * 11);   // domingo de 11 semanas atrás
    var colunas = '', diasAtivos = 0;
    for (var sem = 0; sem < 12; sem++) {
      var celulas = '';
      for (var d = 0; d < 7; d++) {
        var dia = new Date(inicio); dia.setDate(inicio.getDate() + sem * 7 + d);
        var chave = Progresso.dia(dia), min = Math.round(minutos[chave] || 0);
        var futuro = dia > hoje;
        if (min > 0) diasAtivos++;
        var nivel = futuro ? 'f' : min === 0 ? 0 : min < 5 ? 1 : min < 15 ? 2 : min < 30 ? 3 : 4;
        celulas += '<span class="cal-dia cal-dia--' + nivel + '" title="' + dia.toLocaleDateString('pt-BR') + ': ' + (futuro ? '—' : min + ' min') + '"></span>';
      }
      colunas += '<div class="cal-semana">' + celulas + '</div>';
    }
    $('g-calendario').innerHTML = '<div class="cal">' + colunas + '</div>' +
      '<div class="cal-legenda"><span>' + diasAtivos + ' dias com treino</span><span class="cal-escala">menos <i class="cal-dia cal-dia--0"></i><i class="cal-dia cal-dia--1"></i><i class="cal-dia cal-dia--2"></i><i class="cal-dia cal-dia--3"></i><i class="cal-dia cal-dia--4"></i> mais</span></div>';
  }

  // ---------- por tipo de treino ----------
  function porTipo() {
    var tipos = ['letras', 'palavras', 'frases', 'texto'];
    var dados = tipos.map(function (t) {
      var lista = sessoes.filter(function (s) { return s.tipo === t; });
      return { t: t, n: lista.length, ppm: lista.length ? Math.round(lista.reduce(function (a, s) { return a + s.ppm; }, 0) / lista.length) : 0 };
    });
    var max = Math.max.apply(null, dados.map(function (d) { return d.ppm; })) || 1;
    $('g-tipos').innerHTML = '<ul class="tipos">' + dados.map(function (d) {
      return '<li title="' + d.n + ' sessões"><span class="tipos__nome">' + NOMES[d.t] + '</span>' +
        '<span class="tipos__trilho"><span style="width:' + (d.ppm / max * 100) + '%"></span></span>' +
        '<span class="tipos__valor">' + (d.n ? d.ppm + ' PPM' : '—') + '<small>' + d.n + (d.n === 1 ? ' sessão' : ' sessões') + '</small></span></li>';
    }).join('') + '</ul>';
  }

  // ---------- teclas que mais erra (somando as últimas sessões) ----------
  function teclas() {
    var soma = {};
    sessoes.slice(0, 20).forEach(function (s) { Object.entries(s.teclas || {}).forEach(function (e) { soma[e[0]] = (soma[e[0]] || 0) + e[1]; }); });
    var piores = Object.entries(soma).sort(function (a, b) { return b[1] - a[1]; }).slice(0, 8);
    if (!piores.length) {
      $('g-teclas').innerHTML = '<div class="vazio"><b>Nenhuma tecla problemática 🎉</b>Continue treinando: quando você errar uma tecla com frequência, ela aparece aqui.</div>';
      return;
    }
    var nome = function (k) { return k === ' ' ? 'espaço' : k; };
    $('g-teclas').innerHTML = '<ul class="teclas-erro">' + piores.map(function (e) {
      return '<li><kbd>' + nome(e[0]) + '</kbd><small>' + e[1] + (e[1] === 1 ? ' erro' : ' erros') + '</small></li>';
    }).join('') + '</ul>';
    var letras = piores.map(function (e) { return e[0].toLowerCase(); }).filter(function (k) { return /^[a-zà-üç]$/.test(k); });
    var botao = $('treinar-teclas');
    if (letras.length) {
      botao.hidden = false;
      botao.href = 'praticar.html?letras=' + encodeURIComponent(Array.from(new Set(letras)).join(''));
    }
  }

  // ---------- histórico ----------
  function historico() {
    $('g-historico').innerHTML = '<div class="tabela-rolagem"><table class="tabela"><thead><tr><th>Data</th><th>Treino</th><th>PPM</th><th>Precisão</th><th>Tempo</th><th>Erros</th></tr></thead><tbody>' +
      sessoes.slice(0, 12).map(function (s) {
        return '<tr><td>' + new Date(s.quando).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' }) + '</td>' +
          '<td>' + (s.missao ? '<span class="selo-missao">Missão ' + s.missao + '</span>' : NOMES[s.tipo] + ' · ' + NOMES[s.dificuldade]) + '</td>' +
          '<td><b>' + s.ppm + '</b></td><td>' + s.precisao + '%</td><td>' + tempo(s.tempoMs || 0) + '</td><td>' + s.erros + '</td></tr>';
      }).join('') + '</tbody></table></div>';
  }
})();
