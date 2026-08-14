import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { speak } from './speech'

class FakeUtterance {
  text: string
  lang = ''
  rate = 1
  voice: unknown = null
  constructor(text: string) {
    this.text = text
  }
}

interface FakeVoice {
  lang: string
}

function makeFakeSynth(initialVoices: FakeVoice[]) {
  let voices = initialVoices
  const listeners: Record<string, (() => void)[]> = {}
  return {
    speak: vi.fn(),
    cancel: vi.fn(),
    getVoices: vi.fn(() => voices),
    addEventListener: vi.fn((event: string, cb: () => void) => {
      listeners[event] = listeners[event] ?? []
      listeners[event].push(cb)
    }),
    setVoices(v: FakeVoice[]) {
      voices = v
    },
    fire(event: string) {
      listeners[event]?.forEach((cb) => cb())
    },
  }
}

beforeEach(() => {
  vi.useFakeTimers()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ;(globalThis as any).SpeechSynthesisUtterance = FakeUtterance
})

afterEach(() => {
  vi.useRealTimers()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  delete (window as any).speechSynthesis
})

describe('speak', () => {
  it('does nothing (does not throw) when speechSynthesis is unsupported', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    delete (window as any).speechSynthesis
    expect(() => speak('hello')).not.toThrow()
  })

  it('speaks immediately when voices are already loaded', () => {
    const synth = makeFakeSynth([{ lang: 'en-US' }])
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ;(window as any).speechSynthesis = synth
    speak('Hello there')
    vi.advanceTimersByTime(60)
    expect(synth.cancel).toHaveBeenCalled()
    expect(synth.speak).toHaveBeenCalledTimes(1)
    const utterance = synth.speak.mock.calls[0][0] as FakeUtterance
    expect(utterance.text).toBe('Hello there')
  })

  it('waits for the voiceschanged event before speaking when voices are not loaded yet', () => {
    const synth = makeFakeSynth([])
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ;(window as any).speechSynthesis = synth
    speak('Good morning')
    vi.advanceTimersByTime(60)
    expect(synth.speak).not.toHaveBeenCalled()

    synth.setVoices([{ lang: 'en-US' }])
    synth.fire('voiceschanged')
    vi.advanceTimersByTime(60)
    expect(synth.speak).toHaveBeenCalledTimes(1)
  })

  it('falls back to speaking even if voiceschanged never fires', () => {
    const synth = makeFakeSynth([])
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ;(window as any).speechSynthesis = synth
    speak('See you soon')
    vi.advanceTimersByTime(600)
    expect(synth.speak).toHaveBeenCalledTimes(1)
  })

  it('never speaks twice if both the fallback and voiceschanged fire', () => {
    const synth = makeFakeSynth([])
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ;(window as any).speechSynthesis = synth
    speak('Thank you')
    synth.setVoices([{ lang: 'en-US' }])
    synth.fire('voiceschanged')
    vi.advanceTimersByTime(700)
    expect(synth.speak).toHaveBeenCalledTimes(1)
  })
})
