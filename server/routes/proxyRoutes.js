// routes/proxyRoutes.js
const express = require('express');
const dns = require('dns').promises;
const net = require('net');
const supabase = require('../lib/supabaseClient');
const router = express.Router();

const MAX_RESPONSE_BYTES = 5 * 1024 * 1024; // 5MB
const FETCH_TIMEOUT_MS = 10000;

// This route is loaded into an <iframe src="..."> on the client, so the
// browser can't attach an Authorization header to the request. Accept the
// token via a `token` query param as well as the header.
async function verifyProxyToken(req, res, next) {
  const authHeader = req.headers.authorization;
  const headerToken = authHeader?.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;
  const token = headerToken || req.query.token;

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const { data, error } = await supabase.auth.getUser(token);
  if (error || !data?.user) {
    return res.status(401).json({ error: 'Invalid token' });
  }

  next();
}

function isPrivateOrLocalIp(ip) {
  if (net.isIPv4(ip)) {
    const [a, b] = ip.split('.').map(Number);
    if (a === 127) return true; // loopback
    if (a === 10) return true; // private
    if (a === 172 && b >= 16 && b <= 31) return true; // private
    if (a === 192 && b === 168) return true; // private
    if (a === 169 && b === 254) return true; // link-local, incl. 169.254.169.254 cloud metadata
    if (a === 0) return true;
    return false;
  }

  const lower = ip.toLowerCase();
  if (lower === '::1') return true; // loopback
  if (lower.startsWith('fe80:')) return true; // link-local
  if (lower.startsWith('fc') || lower.startsWith('fd')) return true; // unique local
  return false;
}

router.get('/proxy', verifyProxyToken, async (req, res) => {
  const targetUrl = req.query.url;

  if (!targetUrl) {
    return res.status(400).json({ error: 'No URL provided' });
  }

  let parsed;
  try {
    parsed = new URL(targetUrl);
  } catch {
    return res.status(400).json({ error: 'Invalid URL' });
  }

  if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
    return res.status(400).json({ error: 'Only http/https URLs are allowed' });
  }

  try {
    const addresses = await dns.lookup(parsed.hostname, { all: true });
    if (addresses.length === 0 || addresses.some((a) => isPrivateOrLocalIp(a.address))) {
      return res.status(400).json({ error: 'This URL cannot be proxied' });
    }
  } catch {
    return res.status(400).json({ error: 'Could not resolve host' });
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

  try {
    // Redirects are not followed: re-validating every hop against the
    // private-IP block list is more complexity than this feature (loading
    // a recipe page inside an iframe) warrants, so a redirecting URL is
    // simply rejected rather than silently followed.
    const response = await fetch(parsed.toString(), {
      signal: controller.signal,
      redirect: 'manual',
    });
    clearTimeout(timeout);

    if (response.status >= 300 && response.status < 400) {
      return res.status(400).json({ error: 'This URL redirects and cannot be proxied' });
    }

    const buffer = Buffer.from(await response.arrayBuffer());
    if (buffer.length > MAX_RESPONSE_BYTES) {
      return res.status(502).json({ error: 'Response too large' });
    }

    res.set('Content-Type', response.headers.get('content-type') || 'text/plain');
    res.send(buffer);
  } catch (error) {
    clearTimeout(timeout);
    return res.status(500).json({ error: 'Failed to fetch the URL' });
  }
});

module.exports = router;
