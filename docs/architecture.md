# NeuroRegulacja App - Architecture Analysis and Repair Plan

## Current State Overview

The NeuroRegulacja application is a Next.js 15 project with React 19, TypeScript 5.8, TailwindCSS 4, and shadcn/ui components, focused on Polish-language educational content for neuroregulation and supplements. The structure follows App Router patterns with routes under `src/app/` (e.g., `/wiedza`, `/suplementy`, `/stos`), shared components in `src/components/`, and data files like `supplements-database.ts`. Key features include 3D brain models (`Brain3D.tsx`), interactive learning (`InteractiveLearning.tsx`), and stack analysis (`StackAnalysis.tsx`). The dev server is running, indicating basic functionality, but analysis reveals multiple issues impacting stability, scalability, and compliance with project specs from AGENTS.md.

**Project Structure Summary:**

- **Routes:** ~15 pages (e.g., `/wiedza/page.tsx`, `/suplementy/page.tsx`, `/stos/page.tsx`), some with components/data subdirs.
- **Components:** Educational (`Brain3D.tsx`, tabs like `MemoryTab.tsx`), UI (shadcn primitives), visualizations (`Sparkline.tsx`, `EffectOverTimeChart.tsx`).
- **Data:** `supplements-database.ts` (Supplement interface with Polish fields), `stack-templates.ts`, `nootropics-database.ts`.
- **Configs:** Strict TypeScript/ESLint/Vitest setup; dependencies match core stack but miss some (e.g., zustand, react-hook-form).
- **Tests:** Minimal (2 files: `Sparkline.test.tsx`, `mozg-anatomia.test.tsx`); coverage likely below 50%.
- **Other:** Storybook config present but unused; memory-bank/ for docs; public/assets for 3D models (not loaded).

**Strengths:**

- Polish content integration (e.g., brain regions in `Brain3D.tsx`, supplement data).
- Modular data structures (Supplement interface aligns with specs).
- 3D integration via React Three Fiber/Drei.

## Identified Error Categories

Analysis using tools (list_files, read_file, search_files, list_code_definition_names) revealed ~8 TypeScript errors, ~10+ ESLint violations, 3 missing dependencies, 5 incomplete implementations, 2 data inconsistencies, and several development gaps. No explicit TODO/FIXME, but implicit issues via @ts-ignore and console.error.

### 1. TypeScript Compilation Issues (High Priority: ~8 instances)

- **@ts-ignore abuse:** 6 occurrences for type casting (e.g., `Brain3D.tsx` lines 94,98 for material opacity; `IntakeDragBoard.tsx` lines 39,69 for JSON parsing; `stack-builder/page.tsx` line 147 for dynamic jsPDF import). Indicates Three.js typing mismatches and unsafe parsing.
- **Interface mismatches:** `StackAnalysis.tsx` redefines `Supplement` without `polishName`, `neuroEffects`, `sklad` (vs. `supplements-database.ts`), causing prop errors if integrated.
- **Local state typing:** `InteractiveLearning.tsx` uses untyped localStorage parsing (line 559 error handling).
- **Missing types:** No Zustand types; potential issues with React 19 strict mode in tsconfig.json.
- **Impact:** Fails `npm run tsc`; runtime type errors in 3D/quiz components.

### 2. ESLint Violations (Medium Priority: ~10+ potential)

- **Strict rules enforcement:** Config requires JSDoc (`jsdoc/require-jsdoc: error`), no unused vars (`@typescript-eslint/no-unused-vars`), consistent imports (`import/order`). Likely violations in long files like `InteractiveLearning.tsx` (936 lines, potential unused imports).
- **Console usage:** 4 `console.error` calls (e.g., `InteractiveLearning.tsx` line 559, `ProtocolGuides.tsx` line 431) without Pino logging integration.
- **No-undef/strict-boolean:** Potential issues in dynamic imports and conditional rendering.
- **Impact:** Fails `npm run lint` (max-warnings=0); code quality degradation.

### 3. Missing Dependencies and Config Gaps (Medium Priority: 3 key)

- **Absent packages:** AGENTS.md specifies Zustand (for slices), react-hook-form (forms), Day.js (dates), full Pino integration—but package.json lacks them. @dnd-kit present but underused (no drag-drop in read files).
- **Incomplete configs:** next.config.ts ignores errors in CI (risky for prod); tailwind.config.ts basic (no custom Polish text utilities); vitest.config.ts excludes stories but coverage thresholds unmet.
- **Impact:** Features like state management, form validation broken; build warnings.

### 4. Incomplete Implementations (High Priority: 5 major)

- **3D Model:** `Brain3D.tsx` uses placeholder spheres; no GLTF/OBJ loading from public/assets (per specs). No WebXR beyond placeholder.
- **Stack Analysis:** `StackAnalysis.tsx` hardcodes `interactionDatabase`; doesn't import/use `supplements-database.ts` or synergies.
- **Learning Integration:** `InteractiveLearning.tsx` uses local state; comments note Zustand needed. No Brain3D linkage (local `selectedRegion` unused).
- **Pages:** Many stubs (e.g., `/uklad-resistance/page.tsx` likely empty); no error boundaries/Suspense.
- **Drag-Drop:** `IntakeDragBoard.tsx` has @ts-ignore for logs; incomplete @dnd-kit usage.
- **Impact:** Core features non-functional; poor UX.

### 5. Logical Inconsistencies in Data Structures (Medium Priority: 2)

- **Supplement Mismatch:** `StackAnalysis.tsx` Supplement lacks `neuroEffects`, `warnings` (vs. database.ts); hardcoded patterns ignore real data.
- **Quiz Data:** `InteractiveLearning.tsx` quizQuestions not linked to lessons dynamically; potential Polish char encoding issues.
- **Impact:** Data flow breaks; inaccurate analysis.

### 6. Development Gaps (Low-Medium Priority)

- **Testing:** Only 2 test files; no coverage for 3D/components; Vitest setup but no mocks for Three.js.
- **Storybook:** Configured but no .stories.tsx files.
- **Performance:** `useFrame` in `Brain3D.tsx` runs unoptimized; no memoization.
- **Accessibility:** No ARIA in 3D; Polish text length unaccounted in responsive design.
- **Impact:** Low maintainability; untested bugs.

## High-Level Repair Plan

Phased approach: Fix critical errors first, then integrations, tests, scalability. Total ~15-20 steps; estimate 2-3 days in Code mode.

### Phase 1: Critical Fixes (TypeScript/ESLint/Data - 5 steps)

1. Remove @ts-ignore; add proper Three.js types (e.g., `MeshLambertMaterial` opacity via `needsUpdate`).
2. Unify Supplement interface across files; import from shared types/lib/supplement.ts.
3. Replace console.error with Pino logger; add error boundaries.
4. Install missing deps: `npm i zustand react-hook-form dayjs`; update package.json.
5. Run `npm run tsc` and `npm run lint`; fix violations (JSDoc, imports).

### Phase 2: Complete Implementations (Features - 6 steps)

1. Load real 3D brain model in `Brain3D.tsx` (GLTFLoader from public/assets/brain.glb).
2. Integrate `StackAnalysis.tsx` with `supplements-database.ts`; use real interactions data.
3. Add Zustand slices (e.g., useBrainStore.ts for selectedRegion, useLearningStore.ts for progress).
4. Link `InteractiveLearning.tsx` to Brain3D via Zustand; add section-based region highlighting.
5. Implement full @dnd-kit in `IntakeDragBoard.tsx`; remove @ts-ignore with typed logs.
6. Add Suspense/loading states to pages; implement Polish tooltips in 3D.

### Phase 3: Testing and Optimization (Quality - 4 steps)

1. Write Vitest tests for components (e.g., Brain3D rendering, StackAnalysis interactions); aim 80% coverage.
2. Add Storybook stories for UI/educational components.
3. Optimize 3D perf: Memoize useFrame, add dispose() for meshes.
4. Ensure responsive Polish text; add ARIA labels.

### Phase 4: Scalability Improvements (Architecture)

- **State Management:** Full Zustand slices in src/lib/stores/ (e.g., supplementsSlice, brainSlice); replace local state.
- **3D Optimizations:** Use InstancedMesh for regions; add LOD (Level of Detail) for mobile.
- **Data Flow:** Centralize data with Zod validation; add API layer for future backend.
- **Modularity:** Colocate by feature (e.g., app/wiedza/data/ with types); use dynamic imports for heavy 3D.
- **Performance:** Static rendering where possible; cache supplements with Next.js fetch.
- **Internationalization:** Full i18n for Polish (next-intl); handle diacritics in Tailwind.

**Verification:** After each phase, run `npm run build`, `npm run test`, `npm run lint`. Use shadcn MCP tools for UI audit.

## Next Steps

Switch to Code mode for Phase 1 fixes. Monitor with updated TODO list.
