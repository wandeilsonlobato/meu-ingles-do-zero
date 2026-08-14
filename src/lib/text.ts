export function normalizeAnswer(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9\s]/g, '')
    .trim()
    .replace(/\s+/g, ' ')
}

export function answerMatches(input: string, acceptable: string[]): boolean {
  const normalizedInput = normalizeAnswer(input)
  if (!normalizedInput) return false
  return acceptable.some((a) => normalizeAnswer(a) === normalizedInput)
}
