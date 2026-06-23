# 🌹 포항시 녹지 관리구역 시스템

> 그린웨이추진과 도시숲관리팀 · 천만송이 장미도시 포항

## 🌐 접속 URL
**https://lms8765-ai.github.io/greenzone**

## 📱 앱 설치 방법

### 안드로이드 (Chrome)
1. 위 URL 접속
2. 브라우저 메뉴(⋮) → "홈 화면에 추가"
3. 또는 하단 설치 배너 → "설치" 클릭

### 아이폰/아이패드 (Safari)
1. 위 URL 접속
2. 하단 공유 버튼(□↑) 탭
3. "홈 화면에 추가" 선택
4. "추가" 탭

### PC (Chrome/Edge)
1. 위 URL 접속
2. 주소창 오른쪽 설치 아이콘(⊕) 클릭
3. "설치" 클릭

## 💻 PC 로컬 실행 방법

```
서버시작.vbs 더블클릭
→ http://localhost:8080 자동 오픈
```

## 🗂 파일 구조
```
greenzone-app/
├── index.html        ← 메인 앱 (전체 기능)
├── manifest.json     ← PWA 앱 설정
├── sw.js             ← 오프라인 캐시
├── icons/            ← 앱 아이콘
│   ├── icon-72.png
│   ├── icon-96.png
│   ├── icon-128.png
│   ├── icon-192.png
│   └── icon-512.png
└── README.md         ← 이 파일
```

## 🔧 GitHub 업데이트 방법
앱 수정 후 GitHub에 index.html 재업로드하면 자동 반영됩니다.

## 📋 주요 기능
- 🗺 네이버 위성지도 기반 구역 설정
- ✏️ 폴리곤 그리기 (클릭 + Enter/더블클릭)
- 📁 그룹(폴더) 관리
- 📝 작업 기록 및 D-Day 카운트다운
- 🔍 주소·지번 검색
- 💾 데이터 내보내기/불러오기 (JSON)
- 🔔 작업 예정일 알림
- 📴 오프라인 동작 (Service Worker)
