# Time2Train Frontend

A Vue 3 + Vite frontend for the Time2Train administration and user dashboard application.

## Overview

This repository implements a modern Vue 3 application using:
- Vue 3
- Vite
- TypeScript
- Tailwind CSS
- Pinia for state management
- Vue Router for routing
- Axios for HTTP requests

The app is organized into role-based views, including super-admin dashboards, user dashboards, scheduling pages, and live status monitoring.

## Setup

Install dependencies:

```sh
npm install
```

Start the development server:

```sh
npm run dev
```

Build for production:

```sh
npm run build
```

Preview the production build locally:

```sh
npm run preview
```

Run linting and auto-fix problems:

```sh
npm run lint
```

Format source files:

```sh
npm run format
```

## Project Structure

- `src/main.ts` - application entry point
- `src/App.vue` - root application component
- `src/router/index.ts` - Vue Router configuration
- `src/stores/` - Pinia stores for auth, journeys, routes, stations, trains, schedules, etc.
- `src/views/` - page views grouped by feature and role
  - `super-admin/` - admin dashboards and management screens
  - `user/` - user-facing dashboard and schedules
- `src/components/` - reusable UI components and layout elements
- `src/assets/` - global styles and assets

## Requirements

- Node.js 20.19.0 or later
- npm

## Recommended Tools

- VS Code with [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar)
- ESLint and Prettier extensions for consistent formatting and linting

## Notes

- This project is configured as a private frontend app.
- Tailwind CSS is enabled through PostCSS and the `@tailwindcss/postcss` plugin.
- Type checking uses `vue-tsc` to support `.vue` files with TypeScript.
