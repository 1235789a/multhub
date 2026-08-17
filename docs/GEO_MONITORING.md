# molthub GEO Monitoring

Version: 2026-08-17

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

## Interpretation limits

- Do not announce success from one run.
- Do not merge results from different questions into a universal score without showing the calculation.
- Do not treat correlation as causation.
- Do not compare platforms as though they use identical retrieval systems.
- Do not change historical records to make a trend look cleaner.

