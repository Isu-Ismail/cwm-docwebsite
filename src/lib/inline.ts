// Minimal inline markup for JSON copy: `code` and **bold**. No HTML is ever injected.
export type Seg = { kind: 'text' | 'code' | 'bold'; text: string }

export function parseInline(src: string): Seg[] {
  const out: Seg[] = []
  const re = /`([^`]+)`|\*\*([^*]+)\*\*/g
  let last = 0
  for (const m of src.matchAll(re)) {
    if (m.index > last) out.push({ kind: 'text', text: src.slice(last, m.index) })
    out.push(m[1] !== undefined ? { kind: 'code', text: m[1] } : { kind: 'bold', text: m[2] })
    last = m.index + m[0].length
  }
  if (last < src.length) out.push({ kind: 'text', text: src.slice(last) })
  return out
}
