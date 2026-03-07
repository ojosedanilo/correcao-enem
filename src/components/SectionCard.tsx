import { useState, type ReactNode } from 'react'

interface SectionCardProps {
  title: string
  children: ReactNode
  defaultOpen?: boolean
  badge?: string
}

export default function SectionCard({ title, children, defaultOpen = true, badge }: SectionCardProps) {
  const [open, setOpen] = useState(defaultOpen)

  return (
    <section className="card overflow-hidden">
      <button
        className="w-full flex items-center justify-between gap-3 px-5 py-4
                   hover:bg-surface-700/40 transition-colors duration-150 group"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
      >
        <div className="flex items-center gap-3">
          <h2 className="font-display font-700 text-base text-slate-100">{title}</h2>
          {badge && (
            <span className="text-xs bg-brand-900/50 text-brand-400 border border-brand-800/60 px-2 py-0.5 rounded-full">
              {badge}
            </span>
          )}
        </div>
        <svg
          className={`w-4 h-4 text-slate-500 group-hover:text-slate-300 transition-all duration-200 shrink-0 ${open ? '' : '-rotate-90'}`}
          fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      <div className={`section-content ${open ? '' : 'collapsed'}`} style={open ? { maxHeight: '9999px', opacity: 1 } : {}}>
        <div className="px-5 pb-5 border-t border-surface-700">
          {children}
        </div>
      </div>
    </section>
  )
}
