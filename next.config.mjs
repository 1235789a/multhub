/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
  },
  // SWC minify: Rust 编写的极速压缩器，比默认 Terser 快 7-10 倍
  swcMinify: true,
  // 生产构建跳过 ESLint（在 CI 中单独运行 lint）
  eslint: {
    ignoreDuringBuilds: true,
  },
  // 保持类型检查，确保构建时发现类型错误
  typescript: {
    ignoreBuildErrors: false,
  },
};

export default nextConfig;
