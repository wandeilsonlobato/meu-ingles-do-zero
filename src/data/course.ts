import type { Exercise, Level, Lesson } from '../types'

let idCounter = 0
function eid(lessonId: string): string {
  idCounter += 1
  return `${lessonId}-e${idCounter}`
}

function mc(
  lessonId: string,
  prompt: string,
  options: { id: string; label: string; imageEmoji?: string }[],
  correctOptionId: string,
  explanation: string,
  imageEmoji?: string,
): Exercise {
  return {
    id: eid(lessonId),
    lessonId,
    type: 'multiple_choice',
    prompt,
    options,
    correctOptionId,
    explanation,
    imageEmoji,
  }
}

function fillBlank(
  lessonId: string,
  prompt: string,
  correctText: string,
  explanation: string,
  acceptableAnswers: string[] = [],
): Exercise {
  return {
    id: eid(lessonId),
    lessonId,
    type: 'fill_blank',
    prompt,
    correctText,
    acceptableAnswers: [correctText, ...acceptableAnswers],
    explanation,
  }
}

function order(lessonId: string, prompt: string, words: string[], correctOrder: string[], explanation: string): Exercise {
  return { id: eid(lessonId), lessonId, type: 'sentence_order', prompt, words, correctOrder, explanation }
}

function match(
  lessonId: string,
  prompt: string,
  pairs: { id: string; left: string; right: string }[],
  explanation: string,
): Exercise {
  return { id: eid(lessonId), lessonId, type: 'match_pairs', prompt, pairs, explanation }
}

function listening(
  lessonId: string,
  audioText: string,
  options: { id: string; label: string }[],
  correctOptionId: string,
  explanation: string,
): Exercise {
  return {
    id: eid(lessonId),
    lessonId,
    type: 'listening',
    prompt: 'Ouça e escolha o que você ouviu.',
    audioText,
    options,
    correctOptionId,
    explanation,
  }
}

function speaking(lessonId: string, audioText: string, explanation: string): Exercise {
  return {
    id: eid(lessonId),
    lessonId,
    type: 'speaking',
    prompt: 'Repita a frase em voz alta.',
    audioText,
    correctText: audioText,
    explanation,
  }
}

function translation(
  lessonId: string,
  prompt: string,
  correctText: string,
  explanation: string,
  acceptableAnswers: string[] = [],
): Exercise {
  return {
    id: eid(lessonId),
    lessonId,
    type: 'translation',
    prompt,
    correctText,
    acceptableAnswers: [correctText, ...acceptableAnswers],
    explanation,
  }
}

function trueFalse(lessonId: string, prompt: string, correct: boolean, explanation: string): Exercise {
  return {
    id: eid(lessonId),
    lessonId,
    type: 'true_false',
    prompt,
    options: [
      { id: 'true', label: 'Verdadeiro' },
      { id: 'false', label: 'Falso' },
    ],
    correctOptionId: correct ? 'true' : 'false',
    explanation,
  }
}

function dialogue(
  lessonId: string,
  dialogueLine: string,
  options: { id: string; label: string }[],
  correctOptionId: string,
  explanation: string,
): Exercise {
  return {
    id: eid(lessonId),
    lessonId,
    type: 'dialogue',
    prompt: 'Escolha a resposta certa para continuar a conversa.',
    dialogueLine,
    options,
    correctOptionId,
    explanation,
  }
}

// ---------------------------------------------------------------------------
// NÍVEL 0 — Primeiros Passos
// ---------------------------------------------------------------------------

// UNIT — Instruções da Sala de Aula
const l0u0l1: Lesson = {
  id: 'lvl0-u0-l1',
  unitId: 'lvl0-u0',
  order: 1,
  title: 'Comandos da Sala de Aula',
  type: 'lesson',
  xpReward: 10,
  theory: {
    title: 'Instruções em inglês',
    body: 'Professores usam verbos no imperativo para dar instruções: o verbo vem primeiro, sem sujeito. Vamos aprender os comandos mais comuns em sala de aula.',
    examples: [
      { en: 'Open your book.', pt: 'Abra seu livro.' },
      { en: 'Listen and repeat.', pt: 'Ouça e repita.' },
      { en: 'Raise your hand.', pt: 'Levante a mão.' },
    ],
  },
  exercises: [],
}
l0u0l1.exercises = [
  mc(l0u0l1.id, 'O que significa "Open your book"?', [
    { id: 'a', label: 'Abra seu livro' },
    { id: 'b', label: 'Feche seu livro' },
    { id: 'c', label: 'Levante a mão' },
  ], 'a', '"Open" significa abrir.'),
  match(
    l0u0l1.id,
    'Ligue o verbo à tradução.',
    [
      { id: 'p1', left: 'listen', right: 'ouvir' },
      { id: 'p2', left: 'write', right: 'escrever' },
      { id: 'p3', left: 'read', right: 'ler' },
      { id: 'p4', left: 'ask', right: 'perguntar' },
      { id: 'p5', left: 'answer', right: 'responder' },
      { id: 'p6', left: 'circle', right: 'circular' },
    ],
    'Verbos de instrução usados em sala de aula.',
  ),
  order('lvl0-u0-l1', 'Monte a frase:', ['book', 'your', 'Open'], ['Open', 'your', 'book'], '"Open your book" significa "Abra seu livro".'),
  listening(l0u0l1.id, 'Listen and repeat', [
    { id: 'a', label: 'Listen and repeat' },
    { id: 'b', label: 'Listen and read' },
  ], 'a', '"Listen and repeat" significa "Ouça e repita".'),
]

const l0u0l2: Lesson = {
  id: 'lvl0-u0-l2',
  unitId: 'lvl0-u0',
  order: 2,
  title: 'Pedindo para Repetir',
  type: 'lesson',
  xpReward: 10,
  theory: {
    title: 'Pedindo repetição',
    body: 'Quando você não entende algo, pode pedir para a pessoa repetir ou falar de novo. Essas frases são muito úteis em qualquer conversa.',
    examples: [
      { en: 'Can you repeat that?', pt: 'Você pode repetir isso?' },
      { en: 'Can you say that again?', pt: 'Você pode dizer de novo?' },
    ],
  },
  exercises: [],
}
l0u0l2.exercises = [
  mc(l0u0l2.id, 'Como pedir para alguém repetir o que disse?', [
    { id: 'a', label: 'Can you repeat that?' },
    { id: 'b', label: 'Nice to meet you.' },
  ], 'a', 'Essa é a forma padrão de pedir repetição.'),
  fillBlank(l0u0l2.id, 'Complete: Can you ___ that? (repetir)', 'repeat', '"Repeat" significa repetir.'),
  translation(l0u0l2.id, 'Traduza: "Pode dizer de novo?"', 'Can you say that again', 'Outra forma de pedir para repetir.', ['Can you say that again?']),
  dialogue(l0u0l2.id, 'Open your book to page five.', [
    { id: 'a', label: 'Sorry, can you repeat that?' },
    { id: 'b', label: 'Nice to meet you.' },
  ], 'a', 'Se você não entendeu a instrução, pode pedir para repetir.'),
]

const l0u0checkpoint: Lesson = {
  id: 'lvl0-u0-checkpoint',
  unitId: 'lvl0-u0',
  order: 3,
  title: 'Revisão: Instruções da Sala de Aula',
  type: 'checkpoint',
  xpReward: 15,
  exercises: [
    mc('lvl0-u0-checkpoint', 'O que significa "Close your book"?', [
      { id: 'a', label: 'Feche seu livro' },
      { id: 'b', label: 'Abra seu livro' },
    ], 'a', '"Close" significa fechar.'),
    order('lvl0-u0-checkpoint', 'Monte a frase:', ['hand', 'your', 'Raise'], ['Raise', 'your', 'hand'], '"Raise your hand" significa "Levante a mão".'),
    translation('lvl0-u0-checkpoint', 'Traduza: "Você pode repetir isso?"', 'Can you repeat that', 'Frase usada para pedir repetição.', ['Can you repeat that?']),
    match(
      'lvl0-u0-checkpoint',
      'Ligue o verbo à tradução.',
      [
        { id: 'p1', left: 'write', right: 'escrever' },
        { id: 'p2', left: 'read', right: 'ler' },
      ],
      'Revisão dos verbos de instrução.',
    ),
  ],
}

const unitClassroomInstructions = {
  id: 'lvl0-u0',
  levelId: 'lvl0',
  order: 1,
  title: 'Instruções da Sala de Aula',
  objective: 'Entender e usar comandos básicos de sala de aula',
  lessons: [l0u0l1, l0u0l2, l0u0checkpoint],
}

const l0u1l1: Lesson = {
  id: 'lvl0-u1-l1',
  unitId: 'lvl0-u1',
  order: 1,
  title: 'O Alfabeto',
  type: 'lesson',
  xpReward: 10,
  theory: {
    title: 'O alfabeto em inglês',
    body: 'O inglês usa as mesmas 26 letras do português, mas os nomes das letras soam diferente. Por exemplo, "A" se pronuncia "ei", e "H" se pronuncia "eitch". Vamos praticar os sons mais usados no dia a dia.',
    examples: [
      { en: 'A, B, C, D...', pt: 'ei, bi, ci, di...' },
      { en: 'My name starts with the letter A.', pt: 'Meu nome começa com a letra A.' },
    ],
  },
  exercises: [],
}
l0u1l1.exercises = [
  mc(
    l0u1l1.id,
    'Como se pronuncia a letra "H" em inglês?',
    [
      { id: 'a', label: 'agá' },
      { id: 'b', label: 'eitch' },
      { id: 'c', label: 'ratch' },
    ],
    'b',
    'Em inglês, a letra H se pronuncia "eitch", bem diferente do "agá" do português.',
  ),
  listening(
    l0u1l1.id,
    'A, B, C',
    [
      { id: 'a', label: 'A, B, C' },
      { id: 'b', label: 'A, B, D' },
      { id: 'c', label: 'E, B, C' },
    ],
    'a',
    'Você ouviu as três primeiras letras do alfabeto: A, B, C.',
  ),
  fillBlank(l0u1l1.id, 'Complete: A, B, ___, D, E', 'C', 'A sequência do alfabeto segue A, B, C, D, E.'),
  speaking(l0u1l1.id, 'A B C D E', 'Repita as letras devagar, prestando atenção no som de cada uma.'),
]

const l0u1l2: Lesson = {
  id: 'lvl0-u1-l2',
  unitId: 'lvl0-u1',
  order: 2,
  title: 'Vogais e sons básicos',
  type: 'lesson',
  xpReward: 10,
  theory: {
    title: 'Sons das vogais',
    body: 'As vogais em inglês têm sons mais abertos e variados que em português. O som do "A" em "cat" é diferente do som do "A" em "father". No começo, foque em ouvir e imitar, sem se preocupar em decorar regras.',
    examples: [
      { en: 'cat', pt: 'gato (som de "á" curto)' },
      { en: 'see', pt: 'ver (som de "í" longo)' },
    ],
  },
  exercises: [],
}
l0u1l2.exercises = [
  listening(
    l0u1l2.id,
    'cat',
    [
      { id: 'a', label: 'cat' },
      { id: 'b', label: 'cut' },
      { id: 'c', label: 'coat' },
    ],
    'a',
    '"Cat" (gato) tem um som de "á" curto e aberto.',
  ),
  mc(
    l0u1l2.id,
    'Qual palavra tem o som de "í" longo, como em "ver"?',
    [
      { id: 'a', label: 'see' },
      { id: 'b', label: 'say' },
      { id: 'c', label: 'so' },
    ],
    'a',
    '"See" (ver) tem o som de "í" bem alongado.',
  ),
  speaking(l0u1l2.id, 'See you soon', 'Repita prestando atenção no som prolongado do "ee".'),
  trueFalse(l0u1l2.id, 'As vogais do inglês soam exatamente como em português.', false, 'As vogais do inglês têm sons próprios, diferentes do português — por isso é importante treinar o ouvido.'),
]

const l0u1l3: Lesson = {
  id: 'lvl0-u1-l3',
  unitId: 'lvl0-u1',
  order: 3,
  title: 'Palavras do dia a dia',
  type: 'lesson',
  xpReward: 10,
  theory: {
    title: 'Primeiro vocabulário',
    body: 'Vamos aprender palavras simples e muito usadas no dia a dia, associando cada uma a uma imagem para fixar melhor o vocabulário.',
    examples: [
      { en: 'water', pt: 'água' },
      { en: 'house', pt: 'casa' },
    ],
  },
  exercises: [],
}
l0u1l3.exercises = [
  mc(
    l0u1l3.id,
    'Qual imagem representa "water"?',
    [
      { id: 'a', label: 'água', imageEmoji: '💧' },
      { id: 'b', label: 'fogo', imageEmoji: '🔥' },
      { id: 'c', label: 'casa', imageEmoji: '🏠' },
    ],
    'a',
    '"Water" significa água.',
  ),
  match(
    l0u1l3.id,
    'Ligue a palavra em inglês à tradução em português.',
    [
      { id: 'p1', left: 'house', right: 'casa' },
      { id: 'p2', left: 'water', right: 'água' },
      { id: 'p3', left: 'book', right: 'livro' },
      { id: 'p4', left: 'dog', right: 'cachorro' },
    ],
    'Palavras básicas do vocabulário do dia a dia.',
  ),
  translation(l0u1l3.id, 'Traduza para o inglês: "livro"', 'book', '"Livro" em inglês é "book".'),
  fillBlank(l0u1l3.id, 'Complete: I have a ___ (cachorro).', 'dog', '"Dog" significa cachorro.'),
]

const l0u1l4: Lesson = {
  id: 'lvl0-u1-l4',
  unitId: 'lvl0-u1',
  order: 4,
  title: 'Praticando a pronúncia',
  type: 'lesson',
  xpReward: 12,
  theory: {
    title: 'Treinando o ouvido e a boca',
    body: 'Falar em voz alta desde o começo ajuda a criar memória muscular para a pronúncia. Não se preocupe em errar — o importante é praticar.',
    examples: [
      { en: 'Thank you.', pt: 'Obrigado(a).' },
      { en: 'Good morning.', pt: 'Bom dia.' },
    ],
  },
  exercises: [],
}
l0u1l4.exercises = [
  speaking(l0u1l4.id, 'Thank you', 'Repita "Thank you" prestando atenção no som do "th", colocando a língua entre os dentes.'),
  speaking(l0u1l4.id, 'Good morning', 'Repita "Good morning" com calma, separando bem as duas palavras.'),
  listening(
    l0u1l4.id,
    'Thank you',
    [
      { id: 'a', label: 'Thank you' },
      { id: 'b', label: 'Think you' },
      { id: 'c', label: 'Thank her' },
    ],
    'a',
    'Você ouviu "Thank you", forma de dizer obrigado(a).',
  ),
]

const l0u1checkpoint: Lesson = {
  id: 'lvl0-u1-checkpoint',
  unitId: 'lvl0-u1',
  order: 5,
  title: 'Revisão: Alfabeto e Sons',
  type: 'checkpoint',
  xpReward: 15,
  exercises: [
    mc(
      'lvl0-u1-checkpoint',
      'Qual é a pronúncia correta da letra "H"?',
      [
        { id: 'a', label: 'eitch' },
        { id: 'b', label: 'agá' },
      ],
      'a',
      'A letra H se pronuncia "eitch" em inglês.',
    ),
    listening(
      'lvl0-u1-checkpoint',
      'cat',
      [
        { id: 'a', label: 'cat' },
        { id: 'b', label: 'cut' },
      ],
      'a',
      '"Cat" tem som de "á" curto.',
    ),
    translation('lvl0-u1-checkpoint', 'Traduza: "água"', 'water', '"Água" em inglês é "water".'),
    speaking('lvl0-u1-checkpoint', 'Good morning', 'Pratique novamente essa saudação tão comum.'),
  ],
}

const unit1 = {
  id: 'lvl0-u1',
  levelId: 'lvl0',
  order: 2,
  title: 'O Alfabeto e os Sons do Inglês',
  objective: 'Reconhecer as letras e os primeiros sons do inglês',
  lessons: [l0u1l1, l0u1l2, l0u1l3, l0u1l4, l0u1checkpoint],
}

// UNIT 2 — Saudações e Apresentações
const l0u2l1: Lesson = {
  id: 'lvl0-u2-l1',
  unitId: 'lvl0-u2',
  order: 1,
  title: 'Olá e Tchau',
  type: 'lesson',
  xpReward: 10,
  theory: {
    title: 'Cumprimentando alguém',
    body: 'Existem várias formas de dizer "olá" e "tchau" em inglês, dependendo da hora do dia e da formalidade.',
    examples: [
      { en: 'Hi! / Hello!', pt: 'Oi! / Olá!' },
      { en: 'Good morning / Good afternoon / Good evening', pt: 'Bom dia / Boa tarde / Boa noite (chegando)' },
      { en: 'Bye! / See you later!', pt: 'Tchau! / Até mais!' },
    ],
  },
  exercises: [],
}
l0u2l1.exercises = [
  mc(
    l0u2l1.id,
    'Como você cumprimenta alguém de manhã?',
    [
      { id: 'a', label: 'Good morning' },
      { id: 'b', label: 'Good night' },
      { id: 'c', label: 'Goodbye' },
    ],
    'a',
    '"Good morning" é usado para cumprimentar pela manhã.',
  ),
  translation('lvl0-u2-l1', 'Traduza: "Até mais!"', 'See you later', 'Uma forma comum e informal de se despedir.', ['See you later!']),
  order('lvl0-u2-l1', 'Monte a frase:', ['morning', 'Good'], ['Good', 'morning'], '"Good morning" significa bom dia.'),
  listening(
    l0u2l1.id,
    'Good night',
    [
      { id: 'a', label: 'Good night' },
      { id: 'b', label: 'Good morning' },
    ],
    'a',
    '"Good night" é usado ao se despedir à noite, antes de dormir.',
  ),
]

const l0u2l2: Lesson = {
  id: 'lvl0-u2-l2',
  unitId: 'lvl0-u2',
  order: 2,
  title: 'Como você está?',
  type: 'lesson',
  xpReward: 10,
  theory: {
    title: 'Perguntando como alguém está',
    body: 'A pergunta "How are you?" é uma das mais comuns em conversas do dia a dia.',
    examples: [
      { en: 'How are you?', pt: 'Como você está?' },
      { en: "I'm fine, thank you. And you?", pt: 'Estou bem, obrigado(a). E você?' },
    ],
  },
  exercises: [],
}
l0u2l2.exercises = [
  dialogue(
    l0u2l2.id,
    'How are you?',
    [
      { id: 'a', label: "I'm fine, thank you." },
      { id: 'b', label: 'My name is Ana.' },
      { id: 'c', label: 'Good morning.' },
    ],
    'a',
    '"I\'m fine, thank you" é a resposta natural para "How are you?".',
  ),
  fillBlank(l0u2l2.id, "Complete: I'm ___, thank you.", 'fine', '"Fine" significa "bem".'),
  translation('lvl0-u2-l2', 'Traduza: "Como você está?"', 'How are you', 'Frase padrão para perguntar como alguém está.', ['How are you?']),
  speaking(l0u2l2.id, "I'm fine, thank you", 'Pratique essa resposta comum em conversas.'),
]

const l0u2l3: Lesson = {
  id: 'lvl0-u2-l3',
  unitId: 'lvl0-u2',
  order: 3,
  title: 'Se apresentando',
  type: 'lesson',
  xpReward: 10,
  theory: {
    title: 'Dizendo seu nome',
    body: 'Para se apresentar, usamos "My name is..." ou de forma mais simples "I\'m...".',
    examples: [
      { en: 'My name is Carlos.', pt: 'Meu nome é Carlos.' },
      { en: 'Nice to meet you!', pt: 'Prazer em te conhecer!' },
    ],
  },
  exercises: [],
}
l0u2l3.exercises = [
  order('lvl0-u2-l3', 'Monte a frase:', ['is', 'name', 'My', 'Ana'], ['My', 'name', 'is', 'Ana'], '"My name is Ana" significa "Meu nome é Ana".'),
  mc(
    l0u2l3.id,
    'O que significa "Nice to meet you"?',
    [
      { id: 'a', label: 'Prazer em te conhecer' },
      { id: 'b', label: 'Até logo' },
      { id: 'c', label: 'Como você está' },
    ],
    'a',
    'Usamos essa expressão ao conhecer alguém pela primeira vez.',
  ),
  translation('lvl0-u2-l3', 'Traduza: "Meu nome é João."', 'My name is João', 'Estrutura: My name is + nome.'),
  speaking(l0u2l3.id, 'Nice to meet you', 'Pratique essa expressão tão usada em apresentações.'),
]

const l0u2l4: Lesson = {
  id: 'lvl0-u2-l4',
  unitId: 'lvl0-u2',
  order: 4,
  title: 'Perguntas básicas',
  type: 'lesson',
  xpReward: 10,
  theory: {
    title: 'Perguntando nome e origem',
    body: 'Duas perguntas essenciais para começar uma conversa: seu nome e de onde você é.',
    examples: [
      { en: "What's your name?", pt: 'Qual é o seu nome?' },
      { en: 'Where are you from?', pt: 'De onde você é?' },
      { en: "I'm from Brazil.", pt: 'Eu sou do Brasil.' },
    ],
  },
  exercises: [],
}
l0u2l4.exercises = [
  dialogue(
    l0u2l4.id,
    "What's your name?",
    [
      { id: 'a', label: 'My name is Paula.' },
      { id: 'b', label: "I'm fine, thanks." },
      { id: 'c', label: 'See you later.' },
    ],
    'a',
    'A resposta natural para "What\'s your name?" é dizer seu nome.',
  ),
  fillBlank(l0u2l4.id, 'Complete: Where are you ___?', 'from', '"Where are you from?" pergunta a origem de alguém.'),
  translation('lvl0-u2-l4', 'Traduza: "Eu sou do Brasil."', "I'm from Brazil", 'Estrutura: I\'m from + país.', ['I am from Brazil']),
  trueFalse(l0u2l4.id, '"Where are you from?" pergunta onde você mora atualmente.', false, 'Na verdade, essa pergunta se refere à sua origem/nacionalidade, embora no uso comum também sirva para onde você vive.'),
]

const l0u2checkpoint: Lesson = {
  id: 'lvl0-u2-checkpoint',
  unitId: 'lvl0-u2',
  order: 5,
  title: 'Revisão: Saudações e Apresentações',
  type: 'checkpoint',
  xpReward: 15,
  exercises: [
    dialogue(
      'lvl0-u2-checkpoint',
      'How are you?',
      [
        { id: 'a', label: "I'm fine, thank you." },
        { id: 'b', label: 'Nice to meet you.' },
      ],
      'a',
      'Resposta padrão para "How are you?".',
    ),
    order('lvl0-u2-checkpoint', 'Monte a frase:', ['name', 'is', 'My', 'Lucas'], ['My', 'name', 'is', 'Lucas'], 'Estrutura de apresentação: My name is + nome.'),
    translation('lvl0-u2-checkpoint', 'Traduza: "De onde você é?"', 'Where are you from', 'Pergunta usada para saber a origem de alguém.', ['Where are you from?']),
    speaking('lvl0-u2-checkpoint', 'Nice to meet you', 'Pratique novamente essa expressão de apresentação.'),
  ],
}

const unit2 = {
  id: 'lvl0-u2',
  levelId: 'lvl0',
  order: 3,
  title: 'Saudações e Apresentações',
  objective: 'Cumprimentar, se apresentar e fazer perguntas básicas',
  lessons: [l0u2l1, l0u2l2, l0u2l3, l0u2l4, l0u2checkpoint],
}

// ---------------------------------------------------------------------------
// UNIT — Nossa Sala de Aula
// ---------------------------------------------------------------------------
const l0u2bl1: Lesson = {
  id: 'lvl0-u2b-l1',
  unitId: 'lvl0-u2b',
  order: 1,
  title: 'Objetos da Sala de Aula',
  type: 'lesson',
  xpReward: 10,
  theory: {
    title: 'Vocabulário da sala de aula',
    body: 'Vamos aprender os nomes dos objetos mais comuns em uma sala de aula, para reconhecê-los rapidamente.',
    examples: [
      { en: 'a pen', pt: 'uma caneta' },
      { en: 'a door', pt: 'uma porta' },
    ],
  },
  exercises: [],
}
l0u2bl1.exercises = [
  mc(l0u2bl1.id, 'O que é isso?', [
    { id: 'a', label: 'backpack', imageEmoji: '🎒' },
    { id: 'b', label: 'door', imageEmoji: '🚪' },
    { id: 'c', label: 'pen', imageEmoji: '🖊️' },
  ], 'a', '"Backpack" significa mochila.'),
  match(
    l0u2bl1.id,
    'Ligue a palavra à tradução.',
    [
      { id: 'p1', left: 'pen', right: 'caneta' },
      { id: 'p2', left: 'door', right: 'porta' },
      { id: 'p3', left: 'chair', right: 'cadeira' },
      { id: 'p4', left: 'clock', right: 'relógio' },
      { id: 'p5', left: 'window', right: 'janela' },
      { id: 'p6', left: 'umbrella', right: 'guarda-chuva' },
    ],
    'Vocabulário básico de objetos da sala de aula.',
  ),
  fillBlank(l0u2bl1.id, 'Complete: It\'s a ___. (caneta)', 'pen', '"Pen" significa caneta.'),
  listening(l0u2bl1.id, 'computer', [
    { id: 'a', label: 'computer' },
    { id: 'b', label: 'phone' },
  ], 'a', '"Computer" significa computador.'),
]

const l0u2bl2: Lesson = {
  id: 'lvl0-u2b-l2',
  unitId: 'lvl0-u2b',
  order: 2,
  title: "It's / They're, A / An",
  type: 'lesson',
  xpReward: 10,
  theory: {
    title: 'Falando sobre objetos',
    body: 'Usamos "it\'s" para um objeto e "they\'re" para dois ou mais. Usamos "a" antes de som de consoante e "an" antes de som de vogal (a, e, i, o, u).',
    examples: [
      { en: "It's a pencil.", pt: 'É um lápis.' },
      { en: "It's an eraser.", pt: 'É uma borracha.' },
      { en: "They're pencils.", pt: 'São lápis.' },
    ],
  },
  exercises: [],
}
l0u2bl2.exercises = [
  mc(l0u2bl2.id, 'Qual artigo usamos antes de "eraser"?', [
    { id: 'a', label: 'an' },
    { id: 'b', label: 'a' },
  ], 'a', '"Eraser" começa com som de vogal, por isso usamos "an".'),
  fillBlank(l0u2bl2.id, 'Complete: It\'s ___ umbrella. (an/a)', 'an', '"Umbrella" começa com som de vogal: usamos "an".'),
  order('lvl0-u2b-l2', 'Monte a frase:', ['pencils', "They're"], ['They\'re', 'pencils'], '"They\'re pencils" significa "São lápis".'),
  trueFalse(l0u2bl2.id, 'Usamos "an" antes de palavras que começam com som de consoante.', false, 'Usamos "an" antes de som de VOGAL. Antes de consoante, usamos "a".'),
]

const l0u2bcheckpoint: Lesson = {
  id: 'lvl0-u2b-checkpoint',
  unitId: 'lvl0-u2b',
  order: 3,
  title: 'Revisão: Nossa Sala de Aula',
  type: 'checkpoint',
  xpReward: 15,
  exercises: [
    mc('lvl0-u2b-checkpoint', 'O que significa "window"?', [
      { id: 'a', label: 'janela' },
      { id: 'b', label: 'porta' },
    ], 'a', '"Window" significa janela.'),
    fillBlank('lvl0-u2b-checkpoint', 'Complete: It\'s ___ eraser. (an/a)', 'an', '"Eraser" começa com som de vogal.'),
    match(
      'lvl0-u2b-checkpoint',
      'Ligue a palavra à tradução.',
      [
        { id: 'p1', left: 'chair', right: 'cadeira' },
        { id: 'p2', left: 'clock', right: 'relógio' },
      ],
      'Revisão do vocabulário da sala de aula.',
    ),
    translation('lvl0-u2b-checkpoint', 'Traduza: "São livros."', "They're books", 'Usamos "they\'re" + substantivo no plural.'),
  ],
}

const unitClassroomObjects = {
  id: 'lvl0-u2b',
  levelId: 'lvl0',
  order: 4,
  title: 'Nossa Sala de Aula',
  objective: 'Reconhecer objetos da sala de aula e usar it\'s/they\'re, a/an',
  lessons: [l0u2bl1, l0u2bl2, l0u2bcheckpoint],
}

// UNIT 3 — Números e Pronomes
const l0u3l1: Lesson = {
  id: 'lvl0-u3-l1',
  unitId: 'lvl0-u3',
  order: 1,
  title: 'Números de 0 a 10',
  type: 'lesson',
  xpReward: 10,
  theory: {
    title: 'Contando até 10',
    body: 'Os números são essenciais para o dia a dia: idade, preços, horários. Vamos começar do zero até dez.',
    examples: [
      { en: 'zero, one, two, three, four, five', pt: 'zero, um, dois, três, quatro, cinco' },
      { en: 'six, seven, eight, nine, ten', pt: 'seis, sete, oito, nove, dez' },
    ],
  },
  exercises: [],
}
l0u3l1.exercises = [
  mc(l0u3l1.id, 'Como se diz "cinco" em inglês?', [
    { id: 'a', label: 'five' },
    { id: 'b', label: 'four' },
    { id: 'c', label: 'nine' },
  ], 'a', '"Five" significa cinco.'),
  listening(l0u3l1.id, 'seven', [
    { id: 'a', label: 'seven' },
    { id: 'b', label: 'eleven' },
    { id: 'c', label: 'six' },
  ], 'a', '"Seven" significa sete.'),
  fillBlank(l0u3l1.id, 'Complete a sequência: one, two, ___, four', 'three', 'A sequência é: one, two, three, four.'),
  speaking(l0u3l1.id, 'One, two, three, four, five', 'Pratique contando em voz alta.'),
]

const l0u3l2: Lesson = {
  id: 'lvl0-u3-l2',
  unitId: 'lvl0-u3',
  order: 2,
  title: 'Números de 11 a 100',
  type: 'lesson',
  xpReward: 10,
  theory: {
    title: 'Números maiores',
    body: 'De 13 a 19, os números terminam em "-teen" (thirteen, fourteen...). As dezenas terminam em "-ty" (twenty, thirty...).',
    examples: [
      { en: 'thirteen, fourteen, fifteen', pt: 'treze, quatorze, quinze' },
      { en: 'twenty, thirty, forty, fifty', pt: 'vinte, trinta, quarenta, cinquenta' },
      { en: 'one hundred', pt: 'cem' },
    ],
  },
  exercises: [],
}
l0u3l2.exercises = [
  mc(l0u3l2.id, 'Como se diz "vinte" em inglês?', [
    { id: 'a', label: 'twenty' },
    { id: 'b', label: 'twelve' },
    { id: 'c', label: 'ten' },
  ], 'a', '"Twenty" significa vinte.'),
  translation('lvl0-u3-l2', 'Traduza: "cem"', 'one hundred', '"Cem" em inglês é "one hundred".', ['hundred']),
  fillBlank(l0u3l2.id, 'Complete: 13 = thir___', 'teen', 'Números de 13 a 19 terminam em "-teen".'),
  trueFalse(l0u3l2.id, '"Thirty" significa "treze".', false, '"Thirty" significa "trinta". "Treze" é "thirteen".'),
]

const l0u3l3: Lesson = {
  id: 'lvl0-u3-l3',
  unitId: 'lvl0-u3',
  order: 3,
  title: 'Pronomes pessoais',
  type: 'lesson',
  xpReward: 12,
  theory: {
    title: 'I, you, he, she, it, we, they',
    body: 'Os pronomes pessoais substituem os nomes das pessoas ou coisas. Eles são a base para montar frases em inglês.',
    examples: [
      { en: 'I am a student.', pt: 'Eu sou um(a) estudante.' },
      { en: 'She is my sister.', pt: 'Ela é minha irmã.' },
      { en: 'They are friends.', pt: 'Eles/Elas são amigos.' },
    ],
  },
  exercises: [],
}
l0u3l3.exercises = [
  match(
    l0u3l3.id,
    'Ligue o pronome à tradução.',
    [
      { id: 'p1', left: 'I', right: 'eu' },
      { id: 'p2', left: 'you', right: 'você' },
      { id: 'p3', left: 'he', right: 'ele' },
      { id: 'p4', left: 'she', right: 'ela' },
      { id: 'p5', left: 'we', right: 'nós' },
      { id: 'p6', left: 'they', right: 'eles/elas' },
    ],
    'Pronomes pessoais em inglês não mudam com gênero, exceto "he" e "she".',
  ),
  mc(l0u3l3.id, 'Qual pronome usamos para "ela"?', [
    { id: 'a', label: 'she' },
    { id: 'b', label: 'he' },
    { id: 'c', label: 'it' },
  ], 'a', '"She" é usado para pessoas do sexo feminino.'),
  fillBlank(l0u3l3.id, 'Complete: ___ am a student. (Eu)', 'I', 'O pronome "I" (eu) é sempre escrito em maiúscula em inglês.'),
  translation('lvl0-u3-l3', 'Traduza: "Eles são amigos."', 'They are friends', 'Usamos "they" para grupos de pessoas ou coisas.'),
]

const l0u3l4: Lesson = {
  id: 'lvl0-u3-l4',
  unitId: 'lvl0-u3',
  order: 4,
  title: 'Verbo Have (introdução)',
  type: 'lesson',
  xpReward: 12,
  theory: {
    title: 'Have / Has: ter',
    body: 'O verbo "have" significa "ter". Usamos "have" com I/you/we/they e "has" com he/she/it.',
    examples: [
      { en: 'I have a dog.', pt: 'Eu tenho um cachorro.' },
      { en: 'She has a car.', pt: 'Ela tem um carro.' },
    ],
  },
  exercises: [],
}
l0u3l4.exercises = [
  mc(l0u3l4.id, 'Complete: She ___ a car.', [
    { id: 'a', label: 'has' },
    { id: 'b', label: 'have' },
    { id: 'c', label: 'is' },
  ], 'a', 'Com "he/she/it" usamos "has".'),
  fillBlank(l0u3l4.id, 'Complete: I ___ a dog. (tenho)', 'have', 'Com "I" usamos "have".'),
  order('lvl0-u3-l4', 'Monte a frase:', ['a', 'have', 'dog', 'I'], ['I', 'have', 'a', 'dog'], '"I have a dog" significa "Eu tenho um cachorro".'),
  translation('lvl0-u3-l4', 'Traduza: "Ela tem um carro."', 'She has a car', 'Estrutura: pronome + has/have + objeto.'),
]

const l0u3checkpoint: Lesson = {
  id: 'lvl0-u3-checkpoint',
  unitId: 'lvl0-u3',
  order: 5,
  title: 'Revisão: Números e Pronomes',
  type: 'checkpoint',
  xpReward: 15,
  exercises: [
    mc('lvl0-u3-checkpoint', 'Como se diz "dez" em inglês?', [
      { id: 'a', label: 'ten' },
      { id: 'b', label: 'nine' },
    ], 'a', '"Ten" significa dez.'),
    match(
      'lvl0-u3-checkpoint',
      'Ligue o pronome à tradução.',
      [
        { id: 'p1', left: 'I', right: 'eu' },
        { id: 'p2', left: 'she', right: 'ela' },
        { id: 'p3', left: 'they', right: 'eles/elas' },
      ],
      'Revisão dos pronomes pessoais.',
    ),
    fillBlank('lvl0-u3-checkpoint', 'Complete: I ___ a dog.', 'have', 'Com "I" usamos "have".'),
    translation('lvl0-u3-checkpoint', 'Traduza: "cem"', 'one hundred', '"Cem" é "one hundred".'),
  ],
}

const unit3 = {
  id: 'lvl0-u3',
  levelId: 'lvl0',
  order: 5,
  title: 'Números e Pronomes',
  objective: 'Contar até 100 e usar pronomes pessoais e o verbo have',
  lessons: [l0u3l1, l0u3l2, l0u3l3, l0u3l4, l0u3checkpoint],
}

// ---------------------------------------------------------------------------
// UNIT — Informações Pessoais
// ---------------------------------------------------------------------------
const l0u4l1: Lesson = {
  id: 'lvl0-u4-l1',
  unitId: 'lvl0-u4',
  order: 1,
  title: 'Pronomes Possessivos',
  type: 'lesson',
  xpReward: 12,
  theory: {
    title: 'My, your, his, her...',
    body: 'Pronomes possessivos vêm antes de um substantivo para indicar a quem ele pertence, como nome, telefone ou e-mail.',
    examples: [
      { en: 'My name is Pablo.', pt: 'Meu nome é Pablo.' },
      { en: 'Her email address is doc12@zmail.com.', pt: 'O e-mail dela é doc12@zmail.com.' },
      { en: 'Their class is in Room 15.', pt: 'A turma deles é na Sala 15.' },
    ],
  },
  exercises: [],
}
l0u4l1.exercises = [
  match(
    l0u4l1.id,
    'Ligue o pronome ao possessivo.',
    [
      { id: 'p1', left: 'I', right: 'my' },
      { id: 'p2', left: 'you', right: 'your' },
      { id: 'p3', left: 'he', right: 'his' },
      { id: 'p4', left: 'she', right: 'her' },
      { id: 'p5', left: 'we', right: 'our' },
      { id: 'p6', left: 'they', right: 'their' },
    ],
    'Cada pronome pessoal tem um possessivo correspondente.',
  ),
  fillBlank(l0u4l1.id, 'Complete: ___ name is Pablo. (Meu)', 'My', '"My" é o possessivo de "I".'),
  mc(l0u4l1.id, 'Qual possessivo usamos para "ela"?', [
    { id: 'a', label: 'her' },
    { id: 'b', label: 'his' },
    { id: 'c', label: 'their' },
  ], 'a', '"Her" é o possessivo de "she".'),
  translation(l0u4l1.id, 'Traduza: "Qual é o seu telefone?"', "What's your phone number", 'Estrutura: What\'s + your + substantivo.', ['What is your phone number']),
]

const l0u4l2: Lesson = {
  id: 'lvl0-u4-l2',
  unitId: 'lvl0-u4',
  order: 2,
  title: 'E-mail e Telefone',
  type: 'lesson',
  xpReward: 12,
  theory: {
    title: 'Trocando contatos',
    body: 'Para falar um e-mail em voz alta, usamos "at" para @ e "dot" para o ponto. Em números de telefone, o "0" costuma ser lido como "oh".',
    examples: [
      { en: "What's your email address?", pt: 'Qual é o seu e-mail?' },
      { en: 'It\'s ana@zmail.com.', pt: 'É ana@zmail.com.' },
      { en: 'We often say "oh" (not zero) with phone numbers.', pt: 'Costumamos dizer "oh" (não "zero") em números de telefone.' },
    ],
  },
  exercises: [],
}
l0u4l2.exercises = [
  mc(l0u4l2.id, 'Como se lê o símbolo "@" em inglês?', [
    { id: 'a', label: 'at' },
    { id: 'b', label: 'dot' },
    { id: 'c', label: 'on' },
  ], 'a', 'O símbolo "@" se lê "at" em inglês.'),
  fillBlank(l0u4l2.id, "Complete: What's your email ___? (endereço)", 'address', '"Email address" significa endereço de e-mail.'),
  listening(l0u4l2.id, 'It is ana at zmail dot com', [
    { id: 'a', label: 'ana@zmail.com' },
    { id: 'b', label: 'ana@zmail.net' },
  ], 'a', '"At" = @ e "dot com" = .com.'),
  dialogue(l0u4l2.id, "What's your phone number?", [
    { id: 'a', label: "It's 555-2436." },
    { id: 'b', label: 'Nice to meet you.' },
  ], 'a', 'Resposta natural para quem pergunta seu telefone.'),
]

const l0u4checkpoint: Lesson = {
  id: 'lvl0-u4-checkpoint',
  unitId: 'lvl0-u4',
  order: 3,
  title: 'Revisão: Informações Pessoais',
  type: 'checkpoint',
  xpReward: 15,
  exercises: [
    fillBlank('lvl0-u4-checkpoint', 'Complete: ___ name is Pablo. (Meu)', 'My', '"My" é o possessivo de "I".'),
    mc('lvl0-u4-checkpoint', 'Como se lê "@" em inglês?', [
      { id: 'a', label: 'at' },
      { id: 'b', label: 'dot' },
    ], 'a', 'O símbolo "@" se lê "at".'),
    match(
      'lvl0-u4-checkpoint',
      'Ligue o pronome ao possessivo.',
      [
        { id: 'p1', left: 'she', right: 'her' },
        { id: 'p2', left: 'they', right: 'their' },
      ],
      'Revisão dos pronomes possessivos.',
    ),
    translation('lvl0-u4-checkpoint', 'Traduza: "Qual é o seu e-mail?"', "What's your email address", 'Pergunta usada para pedir o e-mail de alguém.', ['What is your email address']),
  ],
}

const l0LevelTest: Lesson = {
  id: 'lvl0-test',
  unitId: 'lvl0-u4',
  order: 4,
  title: 'Prova de Nível: Primeiros Passos',
  type: 'level_test',
  xpReward: 30,
  exercises: [
    mc('lvl0-test', 'Como se pronuncia a letra "H"?', [
      { id: 'a', label: 'eitch' },
      { id: 'b', label: 'agá' },
    ], 'a', 'A letra H se pronuncia "eitch".'),
    dialogue('lvl0-test', 'How are you?', [
      { id: 'a', label: "I'm fine, thank you." },
      { id: 'b', label: 'My name is Ana.' },
    ], 'a', 'Resposta padrão para "How are you?".'),
    translation('lvl0-test', 'Traduza: "Meu nome é Ana."', 'My name is Ana', 'Estrutura: My name is + nome.'),
    fillBlank('lvl0-test', 'Complete: She ___ a car. (tem)', 'has', 'Com he/she/it usamos "has".'),
    order('lvl0-test', 'Monte a frase:', ['a', 'have', 'dog', 'I'], ['I', 'have', 'a', 'dog'], '"I have a dog" significa "Eu tenho um cachorro".'),
    listening('lvl0-test', 'twenty', [
      { id: 'a', label: 'twenty' },
      { id: 'b', label: 'twelve' },
    ], 'a', '"Twenty" significa vinte.'),
    mc('lvl0-test', 'O que significa "Open your book"?', [
      { id: 'a', label: 'Abra seu livro' },
      { id: 'b', label: 'Feche seu livro' },
    ], 'a', '"Open" significa abrir.'),
    fillBlank('lvl0-test', "Complete: ___ name is Pablo. (Meu)", 'My', '"My" é o possessivo de "I".'),
  ],
}

const unitPersonalInfo = {
  id: 'lvl0-u4',
  levelId: 'lvl0',
  order: 6,
  title: 'Informações Pessoais',
  objective: 'Usar pronomes possessivos e trocar e-mail/telefone',
  lessons: [l0u4l1, l0u4l2, l0u4checkpoint, l0LevelTest],
}

const level0: Level = {
  id: 'lvl0',
  order: 0,
  code: 'A0',
  title: 'Primeiros Passos',
  description: 'Instruções de sala de aula, alfabeto, saudações, objetos, números e informações pessoais.',
  units: [unitClassroomInstructions, unit1, unit2, unitClassroomObjects, unit3, unitPersonalInfo],
}

// ---------------------------------------------------------------------------
// NÍVEL 1 — Iniciante (A1) — conteúdo inicial (prova de conceito da trilha)
// ---------------------------------------------------------------------------

const l1u1l1: Lesson = {
  id: 'lvl1-u1-l1',
  unitId: 'lvl1-u1',
  order: 1,
  title: 'Am, Is, Are',
  type: 'lesson',
  xpReward: 12,
  theory: {
    title: 'O verbo To Be no presente',
    body: 'O verbo "to be" (ser/estar) muda conforme o pronome: I am, you are, he/she/it is, we are, they are. É um dos verbos mais usados do inglês.',
    examples: [
      { en: 'I am happy.', pt: 'Eu estou feliz.' },
      { en: 'You are my friend.', pt: 'Você é meu amigo.' },
      { en: 'He is tired.', pt: 'Ele está cansado.' },
    ],
  },
  exercises: [],
}
l1u1l1.exercises = [
  mc(l1u1l1.id, 'Complete: I ___ happy.', [
    { id: 'a', label: 'am' },
    { id: 'b', label: 'is' },
    { id: 'c', label: 'are' },
  ], 'a', 'Com o pronome "I" usamos sempre "am".'),
  mc(l1u1l1.id, 'Complete: She ___ tired.', [
    { id: 'a', label: 'is' },
    { id: 'b', label: 'am' },
    { id: 'c', label: 'are' },
  ], 'a', 'Com he/she/it usamos "is".'),
  fillBlank(l1u1l1.id, 'Complete: We ___ friends.', 'are', 'Com we/you/they usamos "are".'),
  match(
    l1u1l1.id,
    'Ligue o pronome à forma correta do verbo to be.',
    [
      { id: 'p1', left: 'I', right: 'am' },
      { id: 'p2', left: 'he / she / it', right: 'is' },
      { id: 'p3', left: 'we / you / they', right: 'are' },
    ],
    'O verbo to be concorda com o pronome: am, is ou are.',
  ),
]

const l1u1l2: Lesson = {
  id: 'lvl1-u1-l2',
  unitId: 'lvl1-u1',
  order: 2,
  title: 'Frases afirmativas',
  type: 'lesson',
  xpReward: 12,
  theory: {
    title: 'Descrevendo pessoas e coisas',
    body: 'Usamos o to be para descrever características, profissões e estados.',
    examples: [
      { en: 'I am a teacher.', pt: 'Eu sou professor(a).' },
      { en: 'The house is big.', pt: 'A casa é grande.' },
    ],
  },
  exercises: [],
}
l1u1l2.exercises = [
  order('lvl1-u1-l2', 'Monte a frase:', ['a', 'am', 'teacher', 'I'], ['I', 'am', 'a', 'teacher'], '"I am a teacher" significa "Eu sou professor(a)".'),
  translation('lvl1-u1-l2', 'Traduza: "A casa é grande."', 'The house is big', 'Estrutura: sujeito + is + adjetivo.'),
  listening(l1u1l2.id, 'The house is big', [
    { id: 'a', label: 'The house is big' },
    { id: 'b', label: 'The house is small' },
  ], 'a', 'Você ouviu "The house is big" (A casa é grande).'),
  speaking(l1u1l2.id, 'I am a teacher', 'Pratique essa frase de apresentação profissional.'),
]

const l1u1l3: Lesson = {
  id: 'lvl1-u1-l3',
  unitId: 'lvl1-u1',
  order: 3,
  title: 'Perguntas e negativas',
  type: 'lesson',
  xpReward: 12,
  theory: {
    title: 'Negando e perguntando com to be',
    body: 'Para negar, adicionamos "not" depois do verbo. Para perguntar, invertemos o verbo com o sujeito.',
    examples: [
      { en: "I am not tired.", pt: 'Eu não estou cansado.' },
      { en: 'Are you a student?', pt: 'Você é estudante?' },
    ],
  },
  exercises: [],
}
l1u1l3.exercises = [
  fillBlank(l1u1l3.id, 'Complete a negativa: I am ___ tired. (não)', 'not', 'Para negar, usamos "not" depois do verbo to be.'),
  order('lvl1-u1-l3', 'Monte a pergunta:', ['a', 'you', 'student', 'Are'], ['Are', 'you', 'a', 'student'], 'Para perguntar, o verbo vem antes do sujeito: Are you...?'),
  dialogue('lvl1-u1-l3', 'Are you a student?', [
    { id: 'a', label: 'Yes, I am.' },
    { id: 'b', label: 'Yes, I have.' },
  ], 'a', 'Respondemos perguntas com to be repetindo o verbo: "Yes, I am."'),
  trueFalse(l1u1l3.id, 'Para negar o verbo to be, colocamos "not" antes do verbo.', false, 'Na verdade, "not" vem depois do verbo to be: I am not, she is not, they are not.'),
]

const l1u1checkpoint: Lesson = {
  id: 'lvl1-u1-checkpoint',
  unitId: 'lvl1-u1',
  order: 4,
  title: 'Revisão: Verbo To Be',
  type: 'checkpoint',
  xpReward: 18,
  exercises: [
    mc('lvl1-u1-checkpoint', 'Complete: They ___ happy.', [
      { id: 'a', label: 'are' },
      { id: 'b', label: 'is' },
    ], 'a', 'Com "they" usamos "are".'),
    order('lvl1-u1-checkpoint', 'Monte a pergunta:', ['a', 'you', 'student', 'Are'], ['Are', 'you', 'a', 'student'], 'Estrutura de pergunta: Are + sujeito + complemento?'),
    translation('lvl1-u1-checkpoint', 'Traduza: "Eu não estou cansado."', 'I am not tired', 'Negativa: sujeito + am/is/are + not.'),
    fillBlank('lvl1-u1-checkpoint', 'Complete: She ___ a teacher.', 'is', 'Com she usamos "is".'),
  ],
}

const unit1v1 = {
  id: 'lvl1-u1',
  levelId: 'lvl1',
  order: 1,
  title: 'Verbo To Be',
  objective: 'Usar o verbo to be para descrever pessoas e coisas',
  lessons: [l1u1l1, l1u1l2, l1u1l3, l1u1checkpoint],
}

const l1u2l1: Lesson = {
  id: 'lvl1-u2-l1',
  unitId: 'lvl1-u2',
  order: 1,
  title: 'Presente Simples: rotina',
  type: 'lesson',
  xpReward: 12,
  theory: {
    title: 'Falando sobre hábitos e rotina',
    body: 'O presente simples é usado para hábitos e rotinas. Com he/she/it, adicionamos "-s" ao verbo.',
    examples: [
      { en: 'I wake up at 7 am.', pt: 'Eu acordo às 7h.' },
      { en: 'She works every day.', pt: 'Ela trabalha todos os dias.' },
    ],
  },
  exercises: [],
}
l1u2l1.exercises = [
  mc(l1u2l1.id, 'Complete: She ___ every day. (trabalha)', [
    { id: 'a', label: 'works' },
    { id: 'b', label: 'work' },
    { id: 'c', label: 'working' },
  ], 'a', 'Com he/she/it, adicionamos "-s" ao verbo no presente simples.'),
  fillBlank(l1u2l1.id, 'Complete: I ___ up at 7 am. (acordo)', 'wake', 'Com "I" o verbo fica na forma base: wake up.'),
  translation('lvl1-u2-l1', 'Traduza: "Ela trabalha todos os dias."', 'She works every day', 'Presente simples com "-s" para he/she/it.'),
  order('lvl1-u2-l1', 'Monte a frase:', ['at', 'up', 'wake', '7am', 'I'], ['I', 'wake', 'up', 'at', '7am'], '"I wake up at 7am" descreve um hábito diário.'),
]

const l1u2l2: Lesson = {
  id: 'lvl1-u2-l2',
  unitId: 'lvl1-u2',
  order: 2,
  title: 'Advérbios de frequência',
  type: 'lesson',
  xpReward: 12,
  theory: {
    title: 'Always, usually, sometimes, never',
    body: 'Esses advérbios indicam a frequência de uma ação e geralmente vêm antes do verbo principal.',
    examples: [
      { en: 'I always drink coffee.', pt: 'Eu sempre tomo café.' },
      { en: 'She never eats meat.', pt: 'Ela nunca come carne.' },
    ],
  },
  exercises: [],
}
l1u2l2.exercises = [
  match(
    l1u2l2.id,
    'Ligue o advérbio à tradução.',
    [
      { id: 'p1', left: 'always', right: 'sempre' },
      { id: 'p2', left: 'usually', right: 'geralmente' },
      { id: 'p3', left: 'sometimes', right: 'às vezes' },
      { id: 'p4', left: 'never', right: 'nunca' },
    ],
    'Advérbios de frequência descrevem com que frequência algo acontece.',
  ),
  order('lvl1-u2-l2', 'Monte a frase:', ['coffee', 'always', 'drink', 'I'], ['I', 'always', 'drink', 'coffee'], 'O advérbio de frequência vem antes do verbo principal.'),
  fillBlank(l1u2l2.id, 'Complete: She ___ eats meat. (nunca)', 'never', '"Never" significa nunca.'),
  listening(l1u2l2.id, 'I always drink coffee', [
    { id: 'a', label: 'I always drink coffee' },
    { id: 'b', label: 'I never drink coffee' },
  ], 'a', 'Você ouviu "I always drink coffee" (Eu sempre tomo café).'),
]

const l1u2l3: Lesson = {
  id: 'lvl1-u2-l3',
  unitId: 'lvl1-u2',
  order: 3,
  title: 'Minha rotina',
  type: 'lesson',
  xpReward: 12,
  theory: {
    title: 'Descrevendo sua rotina',
    body: 'Vamos praticar frases completas sobre a rotina diária, combinando presente simples e advérbios de frequência.',
    examples: [
      { en: 'I usually go to work by bus.', pt: 'Eu geralmente vou ao trabalho de ônibus.' },
      { en: 'We have dinner at 8 pm.', pt: 'Nós jantamos às 20h.' },
    ],
  },
  exercises: [],
}
l1u2l3.exercises = [
  translation('lvl1-u2-l3', 'Traduza: "Nós jantamos às 20h."', 'We have dinner at 8 pm', 'Estrutura: sujeito + verbo + horário.'),
  dialogue(l1u2l3.id, 'What time do you wake up?', [
    { id: 'a', label: 'I wake up at 7 am.' },
    { id: 'b', label: 'I am a teacher.' },
  ], 'a', 'Resposta natural para perguntas sobre horário de rotina.'),
  speaking(l1u2l3.id, 'I usually go to work by bus', 'Pratique essa frase sobre deslocamento diário.'),
  trueFalse(l1u2l3.id, '"Usually" significa "nunca".', false, '"Usually" significa "geralmente". "Nunca" é "never".'),
]

const l1u2checkpoint: Lesson = {
  id: 'lvl1-u2-checkpoint',
  unitId: 'lvl1-u2',
  order: 4,
  title: 'Revisão: Rotina Diária',
  type: 'checkpoint',
  xpReward: 18,
  exercises: [
    mc('lvl1-u2-checkpoint', 'Complete: She ___ every day.', [
      { id: 'a', label: 'works' },
      { id: 'b', label: 'work' },
    ], 'a', 'Com he/she/it adicionamos "-s".'),
    match(
      'lvl1-u2-checkpoint',
      'Ligue o advérbio à tradução.',
      [
        { id: 'p1', left: 'always', right: 'sempre' },
        { id: 'p2', left: 'never', right: 'nunca' },
      ],
      'Revisão de advérbios de frequência.',
    ),
    translation('lvl1-u2-checkpoint', 'Traduza: "Eu sempre tomo café."', 'I always drink coffee', 'Advérbio de frequência antes do verbo principal.'),
    order('lvl1-u2-checkpoint', 'Monte a frase:', ['up', 'wake', 'I', 'at', '7am'], ['I', 'wake', 'up', 'at', '7am'], 'Estrutura de frase sobre rotina.'),
  ],
}

const unit2v1 = {
  id: 'lvl1-u2',
  levelId: 'lvl1',
  order: 2,
  title: 'Rotina Diária',
  objective: 'Falar sobre sua rotina usando presente simples e advérbios de frequência',
  lessons: [l1u2l1, l1u2l2, l1u2l3, l1u2checkpoint],
}

// ---------------------------------------------------------------------------
// UNIT — Meu Bairro
// ---------------------------------------------------------------------------
const l1u3l1: Lesson = {
  id: 'lvl1-u3-l1',
  unitId: 'lvl1-u3',
  order: 1,
  title: 'Lugares do Bairro',
  type: 'lesson',
  xpReward: 12,
  theory: {
    title: 'Vocabulário de bairro',
    body: 'Vamos aprender os nomes de lugares comuns em um bairro, úteis para se localizar e pedir informações.',
    examples: [
      { en: 'There is a bank near here.', pt: 'Tem um banco perto daqui.' },
      { en: 'The park is beautiful.', pt: 'O parque é bonito.' },
    ],
  },
  exercises: [],
}
l1u3l1.exercises = [
  mc(l1u3l1.id, 'O que é isso?', [
    { id: 'a', label: 'bank', imageEmoji: '🏦' },
    { id: 'b', label: 'park', imageEmoji: '🌳' },
    { id: 'c', label: 'school', imageEmoji: '🏫' },
  ], 'a', '"Bank" significa banco.'),
  match(
    l1u3l1.id,
    'Ligue a palavra à tradução.',
    [
      { id: 'p1', left: 'park', right: 'parque' },
      { id: 'p2', left: 'restaurant', right: 'restaurante' },
      { id: 'p3', left: 'school', right: 'escola' },
      { id: 'p4', left: 'supermarket', right: 'supermercado' },
      { id: 'p5', left: 'gym', right: 'academia' },
    ],
    'Vocabulário de lugares do bairro.',
  ),
  fillBlank(l1u3l1.id, 'Complete: I need money. Is there a ___ around here? (banco)', 'bank', '"Bank" significa banco.'),
  listening(l1u3l1.id, 'supermarket', [
    { id: 'a', label: 'supermarket' },
    { id: 'b', label: 'restaurant' },
  ], 'a', '"Supermarket" significa supermercado.'),
]

const l1u3l2: Lesson = {
  id: 'lvl1-u3-l2',
  unitId: 'lvl1-u3',
  order: 2,
  title: 'There is / There are',
  type: 'lesson',
  xpReward: 12,
  theory: {
    title: 'Existência de coisas',
    body: '"There is" (there\'s) é usado no singular. "There are" é usado no plural. Podemos usar "a/an", "some", "no" ou um número antes do substantivo.',
    examples: [
      { en: "There's a park on my street.", pt: 'Tem um parque na minha rua.' },
      { en: 'There are two cafes.', pt: 'Tem dois cafés.' },
      { en: 'There are no garages.', pt: 'Não tem garagens.' },
    ],
  },
  exercises: [],
}
l1u3l2.exercises = [
  mc(l1u3l2.id, 'Complete: ___ a park on my street.', [
    { id: 'a', label: "There's" },
    { id: 'b', label: 'There are' },
  ], 'a', '"There\'s" (there is) é usado no singular.'),
  fillBlank(l1u3l2.id, 'Complete: There ___ two cafes. (are)', 'are', '"There are" é usado no plural.'),
  order('lvl1-u3-l2', 'Monte a frase:', ['garages', 'are', 'no', 'There'], ['There', 'are', 'no', 'garages'], '"There are no garages" significa "Não tem garagens".'),
  trueFalse(l1u3l2.id, '"There is" se usa com substantivos no plural.', false, '"There is" é usado no SINGULAR. Para o plural usamos "there are".'),
]

const l1u3l3: Lesson = {
  id: 'lvl1-u3-l3',
  unitId: 'lvl1-u3',
  order: 3,
  title: 'Pedindo Direções',
  type: 'lesson',
  xpReward: 12,
  theory: {
    title: 'Perguntando o caminho',
    body: 'Para pedir e dar direções, usamos frases simples e diretas, muito úteis quando você está em uma cidade nova.',
    examples: [
      { en: 'Excuse me? Is there an ATM around here?', pt: 'Com licença? Tem um caixa eletrônico por aqui?' },
      { en: 'Go straight and turn right on Jay Street.', pt: 'Siga em frente e vire à direita na Jay Street.' },
    ],
  },
  exercises: [],
}
l1u3l3.exercises = [
  dialogue(l1u3l3.id, 'Is there an ATM around here?', [
    { id: 'a', label: 'Yeah, go straight and turn right.' },
    { id: 'b', label: 'Nice to meet you.' },
  ], 'a', 'Resposta natural para quem pergunta por um lugar.'),
  translation(l1u3l3.id, 'Traduza: "Vire à esquerda."', 'Turn left', '"Turn left" significa "vire à esquerda".'),
  fillBlank(l1u3l3.id, 'Complete: Go ___. (em frente)', 'straight', '"Go straight" significa "siga em frente".'),
  speaking(l1u3l3.id, 'Excuse me, is there a bank around here?', 'Pratique essa frase para pedir direções.'),
]

const l1u3checkpoint: Lesson = {
  id: 'lvl1-u3-checkpoint',
  unitId: 'lvl1-u3',
  order: 4,
  title: 'Revisão: Meu Bairro',
  type: 'checkpoint',
  xpReward: 18,
  exercises: [
    mc('lvl1-u3-checkpoint', 'Complete: ___ two cafes on my street.', [
      { id: 'a', label: 'There are' },
      { id: 'b', label: "There's" },
    ], 'a', '"There are" é usado no plural.'),
    fillBlank('lvl1-u3-checkpoint', 'Complete: Go ___. (em frente)', 'straight', '"Go straight" significa "siga em frente".'),
    match(
      'lvl1-u3-checkpoint',
      'Ligue a palavra à tradução.',
      [
        { id: 'p1', left: 'bank', right: 'banco' },
        { id: 'p2', left: 'park', right: 'parque' },
      ],
      'Revisão do vocabulário de bairro.',
    ),
    translation('lvl1-u3-checkpoint', 'Traduza: "Não tem garagens."', 'There are no garages', 'Estrutura: There are no + substantivo plural.'),
  ],
}

const unit3v1 = {
  id: 'lvl1-u3',
  levelId: 'lvl1',
  order: 3,
  title: 'Meu Bairro',
  objective: 'Falar sobre lugares do bairro e pedir direções',
  lessons: [l1u3l1, l1u3l2, l1u3l3, l1u3checkpoint],
}

// ---------------------------------------------------------------------------
// UNIT — Países
// ---------------------------------------------------------------------------
const l1u4l1: Lesson = {
  id: 'lvl1-u4-l1',
  unitId: 'lvl1-u4',
  order: 1,
  title: 'Países e Nacionalidades',
  type: 'lesson',
  xpReward: 12,
  theory: {
    title: 'De onde as pessoas são',
    body: 'Cada país tem uma nacionalidade correspondente, geralmente com terminações como "-an", "-ese" ou "-ish".',
    examples: [
      { en: "I'm from Brazil. I'm Brazilian.", pt: 'Eu sou do Brasil. Eu sou brasileiro(a).' },
      { en: 'She is Japanese.', pt: 'Ela é japonesa.' },
    ],
  },
  exercises: [],
}
l1u4l1.exercises = [
  match(
    l1u4l1.id,
    'Ligue o país à nacionalidade.',
    [
      { id: 'p1', left: 'China', right: 'Chinese' },
      { id: 'p2', left: 'Brazil', right: 'Brazilian' },
      { id: 'p3', left: 'Japan', right: 'Japanese' },
      { id: 'p4', left: 'Mexico', right: 'Mexican' },
      { id: 'p5', left: 'Spain', right: 'Spanish' },
    ],
    'Cada país tem uma nacionalidade correspondente.',
  ),
  mc(l1u4l1.id, 'Qual é a nacionalidade de quem nasce no Canadá?', [
    { id: 'a', label: 'Canadian' },
    { id: 'b', label: 'Canada' },
  ], 'a', '"Canadian" é a nacionalidade de quem nasce no Canadá.'),
  fillBlank(l1u4l1.id, 'Complete: She is from Portugal. She is ___.', 'Portuguese', '"Portuguese" é a nacionalidade de quem nasce em Portugal.'),
  translation(l1u4l1.id, 'Traduza: "Eu sou brasileiro(a)."', "I'm Brazilian", 'Estrutura: I\'m + nacionalidade.', ['I am Brazilian']),
]

const l1u4l2: Lesson = {
  id: 'lvl1-u4-l2',
  unitId: 'lvl1-u4',
  order: 2,
  title: 'Be + Adjetivo',
  type: 'lesson',
  xpReward: 12,
  theory: {
    title: 'Descrevendo lugares',
    body: 'Adjetivos como "big", "small", "old" e "interesting" vêm depois do verbo to be, ou antes do substantivo.',
    examples: [
      { en: 'New York is an interesting city.', pt: 'Nova York é uma cidade interessante.' },
      { en: 'The parties are fun.', pt: 'As festas são divertidas.' },
    ],
  },
  exercises: [],
}
l1u4l2.exercises = [
  mc(l1u4l2.id, 'Complete: Rio de Janeiro ___ beautiful.', [
    { id: 'a', label: 'is' },
    { id: 'b', label: 'are' },
  ], 'a', 'Com um substantivo singular usamos "is".'),
  order('lvl1-u4-l2', 'Monte a frase:', ['a', 'city', 'big', "It's"], ["It's", 'a', 'big', 'city'], '"It\'s a big city" significa "É uma cidade grande".'),
  fillBlank(l1u4l2.id, 'Complete: There are ___ neighborhoods in Los Angeles. (interessantes)', 'interesting', '"Interesting" significa interessante.'),
  trueFalse(l1u4l2.id, 'Adjetivos como "big" e "small" vêm depois do substantivo em inglês.', false, 'Em inglês, o adjetivo vem ANTES do substantivo: "a big city", não "a city big".'),
]

const l1u4l3: Lesson = {
  id: 'lvl1-u4-l3',
  unitId: 'lvl1-u4',
  order: 3,
  title: 'De Onde Você É?',
  type: 'lesson',
  xpReward: 12,
  theory: {
    title: 'Falando sobre origem',
    body: 'Para perguntar e responder sobre a origem de alguém, e descrever pelo que sua cidade é famosa.',
    examples: [
      { en: 'Where are you from?', pt: 'De onde você é?' },
      { en: 'My city is famous for its parks.', pt: 'Minha cidade é famosa por seus parques.' },
    ],
  },
  exercises: [],
}
l1u4l3.exercises = [
  dialogue(l1u4l3.id, 'Where are you from?', [
    { id: 'a', label: "I'm from Brazil." },
    { id: 'b', label: "It's a bank." },
  ], 'a', 'Resposta natural para "Where are you from?".'),
  translation(l1u4l3.id, 'Traduza: "Minha cidade é famosa por seus parques."', 'My city is famous for its parks', 'Estrutura: My city is famous for + substantivo.'),
  fillBlank(l1u4l3.id, 'Complete: Where ___ you from?', 'are', '"Where are you from?" pergunta a origem de alguém.'),
  speaking(l1u4l3.id, "I'm from Brazil. It's famous for its beaches.", 'Pratique falando sobre sua origem.'),
]

const l1u4checkpoint: Lesson = {
  id: 'lvl1-u4-checkpoint',
  unitId: 'lvl1-u4',
  order: 4,
  title: 'Revisão: Países',
  type: 'checkpoint',
  xpReward: 18,
  exercises: [
    match(
      'lvl1-u4-checkpoint',
      'Ligue o país à nacionalidade.',
      [
        { id: 'p1', left: 'China', right: 'Chinese' },
        { id: 'p2', left: 'Brazil', right: 'Brazilian' },
      ],
      'Revisão de países e nacionalidades.',
    ),
    mc('lvl1-u4-checkpoint', 'Complete: Rio de Janeiro ___ beautiful.', [
      { id: 'a', label: 'is' },
      { id: 'b', label: 'are' },
    ], 'a', 'Com substantivo singular usamos "is".'),
    translation('lvl1-u4-checkpoint', 'Traduza: "De onde você é?"', 'Where are you from', 'Pergunta usada para saber a origem de alguém.', ['Where are you from?']),
    fillBlank('lvl1-u4-checkpoint', 'Complete: She is from Portugal. She is ___.', 'Portuguese', '"Portuguese" é a nacionalidade de Portugal.'),
  ],
}

const unit4v1 = {
  id: 'lvl1-u4',
  levelId: 'lvl1',
  order: 4,
  title: 'Países',
  objective: 'Falar sobre países, nacionalidades e descrever lugares',
  lessons: [l1u4l1, l1u4l2, l1u4l3, l1u4checkpoint],
}

// ---------------------------------------------------------------------------
// UNIT — Família
// ---------------------------------------------------------------------------
const l1u5l1: Lesson = {
  id: 'lvl1-u5-l1',
  unitId: 'lvl1-u5',
  order: 1,
  title: 'Membros da Família',
  type: 'lesson',
  xpReward: 12,
  theory: {
    title: 'Vocabulário de família',
    body: 'Vamos aprender os nomes dos membros da família em inglês, muito úteis para falar sobre sua vida pessoal.',
    examples: [
      { en: 'This is my mother.', pt: 'Esta é minha mãe.' },
      { en: "He's my younger brother.", pt: 'Ele é meu irmão mais novo.' },
    ],
  },
  exercises: [],
}
l1u5l1.exercises = [
  mc(l1u5l1.id, 'O que significa "grandmother"?', [
    { id: 'a', label: 'avó', imageEmoji: '👵' },
    { id: 'b', label: 'tia' },
    { id: 'c', label: 'prima' },
  ], 'a', '"Grandmother" significa avó.'),
  match(
    l1u5l1.id,
    'Ligue a palavra à tradução.',
    [
      { id: 'p1', left: 'uncle', right: 'tio' },
      { id: 'p2', left: 'aunt', right: 'tia' },
      { id: 'p3', left: 'cousin', right: 'primo(a)' },
      { id: 'p4', left: 'parents', right: 'pais' },
    ],
    'Vocabulário de membros da família.',
  ),
  fillBlank(l1u5l1.id, 'Complete: My father\'s brother is my ___. (tio)', 'uncle', '"Uncle" significa tio.'),
  listening(l1u5l1.id, 'grandfather', [
    { id: 'a', label: 'grandfather' },
    { id: 'b', label: 'grandmother' },
  ], 'a', '"Grandfather" significa avô.'),
]

const l1u5l2: Lesson = {
  id: 'lvl1-u5-l2',
  unitId: 'lvl1-u5',
  order: 2,
  title: 'Have / Has e Números 21-100',
  type: 'lesson',
  xpReward: 12,
  theory: {
    title: 'Descrevendo a família',
    body: 'Usamos "have" com I/you/we/they e "has" com he/she/it. Números de 21 a 100: twenty-one, twenty-two... one hundred.',
    examples: [
      { en: 'I have a big family.', pt: 'Eu tenho uma família grande.' },
      { en: 'She has short hair.', pt: 'Ela tem cabelo curto.' },
    ],
  },
  exercises: [],
}
l1u5l2.exercises = [
  mc(l1u5l2.id, 'Complete: My cousin ___ long hair.', [
    { id: 'a', label: 'has' },
    { id: 'b', label: 'have' },
  ], 'a', 'Com he/she/it usamos "has".'),
  fillBlank(l1u5l2.id, 'Complete: My friends ___ a lot of free time.', 'have', 'Com "friends" (they) usamos "have".'),
  translation(l1u5l2.id, 'Traduza: "trinta e cinco"', 'thirty-five', 'Números compostos usam hífen: thirty-five.'),
  order('lvl1-u5-l2', 'Monte a frase:', ['family', 'a', 'big', 'have', 'I'], ['I', 'have', 'a', 'big', 'family'], '"I have a big family" significa "Eu tenho uma família grande".'),
]

const l1u5l3: Lesson = {
  id: 'lvl1-u5-l3',
  unitId: 'lvl1-u5',
  order: 3,
  title: 'Descrevendo Pessoas',
  type: 'lesson',
  xpReward: 12,
  theory: {
    title: 'Idade e aparência',
    body: 'Para perguntar a idade de alguém usamos "How old...?". Para dizer que alguém se parece com outra pessoa, usamos "look like".',
    examples: [
      { en: "How old is he? He's nineteen.", pt: 'Quantos anos ele tem? Ele tem dezenove.' },
      { en: 'You look like your sister.', pt: 'Você se parece com sua irmã.' },
    ],
  },
  exercises: [],
}
l1u5l3.exercises = [
  dialogue(l1u5l3.id, 'How old are you?', [
    { id: 'a', label: "I'm 21." },
    { id: 'b', label: "It's a bank." },
  ], 'a', 'Resposta natural para "How old are you?".'),
  fillBlank(l1u5l3.id, 'Complete: You look ___ your brother. (parece com)', 'like', '"Look like" significa "parecer com".'),
  translation(l1u5l3.id, 'Traduza: "Quantos anos ele tem?"', 'How old is he', 'Estrutura: How old is/are + pessoa?', ['How old is he?']),
  speaking(l1u5l3.id, "I'm twenty-one years old.", 'Pratique dizendo sua idade.'),
]

const l1u5checkpoint: Lesson = {
  id: 'lvl1-u5-checkpoint',
  unitId: 'lvl1-u5',
  order: 4,
  title: 'Revisão: Família',
  type: 'checkpoint',
  xpReward: 18,
  exercises: [
    mc('lvl1-u5-checkpoint', 'Complete: My cousin ___ long hair.', [
      { id: 'a', label: 'has' },
      { id: 'b', label: 'have' },
    ], 'a', 'Com he/she/it usamos "has".'),
    match(
      'lvl1-u5-checkpoint',
      'Ligue a palavra à tradução.',
      [
        { id: 'p1', left: 'uncle', right: 'tio' },
        { id: 'p2', left: 'cousin', right: 'primo(a)' },
      ],
      'Revisão do vocabulário de família.',
    ),
    translation('lvl1-u5-checkpoint', 'Traduza: "Quantos anos ele tem?"', 'How old is he', 'Estrutura: How old is + pessoa?', ['How old is he?']),
    fillBlank('lvl1-u5-checkpoint', 'Complete: You look ___ your brother.', 'like', '"Look like" significa "parecer com".'),
  ],
}

const unit5v1 = {
  id: 'lvl1-u5',
  levelId: 'lvl1',
  order: 5,
  title: 'Família',
  objective: 'Falar sobre a família, usar have/has e descrever pessoas',
  lessons: [l1u5l1, l1u5l2, l1u5l3, l1u5checkpoint],
}

// ---------------------------------------------------------------------------
// UNIT — Meus Favoritos
// ---------------------------------------------------------------------------
const l1u6l1: Lesson = {
  id: 'lvl1-u6-l1',
  unitId: 'lvl1-u6',
  order: 1,
  title: 'Filmes, Séries e Música',
  type: 'lesson',
  xpReward: 12,
  theory: {
    title: 'Vocabulário de entretenimento',
    body: 'Vamos aprender palavras para descrever filmes, séries e música, e falar sobre nossos favoritos.',
    examples: [
      { en: "It's a funny movie.", pt: 'É um filme engraçado.' },
      { en: "She's a pop singer.", pt: 'Ela é uma cantora pop.' },
    ],
  },
  exercises: [],
}
l1u6l1.exercises = [
  match(
    l1u6l1.id,
    'Ligue a palavra à tradução.',
    [
      { id: 'p1', left: 'funny', right: 'engraçado' },
      { id: 'p2', left: 'scary', right: 'assustador' },
      { id: 'p3', left: 'sad', right: 'triste' },
      { id: 'p4', left: 'popular', right: 'popular' },
    ],
    'Adjetivos usados para descrever filmes e séries.',
  ),
  mc(l1u6l1.id, 'Qual palavra descreve um filme de terror?', [
    { id: 'a', label: 'scary' },
    { id: 'b', label: 'funny' },
  ], 'a', '"Scary" significa assustador.'),
  fillBlank(l1u6l1.id, 'Complete: Game of Thrones is a ___ TV show. (popular)', 'popular', '"Popular" significa popular.'),
  listening(l1u6l1.id, 'rock', [
    { id: 'a', label: 'rock' },
    { id: 'b', label: 'pop' },
  ], 'a', '"Rock" é um gênero musical.'),
]

const l1u6l2: Lesson = {
  id: 'lvl1-u6-l2',
  unitId: 'lvl1-u6',
  order: 2,
  title: 'Presente Simples: Gostos',
  type: 'lesson',
  xpReward: 12,
  theory: {
    title: 'Like: gostar',
    body: 'Usamos "like" com I/you/we/they e "likes" com he/she/it. Para negar, usamos "don\'t like" ou "doesn\'t like".',
    examples: [
      { en: 'I like hip hop.', pt: 'Eu gosto de hip hop.' },
      { en: "He doesn't like it.", pt: 'Ele não gosta disso.' },
      { en: 'She likes dance music.', pt: 'Ela gosta de música dance.' },
    ],
  },
  exercises: [],
}
l1u6l2.exercises = [
  mc(l1u6l2.id, 'Complete: He ___ video games.', [
    { id: 'a', label: 'likes' },
    { id: 'b', label: 'like' },
  ], 'a', 'Com he/she/it adicionamos "-s": likes.'),
  fillBlank(l1u6l2.id, "Complete: I ___ like sad movies. (não)", "don't", 'Para negar com I/you/we/they usamos "don\'t".'),
  order('lvl1-u6-l2', 'Monte a frase:', ['music', 'pop', 'likes', 'She'], ['She', 'likes', 'pop', 'music'], '"She likes pop music" significa "Ela gosta de música pop".'),
  trueFalse(l1u6l2.id, 'Usamos "likes" com I/you/we/they.', false, '"Likes" é usado com he/she/it. Com I/you/we/they usamos "like".'),
]

const l1u6l3: Lesson = {
  id: 'lvl1-u6-l3',
  unitId: 'lvl1-u6',
  order: 3,
  title: 'Do You Like...?',
  type: 'lesson',
  xpReward: 12,
  theory: {
    title: 'Perguntando sobre gostos',
    body: 'Para perguntar se alguém gosta de algo, usamos "Do you like...?". As respostas curtas usam "do/don\'t".',
    examples: [
      { en: 'Do you like that show?', pt: 'Você gosta desse programa?' },
      { en: "Yes, I love it!", pt: 'Sim, eu adoro!' },
      { en: 'No, not really.', pt: 'Não, não muito.' },
    ],
  },
  exercises: [],
}
l1u6l3.exercises = [
  dialogue(l1u6l3.id, 'Do you like hip hop music?', [
    { id: 'a', label: 'Yeah, I love it!' },
    { id: 'b', label: "It's a bank." },
  ], 'a', 'Resposta natural para "Do you like...?".'),
  translation(l1u6l3.id, 'Traduza: "Você gosta de filmes de terror?"', 'Do you like scary movies', 'Estrutura: Do you like + substantivo?', ['Do you like scary movies?']),
  fillBlank(l1u6l3.id, 'Complete: ___ you like pop music?', 'Do', 'Perguntas com like começam com "Do" (ou "Does" para he/she/it).'),
  speaking(l1u6l3.id, "Yes, I love it! It's my favorite.", 'Pratique respondendo sobre seus gostos.'),
]

const l1u6checkpoint: Lesson = {
  id: 'lvl1-u6-checkpoint',
  unitId: 'lvl1-u6',
  order: 4,
  title: 'Revisão: Meus Favoritos',
  type: 'checkpoint',
  xpReward: 18,
  exercises: [
    mc('lvl1-u6-checkpoint', 'Complete: He ___ video games.', [
      { id: 'a', label: 'likes' },
      { id: 'b', label: 'like' },
    ], 'a', 'Com he/she/it usamos "likes".'),
    fillBlank('lvl1-u6-checkpoint', 'Complete: ___ you like pop music?', 'Do', 'Perguntas com like começam com "Do".'),
    match(
      'lvl1-u6-checkpoint',
      'Ligue a palavra à tradução.',
      [
        { id: 'p1', left: 'funny', right: 'engraçado' },
        { id: 'p2', left: 'scary', right: 'assustador' },
      ],
      'Revisão de vocabulário de entretenimento.',
    ),
    translation('lvl1-u6-checkpoint', 'Traduza: "Ela gosta de música pop."', 'She likes pop music', 'Com "she" adicionamos "-s" ao verbo: likes.'),
  ],
}

const unit6v1 = {
  id: 'lvl1-u6',
  levelId: 'lvl1',
  order: 6,
  title: 'Meus Favoritos',
  objective: 'Falar sobre filmes, música e gostos pessoais',
  lessons: [l1u6l1, l1u6l2, l1u6l3, l1u6checkpoint],
}

// ---------------------------------------------------------------------------
// UNIT — Horas
// ---------------------------------------------------------------------------
const l1u7l1: Lesson = {
  id: 'lvl1-u7-l1',
  unitId: 'lvl1-u7',
  order: 1,
  title: 'Que Horas São?',
  type: 'lesson',
  xpReward: 12,
  theory: {
    title: 'Dizendo as horas',
    body: 'Podemos dizer as horas de formas diferentes: "three o\'clock" (3 em ponto), "three thirty" (3:30) ou "a quarter to four" (15 para as 4).',
    examples: [
      { en: "It's three o'clock.", pt: 'São três horas.' },
      { en: "It's three thirty.", pt: 'São três e meia.' },
      { en: "It's a quarter to four.", pt: 'São quinze para as quatro.' },
    ],
  },
  exercises: [],
}
l1u7l1.exercises = [
  mc(l1u7l1.id, 'Como se diz 15h30 em inglês?', [
    { id: 'a', label: 'three thirty' },
    { id: 'b', label: 'three fifteen' },
  ], 'a', '"Three thirty" significa "três e meia" (3:30).'),
  fillBlank(l1u7l1.id, 'Complete: 3:45 = a quarter ___ four. (para)', 'to', '"A quarter to four" significa "quinze para as quatro".'),
  translation(l1u7l1.id, 'Traduza: "São nove horas."', "It's nine o'clock", 'Estrutura: It\'s + hora + o\'clock.'),
  listening(l1u7l1.id, "It's noon", [
    { id: 'a', label: 'noon' },
    { id: 'b', label: 'midnight' },
  ], 'a', '"Noon" significa meio-dia.'),
]

const l1u7l2: Lesson = {
  id: 'lvl1-u7-l2',
  unitId: 'lvl1-u7',
  order: 2,
  title: 'Dias da Semana e Expressões de Tempo',
  type: 'lesson',
  xpReward: 12,
  theory: {
    title: 'Days of the week',
    body: 'Os dias da semana começam com letra maiúscula em inglês. Usamos "on" antes do dia da semana e "in" antes de manhã/tarde/noite.',
    examples: [
      { en: 'I work on Saturday.', pt: 'Eu trabalho no sábado.' },
      { en: 'My English class is in the morning.', pt: 'Minha aula de inglês é de manhã.' },
    ],
  },
  exercises: [],
}
l1u7l2.exercises = [
  match(
    l1u7l2.id,
    'Ligue o dia à tradução.',
    [
      { id: 'p1', left: 'Monday', right: 'segunda-feira' },
      { id: 'p2', left: 'Saturday', right: 'sábado' },
      { id: 'p3', left: 'Sunday', right: 'domingo' },
      { id: 'p4', left: 'Friday', right: 'sexta-feira' },
    ],
    'Dias da semana em inglês.',
  ),
  fillBlank(l1u7l2.id, 'Complete: I do homework ___ Sunday. (em/no)', 'on', 'Usamos "on" antes de dias da semana.'),
  mc(l1u7l2.id, 'Qual preposição usamos com partes do dia (manhã/tarde)?', [
    { id: 'a', label: 'in' },
    { id: 'b', label: 'on' },
  ], 'a', 'Usamos "in the morning/afternoon/evening".'),
  order('lvl1-u7-l2', 'Monte a frase:', ['at', '2:15', 'is', 'class', 'Art'], ['Art', 'class', 'is', 'at', '2:15'], '"Art class is at 2:15" significa "A aula de arte é às 2:15".'),
]

const l1u7l3: Lesson = {
  id: 'lvl1-u7-l3',
  unitId: 'lvl1-u7',
  order: 3,
  title: 'Combinando um Horário',
  type: 'lesson',
  xpReward: 12,
  theory: {
    title: 'Sugerindo e marcando horários',
    body: 'Para sugerir algo, usamos "Let\'s...". Para perguntar se alguém está livre, usamos "Are you free...?".',
    examples: [
      { en: "Let's meet at 3:30.", pt: 'Vamos nos encontrar às 3:30.' },
      { en: 'Are you free tomorrow?', pt: 'Você está livre amanhã?' },
    ],
  },
  exercises: [],
}
l1u7l3.exercises = [
  dialogue(l1u7l3.id, 'Are you free at 3:00?', [
    { id: 'a', label: 'Yeah. Let\'s meet then.' },
    { id: 'b', label: "It's a bank." },
  ], 'a', 'Resposta natural para confirmar um horário.'),
  translation(l1u7l3.id, 'Traduza: "Vamos estudar às duas."', "Let's study at two", 'Estrutura: Let\'s + verbo + horário.'),
  fillBlank(l1u7l3.id, "Complete: Sorry, I ___. I have class. (não posso)", "can't", '"Can\'t" (cannot) significa "não posso".'),
  speaking(l1u7l3.id, "Let's meet at three o'clock.", 'Pratique marcando um horário.'),
]

const l1u7checkpoint: Lesson = {
  id: 'lvl1-u7-checkpoint',
  unitId: 'lvl1-u7',
  order: 4,
  title: 'Revisão: Horas',
  type: 'checkpoint',
  xpReward: 18,
  exercises: [
    mc('lvl1-u7-checkpoint', 'Como se diz 15h30?', [
      { id: 'a', label: 'three thirty' },
      { id: 'b', label: 'three fifteen' },
    ], 'a', '"Three thirty" significa 3:30.'),
    match(
      'lvl1-u7-checkpoint',
      'Ligue o dia à tradução.',
      [
        { id: 'p1', left: 'Monday', right: 'segunda-feira' },
        { id: 'p2', left: 'Sunday', right: 'domingo' },
      ],
      'Revisão dos dias da semana.',
    ),
    fillBlank('lvl1-u7-checkpoint', 'Complete: I do homework ___ Sunday.', 'on', 'Usamos "on" com dias da semana.'),
    translation('lvl1-u7-checkpoint', 'Traduza: "Você está livre amanhã?"', 'Are you free tomorrow', 'Pergunta usada para marcar um horário.', ['Are you free tomorrow?']),
  ],
}

const unit7v1 = {
  id: 'lvl1-u7',
  levelId: 'lvl1',
  order: 7,
  title: 'Horas',
  objective: 'Dizer as horas, dias da semana e marcar compromissos',
  lessons: [l1u7l1, l1u7l2, l1u7l3, l1u7checkpoint],
}

// ---------------------------------------------------------------------------
// UNIT — Dias Importantes
// ---------------------------------------------------------------------------
const l1u8l1: Lesson = {
  id: 'lvl1-u8-l1',
  unitId: 'lvl1-u8',
  order: 1,
  title: 'Meses e Datas',
  type: 'lesson',
  xpReward: 12,
  theory: {
    title: 'Months and dates',
    body: 'Os meses do ano têm letra maiúscula. Para dizer datas, usamos números ordinais: "July fourth" (quatro de julho).',
    examples: [
      { en: 'My birthday is in May.', pt: 'Meu aniversário é em maio.' },
      { en: 'My birthday is on May 12th.', pt: 'Meu aniversário é dia 12 de maio.' },
    ],
  },
  exercises: [],
}
l1u8l1.exercises = [
  match(
    l1u8l1.id,
    'Ligue o mês à tradução.',
    [
      { id: 'p1', left: 'January', right: 'janeiro' },
      { id: 'p2', left: 'July', right: 'julho' },
      { id: 'p3', left: 'December', right: 'dezembro' },
      { id: 'p4', left: 'March', right: 'março' },
    ],
    'Meses do ano em inglês.',
  ),
  fillBlank(l1u8l1.id, 'Complete: My birthday is ___ May. (em - mês)', 'in', 'Usamos "in" antes de meses.'),
  mc(l1u8l1.id, 'Como se diz "1º" (primeiro) em inglês?', [
    { id: 'a', label: 'first' },
    { id: 'b', label: 'one' },
  ], 'a', '"First" é o número ordinal de "um".'),
  translation(l1u8l1.id, 'Traduza: "quatro de julho"', 'July fourth', 'Em inglês, o mês vem antes do dia: July fourth.'),
]

const l1u8l2: Lesson = {
  id: 'lvl1-u8-l2',
  unitId: 'lvl1-u8',
  order: 2,
  title: 'Perguntas com Wh-',
  type: 'lesson',
  xpReward: 12,
  theory: {
    title: 'Revisão de perguntas',
    body: 'Revisando as principais palavras de pergunta: What (o quê), Where (onde), Who (quem), When (quando).',
    examples: [
      { en: 'When is your birthday?', pt: 'Quando é seu aniversário?' },
      { en: 'Who do you live with?', pt: 'Com quem você mora?' },
    ],
  },
  exercises: [],
}
l1u8l2.exercises = [
  order('lvl1-u8-l2', 'Monte a pergunta:', ['birthday?', 'your', 'is', 'When'], ['When', 'is', 'your', 'birthday?'], '"When is your birthday?" pergunta a data de nascimento.'),
  fillBlank(l1u8l2.id, 'Complete: ___ do you live with? (Quem)', 'Who', '"Who" significa "quem".'),
  mc(l1u8l2.id, 'Complete: ___ is the party?', [
    { id: 'a', label: 'When' },
    { id: 'b', label: 'Who' },
  ], 'a', '"When" pergunta sobre tempo/data.'),
  translation(l1u8l2.id, 'Traduza: "Onde você mora?"', 'Where do you live', 'Estrutura: Where do you + verbo?', ['Where do you live?']),
]

const l1u8l3: Lesson = {
  id: 'lvl1-u8-l3',
  unitId: 'lvl1-u8',
  order: 3,
  title: 'Comemorações',
  type: 'lesson',
  xpReward: 12,
  theory: {
    title: 'Falando sobre datas comemorativas',
    body: 'Quando não temos certeza de algo, podemos dizer "I\'m not sure" ou "I have no idea".',
    examples: [
      { en: "When is the party? It's this Saturday.", pt: 'Quando é a festa? É neste sábado.' },
      { en: "I'm not sure. Is it on Friday?", pt: 'Não tenho certeza. É na sexta?' },
    ],
  },
  exercises: [],
}
l1u8l3.exercises = [
  dialogue(l1u8l3.id, 'When is the Halloween party?', [
    { id: 'a', label: "It's on Saturday, the thirtieth." },
    { id: 'b', label: "It's a bank." },
  ], 'a', 'Resposta natural para perguntas sobre data de um evento.'),
  translation(l1u8l3.id, 'Traduza: "Não tenho certeza."', "I'm not sure", 'Expressão usada quando não temos certeza de algo.'),
  fillBlank(l1u8l3.id, 'Complete: I have no ___. (ideia)', 'idea', '"I have no idea" significa "não tenho ideia".'),
  speaking(l1u8l3.id, 'My birthday is in October.', 'Pratique falando sobre seu aniversário.'),
]

const l1u8checkpoint: Lesson = {
  id: 'lvl1-u8-checkpoint',
  unitId: 'lvl1-u8',
  order: 4,
  title: 'Revisão: Dias Importantes',
  type: 'checkpoint',
  xpReward: 18,
  exercises: [
    match(
      'lvl1-u8-checkpoint',
      'Ligue o mês à tradução.',
      [
        { id: 'p1', left: 'January', right: 'janeiro' },
        { id: 'p2', left: 'December', right: 'dezembro' },
      ],
      'Revisão dos meses do ano.',
    ),
    fillBlank('lvl1-u8-checkpoint', 'Complete: My birthday is ___ May.', 'in', 'Usamos "in" antes de meses.'),
    translation('lvl1-u8-checkpoint', 'Traduza: "Quando é seu aniversário?"', 'When is your birthday', 'Pergunta usada para saber a data de aniversário.', ['When is your birthday?']),
    mc('lvl1-u8-checkpoint', 'Como se diz "1º" em inglês?', [
      { id: 'a', label: 'first' },
      { id: 'b', label: 'one' },
    ], 'a', '"First" é o ordinal de "um".'),
  ],
}

const unit8v1 = {
  id: 'lvl1-u8',
  levelId: 'lvl1',
  order: 8,
  title: 'Dias Importantes',
  objective: 'Falar sobre meses, datas e perguntas com wh-',
  lessons: [l1u8l1, l1u8l2, l1u8l3, l1u8checkpoint],
}

// ---------------------------------------------------------------------------
// UNIT — Comida
// ---------------------------------------------------------------------------
const l1u9l1: Lesson = {
  id: 'lvl1-u9-l1',
  unitId: 'lvl1-u9',
  order: 1,
  title: 'Comidas e Bebidas',
  type: 'lesson',
  xpReward: 12,
  theory: {
    title: 'Vocabulário de comida',
    body: 'Vamos aprender o nome de comidas e bebidas comuns nas refeições do dia a dia.',
    examples: [
      { en: 'I usually eat cereal for breakfast.', pt: 'Eu geralmente como cereal no café da manhã.' },
      { en: 'This soup is delicious.', pt: 'Essa sopa está deliciosa.' },
    ],
  },
  exercises: [],
}
l1u9l1.exercises = [
  mc(l1u9l1.id, 'O que é isso?', [
    { id: 'a', label: 'pizza', imageEmoji: '🍕' },
    { id: 'b', label: 'rice', imageEmoji: '🍚' },
    { id: 'c', label: 'bread', imageEmoji: '🍞' },
  ], 'a', '"Pizza" é o mesmo em português e inglês.'),
  match(
    l1u9l1.id,
    'Ligue a palavra à tradução.',
    [
      { id: 'p1', left: 'bread', right: 'pão' },
      { id: 'p2', left: 'rice', right: 'arroz' },
      { id: 'p3', left: 'chicken', right: 'frango' },
      { id: 'p4', left: 'soup', right: 'sopa' },
    ],
    'Vocabulário básico de comidas.',
  ),
  fillBlank(l1u9l1.id, 'Complete: I eat ___ and rice for dinner. (frango)', 'chicken', '"Chicken" significa frango.'),
  listening(l1u9l1.id, 'ice cream', [
    { id: 'a', label: 'ice cream' },
    { id: 'b', label: 'pasta' },
  ], 'a', '"Ice cream" significa sorvete.'),
]

const l1u9l2: Lesson = {
  id: 'lvl1-u9-l2',
  unitId: 'lvl1-u9',
  order: 2,
  title: 'Expressões de Quantidade',
  type: 'lesson',
  xpReward: 12,
  theory: {
    title: 'A bowl of, a cup of...',
    body: 'Para falar de quantidades específicas, usamos expressões como "a bowl of" (uma tigela de), "a cup of" (uma xícara de) e "a glass of" (um copo de).',
    examples: [
      { en: 'I want a bowl of rice.', pt: 'Eu quero uma tigela de arroz.' },
      { en: 'Can I have a glass of water?', pt: 'Posso ter um copo de água?' },
    ],
  },
  exercises: [],
}
l1u9l2.exercises = [
  match(
    l1u9l2.id,
    'Ligue a expressão ao item.',
    [
      { id: 'p1', left: 'a cup of', right: 'coffee' },
      { id: 'p2', left: 'a slice of', right: 'bread' },
      { id: 'p3', left: 'a bowl of', right: 'rice' },
      { id: 'p4', left: 'a glass of', right: 'water' },
    ],
    'Expressões de quantidade combinam com tipos específicos de alimentos.',
  ),
  fillBlank(l1u9l2.id, 'Complete: I want a ___ of cake. (pedaço)', 'piece', '"A piece of cake" significa "um pedaço de bolo".'),
  mc(l1u9l2.id, 'Qual usamos para café?', [
    { id: 'a', label: 'a cup of' },
    { id: 'b', label: 'a bowl of' },
  ], 'a', 'Usamos "a cup of coffee" (uma xícara de café).'),
  order('lvl1-u9-l2', 'Monte a frase:', ['rice', 'of', 'a', 'bowl', 'want', 'I'], ['I', 'want', 'a', 'bowl', 'of', 'rice'], '"I want a bowl of rice" significa "Eu quero uma tigela de arroz".'),
]

const l1u9l3: Lesson = {
  id: 'lvl1-u9-l3',
  unitId: 'lvl1-u9',
  order: 3,
  title: 'Pedindo Comida',
  type: 'lesson',
  xpReward: 12,
  theory: {
    title: 'No restaurante',
    body: 'Frases úteis para pedir comida: "I\'d like the..." (eu gostaria de...), "Anything else?" (mais alguma coisa?) e para pagar.',
    examples: [
      { en: "I'd like the chicken sandwich, please.", pt: 'Eu gostaria do sanduíche de frango, por favor.' },
      { en: "Anything else? A bag of chips, please.", pt: 'Mais alguma coisa? Um pacote de batatas, por favor.' },
    ],
  },
  exercises: [],
}
l1u9l3.exercises = [
  dialogue(l1u9l3.id, 'Anything else?', [
    { id: 'a', label: 'Yeah, a bottle of water, please.' },
    { id: 'b', label: 'Nice to meet you.' },
  ], 'a', 'Resposta natural para "Anything else?".'),
  translation(l1u9l3.id, 'Traduza: "Eu gostaria do sanduíche de frango."', "I'd like the chicken sandwich", 'Estrutura: I\'d like the + item.', ['I would like the chicken sandwich']),
  fillBlank(l1u9l3.id, 'Complete: That\'s $6.50. Here you ___. (vai/tome)', 'go', '"Here you go" é usado ao entregar algo para alguém.'),
  speaking(l1u9l3.id, "I'd like the pizza, please.", 'Pratique pedindo comida.'),
]

const l1u9checkpoint: Lesson = {
  id: 'lvl1-u9-checkpoint',
  unitId: 'lvl1-u9',
  order: 4,
  title: 'Revisão: Comida',
  type: 'checkpoint',
  xpReward: 18,
  exercises: [
    match(
      'lvl1-u9-checkpoint',
      'Ligue a expressão ao item.',
      [
        { id: 'p1', left: 'a cup of', right: 'coffee' },
        { id: 'p2', left: 'a glass of', right: 'water' },
      ],
      'Revisão de expressões de quantidade.',
    ),
    fillBlank('lvl1-u9-checkpoint', 'Complete: I want a ___ of cake. (pedaço)', 'piece', '"A piece of cake" significa "um pedaço de bolo".'),
    translation('lvl1-u9-checkpoint', 'Traduza: "Eu gostaria do sanduíche de frango."', "I'd like the chicken sandwich", 'Estrutura: I\'d like the + item.', ['I would like the chicken sandwich']),
    mc('lvl1-u9-checkpoint', 'O que significa "chicken"?', [
      { id: 'a', label: 'frango' },
      { id: 'b', label: 'arroz' },
    ], 'a', '"Chicken" significa frango.'),
  ],
}

const l1LevelTest: Lesson = {
  id: 'lvl1-test',
  unitId: 'lvl1-u9',
  order: 5,
  title: 'Prova de Nível: Iniciante',
  type: 'level_test',
  xpReward: 35,
  exercises: [
    mc('lvl1-test', 'Complete: They ___ happy.', [
      { id: 'a', label: 'are' },
      { id: 'b', label: 'is' },
    ], 'a', 'Com "they" usamos "are".'),
    fillBlank('lvl1-test', 'Complete: There ___ two cafes on my street. (are)', 'are', '"There are" é usado no plural.'),
    translation('lvl1-test', 'Traduza: "Eu sou brasileiro(a)."', "I'm Brazilian", 'Estrutura: I\'m + nacionalidade.', ['I am Brazilian']),
    mc('lvl1-test', 'Complete: My cousin ___ long hair.', [
      { id: 'a', label: 'has' },
      { id: 'b', label: 'have' },
    ], 'a', 'Com he/she/it usamos "has".'),
    fillBlank('lvl1-test', 'Complete: ___ you like pop music? (Do)', 'Do', 'Perguntas com like começam com "Do".'),
    translation('lvl1-test', 'Traduza: "São três e meia."', "It's three thirty", 'Estrutura: It\'s + hora + minutos.'),
    order('lvl1-test', 'Monte a frase:', ['rice', 'of', 'a', 'bowl', 'want', 'I'], ['I', 'want', 'a', 'bowl', 'of', 'rice'], '"I want a bowl of rice" significa "Eu quero uma tigela de arroz".'),
    dialogue('lvl1-test', 'Anything else?', [
      { id: 'a', label: 'Yeah, a bottle of water, please.' },
      { id: 'b', label: 'Nice to meet you.' },
    ], 'a', 'Resposta natural para "Anything else?".'),
  ],
}

const unit9v1 = {
  id: 'lvl1-u9',
  levelId: 'lvl1',
  order: 9,
  title: 'Comida',
  objective: 'Falar sobre comidas, quantidades e pedir em um restaurante',
  lessons: [l1u9l1, l1u9l2, l1u9l3, l1u9checkpoint, l1LevelTest],
}

const level1: Level = {
  id: 'lvl1',
  order: 1,
  code: 'A1',
  title: 'Iniciante',
  description: 'Verbo to be, rotina diária, bairro, países, família, favoritos, horas, datas e comida.',
  units: [unit1v1, unit2v1, unit3v1, unit4v1, unit5v1, unit6v1, unit7v1, unit8v1, unit9v1],
}

// ---------------------------------------------------------------------------
// NÍVEL 2 — Básico (A2) — conteúdo original, além do escopo do livro-base
// ---------------------------------------------------------------------------

// UNIT — Passado Simples: Verbo To Be
const l2u1l1: Lesson = {
  id: 'lvl2-u1-l1',
  unitId: 'lvl2-u1',
  order: 1,
  title: 'Was / Were',
  type: 'lesson',
  xpReward: 14,
  theory: {
    title: 'O verbo to be no passado',
    body: 'No passado, o verbo to be tem duas formas: "was" (para I/he/she/it) e "were" (para you/we/they).',
    examples: [
      { en: 'I was tired.', pt: 'Eu estava cansado(a).' },
      { en: 'They were at home.', pt: 'Eles estavam em casa.' },
    ],
  },
  exercises: [],
}
l2u1l1.exercises = [
  mc(l2u1l1.id, 'Complete: She ___ happy yesterday.', [
    { id: 'a', label: 'was' },
    { id: 'b', label: 'were' },
  ], 'a', 'Com he/she/it usamos "was".'),
  fillBlank(l2u1l1.id, 'Complete: We ___ at the party. (estávamos)', 'were', 'Com "we" usamos "were".'),
  match(
    l2u1l1.id,
    'Ligue o pronome à forma correta.',
    [
      { id: 'p1', left: 'I', right: 'was' },
      { id: 'p2', left: 'you', right: 'were' },
      { id: 'p3', left: 'they', right: 'were' },
    ],
    'Was para I/he/she/it, were para you/we/they.',
  ),
  translation(l2u1l1.id, 'Traduza: "Eu estava cansado(a)."', 'I was tired', 'Estrutura: I + was + adjetivo.'),
]

const l2u1l2: Lesson = {
  id: 'lvl2-u1-l2',
  unitId: 'lvl2-u1',
  order: 2,
  title: 'Negativas e Perguntas com Was/Were',
  type: 'lesson',
  xpReward: 14,
  theory: {
    title: 'Negando e perguntando no passado',
    body: 'Para negar, usamos "wasn\'t" ou "weren\'t". Para perguntar, invertemos was/were com o sujeito.',
    examples: [
      { en: "I wasn't at home.", pt: 'Eu não estava em casa.' },
      { en: 'Were you at the party?', pt: 'Você estava na festa?' },
    ],
  },
  exercises: [],
}
l2u1l2.exercises = [
  fillBlank(l2u1l2.id, "Complete: I ___ at home. (não estava)", "wasn't", '"Wasn\'t" é a forma negativa de "was".'),
  order('lvl2-u1-l2', 'Monte a pergunta:', ['the', 'you', 'party?', 'Were', 'at'], ['Were', 'you', 'at', 'the', 'party?'], 'Para perguntar, invertemos "were" com o sujeito.'),
  dialogue(l2u1l2.id, 'Were you at the party?', [
    { id: 'a', label: 'Yes, I was.' },
    { id: 'b', label: 'Yes, I am.' },
  ], 'a', 'Respondemos perguntas no passado repetindo was/were.'),
  trueFalse(l2u1l2.id, '"Weren\'t" é a forma negativa de "were".', true, '"Weren\'t" (were not) é usado para negar com you/we/they.'),
]

const l2u1l3: Lesson = {
  id: 'lvl2-u1-l3',
  unitId: 'lvl2-u1',
  order: 3,
  title: 'Ontem, Semana Passada...',
  type: 'lesson',
  xpReward: 14,
  theory: {
    title: 'Expressões de tempo no passado',
    body: 'Palavras como "yesterday" (ontem), "last night/week/year" (ontem à noite/semana passada/ano passado) e "ago" (atrás) marcam o passado.',
    examples: [
      { en: 'I was busy yesterday.', pt: 'Eu estava ocupado(a) ontem.' },
      { en: 'We were on vacation last week.', pt: 'Nós estávamos de férias na semana passada.' },
    ],
  },
  exercises: [],
}
l2u1l3.exercises = [
  mc(l2u1l3.id, 'Complete: We were on vacation ___ week.', [
    { id: 'a', label: 'last' },
    { id: 'b', label: 'next' },
  ], 'a', '"Last week" significa "semana passada".'),
  fillBlank(l2u1l3.id, 'Complete: I was busy ___. (ontem)', 'yesterday', '"Yesterday" significa "ontem".'),
  translation(l2u1l3.id, 'Traduza: "Eles estavam em casa ontem à noite."', 'They were at home last night', 'Estrutura: sujeito + were + last night.'),
  speaking(l2u1l3.id, 'I was busy yesterday.', 'Pratique essa frase sobre o passado.'),
]

const l2u1checkpoint: Lesson = {
  id: 'lvl2-u1-checkpoint',
  unitId: 'lvl2-u1',
  order: 4,
  title: 'Revisão: Was / Were',
  type: 'checkpoint',
  xpReward: 20,
  exercises: [
    mc('lvl2-u1-checkpoint', 'Complete: They ___ at home.', [
      { id: 'a', label: 'were' },
      { id: 'b', label: 'was' },
    ], 'a', 'Com "they" usamos "were".'),
    fillBlank('lvl2-u1-checkpoint', "Complete: I ___ at home. (não estava)", "wasn't", '"Wasn\'t" nega "was".'),
    translation('lvl2-u1-checkpoint', 'Traduza: "Eu estava cansado(a)."', 'I was tired', 'Estrutura: I + was + adjetivo.'),
    dialogue('lvl2-u1-checkpoint', 'Were you at the party?', [
      { id: 'a', label: 'Yes, I was.' },
      { id: 'b', label: 'Yes, I do.' },
    ], 'a', 'Respondemos repetindo was/were.'),
  ],
}

const unit1v2 = {
  id: 'lvl2-u1',
  levelId: 'lvl2',
  order: 1,
  title: 'Passado Simples: Verbo To Be',
  objective: 'Descrever estados e situações no passado com was/were',
  lessons: [l2u1l1, l2u1l2, l2u1l3, l2u1checkpoint],
}

// UNIT — Passado Simples: Verbos Regulares e Irregulares
const l2u2l1: Lesson = {
  id: 'lvl2-u2-l1',
  unitId: 'lvl2-u2',
  order: 1,
  title: 'Verbos Regulares (-ed)',
  type: 'lesson',
  xpReward: 14,
  theory: {
    title: 'Formando o passado regular',
    body: 'A maioria dos verbos forma o passado adicionando "-ed": watch → watched, play → played. Verbos terminados em "y" (com consoante antes) mudam para "-ied": study → studied.',
    examples: [
      { en: 'I watched a movie.', pt: 'Eu assisti a um filme.' },
      { en: 'She studied English yesterday.', pt: 'Ela estudou inglês ontem.' },
    ],
  },
  exercises: [],
}
l2u2l1.exercises = [
  mc(l2u2l1.id, 'Qual é o passado de "watch"?', [
    { id: 'a', label: 'watched' },
    { id: 'b', label: 'watchs' },
  ], 'a', 'Verbos terminados em "ch" recebem "-ed": watched.'),
  fillBlank(l2u2l1.id, 'Complete: She ___ English yesterday. (estudou)', 'studied', '"Study" termina em consoante+y: muda para "studied".'),
  order('lvl2-u2-l1', 'Monte a frase:', ['a', 'watched', 'movie', 'I'], ['I', 'watched', 'a', 'movie'], '"I watched a movie" significa "Eu assisti a um filme".'),
  translation(l2u2l1.id, 'Traduza: "Eu trabalhei ontem."', 'I worked yesterday', '"Work" no passado: worked.'),
]

const l2u2l2: Lesson = {
  id: 'lvl2-u2-l2',
  unitId: 'lvl2-u2',
  order: 2,
  title: 'Verbos Irregulares Comuns',
  type: 'lesson',
  xpReward: 14,
  theory: {
    title: 'Verbos que não seguem a regra',
    body: 'Alguns verbos muito usados têm formas de passado irregulares e precisam ser memorizados: go → went, have → had, eat → ate, see → saw, do → did.',
    examples: [
      { en: 'I went to the party.', pt: 'Eu fui à festa.' },
      { en: 'She had a great day.', pt: 'Ela teve um ótimo dia.' },
    ],
  },
  exercises: [],
}
l2u2l2.exercises = [
  match(
    l2u2l2.id,
    'Ligue o verbo ao seu passado.',
    [
      { id: 'p1', left: 'go', right: 'went' },
      { id: 'p2', left: 'have', right: 'had' },
      { id: 'p3', left: 'eat', right: 'ate' },
      { id: 'p4', left: 'see', right: 'saw' },
      { id: 'p5', left: 'do', right: 'did' },
    ],
    'Verbos irregulares têm formas de passado que não seguem a regra do "-ed".',
  ),
  mc(l2u2l2.id, 'Qual é o passado de "go"?', [
    { id: 'a', label: 'went' },
    { id: 'b', label: 'goed' },
  ], 'a', '"Go" é irregular: went.'),
  fillBlank(l2u2l2.id, 'Complete: I ___ a great day. (tive)', 'had', '"Have" no passado é "had".'),
  translation(l2u2l2.id, 'Traduza: "Eu fui à festa."', 'I went to the party', '"Go" no passado é "went".'),
]

const l2u2l3: Lesson = {
  id: 'lvl2-u2-l3',
  unitId: 'lvl2-u2',
  order: 3,
  title: 'Perguntas e Negativas no Passado',
  type: 'lesson',
  xpReward: 14,
  theory: {
    title: 'Did / Didn\'t',
    body: 'Para perguntas e negativas no passado simples, usamos "did/didn\'t" + o verbo na forma base (sem -ed).',
    examples: [
      { en: 'Did you go to the party?', pt: 'Você foi à festa?' },
      { en: "I didn't watch TV.", pt: 'Eu não assisti TV.' },
    ],
  },
  exercises: [],
}
l2u2l3.exercises = [
  order('lvl2-u2-l3', 'Monte a pergunta:', ['you', 'the', 'party?', 'go', 'to', 'Did'], ['Did', 'you', 'go', 'to', 'the', 'party?'], 'Perguntas no passado: Did + sujeito + verbo na forma base.'),
  fillBlank(l2u2l3.id, "Complete: I ___ watch TV. (não assisti)", "didn't", '"Didn\'t" + verbo na forma base para negar no passado.'),
  dialogue(l2u2l3.id, 'Did you go to the party?', [
    { id: 'a', label: 'Yes, I did.' },
    { id: 'b', label: 'Yes, I go.' },
  ], 'a', 'Respondemos perguntas com "did" repetindo "did".'),
  trueFalse(l2u2l3.id, 'Depois de "did", o verbo fica na forma base, sem -ed.', true, 'Correto: "Did you watch..." e não "Did you watched...".'),
]

const l2u2checkpoint: Lesson = {
  id: 'lvl2-u2-checkpoint',
  unitId: 'lvl2-u2',
  order: 4,
  title: 'Revisão: Passado Simples',
  type: 'checkpoint',
  xpReward: 20,
  exercises: [
    mc('lvl2-u2-checkpoint', 'Qual é o passado de "go"?', [
      { id: 'a', label: 'went' },
      { id: 'b', label: 'goed' },
    ], 'a', '"Go" é irregular: went.'),
    fillBlank('lvl2-u2-checkpoint', 'Complete: She ___ English yesterday. (estudou)', 'studied', '"Study" muda para "studied".'),
    match(
      'lvl2-u2-checkpoint',
      'Ligue o verbo ao passado.',
      [
        { id: 'p1', left: 'have', right: 'had' },
        { id: 'p2', left: 'see', right: 'saw' },
      ],
      'Revisão de verbos irregulares.',
    ),
    translation('lvl2-u2-checkpoint', 'Traduza: "Eu não assisti TV."', "I didn't watch TV", '"Didn\'t" + verbo na forma base.'),
  ],
}

const unit2v2 = {
  id: 'lvl2-u2',
  levelId: 'lvl2',
  order: 2,
  title: 'Passado Simples: Verbos Regulares e Irregulares',
  objective: 'Falar sobre ações passadas com verbos regulares e irregulares',
  lessons: [l2u2l1, l2u2l2, l2u2l3, l2u2checkpoint],
}

// UNIT — Comparativos e Superlativos
const l2u3l1: Lesson = {
  id: 'lvl2-u3-l1',
  unitId: 'lvl2-u3',
  order: 1,
  title: 'Comparativos: -er e more',
  type: 'lesson',
  xpReward: 14,
  theory: {
    title: 'Comparando coisas',
    body: 'Adjetivos curtos recebem "-er": big → bigger. Adjetivos longos usam "more" antes: expensive → more expensive. Usamos "than" para comparar.',
    examples: [
      { en: 'This car is bigger than that one.', pt: 'Este carro é maior que aquele.' },
      { en: 'This hotel is more expensive than that one.', pt: 'Este hotel é mais caro que aquele.' },
    ],
  },
  exercises: [],
}
l2u3l1.exercises = [
  mc(l2u3l1.id, 'Qual é o comparativo de "big"?', [
    { id: 'a', label: 'bigger' },
    { id: 'b', label: 'more big' },
  ], 'a', 'Adjetivos curtos como "big" recebem "-er".'),
  fillBlank(l2u3l1.id, 'Complete: This hotel is ___ expensive than that one. (mais)', 'more', 'Adjetivos longos usam "more" antes.'),
  order('lvl2-u3-l1', 'Monte a frase:', ['than', 'is', 'bigger', 'car', 'This', 'that'], ['This', 'car', 'is', 'bigger', 'than', 'that'], 'Estrutura: adjetivo+er + than + comparação.'),
  translation(l2u3l1.id, 'Traduza: "Esta casa é menor que aquela."', 'This house is smaller than that one', '"Small" no comparativo: smaller.'),
]

const l2u3l2: Lesson = {
  id: 'lvl2-u3-l2',
  unitId: 'lvl2-u3',
  order: 2,
  title: 'Superlativos: the -est e the most',
  type: 'lesson',
  xpReward: 14,
  theory: {
    title: 'O melhor, o maior...',
    body: 'Para o superlativo, adjetivos curtos recebem "the -est": big → the biggest. Adjetivos longos usam "the most": expensive → the most expensive.',
    examples: [
      { en: 'This is the biggest city in Brazil.', pt: 'Esta é a maior cidade do Brasil.' },
      { en: 'It’s the most expensive restaurant in town.', pt: 'É o restaurante mais caro da cidade.' },
    ],
  },
  exercises: [],
}
l2u3l2.exercises = [
  match(
    l2u3l2.id,
    'Ligue o adjetivo ao superlativo.',
    [
      { id: 'p1', left: 'big', right: 'the biggest' },
      { id: 'p2', left: 'small', right: 'the smallest' },
      { id: 'p3', left: 'expensive', right: 'the most expensive' },
      { id: 'p4', left: 'beautiful', right: 'the most beautiful' },
    ],
    'Adjetivos curtos: the -est. Adjetivos longos: the most.',
  ),
  mc(l2u3l2.id, 'Qual é o superlativo de "expensive"?', [
    { id: 'a', label: 'the most expensive' },
    { id: 'b', label: 'the expensivest' },
  ], 'a', 'Adjetivos longos usam "the most" no superlativo.'),
  fillBlank(l2u3l2.id, 'Complete: This is ___ biggest city in Brazil. (a)', 'the', 'O superlativo sempre vem com "the" antes.'),
  translation(l2u3l2.id, 'Traduza: "É a cidade mais bonita do país."', "It's the most beautiful city in the country", 'Adjetivo longo: the most beautiful.'),
]

const l2u3checkpoint: Lesson = {
  id: 'lvl2-u3-checkpoint',
  unitId: 'lvl2-u3',
  order: 3,
  title: 'Revisão: Comparativos e Superlativos',
  type: 'checkpoint',
  xpReward: 18,
  exercises: [
    mc('lvl2-u3-checkpoint', 'Qual é o comparativo de "big"?', [
      { id: 'a', label: 'bigger' },
      { id: 'b', label: 'more big' },
    ], 'a', 'Adjetivos curtos recebem "-er".'),
    fillBlank('lvl2-u3-checkpoint', 'Complete: This is ___ biggest city. (a)', 'the', 'O superlativo vem com "the".'),
    match(
      'lvl2-u3-checkpoint',
      'Ligue o adjetivo ao superlativo.',
      [
        { id: 'p1', left: 'small', right: 'the smallest' },
        { id: 'p2', left: 'expensive', right: 'the most expensive' },
      ],
      'Revisão de comparativos e superlativos.',
    ),
    translation('lvl2-u3-checkpoint', 'Traduza: "Este carro é maior que aquele."', 'This car is bigger than that one', 'Comparativo curto: bigger than.'),
  ],
}

const unit3v2 = {
  id: 'lvl2-u3',
  levelId: 'lvl2',
  order: 3,
  title: 'Comparativos e Superlativos',
  objective: 'Comparar pessoas, lugares e coisas',
  lessons: [l2u3l1, l2u3l2, l2u3checkpoint],
}

// UNIT — Futuro: Going to e Will
const l2u4l1: Lesson = {
  id: 'lvl2-u4-l1',
  unitId: 'lvl2-u4',
  order: 1,
  title: 'Be Going To',
  type: 'lesson',
  xpReward: 14,
  theory: {
    title: 'Planos para o futuro',
    body: 'Usamos "be going to" + verbo para falar sobre planos já decididos: am/is/are + going to + verbo na forma base.',
    examples: [
      { en: "I'm going to travel next month.", pt: 'Eu vou viajar no mês que vem.' },
      { en: 'She is going to study abroad.', pt: 'Ela vai estudar fora.' },
    ],
  },
  exercises: [],
}
l2u4l1.exercises = [
  mc(l2u4l1.id, 'Complete: She ___ going to study abroad.', [
    { id: 'a', label: 'is' },
    { id: 'b', label: 'are' },
  ], 'a', 'Com "she" usamos "is".'),
  fillBlank(l2u4l1.id, 'Complete: I\'m ___ to travel next month. (indo)', 'going', 'Estrutura: am/is/are + going to + verbo.'),
  order('lvl2-u4-l1', 'Monte a frase:', ['travel', 'going', 'to', "I'm", 'tomorrow'], ["I'm", 'going', 'to', 'travel', 'tomorrow'], '"I\'m going to travel tomorrow" descreve um plano.'),
  translation(l2u4l1.id, 'Traduza: "Nós vamos viajar amanhã."', "We're going to travel tomorrow", 'Estrutura: We\'re going to + verbo.', ['We are going to travel tomorrow']),
]

const l2u4l2: Lesson = {
  id: 'lvl2-u4-l2',
  unitId: 'lvl2-u4',
  order: 2,
  title: 'Will',
  type: 'lesson',
  xpReward: 14,
  theory: {
    title: 'Previsões e decisões rápidas',
    body: '"Will" + verbo na forma base é usado para previsões e decisões tomadas na hora. A forma negativa é "won\'t".',
    examples: [
      { en: 'It will rain tomorrow.', pt: 'Vai chover amanhã.' },
      { en: "I'll help you.", pt: 'Eu vou te ajudar.' },
    ],
  },
  exercises: [],
}
l2u4l2.exercises = [
  mc(l2u4l2.id, 'Qual é a contração de "will not"?', [
    { id: 'a', label: "won't" },
    { id: 'b', label: "willn't" },
  ], 'a', '"Won\'t" é a contração de "will not".'),
  fillBlank(l2u4l2.id, 'Complete: It ___ rain tomorrow. (vai)', 'will', '"Will" + verbo para previsões.'),
  dialogue(l2u4l2.id, 'Can you help me?', [
    { id: 'a', label: "Sure, I'll help you." },
    { id: 'b', label: 'Nice to meet you.' },
  ], 'a', '"I\'ll help you" é uma decisão espontânea.'),
  translation(l2u4l2.id, 'Traduza: "Vai chover amanhã."', 'It will rain tomorrow', 'Estrutura: It will + verbo.'),
]

const l2u4checkpoint: Lesson = {
  id: 'lvl2-u4-checkpoint',
  unitId: 'lvl2-u4',
  order: 3,
  title: 'Revisão: Futuro',
  type: 'checkpoint',
  xpReward: 18,
  exercises: [
    mc('lvl2-u4-checkpoint', 'Complete: She ___ going to study abroad.', [
      { id: 'a', label: 'is' },
      { id: 'b', label: 'are' },
    ], 'a', 'Com "she" usamos "is".'),
    fillBlank('lvl2-u4-checkpoint', 'Complete: It ___ rain tomorrow. (vai)', 'will', '"Will" + verbo para previsões.'),
    translation('lvl2-u4-checkpoint', 'Traduza: "Eu vou te ajudar."', "I'll help you", 'Decisão espontânea com "will".', ['I will help you']),
    mc('lvl2-u4-checkpoint', 'Qual é a contração de "will not"?', [
      { id: 'a', label: "won't" },
      { id: 'b', label: "willn't" },
    ], 'a', '"Won\'t" é a contração correta.'),
  ],
}

const unit4v2 = {
  id: 'lvl2-u4',
  levelId: 'lvl2',
  order: 4,
  title: 'Futuro: Going to e Will',
  objective: 'Falar sobre planos, previsões e decisões futuras',
  lessons: [l2u4l1, l2u4l2, l2u4checkpoint],
}

// UNIT — Viagens
const l2u5l1: Lesson = {
  id: 'lvl2-u5-l1',
  unitId: 'lvl2-u5',
  order: 1,
  title: 'No Aeroporto',
  type: 'lesson',
  xpReward: 14,
  theory: {
    title: 'Vocabulário de viagem',
    body: 'Palavras essenciais para se virar em um aeroporto: airport (aeroporto), flight (voo), passport (passaporte), luggage (bagagem), gate (portão de embarque).',
    examples: [
      { en: "Where is the gate?", pt: 'Onde fica o portão de embarque?' },
      { en: 'My flight is at 9 am.', pt: 'Meu voo é às 9h.' },
    ],
  },
  exercises: [],
}
l2u5l1.exercises = [
  mc(l2u5l1.id, 'O que significa "passport"?', [
    { id: 'a', label: 'passaporte', imageEmoji: '🛂' },
    { id: 'b', label: 'bagagem' },
  ], 'a', '"Passport" significa passaporte.'),
  match(
    l2u5l1.id,
    'Ligue a palavra à tradução.',
    [
      { id: 'p1', left: 'flight', right: 'voo' },
      { id: 'p2', left: 'luggage', right: 'bagagem' },
      { id: 'p3', left: 'gate', right: 'portão de embarque' },
      { id: 'p4', left: 'ticket', right: 'passagem' },
    ],
    'Vocabulário de aeroporto.',
  ),
  fillBlank(l2u5l1.id, 'Complete: My ___ is at 9 am. (voo)', 'flight', '"Flight" significa voo.'),
  listening(l2u5l1.id, 'Where is the gate?', [
    { id: 'a', label: 'Where is the gate?' },
    { id: 'b', label: 'Where is the hotel?' },
  ], 'a', '"Gate" significa portão de embarque.'),
]

const l2u5l2: Lesson = {
  id: 'lvl2-u5-l2',
  unitId: 'lvl2-u5',
  order: 2,
  title: 'No Hotel',
  type: 'lesson',
  xpReward: 14,
  theory: {
    title: 'Check-in no hotel',
    body: 'Frases úteis para se hospedar em um hotel: reservation (reserva), check-in, check-out, room (quarto).',
    examples: [
      { en: 'I have a reservation.', pt: 'Eu tenho uma reserva.' },
      { en: 'What time is check-out?', pt: 'Que horas é o check-out?' },
    ],
  },
  exercises: [],
}
l2u5l2.exercises = [
  dialogue(l2u5l2.id, 'Do you have a reservation?', [
    { id: 'a', label: 'Yes, I have a reservation.' },
    { id: 'b', label: "It's a bank." },
  ], 'a', 'Resposta natural ao chegar em um hotel.'),
  fillBlank(l2u5l2.id, 'Complete: What time is ___? (saída)', 'check-out', '"Check-out" é o horário de saída do hotel.'),
  translation(l2u5l2.id, 'Traduza: "Eu tenho uma reserva."', 'I have a reservation', '"Reservation" significa reserva.'),
  speaking(l2u5l2.id, 'I have a reservation for two nights.', 'Pratique fazendo check-in em um hotel.'),
]

const l2u5checkpoint: Lesson = {
  id: 'lvl2-u5-checkpoint',
  unitId: 'lvl2-u5',
  order: 3,
  title: 'Revisão: Viagens',
  type: 'checkpoint',
  xpReward: 18,
  exercises: [
    mc('lvl2-u5-checkpoint', 'O que significa "passport"?', [
      { id: 'a', label: 'passaporte' },
      { id: 'b', label: 'bagagem' },
    ], 'a', '"Passport" significa passaporte.'),
    fillBlank('lvl2-u5-checkpoint', 'Complete: My ___ is at 9 am. (voo)', 'flight', '"Flight" significa voo.'),
    match(
      'lvl2-u5-checkpoint',
      'Ligue a palavra à tradução.',
      [
        { id: 'p1', left: 'luggage', right: 'bagagem' },
        { id: 'p2', left: 'gate', right: 'portão de embarque' },
      ],
      'Revisão de vocabulário de viagem.',
    ),
    translation('lvl2-u5-checkpoint', 'Traduza: "Eu tenho uma reserva."', 'I have a reservation', '"Reservation" significa reserva.'),
  ],
}

const unit5v2 = {
  id: 'lvl2-u5',
  levelId: 'lvl2',
  order: 5,
  title: 'Viagens',
  objective: 'Se comunicar em aeroportos e hotéis',
  lessons: [l2u5l1, l2u5l2, l2u5checkpoint],
}

// UNIT — Compras
const l2u6l1: Lesson = {
  id: 'lvl2-u6-l1',
  unitId: 'lvl2-u6',
  order: 1,
  title: 'Roupas e Tamanhos',
  type: 'lesson',
  xpReward: 14,
  theory: {
    title: 'Vocabulário de roupas',
    body: 'Palavras para peças de roupa e tamanhos: shirt (camisa), pants (calça), dress (vestido), shoes (sapatos), small/medium/large (P/M/G).',
    examples: [
      { en: 'Do you have this in medium?', pt: 'Você tem isso no tamanho médio?' },
      { en: 'I like this dress.', pt: 'Eu gosto deste vestido.' },
    ],
  },
  exercises: [],
}
l2u6l1.exercises = [
  mc(l2u6l1.id, 'O que é isso?', [
    { id: 'a', label: 'shoes', imageEmoji: '👟' },
    { id: 'b', label: 'shirt', imageEmoji: '👕' },
  ], 'a', '"Shoes" significa sapatos.'),
  match(
    l2u6l1.id,
    'Ligue a palavra à tradução.',
    [
      { id: 'p1', left: 'shirt', right: 'camisa' },
      { id: 'p2', left: 'pants', right: 'calça' },
      { id: 'p3', left: 'dress', right: 'vestido' },
      { id: 'p4', left: 'size', right: 'tamanho' },
    ],
    'Vocabulário de roupas e tamanhos.',
  ),
  fillBlank(l2u6l1.id, 'Complete: Do you have this in ___? (médio)', 'medium', '"Medium" significa médio (M).'),
  listening(l2u6l1.id, 'I like this dress', [
    { id: 'a', label: 'I like this dress' },
    { id: 'b', label: 'I like this shirt' },
  ], 'a', '"Dress" significa vestido.'),
]

const l2u6l2: Lesson = {
  id: 'lvl2-u6-l2',
  unitId: 'lvl2-u6',
  order: 2,
  title: 'Na Loja',
  type: 'lesson',
  xpReward: 14,
  theory: {
    title: 'Comprando em uma loja',
    body: 'Frases úteis para comprar: "How much is this?" (Quanto custa isso?), "Can I try it on?" (Posso experimentar?), "I\'ll take it" (Vou levar).',
    examples: [
      { en: 'How much is this shirt?', pt: 'Quanto custa esta camisa?' },
      { en: "Can I try it on?", pt: 'Posso experimentar?' },
    ],
  },
  exercises: [],
}
l2u6l2.exercises = [
  dialogue(l2u6l2.id, 'How much is this shirt?', [
    { id: 'a', label: "It's $25." },
    { id: 'b', label: 'Nice to meet you.' },
  ], 'a', 'Resposta natural para perguntas de preço.'),
  translation(l2u6l2.id, 'Traduza: "Posso experimentar?"', 'Can I try it on', 'Frase usada em provadores de loja.', ['Can I try it on?']),
  fillBlank(l2u6l2.id, 'Complete: I\'ll ___ it. (levar)', 'take', '"I\'ll take it" significa "vou levar".'),
  speaking(l2u6l2.id, "How much is this shirt?", 'Pratique perguntando o preço de um produto.'),
]

const l2u6checkpoint: Lesson = {
  id: 'lvl2-u6-checkpoint',
  unitId: 'lvl2-u6',
  order: 3,
  title: 'Revisão: Compras',
  type: 'checkpoint',
  xpReward: 18,
  exercises: [
    mc('lvl2-u6-checkpoint', 'O que significa "size"?', [
      { id: 'a', label: 'tamanho' },
      { id: 'b', label: 'cor' },
    ], 'a', '"Size" significa tamanho.'),
    fillBlank('lvl2-u6-checkpoint', 'Complete: I\'ll ___ it. (levar)', 'take', '"I\'ll take it" significa "vou levar".'),
    translation('lvl2-u6-checkpoint', 'Traduza: "Posso experimentar?"', 'Can I try it on', 'Frase usada em provadores.', ['Can I try it on?']),
    match(
      'lvl2-u6-checkpoint',
      'Ligue a palavra à tradução.',
      [
        { id: 'p1', left: 'shirt', right: 'camisa' },
        { id: 'p2', left: 'dress', right: 'vestido' },
      ],
      'Revisão de vocabulário de roupas.',
    ),
  ],
}

const l2LevelTest: Lesson = {
  id: 'lvl2-test',
  unitId: 'lvl2-u6',
  order: 4,
  title: 'Prova de Nível: Básico',
  type: 'level_test',
  xpReward: 40,
  exercises: [
    mc('lvl2-test', 'Complete: They ___ at home yesterday.', [
      { id: 'a', label: 'were' },
      { id: 'b', label: 'was' },
    ], 'a', 'Com "they" usamos "were".'),
    fillBlank('lvl2-test', 'Complete: I ___ watch TV. (não assisti)', "didn't", '"Didn\'t" + verbo na forma base.'),
    translation('lvl2-test', 'Traduza: "Eu fui à festa."', 'I went to the party', '"Go" no passado é "went".'),
    mc('lvl2-test', 'Qual é o comparativo de "big"?', [
      { id: 'a', label: 'bigger' },
      { id: 'b', label: 'more big' },
    ], 'a', 'Adjetivos curtos recebem "-er".'),
    fillBlank('lvl2-test', 'Complete: It ___ rain tomorrow. (vai)', 'will', '"Will" + verbo para previsões.'),
    translation('lvl2-test', 'Traduza: "Eu tenho uma reserva."', 'I have a reservation', '"Reservation" significa reserva.'),
    dialogue('lvl2-test', 'How much is this shirt?', [
      { id: 'a', label: "It's $25." },
      { id: 'b', label: 'Nice to meet you.' },
    ], 'a', 'Resposta natural para perguntas de preço.'),
  ],
}

const unit6v2 = {
  id: 'lvl2-u6',
  levelId: 'lvl2',
  order: 6,
  title: 'Compras',
  objective: 'Comprar roupas e negociar preços em inglês',
  lessons: [l2u6l1, l2u6l2, l2u6checkpoint, l2LevelTest],
}

const level2: Level = {
  id: 'lvl2',
  order: 2,
  code: 'A2',
  title: 'Básico',
  description: 'Passado simples, comparativos, futuro, viagens e compras.',
  units: [unit1v2, unit2v2, unit3v2, unit4v2, unit5v2, unit6v2],
}

const level3: Level = {
  id: 'lvl3',
  order: 3,
  code: 'B1',
  title: 'Pré-intermediário',
  description: 'Presente perfeito, condicionais, phrasal verbs e trabalho. (em construção)',
  units: [],
}

const level4: Level = {
  id: 'lvl4',
  order: 4,
  code: 'B2',
  title: 'Intermediário',
  description: 'Conversação fluida, expressões idiomáticas e listening avançado. (em construção)',
  units: [],
}

export const COURSE: Level[] = [level0, level1, level2, level3, level4]
