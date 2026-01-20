# Specl 图标系统文档

## 概述

Specl 图标系统是一套基于 SVG 的图标库，与项目的设计风格保持一致：

- **极简风格**: 线条清晰，去除多余装饰
- **技术感**: 融合代码花括号元素
- **暗黑主题优化**: 在深色背景下具有良好对比度
- **一致性**: 所有图标使用统一的线条粗细和圆角

## 配色方案

```
背景色:     #0d0d0f (深黑)
前景色:     #f5f5f7 (浅灰白)
主强调色:   #6366f1 (Indigo)
次要强调色: #3b82f6 (蓝色)
边框色:     #27272a (深灰)
```

## 图标组件

### 核心 Logo 图标

#### `SpeclLogo`
带背景的完整版本，用于 Hero 区域、登录页等。

```tsx
import { SpeclLogo } from '@/components/icons/specl-icons';

<SpeclLogo size={512} className="w-32 h-32" />
```

#### `SpeclLogoIcon`
无背景图标版本，使用 `currentColor` 继承文字颜色，用于导航栏、按钮等。

```tsx
import { SpeclLogoIcon } from '@/components/icons/specl-icons';

<SpeclLogoIcon size={32} className="text-[var(--accent)]" />
```

#### `SpeclSimpleIcon`
简化版 S 形状，用于小尺寸场景（16-24px）。

```tsx
import { SpeclSimpleIcon } from '@/components/icons/specl-icons';

<SpeclSimpleIcon size={20} className="text-white" />
```

### 功能图标

#### `DocumentIcon`
文档/PRD 图标，用于文档列表和页面。

```tsx
import { DocumentIcon } from '@/components/icons/specl-icons';

<DocumentIcon size={24} className="text-[var(--muted-foreground)]" />
```

#### `CodeIcon`
代码/导出图标，用于导出功能和代码生成。

```tsx
import { CodeIcon } from '@/components/icons/specl-icons';

<CodeIcon size={24} className="text-[var(--accent)]" />
```

#### `CheckCircleIcon`
验证/检查图标，用于就绪检查和验证状态。

```tsx
import { CheckCircleIcon } from '@/components/icons/specl-icons';

<CheckCircleIcon size={20} className="text-[var(--success)]" />
```

#### `SparklesIcon`
AI 助手图标，用于 AI 辅助功能。

```tsx
import { SparklesIcon } from '@/components/icons/specl-icons';

<SparklesIcon size={24} className="text-[var(--warning)]" />
```

#### `AlertCircleIcon`
问题/警告图标，用于问题面板和帮助。

```tsx
import { AlertCircleIcon } from '@/components/icons/specl-icons';

<AlertCircleIcon size={20} className="text-[var(--destructive)]" />
```

### 操作图标

#### `EditIcon` / `TrashIcon`
编辑和删除图标。

```tsx
import { EditIcon, TrashIcon } from '@/components/icons/specl-icons';

<button>
  <EditIcon size={16} />
</button>
```

#### `PlusIcon` / `DownloadIcon`
新建和导出图标。

```tsx
import { PlusIcon, DownloadIcon } from '@/components/icons/specl-icons';

<button>
  <PlusIcon size={20} />
  <span>New PRD</span>
</button>
```

#### `XIcon` / `MenuIcon`
关闭和菜单图标。

```tsx
import { XIcon, MenuIcon } from '@/components/icons/specl-icons';

<button>
  <XIcon size={24} />
</button>
```

### 品牌图标

#### `GitHubIcon`
GitHub 品牌图标。

```tsx
import { GitHubIcon } from '@/components/icons/specl-icons';

<a href="https://github.com/your-repo">
  <GitHubIcon size={24} />
</a>
```

## 网站图标

项目包含以下网站图标文件：

- `app/favicon.svg` - 标准 favicon (SVG)
- `app/icon.svg` - PWA 图标 (512x512)
- `app/apple-touch-icon.svg` - Apple 设备图标 (180x180)

## 使用示例

### 导航栏 Logo

```tsx
import Link from 'next/link';
import { SpeclSimpleIcon } from '@/components/icons/specl-icons';

<Link href="/" className="flex items-center gap-2.5">
  <div className="w-8 h-8 bg-[var(--accent)] rounded-lg flex items-center justify-center">
    <SpeclSimpleIcon size={20} className="text-white" />
  </div>
  <span className="font-semibold text-lg">Specl</span>
</Link>
```

### 功能卡片图标

```tsx
import { DocumentIcon } from '@/components/icons/specl-icons';

<div className="card">
  <div className="w-12 h-12 rounded-xl bg-[var(--accent)]/15 flex items-center justify-center mb-4">
    <DocumentIcon size={24} className="text-[var(--accent)]" />
  </div>
  <h3>Structured Context</h3>
  <p>Export JSON-schema validated documents</p>
</div>
```

### 按钮图标

```tsx
import { ArrowRightIcon } from '@/components/icons/specl-icons';

<button className="btn btn-primary">
  Get Started
  <ArrowRightIcon size={16} />
</button>
```

### 状态指示器

```tsx
import { CheckCircleIcon, AlertCircleIcon } from '@/components/icons/specl-icons';

<div className="flex items-center gap-2">
  {isValid ? (
    <>
      <CheckCircleIcon size={16} className="text-[var(--success)]" />
      <span className="text-sm">Valid</span>
    </>
  ) : (
    <>
      <AlertCircleIcon size={16} className="text-[var(--destructive)]" />
      <span className="text-sm">Invalid</span>
    </>
  )}
</div>
```

## 图标尺寸规范

| 用途 | 尺寸 | 图标组件 |
|------|------|----------|
| Logo 大图 | 512px | `SpeclLogo` |
| Hero 区域 | 128-256px | `SpeclLogo` |
| 导航栏 | 24-32px | `SpeclSimpleIcon` |
| 按钮 | 16-20px | 所有功能图标 |
| 卡片装饰 | 24-48px | 所有功能图标 |
| 状态指示 | 16-20px | `CheckCircleIcon`, `AlertCircleIcon` |

## 样式类

图标支持通过 Tailwind CSS 类名进行样式调整：

```tsx
// 颜色
<SpeclLogoIcon className="text-[var(--accent)]" />

// 尺寸
<DocumentIcon className="w-6 h-6" />

// 悬停效果
<EditIcon className="hover:text-[var(--accent)] transition-colors" />

// 旋转动画
<SettingsIcon className="animate-spin" />
```

## 设计原则

1. **线条一致性**: 所有图标使用 2px 线条粗细（小尺寸可适当调整）
2. **圆角统一**: 使用 `stroke-linecap="round"` 和 `stroke-linejoin="round"`
3. **色彩语义**:
   - 成功/完成: 绿色 (`#22c55e`)
   - 警告/处理中: 黄色/橙色 (`#f59e0b`)
   - 错误/阻止: 红色 (`#ef4444`)
   - 主要操作: Indigo (`#6366f1`)
   - 次要操作: 蓝色 (`#3b82f6`)
4. **可访问性**: 所有图标应配合文字说明使用

## 扩展指南

如需添加新图标，请遵循以下规范：

1. 使用 24x24 viewBox
2. 使用 `fill="none"` 和 `stroke="currentColor"`
3. 设置 `strokeWidth={2}` (可按需调整)
4. 添加 `strokeLinecap="round"` 和 `strokeLinejoin="round"`
5. 导出时设置清晰的 TypeScript 接口

```tsx
export function YourNewIcon({
  size = 24,
  className = '',
}: {
  size?: number;
  className?: string;
}) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      {/* 你的路径 */}
    </svg>
  );
}
```
