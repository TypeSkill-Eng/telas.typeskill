// =========================================================
// TypeSkill — Tela de Prática (js/praticar.js)
// Os textos ficam em js/textos.js, que carrega antes deste.
// O bloco 1 (regras e prêmios) é o que você mais vai mexer.
// =========================================================


// ---------- 1. Regras do jogo e prêmios (mude à vontade) ----------
const REGRAS = {
  xpPorNivel: 250,            // XP para subir de nível
  bonusPorTexto: 10,          // XP extra ao terminar um texto
  bonusPorEstrela: 50,        // XP extra por estrela no fim da sessão
  metaDiariaMin: 20,          // meta de minutos por dia
  faixasCombo: [10, 25, 50]   // acertos seguidos para o multiplicador virar ×2, ×3 e ×4
};

// Prêmios por ACERTOS SEGUIDOS. Dá para ganhar o mesmo prêmio mais de
// uma vez na sessão: é só perder o combo e chegar lá de novo.
const PREMIOS = [
  { id: 'dedos-quentes', combo: 20,  nome: 'Dedos Quentes',     nivel: 'bronze',   xp: 20 },
  { id: 'em-chamas',     combo: 50,  nome: 'Em Chamas',         nivel: 'prata',    xp: 50 },
  { id: 'imparavel',     combo: 100, nome: 'Imparável',         nivel: 'ouro',     xp: 120 },
  { id: 'mestre',        combo: 200, nome: 'Mestre do Teclado', nivel: 'diamante', xp: 300 },
  { id: 'lenda',         combo: 350, nome: 'Lenda TypeSkill',   nivel: 'lendario', xp: 600 }
];


// ---------- 2. Teclado ABNT2 ----------
// Cada tecla: [código, normal, com Shift, largura em quartos, AltGr]
// Largura 4 = tecla comum. Teclas de função têm null no lugar do Shift.
const LAYOUT = [
  [['Backquote', "'", '"'], ['Digit1', '1', '!'], ['Digit2', '2', '@'], ['Digit3', '3', '#'], ['Digit4', '4', '$'], ['Digit5', '5', '%'], ['Digit6', '6', '¨'], ['Digit7', '7', '&'], ['Digit8', '8', '*'], ['Digit9', '9', '('], ['Digit0', '0', ')'], ['Minus', '-', '_'], ['Equal', '=', '+', 4, '§'], ['Backspace', '⌫', null, 8]],
  [['Tab', '⇄', null, 7], ['KeyQ', 'q', 'Q'], ['KeyW', 'w', 'W'], ['KeyE', 'e', 'E'], ['KeyR', 'r', 'R'], ['KeyT', 't', 'T'], ['KeyY', 'y', 'Y'], ['KeyU', 'u', 'U'], ['KeyI', 'i', 'I'], ['KeyO', 'o', 'O'], ['KeyP', 'p', 'P'], ['BracketLeft', '´', '`'], ['BracketRight', '[', '{', 4, 'ª'], ['Enter', '↲', null, 5]],
  [['CapsLock', 'caps lock', null, 7], ['KeyA', 'a', 'A'], ['KeyS', 's', 'S'], ['KeyD', 'd', 'D'], ['KeyF', 'f', 'F'], ['KeyG', 'g', 'G'], ['KeyH', 'h', 'H'], ['KeyJ', 'j', 'J'], ['KeyK', 'k', 'K'], ['KeyL', 'l', 'L'], ['Semicolon', 'ç', 'Ç'], ['Quote', '~', '^'], ['Backslash', ']', '}', 4, 'º']],
  [['ShiftLeft', '⇧', null, 5], ['IntlBackslash', '\\', '|'], ['KeyZ', 'z', 'Z'], ['KeyX', 'x', 'X'], ['KeyC', 'c', 'C'], ['KeyV', 'v', 'V'], ['KeyB', 'b', 'B'], ['KeyN', 'n', 'N'], ['KeyM', 'm', 'M'], ['Comma', ',', '<'], ['Period', '.', '>'], ['Slash', ';', ':'], ['ShiftRight', '⇧', null, 11]],
  [['ControlLeft', 'ctrl', null, 6], ['Fn', 'fn', null, 4], ['MetaLeft', '⊞', null, 4], ['AltLeft', 'alt', null, 4], ['Space', '', null, 20], ['AltRight', 'alt gr', null, 6], ['IntlRo', '/', '?', 4, '°'], ['ArrowLeft', '◁', null, 4], ['SETAS'], ['ArrowRight', '▷', null, 4]]
];

// qual dedo aperta cada tecla (_e = mão esquerda, _d = mão direita)
const DEDOS = {
  minimo_e:    ['Backquote', 'Digit1', 'Tab', 'KeyQ', 'CapsLock', 'KeyA', 'ShiftLeft', 'IntlBackslash', 'KeyZ', 'ControlLeft', 'Fn', 'MetaLeft'],
  anelar_e:    ['Digit2', 'KeyW', 'KeyS', 'KeyX'],
  medio_e:     ['Digit3', 'KeyE', 'KeyD', 'KeyC'],
  indicador_e: ['Digit4', 'Digit5', 'KeyR', 'KeyT', 'KeyF', 'KeyG', 'KeyV', 'KeyB'],
  indicador_d: ['Digit6', 'Digit7', 'KeyY', 'KeyU', 'KeyH', 'KeyJ', 'KeyN', 'KeyM'],
  medio_d:     ['Digit8', 'KeyI', 'KeyK', 'Comma'],
  anelar_d:    ['Digit9', 'KeyO', 'KeyL', 'Period'],
  minimo_d:    ['Digit0', 'Minus', 'Equal', 'Backspace', 'KeyP', 'BracketLeft', 'BracketRight', 'Enter', 'Semicolon', 'Quote', 'Backslash', 'Slash', 'IntlRo', 'ShiftRight', 'ArrowLeft', 'ArrowUp', 'ArrowDown', 'ArrowRight'],
  polegar:     ['Space', 'AltLeft', 'AltRight']
};
const NOME_DEDO = {
  minimo_e: 'Mínimo Esquerdo', anelar_e: 'Anelar Esquerdo', medio_e: 'Médio Esquerdo', indicador_e: 'Indicador Esquerdo',
  indicador_d: 'Indicador Direito', medio_d: 'Médio Direito', anelar_d: 'Anelar Direito', minimo_d: 'Mínimo Direito',
  polegar_e: 'Polegar Esquerdo', polegar_d: 'Polegar Direito'
};
const DEDO_DA_TECLA = {};
for (const [dedo, codigos] of Object.entries(DEDOS)) {
  for (const codigo of codigos) DEDO_DA_TECLA[codigo] = dedo;
}
// polegar: AltLeft é do esquerdo; espaço e AltGr, do direito
function dedoDe(codigo) {
  const dedo = DEDO_DA_TECLA[codigo];
  if (dedo !== 'polegar') return dedo;
  return codigo === 'AltLeft' ? 'polegar_e' : 'polegar_d';
}
const shiftOposto = (codigo) => (DEDO_DA_TECLA[codigo] || '').endsWith('_e') ? 'ShiftRight' : 'ShiftLeft';

// caractere -> teclas a apertar, em ordem (a última é a principal)
const MAPA = { ' ': ['Space'] };
for (const linha of LAYOUT) {
  for (const [codigo, normal, comShift] of linha) {
    if (!comShift) continue;
    MAPA[normal] = [codigo];
    MAPA[comShift] = [shiftOposto(codigo), codigo];
  }
}
// acentos: no ABNT2 aperta o acento (tecla "morta") e depois a letra
const ACENTUADAS = {
  'á': ['´', 'a'], 'é': ['´', 'e'], 'í': ['´', 'i'], 'ó': ['´', 'o'], 'ú': ['´', 'u'],
  'à': ['`', 'a'], 'ã': ['~', 'a'], 'õ': ['~', 'o'],
  'â': ['^', 'a'], 'ê': ['^', 'e'], 'ô': ['^', 'o']
};
for (const [letra, [acento, base]] of Object.entries(ACENTUADAS)) {
  MAPA[letra] = [...MAPA[acento], ...MAPA[base]];
  MAPA[letra.toUpperCase()] = [...MAPA[acento], ...MAPA[base.toUpperCase()]];
}
// símbolos do AltGr
MAPA['º'] = ['AltRight', 'Backslash'];
MAPA['ª'] = ['AltRight', 'BracketRight'];
MAPA['°'] = ['AltRight', 'IntlRo'];
MAPA['§'] = ['AltRight', 'Equal'];


// ---------- 3. Progresso salvo no navegador ----------
// Sem banco de dados: o localStorage guarda tudo só neste navegador.
function ler(chave, padrao) {
  try { return JSON.parse(localStorage.getItem(chave)) ?? padrao; } catch (e) { return padrao; }
}
function gravar(chave, valor) {
  try { localStorage.setItem(chave, JSON.stringify(valor)); } catch (e) { /* segue sem salvar */ }
}
// progresso da conta logada (progresso.js): cada conta começa do zero
const progresso = Progresso.ler();
const config = Object.assign(
  { tipo: 'frases', dificuldade: 'medio', duracao: '5', minutos: 10, maos: true, som: false },
  ler('typeskill-config', {})
);
// Vindo de Missões ou do Início com ?tipo=frases&dificuldade=medio, já abre nessa lição
(function () {
  const p = new URLSearchParams(location.search);
  const validos = { tipo: ['letras', 'palavras', 'frases', 'texto'], dificuldade: ['facil', 'medio', 'dificil'], duracao: ['1', '3', '5'] };
  for (const [chave, lista] of Object.entries(validos)) {
    if (lista.includes(p.get(chave))) config[chave] = p.get(chave);
  }
})();

// Vindo de Missões com ?missao=1.2: usa as regras da lição (curso.js)
let missao = null;
let avisoMissao = '';
(function () {
  const id = new URLSearchParams(location.search).get('missao');
  if (!id || !window.Curso) return;
  const l = Curso.licao(id);
  if (!l) return;
  if (!Curso.aberta(id) && !Curso.concluida(id)) {
    avisoMissao = `A missão ${id} ainda está bloqueada. Conclua as anteriores primeiro.`;
    history.replaceState(null, '', location.pathname);
    return;
  }
  missao = l;
  config.tipo = l.tipo;
  config.dificuldade = l.dificuldade;
  config.duracao = 'custom';
  config.minutos = l.minutos;
})();
// mexeu nas opções durante uma missão: vira treino livre
function sairDaMissao() {
  if (!missao) return;
  missao = null;
  history.replaceState(null, '', location.pathname);
}


// ---------- 4. Elementos da página ----------
const $ = (id) => document.getElementById(id);
const pista = $('pista');
const textoEl = $('texto');
const entrada = $('entrada');
const teclas = {};                 // código -> elementos do teclado na tela
const pressionadas = new Set();    // teclas que estão apertadas agora
let letras = [];                   // um <span> por caractere do texto


// ---------- 5. Estado da sessão ----------
let estado;
function novaSessao() {
  return {
    duracaoMs: minutosDaSessao() * 60000,
    alvo: '', digitado: '', textoAnterior: '',
    inicio: null, pausado: false, pausaInicio: 0, pausaTotal: 0, relogio: null,
    acertos: 0, erros: 0, combo: 0, maiorCombo: 0,
    xpPalavras: 0, xpTextos: 0, xpPremios: 0, textosFeitos: 0,
    premios: {},            // id do prêmio -> quantas vezes ganhou nesta sessão
    bateuRecorde: false,
    errosPorLetra: {}, palavraLimpa: true, terminou: false,
    ultimaTecla: null
  };
}
function minutosDaSessao() {
  return config.duracao === 'custom' ? Math.min(60, Math.max(1, Number(config.minutos) || 10)) : Number(config.duracao);
}


// ---------- 6. Gerar o texto ----------
const sortear = (lista) => lista[Math.floor(Math.random() * lista.length)];

function gerarTexto() {
  const { tipo, dificuldade } = config;
  if (tipo === 'letras') {
    const conjunto = (missao && missao.letras) || TEXTOS.letras[dificuldade];
    const grupos = [];
    for (let g = 0; g < 10; g++) {
      let grupo = '';
      const tamanho = 2 + Math.floor(Math.random() * 4);
      for (let i = 0; i < tamanho; i++) grupo += sortear(conjunto);
      grupos.push(grupo);
    }
    return grupos.join(' ');
  }
  if (tipo === 'palavras') {
    let lista = TEXTOS.palavras[dificuldade];
    if (missao && missao.curtas) lista = lista.filter((p) => p.length <= 4);
    const escolhidas = [];
    while (escolhidas.length < 12) {
      const p = sortear(lista);
      if (p !== escolhidas[escolhidas.length - 1]) escolhidas.push(p);
    }
    return escolhidas.join(' ');
  }
  // frases e textos: sorteia um diferente do anterior
  const lista = TEXTOS[tipo][dificuldade];
  let escolhido = sortear(lista);
  while (lista.length > 1 && escolhido === estado.textoAnterior) escolhido = sortear(lista);
  return escolhido;
}


// ---------- 7. Montar a tela ----------
function criarTecla([codigo, normal, comShift, largura = 4, altGr]) {
  const t = document.createElement('span');
  t.className = 'k';
  t.style.setProperty('--w', largura);
  if (codigo === 'Enter') t.classList.add('k--enter');
  if (codigo === 'KeyF' || codigo === 'KeyJ') t.classList.add('k--guia');

  if (!comShift) {                       // teclas de função
    t.classList.add('k--funcao');
    t.textContent = normal;
  } else if (/^[a-zç]$/.test(normal)) {  // letras
    t.textContent = normal.toUpperCase();
  } else {                               // símbolos: Shift em cima, normal embaixo
    t.classList.add('k--duplo');
    const cima = document.createElement('span');
    cima.className = 'k__cima';
    cima.textContent = comShift;
    const baixo = document.createElement('span');
    baixo.className = 'k__baixo';
    baixo.textContent = normal;
    t.append(cima, baixo);
    if (altGr) {
      const alt = document.createElement('span');
      alt.className = 'k__alt';
      alt.textContent = altGr;
      t.append(alt);
    }
  }
  (teclas[codigo] ||= []).push(t);
  return t;
}

function montarTeclado() {
  const grade = $('teclado');
  for (const linha of LAYOUT) {
    for (const tecla of linha) {
      if (tecla[0] === 'SETAS') {        // ↑ e ↓ empilhadas
        const caixa = document.createElement('span');
        caixa.className = 'k-setas';
        caixa.append(criarTecla(['ArrowUp', '△', null]), criarTecla(['ArrowDown', '▽', null]));
        grade.append(caixa);
      } else {
        grade.append(criarTecla(tecla));
      }
    }
  }
}

const medalhaSvg = (nivel, extra = '') =>
  `<svg class="medalha medalha--${nivel} ${extra}" viewBox="0 0 14 15" aria-hidden="true"><use href="#medalha"/></svg>`;

function montarMedalhas() {
  const lista = $('medalhas');
  lista.innerHTML = '';
  for (const p of PREMIOS) {
    const li = document.createElement('li');
    li.id = `medalha-${p.id}`;
    li.title = `${p.nome}: ${p.combo} acertos seguidos (+${p.xp} XP)`;
    li.innerHTML = `${medalhaSvg(p.nivel, 'bloqueada')}<span class="medalhas__qtd"></span><span class="medalhas__combo">${p.combo}</span>`;
    lista.append(li);
  }
}

function marcarOpcoes() {
  document.querySelectorAll('.opcoes__grupo').forEach((grupo) => {
    const valor = config[grupo.dataset.grupo];
    grupo.querySelectorAll('button').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.valor === valor)));
  });
  $('custom-caixa').hidden = config.duracao !== 'custom';
  $('minutos').value = config.minutos;
  const nomes = { letras: 'Letras', palavras: 'Palavras', frases: 'Frases', texto: 'Texto', facil: 'Fácil', medio: 'Médio', dificil: 'Difícil' };
  $('modo-sub').textContent = missao
    ? `Missão ${missao.id} · ${missao.nome} · Meta: ${missao.ppm} PPM e ${missao.precisao}% de precisão · ${minutosDaSessao()} min`
    : `Treino Livre · ${nomes[config.tipo]} · ${nomes[config.dificuldade]} · ${minutosDaSessao()} min`;
  $('modo-titulo').textContent = missao ? 'Modo Missão' : 'Modo Prática';
  $('botao-som').setAttribute('aria-pressed', String(config.som));
  $('botao-som').textContent = config.som ? '🔊 Som' : '🔇 Som';
}

function carregarTexto() {
  estado.textoAnterior = estado.alvo;
  estado.alvo = gerarTexto();
  estado.digitado = '';
  estado.palavraLimpa = true;

  textoEl.textContent = '';
  const pedacos = document.createDocumentFragment();
  for (const ch of estado.alvo) {
    const s = document.createElement('span');
    s.textContent = ch;
    pedacos.append(s);
  }
  textoEl.append(pedacos);
  letras = Array.from(textoEl.children);
  entrada.value = '';
  entrada.maxLength = estado.alvo.length;
  $('dica').textContent = sortear(DICAS);
  desenharLetras(0, letras.length);
}

function iniciarSessao() {
  if (estado) clearInterval(estado.relogio);
  estado = novaSessao();
  marcarOpcoes();
  carregarTexto();
  montarMedalhas();
  atualizarDesempenho();
  atualizarSessao();
  mostrarPausa(false);
  entrada.focus({ preventScroll: true });
}


// ---------- 8. Desenhar o texto e a tecla atual ----------
function desenharLetras(de, ate) {
  const d = estado.digitado;
  for (let i = Math.max(0, de); i < Math.min(ate, letras.length); i++) {
    let classe = '';
    if (i < d.length) classe = d[i] === estado.alvo[i] ? 'ok' : 'erro';
    else if (i === d.length) classe = 'atual';
    letras[i].className = classe;
  }
  rolarTexto();
  marcarTeclaAtual();
  $('tracejado').style.width = `${(d.length / estado.alvo.length) * 100}%`;
}

// a linha que está sendo digitada fica sempre em cima
function rolarTexto() {
  const atual = letras[Math.min(estado.digitado.length, letras.length - 1)];
  if (!atual) return;
  const alturaLinha = parseFloat(getComputedStyle(textoEl).lineHeight);
  const linha = Math.floor(atual.offsetTop / alturaLinha);
  textoEl.style.transform = `translateY(${-linha * alturaLinha}px)`;
}

let guiaAtual = [];   // teclas da próxima letra (para as mãos)
function marcarTeclaAtual() {
  document.querySelectorAll('.k.alvo, .k.apoio').forEach((t) => {
    t.classList.remove('alvo', 'apoio');
    delete t.dataset.passo;
  });
  const proximo = estado.alvo[estado.digitado.length];
  guiaAtual = proximo === undefined ? [] : (MAPA[proximo] || []);
  atualizarMaos();
  if (proximo === undefined) return;

  guiaAtual.forEach((codigo, i) => {
    const principal = i === guiaAtual.length - 1;
    (teclas[codigo] || []).forEach((t) => {
      t.classList.add(principal ? 'alvo' : 'apoio');
      if (!principal) t.dataset.passo = String(i + 1);
    });
  });
  const teclaEl = $('tecla-atual');
  const rotulo = proximo === ' ' ? 'espaço' : proximo;
  if (teclaEl.textContent !== rotulo) {
    teclaEl.textContent = rotulo;
    reiniciarAnimacao(teclaEl, 'troca');
  }
  const principal = guiaAtual[guiaAtual.length - 1];
  const nomesApoio = { ShiftLeft: 'Shift esquerdo', ShiftRight: 'Shift direito', AltRight: 'AltGr' };
  const apoio = guiaAtual.length > 1 ? ` + ${guiaAtual.slice(0, -1).map((c) => nomesApoio[c] || 'acento antes').join(' + ')}` : '';
  $('dedo-atual').textContent = principal ? NOME_DEDO[dedoDe(principal)] + apoio : '';
}


// ---------- 9. Regras: acerto, erro, combo, XP e prêmios ----------
function multiplicador(combo) {
  let m = 1;
  for (const faixa of REGRAS.faixasCombo) if (combo >= faixa) m++;
  return m;
}

function registrarLetra(ch, i) {
  const esperado = estado.alvo[i];
  if (ch === esperado) {
    estado.acertos++;
    const antes = multiplicador(estado.combo);
    estado.combo++;
    estado.maiorCombo = Math.max(estado.maiorCombo, estado.combo);
    piscarTecla(estado.ultimaTecla, 'acertou');
    som('tecla');

    if (multiplicador(estado.combo) > antes) {
      anunciar(`COMBO x${estado.combo}!`);
      som('combo');
    }
    const premio = PREMIOS.find((p) => p.combo === estado.combo);
    if (premio) ganharPremio(premio);
    if (!estado.bateuRecorde && progresso.recordeCombo > 0 && estado.combo > progresso.recordeCombo) {
      estado.bateuRecorde = true;
      mostrarEstouro('novo recorde de combo!', i);
    }

    // fim de palavra: chegou no espaço ou no fim do texto
    if (esperado === ' ' || i === estado.alvo.length - 1) {
      const inicioPalavra = estado.alvo.lastIndexOf(' ', i - 1) + 1;
      const tamanho = (esperado === ' ' ? i : i + 1) - inicioPalavra;
      if (estado.palavraLimpa && tamanho > 0) {
        const pontos = tamanho * multiplicador(estado.combo);
        estado.xpPalavras += pontos;
        mostrarEstouro(`+${pontos} XP`, i);
      }
      estado.palavraLimpa = true;
    }
  } else {
    estado.erros++;
    estado.palavraLimpa = false;
    if (estado.combo >= 10) mostrarEstouro('combo perdido', i);
    estado.combo = 0;
    estado.errosPorLetra[esperado] = (estado.errosPorLetra[esperado] || 0) + 1;
    reiniciarAnimacao(pista, 'treme');
    piscarTecla(estado.ultimaTecla, 'errou');
    som('erro');
  }
}

function ganharPremio(premio) {
  estado.premios[premio.id] = (estado.premios[premio.id] || 0) + 1;
  estado.xpPremios += premio.xp;
  mostrarPremio(premio);
  som('premio');
  const li = $(`medalha-${premio.id}`);
  if (li) {
    li.querySelector('.medalha').classList.remove('bloqueada');
    const n = estado.premios[premio.id];
    li.querySelector('.medalhas__qtd').textContent = n > 1 ? `×${n}` : '';
    reiniciarAnimacao(li, 'brilha');
  }
}


// ---------- 10. Ler o que a pessoa digita e o teclado físico ----------
// A caixa de texto invisível recebe tudo; comparamos o valor novo com o anterior.
let compondo = false;  // true enquanto o acento espera a letra
entrada.addEventListener('compositionstart', () => { compondo = true; });
entrada.addEventListener('compositionend', () => { compondo = false; processarEntrada(); });
entrada.addEventListener('input', (e) => { if (!e.isComposing && !compondo) processarEntrada(); });

function processarEntrada() {
  if (estado.terminou || estado.pausado) { entrada.value = estado.digitado; return; }
  const novo = entrada.value.replace(/\n/g, '').slice(0, estado.alvo.length);
  const antigo = estado.digitado;
  if (!estado.inicio && novo.length > 0) comecarRelogio();

  for (let i = antigo.length; i < novo.length; i++) registrarLetra(novo[i], i);

  estado.digitado = novo;
  entrada.value = novo;
  desenharLetras(Math.min(antigo.length, novo.length) - 1, Math.max(antigo.length, novo.length) + 1);
  atualizarDesempenho();

  // terminou o texto: ganha bônus e já vem o próximo
  if (novo.length === estado.alvo.length) {
    estado.textosFeitos++;
    estado.xpTextos += REGRAS.bonusPorTexto;
    mostrarEstouro(`texto completo! +${REGRAS.bonusPorTexto} XP`, novo.length - 1);
    setTimeout(() => { if (!estado.terminou) carregarTexto(); }, 200);
  }
}

// teclado físico: a tecla na tela afunda enquanto você segura
entrada.addEventListener('keydown', (e) => {
  estado.ultimaTecla = e.code;
  if (!pressionadas.has(e.code)) {
    pressionadas.add(e.code);
    (teclas[e.code] || []).forEach((t) => t.classList.add('pressionada'));
    atualizarMaos();
  }
  avisoCapsLock(e);
  if (e.key === 'Escape') { e.preventDefault(); iniciarSessao(); return; }
  if (['Enter', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End', 'PageUp', 'PageDown', 'Tab'].includes(e.key)) e.preventDefault();
  if ((e.ctrlKey || e.metaKey) && ['a', 'z', 'y'].includes(e.key.toLowerCase())) e.preventDefault();
});
entrada.addEventListener('keyup', (e) => {
  soltarTecla(e.code);
  avisoCapsLock(e);
});
function soltarTecla(codigo) {
  pressionadas.delete(codigo);
  (teclas[codigo] || []).forEach((t) => t.classList.remove('pressionada'));
  atualizarMaos();
}
function soltarTodas() {
  for (const codigo of [...pressionadas]) soltarTecla(codigo);
}

function avisoCapsLock(e) {
  const ligado = e.getModifierState && e.getModifierState('CapsLock');
  (teclas.CapsLock || []).forEach((t) => t.classList.toggle('ligada', !!ligado));
  if (ligado) $('aviso').textContent = 'Caps Lock ligado: as letras vão sair maiúsculas.';
}

entrada.addEventListener('paste', (e) => e.preventDefault());
entrada.addEventListener('drop', (e) => e.preventDefault());

pista.addEventListener('click', (e) => {
  if (e.target.closest('button')) return;   // cliques nos chips de Mãos/Som
  if (estado.pausado) alternarPausa();
  entrada.focus({ preventScroll: true });
});
entrada.addEventListener('focus', () => {
  pista.classList.add('focada');
  $('aviso').textContent = estado.inicio ? 'Continue digitando. Esc reinicia a sessão.' : 'Pode começar: o tempo conta a partir da 1ª tecla. Esc reinicia.';
});
entrada.addEventListener('blur', () => {
  pista.classList.remove('focada');
  soltarTodas();
  $('aviso').textContent = 'Clique no texto para continuar digitando.';
});


// ---------- 11. Relógio, pausa e números ----------
function comecarRelogio() {
  estado.inicio = performance.now();
  estado.relogio = setInterval(tique, 200);
  $('aviso').textContent = 'Valendo! Esc reinicia a sessão.';
}
function tempoMs() {
  if (!estado.inicio) return 0;
  const agora = estado.pausado ? estado.pausaInicio : performance.now();
  return agora - estado.inicio - estado.pausaTotal;
}
function tique() {
  if (estado.pausado || estado.terminou) return;
  if (tempoMs() >= estado.duracaoMs) { terminar(); return; }
  atualizarDesempenho();
  atualizarSessao();
}

function alternarPausa() {
  if (!estado.inicio || estado.terminou) return;   // ainda não tem nada para pausar
  if (estado.pausado) {
    estado.pausaTotal += performance.now() - estado.pausaInicio;
    estado.pausado = false;
    mostrarPausa(false);
    entrada.focus({ preventScroll: true });
  } else {
    estado.pausaInicio = performance.now();
    estado.pausado = true;
    mostrarPausa(true);
    entrada.blur();
  }
}
function mostrarPausa(pausado) {
  $('pausa-tela').hidden = !pausado;
  $('pausar-texto').textContent = pausado ? 'Continuar' : 'Pausar';
  $('pausar-icone').innerHTML = pausado
    ? '<path d="M7 5v14l12-7z"/>'
    : '<rect x="6" y="5" width="4" height="14" rx="1"/><rect x="14" y="5" width="4" height="14" rx="1"/>';
}

const doisDigitos = (n) => String(n).padStart(2, '0');
function formatarTempo(ms) {
  const s = Math.floor(ms / 1000);
  return `${doisDigitos(Math.floor(s / 60))}:${doisDigitos(s % 60)}`;
}
// PPM = palavras por minuto (1 palavra = 5 caracteres certos)
function calcularPpm() {
  const ms = tempoMs();
  return ms < 1500 ? 0 : Math.round((estado.acertos / 5) / (ms / 60000));
}
function calcularPrecisao() {
  const total = estado.acertos + estado.erros;
  return total === 0 ? 100 : Math.round((estado.acertos / total) * 100);
}

function atualizarDesempenho() {
  $('precisao').textContent = `${calcularPrecisao()}%`;
  $('ppm').textContent = `${calcularPpm()} PPM`;
  $('tempo').textContent = formatarTempo(tempoMs());
  $('erros').textContent = estado.erros;
  atualizarCombo();
  atualizarXp(progresso.xp + estado.xpPalavras + estado.xpTextos + estado.xpPremios);
  atualizarMeta(tempoMs());
}

// cartão de combo: número, multiplicador e barra até o próximo prêmio
function atualizarCombo() {
  const c = estado.combo;
  for (const id of ['combo', 'combo-mini']) {
    const el = $(id);
    if (el.textContent !== String(c)) {
      el.textContent = c;
      if (c > 0) reiniciarAnimacao(el, 'pulsa');
    }
  }
  const m = `×${multiplicador(c)}`;
  $('multi').textContent = m;
  $('multi-mini').textContent = m;
  $('combo-cartao').classList.toggle('quente', c >= PREMIOS[0].combo);

  const proximo = PREMIOS.find((p) => p.combo > c);
  if (proximo) {
    const anterior = [...PREMIOS].reverse().find((p) => p.combo <= c);
    const base = anterior ? anterior.combo : 0;
    $('combo-barra').style.width = `${((c - base) / (proximo.combo - base)) * 100}%`;
    $('combo-prox').textContent = `Próximo prêmio: ${proximo.nome} (faltam ${proximo.combo - c})`;
  } else {
    $('combo-barra').style.width = '100%';
    $('combo-prox').textContent = 'Todos os prêmios liberados. Lenda!';
  }
  $('combo-recorde').textContent = Math.max(progresso.recordeCombo, estado.maiorCombo);
}

function atualizarSessao() {
  const pct = Math.min(100, Math.round((tempoMs() / estado.duracaoMs) * 100));
  $('sessao-barra').style.width = `${pct}%`;
  $('sessao-pct').textContent = `${pct}%`;
}

let nivelNaTela = null;
function atualizarXp(xp) {
  const nivel = Math.floor(xp / REGRAS.xpPorNivel) + 1;
  $('xp-total').textContent = `${xp.toLocaleString('pt-BR')} XP`;
  $('nivel').textContent = `Nível ${nivel}`;
  $('xp-barra').style.width = `${((xp % REGRAS.xpPorNivel) / REGRAS.xpPorNivel) * 100}%`;
  if (nivelNaTela !== null && nivel > nivelNaTela) { anunciar('LEVEL UP!'); som('premio'); }
  nivelNaTela = nivel;
}


// ---------- 12. Sequência, meta diária e sessões salvas ----------
const diaDe = (data) => new Date(data).toLocaleDateString('sv');   // "2026-11-04"

function atualizarMeta(msAgora = 0) {
  const hoje = diaDe(Date.now());
  const msHoje = progresso.sessoes.filter((s) => diaDe(s.quando) === hoje).reduce((soma, s) => soma + s.tempoMs, 0);
  const min = Math.floor((msHoje + msAgora) / 60000);
  $('meta-min').textContent = Math.min(min, 999);
  $('meta-alvo').textContent = REGRAS.metaDiariaMin;
  $('meta-barra').style.width = `${Math.min(100, (min / REGRAS.metaDiariaMin) * 100)}%`;
  $('meta-frase').textContent = min >= REGRAS.metaDiariaMin ? 'Meta batida! 🎉' : min > 0 ? 'Continue assim!' : 'Bora começar o dia?';
}

// dias seguidos com pelo menos uma sessão (contando hoje ou até ontem)
function calcularSequencia() {
  const dias = new Set(progresso.sessoes.map((s) => diaDe(s.quando)));
  const d = new Date();
  if (!dias.has(diaDe(d))) d.setDate(d.getDate() - 1);
  let n = 0;
  while (dias.has(diaDe(d))) { n++; d.setDate(d.getDate() - 1); }
  return n;
}

function atualizarCartoes() {
  const seq = calcularSequencia();
  $('sequencia').textContent = `${seq} ${seq === 1 ? 'dia' : 'dias'}`;
  const sessoes = progresso.sessoes;
  if (sessoes.length) {
    const melhor = sessoes.reduce((a, b) => (b.ppm > a.ppm || (b.ppm === a.ppm && b.precisao > a.precisao) ? b : a));
    const ultima = sessoes[0];
    $('melhor-ppm').textContent = melhor.ppm;
    $('melhor-info').textContent = `Precisão: ${melhor.precisao}% • ${formatarTempo(melhor.tempoMs)}`;
    $('ultima-ppm').textContent = ultima.ppm;
    $('ultima-info').textContent = `Precisão: ${ultima.precisao}% • ${formatarTempo(ultima.tempoMs)}`;
  }
  atualizarMeta();
}


// ---------- 13. Fim da sessão ----------
function terminar() {
  if (estado.terminou) return;
  estado.terminou = true;
  clearInterval(estado.relogio);
  soltarTodas();
  const tempo = Math.min(tempoMs(), estado.duracaoMs);
  const ppm = calcularPpm();
  const precisao = calcularPrecisao();

  let estrelas = estado.acertos > 0 ? 1 : 0;
  if (precisao >= 92 && ppm >= 20) estrelas = 2;
  if (precisao >= 97 && ppm >= 40) estrelas = 3;
  const bonus = estrelas * REGRAS.bonusPorEstrela;
  const ganho = estado.xpPalavras + estado.xpTextos + estado.xpPremios + bonus;

  const recordePpm = progresso.sessoes.reduce((m, s) => Math.max(m, s.ppm), 0);
  const novoRecorde = progresso.sessoes.length > 0 && ppm > recordePpm;

  if (estado.acertos > 0) {
    progresso.xp += ganho;
    progresso.recordeCombo = Math.max(progresso.recordeCombo, estado.maiorCombo);
    for (const [id, n] of Object.entries(estado.premios)) progresso.premios[id] = (progresso.premios[id] || 0) + n;
    progresso.sessoes.unshift({ quando: Date.now(), ppm, precisao, tempoMs: tempo, erros: estado.erros, tipo: config.tipo, dificuldade: config.dificuldade });
    progresso.sessoes = progresso.sessoes.slice(0, 60);
    estado.xpDesafio = Progresso.conferirDesafio(progresso, ppm);   // desafio do dia: +200 XP
    Progresso.gravar(progresso);
  }
  atualizarXp(progresso.xp);
  atualizarSessao();
  atualizarCartoes();

  // janela de resultado
  const caixa = $('r-estrelas');
  caixa.innerHTML = '';
  for (let i = 0; i < 3; i++) {
    caixa.insertAdjacentHTML('beforeend', `<svg viewBox="0 0 11 11" class="${i < estrelas ? 'ganhou' : ''}" style="--i:${i}" aria-hidden="true"><use href="#estrela"/></svg>`);
  }
  caixa.setAttribute('aria-label', `${estrelas} de 3 estrelas`);
  const frases = [
    'Nenhuma tecla certa desta vez. Que tal tentar de novo?',
    'Sessão concluída! Mire em 92% de precisão e 20 PPM para a 2ª estrela.',
    'Muito bom! Com 97% de precisão e 40 PPM vem a 3ª estrela.',
    'Perfeito! Rápido e preciso.'
  ];
  $('r-sub').textContent = frases[estrelas];
  $('r-recorde').hidden = !novoRecorde;
  $('r-ppm').textContent = ppm;
  $('r-precisao').textContent = `${precisao}%`;
  $('r-erros').textContent = estado.erros;
  $('r-combo').textContent = estado.maiorCombo;
  const desafio = estado.xpDesafio || 0;
  $('r-xp').textContent = ganho + desafio;
  $('r-xp-detalhe').textContent = `Palavras: +${estado.xpPalavras} · Textos: +${estado.xpTextos} · Prêmios: +${estado.xpPremios} · Estrelas: +${bonus}` + (desafio ? ` · Desafio diário: +${desafio} 🔥` : '');

  const premiosEl = $('r-premios');
  premiosEl.innerHTML = '';
  const ganhos = PREMIOS.filter((p) => estado.premios[p.id]);
  if (!ganhos.length) {
    premiosEl.innerHTML = `<p class="resultado__vazio">Nenhum prêmio desta vez. Faça ${PREMIOS[0].combo} acertos seguidos para ganhar o primeiro!</p>`;
  }
  for (const p of ganhos) {
    const n = estado.premios[p.id];
    premiosEl.insertAdjacentHTML('beforeend', `<div class="resultado__premio">${medalhaSvg(p.nivel)}<span>${p.nome}${n > 1 ? ` ×${n}` : ''}</span></div>`);
  }

  const piores = Object.entries(estado.errosPorLetra).sort((a, b) => b[1] - a[1]).slice(0, 3);
  const teclasEl = $('r-teclas');
  teclasEl.textContent = piores.length ? '' : 'nenhuma, mandou bem!';
  for (const [letra, vezes] of piores) {
    const chip = document.createElement('span');
    chip.className = 'chip-tecla';
    chip.textContent = `${letra === ' ' ? 'espaço' : letra} ×${vezes}`;
    teclasEl.append(chip);
  }
  mostrarResultadoMissao(ppm, precisao, tempo);
  $('resultado').showModal();
}

// parte da janela de resultado que fala da missão
function mostrarResultadoMissao(ppm, precisao, tempo) {
  const caixa = $('r-missao'), proxima = $('r-proxima'), sair = $('r-sair');
  caixa.hidden = !missao;
  proxima.hidden = true;
  sair.href = missao ? 'missoes.html' : 'inicio.html';
  sair.textContent = missao ? 'Missões' : 'Sair';
  $('r-nova').textContent = missao ? 'Tentar de novo' : 'Nova sessão';
  if (!missao) return;
  if (estado.acertos === 0) {
    caixa.dataset.tipo = 'faltou';
    caixa.innerHTML = `<strong>Missão ${missao.id} · ${missao.nome}</strong><span>Nenhuma tecla certa. Meta: ${missao.ppm} PPM e ${missao.precisao}% de precisão.</span>`;
    return;
  }
  const r = Curso.registrar(missao.id, ppm, precisao, tempo);
  const seguinte = Curso.proxima(missao.id);
  if (r.concluiu) {
    caixa.dataset.tipo = 'ok';
    caixa.innerHTML = `<strong>✅ Missão ${missao.id} concluída!</strong><span>${r.agoraConcluiu && seguinte ? `Desbloqueou: ${seguinte.id} ${seguinte.nome}` : (seguinte ? 'Você já tinha concluído esta lição.' : '🏆 Você terminou o curso inteiro!')}</span>`;
    if (seguinte) {
      proxima.hidden = false;
      proxima.href = `praticar.html?missao=${seguinte.id}`;
      proxima.textContent = `Próxima: ${seguinte.id} ${seguinte.nome}`;
    }
  } else {
    caixa.dataset.tipo = 'faltou';
    caixa.innerHTML = `<strong>Missão ${missao.id} · ${missao.nome}: quase lá!</strong><span>Faltou: ${r.faltou.join(' e ')}.</span>`;
  }
}


// ---------- 14. Efeitos: avisos, prêmio, confete e som ----------
function reiniciarAnimacao(el, classe) {
  el.classList.remove(classe);
  void el.offsetWidth;   // faz o navegador "esquecer" a animação para rodar de novo
  el.classList.add(classe);
}
function piscarTecla(codigo, classe) {
  (teclas[codigo] || []).forEach((t) => {
    t.classList.remove('acertou', 'errou');
    void t.offsetWidth;
    t.classList.add(classe);
    clearTimeout(t._pisca);
    t._pisca = setTimeout(() => t.classList.remove(classe), classe === 'errou' ? 280 : 180);
  });
}
function mostrarEstouro(texto, indice) {
  const letra = letras[indice];
  if (!letra) return;
  const caixa = pista.getBoundingClientRect();
  const r = letra.getBoundingClientRect();
  const el = document.createElement('span');
  el.className = 'estouro';
  el.textContent = texto;
  el.style.left = `${r.left - caixa.left + r.width / 2}px`;
  el.style.top = `${r.top - caixa.top - 4}px`;
  el.addEventListener('animationend', () => el.remove());
  pista.append(el);
}
function anunciar(texto) {
  const el = document.createElement('div');
  el.className = 'anuncio';
  el.textContent = texto;
  el.addEventListener('animationend', () => el.remove());
  document.body.append(el);
}

// cartão "Prêmio desbloqueado!" com confete
function mostrarPremio(premio) {
  document.querySelectorAll('.premio-pop').forEach((p) => p.remove());
  const el = document.createElement('div');
  el.className = `premio-pop premio-pop--${premio.nivel}`;
  el.setAttribute('role', 'status');
  el.innerHTML = `
    ${medalhaSvg(premio.nivel)}
    <div>
      <p>Prêmio desbloqueado!</p>
      <strong>${premio.nome}</strong>
      <span>${premio.combo} acertos seguidos · +${premio.xp} XP</span>
    </div>`;
  const cores = ['#ff6200', '#52d1c6', '#ffc21a', '#ffe6cf', '#ff9a52'];
  for (let i = 0; i < 26; i++) {
    const c = document.createElement('i');
    c.className = 'confete';
    const angulo = (Math.PI * 2 * i) / 26 + Math.random() * .4;
    const dist = 90 + Math.random() * 110;
    c.style.setProperty('--dx', `${Math.cos(angulo) * dist}px`);
    c.style.setProperty('--dy', `${Math.sin(angulo) * dist}px`);
    c.style.setProperty('--giro', `${Math.random() * 720 - 360}deg`);
    c.style.background = cores[i % cores.length];
    el.append(c);
  }
  el.addEventListener('animationend', (e) => { if (e.target === el) el.remove(); });
  document.body.append(el);
}

// sons curtinhos gerados pelo próprio navegador (sem arquivo de áudio)
let audio = null;
function bip(freq, dur, tipo = 'square', vol = .04, atraso = 0) {
  audio ||= new (window.AudioContext || window.webkitAudioContext)();
  const t = audio.currentTime + atraso;
  const osc = audio.createOscillator();
  const ganho = audio.createGain();
  osc.type = tipo;
  osc.frequency.value = freq;
  ganho.gain.setValueAtTime(vol, t);
  ganho.gain.exponentialRampToValueAtTime(.0001, t + dur);
  osc.connect(ganho).connect(audio.destination);
  osc.start(t);
  osc.stop(t + dur);
}
function som(tipo) {
  if (!config.som) return;
  try {
    if (tipo === 'tecla') bip(1500, .025, 'triangle', .03);
    if (tipo === 'erro') bip(150, .14, 'sawtooth', .05);
    if (tipo === 'combo') { bip(880, .08, 'square', .04); bip(1175, .1, 'square', .04, .08); }
    if (tipo === 'premio') [523, 659, 784, 1047].forEach((f, i) => bip(f, .14, 'square', .045, i * .09));
  } catch (e) { /* navegador sem som: ignora */ }
}


// ---------- 15. Mãos que digitam (desenho em SVG) ----------
// Vista de cima, estilo desenho: pele cor de pêssego, contorno escuro
// e risquinhos nas juntas (como nos tutoriais de digitação).
// Como funciona o movimento:
// - A MÃO INTEIRA anda e gira um pouco na direção da tecla (como na vida real).
// - O dedo só completa o que falta até a tecla, sem virar um "palito" esticado.
// - Ao APERTAR, o dedo afunda e a mão desce um tiquinho.
// - Tudo usa "molas" calculadas a cada quadro (requestAnimationFrame).
//   Quando as mãos param, o loop dorme: não gasta processador à toa.
const caixaTeclado = $('teclado-caixa');
const maosEl = $('maos');
const SVG = 'http://www.w3.org/2000/svg';
const NOMES_DEDOS = ['minimo_e', 'anelar_e', 'medio_e', 'indicador_e', 'polegar_e', 'polegar_d', 'indicador_d', 'medio_d', 'anelar_d', 'minimo_d'];
const CASA = { minimo_e: 'KeyA', anelar_e: 'KeyS', medio_e: 'KeyD', indicador_e: 'KeyF', indicador_d: 'KeyJ', medio_d: 'KeyK', anelar_d: 'KeyL', minimo_d: 'Semicolon' };
// medidas em "teclas" (u) e "fileiras" (f)
const LARGURA_DEDO = { minimo: .74, anelar: .8, medio: .84, indicador: .84, polegar: 1 };
const JUNTA_ABAIXO = { minimo: 1.5, anelar: 1.42, medio: 1.38, indicador: 1.45 };   // fileiras abaixo da fileira guia
const JUNTA_PARA_DENTRO = { minimo: .18, anelar: .06, medio: 0, indicador: -.04 };
const SEGUE = .72;   // quanto do caminho até a tecla é feito pela MÃO (o resto é o dedo)

// forma de um dedo "em pé", com 24 de largura e 100 de comprimento
const FORMA_DEDO = 'M-12 8L-12 0C-12.4-30-11-62-10-82C-9.5-94-5.2-100 0-100C5.2-100 9.5-94 10-82C11-62 12.4-30 12 0L12 8Z';
const CONTORNO_DEDO = 'M-12 8L-12 0C-12.4-30-11-62-10-82C-9.5-94-5.2-100 0-100C5.2-100 9.5-94 10-82C11-62 12.4-30 12 0L12 8';
// risquinhos das juntas: curvinhas que não atravessam o dedo todo (traço de desenho)
const DOBRAS_DEDO = 'M-10-34Q-3-29 5-33M-8.5-63Q-2-59 5-62';

const dedosEl = {};
const maosG = {};
let svgMaos = null;
let geo = null;   // medidas do teclado (refeitas quando a tela muda de tamanho)

function criar(tag, atributos = {}, pai) {
  const el = document.createElementNS(SVG, tag);
  for (const [k, v] of Object.entries(atributos)) el.setAttribute(k, v);
  if (pai) pai.append(el);
  return el;
}

// ----- molas: cada número anda até o alvo com balanço suave -----
// k = firmeza (maior = mais rápido), amortece = 1 é sem "quique"
function mola(k, amortece = .92) { return { v: 0, vel: 0, alvo: 0, k, c: 2 * Math.sqrt(k) * amortece }; }
function passoMola(m, dt) {
  m.vel += (m.k * (m.alvo - m.v) - m.c * m.vel) * dt;
  m.v += m.vel * dt;
}
const parada = (m) => Math.abs(m.alvo - m.v) < .03 && Math.abs(m.vel) < .03;
const fixar = (m) => { m.v = m.alvo; m.vel = 0; };

const anim = {};   // anim.e / anim.d = mão; anim[dedo] = ponta do dedo + aperto
for (const lado of ['e', 'd']) anim[lado] = { x: mola(150), y: mola(150), r: mola(130) };
for (const nome of NOMES_DEDOS) anim[nome] = { x: mola(520, .85), y: mola(520, .85), aperto: mola(900, .8) };
const todasMolas = Object.values(anim).flatMap((o) => Object.values(o));

function montarMaos() {
  svgMaos = criar('svg', { class: 'maos-svg', 'aria-hidden': 'true' }, maosEl);
  for (const lado of ['e', 'd']) {
    const mao = criar('g', { class: 'mao-r' }, svgMaos);
    const dedosDoLado = NOMES_DEDOS.filter((n) => n.endsWith(`_${lado}`));
    // ordem de desenho: polegar e dedos embaixo, dorso por cima das bases
    for (const nome of [`polegar_${lado}`, ...dedosDoLado.filter((n) => !n.startsWith('polegar'))]) {
      const g = criar('g', { class: 'dedo-r' }, mao);
      const corpo = criar('g', {}, g);
      criar('path', { class: 'dedo-r__pele', d: FORMA_DEDO }, corpo);
      criar('path', { class: 'dedo-r__contorno', d: CONTORNO_DEDO }, corpo);
      criar('path', { class: 'dedo-r__dobras', d: DOBRAS_DEDO }, corpo);
      const ponta = criar('g', {}, g);
      const toque = criar('circle', { class: 'dedo-r__toque' }, ponta);
      dedosEl[nome] = { g, corpo, ponta, toque, classe: '' };
    }
    maosG[lado] = {
      grupo: mao,
      palma: criar('path', { class: 'palma' }, mao),
      contorno: criar('path', { class: 'palma-contorno' }, mao),
      detalhes: criar('path', { class: 'mao-detalhe' }, mao),
      juntas: criar('path', { class: 'mao-junta' }, mao)
    };
  }
}

// liga uma lista de pontos com uma curva suave e fechada (Catmull-Rom)
function curvaSuave(pts) {
  const n = pts.length;
  const segs = [];
  for (let i = 0; i < n; i++) {
    const p0 = pts[(i - 1 + n) % n], p1 = pts[i], p2 = pts[(i + 1) % n], p3 = pts[(i + 2) % n];
    segs.push([p1,
      { x: p1.x + (p2.x - p0.x) / 6, y: p1.y + (p2.y - p0.y) / 6 },
      { x: p2.x - (p3.x - p1.x) / 6, y: p2.y - (p3.y - p1.y) / 6 },
      p2]);
  }
  return segs;
}
const pt = (p) => `${p.x.toFixed(1)} ${p.y.toFixed(1)}`;
const limitar = (v, min, max) => Math.min(max, Math.max(min, v));

function medirMaos() {
  if (caixaTeclado.offsetWidth === 0 || maosEl.hidden) { geo = null; return; }
  svgMaos.setAttribute('viewBox', `0 0 ${caixaTeclado.clientWidth} ${caixaTeclado.clientHeight}`);

  // mede o centro de TODAS as teclas uma vez só (e não a cada tecla digitada)
  const c = caixaTeclado.getBoundingClientRect();
  const centros = {};
  for (const [codigo, lista] of Object.entries(teclas)) {
    const el = lista[0];
    const r = el.getBoundingClientRect();
    const afundada = el.classList.contains('pressionada') ? 2 : 0;
    centros[codigo] = { x: r.left - c.left - caixaTeclado.clientLeft + r.width / 2, y: r.top - c.top - caixaTeclado.clientTop + r.height / 2 - afundada };
  }
  const A = centros.KeyA, S = centros.KeyS, Z = centros.KeyZ, B = centros.KeyB, N = centros.KeyN, espaco = centros.Space;
  const u = S.x - A.x;          // distância entre teclas vizinhas
  const f = Z.y - A.y;          // distância entre fileiras
  geo = { u, f, centros, juntas: {}, descanso: {}, pivo: {} };

  for (const [dedo, codigo] of Object.entries(CASA)) {
    const k = centros[codigo];
    const tipo = dedo.split('_')[0];
    const paraDentro = (dedo.endsWith('_e') ? 1 : -1) * JUNTA_PARA_DENTRO[tipo] * u;
    geo.juntas[dedo] = { x: k.x + paraDentro, y: A.y + JUNTA_ABAIXO[tipo] * f };
    geo.descanso[dedo] = k;
  }
  const F = geo.juntas.indicador_e, J = geo.juntas.indicador_d;
  geo.juntas.polegar_e = { x: F.x + u * .55, y: A.y + f * 2.75 };
  geo.juntas.polegar_d = { x: J.x - u * .55, y: A.y + f * 2.75 };
  geo.descanso.polegar_e = { x: B.x - u * .05, y: espaco.y - f * .15 };
  geo.descanso.polegar_d = { x: N.x + u * .05, y: espaco.y - f * .15 };

  // contorno do dorso de cada mão (s = +1 esquerda, -1 direita: "para dentro" = lado do polegar)
  for (const lado of ['e', 'd']) {
    const s = lado === 'e' ? 1 : -1;
    const P = geo.juntas[`minimo_${lado}`], R = geo.juntas[`anelar_${lado}`], M = geo.juntas[`medio_${lado}`];
    const I = geo.juntas[`indicador_${lado}`], T = geo.juntas[`polegar_${lado}`];
    const pts = [
      { x: P.x - s * .36 * u, y: P.y + .12 * f },   // 0 lado de fora, na junta do mínimo
      { x: P.x, y: P.y - .16 * f },                 // 1 ossinhos (topo da mão)
      { x: R.x, y: R.y - .2 * f },
      { x: M.x, y: M.y - .21 * f },
      { x: I.x, y: I.y - .18 * f },                 // 4
      { x: I.x + s * .4 * u, y: I.y + .1 * f },     // 5 lado do indicador
      { x: I.x + s * .62 * u, y: I.y + .55 * f },   // 6 "membrana" até o polegar
      { x: T.x + s * .2 * u, y: T.y - .45 * f },    // 7 onde nasce o polegar
      { x: T.x + s * .25 * u, y: T.y + .35 * f },   // 8 volume do polegar
      { x: I.x + s * .42 * u, y: P.y + 2 * f },     // 9 pulso (lado do polegar)
      { x: I.x + s * .36 * u, y: P.y + 8 * f },     // 10 antebraço (some na borda)
      { x: P.x + s * .16 * u, y: P.y + 8 * f },     // 11
      { x: P.x - s * .04 * u, y: P.y + 2 * f },     // 12 pulso (lado do mínimo)
      { x: P.x - s * .42 * u, y: P.y + .95 * f }    // 13 lateral da mão
    ];
    const segs = curvaSuave(pts);
    const m = maosG[lado];
    const caminho = `M${pt(pts[0])}${segs.map((sg) => `C${pt(sg[1])} ${pt(sg[2])} ${pt(sg[3])}`).join('')}Z`;
    m.palma.setAttribute('d', caminho);
    m.contorno.setAttribute('d', `M${pt(pts[5])}${segs.slice(5).map((sg) => `C${pt(sg[1])} ${pt(sg[2])} ${pt(sg[3])}`).join('')}`);
    const pulso = { x: (P.x + I.x) / 2 + s * .15 * u, y: P.y + 1.9 * f };
    // dobra do polegar (curva que sai da "membrana" e desce pela palma)
    m.detalhes.setAttribute('d', `M${pt(pts[6])}Q${pt({ x: T.x - s * .35 * u, y: T.y + .1 * f })} ${pt({ x: T.x - s * .15 * u, y: T.y + .9 * f })}`);
    // risquinhos nas juntas da base dos dedos
    m.juntas.setAttribute('d', [P, R, M, I].map((k) => {
      const y = k.y + .22 * f, w = .26 * u;
      return `M${pt({ x: k.x - w, y })}Q${pt({ x: k.x, y: y + .14 * f })} ${pt({ x: k.x + w * .8, y: y - .02 * f })}`;
    }).join(''));
    geo.pivo[lado] = pulso;   // a mão gira em volta do pulso
  }

  // "ondinha" da ponta no tamanho de cada dedo
  for (const [nome, d] of Object.entries(dedosEl)) {
    const w = u * LARGURA_DEDO[nome.split('_')[0]];
    d.largura = w;
    Object.entries({ cx: 0, cy: w * .45, r: w * .55 }).forEach(([k, v]) => d.toque.setAttribute(k, v));
  }

  // depois de medir de novo, tudo pula direto para o lugar (sem animar)
  calcularAlvos();
  todasMolas.forEach(fixar);
  desenharQuadro();
}

// ponto da tela -> ponto "dentro" da mão (desfaz o andar e o giro da mão)
function paraDentroDaMao(p, lado, tx, ty, graus) {
  const pv = geo.pivo[lado];
  const a = -graus * Math.PI / 180;
  const x = p.x - tx - pv.x, y = p.y - ty - pv.y;
  return { x: pv.x + x * Math.cos(a) - y * Math.sin(a), y: pv.y + x * Math.sin(a) + y * Math.cos(a) };
}

// decide para onde a mão e cada dedo devem ir (não desenha nada)
function calcularAlvos() {
  const destino = {};   // dedo -> { codigo, classe }
  guiaAtual.forEach((codigo, i) => {
    const dedo = dedoDe(codigo);
    if (dedo) destino[dedo] = { codigo, classe: i === guiaAtual.length - 1 ? 'ativo' : 'apoio' };
  });
  for (const codigo of pressionadas) {           // tecla apertada de verdade tem prioridade
    const dedo = dedoDe(codigo);
    if (dedo) destino[dedo] = { codigo, classe: 'apertando' };
  }
  const alvoDe = (nome) => {
    const d = destino[nome];
    if (!d || d.codigo === 'Space') return geo.descanso[nome];   // no espaço o polegar já está em cima
    return geo.centros[d.codigo] || geo.descanso[nome];
  };

  for (const lado of ['e', 'd']) {
    const dedos = NOMES_DEDOS.filter((n) => n.endsWith(`_${lado}`));
    // 1) a mão vai junto: anda a maior parte do caminho e gira um pouco
    const esticados = dedos.filter((n) => !n.startsWith('polegar') && destino[n]);
    let dx = 0, dy = 0;
    for (const n of esticados) {
      const a = alvoDe(n);
      dx += a.x - geo.descanso[n].x;
      dy += a.y - geo.descanso[n].y;
    }
    if (esticados.length) { dx /= esticados.length; dy /= esticados.length; }
    const apertando = dedos.some((n) => destino[n]?.classe === 'apertando');
    const m = anim[lado];
    m.x.alvo = limitar(dx * SEGUE, -geo.u * 2.2, geo.u * 2.2);
    m.y.alvo = limitar(dy * SEGUE, -geo.f * 1.6, geo.f * .9) + (apertando ? geo.f * .06 : 0);
    m.r.alvo = limitar((dx / geo.u) * 3.2, -9, 9);

    // 2) cada dedo: ponta no alvo, medida "dentro" da mão já no lugar final
    for (const n of dedos) {
      const local = destino[n]
        ? paraDentroDaMao(alvoDe(n), lado, m.x.alvo, m.y.alvo, m.r.alvo)
        : geo.descanso[n];
      anim[n].x.alvo = local.x;
      anim[n].y.alvo = local.y;
      anim[n].aperto.alvo = destino[n]?.classe === 'apertando' ? 1 : 0;
      const classe = destino[n]?.classe || '';
      if (dedosEl[n].classe !== classe) {
        dedosEl[n].classe = classe;
        dedosEl[n].g.setAttribute('class', classe ? `dedo-r ${classe}` : 'dedo-r');
      }
    }
  }
}

// desenha a posição atual das molas
function desenharQuadro() {
  for (const lado of ['e', 'd']) {
    const m = anim[lado], pv = geo.pivo[lado];
    maosG[lado].grupo.setAttribute('transform',
      `translate(${m.x.v.toFixed(2)} ${m.y.v.toFixed(2)}) rotate(${m.r.v.toFixed(2)} ${pv.x.toFixed(1)} ${pv.y.toFixed(1)})`);
  }
  for (const nome of NOMES_DEDOS) {
    const d = dedosEl[nome], a = anim[nome], junta = geo.juntas[nome];
    const dx = a.x.v - junta.x, dy = junta.y - a.y.v;
    const comprimento = (Math.hypot(dx, dy) + d.largura * .42) * (1 - .08 * a.aperto.v);   // afunda ao apertar
    const angulo = Math.atan2(dx, dy) * 180 / Math.PI;
    const engorda = 1 + .06 * a.aperto.v;   // a ponta "amassa" na tecla
    d.g.setAttribute('transform', `translate(${junta.x.toFixed(2)} ${junta.y.toFixed(2)}) rotate(${angulo.toFixed(2)})`);
    d.corpo.setAttribute('transform', `scale(${(d.largura / 24 * engorda).toFixed(4)} ${(comprimento / 100).toFixed(4)})`);
    d.ponta.setAttribute('transform', `translate(0 ${(-comprimento).toFixed(2)})`);
  }
}

// loop de animação: só roda enquanto alguma coisa está se mexendo
let quadroPedido = 0, ultimoQuadro = 0;
function quadro(agora) {
  const dt = Math.min(.032, (agora - ultimoQuadro) / 1000 || .016);
  ultimoQuadro = agora;
  // passos pequenos deixam a mola estável mesmo em telas de 30 ou 144 Hz
  for (let t = 0; t < dt; t += .008) todasMolas.forEach((m) => passoMola(m, Math.min(.008, dt - t)));
  desenharQuadro();
  if (todasMolas.every(parada)) { todasMolas.forEach(fixar); desenharQuadro(); quadroPedido = 0; return; }
  quadroPedido = requestAnimationFrame(quadro);
}

function atualizarMaos() {
  if (!geo) return;
  calcularAlvos();
  if (!quadroPedido) {
    ultimoQuadro = performance.now();
    quadroPedido = requestAnimationFrame(quadro);
  }
}

function mostrarMaos(ligar) {
  maosEl.hidden = !ligar;
  $('botao-maos').setAttribute('aria-pressed', String(ligar));
  medirMaos();
  if (estado) marcarTeclaAtual();
}

// a tela mudou de tamanho? mede o teclado de novo (no máximo 1 vez por quadro)
let medidaPedida = 0;
new ResizeObserver(() => {
  if (medidaPedida) return;
  medidaPedida = requestAnimationFrame(() => { medidaPedida = 0; medirMaos(); });
}).observe(caixaTeclado);


// ---------- 16. Botões e opções ----------
document.querySelectorAll('.opcoes__grupo').forEach((grupo) => {
  grupo.addEventListener('click', (e) => {
    const botao = e.target.closest('button');
    if (!botao) return;
    sairDaMissao();
    config[grupo.dataset.grupo] = botao.dataset.valor;
    gravar('typeskill-config', config);
    iniciarSessao();
  });
});
$('minutos').addEventListener('change', () => {
  sairDaMissao();
  config.minutos = Math.min(60, Math.max(1, Number($('minutos').value) || 10));
  gravar('typeskill-config', config);
  iniciarSessao();
});
$('botao-maos').addEventListener('click', () => {
  config.maos = !config.maos;
  gravar('typeskill-config', config);
  mostrarMaos(config.maos);
  entrada.focus({ preventScroll: true });
});
$('botao-som').addEventListener('click', () => {
  config.som = !config.som;
  gravar('typeskill-config', config);
  marcarOpcoes();
  som('tecla');
  entrada.focus({ preventScroll: true });
});
$('reiniciar').addEventListener('click', iniciarSessao);
$('pausar').addEventListener('click', alternarPausa);
$('r-nova').addEventListener('click', () => { $('resultado').close(); iniciarSessao(); });
$('resultado').addEventListener('close', () => { if (estado.terminou) iniciarSessao(); });

// links do menu que ainda não têm página
document.querySelectorAll('[aria-disabled="true"]').forEach((a) => a.addEventListener('click', (e) => e.preventDefault()));


// ---------- 17. Começar ----------
montarTeclado();
montarMaos();
atualizarXp(progresso.xp);
atualizarCartoes();
iniciarSessao();
mostrarMaos(config.maos);
if (avisoMissao) $('aviso').textContent = avisoMissao;
