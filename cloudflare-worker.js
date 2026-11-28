/**
 * Free Cloudflare Worker — Strictly Read-Only CORS Relay for DhanHQ Option Chain
 * Paste into Cloudflare Workers -> Deploy -> copy Worker URL into Admin Dhan Connector.
 * Only market-data read endpoints are allowed; all order/account endpoints return 403.
 */
const ALLOWED_PATHS = new Set([
  "/v2/optionchain",
  "/v2/optionchain/expirylist",
  "/v2/marketfeed/ltp",
  "/v2/marketfeed/quote"
]);

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, client-id, access-token"
};

export default {
  async fetch(request) {
    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: CORS_HEADERS });
    }

    const url = new URL(request.url);
    if (request.method !== "POST" || !ALLOWED_PATHS.has(url.pathname)) {
      return new Response(JSON.stringify({ status: "blocked", error: "Read-Only Proxy" }), {
        status: 403,
        headers: { ...CORS_HEADERS, "Content-Type": "application/json" }
      });
    }

    const body = await request.text();
    const upstream = await fetch(`https://api.dhan.co${url.pathname}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "client-id": request.headers.get("client-id") || "",
        "access-token": request.headers.get("access-token") || ""
      },
      body
    });

    const data = await upstream.text();
    return new Response(data, {
      status: upstream.status,
      headers: { ...CORS_HEADERS, "Content-Type": "application/json" }
    });
  }
};
