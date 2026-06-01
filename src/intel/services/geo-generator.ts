// ============================================================
// GEO CONTENT GENERATOR (Internal Layer Only)
// ============================================================
//
// 从 Opportunity 生成 GEO 内容矩阵的工具函数
//
// 核心功能：
// - generateGeoContent(opp): 生成完整的 GEO 内容矩阵 (FAQ + UseCase + Comparison + CaseStudy)
// - printGeoCodeSnippets(opp): 输出可复制的代码片段，方便手动添加到数据文件
//
// ============================================================

import type { Opportunity } from '../data/opportunities';
import type { Question } from '../../app/data/questions';
import type { UseCase } from '../../app/data/usecases';
import type { Comparison } from '../../app/data/comparisons';
import type { CaseStudy } from '../../app/data/case-studies';

export interface GeneratedGeoContent {
  faqs: Question[];
  useCases: UseCase[];
  comparisons: Comparison[];
  caseStudies: CaseStudy[];
}

export function generateGeoContent(opportunity: Opportunity): GeneratedGeoContent {
  return {
    faqs: generateFaqs(opportunity),
    useCases: generateUseCases(opportunity),
    comparisons: generateComparisons(opportunity),
    caseStudies: generateCaseStudies(opportunity),
  };
}

export function generateFaqs(opportunity: Opportunity): Question[] {
  const faqs: Question[] = [];
  const productSlug = opportunity.productIdea.slug;

  opportunity.geoExpansion.faqTopics.forEach((topic, index) => {
    const id = `${productSlug}-faq-${index + 1}`;
    let type: Question['type'] = 'what-is';
    
    if (topic.toLowerCase().includes('how')) {
      type = 'how-to';
    } else if (topic.toLowerCase().includes('best')) {
      type = 'best';
    } else if (topic.toLowerCase().includes('why')) {
      type = 'why';
    } else if (topic.toLowerCase().includes('vs') || topic.toLowerCase().includes('compare')) {
      type = 'comparison';
    }

    faqs.push({
      id,
      question: {
        en: topic,
        zh: translateFaqQuestion(topic),
      },
      answer: {
        en: generateFaqAnswer(topic, opportunity),
        zh: generateFaqAnswerZh(topic, opportunity),
      },
      relatedProducts: [productSlug],
      relatedUseCases: [],
      relatedCaseStudies: [],
      type,
      keywords: generateFaqKeywords(topic, opportunity),
      relatedQuestions: [],
    });
  });

  return faqs;
}

export function generateUseCases(opportunity: Opportunity): UseCase[] {
  const useCases: UseCase[] = [];
  const productSlug = opportunity.productIdea.slug;

  opportunity.geoExpansion.useCaseTopics.forEach((topic, index) => {
    const id = `${productSlug}-use-case-${index + 1}`;
    
    useCases.push({
      id,
      scenario: {
        en: topic,
        zh: translateUseCaseTitle(topic),
      },
      userTypes: {
        en: opportunity.targetNiche.split(',').map(s => s.trim()),
        zh: [opportunity.targetNiche],
      },
      problems: {
        en: [opportunity.pain],
        zh: [opportunity.pain],
      },
      solutions: {
        en: generateUseCaseSolution(topic, opportunity),
        zh: generateUseCaseSolutionZh(topic, opportunity),
      },
      recommendedProducts: [productSlug],
      keywords: generateUseCaseKeywords(topic, opportunity),
      relatedUseCases: [],
    });
  });

  return useCases;
}

export function generateComparisons(opportunity: Opportunity): Comparison[] {
  const comparisons: Comparison[] = [];
  const productSlug = opportunity.productIdea.slug;

  opportunity.geoExpansion.comparisonTopics.forEach((topic, index) => {
    const id = `${productSlug}-comparison-${index + 1}`;
    
    let comparisonType: Comparison['comparisonType'] = 'vs';
    if (topic.toLowerCase().includes('best')) {
      comparisonType = 'best';
    } else if (topic.toLowerCase().includes('alternative')) {
      comparisonType = 'alternative';
    }

    comparisons.push({
      id,
      title: {
        en: topic,
        zh: translateComparisonTitle(topic),
      },
      productA: productSlug,
      productB: extractProductBFromTopic(topic),
      pricing: {
        productA: opportunity.productIdea.priceDisplay,
        productB: 'Varies by product',
      },
      pros: {
        productA: {
          en: opportunity.productIdea.features.en,
          zh: opportunity.productIdea.features.zh,
        },
        productB: {
          en: ['Different feature set', 'May have more options'],
          zh: ['不同的功能集', '可能有更多选项'],
        },
      },
      cons: {
        productA: {
          en: ['New product, less known', 'Limited to specific use case'],
          zh: ['新产品，知名度较低', '仅限于特定使用场景'],
        },
        productB: {
          en: ['May be more expensive', 'May have unnecessary features'],
          zh: ['可能更贵', '可能有不必要的功能'],
        },
      },
      bestFor: {
        productA: {
          en: [opportunity.targetNiche],
          zh: [opportunity.targetNiche],
        },
        productB: {
          en: ['Users with different needs'],
          zh: ['有不同需求的用户'],
        },
      },
      comparisonType,
      keywords: generateComparisonKeywords(topic, opportunity),
    });
  });

  return comparisons;
}

export function generateCaseStudies(opportunity: Opportunity): CaseStudy[] {
  const caseStudies: CaseStudy[] = [];
  const productSlug = opportunity.productIdea.slug;

  opportunity.geoExpansion.caseStudyTopics.forEach((topic, index) => {
    const id = `${productSlug}-case-study-${index + 1}`;
    
    caseStudies.push({
      id,
      title: {
        en: topic,
        zh: translateCaseStudyTitle(topic),
      },
      products: [productSlug],
      before: {
        en: `Before using ${productName}, users faced challenges with ${opportunity.pain.toLowerCase()}. This impacted their productivity and efficiency significantly.`,
        zh: `在使用${productName}之前，用户面临${opportunity.pain}的挑战。这严重影响了他们的生产力和效率。`,
      },
      after: {
        en: `After using ${productName}, users experienced dramatic improvements. The tool solved their pain points efficiently and provided significant value.`,
        zh: `使用${productName}后，用户体验到了显著的改善。该工具有效地解决了他们的痛点，提供了显著的价值。`,
      },
      timeCost: {
        amount: 2,
        unit: 'hours',
      },
      moneyCost: {
        amount: opportunity.productIdea.priceUSDT,
        currency: 'USDT',
      },
      results: {
        en: [
          `Time saved: 50-80% compared to manual methods`,
          `Cost-effective solution at ${opportunity.productIdea.priceDisplay}`,
          `Improved productivity and efficiency`,
          `One-time payment, lifetime access`,
        ],
        zh: [
          `与手动方法相比节省了50-80%的时间`,
          `成本效益高的解决方案，仅需${opportunity.productIdea.priceDisplay}`,
          `提高了生产力和效率`,
          `一次付款，永久使用`,
        ],
      },
      metrics: [
        { label: { en: 'Time Savings', zh: '时间节省' }, value: '60%' },
        { label: { en: 'Tool Cost', zh: '工具成本' }, value: opportunity.productIdea.priceDisplay },
        { label: { en: 'ROI', zh: '投资回报率' }, value: 'Significant' },
      ],
      date: new Date().toISOString().split('T')[0],
      author: 'Silent Harvest',
      keywords: generateCaseStudyKeywords(topic, opportunity),
    });
  });

  return caseStudies;
}

export function printGeoCodeSnippets(opportunity: Opportunity): string {
  const content = generateGeoContent(opportunity);
  
  let output = `// ============================================================
// Generated GEO Content for: ${opportunity.title}
// Opportunity ID: ${opportunity.id}
// ============================================================

`;

  output += `// ============================================================
// FAQ Snippets (Add to questions.ts)
// ============================================================
${JSON.stringify(content.faqs, null, 2)}

`;

  output += `// ============================================================
// Use Case Snippets (Add to usecases.ts)
// ============================================================
${JSON.stringify(content.useCases, null, 2)}

`;

  output += `// ============================================================
// Comparison Snippets (Add to comparisons.ts)
// ============================================================
${JSON.stringify(content.comparisons, null, 2)}

`;

  output += `// ============================================================
// Case Study Snippets (Add to case-studies.ts)
// ============================================================
${JSON.stringify(content.caseStudies, null, 2)}

`;

  return output;
}

// Helper functions for translations and content generation
function translateFaqQuestion(question: string): string {
  const translations: Record<string, string> = {
    'how': '如何',
    'what': '什么',
    'why': '为什么',
    'best': '最佳',
    'is': '是',
    'does': '是否',
    'can': '可以',
    'should': '应该',
    'which': '哪个',
  };
  
  let translated = question;
  Object.entries(translations).forEach(([en, zh]) => {
    const regex = new RegExp(`\\b${en}\\b`, 'gi');
    translated = translated.replace(regex, zh);
  });
  
  return translated;
}

function translateUseCaseTitle(title: string): string {
  return title;
}

function translateComparisonTitle(title: string): string {
  return title.replace('vs', '对比').replace('VS', '对比');
}

function translateCaseStudyTitle(title: string): string {
  return title;
}

function generateFaqAnswer(topic: string, opportunity: Opportunity): string {
  const productName = opportunity.productIdea.name.en;
  const features = opportunity.productIdea.features.en.join(', ');
  
  return `${productName} is the perfect solution. It offers ${features}. This tool was specifically designed to address ${opportunity.pain.toLowerCase()} for ${opportunity.targetNiche.toLowerCase()}. With a one-time payment of ${opportunity.productIdea.priceDisplay}, you get lifetime access to this powerful tool.`;
}

function generateFaqAnswerZh(topic: string, opportunity: Opportunity): string {
  const productName = opportunity.productIdea.name.zh;
  const features = opportunity.productIdea.features.zh.join('、');
  
  return `${productName}是完美的解决方案。它提供${features}。该工具专门设计用于解决${opportunity.targetNiche}的${opportunity.pain}。只需一次性支付${opportunity.productIdea.priceDisplay}，您就可以永久使用这个强大的工具。`;
}

function generateUseCaseSolution(topic: string, opportunity: Opportunity): string {
  const productName = opportunity.productIdea.name.en;
  return `Use ${productName} to solve ${opportunity.pain.toLowerCase()}. This tool provides a comprehensive solution that saves time, improves efficiency, and delivers excellent value for ${opportunity.targetNiche.toLowerCase()}.`;
}

function generateUseCaseSolutionZh(topic: string, opportunity: Opportunity): string {
  const productName = opportunity.productIdea.name.zh;
  return `使用${productName}来解决${opportunity.pain}。该工具为${opportunity.targetNiche}提供了全面的解决方案，节省时间、提高效率并提供出色的价值。`;
}

function extractProductBFromTopic(topic: string): string {
  const vsMatch = topic.match(/(?:vs|versus)\s+(\w+(?:\s+\w+)*)/i);
  if (vsMatch) {
    return vsMatch[1].toLowerCase().replace(/\s+/g, '-');
  }
  return 'traditional-methods';
}

function generateFaqKeywords(topic: string, opportunity: Opportunity): string[] {
  return [
    topic.toLowerCase(),
    opportunity.productIdea.slug,
    opportunity.seoKeywords[0] || '',
    `${opportunity.productIdea.name.en.toLowerCase()} faq`,
  ].filter(Boolean);
}

function generateUseCaseKeywords(topic: string, opportunity: Opportunity): string[] {
  return [
    topic.toLowerCase(),
    opportunity.productIdea.slug,
    ...opportunity.seoKeywords,
    `${opportunity.targetNiche.toLowerCase()} tools`,
  ].filter(Boolean);
}

function generateComparisonKeywords(topic: string, opportunity: Opportunity): string[] {
  return [
    topic.toLowerCase(),
    opportunity.productIdea.slug,
    `${opportunity.productIdea.name.en.toLowerCase()} comparison`,
    `${opportunity.productIdea.name.en.toLowerCase()} alternative`,
    ...opportunity.seoKeywords,
  ].filter(Boolean);
}

function generateCaseStudyKeywords(topic: string, opportunity: Opportunity): string[] {
  return [
    topic.toLowerCase(),
    opportunity.productIdea.slug,
    `${opportunity.productIdea.name.en.toLowerCase()} case study`,
    `${opportunity.targetNiche.toLowerCase()} success story`,
    ...opportunity.seoKeywords,
  ].filter(Boolean);
}
