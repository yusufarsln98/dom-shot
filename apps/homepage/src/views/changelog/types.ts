export interface ChangeGroup {
  category: 'Features' | 'Architecture' | 'Performance' | 'Documentation'
  items: string[]
}

export interface ReleaseItem {
  version: string
  date: string
  tag: string
  title: string
  description: string
  changes: ChangeGroup[]
}

