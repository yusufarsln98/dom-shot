import { describe, expect, it } from 'vitest'

import { sanitizeFileName } from '../utils/file-download.js'

describe('sanitizeFileName', () => {
  it('strips filesystem-hostile characters (exact ported behavior: hostile runs and whitespace are replaced independently)', () => {
    expect(sanitizeFileName('Widget: My/Chart* 2026')).toBe('widget--my-chart--2026')
  })

  it('collapses whitespace into single dashes', () => {
    expect(sanitizeFileName('monthly report   pt2')).toBe('monthly-report-pt2')
  })

  it('passes clean names through untouched', () => {
    expect(sanitizeFileName('card-01')).toBe('card-01')
  })

  it('handles empty input', () => {
    expect(sanitizeFileName('   ')).toBe('')
  })
})
