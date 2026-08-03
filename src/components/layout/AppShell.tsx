import { useState } from 'react'
import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { BookOpen, ChartNoAxesCombined, ChevronDown, CircleHelp, Inbox, LayoutDashboard, Lightbulb, RotateCcw, Send, Settings, SlidersHorizontal } from 'lucide-react'
import { Button, Modal } from '../shared'
import { guideForPath } from './screenGuides'
import './shell.css'
import './screen-guide.css'

type ShellCounts = { workQueue?: number; releaseQueue?: number }
export type AppShellProps = { counts?: ShellCounts; onResetDemo?: () => void; institution?: string; department?: string; onInstitutionChange?: (value: string) => void; onDepartmentChange?: (value: string) => void }

type NavCount = keyof ShellCounts
type NavigationItem = { to: string; label: string; icon: typeof LayoutDashboard; count?: NavCount }
type NavigationGroup = { label: string; items: NavigationItem[] }

const navGroups: NavigationGroup[] = [
  { label: 'Operations', items: [{ to: '/', label: 'Program Dashboard', icon: LayoutDashboard }, { to: '/work-queue', label: 'Work Queue', icon: Inbox, count: 'workQueue' }, { to: '/release-queue', label: 'Release Queue', icon: Send, count: 'releaseQueue' }] },
  { label: 'Governance', items: [{ to: '/agent-controls', label: 'Agent Controls', icon: SlidersHorizontal }, { to: '/knowledge', label: 'Knowledge', icon: BookOpen }, { to: '/reporting', label: 'Reporting', icon: ChartNoAxesCombined }, { to: '/administration', label: 'Administration', icon: Settings }] },
]

export default function AppShell({ counts = {}, onResetDemo, institution = 'All institutions', department = 'Registrar', onInstitutionChange, onDepartmentChange }: AppShellProps) {
  const [confirmReset, setConfirmReset] = useState(false)
  const [showGuide, setShowGuide] = useState(false)
  const location = useLocation()
  const guide = guideForPath(location.pathname)
  const reset = () => { onResetDemo?.(); setConfirmReset(false) }
  return <div className="ssi-app-shell">
    <a className="ssi-skip-link" href="#main-content">Skip to main content</a>
    <div className="ssi-demo-banner">Demonstration Environment — Fictional Data</div>
    <aside className="ssi-sidebar" aria-label="Primary navigation">
      <div className="ssi-brand"><span className="ssi-brand__mark" aria-hidden="true">SSI</span><div className="ssi-brand__wordmark"><strong>SSI Correspondence</strong><span>Operations Console</span></div></div>
      <nav>{navGroups.map((group) => <section className="ssi-nav-group" key={group.label}><h2>{group.label}</h2>{group.items.map((item) => { const Icon = item.icon; const count = item.count ? counts[item.count] : undefined; return <NavLink end={item.to === '/'} to={item.to} className={({ isActive }) => `ssi-nav-link${isActive ? ' is-active' : ''}`} title={item.label} key={item.to}><Icon size={18} strokeWidth={1.8} /><span className="ssi-nav-link__label">{item.label}</span>{typeof count === 'number' && count > 0 && <span className="ssi-nav-count" aria-label={`${count} items requiring attention`}>{count}</span>}</NavLink> })}</section>)}</nav>
      <div className="ssi-sidebar__footer"><span className="ssi-status-dot" aria-hidden="true" /> <span>Local demo state</span></div>
    </aside>
    <div className="ssi-shell-content">
      <header className="ssi-topbar"><div className="ssi-scope-selectors"><label>Institution<select aria-label="Institution" value={institution} onChange={(event) => onInstitutionChange?.(event.target.value)}><option>All institutions</option><option>Northstar Fictional University</option><option>Riverbend Demonstration College</option><option>Harborview Sample Institute</option><option>Prairie Coast Test University</option></select><ChevronDown size={15} aria-hidden="true" /></label><label>Department<select aria-label="Department" value={department} onChange={(event) => onDepartmentChange?.(event.target.value)}><option>Registrar</option><option>Admissions</option><option>Financial Aid</option><option>Student Accounts</option><option>Human Resources</option></select><ChevronDown size={15} aria-hidden="true" /></label></div><div className="ssi-user-controls"><div className="ssi-user"><span className="ssi-avatar" aria-hidden="true">ML</span><span><strong>Morgan Lee</strong><small>Program Administrator</small></span></div><Button variant="quiet" className="ssi-screen-guide-button" onClick={() => setShowGuide(true)}><CircleHelp size={16} /> About this screen</Button><Button variant="quiet" className="ssi-reset-button" onClick={() => setConfirmReset(true)}><RotateCcw size={16} /> Reset Demo</Button></div></header>
      <main id="main-content" className="ssi-main"><Outlet /></main>
    </div>
    <Modal open={confirmReset} title="Reset demonstration?" destructive onClose={() => setConfirmReset(false)} footer={<><Button onClick={() => setConfirmReset(false)}>Cancel</Button><Button variant="danger" onClick={reset}><RotateCcw size={16} /> Reset Demo</Button></>}><p>This restores the original fictional fixture state across the console. Any simulated approvals, holds, edits, and policy changes will be discarded.</p></Modal>
    <Modal open={showGuide} title={`About ${guide.screen}`} onClose={() => setShowGuide(false)} footer={<Button variant="primary" onClick={() => setShowGuide(false)}>Got it</Button>}><p className="screen-guide-intro">{guide.purpose}</p><div className="screen-guide-grid"><section className="screen-guide-section screen-guide-section--wide"><h3>What is on this screen</h3><ul>{guide.exists.map((item) => <li key={item}>{item}</li>)}</ul></section><section className="screen-guide-section"><h3>Business case</h3><p>{guide.businessCase}</p></section><section className="screen-guide-section"><h3>Problem and pain solved</h3><p>{guide.painSolved}</p></section><section className="screen-guide-section screen-guide-section--wide"><h3>What could be added</h3><ul>{guide.additions.map((item) => <li key={item}>{item}</li>)}</ul></section></div><div className="screen-guide-next"><Lightbulb size={16} /><span><strong>Try this first:</strong> {guide.firstAction}</span></div></Modal>
  </div>
}
