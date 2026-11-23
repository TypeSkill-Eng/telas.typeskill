// =========================================================
// TypeSkill — pixel.js (desenhista de pixel art)
//
// Transforma um "desenho em texto" em SVG. Cada letra é uma cor:
//   Pixel.svg(['..AA..', '.AAAA.'], { A: '#ff6a00' })
// Um "." é transparente. Se contorno estiver ligado, todo pixel
// vazio encostado num pixel pintado vira contorno escuro, como
// nos jogos antigos. Pixels vizinhos da mesma cor viram um
// retângulo só (o SVG fica leve).
// Usado por personagens.js, medalhas.js e mundos.js.
// =========================================================
(function () {
  var CONTORNO = '#1d1b26';

  // escurece (fator < 1) ou clareia (fator > 1) uma cor #rrggbb
  function tom(hex, fator) {
    var n = parseInt(hex.slice(1), 16);
    var c = [n >> 16, (n >> 8) & 255, n & 255].map(function (v) {
      v = fator < 1 ? v * fator : v + (255 - v) * (fator - 1);
      return Math.max(0, Math.min(255, Math.round(v)));
    });
    return '#' + c.map(function (v) { return v.toString(16).padStart(2, '0'); }).join('');
  }

  // junta camadas: as de cima substituem as de baixo (o "." não substitui)
  function juntar() {
    var base = arguments[0].slice();
    for (var i = 1; i < arguments.length; i++) {
      var camada = arguments[i] || [];
      camada.forEach(function (linha, y) {
        if (y >= base.length) return;
        var nova = base[y].split('');
        for (var x = 0; x < linha.length; x++) if (linha[x] !== '.') nova[x] = linha[x] === '_' ? '.' : linha[x];
        base[y] = nova.join('');
      });
    }
    return base;
  }

  // devolve os retângulos (sem a tag <svg>), para montar desenhos maiores
  function retangulos(linhas, cores, opcoes) {
    opcoes = opcoes || {};
    var alt = linhas.length, larg = Math.max.apply(null, linhas.map(function (l) { return l.length; }));
    var grade = linhas.map(function (l) { return (l + '.'.repeat(larg)).slice(0, larg).split(''); });
    if (opcoes.contorno) {
      var cheio = function (x, y) { return y >= 0 && y < alt && x >= 0 && x < larg && grade[y][x] !== '.' && grade[y][x] !== '#'; };
      grade = grade.map(function (linha, y) {
        return linha.map(function (c, x) {
          if (c !== '.') return c;
          return (cheio(x - 1, y) || cheio(x + 1, y) || cheio(x, y - 1) || cheio(x, y + 1)) ? '#' : '.';
        });
      });
    }
    var dx = opcoes.x || 0, dy = opcoes.y || 0, saida = '';
    grade.forEach(function (linha, y) {
      var x = 0;
      while (x < larg) {
        var c = linha[x];
        if (c === '.') { x++; continue; }
        var ini = x;
        while (x < larg && linha[x] === c) x++;
        var cor = c === '#' ? (opcoes.corContorno || CONTORNO) : cores[c];
        if (cor) saida += '<rect x="' + (ini + dx) + '" y="' + (y + dy) + '" width="' + (x - ini) + '" height="1" fill="' + cor + '"/>';
      }
    });
    return { svg: saida, largura: larg, altura: alt };
  }

  function svg(linhas, cores, opcoes) {
    opcoes = opcoes || {};
    var r = retangulos(linhas, cores, opcoes);
    return '<svg class="pixel ' + (opcoes.classe || '') + '" viewBox="0 0 ' + r.largura + ' ' + r.altura + '" shape-rendering="crispEdges" aria-hidden="true">' + r.svg + '</svg>';
  }

  window.Pixel = { svg: svg, retangulos: retangulos, juntar: juntar, tom: tom, CONTORNO: CONTORNO };
})();
