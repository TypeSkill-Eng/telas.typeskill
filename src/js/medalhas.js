// =========================================================
// TypeSkill — medalhas.js (lista de conquistas)
//
// Usado pelo Início, pela tela Conquistas e pelo Praticar.
// Uma conquista ganha fica guardada com a data, no progresso
// da conta (progresso.medalhas), e não se perde mais.
// Precisa de: contas.js, progresso.js e curso.js antes.
//
// Para criar uma conquista nova, é só adicionar na lista abaixo:
//   id, nome, desc, cat (categoria), icone (emoji), nivel
//   (bronze/prata/ouro/diamante) e valor(d): quanto a pessoa já tem.
//   alvo: quanto precisa ter.
// =========================================================
(function () {
  var LISTA = [
    // Missões
    { id: 'primeiros-passos', cat: 'Missões', nome: 'Primeiros Passos', desc: 'Conclua sua primeira missão', icone: '👣', nivel: 'bronze', alvo: 1, valor: function (d) { return d.licoes; } },
    { id: 'mestre-letras', cat: 'Missões', nome: 'Mestre das Letras', desc: 'Conclua o módulo Letras', icone: '🔤', nivel: 'prata', alvo: 7, valor: function (d) { return d.modulo(1); } },
    { id: 'mestre-palavras', cat: 'Missões', nome: 'Mestre das Palavras', desc: 'Conclua o módulo Palavras', icone: '📝', nivel: 'prata', alvo: 4, valor: function (d) { return d.modulo(2); } },
    { id: 'mestre-frases', cat: 'Missões', nome: 'Mestre das Frases', desc: 'Conclua o módulo Frases', icone: '💬', nivel: 'ouro', alvo: 3, valor: function (d) { return d.modulo(3); } },
    { id: 'mestre-teclado', cat: 'Missões', nome: 'Mestre do Teclado', desc: 'Conclua o curso inteiro', icone: '🏆', nivel: 'diamante', alvo: 18, valor: function (d) { return d.licoes; } },
    // Velocidade
    { id: 'ppm-20', cat: 'Velocidade', nome: 'Pegando o Ritmo', desc: 'Chegue a 20 PPM numa sessão', icone: '🚲', nivel: 'bronze', alvo: 20, valor: function (d) { return d.r.recordePpm; } },
    { id: 'ppm-30', cat: 'Velocidade', nome: 'Dedos Ligeiros', desc: 'Chegue a 30 PPM numa sessão', icone: '🛵', nivel: 'prata', alvo: 30, valor: function (d) { return d.r.recordePpm; } },
    { id: 'ppm-45', cat: 'Velocidade', nome: 'Turbo', desc: 'Chegue a 45 PPM numa sessão', icone: '🏎️', nivel: 'ouro', alvo: 45, valor: function (d) { return d.r.recordePpm; } },
    { id: 'ppm-60', cat: 'Velocidade', nome: 'Velocidade da Luz', desc: 'Chegue a 60 PPM numa sessão', icone: '🚀', nivel: 'diamante', alvo: 60, valor: function (d) { return d.r.recordePpm; } },
    // Precisão
    { id: 'precisao-95', cat: 'Precisão', nome: 'Mira Boa', desc: 'Termine 1 minuto ou mais com 95% de precisão', icone: '🎯', nivel: 'bronze', alvo: 95, valor: function (d) { return d.melhorPrecisao; } },
    { id: 'precisao-100', cat: 'Precisão', nome: 'Perfeição', desc: 'Termine 1 minuto ou mais sem nenhum erro', icone: '💎', nivel: 'ouro', alvo: 100, valor: function (d) { return d.melhorPrecisao; } },
    // Combo
    { id: 'combo-50', cat: 'Combo', nome: 'Em Chamas', desc: 'Acerte 50 teclas seguidas', icone: '🔥', nivel: 'bronze', alvo: 50, valor: function (d) { return d.r.recordeCombo; } },
    { id: 'combo-100', cat: 'Combo', nome: 'Imparável', desc: 'Acerte 100 teclas seguidas', icone: '⚡', nivel: 'prata', alvo: 100, valor: function (d) { return d.r.recordeCombo; } },
    { id: 'combo-200', cat: 'Combo', nome: 'Sem Errar Nada', desc: 'Acerte 200 teclas seguidas', icone: '🌟', nivel: 'ouro', alvo: 200, valor: function (d) { return d.r.recordeCombo; } },
    // Constância
    { id: 'aquecimento', cat: 'Constância', nome: 'Aquecimento', desc: 'Termine sua primeira sessão', icone: '✋', nivel: 'bronze', alvo: 1, valor: function (d) { return d.r.sessoes; } },
    { id: 'seq-3', cat: 'Constância', nome: 'Constância', desc: 'Treine 3 dias seguidos', icone: '📅', nivel: 'bronze', alvo: 3, valor: function (d) { return d.r.melhorSequencia; } },
    { id: 'seq-7', cat: 'Constância', nome: 'Dedicado', desc: 'Treine 7 dias seguidos', icone: '🗓️', nivel: 'prata', alvo: 7, valor: function (d) { return d.r.melhorSequencia; } },
    { id: 'seq-30', cat: 'Constância', nome: 'Hábito de Ferro', desc: 'Treine 30 dias seguidos', icone: '🏅', nivel: 'diamante', alvo: 30, valor: function (d) { return d.r.melhorSequencia; } },
    { id: 'sessoes-25', cat: 'Constância', nome: 'Maratonista', desc: 'Complete 25 sessões', icone: '🏃', nivel: 'prata', alvo: 25, valor: function (d) { return d.r.sessoes; } },
    { id: 'horas-5', cat: 'Constância', nome: 'Cinco Horas', desc: 'Pratique 5 horas no total', icone: '⏱️', nivel: 'ouro', alvo: 300, unidade: 'min', valor: function (d) { return d.r.minTotal; } },
    // Desafios
    { id: 'desafio-1', cat: 'Desafios', nome: 'Desafiante', desc: 'Cumpra um desafio diário', icone: '⚔️', nivel: 'bronze', alvo: 1, valor: function (d) { return d.r.desafiosFeitos; } },
    { id: 'desafio-7', cat: 'Desafios', nome: 'Caçador de Desafios', desc: 'Cumpra 7 desafios diários', icone: '🛡️', nivel: 'ouro', alvo: 7, valor: function (d) { return d.r.desafiosFeitos; } },
    { id: 'perfil', cat: 'Desafios', nome: 'Identidade', desc: 'Preencha seu nome e escolha um avatar no Perfil', icone: '🪪', nivel: 'bronze', alvo: 1, valor: function (d) { return d.perfilOk; } }
  ];

  // junta os números que as conquistas usam
  function dados(p) {
    var r = Progresso.resumo(p);
    var cursoDados = window.Curso ? Curso.dados() : {};
    var concl = function (id) { return !!(cursoDados[id] || {}).concluida; };
    var perf = Contas.perfil();
    return {
      r: r,
      licoes: window.Curso ? Curso.TODAS.filter(function (l) { return concl(l.id); }).length : 0,
      modulo: function (n) { return window.Curso ? Curso.CURSO[n - 1].licoes.filter(function (l) { return concl(l.id); }).length : 0; },
      melhorPrecisao: p.sessoes.filter(function (s) { return (s.tempoMs || 0) >= 55000; }).reduce(function (m, s) { return Math.max(m, s.precisao); }, 0),
      perfilOk: perf.nome && (perf.avatar.foto || JSON.stringify(Personagens.normalizar(perf.avatar.pixel)) !== JSON.stringify(Personagens.PADRAO)) ? 1 : 0
    };
  }

  // lista completa com o estado de cada conquista; salva as novas
  function avaliar() {
    var p = Progresso.ler();
    var d = dados(p);
    var novas = [];
    var lista = LISTA.map(function (m) {
      var atual = Math.max(0, m.valor(d) || 0);
      var quando = p.medalhas[m.id] || null;
      if (!quando && atual >= m.alvo) { quando = Date.now(); p.medalhas[m.id] = quando; novas.push(m); }
      return Object.assign({}, m, { atual: Math.min(atual, m.alvo), ok: !!quando, quando: quando, pct: quando ? 100 : Math.floor(Math.min(atual, m.alvo) / m.alvo * 100) });
    });
    if (novas.length) Progresso.gravar(p);
    return { lista: lista, novas: novas };
  }

  // aviso que aparece no canto quando ganha uma conquista
  function avisar(novas) {
    novas.forEach(function (m, i) {
      setTimeout(function () {
        var t = document.createElement('div');
        t.className = 'toast-medalha';
        t.setAttribute('role', 'status');
        t.style.bottom = (20 + document.querySelectorAll('.toast-medalha').length * 78) + 'px';   // um em cima do outro
        t.innerHTML = html(m, 'medalha--p') + '<span><small>Nova conquista!</small><b>' + m.nome + '</b></span>';
        document.body.append(t);
        setTimeout(function () { t.classList.add('sai'); }, 3600);
        setTimeout(function () { t.remove(); }, 4200);
      }, i * 700);
    });
  }

  // ---------- desenho da medalha em pixel art ----------
  // fita (cor da categoria) + moeda (cor do nível) + ícone da categoria
  var MOEDA = [
    '...RRR....rrr...',
    '...RRR....rrr...',
    '....RRR..rrr....',
    '.....RRrrrr.....',
    '.....oooooo.....',
    '...ooLLLLLLoo...',
    '..oLLLMMMMMLLo..',
    '..oLMMMMMMMMDo..',
    '.oLMMMMMMMMMMDo.',
    '.oLMMMMMMMMMMDo.',
    '.oLMMMMMMMMMMDo.',
    '.oLMMMMMMMMMMDo.',
    '.oLMMMMMMMMMMDo.',
    '..oMMMMMMMMMDo..',
    '..oDMMMMMMMDDo..',
    '...ooDDDDDDoo...',
    '.....oooooo.....'
  ];
  var ICONES = {
    'Missões':    ['#......', '####...', '######.', '####...', '#......', '#......', '#......'],
    'Velocidade': ['...##..', '..##...', '.####..', '...##..', '..##...', '.##....', '.#.....'],
    'Precisão':   ['..###..', '.#...#.', '#..#..#', '#.###.#', '#..#..#', '.#...#.', '..###..'],
    'Combo':      ['...#...', '..##...', '..###..', '.####..', '.#####.', '.##.##.', '..###..'],
    'Constância': ['.#...#.', '#######', '#.....#', '#.#.#.#', '#.....#', '#.#.#.#', '#######'],
    'Desafios':   ['......#', '.....##', '....##.', '#..##..', '.###...', '..#....', '.#.#...']
  };
  var FITAS = { 'Missões': '#ff6a00', 'Velocidade': '#3b82f6', 'Precisão': '#e5484d', 'Combo': '#ff8a00', 'Constância': '#22b07d', 'Desafios': '#7c5cf0' };
  var TONS = {
    bronze:   { L: '#f6c592', M: '#cd7f32', D: '#8a4f1d', o: '#5c3410' },
    prata:    { L: '#ffffff', M: '#c9ced8', D: '#8b93a3', o: '#5d6472' },
    ouro:     { L: '#fff3a8', M: '#ffc928', D: '#c98a00', o: '#8a5a00' },
    diamante: { L: '#e6fbff', M: '#7fd8f5', D: '#3a9cd0', o: '#1f6a99' }
  };
  function pixelMedalha(m) {
    var tom = TONS[m.nivel] || TONS.bronze;
    var fita = FITAS[m.cat] || '#ff6a00';
    var icone = (ICONES[m.cat] || ICONES['Missões']).map(function (l) { return '....' + l.replace(/#/g, 'i'); });
    var desenho = Pixel.juntar(MOEDA, [].concat(new Array(7).fill(''), icone));
    var cores = { R: fita, r: Pixel.tom(fita, .72), L: tom.L, M: tom.M, D: tom.D, o: tom.o, i: tom.D };
    return Pixel.svg(desenho, cores, { contorno: true, classe: 'medalha-pixel' });
  }
  // <span> pronto da medalha (classe extra: 'medalha--p' pequena, 'medalha--g' grande)
  function html(m, extra) {
    return '<span class="medalha' + (m.ok === false ? ' medalha--bloqueada' : '') + (extra ? ' ' + extra : '') + '" title="' + (m.nome || '') + '">' + pixelMedalha(m) + '</span>';
  }

  window.Medalhas = {
    LISTA: LISTA, html: html, TONS: TONS,
    lista: function () { return avaliar().lista; },
    avaliarEAvisar: function () { var a = avaliar(); avisar(a.novas); return a; }
  };
})();
