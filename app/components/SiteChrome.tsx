import Link from "next/link";
import { navigation } from "../data/navigation";

export function Brand() {
  return (
    <Link className="brand" href="/" aria-label="molthub home">
      <span className="brand__mark" aria-hidden="true">
        M
      </span>
      <span className="brand__word">
        molthub
      </span>
    </Link>
  );
}

export function Header() {
  return (
    <header className="site-header">
      <div className="container site-header__inner">
        <Brand />
        <nav className="desktop-nav" aria-label="Primary navigation">
          {navigation.map((item) => (
            <Link key={item.href} href={item.href}>
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="desktop-actions">
          <Link className="header-account-link" href="/account">
            Account
          </Link>
          <Link className="button button--small desktop-cta" href="/#free-scan">
            Run Free Scan
          </Link>
        </div>
        <details className="mobile-nav">
          <summary aria-label="Open navigation">
            <span />
            <span />
          </summary>
          <nav aria-label="Mobile navigation">
            {navigation.map((item) => (
              <Link key={item.href} href={item.href}>
                {item.label}
              </Link>
            ))}
            <Link className="button" href="/#free-scan">
              Run Free Scan
            </Link>
          </nav>
        </details>
      </div>
    </header>
  );
}

export function Footer() {
  return (
    <>
      <footer className="site-footer">
        <div className="container site-footer__top">
          <div>
            <Brand />
            <p className="site-footer__intro">
              A focused, hands-on Web3 GEO studio for projects that want clearer
              AI visibility and stronger source material.
            </p>
          </div>
          <div>
            <p className="footer-heading">Explore</p>
            <Link href="/sample-report">Sample Report</Link>
            <Link href="/regulated-industries">Regulated Industries</Link>
            <Link href="/partners">Partner Pilot</Link>
            <Link href="/insights">Insights</Link>
          </div>
          <div>
            <p className="footer-heading">Start</p>
            <Link href="/#free-scan">Free Quick Scan</Link>
            <Link href="/account">Account & Scan History</Link>
            <Link href="/#services">Plans & Pricing</Link>
            <span>One-off projects welcome</span>
            <span>USDT-TRC20 accepted</span>
          </div>
          <div>
            <p className="footer-heading">Contact</p>
            <a
              href="https://wa.me/8615863789235"
              target="_blank"
              rel="noreferrer"
              aria-label="Contact molthub on WhatsApp"
            >
              WhatsApp +86 158 6378 9235
            </a>
            <a href="mailto:chengzhao640@gmail.com">chengzhao640@gmail.com</a>
          </div>
        </div>
        <div className="container site-footer__bottom">
          <span>© {new Date().getFullYear()} molthub · molthub.click</span>
          <span>No guaranteed AI rankings, citations, or recommendations.</span>
        </div>
      </footer>
      <details className="contact-fab">
        <summary aria-label="Open molthub contact options">
          <span aria-hidden="true">☎</span>
          <span className="contact-fab__text">Contact</span>
        </summary>
        <div className="contact-fab__panel">
          <strong>Contact molthub</strong>
          <a
            href="https://wa.me/8615863789235"
            target="_blank"
            rel="noreferrer"
          >
            WhatsApp
            <span>+86 158 6378 9235</span>
          </a>
          <a href="mailto:chengzhao640@gmail.com">
            Email
            <span>chengzhao640@gmail.com</span>
          </a>
        </div>
      </details>
    </>
  );
}

export function PageHero({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <section className="page-hero">
      <div className="container page-hero__inner">
        <p className="eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
    </section>
  );
}

export function StatusBadge({ children }: { children: React.ReactNode }) {
  return <span className="status-badge">{children}</span>;
}
