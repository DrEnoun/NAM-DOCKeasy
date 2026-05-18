# NAM-DockEasy

> *Molecular Docking Basic Tutorial for Novice* — a Progressive Web App walking you through structure-based docking from receptor prep to MD handoff. Companion to **NAM-NPeasy**.

✦ *From structure to binding — one pose at a time* ✦

---

## What's in this folder

```
dockeasy/
├── index.html              ← Landing page (5 cards into the rest of the app)
├── tutorial.html           ← Long-scroll 9-phase tutorial + interactive decision tree
├── case-study.html         ← Worked example: Capsaicin → TRPV1 (8JQR) via AMDock
├── quickref.html           ← Printable A4 quick-reference card
├── glossary.html           ← Searchable A–Z glossary
├── references.html         ← Numbered citation list with DOIs
├── slides/deck.html        ← 10-slide lecture deck (1920×1080)
├── manifest.json           ← PWA app manifest
├── sw.js                   ← Service worker (offline caching)
├── styles.css              ← All styling
├── colors_and_type.css     ← Brand tokens (colors, fonts, type scale)
├── content.js              ← Tutorial content (edit this to update phases/steps)
├── case-study-data.js      ← Case-study content
├── icons/                  ← PWA icons (96 → 512 px)
└── *.jsx                   ← React components (auto-loaded by the HTML pages)
```

This folder is **completely self-contained** — drop it into any web server and it works.

---

## Deploy to GitHub Pages in 5 minutes

### Step 1 — Create a GitHub account
Go to **github.com** and sign up (free).

### Step 2 — Create a new repository
- Click the **+** icon → **New repository**
- Name it: `dockeasy` (or any name you like)
- Set to **Public**
- Do **NOT** initialise with a README (we have our own files)
- Click **Create repository**

### Step 3 — Upload your files
- On the new empty repository page, click **"uploading an existing file"**
- Drag and drop **all the files in this folder** (`index.html`, `tutorial.html`, `case-study.html`, etc.)
- Then drag the entire `icons/` and `slides/` folders
- Scroll down, click **Commit changes**

### Step 4 — Enable GitHub Pages
- Go to repository **Settings** (top navigation)
- Scroll to **Pages** in the left sidebar
- Under **Source**, select **Deploy from a branch**
- Branch: `main`, Folder: `/ (root)`
- Click **Save**

### Step 5 — Your app is live
- Wait 2–3 minutes
- Your URL will be: `https://YOUR-USERNAME.github.io/dockeasy/`
- Share this URL on WhatsApp — recipients can install it as an app

---

## How students install it

### On Android (Chrome)
1. Open the URL in Chrome.
2. Tap the **"Install"** banner that appears at the bottom.
3. Or: tap the three-dot menu → **"Add to Home screen"**.
4. The app installs and appears on the home screen like a native app.

### On iPhone (Safari)
1. Open the URL in Safari.
2. Tap the **Share** button (box with arrow).
3. Scroll down → **"Add to Home Screen"**.
4. Tap **Add**.

### On Desktop (Chrome / Edge)
1. Open the URL.
2. Look for the **install icon** in the address bar (a monitor with a download arrow).
3. Click it → **Install**.
4. App opens in its own window without browser chrome.

---

## Offline capability

Once installed (or visited once), the entire tutorial, case study, quick-reference card, glossary, and citations work without internet. All assets are cached locally by the service worker.

---

## Maintainer notes

### Updating tutorial content
Edit `content.js`. It is the **single source of truth** for the 9 phases / 24 steps, the decision-tree questions, the glossary, the citations, and the quick-reference table. Save the file → the tutorial, sidebar, quick-ref, glossary, and references pages all update automatically.

### Adding a new case study
Edit `case-study-data.js`. Append a new object to `window.DOCKEASY.CASES`. Each step has a stable `n` (used as the image-slot storage key, so screenshots students drop in survive reloads).

### Changing the accent color
Open the **Tweaks** panel (bottom-right when on `index.html` or `tutorial.html`) and pick a different colour. Or edit `--de-accent` defaults in `styles.css`.

---

## Brand family

This repo is the **molecular docking sibling** of **[NAM-NPeasy](https://github.com/DrEnoun/NAM-NPeasy)** (Network Pharmacology Core Framework). Both share the same design system — DM Serif Display + DM Sans + JetBrains Mono, navy/coral palette, decision-tree-guided tutorials.

---

## Publishing academically

This tutorial can be submitted as a protocol article to:
- **STAR Protocols** (Cell Press) — star-protocols.cell.com
- **MethodsX** (Elsevier) — methodsx.elsevier.com
- **Bio-protocol** (free OA) — bio-protocol.org
- **Current Protocols in Bioinformatics** — currentprotocols.com

Frame it as: *"A standardised decision-tree-guided molecular docking protocol for natural-product pharmacology research"*.

---

## Citation (once published)

[Author names]. NAM-DockEasy: A Molecular Docking Core Framework for Novice Researchers. [Journal]. [Year]. DOI: [to be assigned]

---

*Developed by Dr Nur 'Ainun Mokhtar · Faculty of Pharmacy · UiTM Bertam · Proliv Life Sciences / Synacinn™ Aidecine research programme.*
