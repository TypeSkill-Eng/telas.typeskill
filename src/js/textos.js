// =========================================================
// TypeSkill — Textos para praticar (js/textos.js)
// Este arquivo só guarda conteúdo. Para colocar um texto novo,
// é só adicionar uma linha entre aspas na lista certa, com
// vírgula no fim. Ele é carregado ANTES do praticar.js.
// =========================================================

const TEXTOS = {

  // ---------- LETRAS: o jogo sorteia grupos com estas letras ----------
  letras: {
    facil: 'asdfgjklç',                      // só a fileira do meio
    medio: 'asdfgjklçqwertyuiop',            // + fileira de cima
    dificil: 'abcdefghijklmnopqrstuvwxyzç'   // todas
  },

  // ---------- PALAVRAS: o jogo sorteia 12 de cada vez ----------
  palavras: {
    facil: [
      'casa', 'sala', 'fada', 'lado', 'gato', 'bola', 'mesa', 'vida', 'dado', 'mapa',
      'sol', 'mar', 'pato', 'faca', 'lata', 'sapo', 'jogo', 'time', 'festa', 'livro',
      'porta', 'dedo', 'tela', 'rua', 'fila', 'gelo', 'lima', 'nota', 'rato', 'copo',
      'prato', 'fogo', 'pedra', 'nuvem', 'ponte', 'barco', 'praia', 'vento', 'chuva', 'peixe',
      'folha', 'campo', 'sino', 'bolo', 'suco', 'leite', 'cama', 'roda', 'trem', 'flor',
      'janela', 'sapato', 'escola', 'amigo', 'tempo', 'mundo', 'verde', 'azul', 'doce', 'feliz'
    ],
    medio: [
      'ação', 'café', 'você', 'avião', 'mãe', 'pão', 'coração', 'lição', 'nível', 'rápido',
      'prática', 'música', 'técnica', 'também', 'até', 'já', 'está', 'atenção', 'conquista', 'esforço',
      'missão', 'precisão', 'teclado', 'dedicação', 'última', 'próximo', 'vovó', 'ônibus', 'árvore', 'médico',
      'número', 'fácil', 'difícil', 'açúcar', 'maçã', 'cabeça', 'criança', 'botão', 'irmão', 'questão',
      'opinião', 'tênis', 'pássaro', 'lâmpada', 'relógio', 'história', 'família', 'ciência', 'saúde', 'água',
      'três', 'mês', 'alguém', 'parabéns', 'atrás', 'pé', 'avô', 'público', 'útil', 'possível'
    ],
    dificil: [
      'Programação', 'Desenvolvimento', 'Responsabilidade', 'Paralelepípedo', 'Exceção', 'JavaScript',
      'HTML5', 'CSS3', 'ponto-e-vírgula', 'Configuração;', 'Belém!', 'Pará?', 'R$25,90', '100%',
      '(teste)', 'e-mail:', 'Canaã', 'Ouro-Preto.', 'arroz-doce', 'Paraíba,', 'açaí', '@usuario',
      '#TypeSkill', '3,14', '2026/11', '"aspas"', '[lista]', '{chave}', 'x+y=z', 'Oxítona',
      'Proparoxítona', 'Otorrinolaringologista', 'Inconstitucionalidade', 'n.º 42', 'Ctrl+C', 'A&B',
      'senha_forte', 'Rio-Grande', 'Itaúna?', 'Ômega', 'Ânimo!', 'Ícone', 'Ótimo!', 'Úmido', 'Ágil'
    ]
  },

  // ---------- FRASES: o jogo sorteia uma por vez ----------
  frases: {
    facil: [
      'O sol nasce todo dia para quem treina.',
      'A casa da vila tem uma porta azul.',
      'Leia com calma e digite sem pressa.',
      'Cada dia de treino deixa a mão mais leve.',
      'O gato dorme na sala depois do almoço.',
      'Meu time joga no domingo de tarde.',
      'A lua cheia brilha sobre o mar.',
      'O livro novo tem capa vermelha.',
      'Vamos tomar suco de manga na feira.',
      'A bola rolou pela rua inteira.',
      'O vento forte balança as folhas.',
      'Minha mesa fica perto da janela.',
      'O trem passa pela ponte toda manhã.',
      'Dedos firmes e olhos na tela.',
      'A fila do lanche andou bem depressa hoje.',
      'O barco azul saiu cedo para pescar.'
    ],
    medio: [
      'A prática constante transforma esforço em habilidade e dedicação em conquista.',
      'Quem digita sem olhar para o teclado ganha tempo e confiança.',
      'Cada erro é uma lição: corrija a postura e siga em frente.',
      'Devagar e sempre se chega longe, inclusive no teclado.',
      'A velocidade vem depois da precisão, nunca antes.',
      'O segredo não é correr, é manter o ritmo sem tropeçar.',
      'Respire fundo, relaxe os ombros e deixe os dedos trabalharem.',
      'Um bom hábito começa pequeno e cresce todos os dias.',
      'A curiosidade é o combustível de quem gosta de aprender.',
      'Na dúvida, volte para a fileira do meio e recomece com calma.',
      'Ler bastante ajuda a escrever melhor, e escrever bastante ajuda a digitar melhor.',
      'A Amazônia abriga uma das maiores biodiversidades do planeta.',
      'O açaí, a castanha e o cupuaçu são sabores típicos do Norte do Brasil.',
      'Pequenas vitórias diárias constroem grandes resultados.',
      'Quem ensina aprende duas vezes.',
      'Não espere a motivação chegar: comece, e ela vem no caminho.'
    ],
    dificil: [
      'Meta da turma para 2026: 60 PPM com 95% de precisão!',
      'Use Ctrl+S para salvar; depois, abra o arquivo index.html no navegador.',
      '"Será que dá?", perguntou João. "Dá, sim!", respondeu Ana.',
      'O pedido n.º 4.512 chegou às 14h30, com 3 itens (R$ 89,90).',
      'const nivel = Math.floor(xp / 250) + 1; // calcula o nível',
      'E-mail: contato@typeskill.com.br | Senha: mínimo de 8 caracteres.',
      'A conta deu R$ 1.234,56 + 10% de serviço = R$ 1.358,02.',
      'Endereço: Rua das Flores, n.º 250 - Apto. 31 - CEP 68537-000.',
      'if (combo >= 50) { premio = "Em Chamas"; xp += 50; }',
      'Atenção: a reunião foi remarcada para 15/12, às 9h (sala 2B).',
      'Placar do jogo da escola: Turma A 3 x 1 Turma B (gols aos 12, 47 e 88 minutos).',
      'Lista de compras: 2 kg de arroz, 1/2 dúzia de ovos & 3 caixas de leite.'
    ]
  },

  // ---------- TEXTOS: parágrafos inteiros ----------
  texto: {
    facil: [
      'Toda grande jornada começa com um primeiro passo. No teclado, esse passo é colocar os dedos na posição certa e confiar neles. Com o tempo, as mãos aprendem o caminho sozinhas e a cabeça fica livre para pensar no texto.',
      'O jogo de hoje é simples: digitar sem olhar para baixo. Se errar, respire, volte a mão para a fileira do meio e continue. Ninguém nasce sabendo, e todo campeão já foi iniciante um dia.',
      'Na feira de sábado tem fruta, verdura e pastel quentinho. O vendedor grita o preço, a criança pede um caldo de cana e todo mundo sai com a sacola cheia. É assim que a cidade acorda no fim de semana.',
      'O mar estava calmo naquela manhã. Os barcos saíram cedo, as gaivotas voavam baixo e a areia ainda estava fria. Um menino corria na beira da água tentando pegar as ondas com as mãos.',
      'Para digitar bem, sente com a coluna reta, apoie os pés no chão e deixe os braços soltos. Os dedos ficam curvados sobre a fileira do meio, como se segurassem uma bola pequena.',
      'Meu caderno de estudos tem uma página para cada dia. Nela eu anoto o que aprendi, o que errei e o que quero tentar amanhã. Com o tempo, as páginas mostram o quanto eu cresci.'
    ],
    medio: [
      'Digitar bem é uma habilidade que se constrói aos poucos. No começo, a precisão importa mais do que a velocidade: cada tecla certa ensina o dedo a encontrar o caminho. Depois de algumas semanas de prática, a rapidez aparece quase sem esforço.',
      'Na escola, no trabalho ou em casa, o computador faz parte da rotina. Quem domina o teclado economiza tempo, comete menos erros e consegue se concentrar no que realmente importa: as ideias que está escrevendo.',
      'A floresta amazônica funciona como um enorme regulador do clima. Suas árvores devolvem umidade para o ar e formam os chamados rios voadores, que levam chuva para outras regiões do país. Proteger a floresta é cuidar da água de todos.',
      'Aprender uma habilidade nova é parecido com abrir uma trilha no mato. No começo, cada passo exige esforço e atenção. Depois de passar muitas vezes pelo mesmo caminho, a trilha fica marcada e o percurso parece natural. Com o teclado acontece a mesma coisa.',
      'Programar é dar instruções muito claras para uma máquina. O computador não adivinha o que queremos: ele segue exatamente o que está escrito. Por isso, uma vírgula esquecida ou uma letra trocada podem mudar todo o resultado.',
      'O descanso também faz parte do treino. Durante o sono, o cérebro organiza o que foi aprendido no dia e fortalece as conexões mais usadas. Treinar um pouco todos os dias costuma render mais do que uma maratona de uma vez só.'
    ],
    dificil: [
      'Faça as contas: quem digita 40 PPM e passa para 55 PPM ganha 15 palavras por minuto. Em um relatório de 3.000 palavras, isso economiza cerca de 20 minutos (75 min contra 54,5 min). Agora multiplique por 5 relatórios na semana!',
      'No terminal, digite "npm install" e aguarde; em seguida, rode "npm start". Se aparecer o erro EACCES, confira as permissões da pasta (chmod 755) e tente de novo. Dica: Ctrl+C interrompe o processo.',
      'Checklist de segunda-feira: (1) responder os e-mails até 9h30; (2) enviar o relatório #47 para a equipe; (3) revisar as metas do 4.º trimestre; (4) agendar a reunião de 15/11 - sala B-12, 2.º andar.',
      'function somar(a, b) { return a + b; } const total = somar(25, 17); console.log("Total: " + total); // mostra 42 no console',
      '"Ordem e Progresso" está escrito na bandeira do Brasil, que tem 27 estrelas: uma para cada estado e uma para o Distrito Federal. O lema foi inspirado no positivismo do filósofo francês Auguste Comte.'
    ]
  }
};

// ---------- DICAS: aparece uma diferente a cada texto ----------
const DICAS = [
  'Mantenha os dedos na posição inicial (ASDF JKLÇ) e evite olhar para o teclado.',
  'Os risquinhos do F e do J ajudam a achar a posição sem olhar para baixo.',
  'Precisão primeiro: a velocidade vem com o tempo.',
  'Use o Shift do lado oposto ao da letra maiúscula.',
  'No ABNT2, aperte o acento primeiro e depois a letra.',
  'Polegares no espaço e cada dedo sempre na sua coluna de teclas.',
  'Faça pausas curtas para descansar as mãos e os olhos.',
  'Mantenha os pulsos levemente elevados, sem apoiar no teclado.',
  'Errou? Corrija com o Backspace e retome o ritmo sem pressa.',
  'O dedo mínimo direito cuida do Ç, do acento e do Enter.',
  'Combos longos valem prêmios: foque em não errar, não em correr.'
];
