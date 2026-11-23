// =========================================================
// TypeSkill — configuracoes.js (tela Configurações)
// - Prática: tipo, dificuldade e duração que o Praticar abre,
//   mãos virtuais e som (chave "typeskill-config", a mesma do Praticar).
// - Meta diária e "reduzir animações" (por conta, progresso.js).
// - Dados: baixar meus dados, zerar progresso, excluir conta.
// Tudo salva sozinho ao clicar.
// =========================================================
(function () {
  'use strict';
  var $ = function (id) { return document.getElementById(id); };
  var PADRAO = { tipo: 'frases', dificuldade: 'medio', duracao: '5', minutos: 10, maos: true, som: false };
  var config;
  try { config = Object.assign({}, PADRAO, JSON.parse(localStorage.getItem('typeskill-config')) || {}); } catch (e) { config = Object.assign({}, PADRAO); }
  var ajustes = Progresso.ajustes();
  var perfil = Contas.perfil();

  function salvarConfig() {
    try { localStorage.setItem('typeskill-config', JSON.stringify(config)); } catch (e) { /* ignora */ }
    salvo();
  }
  var timer;
  function salvo() {
    var el = $('cfg-salvo');
    el.hidden = false;
    clearTimeout(timer);
    timer = setTimeout(function () { el.hidden = true; }, 1800);
  }

  // ---------- botões de escolha (segmentos) ----------
  function segmento(id, valorAtual, aoEscolher) {
    var caixa = $(id);
    var botoes = caixa.querySelectorAll('button');
    function marcar(v) { botoes.forEach(function (b) { b.setAttribute('aria-pressed', String(b.dataset.valor === String(v))); }); }
    botoes.forEach(function (b) { b.addEventListener('click', function () { marcar(b.dataset.valor); aoEscolher(b.dataset.valor); }); });
    marcar(valorAtual);
  }
  segmento('cfg-tipo', config.tipo, function (v) { config.tipo = v; salvarConfig(); });
  segmento('cfg-dificuldade', config.dificuldade, function (v) { config.dificuldade = v; salvarConfig(); });
  segmento('cfg-duracao', config.duracao, function (v) {
    config.duracao = v;
    $('cfg-minutos-caixa').hidden = v !== 'custom';
    salvarConfig();
  });
  $('cfg-minutos-caixa').hidden = config.duracao !== 'custom';
  $('cfg-minutos').value = config.minutos;
  $('cfg-minutos').addEventListener('change', function () {
    config.minutos = Math.min(60, Math.max(1, Math.round(Number(this.value) || 10)));
    this.value = config.minutos;
    salvarConfig();
  });
  segmento('cfg-meta', ajustes.metaMin, function (v) {
    Progresso.salvarAjustes({ metaMin: Number(v) });
    document.getElementById('meta-alvo').textContent = v;
    var min = Progresso.resumo().minHoje;
    document.getElementById('meta-barra').style.width = Math.min(100, min / Number(v) * 100) + '%';
    salvo();
  });

  // ---------- interruptores ----------
  $('cfg-maos').checked = config.maos;
  $('cfg-maos').addEventListener('change', function () { config.maos = this.checked; salvarConfig(); });
  $('cfg-som').checked = config.som;
  $('cfg-som').addEventListener('change', function () { config.som = this.checked; salvarConfig(); });
  $('cfg-animacoes').checked = ajustes.reduzirAnimacoes;
  $('cfg-animacoes').addEventListener('change', function () {
    Progresso.salvarAjustes({ reduzirAnimacoes: this.checked });
    document.documentElement.classList.toggle('sem-animacoes', this.checked);
    salvo();
  });

  // ---------- dados ----------
  var id = perfil.email || perfil.usuario;
  var ler = function (k) { try { return JSON.parse(localStorage.getItem(k)); } catch (e) { return null; } };

  // baixa um arquivo .json com tudo da conta (sem a senha)
  $('cfg-exportar').addEventListener('click', function () {
    var dados = {
      app: 'TypeSkill', exportadoEm: new Date().toISOString(),
      conta: { usuario: perfil.usuario, email: perfil.email, criadaEm: perfil.criadaEm, nome: perfil.nome, bio: perfil.bio, objetivo: perfil.objetivo },
      progresso: ler('typeskill-progresso:' + id),
      missoes: ler('typeskill-missoes:' + id),
      ajustes: ler('typeskill-ajustes:' + id),
      config: config
    };
    var arquivo = new Blob([JSON.stringify(dados, null, 2)], { type: 'application/json' });
    var a = document.createElement('a');
    a.href = URL.createObjectURL(arquivo);
    a.download = 'typeskill-' + perfil.usuario + '.json';
    document.body.append(a);
    a.click();
    a.remove();
    setTimeout(function () { URL.revokeObjectURL(a.href); }, 1000);
  });

  // confirmação: precisa digitar uma palavra para liberar o botão
  var janela = $('cfg-janela');
  var acao = null;
  function confirmar(opcoes) {
    acao = opcoes;
    $('cfg-j-titulo').textContent = opcoes.titulo;
    $('cfg-j-texto').textContent = opcoes.texto;
    $('cfg-j-palavra').textContent = opcoes.palavra;
    $('cfg-j-campo').value = '';
    $('cfg-j-ok').disabled = true;
    $('cfg-j-ok').textContent = opcoes.botao;
    janela.showModal();
    $('cfg-j-campo').focus();
  }
  $('cfg-j-campo').addEventListener('input', function () {
    $('cfg-j-ok').disabled = this.value.trim().toLowerCase() !== acao.palavra.toLowerCase();
  });
  $('cfg-j-cancelar').addEventListener('click', function () { janela.close(); });
  $('cfg-j-form').addEventListener('submit', function (e) {
    e.preventDefault();
    if ($('cfg-j-ok').disabled) return;
    acao.fazer();
  });

  $('cfg-zerar').addEventListener('click', function () {
    confirmar({
      titulo: 'Zerar todo o progresso?',
      texto: 'XP, nível, sessões, conquistas e missões desta conta voltam para o zero. Sua conta e seu perfil continuam.',
      palavra: 'ZERAR', botao: 'Zerar progresso',
      fazer: function () {
        localStorage.removeItem('typeskill-progresso:' + id);
        localStorage.removeItem('typeskill-missoes:' + id);
        location.href = 'inicio.html';
      }
    });
  });
  $('cfg-excluir').addEventListener('click', function () {
    confirmar({
      titulo: 'Excluir sua conta?',
      texto: 'A conta e todos os dados dela são apagados deste navegador. Não dá para desfazer.',
      palavra: perfil.usuario, botao: 'Excluir conta',
      fazer: function () {
        Contas.excluirConta();
        location.href = '../index.html';
      }
    });
  });
  if (perfil.convidado) { $('cfg-excluir').disabled = true; $('cfg-excluir').title = 'Convidado não tem conta para excluir'; }
})();
