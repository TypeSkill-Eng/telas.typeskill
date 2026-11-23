// =========================================================
// TypeSkill — progresso.js (números da digitação, por conta)
//
// O Praticar salva cada sessão aqui. O Início, o menu lateral e as
// Missões leem daqui. Cada conta tem o seu progresso, que começa do
// zero: chave "typeskill-progresso:<e-mail ou usuário>".
// Precisa do contas.js antes.
// =========================================================
(function () {
  var XP_POR_NIVEL = 250;   // XP para subir de nível
  var META_MIN = 20;        // meta diária, em minutos
  var XP_DESAFIO = 200;     // prêmio do desafio diário

  // ajustes da conta (tela Configurações): meta diária e animações
  function ajustes() {
    var a;
    try { a = JSON.parse(localStorage.getItem('typeskill-ajustes:' + conta())) || {}; } catch (e) { a = {}; }
    return { metaMin: a.metaMin || META_MIN, reduzirAnimacoes: !!a.reduzirAnimacoes };
  }
  function salvarAjustes(novos) {
    try { localStorage.setItem('typeskill-ajustes:' + conta(), JSON.stringify(Object.assign(ajustes(), novos))); } catch (e) { /* ignora */ }
  }

  function conta() {
    var s = window.Contas && Contas.usuarioAtual();
    return s ? (s.email || s.usuario) : 'convidado';
  }
  function chave() { return 'typeskill-progresso:' + conta(); }

  function ler() {
    var p;
    try { p = JSON.parse(localStorage.getItem(chave())) || {}; } catch (e) { p = {}; }
    p.xp = p.xp || 0;
    p.sessoes = p.sessoes || [];
    p.premios = p.premios || {};
    p.recordeCombo = p.recordeCombo || 0;
    p.desafios = p.desafios || {};   // dia -> true quando o desafio foi cumprido
    p.medalhas = p.medalhas || {};   // conquista -> quando foi ganha
    p.totais = p.totais || { sessoes: p.sessoes.length, ms: p.sessoes.reduce(function (t, s) { return t + (s.tempoMs || 0); }, 0) };
    p.melhorSequencia = p.melhorSequencia || 0;
    return p;
  }
  function gravar(p) {
    try { localStorage.setItem(chave(), JSON.stringify(p)); } catch (e) { /* segue sem salvar */ }
  }

  var dia = function (d) { return new Date(d).toLocaleDateString('sv'); };   // "2026-11-17"
  var hoje = function () { return dia(Date.now()); };
  var media = function (lista) { return lista.length ? lista.reduce(function (a, b) { return a + b; }, 0) / lista.length : 0; };

  // dias seguidos com pelo menos uma sessão (vale até ontem, se hoje ainda não treinou)
  function sequencia(p) {
    var dias = new Set(p.sessoes.map(function (s) { return dia(s.quando); }));
    var d = new Date();
    if (!dias.has(dia(d))) d.setDate(d.getDate() - 1);
    var n = 0;
    while (dias.has(dia(d))) { n++; d.setDate(d.getDate() - 1); }
    return n;
  }

  // desafio do dia: bater uma velocidade um pouco acima do seu recorde até ontem
  function desafioDoDia(p) {
    var h = hoje();
    var antes = p.sessoes.filter(function (s) { return dia(s.quando) < h; });
    var recorde = antes.reduce(function (m, s) { return Math.max(m, s.ppm); }, 0);
    var meta = Math.min(80, Math.max(15, Math.round(recorde * 1.1 / 5) * 5));
    var melhorHoje = p.sessoes.filter(function (s) { return dia(s.quando) === h; }).reduce(function (m, s) { return Math.max(m, s.ppm); }, 0);
    return { meta: meta, melhorHoje: melhorHoje, feito: !!p.desafios[h], xp: XP_DESAFIO };
  }
  // chamado pelo Praticar no fim da sessão: devolve o XP ganho (0 ou 200)
  function conferirDesafio(p, ppm) {
    var d = desafioDoDia(p);
    if (d.feito || ppm < d.meta) return 0;
    p.desafios[hoje()] = true;
    p.xp += XP_DESAFIO;
    return XP_DESAFIO;
  }

  // todos os números que as telas mostram
  function resumo(p) {
    p = p || ler();
    var h = hoje();
    var msHoje = 0, msTotal = 0;
    p.sessoes.forEach(function (s) {
      msTotal += s.tempoMs || 0;
      if (dia(s.quando) === h) msHoje += s.tempoMs || 0;
    });
    var recentes = p.sessoes.slice(0, 5).map(function (s) { return s.precisao; });
    var anteriores = p.sessoes.slice(5, 10).map(function (s) { return s.precisao; });
    return {
      xp: p.xp,
      nivel: Math.floor(p.xp / XP_POR_NIVEL) + 1,
      xpNoNivel: p.xp % XP_POR_NIVEL,
      xpPorNivel: XP_POR_NIVEL,
      sequencia: sequencia(p),
      minHoje: Math.floor(msHoje / 60000),
      minTotal: Math.floor(Math.max(msTotal, p.totais.ms) / 60000),
      metaMin: ajustes().metaMin,
      sessoes: Math.max(p.sessoes.length, p.totais.sessoes),
      melhorSequencia: Math.max(p.melhorSequencia, sequencia(p)),
      desafiosFeitos: Object.keys(p.desafios).length,
      recordePpm: p.sessoes.reduce(function (m, s) { return Math.max(m, s.ppm); }, 0),
      recordeCombo: p.recordeCombo,
      precisao: Math.round(media(recentes)),                                         // média das 5 últimas
      deltaPrecisao: anteriores.length ? Math.round(media(recentes) - media(anteriores)) : null,
      ultima: p.sessoes[0] || null
    };
  }

  window.Progresso = {
    XP_POR_NIVEL: XP_POR_NIVEL, META_MIN: META_MIN,
    chave: chave, ler: ler, gravar: gravar, resumo: resumo, ajustes: ajustes, salvarAjustes: salvarAjustes,
    sequencia: sequencia, desafioDoDia: desafioDoDia, conferirDesafio: conferirDesafio, dia: dia
  };
})();
