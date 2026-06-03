"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import { BLOG_POSTS, THEME_CLASSES } from "../../data/blog";
import { useLanguage } from "../../i18n";

export default function BlogDetailClient({ slug }: { slug: string }) {
  const { t, lang } = useLanguage();
  const postIndex = BLOG_POSTS.findIndex((p) => p.slug === slug);
  const post = postIndex >= 0 ? BLOG_POSTS[postIndex] : undefined;

  if (!post) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white">{t.postNotFoundTitle}</h1>
          <p className="mt-4 text-sm text-zinc-400">{t.postNotFound}</p>
          <Link
            href="/log"
            className="mt-6 inline-block text-sm font-medium text-zinc-400 underline underline-offset-4 hover:text-zinc-200"
          >
            {t.backToBlog}
          </Link>
        </div>
      </div>
    );
  }

  const theme = THEME_CLASSES[post.theme];

  /** Local glow gradient per theme — constructed from data to avoid editing data/blog.ts */
  const themeGlows: Record<string, string> = {
    emerald: "from-emerald-400/30 via-emerald-400/10 to-transparent",
    amber: "from-amber-400/30 via-amber-400/10 to-transparent",
    violet: "from-violet-400/30 via-violet-400/10 to-transparent",
    rose: "from-rose-400/30 via-rose-400/10 to-transparent",
    cyan: "from-cyan-400/30 via-cyan-400/10 to-transparent",
    blue: "from-blue-400/30 via-blue-400/10 to-transparent",
  };
  const glowGradient = themeGlows[post.theme] ?? themeGlows.emerald;

  return (
    <div className="min-h-screen bg-black">
      {/* Grid texture */}
      <div
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
        }}
      />

      <main className="relative z-10 mx-auto max-w-3xl px-6 py-24 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Link
            href="/log"
            className="mb-8 inline-block text-sm text-zinc-500 transition-colors hover:text-zinc-300"
          >
            {t.backToBlog}
          </Link>
        </motion.div>

        <article>
          {/* Header */}
          <motion.header
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className={`mb-10 border-l-4 ${theme.border} pl-5`}
          >
            <h1 className="mb-4 text-3xl font-bold leading-tight text-white md:text-4xl">
              {post.title[lang]}
            </h1>
            <div className="flex flex-wrap items-center gap-3">
              <time className="text-sm text-zinc-500">{post.date}</time>
              <span className="flex gap-1.5">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${theme.tag}`}
                  >
                    {tag}
                  </span>
                ))}
              </span>
            </div>
          </motion.header>

          {/* Body — rendered via react-markdown */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="prose prose-invert max-w-none
              prose-headings:text-zinc-100
              prose-h2:mb-4 prose-h2:mt-10 prose-h2:flex prose-h2:items-center prose-h2:gap-2 prose-h2:text-xl prose-h2:font-semibold
              prose-h3:mb-3 prose-h3:mt-8 prose-h3:text-lg prose-h3:font-semibold prose-h3:text-zinc-200
              prose-p:my-2 prose-p:text-sm prose-p:leading-relaxed prose-p:text-zinc-300
              prose-code:text-xs prose-code:text-emerald-300 prose-code:bg-zinc-800/50 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded
              prose-pre:my-4 prose-pre:overflow-x-auto prose-pre:rounded-lg prose-pre:border prose-pre:border-zinc-700 prose-pre:bg-zinc-800/50 prose-pre:p-4
              prose-pre:code:bg-transparent prose-pre:code:p-0 prose-pre:code:text-xs prose-pre:code:leading-relaxed prose-pre:code:text-zinc-300
              prose-blockquote:my-4 prose-blockquote:border-l-2 prose-blockquote:border-zinc-600 prose-blockquote:pl-4 prose-blockquote:text-sm prose-blockquote:text-zinc-400 prose-blockquote:italic
              prose-strong:text-zinc-100
              prose-li:text-sm prose-li:text-zinc-300
              prose-a:text-emerald-400 prose-a:no-underline hover:prose-a:underline
            "
          >
            <ReactMarkdown>{post.body[lang] ?? ""}</ReactMarkdown>
        </motion.div>

        {/* Theme-color decorative line — sits between body and footer */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.4 }}
          style={{ originX: 0 }}
          className={`my-10 h-0.5 w-full bg-gradient-to-r ${glowGradient} rounded-full`}
        />
      </article>

      {/* Bottom article navigation */}
      <nav className="mt-12 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {postIndex > 0 ? (
          <Link
            href={`/log/${BLOG_POSTS[postIndex - 1].slug}`}
            className="group flex items-center gap-2 rounded-lg border border-zinc-800 bg-zinc-900/30 px-4 py-3 text-sm text-zinc-400 transition-all hover:border-zinc-700 hover:text-zinc-200"
          >
            <span className="text-xs text-zinc-600 transition-colors group-hover:text-zinc-400">
              ←
            </span>
            <span className="max-w-[200px] truncate">
              {BLOG_POSTS[postIndex - 1].title[lang]}
            </span>
          </Link>
        ) : (
          <span />
        )}
        {postIndex < BLOG_POSTS.length - 1 ? (
          <Link
            href={`/log/${BLOG_POSTS[postIndex + 1].slug}`}
            className="group flex items-center gap-2 rounded-lg border border-zinc-800 bg-zinc-900/30 px-4 py-3 text-sm text-zinc-400 transition-all hover:border-zinc-700 hover:text-zinc-200 sm:text-right"
          >
            <span className="max-w-[200px] truncate">
              {BLOG_POSTS[postIndex + 1].title[lang]}
            </span>
            <span className="text-xs text-zinc-600 transition-colors group-hover:text-zinc-400">
              →
            </span>
          </Link>
        ) : (
          <span />
        )}
      </nav>

        {/* Footer decorative */}
        <div className="mt-16 flex items-center justify-center gap-3">
          {["◇", "◆", "◇"].map((char, i) => (
            <motion.span
              key={i}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{
                delay: 0.5 + i * 0.1,
                type: "spring",
                stiffness: 300,
              }}
              className="text-zinc-700"
            >
              {char}
            </motion.span>
          ))}
        </div>
      </main>
    </div>
  );
}