# PassNote

PassNote is an offline-first, security-focused password manager web app built with React, TypeScript, Vite, TailwindCSS, Zustand, and Web Crypto API.

It stores encrypted vault data locally in IndexedDB and never sends secrets to a backend.

## Core Highlights

- Master password onboarding and secure unlock flow
- AES-GCM encrypted vault data at rest
- PBKDF2 key derivation with random salt
- Favorites, trash, and fast in-memory search
- Auto-lock on inactivity
- Clipboard auto-clear after copy actions
- Responsive dashboard layout, dark modern UI
- Modular architecture ready for Electron migration

## Security Architecture

### Setup Flow

1. User creates a master password
2. App generates random salt
3. PBKDF2 derives AES-256 key from password + salt
4. A verification token is encrypted and stored (`auth` record)
5. Only encrypted verification data + salt are persisted

### Login Flow

1. User enters master password
2. PBKDF2 derives key using stored salt and iterations
3. Verification token is decrypted and compared
4. If valid, key is kept in memory for current session only

### Vault Encryption

- Full vault is encrypted as one JSON payload with AES-GCM
- Each encryption uses a random IV
- Stored payload shape:

```ts
{
  iv: "base64-iv",
  data: "base64-ciphertext",
  updatedAt: 1715010000000
}
```

### Secure Storage Rules

- No plaintext credentials stored
- Master password is never stored
- Encrypted vault is kept in IndexedDB
- Decrypted data exists only in runtime memory
- No sensitive logging

## Tech Stack

- React + TypeScript + Vite
- TailwindCSS
- Zustand
- React Router DOM
- React Hook Form + Zod
- Framer Motion
- Lucide React
- IndexedDB (`idb`)
- Web Crypto API (PBKDF2 + AES-GCM)

## Folder Structure

```txt
src/
  components/
    ui/
    vault/
  crypto/
    crypto.ts
    encryption.ts
    keyDerivation.ts
  layouts/
  pages/
  routes/
  services/
  store/
  types/
  utils/
```

## Implemented Features

- Authentication: setup, login, lock, logout, wrong-password handling
- Dashboard: list/grid entries, instant search, favorites, trash
- Credential CRUD: add/edit/delete/restore/permanent delete
- Password actions: copy username/password + timed clipboard clear
- Password generation: secure random generation and entropy scoring
- Settings: auto-lock timer, clipboard timer, clear all data
- Auto-lock: activity-based inactivity timer

## Local Development

### Requirements

- Node.js 20.19+ recommended (or 22.12+)
- npm

### Install

```bash
npm install
```

### Run Dev Server

```bash
npm run dev
```

### Lint

```bash
npm run lint
```

### Build

```bash
npm run build
```

If you see a `rolldown` native binding error on Windows, run:

```bash
npm install -D @rolldown/binding-win32-x64-msvc
```

## Notes for Electron Migration

- Crypto/storage logic is isolated from UI
- Routing and state are framework-agnostic enough for desktop shell
- Replace browser-specific wrappers (clipboard/idle detection) with Electron-safe adapters later

## Future Improvements

- Encrypted import/export with integrity checks
- Master password rotation workflow
- Security audit panel (weak/duplicate/reused password warnings)
- Pinned and recently used entries
- Unit/integration tests for crypto and store flows
