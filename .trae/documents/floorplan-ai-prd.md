## 1. Product Overview

FloorPlan AI 是一个 AI 房地产内容生成 API 平台，用户只需上传 2D 户型图，系统即可自动生成高质量的 3D 展示、样板间渲染图和沉浸式漫游视频。

- 解决房地产营销内容制作成本高、周期长的问题，目标用户包括海外地产营销团队、房产中介、Airbnb 房东、装修公司等
- 市场价值在于将专业的 3D 内容制作平民化，大幅降低营销素材的时间和金钱成本

## 2. Core Features

### 2.1 User Roles
| Role | Registration Method | Core Permissions |
|------|---------------------|------------------|
| Normal User | No registration required for MVP | Upload floor plans, generate videos |

### 2.2 Feature Module
1. **Landing Page**: Hero section, product introduction, features showcase
2. **Upload & Generation Page**: File upload, preview, generation process
3. **Result Page**: Video display, download options, share functionality

### 2.3 Page Details
| Page Name | Module Name | Feature description |
|-----------|-------------|---------------------|
| Landing Page | Hero section | Large headline, product name, subtitle, primary CTA button |
| Landing Page | Features showcase | Three key features with icons and descriptions |
| Landing Page | How it works | Step-by-step workflow visualization |
| Upload Page | File upload | Drag & drop, file browse, preview thumbnail |
| Upload Page | Generation controls | Generate button, progress indicator, status messages |
| Result Page | Video display | Full-width video player, playback controls |
| Result Page | Actions | Download button, share options, generate another |

## 3. Core Process

用户访问网站 → 浏览产品介绍 → 上传 2D 户型图 → 系统处理并生成视频 → 用户预览和下载结果

```mermaid
flowchart LR
    A[访问首页] --> B[了解产品]
    B --> C[上传户型图]
    C --> D[AI 处理中]
    D --> E[生成视频]
    E --> F[预览和下载]
```

## 4. User Interface Design

### 4.1 Design Style
- **Primary colors**: Deep navy blue (#0F172A) as base, warm orange (#F97316) as accent
- **Button style**: Rounded rectangles with subtle shadow, hover with slight lift
- **Fonts**: Display font - Playfair Display, Body font - Inter
- **Layout style**: Clean, airy, large whitespace, full-bleed sections
- **Icon style**: Minimal, line-based, consistent stroke weight

### 4.2 Page Design Overview
| Page Name | Module Name | UI Elements |
|-----------|-------------|-------------|
| Landing Page | Hero section | Full-screen, left-aligned text, right visual, gradient overlay |
| Landing Page | Features | 3-column grid, large icons, short descriptions |
| Landing Page | How it works | Horizontal timeline, numbered steps, small illustrations |
| Upload Page | Upload area | Large drop zone, animated border, file preview |
| Upload Page | Progress | Linear progress bar, status text, loading animation |
| Result Page | Video player | Centered, large, play button overlay |

### 4.3 Responsiveness
Desktop-first design, fully responsive down to 375px mobile screens. Touch-optimized for tablet and mobile.

### 4.4 Visual Elements Guidance
- **Hero imagery**: Use a split-screen comparison showing 2D floor plan → 3D render transformation
- **Color scheme**: Dark mode by default for premium feel, warm orange accents for actions
- **Animations**: Subtle parallax on scroll, fade-in reveals, smooth hover transitions
- **Spacing**: Generous padding (8-12rem section heights), tight text alignment
