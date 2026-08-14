import Link from "next/link";
import type { CaseStudy } from "../data/caseStudies";
import type { Insight } from "../data/insights";
import type { ServicePlan } from "../data/services";
import { MediaPlaceholder } from "./MediaPlaceholder";

export function CaseStudyCard({ study }: { study: CaseStudy }) {
  return (
    <article className="content-card case-card">
      <MediaPlaceholder
        type="case-study"
        label={`${study.title} Visual`}
        description={
          study.thumbnail
            ? "Case-study cover. Verified client evidence is published separately."
            : "Case-study evidence and approved client imagery."
        }
        aspectRatio="16:10"
        compact
        src={study.thumbnail}
        alt={`${study.title} case-study cover`}
      />
      <div className="content-card__body">
        <h3>{study.title}</h3>
        <p>{study.shortDescription}</p>
        <dl className="case-card__facts">
          <div>
            <dt>Prompts</dt>
            <dd>{study.promptCoverage}</dd>
          </div>
          <div>
            <dt>Platforms</dt>
            <dd>{study.platformCoverage}</dd>
          </div>
        </dl>
        <div className="content-card__footer">
          <span>{study.caseType}</span>
          <Link href={`/case-studies/${study.slug}`}>View diagnostic structure →</Link>
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
        description="Editorial cover image for this insight."
        aspectRatio="16:10"
        compact
        src={insight.coverImage}
        alt={insight.title}
      />
      <div className="content-card__body">
        <h3>{insight.title}</h3>
        <p>{insight.excerpt}</p>
        <div className="insight-card__details">
          <span>{insight.publishedDate}</span>
          <span>{insight.readingTime}</span>
        </div>
        <div className="content-card__footer">
          <Link href={`/insights/${insight.slug}`}>
            {insight.status === "published" ? "Read article →" : "View outline →"}
          </Link>
        </div>
      </div>
    </article>
  );
}

export function ServicePlanCard({
  service,
  onSelect,
}: {
  service: ServicePlan;
  onSelect?: (id: string) => void;
}) {
  const buttonClassName = `button ${service.highlighted ? "button--gold" : "button--secondary"}`;
  return (
    <article
      className={`service-card${service.highlighted ? " service-card--highlighted" : ""}`}
    >
      <div className="service-card__category">
        <span>{service.turnaround}</span>
      </div>
      <h3>{service.name}</h3>
      <p>{service.shortDescription}</p>
      <p className="service-card__fit">{service.fit}</p>
      <div className="service-card__price">
        <strong>{service.price}</strong>
        <span>{service.priceNote}</span>
      </div>
      <ul className="service-card__features">
        {service.features.map((feature) => (
          <li key={feature}>{feature}</li>
        ))}
      </ul>
      {onSelect ? (
        <button
          type="button"
          className={buttonClassName}
          onClick={() => onSelect(service.id)}
        >
          {service.ctaLabel}
        </button>
      ) : (
        <a className={buttonClassName} href={service.ctaHref}>
          {service.ctaLabel}
        </a>
      )}
    </article>
  );
}
