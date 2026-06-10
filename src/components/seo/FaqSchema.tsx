import { Question } from "@/app/data/questions";

interface FaqSchemaProps {
  questions: Question[];
  lang?: "en" | "zh";
}

export default function FaqSchema({
  questions,
  lang = "en"
}: FaqSchemaProps) {
  const faqItems = questions.map((q) => ({
    "@type": "Question",
    "name": q.question[lang],
    "acceptedAnswer": {
      "@type": "Answer",
      "text": q.answer[lang],
      "author": {
        "@type": "Organization",
        "name": "蜕羽 / Silent Harvest",
        "url": "https://multhub.top"
      }
    }
  }));

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqItems
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
