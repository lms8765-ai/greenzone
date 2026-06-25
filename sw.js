// ══════════════════════════════════════════════
//  포항시 녹지관리 시스템 - Service Worker
//  오프라인 캐시 및 백그라운드 동기화
// ══════════════════════════════════════════════
const CACHE_NAME = 'pohang-greenzone-v2';
const STATIC_CACHE = 'pohang-static-v2';

// 캐시할 파일 목록
const CACHE_URLS = [
  '/greenzone/',
  '/greenzone/index.html',
  '/greenzone/manifest.json',
  '/greenzone/icons/icon-192.png',
  '/greenzone/icons/icon-512.png',
];

// 네이버지도 API (외부 URL - 캐시 제외)
const EXTERNAL_SKIP = [
  'oapi.map.naver.com',
  'naveropenapi.apigw.ntruss.com',
  'ncloud.com',
];

// ── 설치 ──────────────────────────────────────
self.addEventListener('install', event => {
  console.log('[SW] 설치 중...');
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(CACHE_URLS).catch(err => {
        console.warn('[SW] 일부 캐시 실패:', err);
      });
    })
  );
});

// ── 활성화 ────────────────────────────────────
self.addEventListener('activate', event => {
  console.log('[SW] 활성화 중...');
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(k => k !== CACHE_NAME && k !== STATIC_CACHE)
            .map(k => caches.delete(k))
      )
    ).then(() => self.clients.claim())
  );
});

// ── 네트워크 요청 처리 ────────────────────────
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  // 외부 API (네이버지도 등) → 네트워크 우선, 실패 시 캐시
  if (EXTERNAL_SKIP.some(d => url.hostname.includes(d))) {
    event.respondWith(
      fetch(event.request).catch(() => caches.match(event.request))
    );
    return;
  }

  // ── HTML 문서(index.html) → 네트워크 우선 (항상 최신 버전) ──
  // 강제 새로고침 없이도 업데이트 즉시 반영
  if (event.request.destination === 'document' ||
      url.pathname.endsWith('/') ||
      url.pathname.endsWith('index.html')) {
    event.respondWith(
      fetch(event.request).then(response => {
        // 최신 받으면 캐시도 갱신
        if (response && response.status === 200) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
        }
        return response;
      }).catch(() => {
        // 오프라인일 때만 캐시 사용
        return caches.match(event.request).then(c => c || caches.match('/greenzone/index.html'));
      })
    );
    return;
  }

  // ── 그 외 정적 리소스(아이콘 등) → 캐시 우선 ──
  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;
      return fetch(event.request).then(response => {
        if (response && response.status === 200 && response.type === 'basic') {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
        }
        return response;
      }).catch(() => {
        if (event.request.destination === 'document') {
          return caches.match('/greenzone/index.html');
        }
      });
    })
  );
});

// ── 푸시 알림 (D-Day 알림) ───────────────────
self.addEventListener('push', event => {
  const data = event.data ? event.data.json() : {};
  const title  = data.title  || '포항 녹지관리';
  const body   = data.body   || '작업 예정 알림이 있습니다.';
  const icon   = data.icon   || '/greenzone/icons/icon-192.png';
  const badge  = data.badge  || '/greenzone/icons/icon-72.png';

  event.waitUntil(
    self.registration.showNotification(title, {
      body, icon, badge,
      tag: 'greenzone-notification',
      vibrate: [200, 100, 200],
      data: { url: data.url || '/greenzone/' }
    })
  );
});

// 알림 클릭 시 앱 열기
self.addEventListener('notificationclick', event => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window' }).then(clientList => {
      for (const client of clientList) {
        if (client.url.includes('/greenzone') && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(event.notification.data.url);
      }
    })
  );
});

// ── 업데이트 즉시 적용 (앱에서 SKIP_WAITING 요청 시) ──
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
