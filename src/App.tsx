import { Navigate, Route, Routes } from 'react-router-dom'
import { AppShell } from './components/layout'
import { DemoProvider, useDemo } from './context/DemoContext'
import AdministrationPage from './pages/AdministrationPage'
import AgentControlsPage from './pages/AgentControlsPage'
import DashboardPage from './pages/DashboardPage'
import KnowledgePage from './pages/KnowledgePage'
import NotFoundPage from './pages/NotFoundPage'
import ReleaseQueuePage from './pages/ReleaseQueuePage'
import ReportingPage from './pages/ReportingPage'
import ResponseWorkbenchPage from './pages/ResponseWorkbenchPage'
import WorkQueuePage from './pages/WorkQueuePage'

function ConnectedShell() {
  const { state, actions } = useDemo()
  const institution = state.institutions.find((item) => item.id === state.selections.institutionId)?.name ?? 'All institutions'
  const department = state.departments.find((item) => item.id === state.selections.departmentId)?.name ?? 'Registrar'
  const workQueue = state.emails.filter((item) => ['QA Required', 'Form Review Required', 'Missing Information', 'Specialist Review', 'Escalated', 'Held'].includes(item.status)).length
  const releaseQueue = state.releaseBatches.reduce((total, batch) => total + Math.max(0, batch.approvedDraftIds.length - batch.heldDraftIds.length), 0)
  return <AppShell
    counts={{ workQueue, releaseQueue }}
    institution={institution}
    department={department}
    onResetDemo={actions.resetDemo}
    onInstitutionChange={(value) => {
      const match = state.institutions.find((item) => item.name === value)
      if (match) actions.selectScope({ institutionId: match.id })
    }}
    onDepartmentChange={(value) => {
      const match = state.departments.find((item) => item.name === value)
      if (match) actions.selectScope({ departmentId: match.id })
    }}
  />
}

export default function App() {
  return <DemoProvider><Routes>
    <Route element={<ConnectedShell />}>
      <Route index element={<DashboardPage />} />
      <Route path="work-queue" element={<WorkQueuePage />} />
      <Route path="work-queue/:emailId" element={<ResponseWorkbenchPage />} />
      <Route path="release-queue" element={<ReleaseQueuePage />} />
      <Route path="form-review" element={<Navigate to="/work-queue" replace />} />
      <Route path="agent-controls" element={<AgentControlsPage />} />
      <Route path="knowledge" element={<KnowledgePage />} />
      <Route path="reporting" element={<ReportingPage />} />
      <Route path="administration" element={<AdministrationPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Route>
  </Routes></DemoProvider>
}
