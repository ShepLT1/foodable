const FRACTIONS: Record<number, string> = {
  0: '',
  0.125: '1/8',
  0.25: '1/4',
  0.333: '1/3',
  0.375: '3/8',
  0.5: '1/2',
  0.625: '5/8',
  0.667: '2/3',
  0.75: '3/4',
  0.875: '7/8',
}

export function formatQuantity(value: number): string {
  const rounded = Math.round(value * 1000) / 1000
  const whole = Math.floor(rounded)
  const remainder = Number((rounded - whole).toFixed(3))
  const fraction = FRACTIONS[remainder]

  if (!fraction) return rounded.toString()
  if (whole === 0) return fraction

  return `${whole} ${fraction}`
}

export function parseQuantity(text: string): number | null {
  const trimmed = text.trim()

  if (trimmed === '') return null

  // Decimal or whole number
  const decimal = Number(trimmed)
  if (Number.isFinite(decimal)) {
    return decimal
  }

  // Mixed number: "1 1/2"
  const mixedMatch = trimmed.match(/^(\d+)\s+(\d+)\/(\d+)$/)
  if (mixedMatch) {
    const [, whole, numerator, denominator] = mixedMatch

    const denom = Number(denominator)
    if (denom === 0) return null

    return Number(whole) + Number(numerator) / denom
  }

  // Fraction: "3/4"
  const fractionMatch = trimmed.match(/^(\d+)\/(\d+)$/)
  if (fractionMatch) {
    const [, numerator, denominator] = fractionMatch

    const denom = Number(denominator)
    if (denom === 0) return null

    return Number(numerator) / denom
  }

  return null
}
