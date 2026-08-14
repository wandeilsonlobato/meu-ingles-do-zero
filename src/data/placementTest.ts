import type { Exercise } from '../types'

export interface PlacementQuestion {
  levelCode: 'A0' | 'A1' | 'A2'
  exercise: Exercise
}

function mc(id: string, prompt: string, options: { id: string; label: string }[], correctOptionId: string): Exercise {
  return {
    id,
    lessonId: 'placement',
    type: 'multiple_choice',
    prompt,
    options,
    correctOptionId,
    explanation: '',
  }
}

/**
 * Teste de nivelamento curto (9 perguntas: 3 por nível). O resultado decide
 * a partir de qual nível o aluno começa a trilha — ver applyPlacement no store.
 */
export const PLACEMENT_QUESTIONS: PlacementQuestion[] = [
  // Nível 0 — Primeiros Passos
  {
    levelCode: 'A0',
    exercise: mc(
      'placement-a0-1',
      'Como se pronuncia a letra "H" em inglês?',
      [
        { id: 'a', label: 'eitch' },
        { id: 'b', label: 'agá' },
      ],
      'a',
    ),
  },
  {
    levelCode: 'A0',
    exercise: mc(
      'placement-a0-2',
      'Complete: ___ name is Ana. (Meu)',
      [
        { id: 'a', label: 'My' },
        { id: 'b', label: 'You' },
      ],
      'a',
    ),
  },
  {
    levelCode: 'A0',
    exercise: mc(
      'placement-a0-3',
      'Como se diz "dez" em inglês?',
      [
        { id: 'a', label: 'ten' },
        { id: 'b', label: 'nine' },
      ],
      'a',
    ),
  },
  // Nível 1 — Iniciante
  {
    levelCode: 'A1',
    exercise: mc(
      'placement-a1-1',
      'Complete: I ___ happy.',
      [
        { id: 'a', label: 'am' },
        { id: 'b', label: 'is' },
      ],
      'a',
    ),
  },
  {
    levelCode: 'A1',
    exercise: mc(
      'placement-a1-2',
      'Complete: She ___ every day. (trabalha)',
      [
        { id: 'a', label: 'works' },
        { id: 'b', label: 'work' },
      ],
      'a',
    ),
  },
  {
    levelCode: 'A1',
    exercise: mc(
      'placement-a1-3',
      'Complete: ___ a park on my street.',
      [
        { id: 'a', label: "There's" },
        { id: 'b', label: 'It is' },
      ],
      'a',
    ),
  },
  // Nível 2 — Básico
  {
    levelCode: 'A2',
    exercise: mc(
      'placement-a2-1',
      'Complete: They ___ at home yesterday.',
      [
        { id: 'a', label: 'were' },
        { id: 'b', label: 'are' },
      ],
      'a',
    ),
  },
  {
    levelCode: 'A2',
    exercise: mc(
      'placement-a2-2',
      'Qual é o passado de "go"?',
      [
        { id: 'a', label: 'went' },
        { id: 'b', label: 'goed' },
      ],
      'a',
    ),
  },
  {
    levelCode: 'A2',
    exercise: mc(
      'placement-a2-3',
      'Qual é o comparativo de "big"?',
      [
        { id: 'a', label: 'bigger' },
        { id: 'b', label: 'more big' },
      ],
      'a',
    ),
  },
]
