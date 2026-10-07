export type StageId =
  | 'user'
  | 'ask'
  | 'explore'
  | 'research'
  | 'plan'
  | 'branch'
  | 'setup'
  | 'code'
  | 'debug'
  | 'docs'
  | 'build'
  | 'test'
  | 'lint'
  | 'review'
  | 'security'
  | 'verify'
  | 'commit'
  | 'push'
  | 'pr'
  | 'ci'
  | 'preview'
  | 'merge'
  | 'release'
  | 'deploy'
  | 'report'

export type SkillSlot = { skill: string; after: StageId }

export type NeuroSignal = {
  from: StageId
  to: StageId
  isFail: boolean
  at: number
  ms: number
}

export type NeuroEvent = {
  at: number
  node: StageId
  label: string
  hits: number
  isFail: boolean
}

export type NeuroNet = {
  counts: Partial<Record<StageId, number>>
  time: Partial<Record<StageId, number>>
  tok: Partial<Record<StageId, number>>
  edges: Record<string, number>
  skillsUsed: string[]
  current: StageId | null
  enteredAt: number
  failed: StageId | null
  trail: NeuroSignal[]
  loops: number
  runs: number
  runStart: number
  runTok: number
  shownTok?: Partial<Record<StageId, number>>
  shownRunTok?: number
  events: NeuroEvent[]
}

export type MeterLimit = { kind: string; pct: number; resetsAt?: string }
export type MeterSample = { at: number; pct: number }

export type NeuroMeter = {
  ctxTokens?: number
  ctxWindow: number
  ctxPercent?: number
  ctxSamples: { at: number; tokens: number }[]
  limits: MeterLimit[]
  samples: Record<string, MeterSample[]>
  usd?: number
  at: number
}

export type DayStage = { ms: number; tok: number; hits: number }

export type NeuroDay = {
  ms: number
  tokIn: number
  tokOut: number
  tokCacheWrite: number
  tokCacheRead: number
  usd: number
  runs: number
  loops: number
  stages: Partial<Record<StageId, DayStage>>
}

export type CiJob = { name: string; status: string; conclusion: string }

export type CiRun = {
  id: number
  name: string
  status: string
  conclusion: string
  url: string
  jobs: CiJob[]
}

export type CiWatch = {
  cwd: string
  sha: string
  branch: string
  startedAt: number
  checkedAt: number
  state: 'waiting' | 'running' | 'passed' | 'failed' | 'none' | 'stopped' | 'error'
  note: string
  runs: CiRun[]
  failedRun?: number
  failedJob?: string
}

declare module 'claude-code' {
  interface PluginState {
    'neuro-path': {
      net: NeuroNet
      slots: SkillSlot[]
      draftSkill: string
      draftAfter: StageId
      meter: NeuroMeter
      days: Record<string, NeuroDay>
      ci: CiWatch | null
      autoFix: boolean
      animate: boolean
      useSkills: boolean
    }
  }
}
