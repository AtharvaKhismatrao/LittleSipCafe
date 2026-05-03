import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-amber-900/10 bg-coffee-dark text-amber-50">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-3">
          <div>
            <p className="font-display text-xl font-semibold text-white">Little Sip Cafe</p>
            <p className="mt-2 text-sm text-amber-100/80">
              Cozy cups, fresh pastries, and warm moments in the heart of Bandra.
            </p>
          </div>
          <div>
            <p className="font-semibold text-white">Visit</p>
            <p className="mt-2 text-sm leading-relaxed text-amber-100/90">
              Shop No. 12, Linking Road
              <br />
              Bandra West, Mumbai 400050
            </p>
          </div>
          <div>
            <p className="font-semibold text-white">Quick links</p>
            <ul className="mt-2 space-y-1 text-sm">
              <li>
                <Link to="/order" className="text-amber-100/90 hover:text-white">
                  Order online
                </Link>
              </li>
              <li>
                <Link to="/reservations" className="text-amber-100/90 hover:text-white">
                  Table reservation
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-amber-100/90 hover:text-white">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <p className="mt-10 border-t border-white/10 pt-6 text-center text-xs text-amber-200/70">
          © {new Date().getFullYear()} Little Sip Cafe. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
