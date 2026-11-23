// =========================================================
// TypeSkill — app.js (todas as telas de dentro do app)
// 1. Sair, nome e avatar da conta logada.
// 2. Mostra os números de verdade da conta (XP, nível, sequência,
//    meta diária, tempo), lidos do progresso.js.
// 3. Confere se ganhou conquista nova (medalhas.js) e avisa.
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
    // avatar (emoji com cor de fundo, ou foto) em todo lugar marcado com data-avatar
    var avatar = Contas.perfil().avatar;
    document.querySelectorAll('[data-avatar]').forEach(function (el) { desenharAvatar(el, avatar); });
  }

  // números da digitação desta conta (conta nova = tudo zero)
  if (!window.Progresso) return;
  if (Progresso.ajustes().reduzirAnimacoes) document.documentElement.classList.add('sem-animacoes');
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
    var alvo = document.getElementById('meta-alvo');
    if (alvo) alvo.textContent = r.metaMin;
    document.getElementById('meta-barra').style.width = Math.min(100, r.minHoje / r.metaMin * 100) + '%';
    document.getElementById('meta-frase').textContent = r.minHoje >= r.metaMin ? 'Meta batida! 🎉' : (r.minHoje > 0 ? 'Continue assim!' : 'Bora começar o dia?');
  }

  // conquistas novas? mostra o aviso no canto
  if (window.Medalhas) Medalhas.avaliarEAvisar();
})();

// desenha um avatar: personagem em pixel art ({ pixel }) ou foto ({ foto })
function desenharAvatar(el, avatar) {
  avatar = window.Personagens ? Personagens.doAvatar(avatar) : avatar;
  el.classList.add('avatar');
  if (avatar.foto) {
    el.innerHTML = '<img src="' + avatar.foto + '" alt="">';
    el.style.background = '#1d1b26';
  } else if (window.Personagens) {
    el.innerHTML = Personagens.svg(avatar.pixel);
    el.style.background = Personagens.fundo(avatar.pixel);
  }
}
