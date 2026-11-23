// =========================================================
// TypeSkill — certificados.js (tela Certificados)
// Um certificado para cada módulo das Missões + um do curso inteiro.
// O certificado libera quando todas as lições do módulo são concluídas.
// "Imprimir / salvar PDF" usa a janela de impressão do navegador.
// O nome no certificado vem do Perfil (nome completo).
// =========================================================
(function () {
  'use strict';
  var $ = function (id) { return document.getElementById(id); };
  var perfil = Contas.perfil();
  var nome = perfil.nome || perfil.usuario;
  var dadosCurso = Curso.dados();
  var ICONES = ['🔤', '📝', '💬', '📚', '🏆'];

  // junta as lições de um certificado e calcula os números dele
  function infoDe(licoes) {
    var feitas = licoes.filter(function (l) { return (dadosCurso[l.id] || {}).concluida; });
    var reg = feitas.map(function (l) { return dadosCurso[l.id]; });
    return {
      feitas: feitas.length, total: licoes.length,
      ok: feitas.length === licoes.length,
      data: reg.length ? Math.max.apply(null, reg.map(function (x) { return x.concluidaEm || 0; })) : null,
      ppm: reg.reduce(function (m, x) { return Math.max(m, x.melhorPpm || 0); }, 0),
      precisao: reg.reduce(function (m, x) { return Math.max(m, x.melhorPrecisao || 0); }, 0)
    };
  }
  var certificados = Curso.CURSO.map(function (m, i) {
    return Object.assign({ titulo: 'Módulo ' + m.id + ' — ' + m.nome, curto: m.nome, desc: m.descricao, icone: ICONES[i] }, infoDe(m.licoes));
  });
  certificados.push(Object.assign({ titulo: 'Curso Completo de Digitação', curto: 'Curso completo', desc: 'Todos os 4 módulos: letras, palavras, frases e textos.', icone: ICONES[4], final: true }, infoDe(Curso.TODAS)));

  var ganhos = certificados.filter(function (c) { return c.ok; }).length;
  $('cert-total').textContent = ganhos + ' de ' + certificados.length;
  $('cert-nome').textContent = nome;
  $('cert-aviso-nome').hidden = !!perfil.nome;

  $('cert-lista').innerHTML = certificados.map(function (c, i) {
    return '<article class="cert' + (c.ok ? ' cert--ok' : '') + (c.final ? ' cert--final' : '') + '">' +
      '<span class="cert__selo">' + (c.ok ? c.icone : '🔒') + '</span>' +
      '<h2>' + c.titulo + '</h2><p>' + c.desc + '</p>' +
      '<div class="barra-t' + (c.ok ? ' barra-t--verde' : '') + '"><span style="width:' + (c.feitas / c.total * 100) + '%"></span></div>' +
      '<small>' + (c.ok ? '✓ Liberado em ' + new Date(c.data).toLocaleDateString('pt-BR') : c.feitas + ' de ' + c.total + ' lições concluídas') + '</small>' +
      (c.ok
        ? '<button class="botao-t" type="button" data-ver="' + i + '">Ver certificado</button>'
        : '<a class="botao-t botao-t--claro" href="missoes.html">Ir para as missões</a>') +
      '</article>';
  }).join('');

  // código para "conferir" o certificado (o mesmo sempre para a mesma conta e módulo)
  function codigo(texto) {
    var h = 2166136261;
    for (var i = 0; i < texto.length; i++) { h ^= texto.charCodeAt(i); h = Math.imul(h, 16777619) >>> 0; }
    return 'TS-' + h.toString(36).toUpperCase().padStart(7, '0').slice(0, 7);
  }

  var janela = $('cert-janela');
  document.querySelectorAll('[data-ver]').forEach(function (b) {
    b.addEventListener('click', function () {
      var c = certificados[Number(b.dataset.ver)];
      $('cf-nome').textContent = nome;
      $('cf-texto').innerHTML = c.final
        ? 'concluiu o <b>Curso Completo de Digitação TypeSkill</b>, com todas as ' + c.total + ' lições dos módulos Letras, Palavras, Frases e Textos.'
        : 'concluiu o <b>' + c.titulo + '</b> do curso de digitação TypeSkill, com as ' + c.total + ' lições do módulo.';
      $('cf-ppm').textContent = c.ppm + ' PPM';
      $('cf-precisao').textContent = c.precisao + '%';
      $('cf-data').textContent = new Date(c.data).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' });
      $('cf-codigo').textContent = codigo((perfil.email || perfil.usuario) + '|' + c.titulo);
      $('cf-selo').textContent = c.icone;
      janela.showModal();
    });
  });
  $('cert-fechar').addEventListener('click', function () { janela.close(); });
  $('cert-imprimir').addEventListener('click', function () { window.print(); });
})();
