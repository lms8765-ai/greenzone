// 브이월드 데이터API용 CORS 우회 프록시 (Cloudflare Workers)
//
// 브이월드 데이터API(GetFeature)는 브라우저에서 직접 fetch()로 호출할 수 없습니다
// (Access-Control-Allow-Origin 헤더를 응답에 포함하지 않아 CORS로 차단됨).
// 이 워커는 요청받은 경로/쿼리스트링을 그대로 https://api.vworld.kr 로 전달하고,
// 응답에 CORS 허용 헤더를 붙여서 돌려줍니다.
//
// 예) 브라우저 → https://<워커주소>/req/data?service=data&request=GetFeature&...
//     워커      → https://api.vworld.kr/req/data?service=data&request=GetFeature&... 로 그대로 전달
//     워커 → 브라우저 : 동일한 응답 + CORS 헤더 추가

export default {
  async fetch(request) {
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': '*',
    };

    // 브라우저의 CORS preflight(OPTIONS) 요청 처리
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    const reqUrl = new URL(request.url);
    const targetUrl = 'https://api.vworld.kr' + reqUrl.pathname + '?' + reqUrl.searchParams.toString();

    try {
      const upstream = await fetch(targetUrl);
      const body = await upstream.arrayBuffer();
      return new Response(body, {
        status: upstream.status,
        headers: {
          ...corsHeaders,
          'Content-Type': upstream.headers.get('Content-Type') || 'application/json',
        },
      });
    } catch (e) {
      return new Response(JSON.stringify({ error: String(e) }), {
        status: 502,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
  },
};
