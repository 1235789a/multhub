import { MetadataRoute } from "next";
import { PRODUCTS } from "./data/products";
import { BLOG_POSTS } from "./data/blog";
import { QUESTIONS } from "./data/questions";
import { CASE_STUDIES } from "./data/case-studies";
import { COMPARISONS } from "./data/comparisons";
import { USE_CASES } from "./data/usecases";

const BASE_URL = "https://multhub.top";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/store`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/log`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/changelog`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
  ];

  const productPages: MetadataRoute.Sitemap = PRODUCTS.map((product) => ({
    url: `${BASE_URL}/store/${product.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const blogPages: MetadataRoute.Sitemap = BLOG_POSTS.map((post) => ({
    url: `${BASE_URL}/log/${post.slug}`,
    lastModified: post.date ? new Date(post.date) : new Date(),
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  const appPages: MetadataRoute.Sitemap = [
    {
      url: `${BASE_URL}/apps/tariff-lens`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
  ];

  const faqPages: MetadataRoute.Sitemap = QUESTIONS.map((q) => ({
    url: `${BASE_URL}/geo/faq/${q.id}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  const caseStudyPages: MetadataRoute.Sitemap = CASE_STUDIES.map((c) => ({
    url: `${BASE_URL}/geo/case-study/${c.id}`,
    lastModified: c.date ? new Date(c.date) : new Date(),
    changeFrequency: "yearly",
    priority: 0.7,
  }));

  const comparisonPages: MetadataRoute.Sitemap = COMPARISONS.map((c) => ({
    url: `${BASE_URL}/geo/comparison/${c.id}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const useCasePages: MetadataRoute.Sitemap = USE_CASES.map((u) => ({
    url: `${BASE_URL}/geo/${u.id}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [
    ...staticPages,
    ...productPages,
    ...blogPages,
    ...appPages,
    ...faqPages,
    ...caseStudyPages,
    ...comparisonPages,
    ...useCasePages,
  ];
}
