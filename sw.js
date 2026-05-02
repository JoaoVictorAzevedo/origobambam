const CACHE_NAME = 'sorteio3d-v1.0';

// Arquivos base que farão o "App" abrir rápido mesmo em 3G ruim
const ASSETS_TO_CACHE = [
    '/',
    '/index.html',
    '/site.webmanifest',
    '/logo-transparente.png',
    'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js'
];

// Instalação do Service Worker
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            return cache.addAll(ASSETS_TO_CACHE);
        })
    );
});

// Intercepta as requisições de rede
self.addEventListener('fetch', event => {
    // REGRA DE OURO: Nunca cachear a API de resultados da loteria!
    if (event.request.url.includes('loteriascaixa-api') || event.request.url.includes('hitscounter')) {
        return; 
    }
    
    // Para o resto (HTML, CSS, imagens), tenta pegar do cache, se falhar, vai na rede
    event.respondWith(
        caches.match(event.request).then(response => {
            return response || fetch(event.request);
        })
    );
});