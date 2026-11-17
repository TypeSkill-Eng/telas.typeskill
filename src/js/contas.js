// =========================================================
// TypeSkill — contas.js  ("banco de dados" de contas, em JavaScript)
//
// Não temos servidor, então as contas ficam guardadas no próprio
// navegador (localStorage), na chave "typeskill-contas".
// A senha NUNCA é guardada como texto: guardamos um "hash" SHA-256
// (um código embaralhado que não dá para desfazer) + um "sal"
// (um texto aleatório diferente para cada conta).
//
// Qualquer página pode usar:  Contas.criar(...), Contas.entrar(...),
// Contas.usuarioAtual(), Contas.sair(), Contas.protegerPagina()...
//
// ⚠️ Isto é para um projeto de estudo. Em um site de verdade, as contas
// precisam ficar num servidor/banco de dados, nunca só no navegador.
// =========================================================
(function () {
  var CHAVE_CONTAS = 'typeskill-contas';
  var CHAVE_SESSAO = 'typeskill-sessao';

  // Contas que já vêm prontas para testar o login (pode adicionar mais aqui).
  // A senha é transformada em hash na primeira vez que o site abre.
  var CONTAS_INICIAIS = [
    { usuario: 'player01', email: 'teste@typeskill.com', senha: 'teste123' }
  ];

  // ---------- Regras de validação ----------
  var REGRAS = {
    usuario: /^[a-zA-Z0-9_.]{3,20}$/,                          // 3 a 20: letras, números, _ e .
    email: /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/,                   // algo@algo.com
    senhaMin: 8
  };

  function validarUsuario(usuario) {
    usuario = (usuario || '').trim();
    if (!usuario) return 'Digite um nome de usuário.';
    if (usuario.length < 3) return 'O usuário precisa ter pelo menos 3 caracteres.';
    if (usuario.length > 20) return 'O usuário pode ter no máximo 20 caracteres.';
    if (!REGRAS.usuario.test(usuario)) return 'Use só letras, números, ponto ou _ (sem espaço e sem acento).';
    if (buscar(usuario)) return 'Esse nome de usuário já está em uso.';
    return '';
  }

  function validarEmail(email, deveExistir) {
    email = (email || '').trim().toLowerCase();
    if (!email) return 'Digite seu e-mail.';
    if (!REGRAS.email.test(email)) return 'E-mail inválido. Exemplo: nome@gmail.com';
    var existe = !!buscar(email);
    if (deveExistir && !existe) return 'Não encontramos nenhuma conta com esse e-mail.';
    if (!deveExistir && existe) return 'Esse e-mail já está cadastrado. Que tal fazer login?';
    return '';
  }

  // devolve a lista de requisitos da senha (para mostrar ✓ / ✗ na tela)
  function requisitosSenha(senha) {
    senha = senha || '';
    return [
      { texto: 'Pelo menos ' + REGRAS.senhaMin + ' caracteres', ok: senha.length >= REGRAS.senhaMin },
      { texto: 'Uma letra', ok: /[a-zA-Z]/.test(senha) },
      { texto: 'Um número', ok: /[0-9]/.test(senha) },
      { texto: 'Sem espaços', ok: senha.length > 0 && !/\s/.test(senha) }
    ];
  }
  function validarSenha(senha) {
    var falta = requisitosSenha(senha).filter(function (r) { return !r.ok; });
    return falta.length ? 'A senha precisa ter: ' + falta.map(function (r) { return r.texto.toLowerCase(); }).join(', ') + '.' : '';
  }
  // força da senha de 0 a 4 (para a barrinha colorida)
  function forcaSenha(senha) {
    senha = senha || '';
    var pontos = 0;
    if (senha.length >= REGRAS.senhaMin) pontos++;
    if (senha.length >= 12) pontos++;
    if (/[a-z]/.test(senha) && /[A-Z]/.test(senha)) pontos++;
    if (/[0-9]/.test(senha) && /[^a-zA-Z0-9]/.test(senha)) pontos++;
    return pontos;
  }

  // ---------- Guardar e ler ----------
  function ler(chave, padrao) {
    try { var v = JSON.parse(localStorage.getItem(chave)); return v === null ? padrao : v; }
    catch (e) { return padrao; }
  }
  function gravar(chave, valor) { localStorage.setItem(chave, JSON.stringify(valor)); }

  function listar() { return ler(CHAVE_CONTAS, []); }

  // procura por e-mail OU nome de usuário (sem diferenciar maiúscula/minúscula)
  function buscar(emailOuUsuario) {
    var alvo = (emailOuUsuario || '').trim().toLowerCase();
    if (!alvo) return null;
    return listar().find(function (c) { return c.email === alvo || c.usuario.toLowerCase() === alvo; }) || null;
  }

  // ---------- Hash da senha ----------
  function gerarSal() {
    var bytes = new Uint8Array(16);
    (window.crypto || {}).getRandomValues ? crypto.getRandomValues(bytes) : bytes.forEach(function (_, i) { bytes[i] = Math.random() * 256; });
    return Array.from(bytes, function (b) { return b.toString(16).padStart(2, '0'); }).join('');
  }
  function hashSenha(senha, sal) {
    var texto = sal + ':' + senha;
    if (window.crypto && crypto.subtle) {
      return crypto.subtle.digest('SHA-256', new TextEncoder().encode(texto)).then(function (buf) {
        return Array.from(new Uint8Array(buf), function (b) { return b.toString(16).padStart(2, '0'); }).join('');
      });
    }
    // reserva para navegadores sem crypto.subtle (ex.: site aberto por http comum)
    var h = 5381;
    for (var i = 0; i < texto.length; i++) h = ((h << 5) + h + texto.charCodeAt(i)) >>> 0;
    return Promise.resolve('simples-' + h.toString(16));
  }

  // ---------- Ações ----------
  // cria a conta; devolve { ok: true } ou { ok: false, campo, erro }
  function criar(dados) {
    var usuario = (dados.usuario || '').trim();
    var email = (dados.email || '').trim().toLowerCase();
    var erro;
    if ((erro = validarUsuario(usuario))) return Promise.resolve({ ok: false, campo: 'usuario', erro: erro });
    if ((erro = validarEmail(email, false))) return Promise.resolve({ ok: false, campo: 'email', erro: erro });
    if ((erro = validarSenha(dados.senha))) return Promise.resolve({ ok: false, campo: 'senha', erro: erro });

    var sal = gerarSal();
    return hashSenha(dados.senha, sal).then(function (hash) {
      var contas = listar();
      contas.push({ usuario: usuario, email: email, sal: sal, hash: hash, criadaEm: new Date().toISOString() });
      gravar(CHAVE_CONTAS, contas);
      iniciarSessao(usuario, email);
      return { ok: true };
    });
  }

  // confere e-mail/usuário + senha; devolve { ok } ou { ok: false, erro }
  function entrar(emailOuUsuario, senha) {
    var conta = buscar(emailOuUsuario);
    // mesma mensagem para "não existe" e "senha errada": não entrega quais e-mails existem
    var falhou = { ok: false, erro: 'E-mail/usuário ou senha incorretos. Tente novamente.' };
    if (!conta || !senha) return Promise.resolve(falhou);
    return hashSenha(senha, conta.sal).then(function (hash) {
      if (hash !== conta.hash) return falhou;
      iniciarSessao(conta.usuario, conta.email);
      return { ok: true };
    });
  }

  // troca a senha de uma conta (usado depois de confirmar o código)
  function trocarSenha(email, novaSenha) {
    var erro = validarSenha(novaSenha);
    if (erro) return Promise.resolve({ ok: false, erro: erro });
    var sal = gerarSal();
    return hashSenha(novaSenha, sal).then(function (hash) {
      var contas = listar();
      var conta = contas.find(function (c) { return c.email === (email || '').toLowerCase(); });
      if (!conta) return { ok: false, erro: 'Conta não encontrada.' };
      conta.sal = sal; conta.hash = hash;
      gravar(CHAVE_CONTAS, contas);
      return { ok: true };
    });
  }

  function entrarComoConvidado() { iniciarSessao('convidado', ''); }

  function iniciarSessao(usuario, email) { gravar(CHAVE_SESSAO, { usuario: usuario, email: email, desde: new Date().toISOString() }); }
  function usuarioAtual() { return ler(CHAVE_SESSAO, null); }
  function sair() { localStorage.removeItem(CHAVE_SESSAO); }

  // telas de dentro: sem login, volta para a tela de login
  function protegerPagina() {
    if (!usuarioAtual()) location.replace('login.html');
  }

  // cria as contas iniciais (só as que ainda não existem)
  var prontas = Promise.all(CONTAS_INICIAIS.map(function (c) {
    if (buscar(c.email) || buscar(c.usuario)) return null;
    var sal = gerarSal();
    return hashSenha(c.senha, sal).then(function (hash) {
      var contas = listar();
      contas.push({ usuario: c.usuario, email: c.email.toLowerCase(), sal: sal, hash: hash, criadaEm: new Date().toISOString() });
      gravar(CHAVE_CONTAS, contas);
    });
  }));

  window.Contas = {
    prontas: prontas,
    validarUsuario: validarUsuario, validarEmail: validarEmail, validarSenha: validarSenha,
    requisitosSenha: requisitosSenha, forcaSenha: forcaSenha,
    listar: listar, buscar: buscar,
    criar: criar, entrar: entrar, trocarSenha: trocarSenha, entrarComoConvidado: entrarComoConvidado,
    usuarioAtual: usuarioAtual, sair: sair, protegerPagina: protegerPagina
  };
})();
