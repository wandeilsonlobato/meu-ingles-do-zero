import type { Achievement } from '../types'

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first-lesson',
    name: 'Primeiro Passo',
    description: 'Concluiu sua primeira lição.',
    icon: '🎉',
    criterion: 'Completar 1 lição',
  },
  {
    id: 'streak-7',
    name: 'Semana de Ferro',
    description: '7 dias seguidos estudando.',
    icon: '🔥',
    criterion: 'Sequência de 7 dias',
  },
  {
    id: 'streak-30',
    name: 'Constância de Ouro',
    description: '30 dias seguidos estudando.',
    icon: '🏅',
    criterion: 'Sequência de 30 dias',
  },
  {
    id: 'words-100',
    name: 'Colecionador de Palavras',
    description: 'Aprendeu 100 palavras novas.',
    icon: '📚',
    criterion: '100 palavras aprendidas',
  },
  {
    id: 'perfect-pronunciation',
    name: 'Boca de Nativo',
    description: 'Acertou 100% em um exercício de pronúncia.',
    icon: '🗣️',
    criterion: 'Pronúncia perfeita em 1 exercício',
  },
  {
    id: 'level-a1-complete',
    name: 'Nível A1 Completo',
    description: 'Concluiu todo o Nível Iniciante (A1).',
    icon: '🏆',
    criterion: 'Concluir o Nível 1',
  },
]
