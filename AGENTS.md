# Utils Development Guide for AI Agents

<!-- BEGIN:nextjs-agent-rules -->

## Next.js: ALWAYS read docs before coding

Before any Next.js work, find and read the relevant documentation. Your training data is outdated — the docs are the source of truth.

This project uses **Next.js 16.2.9** (App Router). Version-matched docs ship bundled in `node_modules/next/dist/docs/` — read from there before any Next.js task. Do **not** download or use `.next-docs/`; it is not needed on Next.js 16.2+.

<!-- END:nextjs-agent-rules -->

You are a senior engineer working on rcrdk/utils, a personal utilities collection with a Next.js 16 app shell. Prioritize type safety, small reviewable diffs, and existing project conventions.

## Do

- Use `import type { X }` for TypeScript type-only imports
- Use early returns to reduce nesting
- Keep functions focused on a single responsibility; extract helpers when needed
- Use an object parameter when a function has three or more arguments
- Prefer functional style: `const`, immutability, `map`/`filter`/`reduce`, and pure functions
- Omit curly braces for single-statement blocks; use arrow implicit return for single-expression functions (not components)
- Export utilities in `src/utils/` as `const` arrow functions — not in `src/app/`
- Assign function results and complex conditions to `const` before returning or branching
- Use `.at()` instead of bracket notation for array access
- Use optional chaining when accessing nested properties that may be undefined
- Use `@/` absolute imports when the relative path goes up more than one folder level
- Use named exports (no default exports for components)
- Use `interface` for React component props wrapped in `Readonly`
- Pin exact dependency versions (`pnpm add -E <package>`)
- Run `pnpm typecheck` before concluding CI failures are unrelated to your changes

## Don't

- Never use `any` — use proper types, `unknown`, or generics
- Never use wildcard imports (`import * from`)
- Never use barrel wildcard exports (`export * from`)
- Never commit secrets or `.env` files
- Never skip hooks (`--no-verify`) unless explicitly requested
- Never use default exports for React components

## Commands

See [agents/commands.md](agents/commands.md) for the full reference. Key commands:

```bash
pnpm typecheck   # Type check
pnpm lint:fix    # Lint and fix
pnpm dev         # Dev server
```

## Boundaries

### Always do

- Run typecheck on changed files before committing
- Follow commit format: `type(scope): subject` (see [agents/rules/commit-messages.mdc](agents/rules/commit-messages.mdc))
- Match existing naming and file structure conventions

### Ask first

- Adding new dependencies
- Deleting files
- Large refactors spanning many modules

### Never do

- Commit secrets or API keys
- Force push to shared branches
- Modify unrelated code in the same PR

## Project Structure

Reusable code lives under `src/` in domain folders. Keep `src/app/` for routing, pages, and route-local UI only.

```
src/
├── app/                # Next.js App Router (pages, layout, route UI only)
├── utils/              # Pure utility functions (groupBy, generateSlug, etc.)
├── hooks/              # React hooks and patterns
├── types/              # Shared TypeScript types
├── components/         # Shared React components
├── lib/                # Third-party wrappers and integrations
├── config/             # App configuration
├── constants/          # Shared constants
├── schemas/            # Validation schemas
├── contexts/           # React contexts
├── reducers/           # State reducers
├── http/               # HTTP clients and API helpers
└── styles/             # Global styles and design tokens
    └── globals.css
```

### Key conventions

- **Utils**: `src/utils/` as `const` arrow functions with kebab-case file names
- **Hooks**: `src/hooks/` with kebab-case file names
- **Styles**: `src/styles/` for global CSS and design tokens — import from `@/styles/...` in layouts
- **App folder**: pages, layout, and route-local UI only
- **File names**: kebab-case
- **Named values**: assign function results and complex conditions to `const` before returning or branching (see [constants-and-variables](agents/rules/constants-and-variables.mdc))

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript (strict)
- **Styling**: Tailwind CSS v4
- **Package manager**: pnpm

## Code Examples

### Good type import

```typescript
import { useState } from 'react'

import type { Optional } from '@/types/optional'
```

### Good utility

```typescript
export const groupBy = <T, K extends string | number | symbol>(
  array: T[],
  key: keyof T & K,
): Record<K, T[]> => {
  const groups = array.reduce<Record<K, T[]>>((acc, item) => {
    const groupKey = item[key] as K
    const existingGroup = acc[groupKey] ?? []

    return { ...acc, [groupKey]: [...existingGroup, item] }
  }, {} as Record<K, T[]>)

  return groups
}
```

### Good component

```typescript
interface ButtonProps {
  label: string
  onPress: VoidFunction
}

export function Button({ label, onPress }: Readonly<ButtonProps>) {
  return <button type="button" onClick={onPress}>{label}</button>
}
```

## PR Checklist

- [ ] Commit includes scoped subject (when applicable) and valid type
- [ ] Typecheck passes: `pnpm typecheck`
- [ ] Lint passes: `pnpm lint`
- [ ] Diff is small and focused
- [ ] No secrets committed

## When Stuck

- Ask a clarifying question before large speculative changes
- Propose a short plan for complex tasks
- Fix type errors before test failures
- Read surrounding code and match existing patterns

## Extended Documentation

Agent rules and settings are centralized in `agents/`. Symlinks in `.cursor/` and `.claude/` are generated locally and not committed to git.

After cloning, run `pnpm dev` or `pnpm setup:agent-links` locally. Agent symlinks are recreated automatically on `pnpm dev` (skipped when `CI` is set).

```
agents/
├── rules/          # Source of truth for coding rules (.mdc)
├── skills/         # Shared agent skills
├── README.md       # Rules index
└── commands.md     # Command reference

.cursor/            # generated symlinks
├── rules -> ../agents/rules
└── skills -> ../agents/skills

.claude/            # generated symlinks
├── rules -> ../agents/rules
└── skills -> ../agents/skills
```

- **[agents/README.md](agents/README.md)** - Rules index
- **[agents/rules/](agents/rules/)** - Modular engineering rules
- **[agents/commands.md](agents/commands.md)** - Complete command reference
- **[README-DX.md](README-DX.md)** - Husky, ESLint, Prettier, and editor setup
- **[README-AGENTS.md](README-AGENTS.md)** - AI agent setup and symlink guide

<!-- NEXT-AGENTS-MD-START -->[Next.js Docs Index]|root: ./node_modules/next/dist/docs|STOP. What you remember about Next.js is WRONG for this project. Always search docs and read before any task.|If docs missing, run `pnpm install` to restore bundled docs in node_modules/next/dist/docs|01-app:{04-glossary.md}|01-app/01-getting-started:{01-installation.md,02-project-structure.md,03-layouts-and-pages.md,04-linking-and-navigating.md,05-server-and-client-components.md,06-fetching-data.md,07-mutating-data.md,08-caching.md,09-revalidating.md,10-error-handling.md,11-css.md,12-images.md,13-fonts.md,14-metadata-and-og-images.md,15-route-handlers.md,16-proxy.md,17-deploying.md,18-upgrading.md}|01-app/02-guides:{ai-agents.md,analytics.md,authentication.md,backend-for-frontend.md,caching-without-cache-components.md,cdn-caching.md,ci-build-caching.md,content-security-policy.md,css-in-js.md,custom-server.md,data-security.md,debugging.md,deploying-to-platforms.md,draft-mode.md,environment-variables.md,forms.md,how-revalidation-works.md,incremental-static-regeneration.md,instant-navigation.md,instrumentation.md,internationalization.md,json-ld.md,lazy-loading.md,local-development.md,mcp.md,mdx.md,memory-usage.md,migrating-to-cache-components.md,multi-tenant.md,multi-zones.md,open-telemetry.md,package-bundling.md,ppr-platform-guide.md,prefetching.md,preserving-ui-state.md,preventing-flash-before-hydration.md,production-checklist.md,progressive-web-apps.md,public-static-pages.md,redirecting.md,rendering-philosophy.md,sass.md,scripts.md,self-hosting.md,single-page-applications.md,static-exports.md,streaming.md,tailwind-v3-css.md,third-party-libraries.md,videos.md,view-transitions.md}|01-app/02-guides/migrating:{app-router-migration.md,from-create-react-app.md,from-vite.md}|01-app/02-guides/testing:{cypress.md,jest.md,playwright.md,vitest.md}|01-app/02-guides/upgrading:{codemods.md,version-14.md,version-15.md,version-16.md}|01-app/03-api-reference:{07-edge.md,08-turbopack.md}|01-app/03-api-reference/01-directives:{use-cache-private.md,use-cache-remote.md,use-cache.md,use-client.md,use-server.md}|01-app/03-api-reference/02-components:{font.md,form.md,image.md,link.md,script.md}|01-app/03-api-reference/03-file-conventions/01-metadata:{app-icons.md,manifest.md,opengraph-image.md,robots.md,sitemap.md}|01-app/03-api-reference/03-file-conventions/02-route-segment-config:{dynamicParams.md,instant.md,maxDuration.md,preferredRegion.md,runtime.md}|01-app/03-api-reference/03-file-conventions:{default.md,dynamic-routes.md,error.md,forbidden.md,instrumentation-client.md,instrumentation.md,intercepting-routes.md,layout.md,loading.md,mdx-components.md,not-found.md,page.md,parallel-routes.md,proxy.md,public-folder.md,route-groups.md,route.md,src-folder.md,template.md,unauthorized.md}|01-app/03-api-reference/04-functions:{after.md,cacheLife.md,cacheTag.md,catchError.md,connection.md,cookies.md,draft-mode.md,fetch.md,forbidden.md,generate-image-metadata.md,generate-metadata.md,generate-sitemaps.md,generate-static-params.md,generate-viewport.md,headers.md,image-response.md,next-request.md,next-response.md,not-found.md,permanentRedirect.md,redirect.md,refresh.md,revalidatePath.md,revalidateTag.md,unauthorized.md,unstable_cache.md,unstable_noStore.md,unstable_rethrow.md,updateTag.md,use-link-status.md,use-params.md,use-pathname.md,use-report-web-vitals.md,use-router.md,use-search-params.md,use-selected-layout-segment.md,use-selected-layout-segments.md,userAgent.md}|01-app/03-api-reference/05-config/01-next-config-js:{adapterPath.md,allowedDevOrigins.md,appDir.md,assetPrefix.md,authInterrupts.md,basePath.md,cacheComponents.md,cacheHandlers.md,cacheLife.md,compress.md,crossOrigin.md,cssChunking.md,deploymentId.md,devIndicators.md,distDir.md,env.md,expireTime.md,exportPathMap.md,generateBuildId.md,generateEtags.md,headers.md,htmlLimitedBots.md,httpAgentOptions.md,images.md,incrementalCacheHandlerPath.md,inlineCss.md,logging.md,mdxRs.md,onDemandEntries.md,optimizePackageImports.md,output.md,pageExtensions.md,poweredByHeader.md,productionBrowserSourceMaps.md,proxyClientMaxBodySize.md,reactCompiler.md,reactMaxHeadersLength.md,reactStrictMode.md,redirects.md,rewrites.md,sassOptions.md,serverActions.md,serverComponentsHmrCache.md,serverExternalPackages.md,staleTimes.md,staticGeneration.md,taint.md,trailingSlash.md,transpilePackages.md,turbopack.md,turbopackFileSystemCache.md,turbopackIgnoreIssue.md,turbopackLocalPostcssConfig.md,typedRoutes.md,typescript.md,urlImports.md,useLightningcss.md,viewTransition.md,webVitalsAttribution.md,webpack.md}|01-app/03-api-reference/05-config:{02-typescript.md,03-eslint.md}|01-app/03-api-reference/06-cli:{create-next-app.md,next.md}|01-app/03-api-reference/07-adapters:{01-configuration.md,02-creating-an-adapter.md,03-api-reference.md,04-testing-adapters.md,05-routing-with-next-routing.md,06-implementing-ppr-in-an-adapter.md,07-runtime-integration.md,08-invoking-entrypoints.md,09-output-types.md,10-routing-information.md,11-use-cases.md}|02-pages/01-getting-started:{01-installation.md,02-project-structure.md,04-images.md,05-fonts.md,06-css.md,11-deploying.md}|02-pages/02-guides:{analytics.md,authentication.md,babel.md,ci-build-caching.md,content-security-policy.md,css-in-js.md,custom-server.md,debugging.md,draft-mode.md,environment-variables.md,forms.md,incremental-static-regeneration.md,instrumentation.md,internationalization.md,lazy-loading.md,mdx.md,multi-zones.md,open-telemetry.md,package-bundling.md,post-css.md,preview-mode.md,production-checklist.md,redirecting.md,sass.md,scripts.md,self-hosting.md,static-exports.md,tailwind-v3-css.md,third-party-libraries.md}|02-pages/02-guides/migrating:{app-router-migration.md,from-create-react-app.md,from-vite.md}|02-pages/02-guides/testing:{cypress.md,jest.md,playwright.md,vitest.md}|02-pages/02-guides/upgrading:{codemods.md,version-10.md,version-11.md,version-12.md,version-13.md,version-14.md,version-9.md}|02-pages/03-building-your-application/01-routing:{01-pages-and-layouts.md,02-dynamic-routes.md,03-linking-and-navigating.md,05-custom-app.md,06-custom-document.md,07-api-routes.md,08-custom-error.md}|02-pages/03-building-your-application/02-rendering:{01-server-side-rendering.md,02-static-site-generation.md,04-automatic-static-optimization.md,05-client-side-rendering.md}|02-pages/03-building-your-application/03-data-fetching:{01-get-static-props.md,02-get-static-paths.md,03-get-server-side-props.md,05-client-side.md}|02-pages/03-building-your-application/06-configuring:{12-error-handling.md}|02-pages/04-api-reference:{06-edge.md,08-turbopack.md}|02-pages/04-api-reference/01-components:{font.md,form.md,head.md,image-legacy.md,image.md,link.md,script.md}|02-pages/04-api-reference/02-file-conventions:{instrumentation.md,proxy.md,public-folder.md,src-folder.md}|02-pages/04-api-reference/03-functions:{get-initial-props.md,get-server-side-props.md,get-static-paths.md,get-static-props.md,next-request.md,next-response.md,use-params.md,use-report-web-vitals.md,use-router.md,use-search-params.md,userAgent.md}|02-pages/04-api-reference/04-config/01-next-config-js:{adapterPath.md,allowedDevOrigins.md,assetPrefix.md,basePath.md,bundlePagesRouterDependencies.md,compress.md,crossOrigin.md,deploymentId.md,devIndicators.md,distDir.md,env.md,exportPathMap.md,generateBuildId.md,generateEtags.md,headers.md,httpAgentOptions.md,images.md,logging.md,onDemandEntries.md,optimizePackageImports.md,output.md,pageExtensions.md,poweredByHeader.md,productionBrowserSourceMaps.md,proxyClientMaxBodySize.md,reactStrictMode.md,redirects.md,rewrites.md,serverExternalPackages.md,trailingSlash.md,transpilePackages.md,turbopack.md,typescript.md,urlImports.md,useLightningcss.md,webVitalsAttribution.md,webpack.md}|02-pages/04-api-reference/04-config:{01-typescript.md,02-eslint.md}|02-pages/04-api-reference/05-cli:{create-next-app.md,next.md}|02-pages/04-api-reference/06-adapters:{01-configuration.md,02-creating-an-adapter.md,03-api-reference.md,04-testing-adapters.md,05-routing-with-next-routing.md,06-implementing-ppr-in-an-adapter.md,07-runtime-integration.md,08-invoking-entrypoints.md,09-output-types.md,10-routing-information.md,11-use-cases.md}|03-architecture:{accessibility.md,fast-refresh.md,nextjs-compiler.md,supported-browsers.md}|04-community:{01-contribution-guide.md,02-rspack.md}<!-- NEXT-AGENTS-MD-END -->
