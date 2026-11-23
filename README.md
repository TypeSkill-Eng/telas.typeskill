# TypeSkill ⌨️

> Aprenda a digitar jogando. Complete missões, ganhe XP, faça combos e suba de nível.

Site de treino de digitação gamificado, feito com **HTML, CSS e JavaScript puro** (ainda sem banco de dados).

**Site no ar:** _cole aqui o link da Vercel_

---

## Estrutura de pastas

```
typeskill/
├── index.html                ← landing page (fica na raiz: é a primeira página do site)
│
├── templates/                ← todas as outras telas
│   ├── login.html
│   ├── cadastro.html
│   ├── recuperar-senha.html  ← etapa 1: digitar o e-mail
│   ├── codigo.html           ← etapa 2: código de 4 números
│   ├── nova-senha.html       ← etapa 3: criar a nova senha
│   ├── inicio.html           ← tela inicial depois do login
│   ├── missoes.html          ← escada de lições (Letras → Palavras → Frases → Textos)
│   ├── praticar.html         ← treino com teclado e mãos animadas
│   ├── conquistas.html       ← medalhas e prêmios de combo
│   ├── progresso.html        ← gráficos, calendário, teclas que mais erra, histórico
│   ├── certificados.html     ← certificado de cada módulo (imprimir / PDF)
│   ├── perfil.html           ← avatar, nome, bio e trocar senha
│   └── configuracoes.html    ← preferências da prática, meta diária e dados
│
├── src/                      ← código
│   ├── css/
│   │   ├── global.css        ← cores, fontes, botões, landing e modo noturno
│   │   ├── auth.css          ← visual de login, cadastro, recuperar senha e código
│   │   ├── codigo.css        ← só os 4 campos do código
│   │   ├── app.css           ← MENU LATERAL igual em todas as telas + avatar, medalhas e avisos
│   │   ├── telas.css         ← Conquistas, Progresso, Certificados, Perfil e Configurações
│   │   ├── noturno.css       ← MODO NOTURNO de todas as telas (carregado por último)
│   │   ├── inicio.css
│   │   ├── missoes.css
│   │   └── praticar.css
│   └── js/
│       ├── tema.js           ← liga/desliga o modo noturno (vale para o site todo)
│       ├── contas.js         ← contas, login, senha (hash) e perfil
│       ├── auth.js           ← telas de cadastro, login, recuperar e nova senha
│       ├── app.js            ← menu, avatar, XP, nível, meta diária e avisos de conquista
│       ├── pixel.js          ← desenhista de pixel art (texto → SVG)
│       ├── personagens.js    ← avatares em pixel art (cabelo, pele, roupa, fundo)
│       ├── mundos.js         ← mapa de ilhas flutuantes de cada módulo
│       ├── medalhas.js       ← lista de conquistas (23), medalhas em pixel art e avisos
│       ├── conquistas.js     ← tela Conquistas
│       ├── estatisticas.js   ← tela Progresso (gráficos em SVG)
│       ├── certificados.js   ← tela Certificados
│       ├── perfil.js         ← tela Perfil
│       ├── configuracoes.js  ← tela Configurações
│       ├── progresso.js      ← XP, nível, sequência, desafio diário (por conta)
│       ├── inicio.js         ← liga a tela de Início aos dados reais
│       ├── curso.js          ← a escada de missões (lições, metas e progresso por conta)
│       ├── codigo.js
│       ├── missoes.js
│       ├── textos.js         ← frases e textos da prática
│       └── praticar.js
│
├── public/
│   └── img/                  ← logo.png, teclado.png e avatar.png (personagem original)
│
├── vercel.json
├── README.md
└── .gitignore
```

### Regra dos caminhos

| De onde | Para chegar em | Escreva |
|---|---|---|
| `index.html` (raiz) | uma tela | `templates/login.html` |
| `index.html` (raiz) | CSS / imagem | `src/css/global.css` · `public/img/logo.png` |
| uma tela em `templates/` | outra tela | `missoes.html` (estão na mesma pasta) |
| uma tela em `templates/` | a landing | `../index.html` |
| uma tela em `templates/` | CSS / JS / imagem | `../src/css/...` · `../src/js/...` · `../public/img/...` |

`../` quer dizer "volta uma pasta".

---

## Como as telas se ligam

```
index (landing)
 ├─ Entrar ─────────► login ──► inicio
 │                     ├─ Esqueceu a senha? ─► recuperar-senha ─► codigo ─► login
 │                     └─ Cadastre-se ──────► cadastro ─► inicio
 └─ Começar agora ──► cadastro

Menu lateral (igual em todas as telas de dentro):
inicio · missoes · praticar · conquistas · progresso · certificados · perfil · configuracoes · Sair

inicio
 ├─ Missão atual / Continue de onde parou ─► praticar?missao=1.3
 ├─ Pratique agora ─► praticar (no nível da missão)
 └─ Avatar ─► perfil
missoes ─► praticar?missao=... ─► (fim da sessão) próxima missão
progresso ─► "Treinar essas teclas" ─► praticar?letras=çqp
certificados ─► Ir para as missões / Ver certificado (imprimir)
configuracoes ─► muda como o praticar abre e a meta diária
missoes
 ├─ Rever ────────────► praticar (Palavras · Fácil)
 └─ Continuar ────────► praticar (Frases · Médio)
```

A prática abre já configurada pelo endereço, por exemplo `praticar.html?tipo=frases&dificuldade=medio`.
O que a prática salva (XP, nível, sequência, minutos do dia) aparece também no Início e em Missões.

---

## Como abrir no computador

Abra a pasta no VS Code, clique com o botão direito no `index.html` e escolha **Open with Live Server**.

## Como publicar na Vercel

Em vercel.com: *Add New → Project* → escolha este repositório → *Deploy*.
O `vercel.json` avisa a Vercel que o site está na raiz (sem ele, ela poderia publicar só a pasta `public`).

> Na internet, maiúsculas e minúsculas fazem diferença: `Logo.png` e `logo.png` são arquivos diferentes.

---

## Onde mexer

| Quero mudar... | Arquivo |
|---|---|
| Cores e modo noturno | `src/css/global.css` |
| Menu lateral (tamanho, cores, itens) | `src/css/app.css` e o bloco `<aside class="sidebar">` de cada tela |
| Frases da prática | `src/js/textos.js` |
| Prêmios, XP, nível, meta diária | `src/js/praticar.js` (bloco 1) |

## Próximos passos

- [ ] Banco de dados e login de verdade
- [ ] Telas de Conquistas, Progresso, Certificados, Perfil e Configurações

## Equipe

| Nome | Função |
|---|---|
| _Seu nome_ | _ex.: front-end_ |


## Contas e login (sem servidor)

As contas ficam guardadas no navegador (`localStorage`), pelo arquivo **`src/js/contas.js`**.
A senha não é salva em texto: vai embaralhada (hash SHA-256 + sal).

| Arquivo | O que faz |
|---|---|
| `src/js/contas.js` | "Banco de dados": criar conta, entrar, sair, trocar senha, regras de validação e contas de teste (`CONTAS_INICIAIS`) |
| `src/js/auth.js` | Telas de cadastro, login, recuperar senha e nova senha (mensagens de erro, checklist da senha, olho de mostrar senha) |

- **Conta de teste:** `teste@typeskill.com` (ou usuário `player01`), senha `teste123`.
- **Regras:** usuário com 3 a 20 caracteres (letras, números, `.` ou `_`); e-mail válido e que ainda não exista; senha com 8 ou mais caracteres, pelo menos uma letra e um número, sem espaços.
- **Login:** aceita e-mail **ou** nome de usuário.
- **Recuperar senha:** recuperar-senha → codigo (código de 4 números, mostrado na tela em modo de teste, vale 10 min e 5 tentativas) → nova-senha → login.
- **Telas protegidas:** `inicio`, `missoes` e `praticar` mandam para o login quem não entrou. "Sair" encerra a sessão.
- **Ver as contas salvas:** no navegador, F12 → Console → `Contas.listar()`.
- **Apagar todas as contas:** no Console, `localStorage.removeItem('typeskill-contas')`.

> ⚠️ Como fica tudo no navegador, cada computador/navegador tem as suas próprias contas.
> Para contas de verdade (que funcionam em qualquer lugar), é preciso um servidor/banco de dados, como Firebase ou Supabase.


## Missões (escada do curso)

O curso fica em **`src/js/curso.js`** e a tela é montada pelo `src/js/missoes.js`.

- **Ordem:** 1. Letras (7 lições) → 2. Palavras (4) → 3. Frases (3) → 4. Textos (4) = 18 lições.
- **Começa do zero em cada conta:** o progresso fica em `typeskill-missoes:<e-mail da conta>`.
- **Desbloqueio:** cada lição só abre quando a anterior foi concluída. O módulo seguinte só abre quando o anterior termina.
- **Para concluir:** numa mesma sessão é preciso bater as **duas** metas da lição (PPM e precisão).
- **Como abre:** o botão da lição leva para `praticar.html?missao=1.2`. O Praticar usa as letras, a dificuldade e o tempo daquela lição. No fim da sessão mostra se passou e oferece a próxima.
- **Mudar o curso:** edite a lista `CURSO` no `curso.js` (nome, objetivo, letras, metas, minutos).
- Se a pessoa mexer nas opções do Praticar durante uma missão, vira treino livre.


## Progresso e tela de Início

- **`src/js/progresso.js`** guarda as sessões de digitação de cada conta (`typeskill-progresso:<e-mail>`): XP, nível, sequência de dias, recordes e desafio diário. Conta nova começa do zero.
- **`src/js/inicio.js`** preenche o Início:
  - **Mundo:** o módulo atual das missões e quanto dele já foi feito.
  - **Missão atual:** a próxima lição da escada, com a meta e o progresso.
  - **Pratique agora:** treino livre no nível da missão. Se a última precisão ficou abaixo de 90%, recomenda o fácil.
  - **Desafio diário:** fazer um PPM um pouco acima do seu recorde até ontem. Vale +200 XP uma vez por dia.
  - **Seu progresso:** nível, precisão média das 5 últimas sessões (com a diferença para as 5 anteriores) e recorde de PPM.
  - **Conquistas:** as 2 mais avançadas já ganhas, ou as próximas a ganhar.
  - **Continue de onde parou:** leva direto para a lição atual.


## Telas do menu lateral

| Tela | O que tem |
|---|---|
| **Conquistas** | 23 medalhas (bronze, prata, ouro, diamante) em 6 categorias, com barra do quanto falta, filtro (todas / ganhas / bloqueadas) e prêmios de combo. Quando ganha uma, aparece um aviso no canto da tela. |
| **Progresso** | Sessões, tempo, recorde, precisão, sequência e nível; gráficos de velocidade e precisão (passe o mouse para ver cada sessão); calendário de 12 semanas; velocidade por tipo de treino; teclas que mais erra (com botão para treinar só elas); histórico. |
| **Certificados** | Um por módulo + o do curso completo. Libera quando todas as lições do módulo são concluídas. Abre o certificado com nome, data, melhor PPM e precisão e um código, e imprime ou salva em PDF numa folha deitada. |
| **Perfil** | Avatar (16 personagens × 8 cores, ou foto), nome completo (vai nos certificados), bio, objetivo e trocar senha (pede a senha atual). |
| **Configurações** | Tipo, dificuldade e duração com que o Praticar abre, mãos virtuais, som, meta diária (10 a 60 min), reduzir animações, baixar meus dados (.json), zerar progresso e excluir conta (as duas pedem para digitar uma palavra de confirmação). |

Tudo é separado por conta: uma conta nova começa do zero em todas as telas.


## Pixel art: mundos, personagens e medalhas

Tudo é desenhado pelo código (não precisa de imagem), com o **`src/js/pixel.js`**: cada desenho é um "texto" em que cada letra é uma cor.

- **Mundos (`mundos.js`)**: cada módulo é um mundo de ilhas flutuantes, uma por lição, com um baú no final (que leva aos Certificados).
  - Mundo 1 Floresta · Mundo 2 Deserto · Mundo 3 Neve · Mundo 4 Vulcão.
  - Ilha com ✓ = concluída; número laranja (flutuando) = atual; ilha de pedra cinza = bloqueada.
  - Aparece no Início (mundo atual) e dentro de cada módulo das Missões. Clicar numa ilha aberta abre a lição.
- **Personagens (`personagens.js`)**: 8 prontos + o personagem original (`public/img/avatar.png`), ou monte o seu no Perfil: 6 cabelos, 7 cores de cabelo, 5 tons de pele, 8 cores de roupa e 8 fundos. Também dá para usar uma foto.
- **Medalhas (`medalhas.js`)**: fita com a cor da categoria, moeda com a cor do nível (bronze, prata, ouro, diamante) e o ícone da categoria (bandeira, raio, alvo, fogo, calendário, espada).


## Tela de digitação (estilo AgileFingers)

- Fundo de papel quadriculado creme e cartão branco bem arredondado.
- No topo do cartão: precisão, "30 de 255" com barra de progresso, reiniciar e pausar.
- Só a **linha atual** fica grande (letra monoespaçada Roboto Mono): o que já foi digitado fica cinza, o resto preto e um cursor amarelo pisca antes da próxima letra. As 2 linhas seguintes aparecem pequenas e clarinhas. As quebras de linha se ajustam à largura da tela.
- Errou e corrigiu: ✓ verde pequenininho em cima da letra. Apagou o erro: a letra fica sublinhada de vermelho até você acertar.
- Teclado: placa cinza-clara com cantos grandes e "sombra" bege embaixo e à esquerda; teclas brancas de contorno fino; a tecla da vez fica amarelo-laranja.
- Mãos grandes, de dedos longos, viradas para dentro; a mão inteira desliza até cada tecla e o dedo encaixa nela.

## Modo noturno

- Um só tema para o site inteiro, salvo no navegador (`typeskill-tema`).
- Liga pela lua da landing, pelo botão **Modo noturno** do menu lateral ou em **Configurações → Aparência**.
- O `tema.js` fica no `<head>` de todas as páginas para a tela já abrir escura (sem piscar branco).
- As cores escuras ficam todas no `src/css/noturno.css`. O certificado continua claro (é para imprimir).
