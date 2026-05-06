import { Eye, EyeOff } from 'lucide-react'
import { useState } from 'react'

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
}

export function PasswordInput({ label, error, ...props }: Props) {
  const [show, setShow] = useState(false)
  return (
    <label className="block space-y-1">
      <span className="text-sm text-slate-300">{label}</span>
      <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-slate-900/70 px-3">
        <input
          {...props}
          type={show ? 'text' : 'password'}
          className="w-full border-none bg-transparent py-2 text-sm text-slate-100 outline-none"
        />
        <button type="button" onClick={() => setShow((v) => !v)} className="text-slate-300">
          {show ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </div>
      {error ? <p className="text-xs text-rose-400">{error}</p> : null}
    </label>
  )
}
