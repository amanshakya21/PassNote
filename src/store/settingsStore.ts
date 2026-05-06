import { create } from 'zustand'
import type { UserSettings } from '../types'
import { getRecord, setRecord } from '../services/storage'

const defaultSettings: UserSettings = {
  autoLockMinutes: 5,
  theme: 'dark',
  clipboardClearSeconds: 15,
}

interface SettingsState {
  settings: UserSettings
  loadSettings: () => Promise<void>
  updateSettings: (patch: Partial<UserSettings>) => Promise<void>
}

export const useSettingsStore = create<SettingsState>((set, get) => ({
  settings: defaultSettings,
  loadSettings: async () => {
    const stored = await getRecord<UserSettings>('settings')
    if (stored) set({ settings: stored })
  },
  updateSettings: async (patch) => {
    const next = { ...get().settings, ...patch }
    set({ settings: next })
    await setRecord('settings', next)
  },
}))
