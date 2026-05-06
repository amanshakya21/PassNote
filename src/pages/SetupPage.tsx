import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from 'react-router-dom'
import { PasswordInput } from '../components/ui/PasswordInput'
import { Button } from '../components/ui/Button'
import { useAuthStore } from '../store/authStore'

const schema = z.object({
  password: z.string().min(10, 'Use at least 10 characters'),
  confirm: z.string(),
}).refine((v) => v.password === v.confirm, { path: ['confirm'], message: 'Passwords do not match' })

export function SetupPage() {
  const setup = useAuthStore((s) => s.setup)
  const nav = useNavigate()
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<z.infer<typeof schema>>({ resolver: zodResolver(schema) })
  return (
    <div className="mx-auto mt-20 max-w-md rounded-2xl border border-white/10 bg-slate-900/70 p-6">
      <h2 className="mb-4 text-xl font-semibold">Create Master Password</h2>
      <form onSubmit={handleSubmit(async (v) => { await setup(v.password); nav('/dashboard') })} className="space-y-3">
        <PasswordInput label="Master Password" error={errors.password?.message} {...register('password')} />
        <PasswordInput label="Confirm Password" error={errors.confirm?.message} {...register('confirm')} />
        <Button type="submit" disabled={isSubmitting}>Create Vault</Button>
      </form>
    </div>
  )
}
