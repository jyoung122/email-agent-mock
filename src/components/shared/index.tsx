import { type ButtonHTMLAttributes, type ReactNode, useEffect, useId, useRef } from 'react'
import { CheckCircle2, Info, X, XCircle } from 'lucide-react'
import './shared.css'

export type BadgeTone = 'info' | 'review' | 'specialist' | 'success' | 'danger' | 'neutral'

const badgeToneFor = (label: string): BadgeTone => {
  const value = label.toLowerCase()
  if (['approved', 'released', 'delivered', 'valid', 'grounded'].includes(value)) return 'success'
  if (['held', 'invalid', 'emergency hold'].includes(value)) return 'danger'
  if (['specialist review', 'escalated'].includes(value)) return 'specialist'
  if (['qa required', 'form review required', 'missing information', 'staged'].includes(value)) return 'review'
  if (['superseded', 'expired', 'paused'].includes(value)) return 'neutral'
  return 'info'
}

export function Badge({ children, tone, className = '' }: { children: ReactNode; tone?: BadgeTone; className?: string }) {
  const label = typeof children === 'string' ? children : ''
  return <span className={`ora-badge ora-badge--${tone ?? badgeToneFor(label)} ${className}`.trim()}>{children}</span>
}

export type ButtonVariant = 'primary' | 'secondary' | 'quiet' | 'danger'
export function Button({ variant = 'secondary', className = '', children, ...props }: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: ButtonVariant }) {
  return <button type="button" className={`ora-button ora-button--${variant} ${className}`.trim()} {...props}>{children}</button>
}

export function PageHeader({ title, subtitle, actions, className = '' }: { title: string; subtitle?: string; actions?: ReactNode; className?: string }) {
  return <header className={`ora-page-header ${className}`.trim()}>
    <div><h1>{title}</h1>{subtitle && <p>{subtitle}</p>}</div>
    {actions && <div className="ora-page-header__actions">{actions}</div>}
  </header>
}

export function MetricCard({ label, value, detail, trend, tone = 'blue' }: { label: string; value: ReactNode; detail?: string; trend?: string; tone?: 'blue' | 'green' | 'amber' | 'red' }) {
  return <section className={`ora-metric-card ora-metric-card--${tone}`} aria-label={`${label}: ${String(value)}`}>
    <span className="ora-metric-card__label">{label}</span>
    <strong className="ora-metric-card__value">{value}</strong>
    <div className="ora-metric-card__footer">{trend && <span className="ora-metric-card__trend">{trend}</span>}{detail && <span>{detail}</span>}</div>
  </section>
}

export function ConfidenceBar({ value, label = 'Confidence', className = '' }: { value: number; label?: string; className?: string }) {
  const clamped = Math.max(0, Math.min(100, value))
  const quality = clamped >= 90 ? 'High' : clamped >= 75 ? 'Medium' : 'Review'
  return <div className={`ora-confidence ${className}`.trim()}>
    <div className="ora-confidence__labels"><span>{label}</span><strong>{clamped}% · {quality}</strong></div>
    <div className="ora-confidence__track" aria-label={`${label} ${clamped}% ${quality}`} role="progressbar" aria-valuenow={clamped} aria-valuemin={0} aria-valuemax={100}>
      <span className={`ora-confidence__fill ora-confidence__fill--${quality.toLowerCase()}`} style={{ width: `${clamped}%` }} />
    </div>
  </div>
}

export function Modal({ open, title, children, onClose, footer, destructive = false }: { open: boolean; title: string; children: ReactNode; onClose: () => void; footer?: ReactNode; destructive?: boolean }) {
  const titleId = useId()
  const dialogRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!open) return
    const previous = document.activeElement as HTMLElement | null
    const dialog = dialogRef.current
    const first = dialog?.querySelector<HTMLElement>('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])')
    first?.focus()
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') { onClose(); return }
      if (event.key !== 'Tab' || !dialog) return
      const nodes = Array.from(dialog.querySelectorAll<HTMLElement>('button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'))
      if (!nodes.length) return
      const firstNode = nodes[0]; const lastNode = nodes[nodes.length - 1]
      if (event.shiftKey && document.activeElement === firstNode) { event.preventDefault(); lastNode.focus() }
      if (!event.shiftKey && document.activeElement === lastNode) { event.preventDefault(); firstNode.focus() }
    }
    document.addEventListener('keydown', onKeyDown)
    return () => { document.removeEventListener('keydown', onKeyDown); previous?.focus() }
  }, [open, onClose])
  if (!open) return null
  return <div className="ora-modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose() }}>
    <div className="ora-modal" role="dialog" aria-modal="true" aria-labelledby={titleId} ref={dialogRef}>
      <div className="ora-modal__head"><div><span className={`ora-modal__icon ${destructive ? 'ora-modal__icon--danger' : ''}`}>{destructive ? <XCircle size={20} /> : <Info size={20} />}</span><h2 id={titleId}>{title}</h2></div><Button variant="quiet" className="ora-icon-button" aria-label="Close dialog" onClick={onClose}><X size={18} /></Button></div>
      <div className="ora-modal__body">{children}</div>{footer && <div className="ora-modal__footer">{footer}</div>}
    </div>
  </div>
}

export function Drawer({ open, title, children, onClose, footer }: { open: boolean; title: string; children: ReactNode; onClose: () => void; footer?: ReactNode }) {
  if (!open) return null
  return <div className="ora-drawer-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose() }}>
    <aside className="ora-drawer" aria-label={title} role="dialog" aria-modal="true"><div className="ora-drawer__head"><h2>{title}</h2><Button variant="quiet" className="ora-icon-button" aria-label="Close panel" onClick={onClose}><X size={18} /></Button></div><div className="ora-drawer__body">{children}</div>{footer && <div className="ora-drawer__footer">{footer}</div>}</aside>
  </div>
}

export type ToastMessage = { id: string; title: string; detail?: string; tone?: 'success' | 'info' | 'danger' }
export function ToastRegion({ toasts, dismiss }: { toasts: ToastMessage[]; dismiss: (id: string) => void }) {
  return <div className="ora-toast-region" role="status" aria-live="polite">{toasts.map((toast) => <div className={`ora-toast ora-toast--${toast.tone ?? 'success'}`} key={toast.id}><span>{toast.tone === 'danger' ? <XCircle size={18} /> : toast.tone === 'info' ? <Info size={18} /> : <CheckCircle2 size={18} />}</span><div><strong>{toast.title}</strong>{toast.detail && <p>{toast.detail}</p>}</div><Button variant="quiet" className="ora-icon-button" aria-label={`Dismiss ${toast.title}`} onClick={() => dismiss(toast.id)}><X size={16} /></Button></div>)}</div>
}
