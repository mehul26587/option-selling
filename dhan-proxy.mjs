/**
 * Strictly Read-Only Local CORS Proxy for DhanHQ Option Chain (dhan-proxy.mjs)
 * Allows ONLY market-data read endpoints. Order placement paths return 403 Forbidden.
 * Run with: node dhan-proxy.mjs
 */
import http from "http";

const PORT = Number(process.env.PORT || 8787);
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

const server = http.createServer(async (req, res) => {
  if (req.method === "OPTIONS") {
    res.writeHead(204, CORS_HEADERS);
    res.end();
    return;
  }

  const reqPath = (req.url || "").split("?")[0];
  if (req.method !== "POST" || !ALLOWED_PATHS.has(reqPath)) {
    res.writeHead(403, { ...CORS_HEADERS, "Content-Type": "application/json" });
    res.end(JSON.stringify({
      status: "blocked",
      error: "Read-Only Proxy: Only DhanHQ optionchain/marketfeed paths are permitted."
    }));
    return;
  }

  try {
    const chunks = [];
    for await (const chunk of req) chunks.push(chunk);
    const rawBody = Buffer.concat(chunks).toString("utf8");

    const dhanRes = await fetch(`https://api.dhan.co${reqPath}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "client-id": req.headers["client-id"] || "",
        "access-token": req.headers["access-token"] || ""
      },
      body: rawBody
    });

    const text = await dhanRes.text();
    res.writeHead(dhanRes.status, { ...CORS_HEADERS, "Content-Type": "application/json" });
    res.end(text);
  } catch (err) {
    res.writeHead(502, { ...CORS_HEADERS, "Content-Type": "application/json" });
    res.end(JSON.stringify({ status: "failed", error: err.message }));
  }
});

server.listen(PORT, () => {
  console.log(`🔒 Read-Only DhanHQ Option Chain Proxy running at http://localhost:${PORT}`);
});
