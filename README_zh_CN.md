# Parsec React Webview

一个现代化的 VSCode 扩展模板，使用 React + Vite + Tailwind CSS + shadcn/ui 构建 Webview。

[English](./README.md) | 中文

## 特性

- 🚀 **快速开发** - Vite 热更新（HMR），即时预览
- ⚛️ **React 19** - 使用最新版本的 React 构建 UI
- 🎨 **shadcn/ui** - 基于 Radix UI 的精美、可访问组件库
- 🎯 **Tailwind CSS v4** - 实用优先的 CSS 框架
- 🔄 **RPC 通信** - Webview 与扩展宿主之间的类型安全通信
- 📦 **TypeScript** - 全栈类型安全
- 🔒 **安全 CSP** - 开发和生产环境的内容安全策略
- 🛠️ **ESLint + Prettier** - 代码质量与格式化
- 🐶 **Husky + lint-staged** - Git 提交钩子自动检查

## 项目结构

```
├── src/
│   ├── extension.ts              # 扩展入口
│   ├── getWebviewContent.ts      # Webview HTML 生成（开发/生产）
│   ├── router.ts                 # RPC 路由定义
│   └── webview/                  # React Webview 源码
│       ├── main.tsx              # React 入口
│       ├── App.tsx               # 主组件
│       ├── index.css             # 全局样式 & Tailwind 配置
│       ├── components/           # React 组件
│       │   └── ui/               # shadcn/ui 组件
│       ├── context/              # React Context
│       ├── lib/                  # 工具函数
│       └── assets/               # 静态资源
├── assets/                       # 扩展资源（图标）
├── dist/                         # 构建输出
│   ├── extension.js              # 打包后的扩展
│   └── webview/                  # 构建后的 Webview
├── esbuild.config.mjs            # 扩展打包配置
├── vite.config.ts                # Webview 打包配置
├── tsconfig.json                 # 扩展 TypeScript 配置
├── tsconfig.webview.json         # Webview TypeScript 配置
├── components.json               # shadcn/ui 配置
└── package.json                  # 项目配置
```

## 快速开始

### 环境要求

- Node.js v18+
- Visual Studio Code
- Git

### 安装

```bash
# 克隆仓库
git clone <repository-url>
cd parsec-react-webview

# 安装依赖
npm install

# 初始化 Husky（Git 钩子）
npx husky init
```

### 开发

1. **启动 Vite 开发服务器**：

   ```bash
   npm run dev:webview
   ```

2. **在 VSCode 中启动扩展**：
   - 按 `F5` 打开扩展宿主窗口
   - 点击活动栏的 💬 图标

3. **开始编码**：
   - 编辑 `src/webview/` 下的文件
   - 修改会自动热更新

### 构建

```bash
# 构建 Webview
npm run build:webview

# 构建扩展
npm run build

# 构建全部（用于打包）
npm run vscode:prepublish
```

### 打包

```bash
# 打包为 .vsix 文件
npm run package

# 安装到 VSCode
code --install-extension parsec-react-webview-*.vsix
```

## 可用脚本

| 脚本                    | 说明                           |
| ----------------------- | ------------------------------ |
| `npm run dev:webview`   | 启动 Vite 开发服务器（带 HMR） |
| `npm run build:webview` | 构建 Webview 生产版本          |
| `npm run build`         | 使用 esbuild 构建扩展          |
| `npm run compile`       | TypeScript 类型检查            |
| `npm run lint`          | 运行 ESLint                    |
| `npm run format`        | 使用 Prettier 格式化代码       |
| `npm run format:check`  | 检查代码格式                   |
| `npm run package`       | 打包为 .vsix 文件              |
| `npm run watch`         | 扩展监听模式                   |

## 架构说明

### 扩展宿主（Node.js）

- `src/extension.ts` - 注册 Webview Provider 和命令
- `src/router.ts` - 定义可从 Webview 调用的 RPC 方法
- `src/getWebviewContent.ts` - 生成开发/生产模式的 HTML

### Webview（React）

- `src/webview/main.tsx` - React 入口，包含 Provider
- `src/webview/App.tsx` - 主应用组件
- `src/webview/wrpc.ts` - RPC 客户端配置

### 通信机制

Webview 通过 `@webview-rpc` 与扩展宿主通信：

```typescript
// Webview 端 (src/webview/wrpc.ts)
export const wrpc = withReactQuery<AppRouter>(createWrpcClient<AppRouter>());

// 在组件中使用
const { data } = wrpc.useQuery('getWorkspaceName');
const mutation = wrpc.useMutation('showAlert');
```

```typescript
// 扩展宿主端 (src/router.ts)
export const appRouter = router({
  getWorkspaceName: procedure.resolve(() => {
    return vscode.workspace.name || '未打开工作区';
  }),
  showAlert: procedure.input(z.string()).resolve(({ input }) => {
    vscode.window.showInformationMessage(input);
    return true;
  }),
});
```

## 配置说明

### shadcn/ui

组件配置在 `components.json` 中：

```json
{
  "style": "base-maia",
  "rsc": false,
  "tsx": true,
  "tailwind": {
    "css": "src/webview/index.css",
    "baseColor": "neutral",
    "cssVariables": true
  },
  "aliases": {
    "components": "@/webview/components",
    "ui": "@/webview/components/ui",
    "lib": "@/webview/lib",
    "utils": "@/webview/lib/utils"
  }
}
```

添加组件：

```bash
npx shadcn@latest add button
npx shadcn@latest add card
```

### Tailwind CSS

主题颜色在 `src/webview/index.css` 中使用 CSS 变量定义：

```css
:root {
  --primary: oklch(0.205 0 0);
  --primary-foreground: oklch(0.985 0 0);
  /* ... */
}

.dark {
  --primary: oklch(0.922 0 0);
  --primary-foreground: oklch(0.205 0 0);
  /* ... */
}
```

### 路径别名

在 `tsconfig.json` 和 `vite.config.ts` 中配置：

```json
{
  "paths": {
    "@/*": ["./src/*"]
  }
}
```

使用方式：

```typescript
import { Button } from '@/webview/components/ui/button';
import { cn } from '@/webview/lib/utils';
```

## 代码质量

### ESLint + Prettier

```bash
# 检查代码问题
npm run lint

# 格式化代码
npm run format
```

### Git 钩子

Husky 在提交前运行 `lint-staged`：

- `*.{ts,tsx}` → ESLint 修复 + Prettier 格式化
- `*.{json,css,md}` → Prettier 格式化

## 安全性

- 开发和生产环境均配置了内容安全策略（CSP）
- 生产环境使用 nonce 保护脚本
- 开发服务器连接仅限 localhost

## 技术栈

- [React 19](https://react.dev/)
- [Vite](https://vitejs.dev/)
- [Tailwind CSS v4](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Radix UI](https://www.radix-ui.com/)
- [TanStack Query](https://tanstack.com/query)
- [@webview-rpc](https://github.com/nicepkg/webview-rpc)
- [esbuild](https://esbuild.github.io/)

## 许可证

[MIT](LICENSE)
