# DevFlow Angular — Full Audit Report
> Reviewed: 2026-11-01 | No code was changed

---

## 1. Project Structure Overview

```
src/app/
├── app.ts / app.routes.ts / app.config.ts   ✅ bootstrapped correctly
├── core/                                     ⚠️ empty placeholder
├── shared/                                   ⚠️ empty placeholder
├── layout/
│   ├── main-layout/                          ✅ functional
│   ├── navbar/                               ⚠️ partially broken
│   └── sidebar/                             ⚠️ links to missing routes
└── features/
    ├── auth/                                 ❌ COMPLETELY EMPTY
    ├── dashboard/dashboard-page/            ✅ functional (minor bugs)
    ├── projects/
    │   ├── models/                           ✅
    │   ├── data-access/                      ⚠️ data bug
    │   ├── projects-page/                    ⚠️ bugs
    │   └── project-details/                  ⚠️ bugs
    ├── settings/                             ❌ COMPLETELY EMPTY
    ├── tasks/                                ❌ COMPLETELY EMPTY
    └── team/                                 ❌ COMPLETELY EMPTY
```

---

## 2. 🔴 Broken Code — Bugs Found


### 2.2 `dashboard-page.html` — Date is hardcoded (line 4)
```html
<p class="eyebrow">TUESDAY, OCTOBER 20</p>
```
**Impact:** The date never updates — it will always show "TUESDAY, OCTOBER 20" regardless of the actual date.

---

### 2.3 `dashboard-page.html` — "New Project" button does nothing (line 8)
```html
<button class="primary-button" type="button">+ New Project</button>
```
**Impact:** No `(click)` handler. Clicking the button has zero effect — it should open the create modal (or navigate to `/projects`).

---


### 2.5 `projects-page.html` — Wrong `aria-labelledby` value (line 164)
```html
<h2 id="modal-header">Create a project</h2>
<!--      ^^^^^^^^^^^^ id is "modal-header" -->
<section aria-labelledby="modal-title">
<!--                      ^^^^^^^^^^^ references "modal-title" — MISMATCH -->
```
**Impact:** Accessibility is broken — screen readers cannot associate the dialog with its label.

---


### 2.8 `projects-page.ts` — `createProject()` doesn't call `resetForm()` on validation failure (lines 63–86)
The `formError` is set, but `resetForm()` is never called. More importantly, when `createProject()` succeeds, `resetForm()` is also NOT called before `cloaseCreateModal()`. The form state persists if the modal is re-opened.

**Impact:** If you open the modal, fill it, close it, and reopen it — old values remain.

> [!NOTE]
> `resetForm()` IS called inside `openCreateModal()`, so partial mitigation exists, but it's not called on success before closing.

---


### 2.12 `navbar.html` — Static, non-functional breadcrumb (lines 3–6)
```html
<span>Workspace</span>
<span class="seperator">/</span>
<strong>Overview</strong>
```
**Impact:** The breadcrumb always says "Workspace / Overview" regardless of which page the user is on. There is no dynamic routing logic to update it.

Also note: the SCSS class is `.seperator` (one 'a') while this is a typo — the correct English spelling is `separator`. Consistency issue between HTML and SCSS here.

---

### 2.13 `app.ts` — Unused import (line 1)
```ts
import { Component, signal } from '@angular/core';
//                   ^^^^^^ `signal` is imported but never used in this file
```
**Impact:** Minor — dead import, no runtime effect but generates a lint warning.

---

### 2.14 `project-details.ts` — Tasks are hardcoded, not tied to actual project (lines 29–58)
```ts
readonly tasks = [
  { id: 'task-1', title: 'Design the page layout', ... },
  ...
];
```
**Impact:** Every project shows the exact same 4 static tasks, completely unrelated to the actual selected project. This is misleading and not functional.

---

## 3. ⚠️ Structural / Architectural Issues

### 3.1 `core/` folder — Is an empty placeholder
- `core.ts` is a bare `@Component` that does nothing.
- In Angular, `core/` should contain guards, interceptors, singleton services, and app-wide utilities.
- **Nothing is currently in core.**

### 3.2 `shared/` folder — Is an empty placeholder
- `shared.ts` is a bare `@Component` that does nothing.
- In Angular, `shared/` should contain reusable UI components (buttons, cards, badges, modals, etc.), pipes, and directives used across features.
- **Nothing is currently in shared.**

### 3.3 No `HttpClient` / `provideHttpClient()` configured
- `app.config.ts` only has `provideBrowserGlobalErrorListeners()` and `provideRouter()`.
- There is no `provideHttpClient()`. When real API calls are introduced, this will cause runtime errors.

### 3.4 No Authentication / Guards
- Routes have no `canActivate` guards.
- Any unauthenticated user can access `/dashboard`, `/projects`, etc.
- The `auth/` feature folder exists but is completely empty.

### 3.5 No state management beyond local signals
- All state lives in `ProjectsApiService` as an in-memory signal. There is no persistence (localStorage, backend, etc.).
- Refreshing the page resets all data.

### 3.6 `lucide-angular` is installed but never used
- `package.json` lists `"lucide-angular": "^1.0.0"` as a dependency.
- Zero files import or use it.
- All icons are currently Unicode characters (◫, ▧, ☷, ♧, ✓, etc.), which is fragile and visually inconsistent.

---

## 4. ❌ Missing Features — Not Yet Developed

| Feature | Route | Status | Notes |
|---|---|---|---|
| **Authentication** | `/login`, `/register` | ❌ Empty folder | No components, no service, no route |
| **Tasks / My Tasks** | `/tasks` | ❌ Empty folder | Sidebar links to it — clicking causes a redirect to `/dashboard` (wildcard fallback) |
| **Team** | `/team` | ❌ Empty folder | Sidebar links to it — same redirect issue |
| **Settings** | `/settings` | ❌ Empty folder | Sidebar links to it — same redirect issue |
| **Task Management** | Inside project details | ❌ Hardcoded stub | Tasks are static, can't be created/edited/deleted |
| **Real search (navbar)** | Global | ❌ Static UI | Search box exists but has no handler — `Ctrl+K` does nothing |
| **Dynamic breadcrumb** | Navbar | ❌ Hardcoded | Always shows "Workspace / Overview" |
| **Dynamic date** | Dashboard | ❌ Hardcoded | Always shows "TUESDAY, OCTOBER 20" |
| **Reusable components** | `shared/` | ❌ Empty | Buttons, modals, badges, etc. are duplicated per feature |
| **Guards / auth flow** | All routes | ❌ Missing | No `canActivate`, no redirect logic |
| **HTTP layer** | Services | ❌ Missing | No real API integration, all data is in-memory |
| **Error handling** | Global | ❌ Missing | No interceptors, error boundaries, or 404 pages |
| **Notifications** | Navbar bell | ❌ Static UI | Bell icon with dot exists but no functionality |
| **User profile** | Sidebar / Navbar | ❌ Hardcoded | Name "Medora", initials "M" are hardcoded strings |
| **Workspace switcher** | Sidebar | ❌ Static UI | Workspace section is non-interactive |

---

## 5. 🟡 Minor / Style Issues

| Location | Issue |
|---|---|
| `sidebar.scss` line 79, 84 | Double semicolons (`;;`) — harmless but messy |
| `projects-page.ts` | `formError` is a mutable class field instead of a `signal()` — inconsistent with rest of reactive pattern |
| `dashboard-page.scss` | `.stats-card` class referenced in responsive breakpoint (line 303) but the actual class used in HTML is `.stat-card` — dead CSS |
| `main-layout.scss` | `@use 'sass:color'` is imported but `color.*` is never used in that file |
| All spec files | All `*.spec.ts` files are empty stubs — no actual tests written |

---

## 6. Summary Count

| Category | Count |
|---|---|
| 🔴 Broken bugs (logic/visual/accessibility) | **14** |
| ❌ Completely missing features | **14** |
| ⚠️ Structural/architectural gaps | **6** |
| 🟡 Minor style/quality issues | **5** |
