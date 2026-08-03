import { Download, FileBarChart, Info } from 'lucide-react'
import { useState } from 'react'
import './leadership-pages.css'

const schoolData = [
  ['Northstar Fictional University', '612', '68%', '97%', '146'],
  ['Riverbend Demonstration College', '488', '63%', '95%', '129'],
  ['Harborview Sample Institute', '423', '61%', '98%', '112'],
  ['Prairie Coast Test University', '353', '57%', '94%', '94'],
]
const departmentData = [
  ['Registrar', '586', '71%', '3h 02m', '4.8%'],
  ['Admissions', '448', '66%', '3h 26m', '5.2%'],
  ['Financial Aid', '372', '59%', '4h 12m', '8.3%'],
  ['Student Accounts', '302', '57%', '3h 44m', '6.6%'],
  ['Human Resources', '168', '49%', '4h 31m', '9.1%'],
]

export default function ReportingPage() {
  const [scope, setScope] = useState('All institutions')
  const [notice, setNotice] = useState('')
  return <div className="leadership-page">
    <div className="leadership-heading">
      <div><p className="eyebrow">Leadership reporting</p><h1>Program reporting</h1><p>Fictional performance data for grant, oversight, and operating reviews.</p></div>
      <div className="leadership-heading-actions report-controls"><label>Scope<select value={scope} onChange={(event) => setScope(event.target.value)}><option>All institutions</option><option>Northstar Fictional University</option><option>Riverbend Demonstration College</option><option>Harborview Sample Institute</option><option>Prairie Coast Test University</option></select></label><label>Period<select defaultValue="Last 28 days"><option>Last 28 days</option><option>Prior 28 days</option><option>Academic year to date</option></select></label><button className="button button-primary" onClick={() => setNotice('Simulated executive report exported. No external file was created.')}><Download size={16} />Export report</button></div>
    </div>
    {notice && <div className="page-toast" role="status">{notice}<button onClick={() => setNotice('')} aria-label="Dismiss notification">×</button></div>}
    <section className="report-summary" aria-label={`Executive summary for ${scope}`}>
      {[['Estimated staff hours saved', '481', 'hours'], ['Response-time reduction', '42%', 'vs. baseline'], ['Headless release rate', '64%', '1,201 of 1,876'], ['QA pass rate', '96%', '702 of 731'], ['Forms normalized', '132', '18 missing forms caught']].map(([label, value, sub]) => <article key={label}><span>{label}</span><strong>{value}</strong><small>{sub}</small></article>)}
    </section>
    <div className="report-callout"><Info size={17} /><span><b>How to read this period.</b> Headless release excludes messages selected for mandatory review; QA pass rate reflects completed human decisions, not automated confidence.</span></div>
    <div className="leadership-grid report-grid">
      <section className="leadership-panel table-panel"><div className="panel-heading"><div><h2>Performance by school</h2><p>Service quality and reviewer outcomes</p></div><FileBarChart size={19} /></div><div className="table-scroll"><table><thead><tr><th>Institution</th><th className="numeric">Processed</th><th className="numeric">Headless release</th><th className="numeric">QA pass</th><th className="numeric">Hours saved</th></tr></thead><tbody>{schoolData.map((row) => <tr key={row[0]}>{row.map((cell, index) => <td key={cell} className={index ? 'numeric' : ''}>{cell}</td>)}</tr>)}</tbody></table></div></section>
      <section className="leadership-panel insight-panel"><div className="panel-heading"><div><h2>Service outcomes</h2><p>Operational results since last review</p></div></div><div className="outcome-stat"><strong>79%</strong><span>drafts accepted without material rewrite</span><i style={{ width: '79%' }} /></div><div className="outcome-stat"><strong>6.2%</strong><span>average staff edit percentage</span><i className="orange-bar" style={{ width: '31%' }} /></div><div className="outcome-stat"><strong>2.8%</strong><span>escalation rate</span><i className="neutral-bar" style={{ width: '14%' }} /></div><p className="panel-note">All figures use predefined fictional records for this demonstration.</p></section>
    </div>
    <div className="leadership-grid report-lower-grid">
      <section className="leadership-panel table-panel"><div className="panel-heading"><div><h2>Performance by department</h2><p>Where review capacity is most needed</p></div></div><div className="table-scroll"><table><thead><tr><th>Department</th><th className="numeric">Processed</th><th className="numeric">Automation</th><th className="numeric">Avg. response</th><th className="numeric">Escalated</th></tr></thead><tbody>{departmentData.map((row) => <tr key={row[0]}>{row.map((cell, index) => <td key={cell} className={index ? 'numeric' : ''}>{cell}</td>)}</tr>)}</tbody></table></div></section>
      <section className="leadership-panel gap-panel"><div className="panel-heading"><div><h2>Knowledge gaps identified</h2><p>Patterns driving human review</p></div><span className="status-badge status-review">12 open</span></div><ul className="gap-list"><li><span className="gap-count">5</span><div><b>International transcript delivery guidance</b><small>Registrar · routed to knowledge owner</small></div><span className="status-badge status-review">Medium impact</span></li><li><span className="gap-count">4</span><div><b>Residency appeal documentation</b><small>Admissions · needs approved language</small></div><span className="status-badge status-info">In review</span></li><li><span className="gap-count">3</span><div><b>Third-party sponsorship letters</b><small>Student Accounts · low confidence pattern</small></div><span className="status-badge status-neutral">Monitor</span></li></ul><button className="text-action" onClick={() => setNotice('Knowledge gaps are simulated findings; review them in Knowledge governance.')}>Review knowledge governance →</button></section>
    </div>
  </div>
}
