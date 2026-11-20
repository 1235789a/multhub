import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LabChrome } from "../../lab/Chrome";
import styles from "../../lab/lab.module.css";
import { bindings, getReport, LabError } from "../../lib/growth-lab/storage";
import { metrics, type ReportSnapshot } from "../../lib/growth-lab/model";
import { paidPlans } from "../../data/paymentPlans";
import Visit from "./Visit";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Private Growth Lab preview | MultiHub",
  description: "A private buyer-search review from MultiHub.",
  robots: { index: false, follow: false, nocache: true },
  referrer: "no-referrer",
  openGraph: { title: "Private Growth Lab preview", description: "Open your private review.", images: [] },
  twitter: { card: "summary", title: "Private Growth Lab preview", images: [] },
};

function External({ href, children }: { href: string; children: React.ReactNode }) {
  return <a className={styles.link} href={href} target="_blank" rel="noopener noreferrer">{children}</a>;
}

export default async function ReportPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const report = await getReport(token).catch((error) => {
    if (error instanceof LabError && error.status === 503) return null;
    throw error;
  });
  if (!report) notFound();
  const { company, protocol, questions, runs, attempts, opportunity, preview }: ReportSnapshot = JSON.parse(report.snapshot);
  const totals = metrics(runs);
  const consumer = protocol.executionMethod === "chatgpt_consumer";
  const checkoutEnabled = (await bindings()).LAB_CHECKOUT_MODE === "live";
  const checkout = (plan: string) => "/checkout?" + new URLSearchParams({
    plan, projectName: company.name, website: company.website, category: company.industry,
  });

  return <LabChrome>
    <Visit token={token} />
    <main>
      <header className={styles.hero}>
        <div className={styles.wrap}>
          <p className={styles.company}>{company.name}</p>
          <h1>{opportunity.headline}</h1>
          <p>{opportunity.value}</p>
          <p className={styles.finding}>{opportunity.finding}</p>
          <a className={styles.link} href="#evidence">View the supporting evidence</a>
        </div>
      </header>

      <div className={styles.wrap}>
        <section className={styles.section}>
          <h2>What potential buyers might ask</h2>
          <div className={styles.grid}>{questions.map((question) => <article className={styles.card} key={question.id}>
            <h3>{question.question}</h3><p>{question.buyer_scenario}</p>
          </article>)}</div>
        </section>

        <section className={styles.section} id="evidence">
          <h2>What AI search recommended</h2>
          <p>{consumer ? "ChatGPT consumer Web Search" : "OpenAI Responses API with Web Search"} · {protocol.model} · {protocol.language} · {protocol.country === "ZZ" ? "Location not disclosed" : protocol.country}</p>
          <p className={styles.meta}>{totals.runs} completed observations from {attempts} recorded attempts. These results describe the sampled answers.</p>
          <div className={styles.metricGrid}>
            {([["Mentioned", totals.mentioned], ["Recommended", totals.recommended], ["Official site linked", totals.officialLink], ["Official site cited", totals.cited]] as const).map(([label, count]) =>
              <div className={styles.card} key={label}><span className={styles.stat}>{count} / {totals.runs}</span>{label}</div>)}
          </div>
          {questions.map((question) => <div key={question.id}>
            <h3>{question.question}</h3>
            {runs.filter((run) => run.questionId === question.id).map((run) => <details className={styles.detail} key={run.id} id={`run-${run.id}`}>
              <summary>Run {run.repetition} · {run.timestamp.slice(0, 10)} · {run.recommended ? "Recommended" : run.mentioned ? "Mentioned" : "Absent"}</summary>
              <p><a className={styles.link} href={`/r/${token}/evidence/${run.assetId}`} target="_blank" rel="noreferrer">
                {consumer ? "Open original browser screenshot" : "Open original API response"}
              </a></p>
              <p className={styles.meta}>SHA-256 {run.sha256}</p>
              <pre>{run.answer}</pre>
              <ul>{run.citations.map((citation) => <li key={citation.url}>
                <External href={citation.url}>{citation.title || citation.url}</External>
              </li>)}</ul>
              {run.unresolvedSourceLabels?.length ? <p className={styles.meta}>Source labels whose URLs could not be captured in the browser: {run.unresolvedSourceLabels.join(", ")}.</p> : null}
            </details>)}
          </div>)}
        </section>

        <section className={styles.section}>
          <h2>What competitors make easier to verify</h2>
          <div className={styles.grid}>{opportunity.competitors.map((item) => <article className={styles.card} key={`${item.runId}-${item.url}`}>
            <h3>{item.name}</h3>
            <p>{item.recommendationReason}</p>
            <p>{item.claim}</p>
            <p>{item.possibleCitationReason}</p>
            <p className={styles.meta}>{item.sourceType} · checked {item.checkedAt.slice(0, 10)}</p>
            <External href={item.url}>{item.title}</External>
          </article>)}</div>
          {opportunity.gaps.map((gap) => <article className={styles.detail} key={gap.observation}>
            <h3>{gap.observation}</h3><p>{gap.websiteChange}</p>
            {gap.needsCompanyInput.length ? <p>Information we need from {company.name}{". "}{gap.needsCompanyInput.join(" ")}</p> : null}
            <div className={styles.actions}>
              <External href={gap.companySource}>Your source page</External>
              <External href={gap.competitorSource}>Competitor source</External>
            </div>
          </article>)}
          {opportunity.placements.length ? <div className={styles.detail}>
            <h3>Third-party publication options</h3>
            {opportunity.placements.map((place) => <p key={place.url}>{place.claim} <External href={place.url}>{place.title}</External></p>)}
          </div> : null}
        </section>

        <section className={styles.section}>
          <h2>Your content preview</h2>
          <article className={`${styles.card} ${styles.article}`}>
            <p className={styles.meta}>{preview.kind}</p>
            <h3>{preview.title}</h3><p>{preview.lead}</p>
            {preview.sections.map((section) => <div key={section.heading}>
              <h4>{section.heading}</h4><p>{section.copy}</p>
              <ul>{section.sources.map((url) => <li key={url}><External href={url}>{url}</External></li>)}</ul>
            </div>)}
            <External href={preview.action.url}>{preview.action.title}</External>
          </article>
          <div className={styles.detail}>
            <h3>How to use it</h3><p>{preview.why}</p>
            <p>{preview.implementation[0]}</p>
          </div>
        </section>

        <section className={styles.section}>
          <h2>Get the full module</h2>
          <p>Ask MultiHub to scope the remaining copy, publishing instructions and a matched post-launch retest. We confirm the scope before you order.</p>
          <div className={`${styles.grid} ${styles.plans}`}>
            {Object.values(paidPlans).map((plan) => <article className={styles.card} key={plan.id}>
              <h3>{plan.name}</h3><p>{plan.amount} USDT</p>
              {checkoutEnabled ? <a className={styles.link} href={checkout(plan.id)}>Continue to checkout</a> : null}
            </article>)}
          </div>
          <a className="button" href="mailto:chengzhao640@gmail.com?subject=Growth%20Lab%20implementation">Discuss implementation</a>
        </section>

        <section className={styles.section}>
          <h2>Delivery and contact</h2>
          <p>Approve the copy before it goes live. After publication, test the same buyer questions again. With your permission, use your own analytics to track AI referrals and inquiries.</p>
          <div className={styles.actions}>
            <External href={company.website}>{company.name} website</External>
            <a className={styles.link} href="/cases">MultiHub case studies</a>
            <a className={styles.link} href="mailto:chengzhao640@gmail.com">Email MultiHub</a>
          </div>
        </section>
      </div>
    </main>
  </LabChrome>;
}
