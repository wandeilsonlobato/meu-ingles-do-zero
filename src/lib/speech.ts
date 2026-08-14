import { normalizeAnswer } from './text'

/** Wrappers finos sobre a Web Speech API do navegador para TTS (ouvir) e STT (falar). */

/**
 * Fala um texto em inglês via speechSynthesis do navegador.
 *
 * Duas peculiaridades conhecidas do Chrome/Edge exigem os workarounds abaixo:
 * 1) As vozes carregam de forma assíncrona — a primeira chamada de speak() logo
 *    após o carregamento da página pode não emitir som porque getVoices() ainda
 *    retorna uma lista vazia. Esperamos o evento `voiceschanged` (com um
 *    fallback por tempo, caso o evento nunca dispare).
 * 2) Chamar speak() imediatamente após cancel() pode ser silenciosamente
 *    ignorado pelo motor de síntese. Um pequeno atraso resolve.
 */
export function speak(text: string, lang = 'en-US'): void {
  if (!('speechSynthesis' in window)) return
  const synth = window.speechSynthesis
  let spoken = false

  const doSpeak = () => {
    if (spoken) return
    spoken = true
    synth.cancel()
    setTimeout(() => {
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = lang
      const voices = synth.getVoices()
      const voice = voices.find((v) => v.lang === lang) ?? voices.find((v) => v.lang.startsWith('en'))
      if (voice) utterance.voice = voice
      utterance.rate = 0.9
      synth.speak(utterance)
    }, 50)
  }

  if (synth.getVoices().length > 0) {
    doSpeak()
  } else {
    synth.addEventListener('voiceschanged', doSpeak, { once: true })
    setTimeout(doSpeak, 500)
  }
}

export function isSpeechRecognitionSupported(): boolean {
  return typeof window !== 'undefined' && ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)
}

interface RecognitionResultHandlers {
  onResult: (transcript: string) => void
  onError: (message: string) => void
  onEnd?: () => void
}

// A Web Speech API não tem tipos oficiais em TS/DOM; declaramos o mínimo usado aqui.
interface MinimalSpeechRecognition {
  lang: string
  interimResults: boolean
  maxAlternatives: number
  start: () => void
  stop: () => void
  onresult: ((event: unknown) => void) | null
  onerror: ((event: unknown) => void) | null
  onend: (() => void) | null
}

export function startSpeechRecognition(lang = 'en-US', handlers: RecognitionResultHandlers): (() => void) | null {
  const w = window as unknown as {
    SpeechRecognition?: new () => MinimalSpeechRecognition
    webkitSpeechRecognition?: new () => MinimalSpeechRecognition
  }
  const SpeechRecognitionCtor = w.SpeechRecognition ?? w.webkitSpeechRecognition
  if (!SpeechRecognitionCtor) {
    handlers.onError('Reconhecimento de voz não é suportado neste navegador.')
    return null
  }

  const recognition = new SpeechRecognitionCtor()
  recognition.lang = lang
  recognition.interimResults = false
  recognition.maxAlternatives = 1

  recognition.onresult = (event: unknown) => {
    const e = event as { results: { 0: { transcript: string } }[] }
    const transcript = e.results?.[0]?.[0]?.transcript ?? ''
    handlers.onResult(transcript)
  }
  recognition.onerror = (event: unknown) => {
    const e = event as { error?: string }
    handlers.onError(e.error ?? 'Erro ao reconhecer voz.')
  }
  recognition.onend = () => handlers.onEnd?.()

  recognition.start()
  return () => recognition.stop()
}

/** Similaridade simples por sobreposição de palavras entre a fala reconhecida e o texto-alvo (0 a 100). */
export function pronunciationScore(spoken: string, target: string): number {
  const spokenWords = normalizeAnswer(spoken).split(' ').filter(Boolean)
  const targetWords = normalizeAnswer(target).split(' ').filter(Boolean)
  if (targetWords.length === 0) return 0
  let matches = 0
  const remaining = [...spokenWords]
  for (const word of targetWords) {
    const idx = remaining.indexOf(word)
    if (idx !== -1) {
      matches += 1
      remaining.splice(idx, 1)
    }
  }
  return Math.round((matches / targetWords.length) * 100)
}
