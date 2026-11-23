// =========================================================
// TypeSkill — mundos.js (mapa de ilhas de cada módulo)
//
// Cada módulo das Missões é um mundo com uma ilha flutuante por
// lição, ligadas por um caminho tracejado, e um baú no final:
//   ✓ verde  = lição concluída
//   laranja  = lição atual (a ilha fica flutuando)
//   cinza    = bloqueada (ilha de pedra)
// Mundo 1 Floresta · 2 Deserto · 3 Neve · 4 Vulcão
// Desenhado em pixel art com o pixel.js.
// =========================================================
(function () {
  var TEMAS = [
    { id: 'floresta', nome: 'Floresta das Letras', G: '#7ed957', g: '#4caf3a', D: '#a0673a', d: '#7a4a26', T: '#3fa34d', t: '#2b7a38', w: '#7a4a26' },
    { id: 'deserto', nome: 'Deserto das Palavras', G: '#f6d27a', g: '#e0b04f', D: '#c98a4b', d: '#9c6534', C: '#4caf50', c: '#2f7d33' },
    { id: 'neve', nome: 'Montanhas das Frases', G: '#ffffff', g: '#cfe3f2', D: '#8a9bb0', d: '#66788f', T: '#2f8f5b', t: '#1f6b42', n: '#ffffff', w: '#6b4423' },
    { id: 'vulcao', nome: 'Vulcão dos Textos', G: '#6b5a6e', g: '#4a3d4e', D: '#40303f', d: '#2a1f2b', R: '#5b4b5e', r: '#3e3242', l: '#ff6a00' }
  ];
  var PEDRA = { G: '#c7c9d1', g: '#a3a6b1', D: '#8d909c', d: '#6f727e', R: '#b4b6c0', r: '#8d909c', l: '#a3a6b1', T: '#b4b6c0', t: '#8d909c', C: '#b4b6c0', c: '#8d909c', n: '#dcdde3', w: '#8d909c' };
  var BAU = { K: '#c47a2c', k: '#8a4f1d', y: '#ffc928' };

  // corpo da ilha (a parte de cima começa na linha 8)
  var ILHA = [
    '', '', '', '', '', '', '', '',
    '..GGGGGGGGGGGGGGGGGGGG..',
    '.GGGGGGGGGGGGGGGGGGGGGG.',
    '.gGgGGgGGGgGGGgGGgGGGgg.',
    '.ddDdDDdDDDdDDdDDdDDDdd.',
    '..DDDDDdDDDDDdDDDDDdDD..',
    '...dDDDDDDdDDDDDDDdDD...',
    '....DDdDDDDDDDdDDDDD....',
    '.....dDDDDDdDDDDDdD.....',
    '.......DDDDDDDDDD.......',
    '.........dDDDDd.........',
    '...........dd...........'
  ];
  var LAVA = ['', '', '', '', '', '', '', '', '', '', '', '....l........l.........', '.....l.......ll........', '.............l.....l...', '......l.............', ''];
  var ENFEITES = {
    floresta: [
      '..........TTT...........',
      '.........TTTTT..........',
      '........TTTtTTT.........',
      '........TTTTTTt.........',
      '.........TtTTt..........',
      '..........ww............',
      '..........ww............',
      '..........ww............'
    ],
    deserto: [
      '...........C............',
      '..........CC............',
      '.......C..CCc...........',
      '.......CC.CCc..C........',
      '........CCCCc.CC........',
      '..........CCcCC.........',
      '..........CCc...........',
      '..........CCc...........'
    ],
    neve: [
      '...........n............',
      '..........nTn...........',
      '.........TTTTt..........',
      '........nnTTTnn.........',
      '........TTTTTTt.........',
      '.......nnTTTTTnn........',
      '.......TTTTTTTTt........',
      '...........w............'
    ],
    vulcao: [
      '........................',
      '..........l.............',
      '.........RlR............',
      '........RRlRR...........',
      '........RRRRRr..........',
      '.......RRRRlRRr.........',
      '.......RRRRRRRr.........',
      '......RRRRRRRRRr........'
    ],
    pedra: [
      '', '', '', '', '',
      '..........RRR...........',
      '.........RRRRr..........',
      '........RRRRRRr.........'
    ],
    bau: [
      '', '',
      '.......KKKKKKKKK........',
      '......KKKKKKKKKKk.......',
      '......kkkkyykkkkk.......',
      '......KKKKyyKKKKk.......',
      '......KKKKKKKKKKk.......',
      '......kkkkkkkkkkk.......'
    ]
  };
  var NUVENS = [
    '..WWW...', '.WWWWWW.', 'WWWWWWWW'
  ];

  // desloca um enfeite alguns pixels para o lado (cada ilha fica diferente)
  function deslocar(linhas, dx) {
    return linhas.map(function (l) { return !l ? l : (dx > 0 ? '.'.repeat(dx) + l.slice(0, l.length - dx) : l.slice(-dx) + '.'.repeat(-dx)); });
  }

  // desenho de uma ilha: tema, estado ('feita' | 'atual' | 'bloqueada') e se é o baú
  function ilha(tema, estado, i, ehBau) {
    var enfeite = ehBau ? ENFEITES.bau : estado === 'bloqueada' ? ENFEITES.pedra : deslocar(ENFEITES[tema.id], [0, -4, 3, -2, 4, -3, 2][i % 7]);
    var camadas = [ILHA.map(function (l) { return l || ''; }), enfeite];
    if (tema.id === 'vulcao' && estado !== 'bloqueada') camadas.push(LAVA);
    var linhas = Pixel.juntar.apply(null, [new Array(19).fill('.'.repeat(24))].concat(camadas));
    return linhas;
  }

  // mapa completo de um módulo
  //   modulo: item do Curso.CURSO   licoes: [{ id, nome, estado, link }]   final: { feito }
  function mapa(modulo, licoes, opcoes) {
    opcoes = opcoes || {};
    var tema = TEMAS[(modulo.id - 1) % TEMAS.length];
    var passo = 34, total = licoes.length + 1;
    var L = total * passo + 4, A = 52;
    var pos = function (i) { return { x: 5 + i * passo, y: i % 2 ? 27 : 21 }; };   // zigue-zague
    var svg = '';

    // nuvens ao fundo
    [[8, 3], [L * .45, 1], [L * .8, 5]].forEach(function (n) {
      svg += Pixel.retangulos(NUVENS, { W: 'rgba(255,255,255,.85)' }, { x: Math.round(n[0]), y: n[1] }).svg;
    });
    // caminho tracejado entre as ilhas
    var d = '';
    for (var k = 0; k < total; k++) {
      var p = pos(k), cx = p.x + 12, cy = p.y + 10;
      if (k === 0) d += 'M' + cx + ' ' + cy;
      else { var a = pos(k - 1); d += ' Q' + (a.x + 12 + passo / 2) + ' ' + (Math.min(a.y, p.y) - 2) + ' ' + cx + ' ' + cy; }
    }
    svg += '<path d="' + d + '" class="mundo__caminho"/>';

    // ilhas + plaquinhas
    var feitoModulo = licoes.every(function (l) { return l.estado === 'feita'; });
    licoes.concat([{ bau: true, estado: feitoModulo ? 'feita' : 'bau', nome: opcoes.premio || 'Certificado do módulo', link: opcoes.linkPremio }]).forEach(function (l, i) {
      var p = pos(i);
      var desenho = ilha(tema, l.bau ? 'feita' : l.estado, i, l.bau);
      var corpo = Pixel.retangulos(desenho, Object.assign({}, l.estado === 'bloqueada' && !l.bau ? Object.assign({}, tema, PEDRA) : tema, BAU), { contorno: true, x: p.x, y: p.y - 6 }).svg;
      var placa = '';
      var bx = p.x + 12, by = p.y - 12;
      if (l.bau) {
        if (feitoModulo) placa = '<g class="mundo__placa mundo__placa--feita"><circle cx="' + bx + '" cy="' + by + '" r="5"/><path d="M' + (bx - 2.2) + ' ' + by + 'l1.6 1.7 3-3.4"/></g>';
      } else if (l.estado === 'feita') {
        placa = '<g class="mundo__placa mundo__placa--feita"><circle cx="' + bx + '" cy="' + by + '" r="5"/><path d="M' + (bx - 2.2) + ' ' + by + 'l1.6 1.7 3-3.4"/></g>';
      } else {
        placa = '<g class="mundo__placa mundo__placa--' + l.estado + '"><circle cx="' + bx + '" cy="' + by + '" r="5"/><text x="' + bx + '" y="' + (by + .3) + '">' + (i + 1) + '</text></g>';
      }
      var classe = 'mundo__ilha mundo__ilha--' + (l.bau ? 'bau' : l.estado);
      var titulo = '<title>' + (l.bau ? '🏆 ' + l.nome : l.id + ' ' + l.nome + (l.estado === 'bloqueada' ? ' (bloqueada)' : l.estado === 'feita' ? ' (concluída)' : ' (atual)')) + '</title>';
      var grupo = '<g class="' + classe + '">' + titulo + '<g shape-rendering="crispEdges">' + corpo + '</g>' + placa + '</g>';
      svg += l.link && l.estado !== 'bloqueada' ? '<a href="' + l.link + '" aria-label="' + (l.bau ? l.nome : 'Lição ' + l.id + ' ' + l.nome) + '">' + grupo + '</a>' : grupo;
    });

    return '<div class="mundo mundo--' + tema.id + '">' +
      (opcoes.titulo === false ? '' : '<p class="mundo__nome">Mundo ' + modulo.id + ' · ' + tema.nome + '</p>') +
      '<div class="mundo__rolagem"><svg class="mundo__svg" viewBox="0 0 ' + L + ' ' + A + '" style="width:' + total * 116 + 'px" role="img" aria-label="Mapa do mundo ' + modulo.id + '">' + svg + '</svg></div></div>';
  }

  window.Mundos = { mapa: mapa, TEMAS: TEMAS };
})();
