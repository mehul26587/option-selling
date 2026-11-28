/**
 * LiveIPO Strictly Read-Only DhanHQ Option Chain Cloudflare Worker (cloudflare-worker.js)
 *
 * Features:
 * 1. Serves real-time DhanHQ Option Chain data to BOTH Admin & Public Frontend (`index.html`)
 *    WITHOUT ever exposing your Dhan `access-token` to browsers or GitHub.
 * 2. 3-Second Hybrid Cache (Isolate In-Memory + Request Coalescing + Optional Edge Cache)
 *    so 500+ concurrent viewers share 1 Dhan API call every 3 seconds (zero RL001 bans).
 * 3. Secure Admin Token Updater (`POST /live/admin-token`) & Auto-Renew Cron (`GET /v2/RenewToken`).
 * 4. Strictly Read-Only whitelist: order/fund/account paths always return 403 Forbidden.
 *
 * Cloudflare Dashboard Setup (Bindings / Variables):
 * - Variables & Secrets (encrypted):
 *     DHAN_CLIENT_ID    = your 10-digit Dhan Client ID
 *     DHAN_ACCESS_TOKEN = your Dhan JWT Access Token (fallback if KV is empty)
 *     ADMIN_UPDATE_KEY  = any private passphrase chosen by you (for Admin token updates)
 * - KV Namespace Binding (Optional, recommended for UI token updates + daily Cron renew):
 *     Variable name: DHAN_KV
 * - Cron Trigger (Optional, e.g. `0 3 * * *` = 08:30 IST daily):
 *     Automatically extends active Dhan JWT by +24h via /v2/RenewToken.
 */

const INDEX_CATALOG = {
  NIFTY:      { scrip: 13,  seg: "IDX_I" },
  BANKNIFTY:  { scrip: 25,  seg: "IDX_I" },
  FINNIFTY:   { scrip: 27,  seg: "IDX_I" },
  MIDCPNIFTY: { scrip: 442, seg: "IDX_I" },
  SENSEX:     { scrip: 51,  seg: "IDX_I" }
};

const READONLY_RELAY_PATHS = new Set([
  "/v2/optionchain",
  "/v2/optionchain/expirylist",
  "/v2/marketfeed/ltp",
  "/v2/marketfeed/quote"
]);

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, client-id, access-token, x-admin-key"
};

const OC_CACHE_TTL_MS = 4500;       // Safe margin above Dhan 1 req / 3s limit
const EXPIRY_CACHE_TTL_MS = 300000; // 5 minutes
const CREDS_MEM_TTL_MS = 30000;     // Reduces KV read usage
const DHAN_COOLDOWN_MS = 12000;     // 12s pause if Dhan returns 805 / RL001

// Warm-isolate caches (works on free *.workers.dev AND custom domains)
const _ocCache = new Map();       // key -> { ts, payload }
const _ocInFlight = new Map();    // key -> Promise
const _expiryCache = new Map();   // symbol -> { ts, expiries }
let _credsMem = null;             // { ts, value }
let _dhanCooldownUntil = 0;       // Isolate-level 805/429 backoff timestamp

function jsonResponse(obj, status = 200, extraHeaders = {}) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: {
      ...CORS_HEADERS,
      "Content-Type": "application/json; charset=utf-8",
      ...extraHeaders
    }
  });
}

function decodeJwtMeta(jwt) {
  if (!jwt || typeof jwt !== "string" || jwt.split(".").length < 2) {
    return { valid: false, exp: null, expiresAt: null, reason: "Invalid JWT format" };
  }
  try {
    const b64 = jwt.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
    const padded = b64 + "=".repeat((4 - (b64.length % 4)) % 4);
    const payload = JSON.parse(atob(padded));
    const nowSec = Math.floor(Date.now() / 1000);
    const expSec = typeof payload.exp === "number" ? payload.exp : null;
    const valid = expSec ? expSec > nowSec : true;
    return {
      valid,
      exp: expSec,
      expiresAt: expSec ? new Date(expSec * 1000).toISOString() : null,
      clientIdFromToken: payload.dhanClientId ? String(payload.dhanClientId) : "",
      reason: valid ? "Token Valid" : "Token Expired (24h limit ended)"
    };
  } catch (err) {
    return { valid: false, exp: null, expiresAt: null, reason: "Unable to parse JWT" };
  }
}

function maskClientId(id) {
  const s = String(id || "").trim();
  if (s.length <= 4) return s ? "****" : "";
  return `${s.slice(0, 3)}****${s.slice(-2)}`;
}

async function resolveDhanCreds(env, forceRefresh = false) {
  const now = Date.now();
  if (!forceRefresh && _credsMem && now - _credsMem.ts < CREDS_MEM_TTL_MS) {
    return _credsMem.value;
  }

  let kvData = null;
  if (env.DHAN_KV) {
    try {
      kvData = await env.DHAN_KV.get("dhan_creds", { type: "json" });
    } catch (_) {}
  }

  const clientId = String((kvData && kvData.clientId) || env.DHAN_CLIENT_ID || "").trim();
  const accessToken = String((kvData && kvData.accessToken) || env.DHAN_ACCESS_TOKEN || "").trim();
  const storage = (kvData && kvData.accessToken)
    ? "kv"
    : (env.DHAN_ACCESS_TOKEN ? "env" : "none");

  const resolved = {
    clientId,
    accessToken,
    storage,
    updatedAt: (kvData && kvData.updatedAt) || null
  };
  _credsMem = { ts: now, value: resolved };
  return resolved;
}

function constantTimeEqual(a, b) {
  const strA = String(a || "");
  const strB = String(b || "");
  if (!strA || strA.length !== strB.length) return false;
  let diff = 0;
  for (let i = 0; i < strA.length; i++) {
    diff |= strA.charCodeAt(i) ^ strB.charCodeAt(i);
  }
  return diff === 0;
}

function verifyAdminAuth(request, env) {
  const expected = String(env.ADMIN_UPDATE_KEY || "").trim();
  if (!expected) {
    return {
      ok: false,
      status: 503,
      error: "ADMIN_UPDATE_KEY variable is not configured in Cloudflare Worker Settings."
    };
  }
  const provided = request.headers.get("x-admin-key") || "";
  if (!constantTimeEqual(provided, expected)) {
    return { ok: false, status: 401, error: "Invalid Admin Key." };
  }
  return { ok: true };
}

async function fetchDhanExpiryList(idx, creds, symbol) {
  const cached = _expiryCache.get(symbol);
  if (cached && Date.now() - cached.ts < EXPIRY_CACHE_TTL_MS) {
    return cached.expiries;
  }

  const res = await fetch("https://api.dhan.co/v2/optionchain/expirylist", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "client-id": creds.clientId,
      "access-token": creds.accessToken
    },
    body: JSON.stringify({
      UnderlyingScrip: idx.scrip,
      UnderlyingSeg: idx.seg
    })
  });

  if (!res.ok) return [];
  const json = await res.json();
  if (json && json.status === "success" && Array.isArray(json.data) && json.data.length > 0) {
    _expiryCache.set(symbol, { ts: Date.now(), expiries: json.data });
    return json.data;
  }
  return [];
}

async function fetchLiveOptionChainCached(symbol, expiry, creds, ctx) {
  const idx = INDEX_CATALOG[symbol];
  if (!idx) {
    return { status: 400, body: { status: "error", error: `Unsupported symbol: ${symbol}` } };
  }

  let resolvedExpiry = (expiry || "").trim();
  if (!resolvedExpiry) {
    const expList = await fetchDhanExpiryList(idx, creds, symbol);
    if (expList.length > 0) {
      resolvedExpiry = expList[0];
    } else {
      return {
        status: 400,
        body: { status: "error", error: "Missing expiry parameter and unable to load expirylist from Dhan." }
      };
    }
  }

  const cacheKey = `${symbol}|${resolvedExpiry}`;
  const now = Date.now();
  const cached = _ocCache.get(cacheKey);
  if (cached && now - cached.ts < OC_CACHE_TTL_MS) {
    return {
      status: 200,
      cacheHit: true,
      body: { ...cached.payload, cached: true, cacheAgeMs: now - cached.ts }
    };
  }

  // Edge Cache check (effective automatically when bound to a Custom Domain)
  const edgeCacheUrl = new Request(`https://liveipo-oc-cache.internal/v1/${symbol}/${resolvedExpiry}`);
  if (typeof caches !== "undefined" && caches.default) {
    try {
      const edgeHit = await caches.default.match(edgeCacheUrl);
      if (edgeHit) {
        const edgeJson = await edgeHit.json();
        _ocCache.set(cacheKey, { ts: now, payload: edgeJson });
        return {
          status: 200,
          cacheHit: true,
          body: { ...edgeJson, cached: true }
        };
      }
    } catch (_) {}
  }

  // Coalesce concurrent requests hitting an isolate simultaneously
  if (_ocInFlight.has(cacheKey)) {
    return await _ocInFlight.get(cacheKey);
  }

  // Respect active 805/429 cooldown so Dhan never blocks the account
  if (now < _dhanCooldownUntil) {
    if (cached && cached.payload) {
      return {
        status: 200,
        cacheHit: true,
        body: { ...cached.payload, cached: true, staleFallback: true }
      };
    }
    const waitSec = Math.max(1, Math.ceil((_dhanCooldownUntil - now) / 1000));
    return {
      status: 429,
      cacheHit: false,
      body: {
        status: "error",
        reason: "RATE_LIMIT_COOLDOWN",
        retryAfterSec: waitSec,
        detail: `Dhan rate-limit cooldown active (${waitSec}s remaining).`
      }
    };
  }

  const upstreamPromise = (async () => {
    try {
      const res = await fetch("https://api.dhan.co/v2/optionchain", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "client-id": creds.clientId,
          "access-token": creds.accessToken
        },
        body: JSON.stringify({
          UnderlyingScrip: idx.scrip,
          UnderlyingSeg: idx.seg,
          Expiry: resolvedExpiry
        })
      });

      const dhanJson = await res.json();
      if (res.ok && dhanJson && dhanJson.status === "success" && dhanJson.data) {
        const payload = {
          status: "success",
          source: "dhan-cloudflare-worker",
          symbol,
          expiry: resolvedExpiry,
          fetchedAt: new Date().toISOString(),
          data: dhanJson.data
        };
        _ocCache.set(cacheKey, { ts: Date.now(), payload });

        if (typeof caches !== "undefined" && caches.default && ctx) {
          const toCache = new Response(JSON.stringify(payload), {
            headers: {
              "Content-Type": "application/json",
              "Cache-Control": "public, max-age=4, s-maxage=4"
            }
          });
          ctx.waitUntil(caches.default.put(edgeCacheUrl, toCache));
        }

        return { status: 200, cacheHit: false, body: { ...payload, cached: false } };
      }

      const rawErrStr = JSON.stringify(dhanJson || {});
      const isRateLimited = res.status === 429 || rawErrStr.includes("805") || rawErrStr.includes("RL001") || rawErrStr.toLowerCase().includes("too many requests");
      if (isRateLimited) {
        _dhanCooldownUntil = Date.now() + DHAN_COOLDOWN_MS;
      }

      // If rate-limited or transient error, serve slightly stale cache gracefully if available
      if (cached && cached.payload) {
        return {
          status: 200,
          cacheHit: true,
          body: { ...cached.payload, cached: true, staleFallback: true }
        };
      }

      return {
        status: isRateLimited ? 429 : (res.status || 502),
        cacheHit: false,
        body: {
          status: "error",
          reason: isRateLimited ? "RATE_LIMIT_COOLDOWN" : "DHAN_API_ERROR",
          retryAfterSec: isRateLimited ? Math.ceil(DHAN_COOLDOWN_MS / 1000) : undefined,
          detail: (dhanJson && (dhanJson.errorMessage || dhanJson.data || dhanJson)) || `HTTP ${res.status}`
        }
      };
    } catch (err) {
      if (cached && cached.payload) {
        return {
          status: 200,
          cacheHit: true,
          body: { ...cached.payload, cached: true, staleFallback: true }
        };
      }
      return {
        status: 502,
        cacheHit: false,
        body: { status: "error", reason: "UPSTREAM_FETCH_ERROR", detail: err.message }
      };
    } finally {
      _ocInFlight.delete(cacheKey);
    }
  })();

  _ocInFlight.set(cacheKey, upstreamPromise);
  return await upstreamPromise;
}

async function renewDhanToken(env) {
  const creds = await resolveDhanCreds(env, true);
  if (!creds.clientId || !creds.accessToken) {
    return { ok: false, reason: "MISSING_CREDS", message: "No Dhan credentials stored in KV or Env." };
  }

  const meta = decodeJwtMeta(creds.accessToken);
  if (!meta.valid) {
    return {
      ok: false,
      reason: "TOKEN_ALREADY_EXPIRED",
      message: "Token is already expired. Paste a fresh token from Dhan Portal into Admin Panel."
    };
  }

  const res = await fetch("https://api.dhan.co/v2/RenewToken", {
    method: "GET",
    headers: {
      "access-token": creds.accessToken,
      "dhanClientId": creds.clientId
    }
  });

  const json = await res.json();
  if (res.ok && json && json.accessToken) {
    if (env.DHAN_KV) {
      const nextCreds = {
        clientId: String(json.dhanClientId || creds.clientId).trim(),
        accessToken: String(json.accessToken).trim(),
        updatedAt: new Date().toISOString(),
        renewedBy: "RenewToken"
      };
      await env.DHAN_KV.put("dhan_creds", JSON.stringify(nextCreds));
      _credsMem = { ts: Date.now(), value: { ...nextCreds, storage: "kv" } };
      return {
        ok: true,
        savedToKv: true,
        expiryTime: json.expiryTime || decodeJwtMeta(nextCreds.accessToken).expiresAt
      };
    }
    return {
      ok: true,
      savedToKv: false,
      message: "Token renewed on Dhan, but DHAN_KV is not bound so it could not be persisted."
    };
  }

  return { ok: false, reason: "RENEW_FAILED", detail: json };
}

export default {
  async fetch(request, env, ctx) {
    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: CORS_HEADERS });
    }

    const url = new URL(request.url);
    const path = url.pathname.replace(/\/+$/, "") || "/";

    // 1. Public Read-Only Status Check (safe metadata only, never exposes secrets)
    if (request.method === "GET" && (path === "/" || path === "/live/status")) {
      const creds = await resolveDhanCreds(env);
      const hasCreds = !!(creds.clientId && creds.accessToken);
      const jwtMeta = hasCreds ? decodeJwtMeta(creds.accessToken) : { valid: false, reason: "Not configured" };
      return jsonResponse({
        ok: true,
        service: "LiveIPO Strictly Read-Only DhanHQ Feed Worker",
        storage: creds.storage,
        kvBound: Boolean(env.DHAN_KV),
        adminKeyConfigured: Boolean(env.ADMIN_UPDATE_KEY),
        hasCredentials: hasCreds,
        clientIdMasked: maskClientId(creds.clientId),
        tokenValid: jwtMeta.valid,
        tokenExpiresAt: jwtMeta.expiresAt,
        tokenStatus: jwtMeta.reason,
        updatedAt: creds.updatedAt
      }, 200, { "Cache-Control": "no-store" });
    }

    // 2. Public Read-Only Live Option Chain for Admin & Frontend Visitors
    if (request.method === "GET" && path === "/live/optionchain") {
      const symbol = (url.searchParams.get("symbol") || "NIFTY").toUpperCase();
      const expiry = url.searchParams.get("expiry") || "";
      const creds = await resolveDhanCreds(env);

      if (!creds.clientId || !creds.accessToken) {
        return jsonResponse({
          status: "error",
          reason: "MISSING_CREDS",
          detail: "Configure DHAN_CLIENT_ID and DHAN_ACCESS_TOKEN in Cloudflare Worker (KV or Secrets)."
        }, 503, { "Cache-Control": "no-store" });
      }

      const jwtMeta = decodeJwtMeta(creds.accessToken);
      if (!jwtMeta.valid) {
        return jsonResponse({
          status: "error",
          reason: "TOKEN_EXPIRED",
          expiresAt: jwtMeta.expiresAt,
          detail: jwtMeta.reason
        }, 401, { "Cache-Control": "no-store" });
      }

      const result = await fetchLiveOptionChainCached(symbol, expiry, creds, ctx);
      return jsonResponse(result.body, result.status, {
        "Cache-Control": result.status === 200 ? "public, max-age=2, s-maxage=3" : "no-store"
      });
    }

    // 3. Public Read-Only Expiry Calendar for Supported Indices
    if (request.method === "GET" && path === "/live/expiries") {
      const symbol = (url.searchParams.get("symbol") || "NIFTY").toUpperCase();
      const idx = INDEX_CATALOG[symbol];
      if (!idx) {
        return jsonResponse({ status: "error", error: `Unsupported symbol: ${symbol}` }, 400);
      }
      const creds = await resolveDhanCreds(env);
      if (!creds.clientId || !creds.accessToken) {
        return jsonResponse({ status: "error", reason: "MISSING_CREDS" }, 503);
      }
      const expiries = await fetchDhanExpiryList(idx, creds, symbol);
      return jsonResponse({ status: "success", symbol, expiries }, 200, {
        "Cache-Control": "public, max-age=60, s-maxage=300"
      });
    }

    // 4. Admin-Authenticated Token Updater (stores fresh 24h token into Cloudflare KV)
    if (request.method === "POST" && path === "/live/admin-token") {
      const auth = verifyAdminAuth(request, env);
      if (!auth.ok) {
        return jsonResponse({ status: "error", error: auth.error }, auth.status);
      }
      if (!env.DHAN_KV) {
        return jsonResponse({
          status: "error",
          reason: "KV_NOT_BOUND",
          error: "Bind a KV Namespace named DHAN_KV in Cloudflare Worker Settings -> Bindings, OR update DHAN_ACCESS_TOKEN directly in Worker Variables."
        }, 501);
      }

      let body;
      try {
        body = await request.json();
      } catch (_) {
        return jsonResponse({ status: "error", error: "Invalid JSON body" }, 400);
      }

      const clientId = String(body.clientId || env.DHAN_CLIENT_ID || "").trim();
      const accessToken = String(body.accessToken || "").trim();
      if (!clientId || !accessToken) {
        return jsonResponse({ status: "error", error: "Both clientId and accessToken are required." }, 400);
      }

      const jwtMeta = decodeJwtMeta(accessToken);
      if (!jwtMeta.valid) {
        return jsonResponse({
          status: "error",
          reason: "TOKEN_EXPIRED",
          error: `Provided JWT token is invalid or already expired (${jwtMeta.reason}).`
        }, 400);
      }

      const record = {
        clientId,
        accessToken,
        updatedAt: new Date().toISOString()
      };
      await env.DHAN_KV.put("dhan_creds", JSON.stringify(record));
      _credsMem = { ts: Date.now(), value: { ...record, storage: "kv" } };

      return jsonResponse({
        status: "success",
        saved: true,
        expiresAt: jwtMeta.expiresAt,
        clientIdMasked: maskClientId(clientId)
      });
    }

    // 5. Admin-Authenticated Immediate Token Renewal
    if (request.method === "POST" && path === "/live/renew-now") {
      const auth = verifyAdminAuth(request, env);
      if (!auth.ok) {
        return jsonResponse({ status: "error", error: auth.error }, auth.status);
      }
      const res = await renewDhanToken(env);
      return jsonResponse(res, res.ok ? 200 : 400);
    }

    // 6. Backward-Compatible Read-Only POST Relay for Direct Proxy Calls
    if (request.method === "POST" && READONLY_RELAY_PATHS.has(path)) {
      const creds = await resolveDhanCreds(env);
      const clientId = (request.headers.get("client-id") || creds.clientId || "").trim();
      const accessToken = (request.headers.get("access-token") || creds.accessToken || "").trim();
      if (!clientId || !accessToken) {
        return jsonResponse({ status: "error", reason: "MISSING_CREDS" }, 401);
      }

      const body = await request.text();
      const upstream = await fetch(`https://api.dhan.co${path}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "client-id": clientId,
          "access-token": accessToken
        },
        body
      });

      const data = await upstream.text();
      return new Response(data, {
        status: upstream.status,
        headers: { ...CORS_HEADERS, "Content-Type": "application/json; charset=utf-8" }
      });
    }

    // Block every non-whitelisted / order / account path
    return jsonResponse({
      status: "blocked",
      error: "Read-Only Proxy: Only DhanHQ optionchain/marketfeed endpoints are allowed."
    }, 403);
  },

  // Optional Daily Cron Trigger handler (auto-renews active token via /v2/RenewToken)
  async scheduled(event, env, ctx) {
    const p = renewDhanToken(env);
    if (ctx && typeof ctx.waitUntil === "function") {
      ctx.waitUntil(p);
    }
    return await p;
  }
};
