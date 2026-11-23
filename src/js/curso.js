// =========================================================
// TypeSkill — curso.js (a "escada" de missões)
//
// Tudo começa do ZERO quando a pessoa cria a conta: o progresso
// das missões fica guardado separado para cada conta, na chave
// "typeskill-missoes:<e-mail ou usuário>".
//
// Ordem da escada: LETRAS → PALAVRAS → FRASES → TEXTOS.
// Cada lição só abre quando a anterior foi concluída, e cada
// módulo só abre quando o anterior foi terminado.
//
// Para concluir uma lição, numa sessão você precisa atingir
// as DUAS metas: velocidade (ppm) e precisão (%).
//
// Para mudar o curso, é só editar a lista CURSO abaixo.
// Campos de cada lição:
//   id, nome, objetivo, tipo (letras/palavras/frases/texto),
//   dificuldade (facil/medio/dificil), minutos, ppm, precisao,
//   letras: (só nas lições de letras) quais letras treinar
//   curtas: true (só palavras com até 4 letras)
// Carregado ANTES de missoes.js e praticar.js (precisa do contas.js antes).
// =========================================================
(function () {
  var CURSO = [
    {
      id: 1, nome: 'Letras', descricao: 'Posição dos dedos e as teclas, fileira por fileira.',
      licoes: [
        { id: '1.1', nome: 'F e J', objetivo: 'Encontre as teclas guia (com risquinho) com os indicadores.', tipo: 'letras', dificuldade: 'facil', letras: 'fj', minutos: 1, ppm: 6, precisao: 85 },
        { id: '1.2', nome: 'D e K', objetivo: 'Some os dedos médios às teclas guia.', tipo: 'letras', dificuldade: 'facil', letras: 'dkfj', minutos: 1, ppm: 8, precisao: 85 },
        { id: '1.3', nome: 'A, S, L e Ç', objetivo: 'Complete a posição inicial com anelares e mínimos.', tipo: 'letras', dificuldade: 'facil', letras: 'asdfjklç', minutos: 1, ppm: 8, precisao: 88 },
        { id: '1.4', nome: 'G e H', objetivo: 'Os indicadores saem para o centro e voltam.', tipo: 'letras', dificuldade: 'facil', letras: 'asdfghjklç', minutos: 1, ppm: 10, precisao: 88 },
        { id: '1.5', nome: 'Fileira de cima', objetivo: 'Suba os dedos até QWERTYUIOP sem tirar a mão do lugar.', tipo: 'letras', dificuldade: 'medio', letras: 'qwertyuiopasdfjkl', minutos: 1, ppm: 10, precisao: 88 },
        { id: '1.6', nome: 'Fileira de baixo', objetivo: 'Desça os dedos até ZXCVBNM.', tipo: 'letras', dificuldade: 'medio', letras: 'zxcvbnmasdfjkl', minutos: 1, ppm: 10, precisao: 88 },
        { id: '1.7', nome: 'Todas as letras', objetivo: 'Misture as três fileiras do teclado.', tipo: 'letras', dificuldade: 'dificil', letras: 'abcdefghijklmnopqrstuvwxyzç', minutos: 1, ppm: 12, precisao: 90 }
      ]
    },
    {
      id: 2, nome: 'Palavras', descricao: 'Junte as letras em palavras do dia a dia.',
      licoes: [
        { id: '2.1', nome: 'Palavras curtas', objetivo: 'Palavras de até 4 letras, sem acento.', tipo: 'palavras', dificuldade: 'facil', curtas: true, minutos: 1, ppm: 14, precisao: 90 },
        { id: '2.2', nome: 'Palavras do dia a dia', objetivo: 'Palavras comuns de todos os tamanhos.', tipo: 'palavras', dificuldade: 'facil', minutos: 1, ppm: 16, precisao: 90 },
        { id: '2.3', nome: 'Palavras com acento', objetivo: 'Treine til, agudo, circunflexo e cedilha.', tipo: 'palavras', dificuldade: 'medio', minutos: 2, ppm: 15, precisao: 90 },
        { id: '2.4', nome: 'Palavras difíceis', objetivo: 'Maiúsculas, números e símbolos.', tipo: 'palavras', dificuldade: 'dificil', minutos: 2, ppm: 15, precisao: 88 }
      ]
    },
    {
      id: 3, nome: 'Frases', descricao: 'Ritmo e espaço entre as palavras.',
      licoes: [
        { id: '3.1', nome: 'Frases curtas', objetivo: 'Frases simples, com ritmo constante.', tipo: 'frases', dificuldade: 'facil', minutos: 2, ppm: 18, precisao: 92 },
        { id: '3.2', nome: 'Frases com acento', objetivo: 'Frases do dia a dia com acentos.', tipo: 'frases', dificuldade: 'medio', minutos: 2, ppm: 20, precisao: 92 },
        { id: '3.3', nome: 'Frases com pontuação', objetivo: 'Vírgula, ponto, interrogação e maiúsculas.', tipo: 'frases', dificuldade: 'dificil', minutos: 2, ppm: 20, precisao: 90 }
      ]
    },
    {
      id: 4, nome: 'Textos', descricao: 'Parágrafos inteiros: velocidade com precisão.',
      licoes: [
        { id: '4.1', nome: 'Texto fácil', objetivo: 'Um parágrafo simples do começo ao fim.', tipo: 'texto', dificuldade: 'facil', minutos: 3, ppm: 24, precisao: 92 },
        { id: '4.2', nome: 'Texto médio', objetivo: 'Textos maiores, com acentos.', tipo: 'texto', dificuldade: 'medio', minutos: 3, ppm: 27, precisao: 93 },
        { id: '4.3', nome: 'Texto difícil', objetivo: 'Pontuação, números e palavras longas.', tipo: 'texto', dificuldade: 'dificil', minutos: 3, ppm: 30, precisao: 94 },
        { id: '4.4', nome: 'Desafio final', objetivo: 'Mostre tudo o que aprendeu!', tipo: 'texto', dificuldade: 'dificil', minutos: 5, ppm: 35, precisao: 95 }
      ]
    }
  ];

  var TODAS = [];
  CURSO.forEach(function (m) { m.licoes.forEach(function (l) { l.modulo = m.id; TODAS.push(l); }); });

  // ---------- de quem é o progresso ----------
  function conta() {
    var s = window.Contas && Contas.usuarioAtual();
    return s ? (s.email || s.usuario) : 'convidado';
  }
  function chave() { return 'typeskill-missoes:' + conta(); }
  function ler() {
    try { return JSON.parse(localStorage.getItem(chave())) || {}; } catch (e) { return {}; }
  }
  function gravar(dados) {
    try { localStorage.setItem(chave(), JSON.stringify(dados)); } catch (e) { /* segue sem salvar */ }
  }

  // ---------- consultas ----------
  function licao(id) { return TODAS.find(function (l) { return l.id === id; }) || null; }
  function concluida(id) { return !!(ler()[id] || {}).concluida; }

  // aberta = é a primeira de todas, ou a anterior já foi concluída
  function aberta(id) {
    var i = TODAS.findIndex(function (l) { return l.id === id; });
    return i === 0 || (i > 0 && concluida(TODAS[i - 1].id));
  }
  function proxima(id) {
    var i = TODAS.findIndex(function (l) { return l.id === id; });
    return TODAS[i + 1] || null;
  }
  // primeira lição ainda não concluída (onde a pessoa parou)
  function atual() { return TODAS.find(function (l) { return !concluida(l.id); }) || null; }

  // progresso de uma lição (0 a 100): metade velocidade, metade precisão
  function porcentagem(id) {
    var l = licao(id), r = ler()[id];
    if (!r) return 0;
    if (r.concluida) return 100;
    var v = Math.min(1, r.melhorPpm / l.ppm), p = Math.min(1, r.melhorPrecisao / l.precisao);
    return Math.round((v + p) * 50);
  }

  // ---------- salvar o resultado de uma sessão de missão ----------
  // devolve { concluiu, agoraConcluiu, faltou: [...] }
  function registrar(id, ppm, precisao, tempoMs) {
    var l = licao(id);
    if (!l) return null;
    var dados = ler();
    var r = dados[id] || { tentativas: 0, melhorPpm: 0, melhorPrecisao: 0, tempoMs: 0, concluida: false };
    var jaEstava = r.concluida;
    r.tentativas++;
    r.tempoMs += tempoMs || 0;
    r.melhorPpm = Math.max(r.melhorPpm, ppm);
    r.melhorPrecisao = Math.max(r.melhorPrecisao, precisao);
    var passou = ppm >= l.ppm && precisao >= l.precisao;   // as duas metas na MESMA sessão
    if (passou && !r.concluida) { r.concluida = true; r.concluidaEm = Date.now(); }
    r.ultima = Date.now();
    dados[id] = r;
    if (!dados.inicio) dados.inicio = Date.now();
    gravar(dados);
    var faltou = [];
    if (ppm < l.ppm) faltou.push(l.ppm + ' PPM (você fez ' + ppm + ')');
    if (precisao < l.precisao) faltou.push(l.precisao + '% de precisão (você fez ' + precisao + '%)');
    return { concluiu: passou, agoraConcluiu: passou && !jaEstava, faltou: faltou };
  }

  // números gerais para o resumo da tela de Missões
  function resumo() {
    var dados = ler();
    var licoesFeitas = TODAS.filter(function (l) { return (dados[l.id] || {}).concluida; }).length;
    var modulosFeitos = CURSO.filter(function (m) { return m.licoes.every(function (l) { return (dados[l.id] || {}).concluida; }); }).length;
    var tempo = TODAS.reduce(function (t, l) { return t + ((dados[l.id] || {}).tempoMs || 0); }, 0);
    return {
      licoesFeitas: licoesFeitas, totalLicoes: TODAS.length,
      modulosFeitos: modulosFeitos, totalModulos: CURSO.length,
      porcentagem: Math.round(licoesFeitas / TODAS.length * 100),
      tempoMs: tempo
    };
  }

  window.Curso = {
    CURSO: CURSO, TODAS: TODAS,
    conta: conta, licao: licao, concluida: concluida, aberta: aberta,
    proxima: proxima, atual: atual, porcentagem: porcentagem,
    registrar: registrar, resumo: resumo, dados: ler
  };
})();
