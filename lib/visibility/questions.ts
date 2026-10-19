import { fold, indexOfTerm } from "./vendor/optifeed/text";
export const QUESTION_PACK_VERSION = "buyer-questions-2026-10-19.v1";
export const questionPackOptions = [
  {
    id: "ai-saas",
    label: "AI SaaS",
    category: "AI customer support tools",
    audience: "a small SaaS team",
  },
  {
    id: "web3",
    label: "Web3 & crypto infrastructure",
    category: "stablecoin payment platforms",
    audience: "a small Web3 product team",
  },
  {
    id: "developer-tools",
    label: "Developer tools",
    category: "developer infrastructure tools",
    audience: "an independent developer team",
  },
  {
    id: "agency",
    label: "SEO & marketing agencies",
    category: "AI search visibility audit services",
    audience: "a small marketing agency",
  },
  {
    id: "general",
    label: "Other / general B2B",
    category: "software tools for small businesses",
    audience: "a small business team",
  },
] as const;
export type QuestionPackId = (typeof questionPackOptions)[number]["id"];
export type BuyerQuestion = {
  id: string;
  intent: string;
  kind: "discovery" | "verification";
  question: string;
};
export type QuestionPack = {
  id: QuestionPackId;
  version: string;
  label: string;
  category: string;
  audience: string;
  language: "en";
  status: "not_executed";
  note: string;
  questions: BuyerQuestion[];
};
export function validPackId(value: unknown): value is QuestionPackId {
  return questionPackOptions.some((p) => p.id === value);
}
export function inferPack(industry: string): QuestionPackId {
  const text = industry.toLowerCase();
  if (/web3|crypto|wallet|blockchain|stablecoin|on.chain/.test(text))
    return "web3";
  if (/agency|agencies|seo|marketing|geo|visibility/.test(text))
    return "agency";
  if (/developer|devtool|sdk|infrastructure|api|database/.test(text))
    return "developer-tools";
  if (/\bai\b|saas|chatbot|support|automation/.test(text)) return "ai-saas";
  return "general";
}
export function createQuestionPack(
  industry: string,
  brand: string,
  requested?: string,
): QuestionPack {
  const id = validPackId(requested) ? requested : inferPack(industry);
  const pack = questionPackOptions.find((p) => p.id === id)!;
  const selectedCategory = industry.replace(/\s+/g, " ").trim().slice(0, 100);
  const brandedCategory = Boolean(
    brand.trim() && indexOfTerm(fold(selectedCategory), brand) !== -1,
  );
  const category =
    selectedCategory && !brandedCategory ? selectedCategory : pack.category;
  const common = [
    [
      "shortlist",
      `Which ${category} should ${pack.audience} shortlist, and what are the main trade-offs?`,
    ],
    [
      "budget",
      `Which ${category} offer transparent pricing and a low-risk way for ${pack.audience} to get started?`,
    ],
  ];
  const specific: Record<QuestionPackId, string[][]> = {
    "ai-saas": [
      [
        "integration",
        `Which ${category} integrate with an existing support workflow without a long implementation?`,
      ],
      [
        "comparison",
        `How should ${pack.audience} compare ${category} on accuracy, human handoff and total cost?`,
      ],
      [
        "trust",
        `Which ${category} publish clear data privacy terms and verifiable product documentation?`,
      ],
    ],
    web3: [
      [
        "integration",
        `Which ${category} support clear onboarding and documented network compatibility for ${pack.audience}?`,
      ],
      [
        "comparison",
        `How should ${pack.audience} compare ${category} on fees, custody and integration requirements?`,
      ],
      [
        "trust",
        `Which ${category} provide independently checkable security information and clear operational limitations?`,
      ],
    ],
    "developer-tools": [
      [
        "integration",
        `Which ${category} have clear API documentation, maintained SDKs and a straightforward first integration?`,
      ],
      [
        "comparison",
        `How should ${pack.audience} compare ${category} on usage limits, reliability and switching costs?`,
      ],
      [
        "trust",
        `Which ${category} publish useful changelogs, status history and practical technical documentation?`,
      ],
    ],
    agency: [
      [
        "integration",
        `Which ${category} can support an agency workflow with client-ready evidence and clear deliverables?`,
      ],
      [
        "comparison",
        `How should ${pack.audience} compare ${category} on scope, methodology and reporting quality?`,
      ],
      [
        "trust",
        `Which ${category} distinguish actual model observations from predictions and explain their evidence limits?`,
      ],
    ],
    general: [
      [
        "integration",
        `Which ${category} are easiest for ${pack.audience} to integrate into an existing workflow?`,
      ],
      [
        "comparison",
        `How should ${pack.audience} compare ${category} on price, onboarding and key limitations?`,
      ],
      [
        "trust",
        `Which ${category} have clear product documentation and independently verifiable claims?`,
      ],
    ],
  };
  const questions: BuyerQuestion[] = [...common, ...specific[id]].map(
    ([intent, question]) => ({
      id: `${id}-${intent}`,
      intent,
      kind: "discovery",
      question,
    }),
  );
  const name = brand.trim().slice(0, 100) || "the selected brand";
  questions.push(
    {
      id: `${id}-brand-facts`,
      intent: "brand-facts",
      kind: "verification",
      question: `What does ${name} offer, who is it for, and which official sources support that description?`,
    },
    {
      id: `${id}-brand-terms`,
      intent: "brand-terms",
      kind: "verification",
      question: `What pricing, onboarding requirements and important limitations does ${name} publish on its official website?`,
    },
  );
  return {
    id,
    version: QUESTION_PACK_VERSION,
    label: pack.label,
    category,
    audience: pack.audience,
    language: "en",
    status: "not_executed",
    note: brandedCategory
      ? "Brand wording was removed from the discovery category to avoid prompting a brand mention. Templates are not model results."
      : "Five unbranded discovery questions and two branded fact checks. Templates are not model results.",
    questions,
  };
}
export function questionCsv(pack: QuestionPack) {
  return [
    "id,kind,intent,language,pack_version,execution_status,question",
    ...pack.questions.map((q) =>
      [
        q.id,
        q.kind,
        q.intent,
        pack.language,
        pack.version,
        pack.status,
        q.question,
      ]
        .map(csvCell)
        .join(","),
    ),
  ].join("\r\n");
}
export function csvCell(value: unknown) {
  let text = String(value ?? "");
  if (/^[=+@\-\t\r\n]/.test(text)) text = "'" + text;
  return '"' + text.replaceAll('"', '""') + '"';
}
