import type { ClientModule } from 'claude-code'

type LiveProps = {
  stage: string
  color: string
  since: number
  next: string
  from: string
  at: number
  ms: number
  isFail: boolean
  ci: string
  ciColor: string
  ciSince: number
  isCiLive: boolean
}

type LiveState = { now: number }

const BG = '#1a1a19'
const LINE = '#3a3935'
const INK = '#ece9e0'
const INK3 = '#6b6862'
const ACCENT = '#d97757'
const BAD = '#e5584f'
const SPIN = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏']

const rgb = (c: string) => [1, 3, 5].map(i => parseInt(c.slice(i, i + 2), 16))
const mix = (a: string, b: string, t: number) => {
  const x = rgb(a)
  const y = rgb(b)
  return `#${x.map((v, i) => Math.round(v + (y[i]! - v) * t).toString(16).padStart(2, '0')).join('')}`
}
const dur = (ms: number) => {
  const s = Math.max(0, Math.floor(ms / 1000))
  if (s < 60) return `${s}s`
  if (s < 3600) return `${Math.floor(s / 60)}m ${String(s % 60).padStart(2, '0')}s`
  return `${Math.floor(s / 3600)}h ${String(Math.floor((s % 3600) / 60)).padStart(2, '0')}m`
}
const pace = (ms: number) => Math.min(3.5, Math.max(0.35, 0.35 + 0.55 * Math.log2(1 + ms / 4000))) * 1000

const Live: ClientModule<LiveProps, LiveState> = (p, s) => {
  const { Box, Text } = s.elements
  if (s.state === undefined) {
    s.every(40, () => s.setState({ now: Date.now() }))
  }
  const now = s.state?.now ?? Date.now()
  const tone = p.isFail ? BAD : p.color
  const breathe = (Math.sin(now / 420) + 1) / 2
  const dot = mix(tone, BG, 0.1 + 0.6 * breathe)

  const width = Math.max(16, (s.columns || 48) - p.from.length - p.stage.length - 2)
  const t = p.from ? Math.min(1, (now - p.at) / pace(p.ms)) : 1
  const head = t * (width - 1)
  const track = Array.from({ length: width }, (_, i) => {
    if (!p.from) return { ch: '─', color: LINE }
    const d = head - i
    if (t < 1 && Math.abs(d) < 0.5) return { ch: '●', color: INK }
    if (d >= 0) return { ch: '━', color: mix(tone, LINE, t < 1 ? Math.min(0.85, d / 10) : 0.55) }
    return { ch: '─', color: LINE }
  })

  return (
    <Box flexDirection="column">
      <Box flexDirection="row" justifyContent="space-between">
        <Box flexDirection="row">
          <Text color={dot}>● </Text>
          <Text bold color={INK}>
            {p.stage}
          </Text>
          {p.next && <Text color={ACCENT}> → {p.next}</Text>}
        </Box>
        <Text color={INK3}>{dur(now - p.since)}</Text>
      </Box>
      <Box flexDirection="row">
        {p.from && <Text color={INK3}>{p.from} </Text>}
        {track.map(c => (
          <Text color={c.color}>{c.ch}</Text>
        ))}
        <Text color={t >= 1 ? tone : INK3}> {p.stage}</Text>
      </Box>
      {p.ci && (
        <Box flexDirection="row">
          <Text color={p.ciColor}>
            {p.isCiLive ? SPIN[Math.floor(now / 80) % SPIN.length] : '•'} CI {p.ci}
          </Text>
          {p.isCiLive && <Text color={INK3}> · {dur(now - p.ciSince)}</Text>}
        </Box>
      )}
    </Box>
  )
}

export default Live
