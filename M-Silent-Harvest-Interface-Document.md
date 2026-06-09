# Silent Harvest System - Interface Documentation

## Architecture

```
Internal Layer (Intel)
  /workspace/src/intel/
  - Opportunity discovery & scoring
  - GEO content auto-generation
  - Product creation

Data Layer (Single Source of Truth)
  /workspace/src/app/data/
  - products.ts
  - questions.ts
  - usecases.ts
  - comparisons.ts
  - case-studies.ts

Presentation Layer (Next.js)
  /workspace/src/app/
  Pages: /store/[slug], /checkout/[slug], /changelog, /geo/*
  APIs: POST /api/verify-trc20
```

## 1. Opportunity Interface

File: /workspace/src/intel/data/opportunities.ts

```typescript
interface Opportunity {
  id: string;
  title: string;
  pain: string;
  targetNiche: string;
  
  source: {
    platform: 'reddit' | 'product_hunt' | 'github' | 'hackernews' | 'indiehackers' | 'upwork' | 'twitter';
    url: string;
    threadTitle?: string;
    mentions?: number;
    sentiment?: 'positive' | 'neutral' | 'negative';
    captureDate: string;
  };
  
  score: {
    painFrequency: number;       // Max: 25
    usdtCompatibility: number;   // Max: 20
    impulseBuyPotential: number; // Max: 15
    soloBuildability: number;  // Max: 15
    distributionEase: number;  // Max: 15
    geoPotential: number;       // Max: 10
    total: number;
  };
  
  productFit: {
    soloBuildable: boolean;
    twoWeekMVP: boolean;
    globalSales: boolean;
    usdtAcceptable: boolean;
    noEnterpriseRequired: boolean;
    impulseBuyEligible: boolean;
  };
  
  productIdea: {
    name: { en: string; zh: string };
    slug: string;
    icon: string;
    description: { en: string; zh: string };
    features: { en: string[]; zh: string[] };
    priceUSDT: number;
    priceDisplay: string;
    productType: 'browser_extension' | 'api_tool' | 'ai_tool' | 'seo_tool' | 'creator_tool' | 'freelancer_tool' | 'other';
  };
  
  geoExpansion: {
    faqTopics: string[];
    useCaseTopics: string[];
    comparisonTopics: string[];
    caseStudyTopics: string[];
    estimatedTotalPages: number;
  };
  
  seoKeywords: string[];
  trafficChannels: string[];
  
  status: 'new' | 'validating' | 'building' | 'shipped' | 'dead';
  createdAt: string;
  updatedAt: string;
  
  decidedAt?: string;
  decision?: 'approve' | 'reject' | 'later';
  decisionNote?: string;
  
  contentGenerated?: boolean;
  generatedContent?: {
    faqIds: string[];
    useCaseIds: string[];
    comparisonIds: string[];
    caseStudyIds: string[];
    productSlug?: string;
  };
}
```

## 2. Product Interface

File: /workspace/src/app/data/products.ts

```typescript
type ProductStatus = 'available' | 'beta' | 'forging' | 'roadmap';

interface Product {
  name: { en: string; zh: string };
  slug: string;                          // URL-safe, unique
  icon: string;                          // Single emoji
  version: string;                       // e.g., "v0.1"
  priceBase: number;                     // Numeric value
  priceDisplay: string;                  // e.g., "4 USDT"
  priceUSDT?: number;
  features: { en: string[]; zh: string[] };
  
  status?: ProductStatus;
  eta?: string;                          // e.g., "Q4 2026"
  progress?: number;                     // 0-100
  launchPath?: string;                  // Post-purchase redirect
  trialConfig?: { allowed: boolean; maxUses: number };
  
  // GEO Fields
  tagline?: { en: string; zh: string };
  description?: { en: string; zh: string };
  targetUsers?: { en: string[]; zh: string[] };
  painPoints?: { en: string[]; zh: string[] };
  keywords?: string[];
  tags?: string[];
  pricingDetails?: {
    amount: number;
    currency: string;
    description?: { en: string; zh: string };
  };
  paymentMethods?: string[];
  useCases?: { en: string[]; zh: string[] };
  relatedProducts?: string[];
}

// Status Behavior
// available: Homepage + /store + /changelog(Shipped) + CTA(Buy)
// beta: Homepage + /store + /changelog(Shipped) + CTA(Beta Invite)
// forging: /store + /changelog(Forging) + CTA(Join Waitlist)
// roadmap: /changelog(Roadmap) only

// Current Products
export const PRODUCTS: Product[] = [
  { slug: 'tariff-lens', status: 'available', priceUSDT: 4, launchPath: '/apps/tariff-lens' },
  { slug: 'markitdown-lite', status: 'forging', priceUSDT: 3 },
  { slug: 'nano-secure-bridge', status: 'roadmap' },
  { slug: 'mcp-bridge', status: 'roadmap' },
  { slug: 'floorplan-ai', status: 'forging' },
];
```

## 3. Question (FAQ) Interface

File: /workspace/src/app/data/questions.ts

```typescript
type QuestionType = 'what-is' | 'how-to' | 'best' | 'why' | 'comparison';

interface Question {
  id: string;
  question: { en: string; zh: string };
  answer: { en: string; zh: string };
  relatedProducts: string[];
  relatedUseCases: string[];
  relatedCaseStudies: string[];
  type: QuestionType;
  keywords: string[];
  relatedQuestions: string[];
}
```

## 4. UseCase Interface

File: /workspace/src/app/data/usecases.ts

```typescript
interface UseCase {
  id: string;
  scenario: { en: string; zh: string };
  userTypes: { en: string[]; zh: string[] };
  problems: { en: string[]; zh: string[] };
  solutions: { en: string[]; zh: string[] };
  recommendedProducts: string[];
  keywords: string[];
  relatedUseCases: string[];
}
```

## 5. Comparison Interface

File: /workspace/src/app/data/comparisons.ts

```typescript
type ComparisonType = 'vs' | 'alternative' | 'best';

interface Comparison {
  id: string;
  title: { en: string; zh: string };
  productA: string;
  productB: string;
  pricing: { productA: string; productB: string };
  pros: {
    productA: { en: string[]; zh: string[] };
    productB: { en: string[]; zh: string[] };
  };
  cons: {
    productA: { en: string[]; zh: string[] };
    productB: { en: string[]; zh: string[] };
  };
  bestFor: {
    productA: { en: string[]; zh: string[] };
    productB: { en: string[]; zh: string[] };
  };
  comparisonType: ComparisonType;
  keywords: string[];
}
```

## 6. CaseStudy Interface

File: /workspace/src/app/data/case-studies.ts

```typescript
interface CaseStudy {
  id: string;
  title: { en: string; zh: string };
  products: string[];
  before: { en: string; zh: string };
  after: { en: string; zh: string };
  timeCost?: { amount: number; unit: string };
  moneyCost?: { amount: number; currency: string };
  results: { en: string[]; zh: string[] };
  metrics?: { label: { en: string; zh: string }; value: string }[];
  date?: string;
  author?: string;
  keywords: string[];
}
```

## API: POST /api/verify-trc20

File: /workspace/src/app/api/verify-trc20/route.ts

Request:
```json
{
  "txId": "string",           // TRON transaction hash
  "expectedAmount": 4,        // Expected USDT amount
  "expectedTo": "string",     // TRON wallet (starts with T)
  "contract": "string",       // Optional: USDT contract
  "productSlug": "string"     // Product identifier
}
```

Success Response:
```json
{
  "success": true,
  "license": "ABCD1234-EFGH5678-IJKL9012-MNOP3456-QRSTUV789012",
  "amountUsdt": 4
}
```

Error Response:
```json
{
  "success": false,
  "error": "Error message"
}
```

## Internal Services

### Product Creator Service

File: /workspace/src/intel/services/product-creator.ts

```typescript
// Convert Opportunity to Product
function createProductFromOpportunity(opp: Opportunity): Product

// Generate copy-pasteable code snippet
function printProductCode(opp: Opportunity): string

// Create Product and update Opportunity
function createProductAndUpdateOpportunity(
  opp: Opportunity,
  decisionNote?: string
): { product: Product; codeSnippet: string; updatedOpportunity: Opportunity }

// Mark as shipped
function markOpportunityAsShipped(opp: Opportunity, productSlug: string): Opportunity

// Mark as dead
function markOpportunityAsDead(opp: Opportunity, reason: string): Opportunity

// Validate requirements
function validateProductCreation(opp: Opportunity): { valid: boolean; issues: string[] }
// Rules: Score >= 70, all productFit = true, status = 'new' or 'validating'
```

### GEO Content Generator Service

File: /workspace/src/intel/services/geo-generator.ts

```typescript
// Generate complete GEO content
function generateGeoContent(opp: Opportunity): {
  faqs: Question[];
  useCases: UseCase[];
  comparisons: Comparison[];
  caseStudies: CaseStudy[];
}

// Generate code snippets for insertion
function printGeoCodeSnippets(opp: Opportunity): string
```

## Workflow: Product Launch

```
1. DISCOVERY
   Manual capture from: Reddit, Product Hunt, GitHub, Hacker News, Indie Hackers, Upwork, Twitter
   Create Opportunity object in opportunities.ts

2. SCORING
   Fill 6-dimension scoring (100 points max)
   - painFrequency (25), usdtCompatibility (20), impulseBuyPotential (15)
   - soloBuildability (15), distributionEase (15), geoPotential (10)

3. APPROVAL
   Run validateProductCreation()
   If valid → decision = 'approve', status = 'building'
   If invalid → decision = 'reject' or 'later'

4. PRODUCT CREATION
   Run createProductFromOpportunity()
   Run printProductCode() to get snippet
   Insert into products.ts

5. GEO CONTENT GENERATION
   Run generateGeoContent()
   Run printGeoCodeSnippets()
   Insert into: questions.ts, usecases.ts, comparisons.ts, case-studies.ts

6. DEVELOPMENT
   Build MVP based on productIdea

7. LAUNCH
   Update products.ts: status = 'available', progress = 100
   Update opportunities.ts: status = 'shipped'
```

## Scoring Rules Reference

File: /workspace/src/intel/data/scoring-rules.ts

### Pain Frequency (25 points)
- 20-25: Daily/weekly, emotional, high engagement
- 14-19: Weekly, affects efficiency
- 8-13: Occasional but painful
- 0-7: Low frequency, competitive

### USDT Compatibility (20 points)
- 17-20: AI, SEO, Crypto, Dev, Indie Hacker
- 12-16: Content creators, freelancers, small teams
- 6-11: General consumers, needs education
- 0-5: Traditional enterprise

### Impulse Buy Potential (15 points)
- 12-15: <$10, immediate value, one-time, perpetual
- 8-11: $10-$30, clear ROI
- 4-7: $30-$100, longer decision
- 0-3: Subscription or complex pricing

### Solo Buildability (15 points)
- 12-15: <1 week, ready API/libs
- 8-11: 1-2 weeks, some integration
- 4-7: 2-4 weeks, multiple integrations
- 0-3: >1 month, high complexity

### Distribution Ease (15 points)
- 12-15: Clear subreddit + X/Twitter community
- 8-11: Clear community OR social channel
- 4-7: SEO/GEO organic, slower cold start
- 0-3: Difficult cold start

### GEO Potential (10 points)
- 8-10: >15 long-tail questions
- 5-7: 10-15 content pieces
- 2-4: 5-10 content pieces
- 0-1: <5 pieces, competitive

## File Locations Summary

| Component | File Path |
|-----------|-----------|
| Opportunity data | /workspace/src/intel/data/opportunities.ts |
| Scoring rules | /workspace/src/intel/data/scoring-rules.ts |
| Product creator | /workspace/src/intel/services/product-creator.ts |
| GEO generator | /workspace/src/intel/services/geo-generator.ts |
| Product catalog | /workspace/src/app/data/products.ts |
| FAQ database | /workspace/src/app/data/questions.ts |
| Use case database | /workspace/src/app/data/usecases.ts |
| Comparison database | /workspace/src/app/data/comparisons.ts |
| Case study database | /workspace/src/app/data/case-studies.ts |
| TRC20 API | /workspace/src/app/api/verify-trc20/route.ts |

## Integration Checklist

- [ ] Read and understand Opportunity lifecycle
- [ ] Use scoring rules for consistent evaluation
- [ ] Follow product creation validation
- [ ] Generate GEO content before product launch
- [ ] Maintain slug consistency across all data files
- [ ] Use bilingual format for all user-facing content
- [ ] Follow status transitions correctly
- [ ] Test TRC20 payment flow with testnet

## Notes

- All data files are TypeScript constants
- Changes require code deployment
- GEO content auto-generates pages
- Payment verification uses TRON blockchain
- All products use one-time USDT payment
- License keys generated server-side
