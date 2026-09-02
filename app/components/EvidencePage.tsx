import Link from "next/link";
import type { EvidencePageData } from "../data/evidencePages";
import { Footer, Header, PageHero } from "./SiteChrome";

const gradeLabels = {
  A: "Molthub first-party fact",
  B: "Primary external evidence",
  C: "Practitioner observation",
  D: "Molthub observation",
};

export function EvidencePage({ page }: { page: EvidencePageData }) {
  const canonical = `https://molthub.click/geo/${page.slug}`;
  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: page.title,
    description: page.description,
    datePublished: page.lastUpdated,
    dateModified: page.lastUpdated,
    author: { "@type": "Organization", name: "molthub", url: "https://molthub.click" },
    publisher: { "@type": "Organization", name: "molthub", url: "https://molthub.click" },
    mainEntityOfPage: canonical,
  };

  return (
    <>
      <Header />
      <main>
        <PageHero
          breadcrumbs={[
            { label: "Home", href: "/" },
            { label: "Web3 GEO evidence", href: "/methodology" },
            { label: page.title },
          ]}
          eyebrow={`${page.eyebrow} · Updated ${page.lastUpdated}`}
          title={page.title}
          description={page.description}
        />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />

        <section className="section evidence-page">
          <div className="container evidence-page__grid">
            <div className="evidence-page__answer">
              <p className="eyebrow">Direct answer</p>
              {page.directAnswer.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
            </div>
            <dl className="fact-sheet">
              {page.facts.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}
            </dl>
          </div>
        </section>

        <section className="section evidence-page evidence-page--muted">
          <div className="container experiment-section">
            <div className="evidence-heading"><p className="eyebrow">Key facts</p><h2>{page.table.caption}</h2></div>
            <div className="evidence-table-wrap">
              <table className="evidence-table">
                <thead><tr>{page.table.headers.map((header) => <th scope="col" key={header}>{header}</th>)}</tr></thead>
                <tbody>{page.table.rows.map((row) => <tr key={row.join("-")}>{row.map((cell, index) => index === 0 ? <th scope="row" key={cell}>{cell}</th> : <td key={cell}>{cell}</td>)}</tr>)}</tbody>
              </table>
            </div>
          </div>

          <div className="container experiment-section">
            <div className="evidence-heading"><p className="eyebrow">Implementation</p><h2>A bounded process that can be repeated.</h2></div>
            <div className="evidence-cards">
              {page.steps.map(([title, body], index) => <article key={title}><span>{String(index + 1).padStart(2, "0")}</span><h3>{title}</h3><p>{body}</p></article>)}
            </div>
          </div>
        </section>

        <section className="section methodology-sources">
          <div className="container">
            <p className="eyebrow">Evidence and sources</p>
            <h2>Facts are labelled by evidence type.</h2>
            <div className="source-list">
              {page.sources.map((source) => (
                <a href={source.url} target="_blank" rel="noreferrer" key={source.url}>
                  <strong>{source.title}</strong>
                  <span>{source.publisher} · {source.grade}: {gradeLabels[source.grade]}</span>
                  <small>{source.note}</small>
                </a>
              ))}
            </div>
          </div>
        </section>

        <section className="section methodology-limits">
          <div className="container methodology-limits__grid">
            <div><p className="eyebrow">Limitations</p><h2>What this page does not prove.</h2></div>
            <ul>{page.limitations.map((item) => <li key={item}>{item}</li>)}</ul>
          </div>
        </section>

        <section className="section evidence-page">
          <div className="container evidence-page__grid">
            <div><p className="eyebrow">Who this is for</p><ul>{page.forWho.map((item) => <li key={item}>{item}</li>)}</ul></div>
            <div><p className="eyebrow">Who this is not for</p><ul>{page.notFor.map((item) => <li key={item}>{item}</li>)}</ul></div>
          </div>
        </section>

        <section className="evidence-cta">
          <div className="container evidence-cta__inner">
            <div><p className="eyebrow">Relevant molthub method</p><h2>Start with a dated baseline, then improve one evidence gap.</h2><p>Last updated: {page.lastUpdated}</p></div>
            <div className="button-row">
              <Link className="button button--secondary" href="/methodology">Read methodology</Link>
              <Link className="button button--gold" href="/#free-scan">Run free scan</Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
