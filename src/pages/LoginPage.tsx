import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { PasswordInput } from '../components/ui/PasswordInput'
import { Button } from '../components/ui/Button'
import { useAuthStore } from '../store/authStore'

export function LoginPage() {
  const login = useAuthStore((s) => s.login)
  const err = useAuthStore((s) => s.loginError)
  const nav = useNavigate()
  const { register, handleSubmit, formState: { isSubmitting } } = useForm<{ password: string }>()
  return (
    <div className="mx-auto mt-20 max-w-md rounded-2xl border border-white/10 bg-slate-900/70 p-6">
      <h2 className="mb-4 text-xl font-semibold">Unlock Vault</h2>
      <form onSubmit={handleSubmit(async (v) => { if (await login(v.password)) nav('/dashboard') })} className="space-y-3">
        <PasswordInput label="Master Password" {...register('password', { required: true })} />
        {err ? <p className="text-xs text-rose-400">{err}</p> : null}
        <Button type="submit" disabled={isSubmitting}>Unlock</Button>
      </form>
    </div>
  )
}
