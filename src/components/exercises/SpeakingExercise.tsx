import { useState } from 'react'
import { Mic, Volume2 } from 'lucide-react'
import clsx from 'clsx'
import type { ExerciseComponentProps } from './types'
import { Button } from '../ui/Button'
import { isSpeechRecognitionSupported, pronunciationScore, speak, startSpeechRecognition } from '../../lib/speech'

const PASS_THRESHOLD = 60

export function SpeakingExercise({ exercise, onAnswer }: ExerciseComponentProps) {
  const [listening, setListening] = useState(false)
  const [transcript, setTranscript] = useState<string | null>(null)
  const [score, setScore] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [checked, setChecked] = useState(false)
  const supported = isSpeechRecognitionSupported()

  function startRecording() {
    setError(null)
    setListening(true)
    startSpeechRecognition('en-US', {
      onResult: (text) => {
        const s = pronunciationScore(text, exercise.audioText ?? exercise.correctText ?? '')
        setTranscript(text)
        setScore(s)
        setChecked(true)
        onAnswer(s >= PASS_THRESHOLD)
      },
      onError: (message) => {
        setError(message)
        setListening(false)
      },
      onEnd: () => setListening(false),
    })
  }

  function markAsSpoken() {
    setChecked(true)
    setScore(100)
    onAnswer(true)
  }

  return (
    <div>
      <p className="mb-2 text-xl font-bold text-slate-800 dark:text-slate-100">{exercise.prompt}</p>
      <p className="mb-5 text-2xl font-extrabold text-brand-700 dark:text-brand-300">{exercise.audioText}</p>

      <button
        type="button"
        onClick={() => exercise.audioText && speak(exercise.audioText)}
        className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-brand-500 text-white shadow-md transition-transform hover:scale-105 active:scale-95"
        aria-label="Ouvir modelo"
      >
        <Volume2 size={26} />
      </button>

      {supported ? (
        <button
          type="button"
          onClick={startRecording}
          disabled={listening || checked}
          className={clsx(
            'flex h-20 w-20 items-center justify-center rounded-full text-white shadow-md transition-transform active:scale-95',
            listening ? 'animate-pop bg-heart-500' : 'bg-progress-500 hover:scale-105',
            checked && 'opacity-50',
          )}
          aria-label="Gravar sua pronúncia"
        >
          <Mic size={32} />
        </button>
      ) : (
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Seu navegador não suporta reconhecimento de voz. Você pode marcar como praticado após repetir em voz alta.
        </p>
      )}

      {error && <p className="mt-3 text-sm text-heart-600 dark:text-heart-400">{error}</p>}

      {transcript && (
        <p className="mt-4 text-slate-600 dark:text-slate-300">
          Você disse: <span className="font-semibold">"{transcript}"</span>
        </p>
      )}

      {score !== null && (
        <p className={clsx('mt-2 font-bold', score >= PASS_THRESHOLD ? 'text-progress-700 dark:text-progress-300' : 'text-heart-600 dark:text-heart-400')}>
          Pontuação de pronúncia: {score}%
        </p>
      )}

      {!supported && !checked && (
        <Button className="mt-4" onClick={markAsSpoken}>
          Marquei como praticado
        </Button>
      )}
    </div>
  )
}
