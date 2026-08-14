import type { Exercise } from '../../types'

export interface ExerciseComponentProps {
  exercise: Exercise
  /** Chamado quando o aluno confirma uma resposta. */
  onAnswer: (correct: boolean) => void
  /** true depois que já houve um acerto ou erro julgado para esta tentativa. */
  answered: boolean
  /** true se a última tentativa foi correta. */
  wasCorrect: boolean | null
}
