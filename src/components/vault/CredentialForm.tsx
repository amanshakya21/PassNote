import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useEffect } from 'react'
import { z } from 'zod'
import { sanitizeText } from '../../utils/password'
import { Button } from '../ui/Button'
import type { Category, Credential } from '../../types'

const schema = z.object({
  title: z.string().min(1),
  username: z.string().optional(),
  password: z.string().optional(),
  notes: z.string().optional(),
  category: z.string().optional(),
  customCategory: z.string().optional(),
})

type FormData = z.infer<typeof schema>
const nowTs = () => Date.now()
const defaultFormValues: FormData = { title: '', username: '', password: '', notes: '', category: 'notes', customCategory: '' }
const builtinCategories = ['notes', 'social', 'email', 'banking', 'work'] as const

export function CredentialForm({
  initial,
  onSave,
  onCancel,
}: {
  initial?: Credential
  onSave: (item: Credential) => void
  onCancel?: () => void
}) {
  const { register, handleSubmit, reset, watch, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: defaultFormValues,
  })

  useEffect(() => {
    if (!initial) {
      reset(defaultFormValues)
      return
    }
    const isBuiltIn = builtinCategories.includes(initial.category as (typeof builtinCategories)[number])
    reset({
      title: initial.title,
      username: initial.username,
      password: initial.password,
      notes: initial.notes,
      category: isBuiltIn ? initial.category : '__new__',
      customCategory: isBuiltIn ? '' : initial.category,
    })
  }, [initial, reset])

  const submit = (values: FormData) => {
    const now = nowTs()
    const resolvedCategory = values.category === '__new__'
      ? sanitizeText(values.customCategory ?? '') || 'notes'
      : values.category ?? 'notes'
    onSave({
      id: initial?.id ?? crypto.randomUUID(),
      title: sanitizeText(values.title),
      username: sanitizeText(values.username ?? ''),
      password: values.password ?? '',
      notes: sanitizeText(values.notes ?? ''),
      category: resolvedCategory as Category,
      websiteUrl: initial?.websiteUrl,
      favorite: initial?.favorite ?? false,
      createdAt: initial?.createdAt ?? now,
      updatedAt: now,
    })
  }

  const selectedCategory = watch('category')

  return (
    <form onSubmit={handleSubmit(submit)} className="grid gap-2 rounded-2xl border border-white/10 bg-slate-900/70 p-4">
      <input {...register('title')} placeholder="Website/App" className="rounded-lg bg-white/10 p-2 text-sm" />
      <p className="text-xs text-rose-400">{errors.title?.message}</p>
      <input {...register('username')} placeholder="Username/Email" className="rounded-lg bg-white/10 p-2 text-sm" />
      <input {...register('password')} placeholder="Password" className="rounded-lg bg-white/10 p-2 text-sm" />
      <select {...register('category')} className="rounded-lg bg-white p-2 text-sm text-black">
        <option value="notes" className="text-black">Notes</option>
        <option value="social" className="text-black">Social</option>
        <option value="email" className="text-black">Email</option>
        <option value="banking" className="text-black">Banking</option>
        <option value="work" className="text-black">Work</option>
        <option value="__new__" className="text-black">+ New Tag</option>
      </select>
      {selectedCategory === '__new__' ? (
        <input
          {...register('customCategory')}
          placeholder="Enter new tag name"
          className="rounded-lg bg-white/10 p-2 text-sm"
        />
      ) : null}
      <textarea {...register('notes')} placeholder="Notes" className="rounded-lg bg-white/10 p-2 text-sm" />
      <div className="mt-2 flex gap-2">
        <Button type="submit">{initial ? 'Update Credential' : 'Save Credential'}</Button>
        {onCancel ? (
          <button
            type="button"
            onClick={onCancel}
            className="rounded-xl border border-white/20 px-4 py-2 text-sm font-semibold text-slate-200 transition hover:bg-white/10"
          >
            Cancel
          </button>
        ) : null}
      </div>
    </form>
  )
}
