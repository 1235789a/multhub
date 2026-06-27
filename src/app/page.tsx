import Link from "next/link";
import { PRODUCTS } from "./data/products";

export default function HomePage() {
  const web3ContentFactory = PRODUCTS.find((p) => p.slug === "web3-content-factory");
  const web3PromoImageFactory = PRODUCTS.find((p) => p.slug === "web3-promo-image-factory");
  const otherProducts = PRODUCTS.filter(
    (p) =>
      p.status === "available" &&
      p.slug !== "web3-content-factory" &&
      p.slug !== "web3-promo-image-factory",
  );

  return (
    <main className="min-h-screen bg-black text-zinc-200">
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/10 via-transparent to-transparent" />
        <div className="relative mx-auto max-w-6xl px-6 py-20 md:py-28">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-zinc-900 border border-zinc-800 rounded-full px-3 py-1 text-xs text-zinc-400 mb-6">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
              Built for Web3 founders
            </div>

            <h1 className="text-4xl md:text-6xl font-bold text-white tracking-tight mb-6">
              Web3 Content{" "}
              <span className="text-emerald-400">Factory</span>
            </h1>

            <p className="text-lg md:text-xl text-zinc-400 mb-4 leading-relaxed">
              AI content tools for small Web3 projects.
            </p>

            <p className="text-zinc-500 mb-8 max-w-2xl leading-relaxed">
              Create ready-to-post X content, Telegram announcements,
              launch threads, meme prompts, and community updates in minutes.
              No subscription. Pay once with USDT.
            </p>

            <div className="flex flex-wrap gap-3 mb-12">
              <Link
                href="/apps/web3-content-factory"
                className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-black font-semibold px-5 py-3 rounded-lg transition-colors text-sm"
              >
                Try it free →
                <span className="text-xs text-black/60">3 generations</span>
              </Link>
              <Link
                href="/checkout/web3-content-factory"
                className="inline-flex items-center gap-2 border border-zinc-700 hover:border-zinc-600 text-zinc-300 px-5 py-3 rounded-lg transition-colors text-sm"
              >
                Buy with USDT
                <span className="text-xs text-zinc-500">9 USDT · 100 gens</span>
              </Link>
            </div>

            <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-zinc-500">
              <FeatureTag icon="⚡" text="3 free trial generations" />
              <FeatureTag icon="💎" text="One-time payment" />
              <FeatureTag icon="₮" text="USDT TRC20" />
              <FeatureTag icon="🔓" text="No subscription" />
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-20">
        <div className="grid md:grid-cols-3 gap-4 mb-20">
          <UseCaseCard
            icon="🐕"
            title="Meme Coins"
            desc="Launch-ready threads, meme prompts, and community engagement content."
          />
          <UseCaseCard
            icon="🖼️"
            title="NFT Projects"
            desc="Mint announcements, collection reveals, and holder appreciation posts."
          />
          <UseCaseCard
            icon="🤖"
            title="AI Agents"
            desc="Product launch content, feature updates, and use case storytelling."
          />
        </div>

        <div className="mb-20">
          <h2 className="text-2xl font-bold text-white mb-2">
            Example Output
          </h2>
          <p className="text-zinc-500 mb-8">
            What you get in one generation — 7 content types, ready to publish.
          </p>

          <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl overflow-hidden">
            <div className="px-5 py-3 border-b border-zinc-800 flex items-center justify-between">
              <span className="text-sm text-zinc-400">
                Project: <span className="text-zinc-200 font-medium">ChainPup AI</span>
                <span className="text-zinc-600 mx-2">·</span>
                AI agent that tracks meme coin communities
              </span>
              <span className="text-xs text-emerald-400">Sample</span>
            </div>
            <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-zinc-800">
              <ExampleBlock
                label="X Hook"
                content="Most meme coins don't die because of bad charts. They die because the community goes silent."
              />
              <ExampleBlock
                label="Meme Prompt"
                content="A cyberpunk puppy watching crypto charts on multiple glowing monitors, radar scanning meme coin communities, dark blue Web3 launch poster style."
              />
              <ExampleBlock
                label="Telegram Announcement"
                content="Welcome to ChainPup AI. We track meme coin community signals, trending narratives, and early attention spikes. Early access drops Friday."
              />
              <ExampleBlock
                label="Community Post"
                content="Drop one meme coin you think will trend this week. We'll scan the loudest communities and post the top 3 signals tomorrow."
              />
            </div>
          </div>
        </div>

        <div className="mb-20">
          <h2 className="text-2xl font-bold text-white mb-2">
            Everything you get
          </h2>
          <p className="text-zinc-500 mb-8">
            7 types of content in one generation. Copy, paste, publish.
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
            <ContentItem icon="📱" title="X Post" desc="Punchy, engagement-ready post" />
            <ContentItem icon="🧵" title="X Thread" desc="5-post launch/announcement thread" />
            <ContentItem icon="📢" title="Telegram Announcement" desc="Channel-ready announcement" />
            <ContentItem icon="📌" title="Pinned Message" desc="Welcome + key links pinned msg" />
            <ContentItem icon="🖼️" title="Meme Image Prompt" desc="Image gen prompt for promo art" />
            <ContentItem icon="💬" title="Community Post" desc="Discussion-sparking question" />
            <ContentItem icon="📅" title="7-Day Content Plan" desc="One week of content ideas" />
          </div>
        </div>

        {web3ContentFactory && web3PromoImageFactory && (
          <div className="mb-16">
            <h2 className="text-2xl font-bold text-white mb-2">
              Tools
            </h2>
            <p className="text-zinc-500 mb-8">
              Create content and visuals for small Web3 projects.
            </p>

            <div className="grid md:grid-cols-2 gap-4">
              <Link
                href={`/store/${web3ContentFactory.slug}`}
                className="group bg-zinc-900/50 border border-zinc-800 hover:border-emerald-600/50 rounded-xl p-5 transition-colors"
              >
                <div className="flex items-start gap-4">
                  <div className="text-3xl">{web3ContentFactory.icon}</div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-semibold text-white group-hover:text-emerald-400 transition-colors">
                        {web3ContentFactory.name.en}
                      </h3>
                      <span className="text-sm text-emerald-400">
                        {web3ContentFactory.priceDisplay}
                      </span>
                    </div>
                    <p className="text-sm text-zinc-500 line-clamp-2">
                      {web3ContentFactory.tagline?.en ?? web3ContentFactory.features.en[0] ?? ""}
                    </p>
                    <div className="mt-2 flex gap-2">
                      <span className="text-xs text-zinc-600">Content</span>
                      <span className="text-xs text-zinc-600">X / Telegram</span>
                    </div>
                  </div>
                </div>
              </Link>

              <Link
                href={`/store/${web3PromoImageFactory.slug}`}
                className="group bg-zinc-900/50 border border-zinc-800 hover:border-emerald-600/50 rounded-xl p-5 transition-colors"
              >
                <div className="flex items-start gap-4">
                  <div className="text-3xl">{web3PromoImageFactory.icon}</div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-semibold text-white group-hover:text-emerald-400 transition-colors">
                        {web3PromoImageFactory.name.en}
                      </h3>
                      <span className="text-sm text-emerald-400">
                        {web3PromoImageFactory.priceDisplay}
                      </span>
                    </div>
                    <p className="text-sm text-zinc-500 line-clamp-2">
                      {web3PromoImageFactory.tagline?.en ?? web3PromoImageFactory.features.en[0] ?? ""}
                    </p>
                    <div className="mt-2 flex gap-2">
                      <span className="text-xs text-zinc-600">Images</span>
                      <span className="text-xs text-zinc-600">Prompts / Visuals</span>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        )}

        {otherProducts.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">
              More tools
            </h2>
            <p className="text-zinc-500 mb-8">
              Other tools in the Web3 Content Factory suite.
            </p>

            <div className="grid md:grid-cols-2 gap-4">
              {otherProducts.map((p) => (
                <Link
                  key={p.slug}
                  href={`/store/${p.slug}`}
                  className="group bg-zinc-900/50 border border-zinc-800 hover:border-zinc-700 rounded-xl p-5 transition-colors"
                >
                  <div className="flex items-start gap-4">
                    <div className="text-2xl">{p.icon}</div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-semibold text-white group-hover:text-emerald-400 transition-colors">
                          {p.name.en}
                        </h3>
                        <span className="text-sm text-emerald-400">
                          {p.priceDisplay}
                        </span>
                      </div>
                      <p className="text-sm text-zinc-500 line-clamp-2">
                        {p.tagline?.en ?? p.features.en[0] ?? ""}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </section>

      <footer className="border-t border-zinc-900">
        <div className="mx-auto max-w-6xl px-6 py-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="text-sm text-zinc-600">
              © {new Date().getFullYear()} Web3 Content Factory
            </div>
            <div className="flex gap-4 text-sm">
              <Link
                href="/store"
                className="text-zinc-500 hover:text-zinc-300 transition-colors"
              >
                Store
              </Link>
              <Link
                href="/apps/web3-content-factory"
                className="text-zinc-500 hover:text-zinc-300 transition-colors"
              >
                App
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}

function FeatureTag({ icon, text }: { icon: string; text: string }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span>{icon}</span>
      <span>{text}</span>
    </span>
  );
}

function UseCaseCard({
  icon,
  title,
  desc,
}: {
  icon: string;
  title: string;
  desc: string;
}) {
  return (
    <div className="bg-zinc-900/30 border border-zinc-800 rounded-xl p-5">
      <div className="text-3xl mb-3">{icon}</div>
      <h3 className="text-white font-semibold mb-1">{title}</h3>
      <p className="text-sm text-zinc-500">{desc}</p>
    </div>
  );
}

function ExampleBlock({
  label,
  content,
}: {
  label: string;
  content: string;
}) {
  return (
    <div className="p-5">
      <div className="text-xs text-zinc-500 mb-2">{label}</div>
      <p className="text-sm text-zinc-300 leading-relaxed">{content}</p>
    </div>
  );
}

function ContentItem({
  icon,
  title,
  desc,
}: {
  icon: string;
  title: string;
  desc: string;
}) {
  return (
    <div className="bg-zinc-900/30 border border-zinc-800 rounded-lg p-4 flex gap-3">
      <div className="text-xl">{icon}</div>
      <div>
        <div className="text-sm font-medium text-zinc-200">{title}</div>
        <div className="text-xs text-zinc-500">{desc}</div>
      </div>
    </div>
  );
}
