export interface ShopItem {
  id: string
  name: string
  description: string
  cost: number
  emoji: string
  kind: 'avatar' | 'streak_freeze' | 'heart_refill'
}

export const SHOP_ITEMS: ShopItem[] = [
  // Itens funcionais
  { id: 'freeze-1', name: 'Congelador de Sequência', description: 'Protege sua sequência por 1 dia perdido.', cost: 200, emoji: '🧊', kind: 'streak_freeze' },
  { id: 'freeze-3', name: 'Pacote de Congeladores', description: '3 congeladores de sequência de uma vez, com desconto.', cost: 500, emoji: '🧊', kind: 'streak_freeze' },
  { id: 'refill-1', name: 'Recarga de Corações', description: 'Enche seus corações na hora.', cost: 150, emoji: '❤️‍🩹', kind: 'heart_refill' },

  // Avatares — animais
  { id: 'avatar-fox', name: 'Avatar Raposa', description: 'Um avatar esperto para o seu perfil.', cost: 100, emoji: '🦊', kind: 'avatar' },
  { id: 'avatar-owl', name: 'Avatar Coruja', description: 'Sabedoria para sua jornada no inglês.', cost: 100, emoji: '🦉', kind: 'avatar' },
  { id: 'avatar-koala', name: 'Avatar Coala', description: 'Tranquilidade para estudar todo dia.', cost: 100, emoji: '🐨', kind: 'avatar' },
  { id: 'avatar-panda', name: 'Avatar Panda', description: 'Calma e foco para sua rotina de estudos.', cost: 100, emoji: '🐼', kind: 'avatar' },
  { id: 'avatar-penguin', name: 'Avatar Pinguim', description: 'Determinação para nadar contra a corrente.', cost: 120, emoji: '🐧', kind: 'avatar' },
  { id: 'avatar-turtle', name: 'Avatar Tartaruga', description: 'Devagar e sempre, um passo de cada vez.', cost: 120, emoji: '🐢', kind: 'avatar' },
  { id: 'avatar-tiger', name: 'Avatar Tigre', description: 'Força e garra para encarar qualquer desafio.', cost: 200, emoji: '🐯', kind: 'avatar' },
  { id: 'avatar-wolf', name: 'Avatar Lobo', description: 'Instinto e persistência na matilha dos estudos.', cost: 200, emoji: '🐺', kind: 'avatar' },
  { id: 'avatar-lion', name: 'Avatar Leão', description: 'Coragem para falar inglês sem medo.', cost: 250, emoji: '🦁', kind: 'avatar' },
  { id: 'avatar-unicorn', name: 'Avatar Unicórnio', description: 'Um toque de magia rara para o seu perfil.', cost: 450, emoji: '🦄', kind: 'avatar' },

  // Avatares — espaço e fantasia
  { id: 'avatar-astronaut', name: 'Avatar Astronauta', description: 'Para quem mira longe nos estudos.', cost: 400, emoji: '🧑‍🚀', kind: 'avatar' },
  { id: 'avatar-alien', name: 'Avatar Alienígena', description: 'Vindo de outro planeta para aprender inglês.', cost: 300, emoji: '👽', kind: 'avatar' },
  { id: 'avatar-robot', name: 'Avatar Robô', description: 'Precisão e consistência em cada lição.', cost: 300, emoji: '🤖', kind: 'avatar' },
  { id: 'avatar-wizard', name: 'Avatar Mago', description: 'Domine o inglês como quem domina um feitiço.', cost: 350, emoji: '🧙', kind: 'avatar' },
  { id: 'avatar-ninja', name: 'Avatar Ninja', description: 'Silencioso, focado, imparável.', cost: 350, emoji: '🥷', kind: 'avatar' },
  { id: 'avatar-superhero', name: 'Avatar Super-herói', description: 'Para quem já se sente um super-herói do inglês.', cost: 500, emoji: '🦸', kind: 'avatar' },
]
