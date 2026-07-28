import Link from "next/link";
import type { CaseStudy } from "../data/caseStudies";
import type { Insight } from "../data/insights";
import type { ServicePlan } from "../data/services";
import { MediaPlaceholder } from "./MediaPlaceholder";
import { StatusBadge } from "./SiteChrome";

export function CaseStudyCard({ study }: { study: CaseStudy }) {
  return (
    <article className="content-card case-card">
      <MediaPlaceholder
        type="case-study"
        label={`${study.title} Visual`}
        description="Future audit evidence or case-study imagery."
        aspectRatio="16:10"
        compact
      />
      <div className="content-card__body">
        <div className="content-card__meta">
          <span>{study.category}</span>
          <StatusBadge>Coming soon</StatusBadge>
        </div>
        <h3>{study.title}</h3>
        <p>{study.shortDescription}</p>
        <div className="content-card__footer">
          <span>{study.caseType}</span>
          <Link href={`/case-studies/${study.slug}`}>View structure →</Link>
        </div>
      </div>
    </article>
  );
}

export function InsightCard({ insight }: { insight: Insight }) {
  return (
    <article className="content-card insight-card">
      <MediaPlaceholder
        type="image"
        label="Insight Article Cover"
        description="Editorial cover image will be added with the article."
        aspectRatio="16:10"
        compact
      />
      <div className="content-card__body">
        <div className="content-card__meta">
          <span>{insight.category}</span>
          <StatusBadge>Coming soon</StatusBadge>
        </div>
        <h3>{insight.title}</h3>
        <p>{insight.excerpt}</p>
        <div className="content-card__footer">
          <span>{insight.tags.slice(0, 2).join(" · ")}</span>
          <Link href={`/insights/${insight.slug}`}>View outline →</Link>
        </div>
      </div>
    </article>
  );
}

export function ServicePlanCard({ service }: { service: ServicePlan }) {
  return (
    <article className="service-card">
      <div className="service-card__number">
        {service.name.replace("Service Option ", "")}
      </div>
      <p className="eyebrow">Configurable engagement</p>
      <h3>{service.name}</h3>
      <p>{service.shortDescription}</p>
      <div className="service-card__empty">
        <span>Scope</span>
        <strong>Service details will be added soon.</strong>
        <span>Pricing</span>
        <strong>Defined after scope review.</strong>
      </div>
      <a className="text-link" href={service.ctaHref}>
        {service.ctaLabel} →
      </a>
    </article>
  );
}
