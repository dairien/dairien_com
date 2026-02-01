# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

Personal portfolio website for Dairien Boyd. Static HTML/CSS/JS site with no build system, no package manager, and no backend.

## Hosting & Domain

- **Domain**: `dairien.com` registered with name.com (created 2021-12-07)
- **DNS**: Cloudflare — nameservers `ainsley.ns.cloudflare.com` and `ezra.ns.cloudflare.com`
- **Proxy/CDN**: Cloudflare (free plan) — handles DNS, SSL/TLS, caching
- **Hosting**: Cloudflare Pages (free plan) — connected to GitHub repo `dairien/dairien_com`, auto-deploys on push to `master`
- **Note**: Cloudflare Pages does not serve directories starting with `_` (known bug). Avoid underscore-prefixed directory names.

## Development

Serve locally with any static HTTP server:
```bash
python3 -m http.server
```

There are no build, lint, or test commands.

## Architecture

- **Single-page static site** — all content lives in `index.html`
- **Styling**: `css/styles.css` (custom styles) + `css/normalize.css` (reset). Uses IBM Plex Mono (Google Fonts) and CarmenSans (local `fonts/` directory)
- **JS**: `js/scripts.js` uses jQuery for DOM manipulation and vanilla JS Canvas API for a procedural noise overlay effect
- **Theming**: Clicking a project highlight switches the body class, triggering CSS transitions for background color/image. Each project has its own color scheme defined in `styles.css`
- **Project data**: The highlights array in `scripts.js` defines all projects with name, className, and light/dark mode — this is the source of truth for project entries
- **Assets**: `media/highlights/` for project thumbnails, `uplds/` for larger images/videos/SVGs
