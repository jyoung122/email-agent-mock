import { FileQuestion } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return <div className="page"><section className="panel not-found-record"><FileQuestion size={38} /><h1>Page not found</h1><p>The requested demonstration screen does not exist.</p><Link className="button button--primary" to="/">Return to dashboard</Link></section></div>
}
