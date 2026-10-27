# AWDF Student Portfolio — Task Management Application

Full-stack React + Node.js + MongoDB Atlas task management application built across Practicals 5–8 of the Advanced Web Development Frameworks course.

---

## Tech stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, Vite 8, React Router v7 |
| Backend | Express 5, Mongoose 9, MongoDB Atlas |
| Auth | bcryptjs, jsonwebtoken (JWT) |
| Styling | Custom CSS (cosmic dark theme) |

---

## Running the project

```bash
# Terminal 1 — backend (port 5000)
cd server
node server.js

# Terminal 2 — frontend (port 5173)
npm run dev
```

Navigate to `http://localhost:5173/todo` to use the task manager.  
Register an account, log in, then create / edit / delete tasks with priority.

---

## Practical 8 — Performance Optimization and Lazy Loading

### What was changed

Only **one file** was modified: `src/App.jsx`.  
No new dependencies were added. No other files were touched.

---

### Task 1 — Route-based lazy loading

All seven page-level route components were converted from eager `import` statements to `React.lazy()` with dynamic `import()` calls:

```js
// BEFORE (Practical 7)
import Home        from './pages/Home'
import SkillsPage  from './pages/SkillsPage'
import Projects    from './pages/Projects'
import Contact     from './pages/Contact'
import GithubRepos from './pages/GithubRepos'
import TodoPage    from './pages/TodoPage'
import NotFound    from './pages/NotFound'

// AFTER (Practical 8)
const Home        = lazy(() => import('./pages/Home'))
const SkillsPage  = lazy(() => import('./pages/SkillsPage'))
const Projects    = lazy(() => import('./pages/Projects'))
const Contact     = lazy(() => import('./pages/Contact'))
const GithubRepos = lazy(() => import('./pages/GithubRepos'))
const TodoPage    = lazy(() => import('./pages/TodoPage'))
const NotFound    = lazy(() => import('./pages/NotFound'))
```

Three components are kept as **eager** imports because they are needed on every route immediately:

| Component | Reason for eager import |
|-----------|------------------------|
| `GradientBackground` | Fixed CSS background layer — must render before any route chunk loads to prevent a visible flash |
| `NavBar` | Present on every page — delay causes a layout shift |
| `Footer` | Small, always rendered alongside route content |

The `<Suspense>` boundary wraps **only the `<Routes>` block**, so NavBar and Footer remain visible while a lazy chunk is being fetched.

---

### Task 2 — Minimum-delay fallback

A `MinDelayFallback` component prevents a distracting brief flash of the loading spinner on fast connections.

**Behavior:**

1. The spinner is hidden for the first **50 ms** — instant loads never show anything.
2. Once the spinner appears, it stays visible for at least **300 ms** before Suspense can remove it.
3. If the chunk takes longer than 300 ms, the spinner shows throughout (no extra delay).
4. All timers are cleared on unmount — no memory leaks or stale-state warnings.

```jsx
<Suspense fallback={<MinDelayFallback />}>
  <Routes>…</Routes>
</Suspense>
```

The fallback reuses the existing `.spinner` CSS class so it matches the current UI.

---

### Task 3 — Lazy-loading the heavy component

`TodoPage` is the largest page in the application at **35 kB source / 19.74 kB raw chunk**.  
It contains the complete authentication gate, task manager, priority UI, toast system, and delete confirmation dialog.

It is lazy-loaded so its entire code is excluded from the initial bundle and fetched only when the user navigates to `/todo`.

```js
// Task 3: heaviest page — loaded only on /todo navigation
const TodoPage = lazy(() => import('./pages/TodoPage'))
```

Additionally, `GradientBackground` was wrapped with `React.memo()` (Task 6 / memo optimization):

```js
const GradientBackground = memo(GradientBackgroundRaw)
```

`GradientBackground` renders fixed CSS animation layers and receives no props. Without `memo`, it re-renders on every theme toggle and route change even though its output never changes. `memo` prevents those unnecessary renders.

`toggleTheme` in `App` was also wrapped with `useCallback(() => …, [])` so its reference is stable across renders.

---

### Build command

```bash
npm run build
```

Run from the `student-portfolio/` directory (where `package.json` lives).

---

### Before vs After — actual measured build output

#### BEFORE Practical 8 (Practical 7 baseline)

Build run: `npx vite build` on the Practical 7 codebase  
All pages bundled into a single JS file.

```
dist/index.html                   0.48 kB │ gzip:  0.30 kB
dist/assets/index-1qboW4nM.css   33.41 kB │ gzip:  7.09 kB
dist/assets/index-0NMalUda.js   286.58 kB │ gzip: 88.03 kB   ← single JS bundle
```

- **1 JavaScript chunk**
- Initial JS transferred (gzip): **88.03 kB**
- All page code loaded upfront, including TodoPage, GithubRepos, Contact, etc.

---

#### AFTER Practical 8

Build run: `npx vite build` after App.jsx changes  
Vite emits a separate chunk for every lazy-loaded route.

```
dist/index.html                        0.48 kB │ gzip:  0.30 kB
dist/assets/index-1qboW4nM.css        33.41 kB │ gzip:  7.09 kB
dist/assets/NotFound-DjdBg54q.js       0.88 kB │ gzip:  0.49 kB
dist/assets/Projects-ClLpz_Dm.js       2.13 kB │ gzip:  0.88 kB
dist/assets/SkillsPage-B27UEf1m.js     2.48 kB │ gzip:  1.04 kB
dist/assets/GithubRepos-DjWDhBg1.js    3.21 kB │ gzip:  1.30 kB
dist/assets/Contact-6XRVlqwv.js        6.86 kB │ gzip:  2.81 kB
dist/assets/Home-fJN0Dqq4.js          13.31 kB │ gzip:  3.87 kB
dist/assets/TodoPage-CJKSu2Ew.js      19.74 kB │ gzip:  5.68 kB
dist/assets/index-C2CerVOi.js        239.63 kB │ gzip: 77.21 kB   ← core bundle
```

- **8 JavaScript chunks** (1 core + 7 route chunks)
- Initial JS transferred (gzip, core bundle only): **77.21 kB**
- Code deferred to lazy chunks: **48.26 kB raw / 16.07 kB gzip total** (sum of all 7 route chunks)

---

### Comparison summary

| Metric | Before | After | Change |
|--------|--------|-------|--------|
| JS chunks | 1 | 8 | +7 route chunks |
| Core bundle (raw) | 286.58 kB | 239.63 kB | −46.95 kB (−16.4%) |
| Core bundle (gzip) | 88.03 kB | 77.21 kB | −10.82 kB (−12.3%) |
| TodoPage chunk (gzip) | bundled | 5.68 kB | deferred until `/todo` |
| All deferred chunks (gzip) | 0 kB | 16.07 kB | fetched on demand |

**Net result on initial page load:**  
A user landing on `/` downloads **~10.82 kB less JavaScript** (gzip) before the page becomes interactive.  
The remaining code is fetched on-demand the first time each route is visited.

---

### Why lazy loading improves perceived performance

When a user first opens the application, the browser must:
1. Download the JavaScript bundle
2. Parse and compile it
3. Execute it

Lazy loading defers code that is not needed for the initial page. A user landing on `/` does not need the TodoPage authentication logic, the GithubRepos fetcher, or the Contact email form. Splitting these into separate chunks means the browser parses and compiles less code before the first meaningful paint.

**Important caveat for this project:**  
This is a small portfolio application. The absolute saving is ~10.82 kB gzip on the initial load. For a real production app with many heavy pages, third-party chart libraries, or large data tables, the savings would be substantially larger. In a project this size the complexity of code splitting may not justify the benefit — but it correctly demonstrates the pattern required by Practical 8.

On **subsequent navigations** the total code downloaded increases slightly because each new route fetches its own chunk. The browser caches these chunks, so revisiting the same route costs nothing.

---

### How to reproduce the measurements

#### 1. Build output (chunk sizes)

```bash
cd student-portfolio
npm run build
```

Inspect the printed output in the terminal. The lines show raw size and gzip size for every emitted chunk.

#### 2. Network transfer — Chrome DevTools

1. Run `npm run build && npm run preview` to serve the production build locally.
2. Open `http://localhost:4173` in Chrome.
3. Open DevTools → **Network** tab.
4. Check **Disable cache**.
5. Set throttling to **Slow 3G**.
6. Hard-reload the page (`Ctrl+Shift+R`).
7. Note the JS files transferred and total transfer size on the initial load.
8. Click **GitHub** in the nav. Observe the `GithubRepos-*.js` chunk being fetched.
9. Click **To-Do** in the nav. Observe the `TodoPage-*.js` chunk being fetched.
10. Navigate back to **GitHub** — no new network request (chunk is cached).

**Expected observations:**
- On initial load, only `index-*.js` and `Home-*.js` are fetched (Home is the default route).
- Each additional route fetches exactly one new chunk on first visit.
- The loading spinner (`MinDelayFallback`) is visible under Slow 3G throttling.

#### 3. Observe the fallback under throttling

1. In Chrome DevTools Network, set throttling to **Slow 3G**.
2. Navigate to a page you have not visited (e.g., `/repos`).
3. The NavBar and Footer remain visible immediately (they are eagerly loaded).
4. The `MinDelayFallback` spinner appears in the page content area.
5. Once the chunk downloads, the real page content replaces the spinner.

To see the 300 ms minimum delay:
1. Set throttling to **No throttling**.
2. Navigate to a new route.
3. In React DevTools → Profiler → record the navigation.
4. The `MinDelayFallback` should not appear at all on fast connections (the 50 ms guard suppresses it).

---

### Task 6 — React DevTools Profiler

#### What to look for

Open the running dev server (`npm run dev`) and install [React DevTools](https://chromewebstore.google.com/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi) in Chrome.

**Interaction to profile — theme toggle:**

1. Open `http://localhost:5173` in Chrome.
2. Open React DevTools → **Profiler** tab.
3. Click **Start profiling** (circle icon).
4. Click the **◑ Light / ● Dark** button in the NavBar.
5. Click **Stop profiling**.

**What to look for in the flamegraph:**

Without `memo` on `GradientBackground`, every theme toggle re-renders it even though its output is identical — it receives no props and its CSS animations are purely declarative. Look for `GradientBackground` in the flamegraph. If it appears with a non-grey bar, it re-rendered unnecessarily.

**After the Practical 8 change** (with `memo`):  
`GradientBackground` should appear as a **grey bar** labelled "Did not render" in the Profiler flamegraph, confirming the memo optimization worked.

**Component and interaction for you to verify:**

| Component | Interaction | Expected without memo | Expected with memo |
|-----------|-------------|----------------------|--------------------|
| `GradientBackground` | Click theme toggle | Re-renders (orange bar) | Skipped (grey bar) |

#### Applied optimizations in this change

| Optimization | Location | Justification |
|---|---|---|
| `React.memo(GradientBackground)` | `App.jsx` | Receives no props; re-rendering on theme/route changes is always wasted work |
| `useCallback` on `toggleTheme` | `App.jsx` | Stable reference prevents NavBar from seeing a new prop on every `App` render |

No other `memo` / `useMemo` / `useCallback` calls were added. Adding them without profiler evidence of a real problem is premature optimization.

---

### Measurements still needed from you

The following require the application to be running in a browser and cannot be captured by the build tooling alone. Please fill these in after testing:

| Measurement | Placeholder |
|---|---|
| Chrome DevTools — initial JS transfer (Network tab, Slow 3G, `/`) | `[TO BE MEASURED]` kB |
| Chrome DevTools — time to interactive on `/` (Slow 3G) | `[TO BE MEASURED]` ms |
| Chrome DevTools — `/todo` chunk transfer size (Network tab) | `[TO BE MEASURED]` kB (expected ~5.68 kB gzip) |
| React Profiler — `GradientBackground` render time before memo | `[TO BE MEASURED]` ms |
| React Profiler — `GradientBackground` render time after memo | `[TO BE MEASURED]` ms (expected: "Did not render") |

To fill these in, follow the steps in the **How to reproduce the measurements** section above.

---

## Project structure

```
student-portfolio/
├── src/
│   ├── App.jsx            ← modified in Practical 8
│   ├── main.jsx
│   ├── api.js             ← centralized API utility (Practical 6/7)
│   ├── data.js
│   ├── index.css
│   ├── App.css
│   ├── components/
│   │   ├── GradientBackground.jsx   ← memo-wrapped in App.jsx
│   │   ├── NavBar.jsx
│   │   ├── Footer.jsx
│   │   └── ...
│   └── pages/
│       ├── Home.jsx          ← lazy-loaded
│       ├── SkillsPage.jsx    ← lazy-loaded
│       ├── Projects.jsx      ← lazy-loaded
│       ├── Contact.jsx       ← lazy-loaded
│       ├── GithubRepos.jsx   ← lazy-loaded
│       ├── TodoPage.jsx      ← lazy-loaded (heaviest, Task 3)
│       └── NotFound.jsx      ← lazy-loaded
└── server/
    ├── server.js
    ├── models/
    │   ├── Task.js
    │   └── User.js
    └── middleware/
        ├── auth.js
        └── validate.js
```

---

*Original Vite template notes preserved below.*

---

## React + Vite (original template notes)

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)
