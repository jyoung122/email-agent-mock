import { useRef, useState } from 'react'
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { BookOpen, BrainCircuit, ChartNoAxesCombined, ChevronDown, CircleHelp, Inbox, LayoutDashboard, Lightbulb, RotateCcw, Send, Settings, ShieldCheck, SlidersHorizontal, Sparkles } from 'lucide-react'
import { Button, Modal } from '../shared'
import GuidedTour from './GuidedTour'
import { guideForPath } from './screenGuides'
import './shell.css'
import './screen-guide.css'

type ShellCounts = { workQueue?: number; releaseQueue?: number }
export type AppShellProps = { counts?: ShellCounts; onResetDemo?: () => void; institution?: string; department?: string; onInstitutionChange?: (value: string) => void; onDepartmentChange?: (value: string) => void }

type NavCount = keyof ShellCounts
type NavigationItem = { to: string; label: string; icon: typeof LayoutDashboard; count?: NavCount }
type NavigationGroup = { label: string; items: NavigationItem[] }

const navGroups: NavigationGroup[] = [
  { label: 'Operations', items: [{ to: '/', label: 'Program Dashboard', icon: LayoutDashboard }, { to: '/work-queue', label: 'Work Queue', icon: Inbox, count: 'workQueue' }, { to: '/release-queue', label: 'Delivery Queue', icon: Send, count: 'releaseQueue' }] },
  { label: 'Governance', items: [{ to: '/agent-controls', label: 'Agent Controls', icon: SlidersHorizontal }, { to: '/knowledge', label: 'Knowledge', icon: BookOpen }, { to: '/improvement-queue', label: 'Improvement Queue', icon: BrainCircuit }, { to: '/reporting', label: 'Reporting', icon: ChartNoAxesCombined }, { to: '/administration', label: 'Administration', icon: Settings }] },
]

const welcomeStorageKey = 'ora-correspondence-welcome-dismissed-v1'
const isFirstVisit = () => {
  try { return window.localStorage.getItem(welcomeStorageKey) !== 'true' }
  catch { return true }
}

export default function AppShell({ counts = {}, onResetDemo, institution = 'All institutions', department = 'Registrar', onInstitutionChange, onDepartmentChange }: AppShellProps) {
  const [confirmReset, setConfirmReset] = useState(false)
  const [showGuide, setShowGuide] = useState(false)
  const [showWelcome, setShowWelcome] = useState(isFirstVisit)
  const [tourStep, setTourStep] = useState<number | null>(null)
  const tourInvokerRef = useRef<HTMLElement | null>(null)
  const location = useLocation()
  const navigate = useNavigate()
  const guide = guideForPath(location.pathname)
  const reset = () => { onResetDemo?.(); setConfirmReset(false) }
  const dismissWelcome = () => {
    try { window.localStorage.setItem(welcomeStorageKey, 'true') } catch { /* The modal still closes when storage is unavailable. */ }
    setShowWelcome(false)
  }
  const startWalkthrough = () => {
    tourInvokerRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null
    dismissWelcome()
    setShowGuide(false)
    setTourStep(0)
    navigate('/')
  }
  const closeWalkthrough = () => {
    setTourStep(null)
    window.requestAnimationFrame(() => {
      const fallback = document.querySelector<HTMLElement>('[data-start-guided-demo="true"]')
      const returnTarget = tourInvokerRef.current?.isConnected ? tourInvokerRef.current : fallback
      returnTarget?.focus()
    })
  }
  return <div className="ora-app-shell">
    <a className="ora-skip-link" href="#main-content">Skip to main content</a>
    <div className="ora-demo-banner">Demonstration Environment — Fictional Data</div>
    <aside className="ora-sidebar" aria-label="Primary navigation">
      <div className="ora-brand"><span className="ora-brand__mark" aria-hidden="true">ORA</span><div className="ora-brand__wordmark"><strong>ORA Correspondence</strong><span>Operations Console</span></div></div>
      <nav>{navGroups.map((group) => <section className="ora-nav-group" key={group.label}><h2>{group.label}</h2>{group.items.map((item) => { const Icon = item.icon; const count = item.count ? counts[item.count] : undefined; return <NavLink end={item.to === '/'} to={item.to} className={({ isActive }) => `ora-nav-link${isActive ? ' is-active' : ''}`} title={item.label} key={item.to}><Icon size={18} strokeWidth={1.8} /><span className="ora-nav-link__label">{item.label}</span>{typeof count === 'number' && count > 0 && <span className="ora-nav-count" aria-label={`${count} items requiring attention`}>{count}</span>}</NavLink> })}</section>)}</nav>
      <div className="ora-sidebar__footer"><span className="ora-status-dot" aria-hidden="true" /> <span>Local demo state</span></div>
    </aside>
    <div className="ora-shell-content">
      <header className="ora-topbar"><div className="ora-scope-selectors"><label>Institution<select aria-label="Institution" value={institution} onChange={(event) => onInstitutionChange?.(event.target.value)}><option>All institutions</option><option>Northstar Fictional University</option><option>Riverbend Demonstration College</option><option>Harborview Sample Institute</option><option>Prairie Coast Test University</option></select><ChevronDown size={15} aria-hidden="true" /></label><label>Department<select aria-label="Department" value={department} onChange={(event) => onDepartmentChange?.(event.target.value)}><option>Registrar</option><option>Admissions</option><option>Financial Aid</option><option>Student Accounts</option><option>Human Resources</option></select><ChevronDown size={15} aria-hidden="true" /></label></div><div className="ora-user-controls"><div className="ora-user"><span className="ora-avatar" aria-hidden="true">ML</span><span><strong>Morgan Lee</strong><small>Program Administrator</small></span></div><Button data-start-guided-demo="true" variant="quiet" className="ora-guided-demo-button" onClick={startWalkthrough}><Sparkles size={16} /> Start guided demo</Button><Button variant="quiet" className="ora-screen-guide-button" onClick={() => setShowGuide(true)}><CircleHelp size={16} /> About this screen</Button><Button variant="quiet" className="ora-reset-button" onClick={() => setConfirmReset(true)}><RotateCcw size={16} /> Reset Demo</Button></div></header>
      <main id="main-content" className="ora-main"><Outlet /></main>
    </div>
    <Modal open={confirmReset} title="Reset demonstration?" destructive onClose={() => setConfirmReset(false)} footer={<><Button onClick={() => setConfirmReset(false)}>Cancel</Button><Button variant="danger" onClick={reset}><RotateCcw size={16} /> Reset Demo</Button></>}><p>This restores the original fictional fixture state across the console. Any simulated approvals, holds, edits, and policy changes will be discarded.</p></Modal>
    <Modal open={showGuide} title={`About ${guide.screen}`} onClose={() => setShowGuide(false)} footer={<Button variant="primary" onClick={() => setShowGuide(false)}>Got it</Button>}><p className="screen-guide-intro">{guide.purpose}</p><div className="screen-guide-grid"><section className="screen-guide-section screen-guide-section--wide"><h3>What is on this screen</h3><ul>{guide.exists.map((item) => <li key={item}>{item}</li>)}</ul></section><section className="screen-guide-section"><h3>Business case</h3><p>{guide.businessCase}</p></section><section className="screen-guide-section"><h3>Problem and pain solved</h3><p>{guide.painSolved}</p></section><section className="screen-guide-section screen-guide-section--wide"><h3>What could be added</h3><ul>{guide.additions.map((item) => <li key={item}>{item}</li>)}</ul></section></div><div className="screen-guide-next"><Lightbulb size={16} /><span><strong>Try this first:</strong> {guide.firstAction}</span></div></Modal>
    <Modal open={showWelcome} title="Welcome to ORA Correspondence" onClose={dismissWelcome} footer={<><Button onClick={dismissWelcome}>Explore current screen</Button><Button variant="primary" onClick={startWalkthrough}><Sparkles size={16} />Start guided demo</Button></>}><div className="welcome-demo"><p className="welcome-demo__intro">This interactive mock shows how institutions can turn high-volume email and document intake into a controlled, evidence-backed correspondence workflow.</p><section className="welcome-demo__problem"><h3>The business problem</h3><p>Teams currently triage shared mailboxes, inspect attachments, rekey form data, find approved policy language, and coordinate QA across disconnected tools. That creates slow responses, inconsistent decisions, and limited oversight.</p></section><div className="welcome-demo__flow" aria-label="Recommended demonstration walkthrough"><article><span>1</span><div><strong>Review the request</strong><p>Open the highlighted transcript email in Work Queue.</p></div></article><article><span>2</span><div><strong>Inspect the attachments</strong><p>Classify the PDF, validate extracted fields, and compare the unmatched image.</p></div></article><article><span>3</span><div><strong>Control the outcome</strong><p>Approve the response, inspect its delivery batch, then demonstrate policy-change safeguards.</p></div></article></div><div className="welcome-demo__boundary"><ShieldCheck size={18} /><span><strong>Safe demonstration environment</strong><small>Everything is fictional and browser-local. No email is sent, no live AI runs, and Reset Demo restores the original state.</small></span></div><p className="welcome-demo__help"><CircleHelp size={15} />Use <strong>About this screen</strong> in the header whenever you need contextual guidance.</p></div></Modal>
    {tourStep !== null && <GuidedTour stepIndex={tourStep} onStepChange={setTourStep} onClose={closeWalkthrough} />}
  </div>
}
