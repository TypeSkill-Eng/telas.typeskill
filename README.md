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
│   ├── missoes.html
│   └── praticar.html
│
├── src/                      ← código
│   ├── css/
│   │   ├── global.css        ← cores, fontes, botões, landing e modo noturno
│   │   ├── auth.css          ← visual de login, cadastro, recuperar senha e código
│   │   ├── codigo.css        ← só os 4 campos do código
│   │   ├── app.css           ← MENU LATERAL igual para Início, Missões e Praticar
│   │   ├── inicio.css
│   │   ├── missoes.css
│   │   └── praticar.css
│   └── js/
│       ├── app.js            ← liga os dados salvos (XP, nível, sequência, meta) às telas
│       ├── progresso.js      ← XP, nível, sequência, desafio diário (por conta)
│       ├── inicio.js         ← liga a tela de Início aos dados reais
│       ├── curso.js          ← a escada de missões (lições, metas e progresso por conta)
│       ├── codigo.js
│       ├── missoes.js
│       ├── textos.js         ← frases e textos da prática
│       └── praticar.js
│
├── public/
│   └── img/                  ← logo e imagens (logo.png, avatar.png, mapa.png...)
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

inicio ◄──► missoes ◄──► praticar   (pelo menu lateral)
 ├─ Continuar missão ─► missoes
 ├─ Começar lição ────► praticar (Palavras · Médio)
 └─ Continuar ────────► praticar (Frases · Difícil)
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
