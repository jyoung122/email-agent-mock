import { useMemo, useState } from 'react'
import { ChevronDown, Filter, Inbox, RefreshCw, Search, SlidersHorizontal, X } from 'lucide-react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Badge, Button, PageHeader } from '../components/shared'
import { useDemo } from '../context/DemoContext'
import { PRIMARY_TRANSCRIPT_EMAIL_ID } from '../data/mockData'
import type { EmailMessage, RiskLevel } from '../types'
import './work-pages.css'

const riskTone = (risk: RiskLevel) => risk === 'High' ? 'danger' : risk === 'Medium' ? 'review' : 'neutral'

export default function WorkQueuePage() {
  const { state } = useDemo()
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const [toast, setToast] = useState('')
  const [moreOpen, setMoreOpen] = useState(false)
  const filter = (name: string) => searchParams.get(name) ?? ''
  const setFilter = (name: string, value: string) => {
    const next = new URLSearchParams(searchParams)
    if (value) next.set(name, value); else next.delete(name)
    setSearchParams(next, { replace: true })
  }
  const names = useMemo(() => ({
    institution: new Map(state.institutions.map((item) => [item.id, item.shortName])),
    department: new Map(state.departments.map((item) => [item.id, item.name])),
    mailbox: new Map(state.mailboxes.map((item) => [item.id, item.name])),
    user: new Map(state.users.map((item) => [item.id, item.name])),
  }), [state])
  const options = useMemo(() => ({
    statuses: Array.from(new Set(state.emails.map((item) => item.status))),
    requestTypes: Array.from(new Set(state.emails.map((item) => item.requestType))).sort(),
    qa: Array.from(new Set(state.emails.map((item) => item.qaStatus))),
  }), [state.emails])
  const filtered = state.emails.filter((email) => {
    const query = filter('q').toLowerCase()
    const matchesQuery = !query || [email.sender, email.subject, email.requestType, names.mailbox.get(email.mailboxId) ?? ''].some((value) => value.toLowerCase().includes(query))
    return matchesQuery && (!filter('institution') || email.institutionId === filter('institution')) && (!filter('department') || email.departmentId === filter('department')) && (!filter('mailbox') || email.mailboxId === filter('mailbox')) && (!filter('status') || email.status === filter('status')) && (!filter('risk') || email.risk === filter('risk')) && (!filter('qa') || email.qaStatus === filter('qa')) && (!filter('requestType') || email.requestType === filter('requestType')) && (!filter('assigned') || email.assignedUserId === filter('assigned'))
  })
  const activeCount = Array.from(searchParams.keys()).filter((key) => key !== 'q').length
  const attention = state.emails.filter((item) => ['QA Required', 'Form Review Required', 'Missing Information', 'Specialist Review', 'Escalated', 'Held'].includes(item.status)).length
  const clearFilters = () => setSearchParams({}, { replace: true })
  const openEmail = (email: EmailMessage) => navigate(`/work-queue/${email.id}?${new URLSearchParams({ returnTo: searchParams.toString() }).toString()}`)
  const notify = (message: string) => { setToast(message); window.setTimeout(() => setToast(''), 3500) }

  return <div className="page page--wide work-page">
    <PageHeader title="Work Queue" subtitle={`${attention} items require attention across the fictional network.`} actions={<Button onClick={() => notify('Queue refreshed from local demonstration data.')}><RefreshCw size={15} />Refresh simulation</Button>} />
    <section className="queue-kpis" aria-label="Queue summary">
      <div><span>Requires attention</span><strong>{attention}</strong></div>
      <div><span>Random QA</span><strong>{state.emails.filter((item) => item.qaStatus === 'Selected for QA' || item.qaStatus === 'Random sample').length}</strong></div>
      <div><span>Mandatory review</span><strong>{state.emails.filter((item) => item.qaStatus === 'Mandatory review').length}</strong></div>
      <div><span>Form issues</span><strong>{state.forms.filter((item) => item.reviewStatus !== 'Approved').length}</strong></div>
      <div><span>Held</span><strong>{state.emails.filter((item) => item.status === 'Held').length}</strong></div>
    </section>
    <section className="panel queue-panel" data-tour="work-queue-primary">
      <div className="queue-filters">
        <label className="queue-search"><Search size={16} aria-hidden="true" /><span className="sr-only">Search queue</span><input value={filter('q')} onChange={(event) => setFilter('q', event.target.value)} placeholder="Search sender, subject, mailbox…" /></label>
        <label><span className="sr-only">Institution</span><select value={filter('institution')} onChange={(event) => setFilter('institution', event.target.value)}><option value="">All institutions</option>{state.institutions.map((item) => <option key={item.id} value={item.id}>{item.shortName}</option>)}</select><ChevronDown size={14} /></label>
        <label><span className="sr-only">Department</span><select value={filter('department')} onChange={(event) => setFilter('department', event.target.value)}><option value="">All departments</option>{state.departments.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select><ChevronDown size={14} /></label>
        <label><span className="sr-only">Status</span><select value={filter('status')} onChange={(event) => setFilter('status', event.target.value)}><option value="">All statuses</option>{options.statuses.map((item) => <option key={item}>{item}</option>)}</select><ChevronDown size={14} /></label>
        <label><span className="sr-only">Risk</span><select value={filter('risk')} onChange={(event) => setFilter('risk', event.target.value)}><option value="">All risk levels</option><option>Low</option><option>Medium</option><option>High</option></select><ChevronDown size={14} /></label>
        <div className="more-filter-wrap"><Button onClick={() => setMoreOpen((open) => !open)}><SlidersHorizontal size={15} />More filters{activeCount > 0 && <span className="filter-count">{activeCount}</span>}</Button>{moreOpen && <div className="more-filter-popover"><label>Mailbox<select value={filter('mailbox')} onChange={(event) => setFilter('mailbox', event.target.value)}><option value="">Any mailbox</option>{state.mailboxes.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select></label><label>QA reason<select value={filter('qa')} onChange={(event) => setFilter('qa', event.target.value)}><option value="">Any QA reason</option>{options.qa.map((item) => <option key={item}>{item}</option>)}</select></label><label>Request type<select value={filter('requestType')} onChange={(event) => setFilter('requestType', event.target.value)}><option value="">Any request type</option>{options.requestTypes.map((item) => <option key={item}>{item}</option>)}</select></label><label>Assigned user<select value={filter('assigned')} onChange={(event) => setFilter('assigned', event.target.value)}><option value="">Anyone</option><option value="unassigned">Unassigned</option>{state.users.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select></label></div>}</div>
      </div>
      {activeCount > 0 && <div className="active-filters"><Filter size={14} /><span>{activeCount} active filter{activeCount === 1 ? '' : 's'}</span><button type="button" onClick={clearFilters}><X size={13} />Clear all</button></div>}
      <div className="queue-table-meta"><span>Showing <strong>{filtered.length}</strong> of {state.emails.length} messages</span><span>Received today · Fictional data</span></div>
      <div className="data-table-wrap queue-table-wrap">
        <table className="data-table queue-table">
          <thead><tr><th>Sender / subject</th><th>Institution</th><th>Department</th><th>Mailbox</th><th>Request type</th><th>Status</th><th>Risk</th><th>QA status</th><th>Scheduled delivery</th><th>Assigned user</th><th>Received</th></tr></thead>
          <tbody>{filtered.map((email) => <tr key={email.id} className={email.id === PRIMARY_TRANSCRIPT_EMAIL_ID ? 'primary-scenario-row' : ''} tabIndex={0} onClick={() => openEmail(email)} onKeyDown={(event) => { if (event.key === 'Enter') openEmail(email) }} aria-label={`Open ${email.subject} from ${email.sender}`}><td className="queue-identity"><strong>{email.sender}</strong><span>{email.subject}</span>{email.assessment.warnings.length > 0 && <small>{email.assessment.warnings[0]}</small>}</td><td>{names.institution.get(email.institutionId)}</td><td>{names.department.get(email.departmentId)}</td><td>{names.mailbox.get(email.mailboxId)}</td><td>{email.requestType}</td><td><Badge>{email.status === 'Released' ? 'Delivered' : email.status}</Badge></td><td><Badge tone={riskTone(email.risk)}>{email.risk} risk</Badge></td><td><span className="qa-cell">{email.qaStatus}</span></td><td className="numeric date-cell">{email.scheduledReleaseAt ?? '—'}</td><td>{email.assignedUserId ? names.user.get(email.assignedUserId) : <span className="muted">Unassigned</span>}</td><td className="numeric">{email.receivedAt.replace('Aug 2, 2026 · ', '')}</td></tr>)}</tbody>
        </table>
      </div>
      {filtered.length === 0 && <div className="empty-state"><Inbox size={32} /><h3>No messages match these filters</h3><p>Clear one or more filters to return to the fictional work queue.</p><Button onClick={clearFilters}>Clear filters</Button></div>}
    </section>
    {toast && <div className="toast-local" role="status">{toast}</div>}
  </div>
}
