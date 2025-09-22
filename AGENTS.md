# AGENTS.md — Operating Manual for AI Coding Agents

> **Purpose**: This document tells any LLM coding agent (Claude Code, etc.) exactly how to work inside this repository so that code is **correct**, **consistent**, **non‑duplicative**, and **not over‑engineered** — while still allowing you to **modify contracts and core logic** when it is the right decision.  
> **Mindset**: Always apply *self‑critique* and *defensive engineering* to prevent bugs before they happen.

---

## 0) Project Snapshot (read before coding)

- **Framework**: Next.js (App Router)
- **Architecture**: Feature‑Sliced Design (FSD)
- **Language**: TypeScript (strict typing expected)
- **Styling**: Tailwind CSS (prefix `tw-`, `preflight: false`), vendor CSS allowed via renderer maps
- **A11y Primitives**: Radix UI (optional, most used in Tailwind renderer)
- **i18n**: JSON under `content/i18n/`; routing via `app/[[..locale]]`
- **Headless UI Pattern**: `contract` (data) ➜ `render` (traversal) ➜ `renderers` (theme maps)

> **Invariant**: One data contract may power multiple renderers; render **traversal** is single‑source‑of‑truth for structure. Renderers **must not** re‑implement traversal loops.

---

## 1) Directory Map & Allowed Changes

```
src/
  app/                 # Next.js App Router files, layouts, globals
  content/
    i18n/              # locale JSON files (keys stable; values per locale)
  shared/
    lib/               # utilities (i18n helpers, routing, request, classname, etc.)
    ui/
      <component>/
        contract/      # data contracts + normalization (can be edited with care)
        render/        # traversal logic (can be edited with care)
        renderers/     # theme maps (Tailwind, vendor CSS, Metronic, etc.) ← edit/create freely
```

### Change Levels (for both `contract` and `render`)
- **Patch** (safe edits): bug fixes, null safety, typing refinements, comments, perf micro‑fixes.
- **Minor** (additive): new optional fields or slots, non‑breaking defaults, new renderer folder.
- **Major** (breaking): change existing shapes/slots or traversal behavior.  
  **Rule**: If Major, produce a **migration note** + **tests** + **changelog entry** in `/docs/changes.md`.

> You **may** modify existing contracts/traversals. When you do, follow the **Self‑Critique Protocol** (below) to prevent regressions.

---

## 2) The General Pattern (applies to ANY component)

1) **Contract** — define input types (e.g., `Item`, options), and a **normalizer** that converts raw input into a **normalized view**.
2) **Render traversal** — one function that walks the normalized view and calls **slots** (abstract roles).
3) **Renderer map** — for each theme, map slots → concrete components/classes. *(No loops or business logic here; only “skin”.)*

> **Do not duplicate** traversal loops in renderers. If you catch duplication, refactor back into the traversal.

### Example Taxonomies (slot sets)
- **Navigation‑like**: `Root, List, Item, Trigger, Link, Content, MegaGrid, Column, ColumnHeader`
- **Tabs‑like**: `Root, TabList, Tab, PanelList, Panel`
- **Modal‑like**: `Root, Overlay, Content, Title, Description, Close`

When adding new components, reuse/extend a taxonomy or define a new minimal slot set.

---

## 3) Self‑Critique Protocol (anti‑bug routine)

Before you ship any change, run this mental checklist and include it in PR notes:

1) **Inputs**: Could `items` be `undefined`, empty, or have invalid fields? Add guards and meaningful errors.
2) **Keys & IDs**: Are React keys stable and unique? Are IDs deterministic?
3) **Edge‑depth**: Deep nesting? Prevent infinite recursion; cap or detect cycles.
4) **A11y**: If interactive (Trigger/Content/Focus), specify ARIA; if using Radix, confirm *data‑state* behavior.
5) **SSR/CSR**: No browser globals in module scope. Any `window`/`document` use is guarded or inside effects.
6) **i18n**: Don’t hard‑code strings; pull from `content/i18n/` via helpers. Keep keys stable.
7) **Styling**: Tailwind uses `tw-` prefix; don’t fight vendor CSS. Prefer class props over inline styles.
8) **No Duplicates**: If code repeats > ~20 lines across renderers, abstract into traversal or helper.
9) **Complexity**: Avoid over‑engineering. Prefer the **simplest** slot map that meets requirements (YAGNI).
10) **Tests**: Type passes; add a minimal unit/integration rendering test if behavior changed.

> If any item is uncertain, add a short **Pre‑Mortem** paragraph: “How could this fail?” and resolve risks now.

---

## 4) i18n & Locale Routing Rules

- Routing uses `app/[[..locale]]`; do not invent alternative locale mechanisms.
- Locale JSONs live in `content/i18n/`. Keys should be **stable** (changes require migration notes).
- Use `shared/lib/i18n` helpers to retrieve locale and strings. Do not access JSON directly in components unless explicitly allowed by utility.

---

## 5) Renderer Rules (Tailwind, Vendor CSS, Metronic)

- Tailwind: use `tw-` prefix, `preflight: false`; utilities may reference CSS variables.
- Theme‑Bridge (optional): define `--brand`, `--bg`, `--text` variables. Vendor themes can switch values via body classes; Tailwind utilities read them.
- Renderers **should only map slots**. Avoid custom logic, side effects, or data mutation in renderer files.
- If a theme needs special structure (e.g., Bootstrap dropdown, Metronic `data-kt-*`), implement it **within slots**, not as an extra traversal.

---

## 6) Contracts & Traversal — How to edit safely

**You may edit** existing contracts and traversal logic, but must keep them **coherent** and **documented**:

- Any shape change in contract must be reflected in normalization and traversal.
- Add **runtime assertions** in normalization for required fields; provide defaults for optional ones.
- Avoid “leaking” theme assumptions into contract or traversal (keep them headless).
- If a slot is added/removed, provide a default in traversal to keep older renderers compiling (minor), or raise a clear breaking error with migration notes (major).

> Target: **Consistency** across components; **no duplication**; **minimal** customizable surface area.

---

## 7) Coding Conventions

- **TypeScript strict**; avoid `any`. If temporary, leave a `TODO` with constraints.
- **React**: No side‑effects in render; hooks at top level; stable keys.
- **File naming**: components in `PascalCase.tsx`; maps are `map.tsx`; contract files `contract.ts`.
- **Imports**: Prefer absolute imports via project aliases if configured; group by domain.
- **Comments**: Document assumptions and slot responsibilities. Short, precise, actionable.

---

## 8) Quality Gates & Commands

Run these locally before finishing a task:

```bash
npm run type-check   # should pass
npm run lint         # should pass
npm run dev          # smoke test rendering routes
npm run build        # ensure production build compiles
# npm run test       # if tests exist; add tests for new behavior
```

**PR Checklist (copy into PR body)**:
- [ ] Self‑Critique Protocol completed
- [ ] No duplicate traversal logic in renderer
- [ ] Contract/traversal changes documented (notes + migration if needed)
- [ ] i18n keys used; no hard‑coded strings
- [ ] A11y verified (if interactive)
- [ ] Type Check / Lint / Build all pass

---

## 9) When to Ask vs. Decide

- **Ask** if: slots are unclear, a breaking change seems necessary, or theme constraints conflict.
- **Decide** (with minimal assumptions) if: ambiguity is small and a safe default exists. Document the decision and why.

> Prefer small, iterative PRs with clear diffs.

---

## 10) Example — New Component Skeleton (generic, not menu‑specific)

```
shared/ui/<comp>/contract/contract.ts
shared/ui/<comp>/render/render.tsx
shared/ui/<comp>/renderers/<theme>/map.tsx
```

**Contract** (define input + normalized view):
```ts
export type <Comp>Item = { id: string; label: string; disabled?: boolean; /* etc. */ };
export type <Comp>View = Array<
  | { kind: "leaf"; id: string; label: string }
  | { kind: "group"; id: string; label: string; children: <Comp>View }
>;

export function build<Comp>View(items: <Comp>Item[]): <Comp>View {
  // Normalize input; assert required fields; default optional ones.
  return items.map(i => (i.children ? { kind: "group", id: i.id, label: i.label, children: build<Comp>View(i.children) } : { kind: "leaf", id: i.id, label: i.label }));
}
```

**Traversal** (single source of truth for structure):
```tsx
export type <Comp>Map = {
  Root: React.FC<React.PropsWithChildren>;
  Group: React.FC<{ id: string; label: string; children: React.ReactNode }>;
  Leaf: React.FC<{ id: string; label: string }>;
};

export function render<Comp>(view: <Comp>View, C: <Comp>Map) {
  const walk = (nodes: <Comp>View): React.ReactNode =>
    nodes.map(n =>
      "children" in n
        ? <C.Group key={n.id} id={n.id} label={n.label}>{walk(n.children)}</C.Group>
        : <C.Leaf key={n.id} id={n.id} label={n.label} />
    );
  return <C.Root>{walk(view)}</C.Root>;
}
```

**Renderer (theme map)**: *only map slots to UI of a theme*. No loops, no mutation.

---

## 11) Final Guarantees (what this manual enforces)

- **Consistency**: All components follow contract ➜ traversal ➜ renderer.  
- **No Duplicates**: Traversal logic never re‑implemented in renderer.  
- **No Over‑Engineering**: Minimal slots, minimal abstractions; add only when necessary.  
- **Bug Prevention**: Self‑Critique, A11y rules, i18n discipline, SSR/CSR checks, and commands act as guardrails.  
- **Flexibility**: You can modify contracts/traversal responsibly (with notes/tests), and create new components or renderers without breaking the architecture.
