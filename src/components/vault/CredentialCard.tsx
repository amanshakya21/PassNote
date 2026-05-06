import { Copy, Eye, EyeOff, Pencil, RotateCcw, ShieldX, Star, StarOff, Trash2 } from 'lucide-react'
import { useState } from 'react'
import type { Credential } from '../../types'
import { copyWithAutoClear } from '../../utils/clipboard'

interface Props {
  item: Credential
  clearSeconds: number
  onEdit: (item: Credential) => void
  onDelete: (id: string) => void
  onToggleFavorite: (item: Credential) => void
  onOpen: (item: Credential) => void
  isTrash?: boolean
  onRestore?: (id: string) => void
  hideEdit?: boolean
}

export function CredentialCard({ item, clearSeconds, onEdit, onDelete, onToggleFavorite, onOpen, isTrash = false, onRestore, hideEdit = false }: Props) {
  const [showPassword, setShowPassword] = useState(false)

  return (
    <article
      className="flex min-h-[150px] cursor-pointer flex-col rounded-xl border border-white/10 bg-white/5 p-2.5 backdrop-blur transition hover:bg-white/10"
      onClick={() => onOpen(item)}
    >
      <div className="mb-1.5 flex items-center justify-between">
        <h3 className="text-base font-semibold text-slate-100">{item.title}</h3>
        <button type="button" onClick={(event) => { event.stopPropagation(); onToggleFavorite(item) }} className="text-amber-300">
          {item.favorite ? <Star size={18} /> : <StarOff size={18} />}
        </button>
      </div>
      {item.username ? <p className="text-xs text-slate-400">{item.username}</p> : null}
      {item.password ? (
        <p className="mt-1 rounded-md bg-slate-900/50 px-2 py-0.5 font-mono text-xs text-slate-200">
          {showPassword ? item.password : '••••••••••••'}
        </p>
      ) : null}
      <div className="mt-auto pt-1.5 space-y-1.5">
        <div className="flex flex-wrap gap-1.5">
        {item.username ? <button type="button" onClick={(event) => { event.stopPropagation(); void copyWithAutoClear(item.username, clearSeconds) }} className="text-xs text-slate-300"><Copy size={14} className="inline" /> User</button> : null}
        {item.password ? <button type="button" onClick={(event) => { event.stopPropagation(); void copyWithAutoClear(item.password, clearSeconds) }} className="text-xs text-slate-300"><ShieldX size={14} className="inline" /> Password</button> : null}
        {item.password ? (
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation()
              setShowPassword((value) => !value)
            }}
            className="text-xs text-slate-300"
          >
            {showPassword ? <EyeOff size={14} className="inline" /> : <Eye size={14} className="inline" />}{' '}
            {showPassword ? 'Hide' : 'Show'}
          </button>
        ) : null}
        </div>
        <div className="flex flex-wrap gap-1.5">
          {!hideEdit ? <button type="button" onClick={(event) => { event.stopPropagation(); onEdit(item) }} className="text-xs text-slate-300"><Pencil size={14} className="inline" /> Edit</button> : null}
          {isTrash ? (
            <button type="button" onClick={(event) => { event.stopPropagation(); onRestore?.(item.id) }} className="text-xs text-emerald-300"><RotateCcw size={14} className="inline" /> Restore</button>
          ) : null}
          <button type="button" onClick={(event) => { event.stopPropagation(); onDelete(item.id) }} className="text-xs text-rose-400"><Trash2 size={14} className="inline" /> Delete</button>
        </div>
      </div>
    </article>
  )
}
