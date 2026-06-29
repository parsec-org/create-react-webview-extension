# Parsec React Webview

A modern VSCode extension template for building React-powered webviews with Vite, Tailwind CSS, and shadcn/ui.

English | [中文](./README_zh_CN.md)

## Features

- 🚀 **Fast Development** - Vite with Hot Module Replacement (HMR)
- ⚛️ **React 19** - Build modern UIs with the latest React
- 🎨 **shadcn/ui** - Beautiful, accessible components built on Radix UI
- 🎯 **Tailwind CSS v4** - Utility-first CSS framework
- 🔄 **RPC Communication** - Type-safe communication between webview and extension host
- 📦 **TypeScript** - Full type safety across the entire codebase
- 🔒 **Secure CSP** - Content Security Policy for both dev and production
- 🛠️ **ESLint + Prettier** - Code quality and formatting
- 🐶 **Husky + lint-staged** - Git hooks for automated checks

## Project Structure

```
├── src/
│   ├── extension.ts              # Extension entry point
│   ├── getWebviewContent.ts      # Webview HTML generation (dev/prod)
│   ├── router.ts                 # RPC router definitions
│   └── webview/                  # React webview source
│       ├── main.tsx              # React entry point
│       ├── App.tsx               # Main React component
│       ├── index.css             # Global styles & Tailwind config
│       ├── components/           # React components
│       │   └── ui/               # shadcn/ui components
│       ├── context/              # React contexts
│       ├── lib/                  # Utility functions
│       └── assets/               # Static assets
├── assets/                       # Extension assets (icons)
├── dist/                         # Build output
│   ├── extension.js              # Bundled extension
│   └── webview/                  # Built webview
├── esbuild.config.mjs            # Extension bundler config
├── vite.config.ts                # Webview bundler config
├── tsconfig.json                 # Extension TypeScript config
├── tsconfig.webview.json         # Webview TypeScript config
├── components.json               # shadcn/ui configuration
└── package.json                  # Project manifest
```

## Getting Started

### Prerequisites

- Node.js v18+
- Visual Studio Code
- Git

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd parsec-react-webview

# Install dependencies
npm install

# Initialize Husky (git hooks)
npx husky init
```

### Development

1. **Start the Vite dev server**:

   ```bash
   npm run dev:webview
   ```

2. **Launch the extension in VSCode**:
   - Press `F5` to open Extension Development Host
   - Click the 💬 icon in the activity bar

3. **Start coding**:
   - Edit files in `src/webview/`
   - Changes will hot-reload automatically

### Build

```bash
# Build webview
npm run build:webview

# Build extension
npm run build

# Build both (for packaging)
npm run vscode:prepublish
```

### Package

```bash
# Package as .vsix
npm run package

# Install in VSCode
code --install-extension parsec-react-webview-*.vsix
```

## Available Scripts

| Script                  | Description                    |
| ----------------------- | ------------------------------ |
| `npm run dev:webview`   | Start Vite dev server with HMR |
| `npm run build:webview` | Build webview for production   |
| `npm run build`         | Build extension with esbuild   |
| `npm run compile`       | TypeScript type checking       |
| `npm run lint`          | Run ESLint                     |
| `npm run format`        | Format code with Prettier      |
| `npm run format:check`  | Check code formatting          |
| `npm run package`       | Package as .vsix file          |
| `npm run watch`         | Watch mode for extension       |

## Architecture

### Extension Host (Node.js)

- `src/extension.ts` - Registers the webview provider and commands
- `src/router.ts` - Defines RPC procedures callable from the webview
- `src/getWebviewContent.ts` - Generates HTML for dev/prod modes

### Webview (React)

- `src/webview/main.tsx` - React entry point with providers
- `src/webview/App.tsx` - Main application component
- `src/webview/wrpc.ts` - RPC client configuration

### Communication

The webview communicates with the extension host via `@webview-rpc`:

```typescript
// Webview (src/webview/wrpc.ts)
export const wrpc = withReactQuery<AppRouter>(createWrpcClient<AppRouter>());

// Usage in components
const { data } = wrpc.useQuery('getWorkspaceName');
const mutation = wrpc.useMutation('showAlert');
```

```typescript
// Extension Host (src/router.ts)
export const appRouter = router({
  getWorkspaceName: procedure.resolve(() => {
    return vscode.workspace.name || 'No workspace open';
  }),
  showAlert: procedure.input(z.string()).resolve(({ input }) => {
    vscode.window.showInformationMessage(input);
    return true;
  }),
});
```

## Configuration

### shadcn/ui

Components are configured in `components.json`:

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

Add components:

```bash
npx shadcn@latest add button
npx shadcn@latest add card
```

### Tailwind CSS

Theme colors are defined in `src/webview/index.css` using CSS variables:

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

### Path Aliases

Configured in `tsconfig.json` and `vite.config.ts`:

```json
{
  "paths": {
    "@/*": ["./src/*"]
  }
}
```

Usage:

```typescript
import { Button } from '@/webview/components/ui/button';
import { cn } from '@/webview/lib/utils';
```

## Code Quality

### ESLint + Prettier

```bash
# Check for issues
npm run lint

# Format code
npm run format
```

### Git Hooks

Husky runs `lint-staged` on pre-commit:

- `*.{ts,tsx}` → ESLint fix + Prettier format
- `*.{json,css,md}` → Prettier format

## Security

- Content Security Policy (CSP) configured for both dev and production
- Scripts are nonce-protected in production
- Dev server connections are restricted to localhost

## Technologies

- [React 19](https://react.dev/)
- [Vite](https://vitejs.dev/)
- [Tailwind CSS v4](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Radix UI](https://www.radix-ui.com/)
- [TanStack Query](https://tanstack.com/query)
- [@webview-rpc](https://github.com/nicepkg/webview-rpc)
- [esbuild](https://esbuild.github.io/)

## License

[MIT](LICENSE)
