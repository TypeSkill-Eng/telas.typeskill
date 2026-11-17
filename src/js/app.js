// =========================================================
// TypeSkill — app.js (telas de dentro: Início, Missões, Praticar)
// 1. Links "em breve" do menu não fazem nada ao clicar.
// 2. Mostra os números de verdade da conta logada (XP, nível,
//    sequência, meta diária, tempo), lidos do progresso.js.
// =========================================================
(function () {
  document.querySelectorAll('[aria-disabled="true"]').forEach(function (a) {
    a.addEventListener('click', function (e) { e.preventDefault(); });
  });

  // conta logada: botão Sair encerra a sessão e o nome aparece na tela
  if (window.Contas) {
    document.querySelectorAll('.sidebar__sair').forEach(function (a) {
      a.addEventListener('click', function () { Contas.sair(); });
    });
    var conta = Contas.usuarioAtual();
    if (conta) document.querySelectorAll('[data-dado="usuario"]').forEach(function (el) { el.textContent = conta.usuario; });
  }

  // números da digitação desta conta (conta nova = tudo zero)
  if (!window.Progresso) return;
  var r = Progresso.resumo();
  var valores = {
    'xp': '⭐ ' + r.xp.toLocaleString('pt-BR'),
    'sequencia': '🔥 ' + r.sequencia,
    'sequencia-dias': r.sequencia + (r.sequencia === 1 ? ' dia' : ' dias'),
    'nivel': 'Nível ' + r.nivel,
    'xp-nivel': r.xpNoNivel + ' / ' + r.xpPorNivel + ' XP',
    'tempo-total': Math.floor(r.minTotal / 60) + 'h ' + (r.minTotal % 60) + 'm'
  };
  document.querySelectorAll('[data-dado]').forEach(function (el) {
    var v = valores[el.getAttribute('data-dado')];
    if (v !== undefined) el.textContent = v;
  });
  document.querySelectorAll('[data-barra="nivel"]').forEach(function (el) {
    el.style.width = (r.xpNoNivel / r.xpPorNivel * 100) + '%';
  });

  // meta diária do menu (na Prática o praticar.js também atualiza ao vivo)
  var metaMin = document.getElementById('meta-min');
  if (metaMin) {
    metaMin.textContent = r.minHoje;
    document.getElementById('meta-barra').style.width = Math.min(100, r.minHoje / r.metaMin * 100) + '%';
    document.getElementById('meta-frase').textContent = r.minHoje >= r.metaMin ? 'Meta batida! 🎉' : (r.minHoje > 0 ? 'Continue assim!' : 'Bora começar o dia?');
  }
})();
