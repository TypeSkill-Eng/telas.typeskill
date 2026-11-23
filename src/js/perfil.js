// =========================================================
// TypeSkill — perfil.js (tela Perfil)
// Personagem em pixel art (pronto ou montado), ou foto; nome completo (vai nos
// certificados), bio, objetivo e troca de senha.
// Os dados ficam na conta (contas.js → perfil).
// =========================================================
(function () {
  'use strict';
  var $ = function (id) { return document.getElementById(id); };
  var ORIGINAL = '../public/img/avatar.png';   // o avatar original do TypeSkill (imagem)
  var perfil = Contas.perfil();
  var avatar = Personagens.doAvatar(perfil.avatar);
  var ultimoPixel = Personagens.normalizar(avatar.pixel);   // lembra o personagem quando usa foto
  var r = Progresso.resumo();

  // ---------- cartão da esquerda ----------
  $('p-usuario').textContent = '@' + perfil.usuario;
  $('p-nome-topo').textContent = perfil.nome || perfil.usuario;
  $('p-email').textContent = perfil.email || 'Conta de convidado';
  $('p-desde').textContent = perfil.criadaEm ? 'Membro desde ' + new Date(perfil.criadaEm).toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' }) : 'Sem conta criada';
  $('p-nivel').textContent = r.nivel;
  $('p-xp').textContent = r.xp.toLocaleString('pt-BR');
  $('p-conquistas').textContent = Medalhas.lista().filter(function (m) { return m.ok; }).length;
  $('p-licoes').textContent = Curso.resumo().licoesFeitas;

  if (perfil.convidado) {
    $('p-convidado').hidden = false;
    document.querySelectorAll('#form-perfil input, #form-perfil textarea, #form-perfil select, #form-perfil button, #form-senha input, #form-senha button, #p-foto').forEach(function (el) { el.disabled = true; });
  }

  // ---------- escolha do personagem ----------
  var P = Personagens;
  // personagens prontos + o avatar original (imagem)
  var prontos = P.PRONTOS.map(function (cfg) { return { pixel: cfg }; }).concat([{ foto: ORIGINAL }]);
  $('p-prontos').innerHTML = prontos.map(function (av, i) {
    return av.foto
      ? '<button type="button" data-pronto="' + i + '" aria-label="Personagem original" style="background:#ff6a00"><img src="' + av.foto + '" alt=""></button>'
      : '<button type="button" data-pronto="' + i + '" aria-label="Personagem ' + (i + 1) + '" style="background:' + P.fundo(av.pixel) + '">' + P.svg(av.pixel) + '</button>';
  }).join('');
  $('p-cabelo').innerHTML = Object.keys(P.NOMES_CABELO).map(function (k) { return '<button type="button" data-valor="' + k + '">' + P.NOMES_CABELO[k] + '</button>'; }).join('');
  var paletas = { 'p-cor-cabelo': ['corCabelo', P.CORES_CABELO], 'p-pele': ['pele', P.PELES], 'p-roupa': ['roupa', P.ROUPAS], 'p-fundo': ['fundo', P.FUNDOS] };
  Object.keys(paletas).forEach(function (id) {
    $(id).innerHTML = paletas[id][1].map(function (cor, i) { return '<button type="button" data-i="' + i + '" style="background:' + cor + '" aria-label="Cor ' + (i + 1) + '"></button>'; }).join('');
  });

  function pintarAvatares() {
    desenharAvatar($('p-avatar'), avatar);
    document.querySelectorAll('[data-avatar]').forEach(function (el) { desenharAvatar(el, avatar); });
  }
  function marcarEscolha() {
    var cfg = avatar.pixel ? P.normalizar(avatar.pixel) : null;
    document.querySelectorAll('[data-pronto]').forEach(function (b) {
      var av = prontos[Number(b.dataset.pronto)];
      var igual = av.foto ? avatar.foto === av.foto : (cfg && JSON.stringify(P.normalizar(av.pixel)) === JSON.stringify(cfg));
      b.setAttribute('aria-pressed', String(!!igual));
    });
    document.querySelectorAll('#p-cabelo button').forEach(function (b) { b.setAttribute('aria-pressed', String(!!cfg && b.dataset.valor === cfg.cabelo)); });
    Object.keys(paletas).forEach(function (id) {
      document.querySelectorAll('#' + id + ' button').forEach(function (b) { b.setAttribute('aria-pressed', String(!!cfg && Number(b.dataset.i) === cfg[paletas[id][0]])); });
    });
    $('p-remover-foto').hidden = !avatar.foto;
  }
  function escolher(novo) {
    if (perfil.convidado) return;
    avatar = novo;
    if (novo.pixel) ultimoPixel = P.normalizar(novo.pixel);
    pintarAvatares(); marcarEscolha(); salvarAvatar();
  }
  document.querySelectorAll('[data-pronto]').forEach(function (b) {
    b.addEventListener('click', function () { escolher(JSON.parse(JSON.stringify(prontos[Number(b.dataset.pronto)]))); });
  });
  // montar: cada clique muda uma parte do personagem
  function mudar(parte, valor) {
    var cfg = Object.assign({}, avatar.pixel ? P.normalizar(avatar.pixel) : ultimoPixel);
    cfg[parte] = valor;
    escolher({ pixel: cfg });
  }
  document.querySelectorAll('#p-cabelo button').forEach(function (b) { b.addEventListener('click', function () { mudar('cabelo', b.dataset.valor); }); });
  Object.keys(paletas).forEach(function (id) {
    document.querySelectorAll('#' + id + ' button').forEach(function (b) { b.addEventListener('click', function () { mudar(paletas[id][0], Number(b.dataset.i)); }); });
  });
  // foto: reduz para 160×160 antes de guardar (para caber no navegador)
  $('p-foto').addEventListener('change', function () {
    var arquivo = this.files[0];
    if (!arquivo) return;
    if (!/^image\//.test(arquivo.type)) { aviso('p-aviso-avatar', 'Escolha um arquivo de imagem (JPG ou PNG).', true); return; }
    var img = new Image();
    img.onload = function () {
      var lado = Math.min(img.width, img.height);
      var tela = document.createElement('canvas');
      tela.width = tela.height = 160;
      tela.getContext('2d').drawImage(img, (img.width - lado) / 2, (img.height - lado) / 2, lado, lado, 0, 0, 160, 160);
      URL.revokeObjectURL(img.src);
      escolher({ foto: tela.toDataURL('image/jpeg', .85) });
    };
    img.src = URL.createObjectURL(arquivo);
    this.value = '';
  });
  $('p-remover-foto').addEventListener('click', function () { escolher({ pixel: ultimoPixel }); });
  function salvarAvatar() {
    var res = Contas.atualizarPerfil({ avatar: avatar });
    aviso('p-aviso-avatar', res.ok ? 'Personagem salvo!' : res.erro, !res.ok);
  }
  pintarAvatares();
  marcarEscolha();

  // ---------- dados pessoais ----------
  $('p-nome').value = perfil.nome;
  $('p-bio').value = perfil.bio;
  $('p-objetivo').value = perfil.objetivo;
  var contador = function () { $('p-bio-conta').textContent = $('p-bio').value.length + '/140'; };
  $('p-bio').addEventListener('input', contador);
  contador();

  $('form-perfil').addEventListener('submit', function (e) {
    e.preventDefault();
    var nome = $('p-nome').value.trim().replace(/\s+/g, ' ');
    if (nome && (nome.length < 3 || !/^[A-Za-zÀ-ÿ' ]+$/.test(nome))) {
      erro('p-nome', 'Use só letras e espaços (mínimo 3 letras).');
      return;
    }
    erro('p-nome', '');
    var res = Contas.atualizarPerfil({ nome: nome, bio: $('p-bio').value.trim().slice(0, 140), objetivo: $('p-objetivo').value });
    aviso('p-aviso-dados', res.ok ? 'Dados salvos! O nome já aparece nos certificados.' : res.erro, !res.ok);
    if (res.ok) $('p-nome-topo').textContent = nome || perfil.usuario;
    if (res.ok && window.Medalhas) Medalhas.avaliarEAvisar();
  });

  // ---------- trocar senha ----------
  $('form-senha').addEventListener('submit', function (e) {
    e.preventDefault();
    ['s-atual', 's-nova', 's-repetir'].forEach(function (id) { erro(id, ''); });
    var atual = $('s-atual').value, nova = $('s-nova').value, repetir = $('s-repetir').value;
    if (!atual) return erro('s-atual', 'Digite sua senha atual.');
    var problema = Contas.validarSenha(nova);
    if (problema) return erro('s-nova', problema);
    if (nova !== repetir) return erro('s-repetir', 'As senhas não são iguais.');
    var botao = this.querySelector('button');
    botao.disabled = true;
    Contas.alterarSenha(atual, nova).then(function (res) {
      botao.disabled = false;
      if (!res.ok) { erro(res.campo === 'atual' ? 's-atual' : 's-nova', res.erro); return; }
      $('form-senha').reset();
      aviso('p-aviso-senha', 'Senha alterada com sucesso!', false);
    });
  });

  // ---------- ajudantes ----------
  function erro(id, texto) {
    var campo = $(id).closest('.campo-t');
    var p = campo.querySelector('.campo-t__erro');
    if (!p) { p = document.createElement('span'); p.className = 'campo-t__erro'; campo.append(p); }
    p.textContent = texto;
    p.hidden = !texto;
    campo.classList.toggle('erro', !!texto);
    if (texto) $(id).focus();
  }
  var timers = {};
  function aviso(id, texto, ehErro) {
    var el = $(id);
    el.textContent = texto;
    el.className = 'aviso-t' + (ehErro ? ' aviso-t--erro' : '');
    el.hidden = false;
    clearTimeout(timers[id]);
    timers[id] = setTimeout(function () { el.hidden = true; }, 3500);
  }
})();
