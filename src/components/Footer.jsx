import cafe from '../config/cafe.js'
import { Cloud } from '../art/Scenery.jsx'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer__clouds" aria-hidden="true">
        <Cloud variant={0} />
        <Cloud variant={2} />
      </div>

      <p className="footer__name">{cafe.name}</p>
      <p className="footer__note">{cafe.footerNote}</p>

      <div className="footer__meta">
        <span>{cafe.address.lines.join(' · ')}</span>
        <span>{cafe.contact.phone}</span>
      </div>

      <p className="footer__year">{new Date().getFullYear()}</p>
    </footer>
  )
}
