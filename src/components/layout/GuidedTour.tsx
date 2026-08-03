import { useEffect, useState } from 'react'
import { ArrowLeft, ArrowRight, Check, Sparkles, X } from 'lucide-react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Button } from '../shared'
import './guided-tour.css'

type TourStep = {
  path: string
  selector: string
  eyebrow: string
  title: string
  description: string
  businessValue: string
}

type TargetRect = { top: number; right: number; bottom: number; left: number; width: number; height: number }

const guidedTourSteps: TourStep[] = [
  {
    path: '/',
    selector: '[data-tour="dashboard-overview"]',
    eyebrow: 'Operating picture',
    title: 'See the whole correspondence operation',
    description: 'Start with volume, automation, QA, response time, and exceptions across the fictional network.',
    businessValue: 'Leaders get one view of service health and can spot backlog or control issues before they become student-facing problems.',
  },
  {
    path: '/work-queue',
    selector: '[data-tour="work-queue-primary"] .primary-scenario-row .queue-identity',
    eyebrow: 'Prioritized intake',
    title: 'Bring every request into one work queue',
    description: 'The highlighted transcript request combines email context, risk, QA status, assignment, and release timing.',
    businessValue: 'Teams stop triaging disconnected inboxes and can focus first on work that needs judgment or missing-information follow-up.',
  },
  {
    path: '/work-queue/email-transcript-001',
    selector: '.draft-panel',
    eyebrow: 'Evidence-backed response',
    title: 'Review the proposed response in context',
    description: 'The workbench keeps the incoming request, editable response, approved knowledge, QA reason, and audit history together.',
    businessValue: 'Reviewers can make a faster, defensible decision without switching between mailbox, policy, and drafting tools.',
  },
  {
    path: '/work-queue/email-transcript-001',
    selector: '.attachment-stack',
    eyebrow: 'Attachment pipeline',
    title: 'Classify documents against configured forms',
    description: 'Each attachment shows its predicted form, confidence, extraction state, and validation state. Select a card after the tour to open the full review modal.',
    businessValue: 'Configured institutional forms become the ground truth, making document classification and extracted fields reviewable instead of opaque.',
  },
  {
    path: '/release-queue',
    selector: '[data-tour="release-queue-batches"]',
    eyebrow: 'Controlled delivery',
    title: 'Release only after safeguards are satisfied',
    description: 'Locked batches expose mandatory review, random QA, approved, held, ready, and scheduled populations before simulated delivery.',
    businessValue: 'Operations can scale automation while preserving independent QA selection, release holds, and a clear approval boundary.',
  },
  {
    path: '/knowledge',
    selector: '.knowledge-toolbar',
    eyebrow: 'Governed knowledge',
    title: 'Make approved guidance traceable',
    description: 'Knowledge sources carry owners, status, effective dates, versions, and affected-draft counts.',
    businessValue: 'Policy changes can be reviewed against staged work, reducing outdated or inconsistent language in institutional responses.',
  },
  {
    path: '/agent-controls',
    selector: '.mode-grid',
    eyebrow: 'Risk-based controls',
    title: 'Tune automation to institutional risk',
    description: 'Operating mode, automation thresholds, QA rates, confidence gates, and release safeguards are explicit and scoped.',
    businessValue: 'Administrators can increase oversight when risk changes without redesigning the workflow or losing the audit trail.',
  },
]

type GuidedTourProps = {
  stepIndex: number
  onStepChange: (step: number) => void
  onClose: () => void
}

const clamp = (value: number, minimum: number, maximum: number) => Math.min(Math.max(value, minimum), maximum)

export default function GuidedTour({ stepIndex, onStepChange, onClose }: GuidedTourProps) {
  const navigate = useNavigate()
  const location = useLocation()
  const [targetRect, setTargetRect] = useState<TargetRect | null>(null)
  const [targetMissing, setTargetMissing] = useState(false)
  const step = guidedTourSteps[stepIndex]
  const isLastStep = stepIndex === guidedTourSteps.length - 1

  useEffect(() => {
    if (location.pathname !== step.path) navigate(step.path)
  }, [location.pathname, navigate, step.path])

  useEffect(() => {
    setTargetRect(null)
    setTargetMissing(false)
    let cancelled = false
    let attempts = 0
    let retryTimer = 0

    const locateTarget = () => {
      if (cancelled) return
      const target = document.querySelector<HTMLElement>(step.selector)
      if (!target) {
        attempts += 1
        if (attempts < 12) retryTimer = window.setTimeout(locateTarget, 60)
        else setTargetMissing(true)
        return
      }
      if (attempts === 0) target.scrollIntoView({ block: 'center', inline: 'nearest' })
      const rect = target.getBoundingClientRect()
      const padding = 8
      const top = clamp(rect.top - padding, 6, window.innerHeight - 6)
      const right = clamp(rect.right + padding, 6, window.innerWidth - 6)
      const bottom = clamp(rect.bottom + padding, 6, window.innerHeight - 6)
      const left = clamp(rect.left - padding, 6, window.innerWidth - 6)
      setTargetRect({
        top,
        right,
        bottom,
        left,
        width: Math.max(0, right - left),
        height: Math.max(0, bottom - top),
      })
      setTargetMissing(false)
    }

    const scheduleLocate = () => window.requestAnimationFrame(locateTarget)
    const startTimer = window.setTimeout(locateTarget, location.pathname === step.path ? 20 : 100)
    window.addEventListener('resize', scheduleLocate)
    window.addEventListener('scroll', scheduleLocate, true)
    return () => {
      cancelled = true
      window.clearTimeout(startTimer)
      window.clearTimeout(retryTimer)
      window.removeEventListener('resize', scheduleLocate)
      window.removeEventListener('scroll', scheduleLocate, true)
    }
  }, [location.pathname, step.path, step.selector])

  useEffect(() => {
    document.querySelector<HTMLButtonElement>('[data-tour-next="true"]')?.focus()
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
      if (event.key === 'ArrowLeft' && stepIndex > 0) { event.preventDefault(); onStepChange(stepIndex - 1) }
      if (event.key === 'ArrowRight') {
        event.preventDefault()
        if (isLastStep) onClose()
        else onStepChange(stepIndex + 1)
      }
      if (event.key === 'Tab') {
        const card = document.querySelector<HTMLElement>('.guided-tour__card')
        const focusable = Array.from(card?.querySelectorAll<HTMLElement>('button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])') ?? [])
        if (!focusable.length) return
        const first = focusable[0]
        const last = focusable[focusable.length - 1]
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus() }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus() }
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isLastStep, onClose, onStepChange, stepIndex])

  const viewportWidth = window.innerWidth
  const viewportHeight = window.innerHeight
  const cardWidth = Math.min(392, viewportWidth - 32)
  const cardHeightEstimate = 420
  const cardStyle = (() => {
    if (!targetRect || targetMissing) return { width: cardWidth }
    const gap = 14
    const maximumLeft = Math.max(16, viewportWidth - cardWidth - 16)
    const maximumTop = Math.max(16, viewportHeight - cardHeightEstimate - 16)
    if (viewportWidth - targetRect.right >= cardWidth + gap + 16) {
      return { width: cardWidth, left: targetRect.right + gap, top: clamp(targetRect.top, 16, maximumTop) }
    }
    if (targetRect.left >= cardWidth + gap + 16) {
      return { width: cardWidth, left: targetRect.left - cardWidth - gap, top: clamp(targetRect.top, 16, maximumTop) }
    }
    if (viewportHeight - targetRect.bottom >= cardHeightEstimate + gap + 16) {
      return { width: cardWidth, left: clamp(targetRect.left, 16, maximumLeft), top: targetRect.bottom + gap }
    }
    return {
      width: cardWidth,
      left: clamp(targetRect.left, 16, maximumLeft),
      top: clamp(targetRect.top - cardHeightEstimate - gap, 16, maximumTop),
    }
  })()

  const goNext = () => {
    if (isLastStep) onClose()
    else onStepChange(stepIndex + 1)
  }

  return <div className={`guided-tour${targetRect && !targetMissing ? ' has-target' : ' is-centered'}`} aria-live="polite">
    {targetRect && !targetMissing
      ? <div className="guided-tour__spotlight" aria-hidden="true" style={{ top: targetRect.top, left: targetRect.left, width: targetRect.width, height: targetRect.height }} />
      : <div className="guided-tour__backdrop" aria-hidden="true" />}
    <section className="guided-tour__card" style={cardStyle} role="dialog" aria-modal="true" aria-labelledby="guided-tour-title" aria-describedby="guided-tour-description">
      <header className="guided-tour__head">
        <span className="guided-tour__brand"><Sparkles size={15} /> Guided demo</span>
        <Button variant="quiet" aria-label="Exit guided demo" onClick={onClose}><X size={16} /> Exit</Button>
      </header>
      <div className="guided-tour__body">
        <div className="guided-tour__progress"><span>Step {stepIndex + 1} of {guidedTourSteps.length}</span><div aria-hidden="true">{guidedTourSteps.map((_, index) => <i className={index <= stepIndex ? 'is-complete' : ''} key={index} />)}</div></div>
        <p className="guided-tour__eyebrow">{step.eyebrow}</p>
        <h2 id="guided-tour-title">{step.title}</h2>
        <p id="guided-tour-description">{step.description}</p>
        <div className="guided-tour__value"><strong>Why it matters</strong><span>{step.businessValue}</span></div>
        {targetMissing && <p className="guided-tour__fallback">This screen loaded without the expected highlight. The explanation is still available, and you can continue safely.</p>}
      </div>
      <footer className="guided-tour__footer">
        <span className="guided-tour__keys">← → to navigate · Esc to exit</span>
        <div>
          <Button onClick={() => onStepChange(stepIndex - 1)} disabled={stepIndex === 0}><ArrowLeft size={15} />Back</Button>
          <Button data-tour-next="true" variant="primary" onClick={goNext}>{isLastStep ? <><Check size={15} />Finish</> : <>{targetMissing ? 'Continue' : 'Next'}<ArrowRight size={15} /></>}</Button>
        </div>
      </footer>
    </section>
  </div>
}
