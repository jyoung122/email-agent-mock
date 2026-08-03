import { useMemo, useState } from 'react'
import { AlertTriangle, Search, ShieldAlert } from 'lucide-react'
import { Badge, Button, Drawer, Modal, PageHeader } from '../components/shared'
import { useDemo } from '../context/DemoContext'
import { TRANSCRIPT_KNOWLEDGE_ID } from '../data/mockData'
import type { KnowledgeSource } from '../types'
import './operations-pages.css'

type Impact = 'revalidate' | 'increase-qa' | 'hold-batch' | 'continue'
const impactOptions: Array<{ id: Impact; title: string; detail: string }> = [
  { id: 'revalidate', title: 'Revalidate drafts', detail: 'Re-run the simulated policy check for affected staged responses.' },
  { id: 'increase-qa', title: 'Increase QA to 100%', detail: 'Require human QA for all affected staged drafts and hold them.' },
  { id: 'hold-batch', title: 'Hold release batch', detail: 'Pause the affected Registrar batch until a reviewer decides.' },
  { id: 'continue', title: 'Continue with current settings', detail: 'Record the knowledge change while retaining the current release configuration.' },
]

const toneFor = (status: KnowledgeSource['status']) => status === 'Approved' ? 'success' : status === 'Under Review' || status === 'Pending Approval' ? 'review' : status === 'Expired' ? 'danger' : 'neutral'

export default function KnowledgePage() {
  const { state, actions } = useDemo()
  const [search, setSearch] = useState('')
  const [department, setDepartment] = useState('All departments')
  const [status, setStatus] = useState('All statuses')
  const [articleId, setArticleId] = useState('')
  const [impactOpen, setImpactOpen] = useState(false)
  const [choice, setChoice] = useState<Impact>('increase-qa')
  const [toast, setToast] = useState('')
  const article = state.knowledge.find((item) => item.id === articleId)
  const filtered = useMemo(() => state.knowledge.filter((item) => {
    const term = search.toLowerCase()
    const departmentName = state.departments.find((entry) => entry.id === item.departmentId)?.name ?? ''
    return (!term || `${item.title} ${item.topics.join(' ')} ${departmentName}`.toLowerCase().includes(term)) && (department === 'All departments' || departmentName === department) && (status === 'All statuses' || item.status === status)
  }), [department, search, state.departments, state.knowledge, status])
  const names = { department: (id: string) => state.departments.find((item) => item.id === id)?.name ?? '—', institution: (id: string) => state.institutions.find((item) => item.id === id)?.shortName ?? '—', owner: (id: string) => state.users.find((item) => item.id === id)?.name ?? '—' }
  const notify = (message: string) => { setToast(message); window.setTimeout(() => setToast(''), 4200) }
  const transcript = state.knowledge.find((item) => item.id === TRANSCRIPT_KNOWLEDGE_ID)
  const triggerImpact = () => { actions.markKnowledgeChanged(TRANSCRIPT_KNOWLEDGE_ID); setImpactOpen(true) }
  const applyImpact = () => { actions.applyKnowledgeImpact(choice, TRANSCRIPT_KNOWLEDGE_ID); setImpactOpen(false); notify(impactOptions.find((item) => item.id === choice)?.title + ' applied to simulated Registrar operations.') }
  return <div className="ops-page">
    <PageHeader title="Knowledge" subtitle="Govern approved response language and make policy changes traceable." actions={<Button variant="primary" onClick={triggerImpact}><AlertTriangle size={16} />Mark policy changed</Button>} />
    {transcript?.changed && <section className="ops-banner warning"><ShieldAlert size={18} /><div><strong>Transcript policy change is active</strong><p>{transcript.affectedDraftIds.length} staged draft{transcript.affectedDraftIds.length === 1 ? '' : 's'} may be affected. The selected impact treatment is reflected in Agent Controls and Release Queue.</p></div></section>}
    <section className="ops-panel"><div className="knowledge-toolbar"><div style={{ position: 'relative' }}><Search size={16} style={{ position: 'absolute', left: 9, top: 9, color: 'var(--text-muted)' }} /><input className="ops-input" style={{ paddingLeft: 30 }} placeholder="Search title or topic" value={search} onChange={(event) => setSearch(event.target.value)} /></div><select className="ops-select" value={department} onChange={(event) => setDepartment(event.target.value)}><option>All departments</option>{state.departments.map((item) => <option key={item.id}>{item.name}</option>)}</select><select className="ops-select" value={status} onChange={(event) => setStatus(event.target.value)}><option>All statuses</option>{['Draft', 'Pending Approval', 'Approved', 'Superseded', 'Expired', 'Under Review'].map((item) => <option key={item}>{item}</option>)}</select><span className="ops-muted" style={{ marginLeft: 'auto', fontSize: 12 }}>Showing {filtered.length} of {state.knowledge.length}</span></div><div className="ops-table-wrap"><table className="ops-table"><thead><tr><th>Title</th><th>Institution</th><th>Department</th><th>Topics</th><th>Owner</th><th>Status</th><th>Effective date</th><th>Expiration</th><th>Last reviewed</th><th>Version</th><th className="num">Affected drafts</th></tr></thead><tbody>{filtered.map((item) => <tr key={item.id} tabIndex={0} onClick={() => setArticleId(item.id)} onKeyDown={(event) => { if (event.key === 'Enter') setArticleId(item.id) }}><td><strong>{item.title}</strong>{item.changed && <><br /><span className="ops-muted">Policy change pending disposition</span></>}</td><td>{names.institution(item.institutionId)}</td><td>{names.department(item.departmentId)}</td><td>{item.topics.join(', ')}</td><td>{names.owner(item.ownerUserId)}</td><td><Badge tone={toneFor(item.status)}>{item.status}</Badge></td><td>{item.effectiveDate}</td><td>{item.expirationDate ?? '—'}</td><td>{item.lastReviewed}</td><td>v{item.version}</td><td className="num">{item.affectedDraftIds.length}</td></tr>)}</tbody></table>{filtered.length === 0 && <p style={{ padding: 22, textAlign: 'center' }} className="ops-muted">No fictional knowledge sources match these filters.</p>}</div></section>
    <Drawer open={Boolean(article)} title={article?.title ?? 'Knowledge article'} onClose={() => setArticleId('')} footer={article?.id === TRANSCRIPT_KNOWLEDGE_ID ? <Button variant="primary" onClick={() => { setArticleId(''); triggerImpact() }}><AlertTriangle size={16} />Mark policy changed</Button> : undefined}>{article && <><Badge tone={toneFor(article.status)}>{article.status}</Badge><h3 style={{ marginTop: 20 }}>Approved language</h3><p style={{ padding: 12, borderLeft: '3px solid var(--accent)', background: 'var(--accent-subtle)' }}>{article.approvedLanguage}</p><h3>Metadata</h3><ul className="ops-mini-list"><li><span>Owner</span><strong>{names.owner(article.ownerUserId)}</strong></li><li><span>Effective date</span><strong>{article.effectiveDate}</strong></li><li><span>Last reviewed</span><strong>{article.lastReviewed}</strong></li><li><span>Expiration date</span><strong>{article.expirationDate ?? 'Not scheduled'}</strong></li><li><span>Affected drafts</span><strong>{article.affectedDraftIds.length}</strong></li></ul><h3>Version history</h3><div className="drawer-version"><strong>v{article.version}</strong><br /><span className="ops-muted">Current approved simulated language · reviewed {article.lastReviewed}</span></div><div className="drawer-version"><strong>v{Math.max(1, Number(article.version) - 0.1).toFixed(1)}</strong><br /><span className="ops-muted">Prior approved version retained for audit reference</span></div><h3>Impacted drafts</h3>{article.affectedDraftIds.length ? <ul className="ops-mini-list">{article.affectedDraftIds.map((id) => <li key={id}><span>{state.emails.find((mail) => mail.draft?.id === id)?.subject ?? id}</span><Badge tone="review">Staged</Badge></li>)}</ul> : <p className="ops-muted">No staged drafts currently reference this source.</p>}</>}</Drawer>
    <Modal open={impactOpen} title="Transcript policy change impact" destructive onClose={() => setImpactOpen(false)} footer={<><Button onClick={() => setImpactOpen(false)}>Cancel</Button><Button variant={choice === 'continue' ? 'secondary' : 'danger'} onClick={applyImpact}>Apply selected action</Button></>}><p><strong>{transcript?.affectedDraftIds.length ?? 0} staged drafts</strong> may rely on the changed transcript policy. Choose the operational treatment before simulated release continues.</p><div className="impact-actions">{impactOptions.map((item) => <button type="button" key={item.id} className={`impact-action ${choice === item.id ? 'selected' : ''}`} onClick={() => setChoice(item.id)}><strong>{item.title}</strong><span>{item.detail}</span></button>)}</div></Modal>
    {toast && <div className="toast-local" role="status">{toast}</div>}
  </div>
}
