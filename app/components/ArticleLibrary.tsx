"use client";

import { useState } from "react";
import type { Insight, InsightAudience } from "../data/insights";
import { InsightCard } from "./ContentCards";

const filters: Array<"All" | InsightAudience> = [
  "All",
  "Beginner",
  "Professional",
];

export function ArticleLibrary({ insights }: { insights: Insight[] }) {
  const [activeFilter, setActiveFilter] = useState<(typeof filters)[number]>("All");
  const filteredInsights =
    activeFilter === "All"
      ? insights
      : insights.filter((insight) => insight.audience === activeFilter);

  return (
    <>
      <div className="article-library__toolbar">
        <div className="article-filters" aria-label="Filter articles by level">
          {filters.map((filter) => (
            <button
              className={`article-filter${activeFilter === filter ? " is-active" : ""}`}
              key={filter}
              onClick={() => setActiveFilter(filter)}
              type="button"
              aria-pressed={activeFilter === filter}
            >
              {filter}
            </button>
          ))}
        </div>
        <p aria-live="polite">
          Showing {filteredInsights.length} article{filteredInsights.length === 1 ? "" : "s"}
        </p>
      </div>
      <div className="card-grid card-grid--three">
        {filteredInsights.map((insight) => (
          <InsightCard insight={insight} key={insight.slug} />
        ))}
      </div>
    </>
  );
}
