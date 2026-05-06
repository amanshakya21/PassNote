import { useForm } from 'react-hook-form'
import { Button } from '../components/ui/Button'
import { useSettingsStore } from '../store/settingsStore'

export function SettingsPage() {
  const { settings, updateSettings } = useSettingsStore()
  const { register, handleSubmit } = useForm({ defaultValues: settings })
  return (
    <div className="max-w-2xl space-y-4 rounded-2xl border border-white/10 bg-slate-900/70 p-5">
      <h2 className="text-xl font-semibold">Settings</h2>
      <form className="grid gap-3" onSubmit={handleSubmit(async (v) => updateSettings(v))}>
        <label className="text-sm">Auto-lock (minutes)</label>
        <input type="number" min={1} max={60} className="rounded bg-white/10 p-2" {...register('autoLockMinutes', { valueAsNumber: true })} />
        <label className="text-sm">Clipboard clear (seconds)</label>
        <input type="number" min={5} max={60} className="rounded bg-white/10 p-2" {...register('clipboardClearSeconds', { valueAsNumber: true })} />
        <Button type="submit">Save Settings</Button>
      </form>
    </div>
  )
}
