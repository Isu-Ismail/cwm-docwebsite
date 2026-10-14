// CWM prints plain text when piped, so the docs colour it by shape, the way a real terminal would.
export type Tone = 'plain' | 'dim' | 'ok' | 'err' | 'head' | 'key' | 'accent'
export interface Part { text: string; tone: Tone; style?: string }
export type Line = Part[]

const OK_START = /^(Saved|Successfully|Restored|Set |Tidied|✔|Watch session started|CWM watch hook removed|Added the CWM)/
const ERR_START = /^(Error|Unknown setting|Warning)/
const LABEL = /^(\s*(?:[•] )?[A-Za-z][A-Za-z ()/-]*?:)(\s{2,}|\s(?=\S))(.*)$/

export function styleOutput(output: string): Line[] {
  const rows = output.split('\n')
  return rows.map((row, i) => {
    const next = rows[i + 1] ?? ''
    if (row === '') return []
    if (row.includes('\x1b[')) return ansiParts(row)
    if (/^-{5,}$/.test(row.trim())) return [{ text: row, tone: 'dim' }]
    if (ERR_START.test(row)) return [{ text: row, tone: 'err' }]
    if (OK_START.test(row)) return [{ text: row, tone: 'ok' }]
    if (/^ID\s{2,}/.test(row)) return [{ text: row, tone: 'dim' }]
    if (/^-{5,}$/.test(next.trim()) || /^ID\s{2,}/.test(next)) return [{ text: row, tone: 'head' }]
    if (/^CWM - /.test(row) || /^Watch History Analysis|^Shell History Analysis|^Configuration Source|^General Settings/.test(row)) {
      return [{ text: row, tone: 'head' }]
    }
    if (/^Found process/.test(row)) return [{ text: row, tone: 'head' }]
    const m = LABEL.exec(row)
    if (m && !/^(Description|Executing command)/.test(row)) {
      return [
        { text: m[1], tone: 'key' },
        { text: m[2] + m[3], tone: 'plain' },
      ]
    }
    if (/^(Description|Executing command):/.test(row)) {
      const idx = row.indexOf(':') + 1
      return [
        { text: row.slice(0, idx), tone: 'dim' },
        { text: row.slice(idx), tone: 'plain' },
      ]
    }
    return [{ text: row, tone: 'plain' }]
  })
}

// The 16-colour codes the CLI uses (33 yellow, 90 bright black). Background code = foreground + 10.
const ANSI16: Record<number, string> = { 33: 'var(--term-prompt)', 90: '#555550' }

// 256-colour palette index to CSS colour.
function xterm256(n: number): string {
  if (n >= 232) {
    const v = 8 + (n - 232) * 10
    return `rgb(${v},${v},${v})`
  }
  if (n >= 16) {
    const i = n - 16
    const lv = (k: number) => (k === 0 ? 0 : 55 + k * 40)
    return `rgb(${lv(Math.floor(i / 36))},${lv(Math.floor(i / 6) % 6)},${lv(i % 6)})`
  }
  return 'currentColor'
}

/** Rows with real ANSI colour codes (captured from the CLI): 38;5;N foreground, 48;5;N background. */
function ansiParts(row: string): Line {
  const parts: Line = []
  let fg = ''
  let bg = ''
  let last = 0
  for (const m of row.matchAll(/\x1b\[([\d;]*)m/g)) {
    if (m.index > last) parts.push(part(row.slice(last, m.index), fg, bg))
    last = m.index + m[0].length
    const c = m[1].split(';').map(Number)
    if (!m[1] || c[0] === 0) fg = bg = ''
    else if (c[0] === 38 && c[1] === 5) fg = xterm256(c[2])
    else if (c[0] === 48 && c[1] === 5) bg = xterm256(c[2])
    else if (ANSI16[c[0]]) fg = ANSI16[c[0]]
    else if (ANSI16[c[0] - 10]) bg = ANSI16[c[0] - 10]
  }
  if (last < row.length) parts.push(part(row.slice(last), fg, bg))
  return parts
}

function part(text: string, fg: string, bg: string): Part {
  const style = [fg && `color:${fg}`, bg && `background:${bg}`].filter(Boolean).join(';')
  return { text, tone: 'plain', style: style || undefined }
}
