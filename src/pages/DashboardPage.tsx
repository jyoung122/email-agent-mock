import { Download, Info, TrendingDown, TrendingUp } from 'lucide-react'
import { useState } from 'react'
import './leadership-pages.css'

type View = 'Network' | 'Institution' | 'Department'

const departmentVolumes = [
  { name: 'Registrar', value: 586, color: 'blue' },
  { name: 'Admissions', value: 448, color: 'blue' },
  { name: 'Financial Aid', value: 372, color: 'blue' },
  { name: 'Student Accounts', value: 302, color: 'blue' },
  { name: 'Human Resources', value: 168, color: 'blue' },
]

const qaRates = [
  { name: 'Northstar Fictional University', rate: 97, denominator: 224 },
  { name: 'Riverbend Demonstration College', rate: 95, denominator: 198 },
  { name: 'Harborview Sample Institute', rate: 98, denominator: 167 },
  { name: 'Prairie Coast Test University', rate: 94, denominator: 142 },
]

const mailboxRows = [
  ['registrar@northstar.example.test', 'Registrar', '70%', '18%', '4:00 PM ET'],
  ['admissions@riverbend.example.test', 'Admissions', '64%', '22%', '3:30 PM ET'],
  ['aid@harborview.example.test', 'Financial Aid', '58%', '28%', '4:30 PM ET'],
  ['accounts@prairiecoast.example.test', 'Student Accounts', '51%', '31%', '4:00 PM ET'],
]

const metrics = [
  ['Emails processed', '1,876', '+12% vs. prior period', 'up'],
  ['Automation rate', '64%', '+4 points', 'up'],
  ['QA review rate', '18%', 'within 20% policy', 'attention'],
  ['Average response time', '3h 18m', '42% faster', 'down'],
  ['Exceptions', '48', '8 awaiting review', 'attention'],
] as const

export default function DashboardPage() {
  const [view, setView] = useState<View>('Network')
  const [period, setPeriod] = useState('Last 28 days')
  const [notice, setNotice] = useState('')

  return (
    <div className="leadership-page">
      <div className="leadership-heading">
        <div>
          <p className="eyebrow">Operational overview</p>
          <h1>Program dashboard</h1>
          <p>Correspondence performance across the fictional SSI network · Jul 6 – Aug 2, 2026</p>
        </div>
        <div className="leadership-heading-actions">
          <div className="segmented" aria-label="Dashboard scope">
            {(['Network', 'Institution', 'Department'] as View[]).map((option) => (
              <button key={option} className={view === option ? 'is-selected' : ''} onClick={() => setView(option)}>{option}</button>
            ))}
          </div>
          <div className="report-controls"><label>Period<select value={period} onChange={(event) => setPeriod(event.target.value)}><option>Last 28 days</option><option>Prior 28 days</option><option>Academic year to date</option></select></label></div>
          <button className="button button-secondary" onClick={() => setNotice('Simulated dashboard report prepared for download.') }><Download size={16} />Export report</button>
        </div>
      </div>
      {notice && <div className="page-toast" role="status">{notice}<button onClick={() => setNotice('')} aria-label="Dismiss notification">×</button></div>}

      <section className="metric-strip" aria-label={`${view} performance metrics`}>
        {metrics.map(([label, value, trend, direction]) => (
          <article className="metric-card" key={label}>
            <span>{label}</span><strong>{value}</strong>
            <small className={direction === 'attention' ? 'metric-attention' : 'metric-good'}>{direction === 'up' ? <TrendingUp size={14} /> : direction === 'down' ? <TrendingDown size={14} /> : <Info size={14} />}{trend}</small>
          </article>
        ))}
      </section>

      <section className="secondary-metrics" aria-label="Program footprint">
        <span><b>4</b> schools active</span><span><b>5</b> departments active</span><span><b>8</b> mailboxes monitored</span><span><b>132</b> forms processed</span><span><b>79%</b> draft acceptance</span>
      </section>

      <div className="leadership-grid dashboard-grid">
        <section className="leadership-panel volume-panel">
          <div className="panel-heading"><div><h2>Volume by department</h2><p>1,876 received emails</p></div><span className="legend"><i className="legend-blue" />Processed</span></div>
          <div className="bar-chart" role="img" aria-label="Email volume by department: Registrar 586, Admissions 448, Financial Aid 372, Student Accounts 302, Human Resources 168.">
            {departmentVolumes.map((item) => <div className="bar-row" key={item.name}><span>{item.name}</span><div className="bar-track"><i style={{ width: `${item.value / 6.2}%` }} /></div><b>{item.value}</b></div>)}
          </div>
        </section>
        <section className="leadership-panel backlog-panel">
          <div className="panel-heading"><div><h2>Queue backlog</h2><p>48 exceptions requiring attention</p></div></div>
          <div className="stacked-bar" aria-label="Queue backlog: 18 QA required, 12 form review, 10 missing information, 8 held"><i className="stack-qa" style={{ width: '38%' }} /><i className="stack-form" style={{ width: '25%' }} /><i className="stack-info" style={{ width: '21%' }} /><i className="stack-held" style={{ width: '16%' }} /></div>
          <ul className="backlog-list"><li><span><i className="dot dot-qa" />QA required</span><b>18</b></li><li><span><i className="dot dot-form" />Form review</span><b>12</b></li><li><span><i className="dot dot-info" />Missing information</span><b>10</b></li><li><span><i className="dot dot-held" />Held</span><b>8</b></li></ul>
          <button className="text-action" onClick={() => setNotice('Opening the work queue is available from the navigation.')}>View attention queue →</button>
        </section>
        <section className="leadership-panel qa-panel">
          <div className="panel-heading"><div><h2>QA pass rate by institution</h2><p>Approved reviewer decisions</p></div></div>
          {qaRates.map((school) => <div className="rate-row" key={school.name}><div><span>{school.name}</span><small>{Math.round(school.denominator * school.rate / 100)} of {school.denominator} passed</small></div><strong>{school.rate}%</strong><div className="rate-track"><i style={{ width: `${school.rate}%` }} /></div></div>)}
        </section>
      </div>

      <div className="leadership-grid lower-grid">
        <section className="leadership-panel table-panel">
          <div className="panel-heading"><div><h2>Automation by mailbox</h2><p>Current operating settings</p></div><button className="text-action" onClick={() => setNotice('Agent controls is ready in the Governance navigation.')}>Manage controls →</button></div>
          <div className="table-scroll"><table><thead><tr><th>Mailbox</th><th>Department</th><th>Headless</th><th>Random QA</th><th>Release</th></tr></thead><tbody>{mailboxRows.map((row) => <tr key={row[0]}>{row.map((cell) => <td key={cell}>{cell}</td>)}</tr>)}</tbody></table></div>
        </section>
        <section className="leadership-panel timeline-panel">
          <div className="panel-heading"><div><h2>Recent knowledge changes</h2><p>Governed policy updates</p></div></div>
          <ol className="knowledge-timeline"><li><i className="timeline-warning" /><div><b>Transcript delivery policy updated</b><span>Registrar · 8 affected staged drafts · Aug 2, 2026</span></div><em>Review</em></li><li><i className="timeline-good" /><div><b>Scholarship verification guide approved</b><span>Financial Aid · Version 3.2 · Aug 1, 2026</span></div><em>Approved</em></li><li><i className="timeline-neutral" /><div><b>Residency documentation language reviewed</b><span>Admissions · No affected drafts · Jul 30, 2026</span></div><em>Reviewed</em></li></ol>
          <button className="text-action" onClick={() => setNotice('Knowledge governance is available from the Governance navigation.')}>Open knowledge governance →</button>
        </section>
      </div>
    </div>
  )
}
