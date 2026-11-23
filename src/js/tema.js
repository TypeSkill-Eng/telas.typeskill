// =========================================================
// TypeSkill — tema.js (modo noturno do site inteiro)
// Carregado no <head> de TODAS as páginas, antes de desenhar,
// para a tela já abrir no tema certo (sem "piscar" branco).
// O tema fica salvo no navegador ("typeskill-tema") e vale para
// a landing, login/cadastro e todas as telas de dentro.
// Qualquer botão com data-alternar-tema liga/desliga o modo.
// =========================================================
(function () {
  var raiz = document.documentElement;
  var salvo = null;
  try { salvo = localStorage.getItem('typeskill-tema'); } catch (e) { /* sem acesso ao armazenamento */ }
  if (salvo === 'escuro') raiz.classList.add('tema-escuro');

  function atualizarBotoes() {
    var escuro = raiz.classList.contains('tema-escuro');
    document.querySelectorAll('[data-alternar-tema]').forEach(function (b) {
      b.setAttribute('aria-pressed', String(escuro));
      var rotulo = b.querySelector('[data-tema-rotulo]');
      if (rotulo) rotulo.textContent = escuro ? 'Modo claro' : 'Modo noturno';
    });
    document.querySelectorAll('[data-tema-check]').forEach(function (c) { c.checked = escuro; });
  }
  function definir(escuro) {
    raiz.classList.toggle('tema-escuro', escuro);
    try { localStorage.setItem('typeskill-tema', escuro ? 'escuro' : 'claro'); } catch (e) { /* ignora */ }
    atualizarBotoes();
  }

  document.addEventListener('click', function (e) {
    var b = e.target.closest && e.target.closest('[data-alternar-tema]');
    if (b) { e.preventDefault(); definir(!raiz.classList.contains('tema-escuro')); }
  });
  document.addEventListener('change', function (e) {
    if (e.target.matches && e.target.matches('[data-tema-check]')) definir(e.target.checked);
  });
  document.addEventListener('DOMContentLoaded', atualizarBotoes);

  window.Tema = { definir: definir, escuro: function () { return raiz.classList.contains('tema-escuro'); } };
})();
