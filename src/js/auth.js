// =========================================================
// TypeSkill — auth.js (telas de entrada)
// Cadastro, Login, Recuperar senha e Nova senha.
// Usa o "banco" do contas.js (precisa ser carregado antes deste arquivo).
// Cada parte só roda se o formulário dela existir na página.
// =========================================================
(function () {
  'use strict';
  var $ = function (id) { return document.getElementById(id); };

  // ---------- Ajudantes de mensagem ----------
  // mostra (ou apaga) a mensagem de erro embaixo de um campo
  function erroCampo(input, texto) {
    var caixa = input.closest('.campo');
    var id = 'erro-' + input.id;
    var p = $(id);
    if (!p) {
      p = document.createElement('p');
      p.id = id;
      p.className = 'campo-erro';
      p.setAttribute('aria-live', 'polite');
      caixa.insertAdjacentElement('afterend', p);
      input.setAttribute('aria-describedby', id);
    }
    p.textContent = texto || '';
    p.hidden = !texto;
    caixa.classList.toggle('campo--erro', !!texto);
    caixa.classList.toggle('campo--ok', !texto && input.value.trim() !== '');
    input.setAttribute('aria-invalid', texto ? 'true' : 'false');
    return !texto;
  }

  // valida ao sair do campo e, depois disso, a cada letra digitada
  function validarAoDigitar(input, validar) {
    var mexeu = false;
    input.addEventListener('blur', function () { if (input.value) { mexeu = true; erroCampo(input, validar()); } });
    input.addEventListener('input', function () {
      // já mexeu, ou já apareceu erro (ex.: depois de clicar em enviar): confere de novo
      if (mexeu || input.closest('.campo').classList.contains('campo--erro')) erroCampo(input, validar());
    });
  }

  function aviso(el, texto, tipo) {
    el.textContent = texto;
    el.hidden = !texto;
    el.dataset.tipo = tipo || 'erro';
  }

  function carregando(botao, sim, texto) {
    if (!botao.dataset.texto) botao.dataset.texto = botao.textContent.trim();
    botao.disabled = sim;
    botao.textContent = sim ? texto : botao.dataset.texto;
  }

  // checklist da senha (✓ / ✗) + barrinha de força
  function montarChecklist(inputSenha) {
    var caixa = document.createElement('div');
    caixa.className = 'senha-ajuda';
    caixa.innerHTML = '<div class="senha-forca" aria-hidden="true"><span></span></div><ul class="senha-regras"></ul>';
    inputSenha.closest('.campo').insertAdjacentElement('afterend', caixa);
    var barra = caixa.querySelector('.senha-forca span');
    var lista = caixa.querySelector('.senha-regras');
    var nomes = ['Muito fraca', 'Fraca', 'Média', 'Boa', 'Forte'];
    function atualizar() {
      var v = inputSenha.value;
      lista.innerHTML = Contas.requisitosSenha(v).map(function (r) {
        return '<li class="' + (r.ok ? 'ok' : '') + '">' + (r.ok ? '✓' : '•') + ' ' + r.texto + '</li>';
      }).join('');
      var f = v ? Contas.forcaSenha(v) : 0;
      barra.style.width = v ? (f + 1) * 20 + '%' : '0';
      barra.dataset.forca = f;
      barra.title = v ? nomes[f] : '';
    }
    inputSenha.addEventListener('input', atualizar);
    atualizar();
  }

  // botão de olho para mostrar/esconder a senha
  function botaoOlho(inputSenha) {
    var b = document.createElement('button');
    b.type = 'button';
    b.className = 'campo-olho';
    b.setAttribute('aria-label', 'Mostrar senha');
    b.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/></svg>';
    b.addEventListener('click', function () {
      var mostrar = inputSenha.type === 'password';
      inputSenha.type = mostrar ? 'text' : 'password';
      b.setAttribute('aria-label', mostrar ? 'Esconder senha' : 'Mostrar senha');
      b.classList.toggle('ativo', mostrar);
      inputSenha.focus();
    });
    inputSenha.insertAdjacentElement('afterend', b);
  }

  // botões "com Google": não temos login do Google de verdade, então entra como convidado
  document.querySelectorAll('.cartao__google').forEach(function (a) {
    a.addEventListener('click', function (e) {
      e.preventDefault();
      Contas.entrarComoConvidado();
      location.href = 'inicio.html';
    });
  });


  // ---------- 1. CADASTRO ----------
  var formCadastro = $('form-cadastro');
  if (formCadastro) {
    var usuario = $('usuario'), email = $('email'), senha = $('senha');
    var msg = $('mensagem-cadastro');
    var botao = formCadastro.querySelector('button[type="submit"]');
    montarChecklist(senha);
    botaoOlho(senha);
    validarAoDigitar(usuario, function () { return Contas.validarUsuario(usuario.value); });
    validarAoDigitar(email, function () { return Contas.validarEmail(email.value, false); });
    validarAoDigitar(senha, function () { return Contas.validarSenha(senha.value); });

    formCadastro.addEventListener('submit', function (e) {
      e.preventDefault();
      aviso(msg, '');
      var ok = [
        erroCampo(usuario, Contas.validarUsuario(usuario.value)),
        erroCampo(email, Contas.validarEmail(email.value, false)),
        erroCampo(senha, Contas.validarSenha(senha.value))
      ];
      var primeiroErrado = [usuario, email, senha][ok.indexOf(false)];
      if (primeiroErrado) { primeiroErrado.focus(); return; }

      carregando(botao, true, 'Criando conta...');
      Contas.criar({ usuario: usuario.value, email: email.value, senha: senha.value }).then(function (r) {
        if (!r.ok) {
          carregando(botao, false);
          erroCampo($(r.campo), r.erro);
          $(r.campo).focus();
          return;
        }
        aviso(msg, 'Conta criada! Entrando...', 'ok');
        setTimeout(function () { location.href = 'inicio.html'; }, 900);
      });
    });
  }


  // ---------- 2. LOGIN ----------
  var formLogin = $('form-login');
  if (formLogin) {
    var login = $('email'), senhaLogin = $('senha');
    var erroLogin = $('erro-login');
    var botaoLogin = formLogin.querySelector('button[type="submit"]');
    var cartao = formLogin.closest('.cartao');
    botaoOlho(senhaLogin);

    // veio do cadastro/nova senha? já deixa o e-mail preenchido
    var veio = new URLSearchParams(location.search).get('email');
    if (veio) { login.value = veio; senhaLogin.focus(); }
    if (new URLSearchParams(location.search).get('senha') === 'nova') aviso(erroLogin, 'Senha alterada! Entre com a nova senha.', 'ok');

    [login, senhaLogin].forEach(function (i) { i.addEventListener('input', function () { if (erroLogin.dataset.tipo === 'erro') aviso(erroLogin, ''); }); });

    formLogin.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!login.value.trim()) { aviso(erroLogin, 'Digite seu e-mail ou nome de usuário.'); login.focus(); return; }
      if (!senhaLogin.value) { aviso(erroLogin, 'Digite sua senha.'); senhaLogin.focus(); return; }

      carregando(botaoLogin, true, 'Entrando...');
      Contas.prontas.then(function () { return Contas.entrar(login.value, senhaLogin.value); }).then(function (r) {
        if (r.ok) { location.href = 'inicio.html'; return; }
        carregando(botaoLogin, false);
        aviso(erroLogin, r.erro);
        senhaLogin.value = '';
        senhaLogin.focus();
        cartao.classList.remove('treme'); void cartao.offsetWidth; cartao.classList.add('treme');
      });
    });
  }


  // ---------- 3. RECUPERAR SENHA ----------
  // Sem servidor de e-mail: geramos um código de 4 números e guardamos
  // na sessão do navegador. A tela do código mostra ele (modo de teste).
  var formRecuperar = $('form-recuperar');
  if (formRecuperar) {
    var emailRec = $('email');
    var botaoRec = formRecuperar.querySelector('button[type="submit"]');
    validarAoDigitar(emailRec, function () { return Contas.validarEmail(emailRec.value, true); });

    formRecuperar.addEventListener('submit', function (e) {
      e.preventDefault();
      Contas.prontas.then(function () {
        if (!erroCampo(emailRec, Contas.validarEmail(emailRec.value, true))) { emailRec.focus(); return; }
        var codigo = String(Math.floor(1000 + Math.random() * 9000));
        var mail = emailRec.value.trim().toLowerCase();
        sessionStorage.setItem('typeskill-recuperacao', JSON.stringify({ email: mail, codigo: codigo, ate: Date.now() + 10 * 60 * 1000 }));
        carregando(botaoRec, true, 'Enviando...');
        setTimeout(function () { location.href = 'codigo.html?email=' + encodeURIComponent(mail); }, 500);
      });
    });
  }


  // ---------- 4. NOVA SENHA ----------
  var formNova = $('form-nova-senha');
  if (formNova) {
    var nova = $('senha'), confirmar = $('confirmar');
    var msgNova = $('mensagem-nova');
    var botaoNova = formNova.querySelector('button[type="submit"]');
    var rec = null;
    try { rec = JSON.parse(sessionStorage.getItem('typeskill-recuperacao')); } catch (er) { rec = null; }

    // só chega aqui quem confirmou o código
    if (!rec || !rec.confirmado || Date.now() > rec.ate) {
      aviso(msgNova, 'Seu código expirou ou não foi confirmado. Peça um novo código.');
      formNova.querySelectorAll('input, button').forEach(function (el) { el.disabled = true; });
    } else {
      $('email-conta').textContent = rec.email;
    }

    montarChecklist(nova);
    botaoOlho(nova);
    var conferir = function () { return confirmar.value !== nova.value ? 'As senhas não são iguais.' : ''; };
    validarAoDigitar(nova, function () { return Contas.validarSenha(nova.value); });
    validarAoDigitar(confirmar, conferir);

    formNova.addEventListener('submit', function (e) {
      e.preventDefault();
      var ok1 = erroCampo(nova, Contas.validarSenha(nova.value));
      var ok2 = erroCampo(confirmar, conferir() || (confirmar.value ? '' : 'Repita a nova senha.'));
      if (!ok1) { nova.focus(); return; }
      if (!ok2) { confirmar.focus(); return; }
      carregando(botaoNova, true, 'Salvando...');
      Contas.trocarSenha(rec.email, nova.value).then(function (r) {
        if (!r.ok) { carregando(botaoNova, false); aviso(msgNova, r.erro); return; }
        sessionStorage.removeItem('typeskill-recuperacao');
        location.href = 'login.html?senha=nova&email=' + encodeURIComponent(rec.email);
      });
    });
  }
})();
