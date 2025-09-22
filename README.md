# Next Page (FSD + Headless UI Contracts)

This project is a **Next.js static website** structured with the
**Feature-Sliced Design (FSD)** methodology.\
It provides a **headless UI contract system** that separates:

-   **Data contracts** (the input structure for UI components)
-   **Render traversal** (the one-time rendering logic)
-   **Renderers** (theme-specific maps, e.g., Tailwind, Bootstrap,
    Metronic)

The goal is to allow forking this repository into different projects
(e.g., Blog with a Bootstrap theme, Metronic Admin) with **minimal code
changes** --- usually only by adding a new renderer.

------------------------------------------------------------------------

## FSD (Feature-Sliced Design)

The codebase follows the **FSD approach**:

    src/
      app/          # Application shell (Next.js App Router, layouts, globals)
      shared/       # Shared libraries, utilities, and UI contracts/renderers
        lib/        # Utilities (browser, classname, request, routing, i18n)
        ui/         # Headless UI components (contract + render + renderers)
      content/      # Static content, i18n JSON, markdown posts
      public/       # Public assets (icons, images, SVGs)

Key principles:

-   **Separation of concerns** (data contract vs render vs theme
    renderer).
-   **Reusable shared libs** for browser helpers, request utils,
    routing, and i18n.
-   **UI contracts** live in `shared/ui`, with traversal and renderers
    separated.

------------------------------------------------------------------------

## Supporting Libraries

This project includes:

-   **Tailwind CSS** (default styling, with prefix and preflight
    disabled for compatibility with vendor CSS).
-   **Radix UI** (used in the Tailwind renderer for accessibility and
    interactions).
-   **Bootstrap** or **Metronic** can be integrated as renderers in
    forks.
-   **i18n support** using JSON files under `content/i18n/`.

------------------------------------------------------------------------

## Internationalization (i18n)

-   Language data lives in `content/i18n/locale.json` (or other JSON
    files per locale).\
-   Next.js App Router is used with **`app/[[..locale]]` dynamic
    segment** for routing languages.
    -   Example: `/en/...`, `/vi/...`\
-   The i18n utility under `shared/lib/i18n` provides helpers for locale
    switching.

------------------------------------------------------------------------

## UI Contracts & Render Logic

UI components are implemented with a **data contract + render
traversal** pattern.

### Contract (example: Nav)

``` ts
export type NavItem = { id: string; title: string; href?: string; items?: NavItem[] };

export type ViewNode =
  | { kind: 'link'; id: string; title: string; href: string }
  | { kind: 'menu'; id: string; title: string; children: ViewNode[] }
  | { kind: 'mega'; id: string; title: string; columns: { title?: string; children: ViewNode[] }[] };

export function buildView(items: NavItem[]): ViewNode[] {
  // normalize menu data into a consistent tree (ViewNode)
}
```

### Render Traversal (shared across all themes)

``` tsx
export type ComponentMap = {
  Root: React.ComponentType<React.PropsWithChildren>;
  List: React.ComponentType<React.PropsWithChildren>;
  Item: React.ComponentType<React.PropsWithChildren>;
  Trigger: React.ComponentType<React.PropsWithChildren<{ id: string; title: string }>>;
  Link: React.ComponentType<{ id: string; title: string; href: string }>;
  Content: React.ComponentType<React.PropsWithChildren>;
  MegaGrid: React.ComponentType<React.PropsWithChildren>;
  Column: React.ComponentType<React.PropsWithChildren>;
  ColumnHeader: React.ComponentType<React.PropsWithChildren>;
};

export function renderNav(view: ViewNode[], C: ComponentMap) {
  const node = (n: ViewNode): React.ReactNode =>
    n.kind === 'link' ? (
      <C.Item key={n.id}><C.Link id={n.id} title={n.title} href={n.href} /></C.Item>
    ) : n.kind === 'menu' ? (
      <C.Item key={n.id}>
        <C.Trigger id={n.id} title={n.title} />
        <C.Content><C.List>{n.children.map(node)}</C.List></C.Content>
      </C.Item>
    ) : (
      <C.Item key={n.id}>
        <C.Trigger id={n.id} title={n.title} />
        <C.Content>
          <C.MegaGrid>
            {n.columns.map((col, i) => (
              <C.Column key={i}>
                {col.title && <C.ColumnHeader>{col.title}</C.ColumnHeader>}
                <C.List>{col.children.map(node)}</C.List>
              </C.Column>
            ))}
          </C.MegaGrid>
        </C.Content>
      </C.Item>
    );

  return (<C.Root><C.List>{view.map(node)}</C.List></C.Root>);
}
```

### Renderer (example: Tailwind + Radix)

``` tsx
import * as NavMenu from '@radix-ui/react-navigation-menu';

export const NavTwMap: ComponentMap = {
  Root: ({ children }) => <NavMenu.Root className="tw-relative">{children}<NavMenu.Viewport /></NavMenu.Root>,
  List: ({ children }) => <NavMenu.List className="tw-flex tw-gap-2">{children}</NavMenu.List>,
  Item: ({ children }) => <NavMenu.Item>{children}</NavMenu.Item>,
  Trigger: ({ title }) => <NavMenu.Trigger className="tw-px-3 tw-py-2">{title}</NavMenu.Trigger>,
  Link: ({ title, href }) => <NavMenu.Link asChild><a href={href}>{title}</a></NavMenu.Link>,
  Content: ({ children }) => <NavMenu.Content className="tw-absolute tw-left-0">{children}</NavMenu.Content>,
  MegaGrid: ({ children }) => <div className="tw-grid tw-gap-4">{children}</div>,
  Column: ({ children }) => <div>{children}</div>,
  ColumnHeader: ({ children }) => <div className="tw-text-xs">{children}</div>,
};
```

------------------------------------------------------------------------

## Development

1.  Install dependencies:

``` bash
npm install
```

2.  Run the development server:

``` bash
npm run dev
```

3.  Build static output:

``` bash
npm run build
```

------------------------------------------------------------------------

## Forking Guidelines

When forking this repo (e.g., for a Blog or Admin project):

-   **Do not touch** `contract/` and `render/`.
-   Add a new folder under `renderers/` (e.g., `renderers/bootstrap/`).
-   Implement your theme's **ComponentMap** in `map.tsx`.
-   (Optional) Add `theme-bridge.css` if you want to sync Tailwind
    utilities with vendor CSS variables.
-   You can still use **i18n** and the App Router `[[..locale]]`
    approach without modifications.

------------------------------------------------------------------------

## Example Usage

``` tsx
import menu from '@/content/i18n/locale.json';
import { buildView } from '@/shared/ui/nav/contract/contract';
import { renderNav } from '@/shared/ui/nav/render/render';
import { NavTwMap } from '@/shared/ui/nav/renderers/tw/map';

const view = buildView(menu.nav);
return renderNav(view, NavTwMap);
```

By changing `NavTwMap` to `NavBootstrapMap` or `NavMetronicMap`, you
switch the renderer without touching the data or traversal.

------------------------------------------------------------------------

## License
[GNU AGPL v3.0](LICENSE). <br>
Copyright &copy; [Hieu Pham](https://github.com/hieupth). All rights reserved.