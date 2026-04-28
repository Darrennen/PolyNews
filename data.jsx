// data.jsx — Polymarket live data layer.
// Globals are pre-populated with mock fixtures so artboards render immediately.
// loadPolymarketData() fetches live data and overwrites the globals, then the
// App re-renders with real numbers.

// ─── API endpoints ───────────────────────────────────────────────────────────
const GAMMA_API = 'https://gamma-api.polymarket.com';
const CLOB_API  = 'https://clob.polymarket.com';

// ─── Mock fixtures (fallback / initial state) ────────────────────────────────

const MARKETS = [
  { id: 'fed-rate-cut-jun',  cat: 'Macro',   q: 'Will the Fed cut rates at the June 2026 meeting?',           short: 'Fed cuts in June',      yes: 0.68, delta24: +0.041, vol: 12_840_000, liq: 2_310_000, closes: 'Jun 17, 2026', seed: 17 },
  { id: 'btc-100k-eoy',      cat: 'Crypto',  q: 'Will BTC close above $120k on Dec 31, 2026?',               short: 'BTC > $120k EOY',       yes: 0.42, delta24: -0.028, vol:  8_215_000, liq: 1_440_000, closes: 'Dec 31, 2026', seed: 41 },
  { id: 'champions-final',   cat: 'Sports',  q: 'Will Real Madrid win the Champions League final?',          short: 'Real Madrid wins UCL',  yes: 0.57, delta24: +0.012, vol:  4_120_000, liq:   880_000, closes: 'May 30, 2026', seed:  9 },
  { id: 'oscar-best-pic',    cat: 'Culture', q: 'Will "The Quiet Hours" win Best Picture at the 2027 Oscars?', short: 'Best Pic: Quiet Hours', yes: 0.31, delta24: +0.060, vol:  1_890_000, liq:   410_000, closes: 'Mar  7, 2027', seed: 23 },
  { id: 'recession-q3',      cat: 'Macro',   q: 'US recession declared by NBER in Q3 2026?',                 short: 'NBER recession Q3',     yes: 0.18, delta24: -0.009, vol:  6_540_000, liq: 1_120_000, closes: 'Oct  1, 2026', seed:  5 },
  { id: 'spacex-mars',       cat: 'Tech',    q: 'SpaceX uncrewed Mars launch attempt before 2027?',          short: 'SpaceX Mars 2026',      yes: 0.24, delta24: +0.018, vol:    980_000, liq:   290_000, closes: 'Dec 31, 2026', seed: 31 },
];

const NEWS_BY_MARKET = {
  'fed-rate-cut-jun':  [{ day: 20, t: '−1h',  headline: 'Powell signals patience on cuts in Jackson Hole remarks', impact: -0.06, src: 'Reuters'       }],
  'btc-100k-eoy':      [{ day: 49, t: '−9d',  headline: 'Mt. Gox trustee resumes BTC distributions',               impact: -0.07, src: 'Trustee notice' }],
  'champions-final':   [{ day: 20, t: '−5d',  headline: 'Vinícius cleared to start; full training Wednesday',       impact: +0.06, src: 'Marca'          }],
  'oscar-best-pic':    [{ day: 73, t: '−4d',  headline: 'BAFTA Best Film: "The Quiet Hours"',                       impact: +0.09, src: 'BAFTA'          }],
  'recession-q3':      [{ day: 49, t: '−1w',  headline: 'ISM services back above 50, new orders rise',              impact: -0.06, src: 'ISM'            }],
  'spacex-mars':       [{ day: 49, t: '−10d', headline: 'FAA grants modified launch license',                        impact: +0.05, src: 'FAA'            }],
};

const TICKER_FEED = [
  { mkt: 'Fed cuts in June',     delta: +0.041, reason: 'Waller op-ed',    t: '2m'  },
  { mkt: 'Best Pic: Quiet Hours',delta: +0.060, reason: 'BAFTA win',       t: '7m'  },
  { mkt: 'BTC > $120k EOY',      delta: -0.028, reason: 'Mt.Gox flows',    t: '14m' },
  { mkt: 'Real Madrid wins UCL', delta: +0.012, reason: 'Vinícius fit',    t: '22m' },
  { mkt: 'NBER recession Q3',    delta: -0.009, reason: 'ISM beat',        t: '31m' },
  { mkt: 'SpaceX Mars 2026',     delta: +0.018, reason: 'FAA license',     t: '47m' },
];

// ─── PRNG + mock series/book (kept for fallback) ─────────────────────────────

function mulberry32(a) {
  return function() {
    a |= 0; a = a + 0x6D2B79F5 | 0;
    let t = a;
    t = Math.imul(t ^ t >>> 15, t | 1);
    t ^= t + Math.imul(t ^ t >>> 7, t | 61);
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}

function buildSeriesMock(market, days = 90) {
  const rand = mulberry32(market.seed);
  const out = [];
  let v = Math.max(0.05, Math.min(0.95, market.yes - market.delta24 - 0.05 + rand() * 0.1));
  const jumps = [
    { day: Math.floor(days * 0.22), mag: (rand() - 0.5) * 0.18 },
    { day: Math.floor(days * 0.55), mag: (rand() - 0.5) * 0.14 },
    { day: Math.floor(days * 0.81), mag: (rand() - 0.4) * 0.16 },
  ];
  for (let d = 0; d < days; d++) {
    const noise = (rand() - 0.5) * 0.018;
    const drift = (market.yes - v) * 0.04;
    let jump = 0;
    for (const j of jumps) if (j.day === d) jump = j.mag;
    v = Math.max(0.02, Math.min(0.98, v + drift + noise + jump));
    out.push({ d, v, jump: jump !== 0 ? jump : null });
  }
  out[out.length - 1].v = market.yes;
  return out;
}

function buildBookMock(market, depth = 8) {
  const rand = mulberry32(market.seed + 1);
  const mid = market.yes;
  const bids = [], asks = [];
  for (let i = 0; i < depth; i++) {
    bids.push({ p: Math.max(0.01, mid - 0.005 - i * 0.005 - rand() * 0.003), sz: Math.floor(2000 + rand() * 18000) });
    asks.push({ p: Math.min(0.99, mid + 0.005 + i * 0.005 + rand() * 0.003), sz: Math.floor(2000 + rand() * 18000) });
  }
  return { bids, asks, mid };
}

// Default implementations (may be overridden by live data after load)
function buildSeries(market, days = 90) { return buildSeriesMock(market, days); }
function buildBook(market, depth = 8)   { return buildBookMock(market, depth); }

// ─── Live API helpers ─────────────────────────────────────────────────────────

function _tryJSON(str, fallback) {
  try { return JSON.parse(str); } catch { return fallback; }
}
function _clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); }
function _fmtDate(iso) {
  try { return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }); }
  catch { return '—'; }
}

const _TAG_TO_CAT = {
  Politics: 'Politics', Sports: 'Sports', Crypto: 'Crypto', Cryptocurrency: 'Crypto',
  Science: 'Tech', Technology: 'Tech', Finance: 'Macro', Economics: 'Macro',
  Entertainment: 'Culture', 'Pop Culture': 'Culture', Business: 'Macro',
  World: 'Politics', Elections: 'Politics',
};

function _transformGammaMarket(m, idx) {
  const prices   = _tryJSON(m.outcomePrices, ['0.5', '0.5']);
  const tokenIds = _tryJSON(m.clobTokenIds,  []);
  const yes      = _clamp(parseFloat(prices[0]) || 0.5, 0.01, 0.99);
  const tag      = m.tags?.[0]?.label || '';
  return {
    id:          m.conditionId,
    cat:         _TAG_TO_CAT[tag] || tag || 'General',
    q:           m.question || '',
    short:       (m.groupItemTitle || m.question || '').slice(0, 55),
    yes,
    delta24:     parseFloat(m.oneDayPriceChange) || 0,
    vol:         parseFloat(m.volume24hr) || parseFloat(m.volume) || 0,
    liq:         parseFloat(m.liquidityClob) || parseFloat(m.liquidity) || 0,
    closes:      m.endDate ? _fmtDate(m.endDate) : '—',
    seed:        idx * 7 + 3,
    conditionId: m.conditionId,
    yesTokenId:  tokenIds[0] || null,
    noTokenId:   tokenIds[1] || null,
  };
}

function _buildSeriesFromHistory(rawHistory, market, days = 90) {
  if (!rawHistory?.length) return buildSeriesMock(market, days);

  const hist = [...rawHistory].sort((a, b) => a.t - b.t);
  const nowTs   = Date.now() / 1000;
  const startTs = nowTs - days * 86400;
  const win     = hist.filter(h => h.t >= startTs);
  if (win.length < 2) return buildSeriesMock(market, days);

  // Sample `days` evenly-spaced points via linear interpolation
  const out = [];
  for (let d = 0; d < days; d++) {
    const targetTs = startTs + (d / (days - 1)) * (nowTs - startTs);
    let lo = win[0], hi = win[win.length - 1];
    for (let i = 0; i < win.length - 1; i++) {
      if (win[i].t <= targetTs && win[i + 1].t >= targetTs) { lo = win[i]; hi = win[i + 1]; break; }
    }
    const t = (lo.t === hi.t) ? 1 : (targetTs - lo.t) / (hi.t - lo.t);
    const v = _clamp(lo.p + t * (hi.p - lo.p), 0.02, 0.98);
    out.push({ d, v, jump: null });
  }

  // Mark jumps > 3 pp
  for (let i = 1; i < out.length; i++) {
    const delta = out[i].v - out[i - 1].v;
    if (Math.abs(delta) > 0.03) out[i].jump = delta;
  }

  out[out.length - 1].v = market.yes;
  return out;
}

function _detectNewsFromSeries(series, market) {
  if (!series) return [];
  return series
    .filter(p => p.jump !== null && Math.abs(p.jump) > 0.02)
    .sort((a, b) => Math.abs(b.jump) - Math.abs(a.jump))
    .slice(0, 3)
    .sort((a, b) => a.d - b.d)
    .map(p => {
      const ago = (series.length - 1) - p.d;
      const tLabel = ago === 0 ? 'now' : ago < 2 ? '−1d' : ago < 7 ? `−${ago}d` : ago < 14 ? '−1w' : `−${Math.floor(ago / 7)}w`;
      const dir = p.jump > 0 ? 'surged' : 'dropped';
      const pp  = Math.abs(p.jump * 100).toFixed(0);
      return { day: p.d, t: tLabel, headline: `${market.short} probability ${dir} ${pp}pp`, impact: p.jump, src: 'Polymarket' };
    });
}

function _transformBook(data, market) {
  if (!data?.bids?.length || !data?.asks?.length) return buildBookMock(market);
  const map = (arr) => arr.slice(0, 8)
    .map(e => ({ p: parseFloat(e.price), sz: parseFloat(e.size) }))
    .filter(e => e.p > 0 && e.sz > 0);
  const bids = map(data.bids);
  const asks = map(data.asks);
  if (!bids.length || !asks.length) return buildBookMock(market);
  return { bids, asks, mid: (bids[0].p + asks[0].p) / 2 };
}

// ─── Main loader ──────────────────────────────────────────────────────────────

async function loadPolymarketData() {
  // 1 — fetch top active CLOB markets from Gamma
  const raw = await fetch(
    `${GAMMA_API}/markets?active=true&closed=false&limit=20&order=volume24hr&ascending=false`
  ).then(r => { if (!r.ok) throw new Error(`Gamma ${r.status}`); return r.json(); });

  const markets = raw
    .filter(m => m.enableOrderBook && m.conditionId && m.clobTokenIds)
    .slice(0, 8)
    .map(_transformGammaMarket);

  if (!markets.length) throw new Error('No eligible markets returned');

  // 2 — price histories + orderbooks in parallel
  const nowTs   = Math.floor(Date.now() / 1000);
  const startTs = nowTs - 90 * 86400;

  const [histories, books] = await Promise.all([
    Promise.all(markets.map(m =>
      fetch(`${CLOB_API}/prices-history?market=${m.conditionId}&startTs=${startTs}&endTs=${nowTs}&fidelity=60`)
        .then(r => r.json()).then(d => d.history || []).catch(() => [])
    )),
    Promise.all(markets.map(m =>
      m.yesTokenId
        ? fetch(`${CLOB_API}/book?token_id=${m.yesTokenId}`).then(r => r.json()).catch(() => null)
        : Promise.resolve(null)
    )),
  ]);

  // 3 — build derived data
  const seriesMap = {}, bookMap = {}, newsMap = {};
  markets.forEach((m, i) => {
    seriesMap[m.id] = _buildSeriesFromHistory(histories[i], m);
    bookMap[m.id]   = _transformBook(books[i], m);
    newsMap[m.id]   = _detectNewsFromSeries(seriesMap[m.id], m);
  });

  // 4 — overwrite globals so artboards pick up live data on next render
  window.MARKETS          = markets;
  window.NEWS_BY_MARKET   = newsMap;
  window.TICKER_FEED      = markets
    .filter(m => Math.abs(m.delta24) > 0.001)
    .sort((a, b) => Math.abs(b.delta24) - Math.abs(a.delta24))
    .map(m => ({ mkt: m.short, delta: m.delta24, reason: 'market activity', t: 'live' }));

  window._SERIES_MAP = seriesMap;
  window._BOOK_MAP   = bookMap;

  window.buildSeries = (market, days = 90) => window._SERIES_MAP[market.id] || buildSeriesMock(market, days);
  window.buildBook   = (market, depth = 8)  => window._BOOK_MAP[market.id]   || buildBookMock(market, depth);
}

Object.assign(window, {
  MARKETS, buildSeries, NEWS_BY_MARKET, TICKER_FEED, buildBook, mulberry32, loadPolymarketData,
});
