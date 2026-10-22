# UI Change Log

## 2026-10-23 - Batch 6 Maintenance, BOM and System Information refinement

- **Files modified:** `src/app/(protected)/maintenance/work-orders/page.tsx`, `src/app/(protected)/bom/page.tsx`, `src/app/(protected)/info/page.tsx`
- **What changed:**
  - **Maintenance Work Orders (`maintenance/work-orders/page.tsx`):** Replaced raw 9-line text stub with a polished, honest placeholder console featuring the category eyebrow ("Asset Maintenance & Reliability"), centered Wrench icon, "Console Under Construction" status notice, and clear copy clarifying that preventative maintenance schedules and work order dispatch are planned for future versions. Added genuine cross-navigation jump cards to Machine Directory (`/machines`), Machine Details (`/machines/details`), and Production Work Orders (`/production/work-orders`).
  - **Bill of Materials (`bom/page.tsx`):** Replaced raw 9-line text stub with an honest placeholder console featuring the category eyebrow ("Engineering & Product Structure"), centered Network icon, "Console Under Construction" status notice, and copy clarifying that multi-level component trees and explosion matrices are planned for future versions. Added cross-navigation jump cards to Product Catalog (`/products`), Inventory Stock (`/inventory/stock`), and Purchase Orders (`/purchase/orders`).
  - **System Information (`info/page.tsx`):** Elevated the existing application overview and technical documentation to the Operations Console visual standard. Added category eyebrow ("System Overview & Documentation"), section entrance motion, layered card surfaces (`ui-surface`), enhanced technology stack badges verifying dependencies from package.json (Next.js, React, TypeScript, Tailwind CSS, Lucide Icons, Axios, React Hot Toast), and accessible focus rings while preserving 100% of existing informational content.
- **Why:** Eliminate remaining raw un-themed stub screens across the application and align all protected routes with the cohesive Ricoz Operations Console design language, without inventing fake records, mock data, or broken API integrations.
- **Testing:** `npm.cmd run lint` passed with 0 errors; `npx.cmd tsc --noEmit` passed with 0 errors; `npm.cmd run build` passed successfully across all 28 routes; `git diff --check` passed.
- **Limitations:** The local backend at http://localhost:5000 remains offline, so live API queries could not be exercised. Automated headless browser suites (Playwright/Puppeteer/Cypress) are not installed in the workspace, so automated multi-viewport browser testing at 390px, 768px, and 1440px was not performed; responsive layouts, focus visibility, and reduced-motion compliance were verified via static analysis, code inspection, and Next.js production build checks.

## 2026-10-22 - Batch 5 Production and Quality console refinement

- **Files modified:** `src/app/(protected)/production/plans/page.tsx`, `src/components/production/ProductionPlanForm.tsx`, `src/app/(protected)/production/work-orders/page.tsx`, `src/components/production/WorkOrderForm.tsx`, `src/app/(protected)/production/operations/page.tsx`, `src/app/(protected)/quality/issues/page.tsx`, `src/components/quality/QualityIssueForm.tsx`, `src/app/(protected)/quality/details/page.tsx`
- **What changed:**
  - **Production Plans (`production/plans/page.tsx`):** Added category eyebrow ("Production Scheduling"), unified `ui-surface` search and priority filter bar with quick clear action, enhanced table hierarchy with `ui-table-row` hover rail, styled overdue date tags, and added focus-visible treatment for actions.
  - **Production Plan Form (`ProductionPlanForm.tsx`):** Structured form fields into logical enterprise fieldsets ("Plan overview" and "Timeline & status") with descriptive guidance, improved spacing, and clear action button hierarchy.
  - **Work Orders (`production/work-orders/page.tsx`):** Added category eyebrow ("Shop Floor Operations"), dedicated filter surface, enhanced progress bar display with percentage tag and scrap count, elevated one-click advance status step button with subtle blue tinting and spinner state, and improved table row interaction feedback.
  - **Work Order Form (`WorkOrderForm.tsx`):** Reorganized flat inputs into three cohesive cards ("Order identification", "Batch quantities & scrap", "Timeline & status"), improving comprehension and data entry flow.
  - **Operation Execution (`production/operations/page.tsx`):** Transformed unstyled 9-line stub into a polished, Ricoz-themed informational placeholder console indicating future shop-floor routing and workstation execution capabilities, providing direct navigation back to active Work Orders and Production Plans without creating fake data or broken APIs.
  - **Quality Issues (`quality/issues/page.tsx`):** Added category eyebrow ("Quality Assurance & Compliance"), unified 3-way filter panel (search, severity, type) in `ui-surface` with clear action, elevated inspected/passed/failed ratio readability with colored micro-tags, and applied consistent `ui-table-row` hover styling.
  - **Quality Issue Form (`QualityIssueForm.tsx`):** Sectioned inputs into three distinct cards ("Issue identification & context", "Sample & inspection counts", "Defect analysis & resolution") with grouped textareas for defect description and corrective response.
  - **Quality Details & Picker (`quality/details/page.tsx`):** Refined Issue Picker with searchable item cards, rich metadata chips, and hover feedback; enhanced Issue Details with clear status-transition button group, elevated inspection KPI metric cards (Inspected, Passed, Failed) with color-coded pass-rate progress gauge, and structured defect and corrective response callouts.
- **Why:** Elevate the Production and Quality workflows to the cohesive enterprise standard established across Products, Machines, Suppliers, and Purchasing in Batches 3 and 4, while preserving 100% of existing route paths, state handlers, filter logic, calculations, status transitions, modal submissions, validation rules, and backend integration contracts.
- **Testing:** `npm.cmd run lint` passed with 0 errors; `npx.cmd tsc --noEmit` passed with 0 errors; `npm.cmd run build` passed successfully across all 28 routes; `git diff --check` passed.
- **Limitations:** The local backend at http://localhost:5000 was offline, so live API queries, server responses, and database mutations could not be exercised. Automated browser test suites (Playwright/Puppeteer/Cypress) are not configured in the repository, so automated multi-viewport browser testing at 390px, 768px, and 1440px was not executed; responsive layouts, focus visibility, and reduced-motion compliance were verified via static analysis, code inspection, and Next.js production build checks.

## 2026-10-22 - Batch 4 Inventory, Suppliers and Purchasing console refinement

- **Files modified:** `src/components/ui/StatusFilterCards.tsx`, `src/app/globals.css`, `src/app/(protected)/suppliers/page.tsx`, `src/app/(protected)/inventory/stock/page.tsx`, `src/app/(protected)/purchase/orders/page.tsx`, `src/components/suppliers/SupplierForm.tsx`, `src/components/inventory/InventoryForm.tsx`, `src/components/purchase/PurchaseOrderForm.tsx`
- **What changed:** Refined Suppliers, Stock, and Purchase Orders into a shared Operations Console presentation with clearer page context, separated search surfaces, stronger table hierarchy, better primary/secondary action contrast, more deliberate status-card states, clearer purchase-order detail rows, and improved supplier, inventory, and purchase-order form sectioning. Added restrained surface separation, row interaction feedback, page/section entrance motion, and reduced-motion-safe shared utilities while preserving the existing Ricoz navy/slate and blue brand language.
- **Why:** Improve operational readability, responsive hierarchy, status recognition, form comprehension, and interaction quality without changing routes, API calls, authentication, validation rules, status transitions, CRUD behavior, or backend integration.
- **Testing:** `npm.cmd run lint` passed; project-local `tsc --noEmit` passed; `npm.cmd run build` passed; `git diff --check` passed. Browser checks at 390px, 768px, and 1440px confirmed no document-level horizontal overflow on Suppliers, Stock, and Purchase Orders. Supplier modal focus, Escape close/focus restoration, active-status filter toggle/clear, normal-motion section animation, and reduced-motion suppression were verified. The backend at `http://localhost:5000` was unavailable, so data-backed table rows, CRUD submissions, status transitions, server responses, and live validation outcomes were not exercised.

## 2026-10-20 - Batch 3 Products and Machines cohesive UI redesign

- **Files modified:** `src/components/layout/Sidebar.tsx`, `src/components/machines/MachineStatusSelect.tsx`, `src/components/machines/MachineForm.tsx`, `src/app/globals.css`, `src/components/ui/Modal.tsx`, `src/components/ui/ConfirmDialog.tsx`, `src/components/ui/Button.tsx`, `src/components/ui/Input.tsx`, `src/components/ui/Select.tsx`, `src/components/ui/Badge.tsx`, `src/components/machines/MachineStatusBadge.tsx`, `src/components/ui/StatusFilterCards.tsx`, `src/components/ui/view.tsx`, `src/components/products/ProductForm.tsx`, `src/app/(protected)/products/add/page.tsx`, `src/app/(protected)/products/edit/page.tsx`, `src/app/(protected)/machines/page.tsx`, `src/app/(protected)/machines/details/page.tsx`
- **What changed:** Redesigned the shared sidebar hierarchy with a stronger Ricoz brand zone, grouped navigation surfaces, nested rails, child-count affordances, clearer active states, and preserved collapse/mobile-drawer behavior. Added a dedicated accessible MachineStatusSelect with listbox semantics, keyboard navigation, Escape handling, focus-visible treatment, disabled support, and the existing exact `MachineStatus` values. Harmonized Products and Machines forms, tables, status badges, buttons, filters, modals, and confirmation dialogs with layered slate surfaces, restrained borders/radii/shadows, clearer action hierarchy, and connected motion states.
- **Why:** Move the Products and Machines experience beyond default control styling into a cohesive, polished manufacturing ERP interface while preserving every existing route, destination, API call, validation rule, status transition, CRUD flow, and backend integration.
- **Testing:** `npm.cmd run lint` passed; `npx.cmd tsc --noEmit` passed; `npm.cmd run build` passed; `git diff --check` passed. Browser checks at 390px, 768px, and 1440px confirmed responsive rendering without document horizontal overflow. Desktop navigation rendered all existing destinations; section collapse hid and restored nested links; the tablet mobile drawer opened and closed correctly; MachineStatusSelect selection and Escape close were verified from the Add Machine modal; and the existing modal close path returned focus to its trigger.
- **Limitations:** Backend requests to `http://localhost:5000` were refused and no authenticated session was available, so live records, CRUD submissions, status-transition completion, data-backed table rows, and server-side validation outcomes could not be exercised.

## 2026-10-20 - Batch 3 Products and Machines UI refinement

- **Files modified:** `src/components/ui/view.tsx`, `src/components/products/ProductForm.tsx`, `src/app/(protected)/products/add/page.tsx`, `src/app/(protected)/products/edit/page.tsx`, `src/app/(protected)/machines/page.tsx`, `src/app/(protected)/machines/details/page.tsx`, `src/components/machines/MachineForm.tsx`, `src/components/machines/MachineStatusBadge.tsx`, `src/components/ui/Badge.tsx`, `src/components/ui/Modal.tsx`, `src/components/ui/ConfirmDialog.tsx`
- **What changed:** Refined Products and Machines page hierarchy, responsive action layouts, filter/search surfaces, table density and alignment, mobile table guidance, loading/empty/error spacing, product and machine form surfaces, status badges, picker rows, machine detail sections, and modal/confirmation presentation. Added consistent subtle transitions, reduced-motion utility classes, page entrance motion, table-row hover transitions, active/focus feedback, animated validation feedback, and 220ms dialog open/close transitions.
- **Why:** Make the existing Products and Machines workflows feel more polished and consistent with Ricoz's navy/slate and blue design language without changing routes, API calls, validation rules, status transitions, CRUD behavior, or backend integration.
- **Testing:** `npm.cmd run lint` passed; `npx.cmd tsc --noEmit` passed; `npm.cmd run build` passed; `git diff --check` passed. Browser verification passed at 390px, 768px, and 1440px for Products, Machines, Product Add, and Machine Details: no document-level horizontal overflow was observed and the responsive page surfaces rendered at each width. Runtime motion checks confirmed the 240ms page entrance animation, 200ms input focus transition, 220ms dialog open animation, delayed dialog close unmount, and reduced-motion suppression.
- **Limitations:** Live product/machine data, CRUD operations, machine status transitions, validation submissions, modal confirmation completion, and authenticated detail states could not be exercised because the configured backend at `http://localhost:5000` was unavailable and no authenticated session was available.

## 2026-10-20 - Dashboard module density and responsive layout

- **Files modified:** `src/components/dashboard/DashboardModuleGrid.tsx`, `src/app/(protected)/dashboard/page.tsx`, `src/app/dashboard-preview/page.tsx`
- **What changed:** Adjusted the module grid to use two columns from the small breakpoint and three columns from the extra-large breakpoint; reduced mobile card density while retaining larger-screen breathing room; tightened card/list spacing; improved welcome-panel wrapping for the greeting, verification badge, supporting copy, and logout action; and aligned the preview spacing with the real Dashboard.
- **Why:** Use common desktop widths more effectively, reduce repetitive vertical space, and keep the real Dashboard and isolated preview visually consistent across mobile, tablet, and desktop without changing navigation, routes, authentication, mock data, logout behavior, APIs, or business logic.
- **Testing:** `npm.cmd run lint` passed; `npx.cmd tsc --noEmit` passed; `npm.cmd run build` passed; `git diff --check` passed. Browser verification passed at 390px, 768px, and 1440px preview widths: one-, two-, and three-column module layouts rendered as intended, with no visible clipping or overflow in the responsive welcome content.

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
