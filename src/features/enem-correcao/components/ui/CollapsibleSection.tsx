import { type ReactNode } from 'react'
import { ChevronDown } from './icons'

interface CollapsibleSectionProps {
  title: string
  subtitle?: string
  isOpen: boolean
  onToggle: () => void
  children: ReactNode
  badge?: ReactNode
  className?: string
}

export function CollapsibleSection({
  title,
  subtitle,
  isOpen,
  onToggle,
  children,
  badge,
  className = '',
}: CollapsibleSectionProps) {
  return (
    <div className={`section-card ${className}`}>
      <button
        type="button"
        className="section-header w-full text-left"
        onClick={onToggle}
        aria-expanded={isOpen}
      >
        <div className="flex flex-col gap-0.5">
          <span className="font-display font-700 text-base text-surface-100">{title}</span>
          {subtitle && <span className="text-xs text-surface-500">{subtitle}</span>}
        </div>
        <div className="flex items-center gap-2">
          {badge}
          <ChevronDown
            className={`w-4 h-4 text-surface-500 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          />
        </div>
      </button>

      <div
        className={`overflow-hidden transition-all duration-250 ${isOpen ? 'animate-slide-down' : 'hidden'}`}
      >
        {children}
      </div>
    </div>
  )
}
