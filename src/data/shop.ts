export interface ShopItem {
  id: string
  name: string
  description: string
  cost: number
  emoji: string
  kind: 'avatar' | 'streak_freeze' | 'heart_refill'
}

export const SHOP_ITEMS: ShopItem[] = [
  { id: 'freeze-1', name: 'Congelador de Sequência', description: 'Protege sua sequência por 1 dia perdido.', cost: 200, emoji: '🧊', kind: 'streak_freeze' },
  { id: 'refill-1', name: 'Recarga de Corações', description: 'Enche seus corações na hora.', cost: 150, emoji: '❤️‍🩹', kind: 'heart_refill' },
  { id: 'avatar-fox', name: 'Avatar Raposa', description: 'Um avatar esperto para o seu perfil.', cost: 100, emoji: '🦊', kind: 'avatar' },
  { id: 'avatar-owl', name: 'Avatar Coruja', description: 'Sabedoria para sua jornada no inglês.', cost: 100, emoji: '🦉', kind: 'avatar' },
  { id: 'avatar-koala', name: 'Avatar Coala', description: 'Tranquilidade para estudar todo dia.', cost: 100, emoji: '🐨', kind: 'avatar' },
  { id: 'avatar-lion', name: 'Avatar Leão', description: 'Coragem para falar inglês sem medo.', cost: 250, emoji: '🦁', kind: 'avatar' },
  { id: 'avatar-astronaut', name: 'Avatar Astronauta', description: 'Para quem mira longe nos estudos.', cost: 400, emoji: '🧑‍🚀', kind: 'avatar' },
]
