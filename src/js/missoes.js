// =========================================================
// TypeSkill — missoes.js
// Monta a tela de Missões a partir do curso.js, com o progresso
// da conta que está logada (conta nova = tudo do zero).
// =========================================================
(function () {
  'use strict';
  var $ = function (id) { return document.getElementById(id); };
  var NOMES_DIF = { facil: ['Fácil', 'easy'], medio: ['Médio', 'medium'], dificil: ['Difícil', 'hard'] };
  var ICONE = {
    feita: '<svg viewBox="0 0 24 24" fill="none" stroke="#22b07d" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9" stroke-width="1.8"/><path d="m8 12.5 2.8 2.8L16.5 9.5"/></svg>',
    aberta: '<svg viewBox="0 0 24 24" fill="none" stroke="#ff6a00" stroke-width="1.8"><circle cx="12" cy="12" r="9"/><path d="M10 8.5v7l5.5-3.5z" fill="#ff6a00" stroke="none"/></svg>',
    bloqueada: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" fill="#e5e7eb"/><path d="M9 14v-2a3 3 0 0 1 6 0v2z" fill="#6b7280"/></svg>'
  };
  var BADGE = {
    done: '<span class="badge-icon green"><svg viewBox="0 0 24 24"><path d="M5 12.5 10 17.5 19 7"/></svg></span>',
    active: '<span class="badge-icon orange"><svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z" stroke-linejoin="round"/></svg></span>',
    locked: '<span class="badge-icon gray"><svg viewBox="0 0 24 24"><path d="M7 15v-2a5 5 0 0 1 10 0v2z" stroke="none"/><rect x="6" y="14" width="12" height="5" rx="1.5" stroke="none"/></svg></span>'
  };

  function formatarTempo(ms) {
    var min = Math.round(ms / 60000);
    return min < 60 ? min + ' min' : Math.floor(min / 60) + 'h ' + (min % 60) + 'm';
  }

  function linhaLicao(l, atual) {
    var feita = Curso.concluida(l.id), aberta = Curso.aberta(l.id);
    var pct = Curso.porcentagem(l.id);
    var dif = NOMES_DIF[l.dificuldade];
    var link = 'praticar.html?missao=' + l.id;
    var classe = feita ? 'feita' : (atual ? 'current' : (aberta ? '' : 'bloqueada'));
    var acao = feita
      ? '<a class="btn" href="' + link + '">Rever</a>'
      : aberta
        ? '<a class="btn primary" href="' + link + '">' + (pct > 0 ? 'Continuar' : 'Começar') + '</a>'
        : '<button class="btn locked" disabled>• Bloqueado</button>';
    var barra = pct > 0 ? '<div class="bar-fill ' + (feita ? 'green' : 'orange') + '" style="width:' + pct + '%"></div>' : '';
    return '<tr class="' + classe + '">' +
      '<td><div class="lesson-name">' + ICONE[feita ? 'feita' : (aberta ? 'aberta' : 'bloqueada')] +
        '<span>' + l.id + ' ' + l.nome + '<small class="lesson-meta">' + l.minutos + ' min</small></span></div></td>' +
      '<td class="lesson-obj">' + l.objetivo + '</td>' +
      '<td class="lesson-obj">' + l.ppm + ' PPM · ' + l.precisao + '%</td>' +
      '<td><span class="tag ' + dif[1] + '">' + dif[0] + '</span></td>' +
      '<td><div class="progress-cell"><span>' + pct + '%</span><div class="bar-track">' + barra + '</div></div></td>' +
      '<td>' + acao + '</td></tr>';
  }

  function montar() {
    var atual = Curso.atual();
    var html = Curso.CURSO.map(function (m, i) {
      var feitas = m.licoes.filter(function (l) { return Curso.concluida(l.id); }).length;
      var estado = feitas === m.licoes.length ? 'done' : (Curso.aberta(m.licoes[0].id) ? 'active' : 'locked');
      var aberto = atual && atual.modulo === m.id;
      var pill = estado === 'done' ? '<span class="pill green">Concluído</span>'
        : estado === 'active' ? '<span class="pill orange">' + feitas + ' / ' + m.licoes.length + ' lições</span>'
        : '<span class="pill gray">Bloqueado</span>';
      return '<section class="module ' + estado + (aberto ? ' open' : '') + '" style="--degrau:' + i + '">' +
        '<button class="module-head" aria-expanded="' + !!aberto + '">' + BADGE[estado] +
          '<span class="module-info"><h2><span class="module-num">' + m.id + '</span>' + m.nome + '</h2>' +
          '<p>' + m.descricao + (estado === 'locked' ? ' Conclua o módulo ' + (m.id - 1) + ' para abrir.' : '') + '</p>' +
          '<span class="module-bar"><i style="width:' + Math.round(feitas / m.licoes.length * 100) + '%"></i></span></span>' +
          pill + '<svg class="chevron" viewBox="0 0 24 24"><path d="m6 9 6 6 6-6"/></svg></button>' +
        '<div class="lessons"><div class="modulo-mundo">' + Mundos.mapa(m, m.licoes.map(function (l) {
            return { id: l.id, nome: l.nome, link: 'praticar.html?missao=' + l.id,
              estado: Curso.concluida(l.id) ? 'feita' : (atual && atual.id === l.id ? 'atual' : 'bloqueada') };
          }), { linkPremio: 'certificados.html' }) + '</div>' +
          '<table class="lessons-table"><thead><tr>' +
          '<th style="width:22%">Lição</th><th style="width:28%">Objetivo</th><th>Meta</th><th>Dificuldade</th><th>Progresso</th><th>Ação</th>' +
        '</tr></thead><tbody>' +
          m.licoes.map(function (l) { return linhaLicao(l, atual && atual.id === l.id); }).join('') +
        '</tbody></table></div></section>';
    }).join('');
    $('modulos').innerHTML = html;

    // acordeão: clicar no cabeçalho abre/fecha (bloqueado não abre)
    document.querySelectorAll('.module-head').forEach(function (cabeca) {
      cabeca.addEventListener('click', function () {
        var modulo = cabeca.closest('.module');
        if (modulo.classList.contains('locked')) return;
        cabeca.setAttribute('aria-expanded', modulo.classList.toggle('open'));
      });
    });

    // resumo
    var r = Curso.resumo();
    $('anel-barra').setAttribute('stroke-dasharray', (r.porcentagem / 100 * 377).toFixed(1) + ' 377');
    $('anel-numero').textContent = r.porcentagem + '%';
    $('anel').setAttribute('aria-label', r.porcentagem + '% do curso concluído');
    $('r-modulos').textContent = r.modulosFeitos + ' / ' + r.totalModulos;
    $('r-licoes').textContent = r.licoesFeitas + ' / ' + r.totalLicoes;
    $('r-tempo').textContent = formatarTempo(r.tempoMs);

    // a jornada começa quando a conta foi criada
    var sessao = window.Contas && Contas.usuarioAtual();
    var contaSalva = sessao && sessao.email ? Contas.buscar(sessao.email) : null;
    var inicio = (contaSalva && contaSalva.criadaEm) || Curso.dados().inicio;
    $('r-inicio').textContent = inicio ? new Date(inicio).toLocaleDateString('pt-BR') : 'hoje';

    var seguir = $('r-seguir');
    if (atual) {
      seguir.href = 'praticar.html?missao=' + atual.id;
      seguir.textContent = (r.licoesFeitas || Curso.porcentagem(atual.id) ? 'Continuar: ' : 'Começar: ') + atual.id + ' ' + atual.nome;
    } else {
      seguir.href = 'praticar.html';
      seguir.textContent = '🏆 Curso completo! Treino livre';
    }
  }

  montar();
})();
