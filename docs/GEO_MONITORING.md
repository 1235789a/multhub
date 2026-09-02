# molthub GEO Monitoring

Version: 2026-09-02

## Current observation

On 2026-09-02, the original five-query set was rerun as one OpenAI web-search observation.

| Result | Count |
| --- | ---: |
| molthub mentions | 0 / 5 |
| molthub citations | 0 / 5 |
| accurate molthub descriptions | Not applicable; molthub was absent |
| exact-domain result for `"molthub.click"` | Not returned in the observation |

The returned sources and query interpretation are recorded in `docs/GEO_CURRENT_SOURCE_MAP.md`. This is not a cross-platform baseline and must not be described as a permanent ChatGPT result.

## Measurement rule

One AI answer is an observation, not a ranking. Important queries should be repeated using the same wording and recorded with enough context to compare later.

## Observation fields

| Field | Required | Notes |
| --- | --- | --- |
| Date and time | Yes | Use UTC and local timezone |
| Platform | Yes | ChatGPT, Gemini, Perplexity or another named surface |
| Model | When known | Do not guess |
| Query | Yes | Store exact wording |
| Fresh session | Yes | Record whether prior context existed |
| molthub mentioned | Yes | Boolean plus exact wording |
| molthub cited | Yes | Boolean plus citation URL |
| Position | When meaningful | Order in a recommendation list, not a universal rank |
| Description accurate | Yes | Correct, partially correct or incorrect |
| Competitors mentioned | Yes | Names and order |
| Sources used | Yes | URLs shown by the platform |
| Notes | Yes | Location, language, variation and visible uncertainty |

## KPI layers

### Layer 1 — AI visibility

- Mention rate across the fixed query set
- Citation rate
- Accurate-description rate
- Query coverage
- Cross-platform consistency
- Competitor share within the same observations

### Layer 2 — direct business results

- AI referral visits
- Free-scan starts and completions
- Sample-report visits
- Contact clicks
- Paid order starts and confirmed orders

### Layer 3 — authority signals

- Search impressions for non-brand queries
- Branded searches
- Legitimate backlinks
- Independent mentions
- Citations of molthub research assets

## Cadence

- Weekly: five-query self-experiment during the first eight weeks
- Monthly: expanded buyer-query review and competitor-source map
- After a material site change: preserve the old observation, record the change, then retest
- Quarterly: remove queries that no longer match the service and add only justified replacements

## Next repeat

- Run the same five queries in fresh ChatGPT, Gemini and Perplexity sessions.
- Record screenshots or exported answers when permitted, but store source URLs and exact wording in text.
- Do not combine the 2026-09-02 web-search observation with consumer-chat results without retaining the platform field.
- Repeat after the five evidence pages are indexed or two weeks have passed, whichever is later.

## Interpretation limits

- Do not announce success from one run.
- Do not merge results from different questions into a universal score without showing the calculation.
- Do not treat correlation as causation.
- Do not compare platforms as though they use identical retrieval systems.
- Do not change historical records to make a trend look cleaner.
