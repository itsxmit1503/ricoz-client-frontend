# UI Change Log

## 2026-10-17 - Dashboard preview visual hierarchy

- **Files modified:** `src/app/dashboard-preview/page.tsx`
- **What changed:** Added a workspace-modules heading, an available-area count, module item counts, improved card hover states, consistent card sizing, and visible keyboard focus states for preview links.
- **Why:** Make the existing dashboard structure easier to scan and make interactive navigation clearer during UI inspection without changing destinations or application behavior.
- **Testing:** `npm run lint` passed; `npm run build` passed.
- **Issues needing attention:** API-backed pages still require the local backend and legitimate authentication to display real data. The preview remains isolated and mock-only.

## Change tracking notes

- The real authentication flow, API services, route destinations, and production behavior were not modified.
- New UI changes should be recorded here with the exact files, rationale, and validation results.

## 2026-10-18 - Dashboard layout and responsive polish

- **Files modified:** `src/components/dashboard/DashboardModuleGrid.tsx`, `src/app/(protected)/dashboard/page.tsx`, `src/app/dashboard-preview/page.tsx`, `src/components/layout/Sidebar.tsx`, `src/components/layout/AppShell.tsx`
- **What changed:** Shared the dashboard module-card layout between the authenticated dashboard and mock preview; added clearer workspace hierarchy, balanced card spacing and alignment, responsive `sm`/`2xl` grid behavior, stronger card and link interaction states, and visible keyboard focus treatment. Refined sidebar section separators, collapse affordances, active contrast, accessible state attributes, mobile controls, and shell padding.
- **Why:** Improve hierarchy, readability, sidebar/content balance, responsive behavior across laptop, tablet, and mobile widths, and keyboard interaction feedback while preserving Ricoz branding, destinations, authentication, API usage, and existing functionality.
- **Testing:** `npm.cmd run lint`, `npm.cmd run build`, and `git diff --check` passed. The direct `npm` command was blocked by the machine PowerShell execution policy, so validation used the equivalent Windows command shim.

## 2026-10-18 - Dashboard preview visual refinement

- **Files modified:** `src/app/globals.css`, `src/components/layout/AppShell.tsx`, `src/components/layout/Sidebar.tsx`, `src/components/dashboard/DashboardModuleGrid.tsx`, `src/app/dashboard-preview/page.tsx`
- **What changed:** Added scoped dark-theme scrollbars for the sidebar and main content with Firefox and Chromium support; softened card surfaces, borders, text contrast, blue accents, and interaction states; removed unnecessary card shadow/decoration; and moved the preview email into the welcome panel.
- **Why:** Replace the default white scrollbar and bring the preview toward a calmer, cohesive enterprise dashboard while preserving the Ricoz navy/slate identity, warning visibility, information architecture, links, and functionality.
- **Testing:** `npm.cmd run lint`, `npm.cmd run build`, and `git diff --check` passed. Browser verification passed at mobile/tablet-sized and desktop-sized preview widths; both the main content and sidebar reported the scoped dark scrollbar colors. The direct `npm` command remains blocked by the machine PowerShell execution policy, so validation used the equivalent Windows command shim.

## 2026-10-18 - Phase 1 batch 1: real dashboard shell refinement

- **Files modified:** `src/app/(protected)/dashboard/page.tsx`, `src/components/layout/AppShell.tsx`, `src/components/layout/Sidebar.tsx`
- **What changed:** Softened the authenticated dashboard welcome panel and logout action, aligned shell/sidebar focus states with the muted dark-theme scrollbar treatment, and preserved the existing responsive layout and navigation behavior.
- **Why:** Apply the approved dashboard-first UI pass to the real authenticated workspace without changing authentication, routes, APIs, data handling, or functionality.
- **Testing:** `npm.cmd run lint`, `npm.cmd run build`, and `git diff --check` passed. Browser verification confirmed the real `/dashboard` route renders the updated welcome/module UI without authentication data; the backend refresh request remains unavailable locally as expected.

## 2026-10-18 - Phase 1 batch 2: shared shell and form control refinement

- **Files modified:** `src/components/layout/AuthShell.tsx`, `src/components/ui/Button.tsx`, `src/components/ui/Input.tsx`, `src/components/ui/Select.tsx`, `src/components/ui/Textarea.tsx`
- **What changed:** Reduced the public auth shell’s blue gradient intensity, softened Ricoz logo/highlight accents, moderated primary button blue, and aligned input/select/textarea borders and focus states with the calmer slate hierarchy.
- **Why:** Improve shared visual consistency across authentication and data-entry pages without changing submission behavior, validation, API calls, or authentication flow.
- **Testing:** `npm.cmd run lint`, `npm.cmd run build`, and `git diff --check` passed. Browser verification confirmed the shared auth shell and form controls render at `/login`; backend refresh remains unavailable locally as expected.

## 2026-10-17 - Products page UI hierarchy and responsive polish

- **Files modified:** `src/components/ui/view.tsx`, `src/components/products/ProductForm.tsx`
- **What changed:** Grouped product filters in a labelled panel with a clear-filters action and result summary; improved header/action spacing; added loading, error, and mobile table guidance; improved table header and row hover treatment; added visible focus states and titles to existing actions; added visual grouping and responsive padding to the existing product form.
- **Why:** Improve scanability, responsive clarity, and keyboard interaction feedback while preserving all existing product routes, filters, search behavior, CRUD operations, validation, API calls, and data handling.
- **Testing:** `npm run lint` and `npm run build` passed; `git diff --check` passed.
- **Issues needing attention:** Product data and CRUD states still require the configured backend and authenticated session for live inspection.

## 2026-10-18 - Batch 1 accessibility and interaction fixes

- **Files modified:** `src/components/ui/focus.ts`, `src/components/layout/AppShell.tsx`, `src/components/ui/Modal.tsx`, `src/components/ui/ConfirmDialog.tsx`, `src/components/ui/Input.tsx`, `src/components/ui/Select.tsx`, `src/components/ui/Textarea.tsx`, `src/components/ui/StatusFilterCards.tsx`
- **What changed:** Added a small local focus/scroll-lock utility; added Escape handling, focus entry/trapping/restoration, and body-scroll cleanup for the mobile drawer and dialogs; connected dialog headings with `aria-labelledby`; associated field errors with `aria-describedby`; added explicit filter-button types and focus states; and applied the existing themed scrollbar to modal content.
- **Why:** Resolve the approved Batch 1 keyboard, focus, dialog semantics, form feedback, and scroll consistency findings without changing component props, callbacks, loading safeguards, routes, authentication, APIs, validation, or business logic.
- **Testing:** `npm.cmd run lint` passed; `npm.cmd run build` passed, including its TypeScript phase; `git diff --check` passed with only existing CRLF normalization warnings. A direct `tsc --noEmit` invocation was blocked by a stale generated `.next/types/validator.ts` import for `./routes.js`, while the build regenerated and validated those route types successfully. Browser verification passed for the login shell and the mobile dashboard drawer: focus enters the close control, Escape closes the drawer, focus returns to the menu trigger, and body scrolling is restored. Full authenticated data-backed modal and confirmation flows could not be exercised because the configured backend at `http://localhost:5000` is unavailable.
- **Follow-up fix:** During loading, when all confirmation controls are disabled, Tab and Shift+Tab now prevent focus from escaping and move focus to the dialog container. Escape, backdrop, cancel, and submission protections remain unchanged. Loading-state browser verification remains blocked because the configured backend is unavailable.
