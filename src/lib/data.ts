// All site content lives in small JSON files under src/data. Add a file, it shows up.
export interface Flag { name: string; desc: string }
export interface Example { title: string; cmd: string; output: string }
export interface Command {
  id: string
  title: string
  syntax: string
  alias?: string
  summary: string
  notes: string[]
  flags: Flag[]
  subcommands: Flag[]
  examples: Example[]
}
export interface NavGroup { id: string; title: string; commands: string[] }
export interface Scenario { order: number; title: string; cmd: string; output: string }
export interface Feature { id: string; title: string; text: string; cmd: string }
export interface Technique {
  id: string
  name: string
  description: string
  tags: string[]
  systems: Record<string, string>
  scripts: Record<string, string>
}
export interface Site {
  name: string
  fullName: string
  version: string
  tagline: string
  description: string
  repo: string
  releases: string
  siteUrl: string
}
export interface DownloadFile { file: string; label: string; install_cmd: string }
export interface Downloads {
  repoBase: string
  latest: string
  packages: Record<string, Record<string, DownloadFile | Record<string, DownloadFile>>>
}

import site from '../data/site.json'
import nav from '../data/nav.json'
import features from '../data/features.json'
import downloads from '../data/downloads.json'

const byOrder = <T extends { order: number }>(a: T, b: T) => a.order - b.order

const commandFiles = import.meta.glob<Command>('../data/commands/*.json', { eager: true, import: 'default' })
const scenarioFiles = import.meta.glob<Scenario>('../data/demo/*.json', { eager: true, import: 'default' })
const techniqueFiles = import.meta.glob<Technique>('../data/techniques/*.json', { eager: true, import: 'default' })

export const commands: Record<string, Command> = Object.fromEntries(
  Object.values(commandFiles).map((c) => [c.id, c]),
)
export const scenarios: Scenario[] = Object.values(scenarioFiles).sort(byOrder)
export const techniques: Technique[] = Object.values(techniqueFiles).sort((a, b) => a.name.localeCompare(b.name))

export const siteInfo = site as Site
export const navGroups = nav as NavGroup[]
export const featureList = features as Feature[]
export const downloadInfo = downloads as unknown as Downloads

/** Commands in sidebar order, used for prev/next links. */
export const commandOrder: string[] = navGroups.flatMap((g) => g.commands).filter((id) => commands[id])
