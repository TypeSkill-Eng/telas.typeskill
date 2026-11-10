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
const progresso = ler('typeskill-progresso', {});
progresso.xp ||= 0;
progresso.sessoes ||= [];
progresso.premios ||= {};
progresso.recordeCombo ||= 0;
const config = Object.assign(
  { tipo: 'frases', dificuldade: 'medio', duracao: '5', minutos: 10, maos: true, som: false, pele: 1 },
  ler('typeskill-config', {})
);


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
    const conjunto = TEXTOS.letras[dificuldade];
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
    const lista = TEXTOS.palavras[dificuldade];
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
  $('modo-sub').textContent = `Treino Livre · ${nomes[config.tipo]} · ${nomes[config.dificuldade]} · ${minutosDaSessao()} min`;
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
    gravar('typeskill-progresso', progresso);
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
  $('r-xp').textContent = ganho;
  $('r-xp-detalhe').textContent = `Palavras: +${estado.xpPalavras} · Textos: +${estado.xpTextos} · Prêmios: +${estado.xpPremios} · Estrelas: +${bonus}`;

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
  $('resultado').showModal();
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


// ---------- 15. Mãos ----------
// Mãos desenhadas em SVG no estilo ilustração: contorno escuro em volta da
// mão inteira, recheio cor de pele transparente (as teclas aparecem por
// baixo) e risquinhos nas juntas dos dedos.
// - A MÃO INTEIRA anda e gira para alcançar teclas longe da fileira guia
//   (números, Enter, Backspace, Shift...). Os dedos parados vão junto.
// - Cada dedo tem falanges: estica para teclas longe e dobra (fica mais
//   curto, visto de cima) para teclas perto.
// - Ao apertar uma tecla, a ponta vai ao centro dela e a mão dá um tranco.
// - Tudo anda com "molas": acelera, freia e assenta, sem cara de robô.
// Medidas em "u" = distância entre o centro de duas teclas vizinhas.
const caixaTeclado = $('teclado-caixa');
const maosEl = $('maos');
const SVG_NS = 'http://www.w3.org/2000/svg';
const RAD = Math.PI / 180;
const NOMES_DEDOS = ['minimo_e', 'anelar_e', 'medio_e', 'indicador_e', 'polegar_e', 'polegar_d', 'indicador_d', 'medio_d', 'anelar_d', 'minimo_d'];
const DEDOS_MAO = {
  e: ['minimo_e', 'anelar_e', 'medio_e', 'indicador_e', 'polegar_e'],
  d: ['minimo_d', 'anelar_d', 'medio_d', 'indicador_d', 'polegar_d']
};
const CASA = { minimo_e: 'KeyA', anelar_e: 'KeyS', medio_e: 'KeyD', indicador_e: 'KeyF', indicador_d: 'KeyJ', medio_d: 'KeyK', anelar_d: 'KeyL', minimo_d: 'Semicolon' };
const TONS_PELE = [
  { id: 'clara', nome: 'clara' }, { id: 'media', nome: 'média' },
  { id: 'morena', nome: 'morena' }, { id: 'escura', nome: 'escura' }
];   // as cores ficam no praticar.css (.maos[data-pele="..."])
const ladoDe = (nome) => (nome.endsWith('_e') ? 'e' : 'd');
const tipoDe = (nome) => nome.split('_')[0];
const limitar = (v, min, max) => Math.min(max, Math.max(min, v));

// Desenho da mão DIREITA, em "u": x cresce para o lado do dedo mínimo,
// y cresce para baixo, e (0, 0) é o centro da tecla J.
// A mão esquerda é o espelho disso, com (0, 0) no centro do F.
//   mcp      = junta da base do dedo (o "nó" nas costas da mão)
//   comp     = comprimento do dedo todo esticado, da junta até a ponta
//   falanges = quanto cada osso ocupa do comprimento (base, meio, ponta)
//   larg     = largura na base, nas 2 juntas e na ponta
//   curva    = arco natural do dedo (o mínimo puxa para o lado do anelar)
const ANATOMIA = {
  indicador: { mcp: [0.15, 2.6],  comp: 3.75, falanges: [0.47, 0.29, 0.24], larg: [0.72, 0.64, 0.58, 0.54], curva: -0.05 },
  medio:     { mcp: [0.85, 2.5],  comp: 4.1,  falanges: [0.46, 0.30, 0.24], larg: [0.74, 0.66, 0.6, 0.56],  curva: 0.03 },
  anelar:    { mcp: [1.53, 2.58], comp: 3.85, falanges: [0.46, 0.30, 0.24], larg: [0.7, 0.62, 0.56, 0.52],  curva: 0.05 },
  minimo:    { mcp: [2.15, 2.8],  comp: 3.2,  falanges: [0.45, 0.29, 0.26], larg: [0.62, 0.55, 0.5, 0.47],  curva: 0.06 },
  // o polegar nasce perto do pulso (cmc), tem 2 falanges e descansa no espaço
  polegar:   { cmc: [0.45, 5.0], mcp: [-0.55, 3.8], comp: 2.9, falanges: [0.56, 0.44], larg: [1.0, 0.84, 0.75, 0.68], curva: 0.06 }
};
// a mão toda fica inclinada para dentro (dedos abertos em leque), girando o
// desenho em volta deste ponto da fileira guia
const INCLINACAO = -16;
const ANCORA = [1.0, 0.2];
const DOBRA = { dedo: [32, 52, 24], polegar: [14, 36] };   // graus de cada junta com o dedo todo dobrado
const PIVO = [1.45, 5.3];                                     // o pulso: a mão gira em volta dele
// contorno da palma + antebraço: entre os dedos (as "forquilhas"), lado do
// mínimo, antebraço, pulso e a pele entre o polegar e o indicador
const PALMA = [
  [-0.21, 2.75], [0.15, 2.35], [0.5, 2.45], [0.85, 2.25], [1.19, 2.45], [1.53, 2.33], [1.84, 2.6], [2.15, 2.55], [2.46, 2.85],
  [2.6, 3.5], [2.55, 4.5], [2.35, 5.4], [2.5, 7.0], [2.7, 9.2],
  [0.4, 9.4], [0.2, 7.0], [0.15, 5.6], [-0.05, 4.7], [-0.3, 3.95], [-0.32, 3.35], [-0.26, 3.05]
];

// Quanto a mão acompanha o dedo (mude à vontade)
const MOVIMENTO = {
  pontaAbaixo: 0.24,   // a ponta para um pouco abaixo do centro da tecla, e a letra continua visível
  alcanceLivre: 1.2,   // até ~1 tecla de distância, quase só o dedo estica
  segue: 0.2,          // a mão sempre acompanha um pouco o dedo...
  segueLonge: 0.55,    // ...e acompanha bem mais quando a tecla está longe
  desceMenos: 0.5,     // para teclas de baixo o dedo dobra; a mão quase não desce
  giroPorTecla: 5.5,   // graus que a mão gira para cada tecla de deslocamento para o lado
  giroMax: 14,
  esticaMax: 0.93,     // o dedo não estica mais que isso: a mão vai até a tecla
  dobraMax: 0.4        // nem dobra mais que isso: a mão recua um pouco
};

const pose = { e: novaPose(), d: novaPose() };   // posição e giro de cada mão
const pontas = {};                               // ponta de cada dedo
for (const nome of NOMES_DEDOS) pontas[nome] = { x: 0, y: 0, vx: 0, vy: 0, p: 0, vp: 0, tp: 0, k: 0.5, alvo: null, classe: '' };
const partes = {};                               // elementos SVG
let geo = null;                                  // medidas do teclado (refeitas quando a tela muda)
let rafMaos = 0, ultimoQuadro = 0, jaApertadas = new Set();
const movimentoReduzido = matchMedia('(prefers-reduced-motion: reduce)');

function novaPose() { return { x: 0, y: 0, r: 0, vx: 0, vy: 0, vr: 0, tx: 0, ty: 0, tr: 0 }; }

// --- 15a. Montar o desenho (uma vez só) ---
// Truque do contorno: as formas da mão (palma + dedos) são usadas 3 vezes com
// <use>: (1) recheio transparente, (2) traço grosso e (3) numa máscara que
// apaga o traço por dentro da mão. Sobra só o contorno de fora, como num desenho.
function criar(tag, attrs = {}, pai) {
  const el = document.createElementNS(SVG_NS, tag);
  for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, v);
  if (pai) pai.append(el);
  return el;
}

function montarMaos() {
  const svg = criar('svg', { class: 'maos__svg', 'aria-hidden': 'true' }, maosEl);
  const defs = criar('defs', {}, svg);
  const tudo = { x: -2000, y: -2000, width: 6000, height: 6000 };
  for (const h of ['e', 'd']) {
    const formas = criar('g', { id: `mao-formas-${h}` }, defs);
    partes[h] = { palma: criar('path', {}, formas) };
    const dedos = ['minimo', 'anelar', 'medio', 'indicador', 'polegar'].map((t) => `${t}_${h}`);
    for (const nome of dedos) partes[nome] = { forma: criar('path', {}, formas) };
    const mascara = criar('mask', { id: `mao-mascara-${h}`, maskUnits: 'userSpaceOnUse', ...tudo }, defs);
    criar('rect', { ...tudo, fill: '#fff' }, mascara);
    criar('use', { href: `#mao-formas-${h}`, fill: '#000', stroke: 'none' }, mascara);

    const g = criar('g', { class: `mao mao--${h}` }, svg);
    criar('use', { href: `#mao-formas-${h}`, class: 'mao__recheio' }, g);
    for (const nome of dedos) partes[nome].destaque = criar('path', { class: 'mao__destaque' }, g);
    partes[h].contorno = criar('use', { href: `#mao-formas-${h}`, class: 'mao__contorno', mask: `url(#mao-mascara-${h})` }, g);
    partes[h].vincos = criar('path', { class: 'mao__vincos' }, g);
    partes[h].unhas = criar('path', { class: 'mao__unhas' }, g);
  }
  const aneis = criar('g', {}, svg);   // "aperte aqui" na ponta do dedo certo
  for (const nome of NOMES_DEDOS) partes[nome].anel = criar('circle', { class: 'mao__anel', r: 10 }, aneis);
}

// --- 15b. Medir o teclado ---
function medirMaos() {
  if (caixaTeclado.offsetWidth === 0 || maosEl.hidden) { geo = null; return; }
  const base = maosEl.getBoundingClientRect();
  const t = {};
  for (const [codigo, lista] of Object.entries(teclas)) {
    const r = lista[0].getBoundingClientRect();
    t[codigo] = { x: r.left - base.left + r.width / 2, y: r.top - base.top + r.height / 2, w: r.width, h: r.height };
  }
  const u = t.KeyS.x - t.KeyA.x;
  geo = { u, fila: t.KeyZ.y - t.KeyA.y, teclas: t, maos: {}, casa: {} };
  pista.style.setProperty('--maos-sobra', `${Math.round(u * 3)}px`);   // espaço para pulso e antebraço

  for (const [h, espelho, codigo] of [['e', -1, 'KeyF'], ['d', 1, 'KeyJ']]) {
    const o = t[codigo];
    geo.maos[h] = { o, espelho };
    geo.maos[h].pivo = repouso(h, PIVO[0], PIVO[1]);
  }
  for (const [nome, codigo] of Object.entries(CASA)) {
    geo.casa[nome] = { x: t[codigo].x, y: t[codigo].y + MOVIMENTO.pontaAbaixo * u };
  }
  for (const h of ['e', 'd']) {
    const m = geo.maos[h];
    geo.casa[`polegar_${h}`] = { x: m.o.x - m.espelho * 1.05 * u, y: t.Space.y + 0.1 * u };
  }

  geo.traco = Math.max(2, u * 0.065);   // grossura do contorno
  // o traço é o dobro: a metade de dentro fica escondida pela máscara
  for (const h of ['e', 'd']) {
    partes[h].contorno.setAttribute('stroke-width', (geo.traco * 2).toFixed(1));
    partes[h].unhas.setAttribute('stroke-width', (geo.traco * 0.75).toFixed(1));
  }
  for (const nome of NOMES_DEDOS) partes[nome].anel.setAttribute('r', (u * 0.36).toFixed(1));
  atualizarMaos();
  pularParaOAlvo();
}

// --- 15c. Para onde vai cada mão e cada dedo ---
// mão em repouso: ponto do desenho (em "u") → posição na tela
function repouso(h, lx, ly) {
  const m = geo.maos[h];
  const c = Math.cos(INCLINACAO * RAD), s = Math.sin(INCLINACAO * RAD);
  const dx = lx - ANCORA[0], dy = ly - ANCORA[1];
  const x = ANCORA[0] + dx * c - dy * s, y = ANCORA[1] + dx * s + dy * c;
  return { x: m.o.x + m.espelho * x * geo.u, y: m.o.y + y * geo.u };
}
// aplica o giro (em volta do pulso) e o deslocamento da mão a um ponto
function mover(h, p, ps) {
  const pv = geo.maos[h].pivo;
  const c = Math.cos(ps.r * RAD), s = Math.sin(ps.r * RAD);
  const dx = p.x - pv.x, dy = p.y - pv.y;
  return { x: pv.x + dx * c - dy * s + ps.x, y: pv.y + dx * s + dy * c + ps.y };
}
const naMao = (h, lx, ly, ps) => mover(h, repouso(h, lx, ly), ps);

// onde a ponta do dedo encosta numa tecla
function pontoAlvo(nome, codigo, apertando) {
  const u = geo.u;
  if (codigo === 'Space') return geo.casa[nome.startsWith('polegar') ? nome : 'polegar_d'];
  const k = geo.teclas[codigo];
  const casa = geo.casa[nome];
  if (!k) return casa;
  let x = k.x, y = k.y;
  // tecla larga ou alta (Shift, Enter, Backspace...): o dedo pega o canto mais perto
  if (k.w > 1.35 * u) { const folga = k.w / 2 - 0.45 * u; x = limitar(casa.x, k.x - folga, k.x + folga); }
  if (k.h > 1.35 * geo.fila) { const folga = k.h / 2 - 0.4 * geo.fila; y = limitar(casa.y - MOVIMENTO.pontaAbaixo * u, k.y - folga, k.y + folga); }
  return { x, y: y + (apertando ? 0.1 : MOVIMENTO.pontaAbaixo) * u };
}

// quanto a mão anda e gira para os dedos alcançarem as teclas
function calcularPose(h, destino) {
  const u = geo.u, M = MOVIMENTO;
  let x = 0, y = 0, n = 0;
  const ativos = [];
  for (const nome of DEDOS_MAO[h]) {
    const d = destino[nome];
    if (!d || nome.startsWith('polegar')) continue;
    const alvo = pontoAlvo(nome, d.codigo, d.classe === 'apertando');
    ativos.push({ nome, alvo });
    const casa = geo.casa[nome];
    const dx = alvo.x - casa.x, dy = alvo.y - casa.y, dist = Math.hypot(dx, dy);
    if (dist < 1) continue;
    const anda = M.segue * dist + Math.max(0, dist - M.alcanceLivre * u) * M.segueLonge;
    x += (dx / dist) * anda;
    y += (dy / dist) * anda;
    n++;
  }
  if (n) { x /= n; y /= n; }
  if (y > 0) y *= M.desceMenos;
  const ps = { x, y, r: limitar((x / u) * M.giroPorTecla, -M.giroMax, M.giroMax) };
  // confere se o dedo alcança mesmo; se não, a mão chega mais perto (ou recua)
  for (let volta = 0; volta < 4 && ativos.length; volta++) {
    let cx = 0, cy = 0;
    for (const { nome, alvo } of ativos) {
      const an = ANATOMIA[tipoDe(nome)];
      const base = naMao(h, an.mcp[0], an.mcp[1], ps);
      const dx = alvo.x - base.x, dy = alvo.y - base.y, dist = Math.hypot(dx, dy) || 1;
      const L = an.comp * u;
      if (dist > M.esticaMax * L) { const k = dist - M.esticaMax * L; cx += (dx / dist) * k; cy += (dy / dist) * k; }
      else if (dist < M.dobraMax * L) { const k = M.dobraMax * L - dist; cx -= (dx / dist) * k; cy -= (dy / dist) * k; }
    }
    if (Math.abs(cx) + Math.abs(cy) < 0.5) break;
    ps.x += cx / ativos.length;
    ps.y += cy / ativos.length;
  }
  return ps;
}

// dedo sem tecla: fica na fileira guia; se a mão andou muito, vai junto com ela
function pontaLivre(h, nome) {
  const casa = geo.casa[nome];
  const p = pose[h];
  const levada = mover(h, casa, p);
  const anda = Math.hypot(p.tx, p.ty);
  // o polegar não fica "preso" no espaço: sobe junto com a mão
  const junto = nome.startsWith('polegar')
    ? limitar(anda / (0.5 * geo.u), 0, 1)
    : limitar((anda - 0.35 * geo.u) / (1.5 * geo.u), 0, 1);
  return { x: casa.x + (levada.x - casa.x) * junto, y: casa.y + (levada.y - casa.y) * junto };
}

function atualizarMaos() {
  if (!geo) return;
  // 1) quem precisa ir para onde
  const destino = {};   // dedo -> { codigo, classe }
  guiaAtual.forEach((codigo, i) => {
    const dedo = dedoDe(codigo);
    if (dedo) destino[dedo] = { codigo, classe: i === guiaAtual.length - 1 ? 'ativo' : 'apoio' };
  });
  for (const codigo of pressionadas) {           // tecla apertada de verdade tem prioridade
    const dedo = dedoDe(codigo);
    if (dedo) destino[dedo] = { codigo, classe: 'apertando' };
  }
  // 2) a mão inteira
  for (const h of ['e', 'd']) {
    const alvo = calcularPose(h, destino);
    Object.assign(pose[h], { tx: alvo.x, ty: alvo.y, tr: alvo.r });
  }
  // 3) cada dedo
  for (const nome of NOMES_DEDOS) {
    const d = destino[nome], est = pontas[nome];
    est.classe = d ? d.classe : '';
    est.alvo = d ? pontoAlvo(nome, d.codigo, d.classe === 'apertando') : null;
    est.tp = d && d.classe === 'apertando' ? 1 : 0;
  }
  // 4) tecla que acabou de ser apertada: a mão dá um tranco para baixo
  if (!movimentoReduzido.matches) {
    for (const codigo of pressionadas) {
      const dedo = dedoDe(codigo);
      if (dedo && !jaApertadas.has(codigo)) pose[ladoDe(dedo)].vy += geo.u * 4;
    }
  }
  jaApertadas = new Set(pressionadas);
  acordarMaos();
}

// --- 15d. Animação com molas ---
function mola(o, chave, vel, alvo, w, z, dt, folga) {
  o[vel] += (w * w * (alvo - o[chave]) - 2 * z * w * o[vel]) * dt;
  o[chave] += o[vel] * dt;
  if (Math.abs(alvo - o[chave]) < folga && Math.abs(o[vel]) < folga * 10) { o[chave] = alvo; o[vel] = 0; return false; }
  return true;
}

function acordarMaos() {
  if (rafMaos || !geo) return;
  ultimoQuadro = performance.now();
  rafMaos = requestAnimationFrame(passoMaos);
}

function passoMaos(agora) {
  rafMaos = 0;
  if (!geo) return;
  const dt = limitar((agora - ultimoQuadro) / 1000, 0.001, 0.05);
  ultimoQuadro = agora;
  // mão é mais pesada (mola mais lenta) que os dedos
  const [wMao, zMao, wDedo, zDedo] = movimentoReduzido.matches ? [40, 1, 50, 1] : [15, 0.78, 32, 0.76];
  // em computador lento o quadro demora mais: a conta é feita em passinhos
  // de no máximo 8 ms, senão as molas "explodem" e os dedos entortam
  const passos = Math.ceil(dt / 0.008);
  const h = dt / passos;
  let mexendo = false;
  for (let i = 0; i < passos; i++) {
    mexendo = false;
    for (const lado of ['e', 'd']) {
      const p = pose[lado];
      mexendo = mola(p, 'x', 'vx', p.tx, wMao, zMao, h, 0.1) || mexendo;
      mexendo = mola(p, 'y', 'vy', p.ty, wMao, zMao, h, 0.1) || mexendo;
      mexendo = mola(p, 'r', 'vr', p.tr, wMao, zMao, h, 0.02) || mexendo;
    }
    for (const nome of NOMES_DEDOS) {
      const est = pontas[nome];
      const alvo = est.alvo || pontaLivre(ladoDe(nome), nome);
      mexendo = mola(est, 'x', 'vx', alvo.x, wDedo, zDedo, h, 0.1) || mexendo;
      mexendo = mola(est, 'y', 'vy', alvo.y, wDedo, zDedo, h, 0.1) || mexendo;
      mexendo = mola(est, 'p', 'vp', est.tp, 38, 0.9, h, 0.01) || mexendo;
    }
  }
  desenharMaos();
  if (mexendo) rafMaos = requestAnimationFrame(passoMaos);
}

function pularParaOAlvo() {
  if (!geo) return;
  for (const h of ['e', 'd']) {
    const p = pose[h];
    Object.assign(p, { x: p.tx, y: p.ty, r: p.tr, vx: 0, vy: 0, vr: 0 });
  }
  for (const nome of NOMES_DEDOS) {
    const est = pontas[nome];
    const alvo = est.alvo || pontaLivre(ladoDe(nome), nome);
    Object.assign(est, { x: alvo.x, y: alvo.y, vx: 0, vy: 0, p: est.tp, vp: 0 });
  }
  desenharMaos();
}

// --- 15e. Desenhar ---
const fmt = (p) => `${p.x.toFixed(1)} ${p.y.toFixed(1)}`;
// curva suave passando por todos os pontos (Catmull-Rom)
function segmentos(pts, fechada = false) {
  const n = pts.length;
  const pega = (j) => (fechada ? pts[(j + n) % n] : pts[limitar(j, 0, n - 1)]);
  let d = '';
  for (let i = 0; i < (fechada ? n : n - 1); i++) {
    const p0 = pega(i - 1), p1 = pega(i), p2 = pega(i + 1), p3 = pega(i + 2);
    d += `C${fmt({ x: p1.x + (p2.x - p0.x) / 6, y: p1.y + (p2.y - p0.y) / 6 })} ${fmt({ x: p2.x - (p3.x - p1.x) / 6, y: p2.y - (p3.y - p1.y) / 6 })} ${fmt(p2)}`;
  }
  return d;
}
const curvaAberta = (pts) => `M${fmt(pts[0])}${segmentos(pts)}`;
const curvaFechada = (pts) => `M${fmt(pts[0])}${segmentos(pts, true)}Z`;

// resolve o dedo: dada a junta da base e o ponto da ponta, quanto ele dobra.
// Visto de cima, cada falange aparece com comprimento × cos(ângulo).
function resolverCadeia(base, alvo, comp, falanges, dobra) {
  let vx = alvo.x - base.x, vy = alvo.y - base.y;
  const D = Math.hypot(vx, vy);
  if (D < 0.01) { vx = 0; vy = -1; } else { vx /= D; vy /= D; }
  const projetar = (k) => {
    let angulo = 0;
    return falanges.map((f, i) => { angulo += dobra[i] * k; return f * comp * Math.max(Math.cos(angulo * RAD), 0.12); });
  };
  let lo = 0, hi = 1;   // procura a dobra certa por bissecção
  for (let i = 0; i < 18; i++) {
    const meio = (lo + hi) / 2;
    if (projetar(meio).reduce((a, b) => a + b, 0) > D) lo = meio; else hi = meio;
  }
  const k = (lo + hi) / 2;
  const p = projetar(k);
  return { vx, vy, nx: -vy, ny: vx, k, p, S: p.reduce((a, b) => a + b, 0) };
}
function pontoNoDedo(base, c, s, w, curva) {
  const arco = curva * Math.sin(Math.PI * limitar(s / c.S, 0, 1));
  return { x: base.x + c.vx * s + c.nx * arco, y: base.y + c.vy * s + c.ny * arco, w };
}
// contorno de um "tubo" que afina, com a ponta arredondada
function tubo(esp) {
  const n = esp.length, a = [], b = [];
  for (let i = 0; i < n; i++) {
    const p = esp[Math.max(0, i - 1)], q = esp[Math.min(n - 1, i + 1)];
    let tx = q.x - p.x, ty = q.y - p.y;
    const m = Math.hypot(tx, ty) || 1;
    tx /= m; ty /= m;
    const r = esp[i].w / 2;
    a.push({ x: esp[i].x - ty * r, y: esp[i].y + tx * r });
    b.push({ x: esp[i].x + ty * r, y: esp[i].y - tx * r });
  }
  return { a, b, r: esp[n - 1].w / 2 };
}
const raio = (f) => `${f.r.toFixed(1)} ${f.r.toFixed(1)}`;
function caminhoTubo(f) {
  return `${curvaAberta(f.a)}A${raio(f)} 0 0 0 ${fmt(f.b[f.b.length - 1])}${segmentos([...f.b].reverse())}Z`;
}
// risquinho de junta: traço curvo que afina nas pontas, como feito a pincel.
// encostado = começa grudado na borda do dedo (como na ilustração)
function vinco(base, c, s, w, curva, lado, tam, encostado) {
  const j = pontoNoDedo(base, c, s, 0, curva);
  const giro = lado * 0.16;   // levemente torto, para parecer desenhado à mão
  const nx = c.nx * Math.cos(giro) - c.ny * Math.sin(giro);
  const ny = c.nx * Math.sin(giro) + c.ny * Math.cos(giro);
  const desloc = lado * (encostado ? 0.5 - tam : 0.1) * w;
  const cx = j.x + c.nx * desloc, cy = j.y + c.ny * desloc;
  const a = { x: cx - nx * w * tam, y: cy - ny * w * tam };
  const b = { x: cx + nx * w * tam, y: cy + ny * w * tam };
  const arco = w * 0.18, grossura = geo.traco * 0.65;
  const meio = { x: cx + c.vx * arco, y: cy + c.vy * arco };
  return `M${fmt(a)}Q${fmt({ x: meio.x + c.vx * grossura, y: meio.y + c.vy * grossura })} ${fmt(b)}` +
    `Q${fmt({ x: meio.x - c.vx * grossura, y: meio.y - c.vy * grossura })} ${fmt(a)}Z`;
}

// fita: linha de grossura variável (t) que passa pelos pontos; com t = 0 nas
// pontas, ela afina até sumir, como um traço de caneta-pincel
function fita(pts) {
  const n = pts.length, a = [], b = [];
  for (let i = 0; i < n; i++) {
    const p = pts[Math.max(0, i - 1)], q = pts[Math.min(n - 1, i + 1)];
    let tx = q.x - p.x, ty = q.y - p.y;
    const m = Math.hypot(tx, ty) || 1;
    tx /= m; ty /= m;
    const r = pts[i].t / 2;
    a.push({ x: pts[i].x - ty * r, y: pts[i].y + tx * r });
    b.push({ x: pts[i].x + ty * r, y: pts[i].y - tx * r });
  }
  return `M${fmt(a[0])}${segmentos(a)}L${fmt(b[n - 1])}${segmentos([...b].reverse())}Z`;
}
const larguraEm = (marcas, s) => {
  for (let i = 1; i < marcas.length; i++) {
    if (s <= marcas[i][0]) {
      const [s0, w0] = marcas[i - 1], [s1, w1] = marcas[i];
      return w0 + (w1 - w0) * limitar((s - s0) / ((s1 - s0) || 1), 0, 1);
    }
  }
  return marcas[marcas.length - 1][1];
};
// linha entre um dedo e o vizinho: desce pela lateral e some afinando dentro
// da palma, com uma voltinha no fim
function linhaEntreDedos(base, c, curva, marcas, lado, sFim) {
  const u = geo.u, W = geo.traco * 0.9, pts = [];
  const sIni = -0.65 * u;
  for (let i = 0; i <= 14; i++) {
    const s = sIni + (sFim - sIni) * (i / 14);
    const w = larguraEm(marcas, s);
    const volta = s < 0 ? (-s / (0.65 * u)) * 0.18 * u : 0;   // a ponta de baixo curva para o meio do dedo
    const p = pontoNoDedo(base, c, s, 0, curva);
    const d = lado * (w / 2 - volta);
    const sobe = limitar((s - sIni) / (0.6 * u), 0, 1), fim = limitar((sFim - s) / (0.5 * u), 0, 1) * 0.5 + 0.5;
    pts.push({ x: p.x + c.nx * d, y: p.y + c.ny * d, t: W * sobe * fim });
  }
  return fita(pts);
}
// contorno da unha: um "U" na ponta do dedo (o lado de cima é a própria ponta)
function unha(base, c, curva, larguraPonta, real) {
  const u = geo.u, hw = larguraPonta * 0.3;
  const distal = c.p[c.p.length - 1];
  const nl = limitar(0.5 * Math.max(distal, 0.35 * real), hw * 1.5, 0.85 * (distal + larguraPonta / 2));
  const sTopo = c.S - 0.07 * u, sBase = c.S - nl;
  const P = (s, l) => { const q = pontoNoDedo(base, c, s, 0, curva); return { x: q.x + c.nx * l, y: q.y + c.ny * l }; };
  return curvaAberta([P(sTopo, -hw), P(sBase + hw * 0.6, -hw), P(sBase, -hw * 0.45), P(sBase - hw * 0.08, 0), P(sBase, hw * 0.45), P(sBase + hw * 0.6, hw), P(sTopo, hw)]);
}

// destaque turquesa no dedo da próxima tecla (só a parte fora da palma) e o anel na ponta
function marcarDedo(nome, base, c, curva, marcas) {
  const est = pontas[nome], r = partes[nome], u = geo.u;
  const classe = est.classe === 'apertando' ? 'ativo' : est.classe;
  r.destaque.setAttribute('d', classe && marcas.length > 1 ? caminhoTubo(tubo(marcas.map(([s, w]) => pontoNoDedo(base, c, s, w, curva)))) : '');
  r.destaque.setAttribute('class', `mao__destaque${classe ? ` ${classe}` : ''}`);
  const anel = pontoNoDedo(base, c, c.S - 0.3 * u, 0, curva);
  r.anel.setAttribute('cx', anel.x.toFixed(1));
  r.anel.setAttribute('cy', anel.y.toFixed(1));
  r.anel.setAttribute('class', `mao__anel${est.classe && est.classe !== 'apertando' ? ` ${est.classe}` : ''}`);
}

function desenharDedo(h, t) {
  const nome = `${t}_${h}`, an = ANATOMIA[t], u = geo.u;
  const base = naMao(h, an.mcp[0], an.mcp[1], pose[h]);
  const c = resolverCadeia(base, pontas[nome], an.comp * u, an.falanges, DOBRA.dedo);
  const larg = an.larg.map((l) => l * u);
  const curva = an.curva * u * geo.maos[h].espelho;
  const s1 = c.p[0], s2 = c.p[0] + c.p[1], sPonta = c.S - larg[3] / 2;
  const marcas = [
    [-0.55 * u, larg[0] * 1.05], [0, larg[0]],
    [s1 / 2, (larg[0] + larg[1]) / 2 - 0.015 * u], [s1, larg[1] + 0.02 * u],         // junta do meio
    [(s1 + s2) / 2, (larg[1] + larg[2]) / 2 - 0.01 * u], [s2, larg[2] + 0.01 * u],   // junta da ponta
    [(s2 + sPonta) / 2, (larg[2] + larg[3]) / 2]
  ].filter(([s]) => s < sPonta - 0.05 * u);
  marcas.push([sPonta, larg[3]]);
  partes[nome].forma.setAttribute('d', caminhoTubo(tubo(marcas.map(([s, w]) => pontoNoDedo(base, c, s, w, curva)))));
  marcarDedo(nome, base, c, curva, [[0.05 * u, larg[0]], ...marcas.filter(([s]) => s > 0.12 * u)]);
  // risquinhos: na junta da ponta, na do meio e (nos dedos maiores) um mais embaixo
  const lado = geo.maos[h].espelho;   // assim os risquinhos ficam espelhados nas duas mãos
  let v = '';
  if (s2 < sPonta - 0.12 * u) v += vinco(base, c, s2, larg[2], curva, -lado, 0.24, true);
  v += vinco(base, c, s1, larg[1], curva, lado, 0.3, false);
  if (t !== 'minimo' && s1 * 0.45 > 0.3 * u) v += vinco(base, c, s1 * 0.45, larg[0], curva, -lado, 0.2, true);
  // linha que separa este dedo do vizinho do lado do polegar (o indicador já tem o contorno de fora)
  if (t !== 'indicador') v += linhaEntreDedos(base, c, curva, marcas, -lado, sPonta);
  partes[nome].unha = unha(base, c, curva, larg[3], an.falanges[2] * an.comp * u);
  return v;
}

function desenharPolegar(h) {
  const nome = `polegar_${h}`, an = ANATOMIA.polegar, u = geo.u, ps = pose[h];
  const C = naMao(h, an.cmc[0], an.cmc[1], ps);
  const base = naMao(h, an.mcp[0], an.mcp[1], ps);
  const c = resolverCadeia(base, pontas[nome], an.comp * u, an.falanges, DOBRA.polegar);
  const larg = an.larg.map((l) => l * u);   // [pulso, base, junta, ponta]
  const curva = an.curva * u * geo.maos[h].espelho;
  const sPonta = c.S - larg[3] / 2;
  const marcas = [[c.p[0] / 2, (larg[1] + larg[2]) / 2 - 0.015 * u], [c.p[0], larg[2] + 0.02 * u], [(c.p[0] + sPonta) / 2, (larg[2] + larg[3]) / 2]]
    .filter(([s]) => s > 0.05 * u && s < sPonta - 0.05 * u);
  marcas.push([sPonta, larg[3]]);
  const espinha = [
    { x: C.x + (C.x - base.x) * 0.22, y: C.y + (C.y - base.y) * 0.22, w: larg[0] * 0.62 },
    { x: C.x, y: C.y, w: larg[0] },
    { x: (C.x + base.x) / 2, y: (C.y + base.y) / 2, w: (larg[0] + larg[1]) / 2 + 0.04 * u },
    { x: base.x, y: base.y, w: larg[1] },
    ...marcas.map(([s, w]) => pontoNoDedo(base, c, s, w, curva))
  ];
  partes[nome].forma.setAttribute('d', caminhoTubo(tubo(espinha)));
  marcarDedo(nome, base, c, curva, [[0.05 * u, larg[1]], ...marcas]);
  const lado = geo.maos[h].espelho;
  // linha do lado de dentro do polegar: desce pela palma e some perto do pulso
  const borda = tubo(espinha)[lado > 0 ? 'a' : 'b'];
  const W = geo.traco * 0.9, sIP = c.p[0];
  const linha = borda.slice(0, 4).map((p, i) => ({ ...p, t: W * [0, 0.55, 1, 1][i] }));
  for (const [s, w] of [[0.15 * u, 1], [sIP * 0.6, 0.7], [sIP, 0]]) {
    const q = pontoNoDedo(base, c, s, 0, curva), meia = larguraEm([[0, larg[1]], ...marcas], s) / 2;
    linha.push({ x: q.x + c.nx * lado * meia, y: q.y + c.ny * lado * meia, t: W * w });
  }
  // unha vista meio de lado: um oval puxado para fora da mão
  const distal = c.p[1], comp = limitar(0.55 * Math.max(distal, 0.4 * an.falanges[1] * an.comp * u), larg[3] * 0.75, 0.8 * (distal + larg[3] / 2));
  const centro = pontoNoDedo(base, c, c.S - 0.08 * u - comp / 2, 0, curva), fora = -lado * larg[3] * 0.18;
  const cx = centro.x + c.nx * fora, cy = centro.y + c.ny * fora;
  const ang = (Math.atan2(c.vy, c.vx) / RAD).toFixed(1), ra = comp / 2, rb = larg[3] * 0.2;
  const ini = { x: cx - c.vx * ra, y: cy - c.vy * ra }, fim = { x: cx + c.vx * ra, y: cy + c.vy * ra };
  partes[nome].unha = `M${fmt(ini)}A${ra.toFixed(1)} ${rb.toFixed(1)} ${ang} 1 0 ${fmt(fim)}A${ra.toFixed(1)} ${rb.toFixed(1)} ${ang} 1 0 ${fmt(ini)}`;
  return fita(linha) + vinco(base, c, sIP, larg[2], curva, lado, 0.26, true) + vinco(base, c, 0.2 * u, larg[1], curva, -lado, 0.28, false);
}

function desenharMao(h) {
  let vincos = '';
  for (const t of ['minimo', 'anelar', 'medio', 'indicador']) vincos += desenharDedo(h, t);
  vincos += desenharPolegar(h);
  partes[h].palma.setAttribute('d', curvaFechada(PALMA.map(([x, y]) => naMao(h, x, y, pose[h]))));
  partes[h].vincos.setAttribute('d', vincos);
  partes[h].unhas.setAttribute('d', ['minimo', 'anelar', 'medio', 'indicador', 'polegar'].map((t) => partes[`${t}_${h}`].unha).join(''));
}

function desenharMaos() {
  if (!geo) return;
  desenharMao('e');
  desenharMao('d');
}

function mostrarMaos(ligar) {
  maosEl.hidden = !ligar;
  pista.classList.toggle('com-maos', ligar);
  $('botao-maos').setAttribute('aria-pressed', String(ligar));
  $('botao-pele').hidden = !ligar;
  medirMaos();
  if (estado) marcarTeclaAtual();
}

function aplicarPele() {
  const tom = TONS_PELE[Number(config.pele) % TONS_PELE.length] || TONS_PELE[1];
  maosEl.dataset.pele = tom.id;
  $('pele-cor').style.background = getComputedStyle(maosEl).getPropertyValue('--pele');
  $('botao-pele').title = `Tom de pele: ${tom.nome} (clique para trocar)`;
}

// a tela mudou de tamanho? mede o teclado de novo
// (observa também a área: o teclado pode mudar de lugar sem mudar de tamanho)
const observador = new ResizeObserver(() => { medirMaos(); });
observador.observe(caixaTeclado);
observador.observe($('teclado-area'));


// ---------- 16. Botões e opções ----------
document.querySelectorAll('.opcoes__grupo').forEach((grupo) => {
  grupo.addEventListener('click', (e) => {
    const botao = e.target.closest('button');
    if (!botao) return;
    config[grupo.dataset.grupo] = botao.dataset.valor;
    gravar('typeskill-config', config);
    iniciarSessao();
  });
});
$('minutos').addEventListener('change', () => {
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
$('botao-pele').addEventListener('click', () => {
  config.pele = (Number(config.pele) + 1) % TONS_PELE.length;
  gravar('typeskill-config', config);
  aplicarPele();
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
aplicarPele();
mostrarMaos(config.maos);
