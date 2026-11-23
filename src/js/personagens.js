// =========================================================
// TypeSkill — personagens.js (avatares em pixel art)
//
// Cada personagem é montado em camadas de 16×16 pixels:
// corpo (pele + roupa) + cabelo. Letras do desenho:
//   S pele   s pele na sombra   E olho   M boca
//   C roupa  c roupa na sombra  w cordão do moletom
//   H cabelo h cabelo na sombra
// O avatar fica guardado no perfil assim:
//   { pixel: { cabelo, corCabelo, pele, roupa, fundo } }  ou  { foto: '...' }
// Precisa do pixel.js antes.
// =========================================================
(function () {
  var CORPO = [
    '................',
    '................',
    '................',
    '....SSSSSSSS....',
    '...SSSSSSSSSS...',
    '...SSSSSSSSSS...',
    '...SSESSSSESS...',
    '...SSESSSSESS...',
    '..sSSSSSSSSSSs..',
    '...SSSSSSSSSS...',
    '....SSSMMSSS....',
    '.....ssssss.....',
    '...CCCcSScCCC...',
    '..CCCCwCCwCCCC..',
    '.CCCCCwCCwCCCCC.',
    '.CcCCCCCCCCCCcC.'
  ];
  var CABELOS = {
    espetado: [
      '...H...H...H....',
      '...HH.HHH.HHH...',
      '..HHHHHHHHHHHH..',
      '..HHHHHHHHHHHH..',
      '..HHHhHHHHhHHHH.',
      '..HHh.hHHh.hHH..',
      '..HH........HH..',
      '..H..........H..'
    ],
    curto: [
      '................',
      '................',
      '....HHHHHHHH....',
      '...HHHHHHHHHH...',
      '...HHHHHHHHHH...',
      '...HHhhHHhhHH...',
      '...H........H...'
    ],
    comprido: [
      '................',
      '................',
      '....HHHHHHHH....',
      '...HHHHHHHHHH...',
      '..HHHHHHHHHHHH..',
      '..HHhhHHHHhhHH..',
      '..HH........HH..',
      '..HH........HH..',
      '..HH........HH..',
      '..HH........HH..',
      '..HHH......HHH..',
      '...HH......HH...',
      '...hh...........'
    ],
    cacheado: [
      '...HH.HHHH.HH...',
      '..HHHHHHHHHHHH..',
      '.HHHHHHHHHHHHHH.',
      '.HHHHHHHHHHHHHH.',
      '.HHHhHHhHHhHHHH.',
      '.HHh........hHH.',
      '.HH..........HH.',
      '.HH..........HH.',
      '..H..........H..'
    ],
    bone: [
      '................',
      '.....KKKKKK.....',
      '...KKKKKKKKKK...',
      '...KKKKKKKKKK...',
      '..kkkkkkkkkkkkk.',
      '...HH......HH...',
      '...H........H...'
    ],
    coque: [
      '......HHHH......',
      '.....HHHHHH.....',
      '....HHhhhhHH....',
      '...HHHHHHHHHH...',
      '...HHHHHHHHHH...',
      '...HHh....hHH...',
      '...H........H...'
    ]
  };
  var NOMES_CABELO = { espetado: 'Espetado', curto: 'Curto', comprido: 'Comprido', cacheado: 'Cacheado', bone: 'Boné', coque: 'Coque' };
  var PELES = ['#ffd9b8', '#f1c27d', '#d9a066', '#a86b3c', '#6b4226'];
  var CORES_CABELO = ['#6b4423', '#2b2833', '#e8c15a', '#c4521c', '#dcdce4', '#ff5a8a', '#3b82f6'];
  var ROUPAS = ['#2b2833', '#ff6a00', '#3b82f6', '#22b07d', '#7c5cf0', '#e5484d', '#f2f2f5', '#ffb020'];
  var FUNDOS = ['#ff6a00', '#ffb020', '#22b07d', '#2ccfc2', '#3b82f6', '#7c5cf0', '#e5484d', '#5d5d6b'];

  // personagem padrão (parecido com o avatar original do TypeSkill)
  var PADRAO = { cabelo: 'espetado', corCabelo: 0, pele: 0, roupa: 0, fundo: 0 };

  // personagens prontos para escolher com um clique
  var PRONTOS = [
    PADRAO,
    { cabelo: 'comprido', corCabelo: 1, pele: 1, roupa: 4, fundo: 3 },
    { cabelo: 'cacheado', corCabelo: 1, pele: 4, roupa: 2, fundo: 1 },
    { cabelo: 'bone', corCabelo: 3, pele: 0, roupa: 5, fundo: 4 },
    { cabelo: 'coque', corCabelo: 2, pele: 2, roupa: 3, fundo: 6 },
    { cabelo: 'curto', corCabelo: 1, pele: 3, roupa: 7, fundo: 5 },
    { cabelo: 'espetado', corCabelo: 6, pele: 1, roupa: 6, fundo: 7 },
    { cabelo: 'comprido', corCabelo: 5, pele: 0, roupa: 0, fundo: 2 }
  ];

  function normalizar(cfg) {
    cfg = Object.assign({}, PADRAO, cfg || {});
    if (!CABELOS[cfg.cabelo]) cfg.cabelo = PADRAO.cabelo;
    return cfg;
  }

  // SVG do personagem (sem o fundo: o fundo é a cor da moldura)
  function svg(cfg) {
    cfg = normalizar(cfg);
    var pele = PELES[cfg.pele] || PELES[0];
    var cabelo = CORES_CABELO[cfg.corCabelo] || CORES_CABELO[0];
    var roupa = ROUPAS[cfg.roupa] || ROUPAS[0];
    var cores = {
      S: pele, s: Pixel.tom(pele, .82), E: '#1d1b26', M: Pixel.tom(pele, .78),
      C: roupa, c: Pixel.tom(roupa, .75), w: roupa === '#f2f2f5' ? '#9a9ba6' : '#f2f2f5',
      H: cabelo, h: Pixel.tom(cabelo, .72),
      K: roupa === '#2b2833' ? '#e5484d' : roupa, k: Pixel.tom(roupa === '#2b2833' ? '#e5484d' : roupa, .7)
    };
    return Pixel.svg(Pixel.juntar(CORPO, CABELOS[cfg.cabelo]), cores, { contorno: true, classe: 'personagem' });
  }
  function fundo(cfg) { return FUNDOS[normalizar(cfg).fundo] || FUNDOS[0]; }

  // converte avatares antigos ({ emoji, cor }) para personagem
  function doAvatar(avatar) {
    if (!avatar) return { pixel: PADRAO };
    if (avatar.foto || avatar.pixel) return avatar;
    var i = FUNDOS.indexOf(avatar.cor);
    return { pixel: Object.assign({}, PADRAO, { fundo: i >= 0 ? i : 0 }) };
  }

  window.Personagens = {
    svg: svg, fundo: fundo, doAvatar: doAvatar, normalizar: normalizar,
    PADRAO: PADRAO, PRONTOS: PRONTOS, NOMES_CABELO: NOMES_CABELO,
    PELES: PELES, CORES_CABELO: CORES_CABELO, ROUPAS: ROUPAS, FUNDOS: FUNDOS
  };
})();
