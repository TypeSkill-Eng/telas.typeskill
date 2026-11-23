// =========================================================
// TypeSkill — inicio.js
// Liga a tela de Início aos dados de verdade da conta logada:
// missões (curso.js) e sessões de digitação (progresso.js).
// O cabeçalho, o nível e a meta diária são preenchidos pelo app.js.
// =========================================================
(function () {
  'use strict';
  var $ = function (id) { return document.getElementById(id); };
  var NOMES = { letras: 'Letras', palavras: 'Palavras', frases: 'Frases', texto: 'Texto', facil: 'Fácil', medio: 'Médio', dificil: 'Difícil' };
  var p = Progresso.ler();
  var r = Progresso.resumo(p);
  var curso = Curso.resumo();
  var atual = Curso.atual();                          // próxima lição não concluída (null = curso completo)
  var largura = function (el, pct) { el.style.width = Math.max(0, Math.min(100, pct)) + '%'; };

  // ---------- Mundo = módulo atual das missões ----------
  var modulo = atual ? Curso.CURSO.find(function (m) { return m.id === atual.modulo; }) : Curso.CURSO[Curso.CURSO.length - 1];
  var feitasNoModulo = modulo.licoes.filter(function (l) { return Curso.concluida(l.id); }).length;
  var pctMundo = Math.round(feitasNoModulo / modulo.licoes.length * 100);
  $('world-title').textContent = '🌍 Mundo ' + modulo.id + ' — ' + modulo.nome;
  largura($('mundo-barra'), pctMundo);
  $('mundo-barra-pai').setAttribute('aria-valuenow', pctMundo);
  $('mundo-pct').textContent = pctMundo + '%';
  // mapa de ilhas do mundo (cada ilha = uma lição; clique para jogar)
  var temaMundo = Mundos.TEMAS[(modulo.id - 1) % Mundos.TEMAS.length];
  $('mundo-secao').className = 'world mundo--' + temaMundo.id;
  $('world-title').textContent = '🌍 Mundo ' + modulo.id + ' — ' + temaMundo.nome;
  $('mundo-mapa').innerHTML = Mundos.mapa(modulo, modulo.licoes.map(function (l) {
    return { id: l.id, nome: l.nome, link: 'praticar.html?missao=' + l.id,
      estado: Curso.concluida(l.id) ? 'feita' : (atual && atual.id === l.id ? 'atual' : 'bloqueada') };
  }), { titulo: false, linkPremio: 'certificados.html' });

  // ---------- Missão atual ----------
  if (atual) {
    var pctMissao = Curso.porcentagem(atual.id);
    $('missao-nome').textContent = atual.id + ' ' + atual.nome;
    $('missao-desc').textContent = atual.objetivo;
    largura($('missao-barra'), pctMissao);
    $('missao-pct').textContent = pctMissao + '%';
    $('missao-meta').textContent = '⚡ ' + atual.ppm + ' PPM · 🎯 ' + atual.precisao + '%';
    $('missao-link').href = 'praticar.html?missao=' + atual.id;
    $('missao-link').textContent = pctMissao > 0 ? 'Continuar missão' : 'Começar missão';
  } else {
    $('missao-nome').textContent = 'Curso completo! 🏆';
    $('missao-desc').textContent = 'Você concluiu as ' + curso.totalLicoes + ' lições.';
    largura($('missao-barra'), 100);
    $('missao-pct').textContent = '100%';
    $('missao-meta').textContent = 'Todas as metas batidas';
    $('missao-link').href = 'missoes.html';
    $('missao-link').textContent = 'Ver missões';
  }

  // ---------- Pratique agora: treino livre no nível da missão ----------
  var base = atual || { tipo: 'texto', dificuldade: 'dificil' };
  var tipo = base.tipo, dificuldade = base.dificuldade;
  var motivo = 'Treino livre no nível da sua missão.';
  if (r.ultima && r.ultima.precisao < 90) {
    dificuldade = 'facil';
    motivo = 'Sua última precisão foi ' + r.ultima.precisao + '%: treine com calma no fácil.';
  } else if (!r.sessoes) {
    motivo = 'Aqueça os dedos antes da primeira missão.';
  }
  $('treino-desc').textContent = NOMES[tipo] + ' · ' + NOMES[dificuldade];
  $('treino-motivo').textContent = motivo;
  $('treino-link').href = 'praticar.html?tipo=' + tipo + '&dificuldade=' + dificuldade;

  // ---------- Desafio diário ----------
  var d = Progresso.desafioDoDia(p);
  $('desafio-desc').textContent = d.feito ? 'Desafio de hoje cumprido! Volte amanhã.' : 'Faça ' + d.meta + ' PPM em uma sessão hoje';
  largura($('desafio-barra'), d.feito ? 100 : d.melhorHoje / d.meta * 100);
  $('desafio-conta').textContent = Math.min(d.melhorHoje, d.meta) + ' / ' + d.meta;
  $('desafio-premio').textContent = d.feito ? '✅ +' + d.xp + ' XP ganhos' : '⭐ ' + d.xp + ' XP';

  // ---------- Seu progresso ----------
  $('prog-precisao').textContent = r.sessoes ? r.precisao + '%' : '—';
  var delta = $('prog-delta');
  if (r.deltaPrecisao === null) {
    delta.textContent = r.sessoes ? 'média recente' : 'sem sessões';
  } else {
    delta.textContent = (r.deltaPrecisao >= 0 ? '+' : '') + r.deltaPrecisao + '%';
    delta.classList.toggle('metric__delta--down', r.deltaPrecisao < 0);
  }
  $('prog-ppm').textContent = r.recordePpm;

  // ---------- Conquistas (lista do medalhas.js) ----------
  // as 2 ganhas mais recentes; se faltar, as que estão mais perto de ganhar
  var todas = Medalhas.avaliarEAvisar().lista;   // também mostra o aviso se ganhou conquista nova
  var ganhas = todas.filter(function (m) { return m.ok; }).sort(function (a, b) { return b.quando - a.quando; });
  var perto = todas.filter(function (m) { return !m.ok; }).sort(function (a, b) { return b.pct - a.pct; });
  $('conquistas').innerHTML = ganhas.concat(perto).slice(0, 2).map(function (m) {
    return '<li class="achievement' + (m.ok ? '' : ' bloqueada') + '">' +
      Medalhas.html(m) +
      '<div class="achievement__text"><h3>' + m.nome + '</h3><div><p>' + m.desc + '</p>' +
      '<strong>' + (m.ok ? '✓ Conquistada em ' + new Date(m.quando).toLocaleDateString('pt-BR') : '🔒 ' + m.atual + ' / ' + m.alvo + (m.unidade ? ' ' + m.unidade : '')) + '</strong></div></div></li>';
  }).join('');

  // ---------- Continue de onde parou ----------
  if (atual) {
    var pct = Curso.porcentagem(atual.id);
    $('continuar-titulo').textContent = pct > 0 ? 'Continue de onde parou' : (curso.licoesFeitas ? 'Próxima missão' : 'Comece sua jornada');
    $('continuar-licao').textContent = 'Lição: ' + atual.id + ' ' + atual.nome + ' (' + modulo.nome + ')';
    $('continuar-pct').textContent = pct + '% concluído';
    largura($('continuar-barra'), pct);
    $('continuar-link').href = 'praticar.html?missao=' + atual.id;
    $('continuar-link').textContent = pct > 0 ? 'Continuar' : 'Começar';
  } else {
    $('continuar-titulo').textContent = 'Curso concluído!';
    $('continuar-licao').textContent = 'Agora é treino livre para subir sua velocidade.';
    $('continuar-pct').textContent = '100% concluído';
    largura($('continuar-barra'), 100);
    $('continuar-link').href = 'praticar.html?tipo=texto&dificuldade=dificil';
    $('continuar-link').textContent = 'Treinar';
  }
})();
