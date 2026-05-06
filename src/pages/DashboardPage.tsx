import { useEffect, useMemo, useState } from 'react'
import { Copy, Pencil, Plus, Trash2 } from 'lucide-react'
import { CredentialCard } from '../components/vault/CredentialCard'
import { CredentialForm } from '../components/vault/CredentialForm'
import { useAuthStore } from '../store/authStore'
import { useSettingsStore } from '../store/settingsStore'
import { useVaultStore } from '../store/vaultStore'
import type { Credential } from '../types'
import { copyWithAutoClear } from '../utils/clipboard'

export function DashboardPage({ mode = 'all' }: { mode?: 'all' | 'favorites' | 'trash' }) {
  const key = useAuthStore((s) => s.key)
  const { vault, loadVault, saveVault, addItem, updateItem, softDelete, restore, deletePermanent } = useVaultStore()
  const settings = useSettingsStore((s) => s.settings)
  const [query, setQuery] = useState('')
  const [editing, setEditing] = useState<Credential | undefined>()
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [openedCard, setOpenedCard] = useState<Credential | undefined>()
  const [showOpenedPassword, setShowOpenedPassword] = useState(false)
  const [showOpenedNote, setShowOpenedNote] = useState(false)
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null)

  useEffect(() => { if (key) void loadVault(key) }, [key, loadVault])
  useEffect(() => { if (key) void saveVault(key) }, [vault, key, saveVault])

  const filtered = useMemo(() => vault.items.filter((item) => {
    if (mode === 'favorites' && !item.favorite) return false
    if (mode === 'trash' && !item.deletedAt) return false
    if (mode === 'all' && item.deletedAt) return false
    const hay = `${item.title} ${item.username} ${item.notes} ${item.category}`.toLowerCase()
    return hay.includes(query.toLowerCase())
  }), [vault.items, mode, query])

  return (
    <section className="space-y-4">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search by app, user, notes, category..." className="w-full rounded-xl border border-white/10 bg-slate-900/70 p-2 text-sm md:max-w-md" />
      </div>
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {filtered.map((item) => (
          <CredentialCard
            key={item.id}
            item={item}
            clearSeconds={settings.clipboardClearSeconds}
            onEdit={(entry) => {
              setEditing(entry)
              setIsFormOpen(true)
            }}
            onDelete={(id) => setPendingDeleteId(id)}
            onToggleFavorite={(entry) => updateItem({ ...entry, favorite: !entry.favorite })}
            onOpen={(entry) => {
              setOpenedCard(entry)
              setShowOpenedPassword(false)
              setShowOpenedNote(false)
            }}
            isTrash={mode === 'trash'}
            onRestore={restore}
            hideEdit={mode === 'trash'}
          />
        ))}
      </div>

      {mode !== 'trash' ? (
        <>
          <button
            type="button"
            onClick={() => {
              setEditing(undefined)
              setIsFormOpen(true)
            }}
            className="fixed bottom-6 right-6 z-40 rounded-full bg-indigo-500 p-4 text-white shadow-lg transition hover:bg-indigo-400"
            aria-label="Add credential"
          >
            <Plus size={22} />
          </button>

          {isFormOpen ? (
            <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/70 p-4 md:items-center">
              <div className="w-full max-w-xl">
                <CredentialForm
                  initial={editing}
                  onSave={(item) => {
                    if (editing) updateItem(item)
                    else addItem(item)
                    setEditing(undefined)
                    setIsFormOpen(false)
                  }}
                  onCancel={() => {
                    setEditing(undefined)
                    setIsFormOpen(false)
                  }}
                />
              </div>
            </div>
          ) : null}
        </>
      ) : null}

      {openedCard ? (
        <div className="fixed inset-0 z-[60] bg-slate-950/90 p-3 md:p-5">
          <div className="flex h-full w-full flex-col overflow-y-auto rounded-2xl border border-white/10 bg-slate-900 p-5 md:p-8">
            <h2 className="mb-5 text-3xl font-semibold text-slate-100">{openedCard.title}</h2>
            <div className="flex-1 space-y-4 text-sm text-slate-200">
              {openedCard.username ? (
                <p><span className="font-semibold text-slate-400">Username/Email</span><br />{openedCard.username}</p>
              ) : null}
              {openedCard.password ? (
                <div>
                  <div className="mb-1">
                    <span className="font-semibold text-slate-400">Password</span>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-mono">{showOpenedPassword ? openedCard.password : '••••••••••••'}</p>
                    <button
                      type="button"
                      onClick={() => setShowOpenedPassword((value) => !value)}
                      className="rounded-lg border border-white/20 px-3 py-1 text-xs font-semibold text-slate-200 transition hover:bg-white/10"
                    >
                      {showOpenedPassword ? 'Hide' : 'Show'}
                    </button>
                  </div>
                </div>
              ) : null}
              {openedCard.notes ? (
                <div>
                  <div className="mb-1">
                    <span className="font-semibold text-slate-400">Note</span>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <p>{showOpenedNote ? '' : '••••••••••••'}</p>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setShowOpenedNote((value) => !value)}
                        className="rounded-lg border border-white/20 px-3 py-1 text-xs font-semibold text-slate-200 transition hover:bg-white/10"
                      >
                        {showOpenedNote ? 'Hide' : 'Show'}
                      </button>
                      <button
                        type="button"
                        onClick={() => void copyWithAutoClear(openedCard.notes || '', settings.clipboardClearSeconds)}
                        className="rounded-lg border border-white/20 px-3 py-1 text-xs font-semibold text-slate-200 transition hover:bg-white/10"
                      >
                        <Copy size={12} className="mr-1 inline" />
                        Copy
                      </button>
                    </div>
                  </div>
                  {showOpenedNote ? <p className="mt-2">{openedCard.notes}</p> : null}
                </div>
              ) : null}
            </div>
            <div className="sticky bottom-0 mt-6 flex gap-2 border-t border-white/10 bg-slate-900/95 pt-4 backdrop-blur">
              {mode !== 'trash' ? (
                <button
                  type="button"
                  onClick={() => {
                    setEditing(openedCard)
                    setIsFormOpen(true)
                    setOpenedCard(undefined)
                    setShowOpenedPassword(false)
                    setShowOpenedNote(false)
                  }}
                  className="rounded-xl border border-white/20 px-4 py-2 text-sm font-semibold text-slate-200 transition hover:bg-white/10"
                >
                  <Pencil size={14} className="mr-2 inline" />
                  Edit
                </button>
              ) : null}
              <button
                type="button"
                onClick={() => {
                  setPendingDeleteId(openedCard.id)
                  setOpenedCard(undefined)
                  setShowOpenedPassword(false)
                  setShowOpenedNote(false)
                }}
                className="rounded-xl border border-rose-400/40 px-4 py-2 text-sm font-semibold text-rose-300 transition hover:bg-rose-500/10"
              >
                <Trash2 size={14} className="mr-2 inline" />
                Delete
              </button>
              <button
                type="button"
                onClick={() => {
                  setOpenedCard(undefined)
                  setShowOpenedPassword(false)
                  setShowOpenedNote(false)
                }}
                className="rounded-xl bg-indigo-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-400"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {pendingDeleteId ? (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-950/70 p-4">
          <div className="w-full max-w-sm rounded-xl border border-white/10 bg-slate-900 p-5">
            <h3 className="text-base font-semibold text-slate-100">Are you sure?</h3>
            <p className="mt-2 text-sm text-slate-300">Do you want to delete this card?</p>
            <div className="mt-4 flex gap-2">
              <button
                type="button"
                onClick={() => {
                  if (mode === 'trash') deletePermanent(pendingDeleteId)
                  else softDelete(pendingDeleteId)
                  setPendingDeleteId(null)
                }}
                className="rounded-lg bg-rose-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-rose-400"
              >
                Yes
              </button>
              <button
                type="button"
                onClick={() => setPendingDeleteId(null)}
                className="rounded-lg border border-white/20 px-4 py-2 text-sm font-semibold text-slate-200 transition hover:bg-white/10"
              >
                No
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  )
}
