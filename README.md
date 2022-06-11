# Kitsu Web App

[![Crowdin](https://badges.crowdin.net/kitsu-web/localized.svg)](https://crowdin.com/project/kitsu-web)
![Test Status](https://github.com/hummingbird-me/kitsu-web/workflows/Kitsu%20Test%20Suite/badge.svg)
![Deploy Status](https://github.com/hummingbird-me/kitsu-web/workflows/Kitsu%20Web%20Deployment/badge.svg)
[![Code Climate](https://codeclimate.com/github/hummingbird-me/kitsu-web/badges/gpa.svg)](https://codeclimate.com/github/hummingbird-me/kitsu-web)
[![Test Coverage](https://codeclimate.com/github/hummingbird-me/kitsu-web/badges/coverage.svg)](https://codeclimate.com/github/hummingbird-me/kitsu-web/coverage)

---

**<p align="center">This is our client repository. It contains the React.js application for Kitsu.<br />Check out the [tools], [mobile], [server] and [api docs] repositories.</p>**

[tools]: https://github.com/hummingbird-me/kitsu-tools
[server]: https://github.com/hummingbird-me/kitsu-server
[mobile]: https://github.com/hummingbird-me/kitsu-mobile
[api docs]: https://github.com/hummingbird-me/api-docs

---

## Contributing

The fact that you're reading this probably means you're interested in contributing to the Kitsu
web application. If so, welcome! It's pretty easy to get started, and we're here to help you all the
way. If you have any questions, please don't hesitate to ask us on our
[Discord](https://invite.gg/kitsu) in the #dev channel!

### Getting It Running

You're gonna need a [fairly modern Node.js version](https://nodejs.org/en/about/releases/). The
Active LTS is probably the best option if you're not sure. Our deployments will use the Active LTS,
but we try to ensure that everything runs smoothly on the Current version as well.

After you have Node, run the following:

1. `npm install` (installs dependencies)
2. `npm run dev` (default port 3000)

Now visit `http://localhost:3000` and you should see the Kitsu application!

> By default, in development mode, this will connect to `staging.kitsu.io` (our pre-production
> environment) for the API, which means anything you do will be wiped out weekly. You can change
> this to connect to production if necessary by setting `VITE_API_HOST=https://kitsu.io/` in the
> `.env` file. This is generally not necessary, but there are some things which don't work fully in
> staging.
>
> In the future we plan to integrate this into the
> [kitsu-tools](https://github.com/hummingbird-me/kitsu-tools) dev environment better.

### Navigating the Codebase

While the basic project structure should be familiar to most developers who have used React and Vite
in the past, Kitsu is a large application and has more structure than you might be accustomed to.

#### Entry Points

Vite compiles the application starting at an "entry point". In our case, we have four, across three
"build targets":

- **`BUILD_TARGET=client`** — the main Kitsu (V4) web app
  - [`index.html`](./index.html) — main entry point for the Kitsu web application
  - [`oauth2-callback.html`](./oauth2-callback.html) — entry point for a callback handler from an
    OAuth2 provider (mostly just delegates to our
    [nanoauth](https://github.com/hummingbird-me/nanoauth)) library.
- **`BUILD_TARGET=server`** — server-side rendered version of the Kitsu web app
  - [`server.js`](./server.js) — main entry point for the Kitsu web app
- **`BUILD_TARGET=library`** — a library of components from the Kitsu (V4) web app to expose for
  the V3 Ember app during migration.
  - [`src/entry-ember.tsx`](./src/entry-ember.tsx) — the exports which will be accessible from the
    Ember application

#### Application Source Code

- [`src/assets/`](./src/assets/) — static assets like icons, illustrations, and animations imported
  by the application. These aren't just copied to the output directory, these must be imported and
  can be processed during compilation with various plugins.
- [`src/components/`](./src/components/) — common, reusable components
- [`src/pages/`](./src/pages/) — components rendering a whole page
- [`src/layouts/`](./src/layouts/) — components providing a reusable page structure
- [`src/contexts/`](./src/contexts/) — React contexts for sharing state between components
- [`src/initializers/`](./src/initializers/) — imperative code which runs during app boot (avoid
  these if possible, prefer hooks in the App component)
- [`src/constants/config.ts`](./src/constants/config.ts) — exposes configuration to the application
  at runtime
- [`src/graphql/`](./src/graphql/) — GraphQL support code, such as the generated schema types,
  scalars, and urql exchanges.
- [`src/hooks/`](./src/hooks/) — custom react hooks for the application
- [`src/locales/`](./src/locales/) — data for every locale we support (translations, date-fn
  locales, etc.)
- [`src/errors/`](./src/errors/) — all our error subclasses
- [`src/styles/`](./src/styles/) — application-wide styles (not specific to a component), mostly in
  the form of variables which are used in component styles.

#### Key Libraries

- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Framework:** [React](https://reactjs.org/) (we might switch to Preact at some point)
- **Bundler:** [Vite](https://vitejs.dev/)
- **Testing:** [Vitest](https://vitest.dev/)
- **Routing:** [React Router V6](https://reactrouter.com)
- **GraphQL Client:** [Urql](https://formidable.com/open-source/urql/) with [Graphcache](https://formidable.com/open-source/urql/docs/graphcache/) enabled
- **Styles:** [CSS Modules](https://github.com/css-modules/css-modules) processed by
  [PostCSS](https://postcss.org)
- **Internationalization/Localization:** [React Intl](https://formatjs.io/docs/react-intl/)
- **Time:** [date-fns](https://date-fns.org)

### Common Development Workflows

#### Running Codegen

```bash
npm run codegen
```

If you change a `.gql` file or add a new translation key, you will need to run `npm run codegen` to
have them work properly. The GraphQL Codegen will generate typescript files for every query and the
Intl Codegen will extract all the translation keys from your components.

#### Running Storybook

```bash
npm run storybook
```

We use [Storybook](https://storybook.js.org/docs/react/get-started/introduction) to document
components. We ask that you please document any new components you add.

#### Running Tests

```bash
npm run test:unit # Runs unit tests (vitest)
npm run test:unit:watch # Opens vitest in watch mode
npm run test:e2e # Runs e2e tests (cypress)
```

We have two test suites:

- **Unit Tests**
  - Powered by Vitest, a Jest-compatible testing framework
  - Extremely fast
  - Runs in a Fake DOM (not a real browser)
  - Stored adjacent to code in `.test.ts(x)` files
- **End-to-End Tests**
  - Powered by Cypress, a headless browser testing framework
  - Slower
  - Runs in a real browser (Chrome, Firefox, etc.)
  - Stored in `cypress/`

Most of the time, we recommend testing your code with Vitest. It's a much nicer experience, and it
runs faster. That said, sometimes you need to test a full workflow from end-to-end, which is what
Cypress is there for.

### Translations

We use CrowdIn to handle translations, head on over to
[crowdin.com/project/kitsu-web](https://crowdin.com/project/kitsu-web) to suggest changes or add new
translations.

Translations use the ICU Message Syntax format. [Read the syntax
documentation](https://formatjs.io/docs/icu-syntax/).

## Issues

Looking to create an issue? Open a [bug report](https://kitsu.io/feedback/bugs) or [feature
request](https://kitsu.io/feedback/feature-requests) on Kitsu.
