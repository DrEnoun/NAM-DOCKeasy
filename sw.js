/* NAM-DockEasy — service worker
 * Cache-first strategy for offline use. Mirror of NAM-NPeasy sw.js. */
const CACHE_NAME = 'dockeasy-v3';
const ASSETS = [
  './',
  './index.html',
  './tutorial.html',
  './case-study.html',
  './quickref.html',
  './glossary.html',
  './references.html',
  './slides/deck.html',
  './slides/deck-stage.js',

  './styles.css',
  './colors_and_type.css',
  './manifest.json',

  './content.js',
  './case-study-data.js',
  './image-slot.js',

  './Sidebar.jsx',
  './Hero.jsx',
  './Primitives.jsx',
  './PhaseSection.jsx',
  './InteractiveDecisionTree.jsx',
  './GridBoxVisualizer.jsx',
  './PoseRanker.jsx',
  './InteractionLegend.jsx',
  './DockVsMdMatrix.jsx',
  './tweaks-panel.jsx',

  './icons/icon-96.png',
  './icons/icon-128.png',
  './icons/icon-144.png',
  './icons/icon-152.png',
  './icons/icon-192.png',
  './icons/icon-384.png',
  './icons/icon-512.png',

  './assets/nam-portrait.jpg',

  /* External libs — cached on first online visit so offline reload works. */
  'https://unpkg.com/react@18.3.1/umd/react.development.js',
  'https://unpkg.com/react-dom@18.3.1/umd/react-dom.development.js',
  'https://unpkg.com/@babel/standalone@7.29.0/babel.min.js',
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(c =>
      /* Add one-by-one so a single 404 doesn't blow up the whole install. */
      Promise.all(ASSETS.map(a => c.add(a).catch(err => console.warn('[sw] skip', a, err))))
    )
  );
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  /* Only handle GETs; let everything else fall through. */
  if (e.request.method !== 'GET') return;
  e.respondWith(
    caches.match(e.request).then(cached =>
      cached || fetch(e.request).then(resp => {
        /* Opportunistically cache successful same-origin responses. */
        const url = new URL(e.request.url);
        if (resp.ok && (url.origin === location.origin || url.host === 'unpkg.com')) {
          const copy = resp.clone();
          caches.open(CACHE_NAME).then(c => c.put(e.request, copy));
        }
        return resp;
      }).catch(() => cached)
    )
  );
});
