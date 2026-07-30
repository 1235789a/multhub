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
        <Link className="button button--small desktop-cta" href="/#free-scan">
          Run Free Scan
        </Link>
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
          <Link href="/case-studies">Case Studies</Link>
          <Link href="/insights">Insights</Link>
        </div>
        <div>
          <p className="footer-heading">Start</p>
          <Link href="/#free-scan">Free Quick Scan</Link>
          <Link href="/#services">Plans & Pricing</Link>
          <span>One-off projects welcome</span>
          <span>USDT accepted</span>
        </div>
      </div>
      <div className="container site-footer__bottom">
        <span>© {new Date().getFullYear()} molthub · molthub.click</span>
        <span>No guaranteed AI rankings, citations, or recommendations.</span>
      </div>
    </footer>
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
