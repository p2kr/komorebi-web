# komorebi-web

Web client for Komorebi anime and manga management.

`komorebi-web` provides a user interface for tracking your anime and manga collections, viewing progress across providers, discovering new titles, and configuring connected accounts.

---

## Features & Functionality

- **Unified Collection Dashboard**:
  - View overall watch/read progress, statistics, and recent activity across linked accounts.
- **Provider Account Manager**:
  - Connect accounts via standard OAuth login.
  - Add public profiles in read-only Sandbox mode without logging in.
  - Switch between connected accounts seamlessly.
- **Media Discovery**:
  - Search and explore titles with detailed metadata, episode/chapter counts, and synopses.
- **Tools**:
  - **Smart Matcher**: Match external links and references to normalized media entries.
  - **Crawler Sandbox**: Test and inspect media scraping and matching behavior.
  - **Vault**: View locally stored and cached collection data.
- **Multilingual Support**:
  - Interface available in multiple languages with locale switching.
- **Theme Preferences**:
  - Supports light, dark, and system color themes.
- **Single-Page Application Export**:
  - Pre-renders static assets designed for standalone hosting or direct embedding into `komorebi-server`.

---

## Directory Structure

```
komorebi-web/
├── messages/                   # Translation files for supported languages
├── static/                     # Static assets (favicons, icons, manifest)
├── src/
│   ├── app.html                # Base HTML template
│   ├── lib/
│   │   ├── components/         # Reusable UI component modules
│   │   ├── core/               # Client state, themes, and API services
│   │   ├── models/             # Data transfer objects and types
│   │   ├── paraglide/          # Internationalization runtime
│   │   └── utils.ts            # UI helper functions
│   └── routes/                 # Application views and routing
│       ├── +layout.svelte      # Main layout shell with sidebar and navigation
│       ├── dashboard/          # Collection overview
│       ├── discover/           # Title discovery and search
│       ├── crawler/            # Matcher and crawler sandbox tools
│       ├── vault/              # Local storage manager
│       └── browser/            # Media catalog browser
└── tests/                      # Component and unit test suites
```

---

## Configuration

Configure environment variables in a `.env` file:

```env
# URL pointing to the komorebi-server API (leave blank when served by the backend)
PUBLIC_API_URL=http://127.0.0.1:8080/api/v1

# OAuth Client IDs for web-based authorization
PUBLIC_MAL_CLIENT_ID=your_mal_client_id
PUBLIC_ANILIST_CLIENT_ID=your_anilist_client_id
```

---

## Development & Build Commands

### Install Dependencies

```bash
yarn install
```

### Start Development Server

```bash
yarn dev
```

The web client runs locally on `http://localhost:5173`.

### Code Quality & Testing

```bash
# Type checking
yarn check

# Linting & Formatting
yarn lint
yarn format

# Run test suite
yarn test
```

### Production Build

```bash
yarn build
```

Builds optimized static assets into `komorebi-web/build/` for deployment or backend embedding.
