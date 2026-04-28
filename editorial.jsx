// EDITORIAL TERMINAL v2 — full broadsheet treatment.
// Structure: rule-bordered masthead with weather-style strip,
// 4-column body with kicker / hero headline / byline / drop-cap lead /
// pull quote, hero chart with margin annotations as marginalia, and
// a right-rail "Wire" that reads like a stocks page.

function Editorial() {
  const market = MARKETS[0]; // Fed rate cut
  const series = React.useMemo(() => buildSeries(market), [market.id]);
  const news = NEWS_BY_MARKET[market.id];
  const live = useLive(market.yes, 0.004);
  const tick = useTicker(2);

  const c = {
    bg: '#f1ede4',           // newsprint cream
    paper: '#fbf7ee',
    paperHi: '#fffaf0',
    ink: '#181410',
    body: 'rgba(24,20,16,0.78)',
    dim: 'rgba(24,20,16,0.55)',
    dim2: 'rgba(24,20,16,0.35)',
    rule: 'rgba(24,20,16,0.16)',
    ruleSoft: 'rgba(24,20,16,0.08)',
    up: '#1d6b3a',
    down: '#922424',
    accent: '#a85515',
    gold: '#8a6c1f',
  };

  const Rule = ({ thick = false, double = false, style = {} }) => (
    <div style={{
      borderTop: `${thick ? 2 : 1}px solid ${c.ink}`,
      borderBottom: double ? `1px solid ${c.ink}` : 'none',
      height: double ? 4 : 0,
      ...style,
    }} />
  );

  const Kicker = ({ children, color }) => (
    <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, textTransform: 'uppercase', letterSpacing: 2, color: color || c.accent, fontWeight: 600 }}>{children}</span>
  );

  return (
    <div style={{ width: '100%', height: '100%', background: c.bg, color: c.ink, fontFamily: 'Geist, system-ui, sans-serif', display: 'flex', flexDirection: 'column', overflow: 'hidden', position: 'relative' }}>

      {/* ───── MASTHEAD ───── */}
      <div style={{ padding: '14px 32px 0' }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', paddingBottom: 8 }}>
          <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, color: c.dim, textTransform: 'uppercase', letterSpacing: 1.6, lineHeight: 1.5 }}>
            <div>Tuesday, April 28, 2026</div>
            <div>New York · Established 2024</div>
          </div>
          <div style={{ textAlign: 'center', flex: 1 }}>
            <div style={{ fontFamily: '"Instrument Serif", Georgia, serif', fontSize: 52, lineHeight: 0.95, letterSpacing: -1.2 }}>
              The <span style={{ fontStyle: 'italic' }}>Forecast</span> Daily
            </div>
            <div style={{ fontFamily: '"Instrument Serif", Georgia, serif', fontSize: 12, fontStyle: 'italic', color: c.dim, marginTop: 4, letterSpacing: 0.4 }}>
              "What the crowd believes today, priced to the cent." — Vol. III · No. 184
            </div>
          </div>
          <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, color: c.dim, textTransform: 'uppercase', letterSpacing: 1.6, lineHeight: 1.5, textAlign: 'right' }}>
            <div>Single copy · 25¢</div>
            <div>polymarket.api · live</div>
          </div>
        </div>
        <Rule thick double />
      </div>

      {/* ───── INDEX STRIP (like the page-1 weather/markets strip) ───── */}
      <div style={{ padding: '8px 32px', borderBottom: `1px solid ${c.rule}`, display: 'grid', gridTemplateColumns: 'auto 1fr auto', gap: 24, alignItems: 'center', fontSize: 11 }}>
        <span style={{ fontFamily: 'JetBrains Mono, monospace', color: c.accent, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1.6 }}>Index ·</span>
        <div style={{ display: 'flex', gap: 22, color: c.dim, fontFamily: 'JetBrains Mono, monospace', fontSize: 10, textTransform: 'uppercase', letterSpacing: 1.2, overflow: 'hidden' }}>
          <span><span style={{ color: c.ink }}>Macro</span> ↗ 0.8</span>
          <span><span style={{ color: c.ink }}>Politics</span> ↘ 0.3</span>
          <span><span style={{ color: c.ink }}>Sports</span> ↗ 1.4</span>
          <span><span style={{ color: c.ink }}>Crypto</span> ↘ 0.6</span>
          <span><span style={{ color: c.ink }}>Culture</span> ↗ 0.9</span>
          <span><span style={{ color: c.ink }}>Tech</span> → 0.0</span>
        </div>
        <div style={{ display: 'flex', gap: 16, color: c.dim, alignItems: 'center' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontFamily: 'JetBrains Mono, monospace', fontSize: 10, textTransform: 'uppercase', letterSpacing: 1.2 }}>
            <span style={{ width: 6, height: 6, borderRadius: 3, background: c.up, opacity: tick % 2 ? 1 : 0.4, transition: 'opacity .4s' }} />
            6,231 markets
          </span>
          <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, color: c.ink }}>OI $148.2M</span>
          <span style={{ padding: '3px 8px', border: `1px solid ${c.ink}`, fontFamily: 'JetBrains Mono, monospace', fontSize: 10, color: c.ink, textTransform: 'uppercase', letterSpacing: 1.2 }}>Search ⌘K</span>
        </div>
      </div>

      {/* ───── BODY: 4-column architecture ───── */}
      <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '160px 1fr 360px', minHeight: 0 }}>

        {/* COLUMN 1 · LEFT RAIL — section nav + briefing */}
        <div style={{ borderRight: `1px solid ${c.rule}`, padding: '18px 16px 18px 32px', display: 'flex', flexDirection: 'column', gap: 18, minHeight: 0 }}>
          <div>
            <Kicker>Sections</Kicker>
            <div style={{ marginTop: 8, fontFamily: '"Instrument Serif", Georgia, serif', fontSize: 16, lineHeight: 1.5 }}>
              {[
                ['Macro', true], ['Politics', false], ['Sports', false], ['Crypto', false], ['Culture', false], ['Tech', false], ['Weather', false],
              ].map(([n, on]) => (
                <div key={n} style={{ color: on ? c.ink : c.dim, fontStyle: on ? 'italic' : 'normal', borderBottom: `1px dotted ${c.ruleSoft}`, padding: '4px 0', display: 'flex', justifyContent: 'space-between' }}>
                  <span>{n}</span>
                  {on && <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 9, color: c.accent }}>→</span>}
                </div>
              ))}
            </div>
          </div>

          <div style={{ marginTop: 4 }}>
            <Kicker color={c.gold}>The Briefing</Kicker>
            <div style={{ fontFamily: '"Instrument Serif", Georgia, serif', fontSize: 13, lineHeight: 1.45, color: c.body, marginTop: 8, fontStyle: 'italic' }}>
              Five things the market is pricing this morning, in one breath.
            </div>
            <ol style={{ margin: '10px 0 0', padding: '0 0 0 18px', fontSize: 12, color: c.body, lineHeight: 1.55 }}>
              <li style={{ marginBottom: 6 }}>A <strong style={{ color: c.ink }}>June cut</strong> is back on the table.</li>
              <li style={{ marginBottom: 6 }}>BTC year-end at <strong style={{ color: c.ink }}>$120k</strong> losing steam.</li>
              <li style={{ marginBottom: 6 }}>Real Madrid <strong style={{ color: c.ink }}>opens favorite</strong> on team news.</li>
              <li style={{ marginBottom: 6 }}>"Quiet Hours" surges post-BAFTA.</li>
              <li>NBER recession odds <strong style={{ color: c.ink }}>fade below 20</strong>.</li>
            </ol>
          </div>
        </div>

        {/* COLUMN 2 · LEAD STORY */}
        <div style={{ padding: '18px 28px', borderRight: `1px solid ${c.rule}`, display: 'flex', flexDirection: 'column', minHeight: 0, overflow: 'hidden' }}>
          <Kicker>↗ Top Mover · Macro · Federal Reserve</Kicker>
          <h1 style={{ fontFamily: '"Instrument Serif", Georgia, serif', fontWeight: 400, fontSize: 56, lineHeight: 0.98, letterSpacing: -1.4, margin: '8px 0 4px', textWrap: 'balance' }}>
            Will the Fed cut rates<br/>at the <span style={{ fontStyle: 'italic' }}>June</span> meeting?
          </h1>
          <div style={{ fontFamily: '"Instrument Serif", Georgia, serif', fontSize: 17, fontStyle: 'italic', color: c.dim, lineHeight: 1.35, margin: '6px 0 8px', maxWidth: 640 }}>
            Bettors swung overnight on a Waller op-ed and softer core services CPI; the line now sits at its highest since February.
          </div>
          <div style={{ display: 'flex', gap: 14, fontFamily: 'JetBrains Mono, monospace', fontSize: 10, color: c.dim, textTransform: 'uppercase', letterSpacing: 1.4, paddingBottom: 10, borderBottom: `1px solid ${c.rule}` }}>
            <span>By the Markets Desk</span>
            <span style={{ color: c.dim2 }}>·</span>
            <span>Filed 06:42 ET · Updated {tick}s ago</span>
            <span style={{ color: c.dim2 }}>·</span>
            <span>Resolves Jun 17</span>
          </div>

          {/* Two-column body: drop-cap lead | numbers */}
          <div style={{ marginTop: 12, display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 22, minHeight: 0 }}>
            {/* LEAD with drop cap */}
            <div style={{ fontFamily: '"Instrument Serif", Georgia, serif', fontSize: 14.5, lineHeight: 1.55, color: c.body, columnCount: 1 }}>
              <span style={{ float: 'left', fontFamily: '"Instrument Serif", Georgia, serif', fontSize: 64, lineHeight: 0.85, paddingRight: 8, paddingTop: 4, color: c.ink, fontStyle: 'italic' }}>O</span>
              dds of a quarter-point cut at the June FOMC meeting climbed to <strong style={{ color: c.up, fontFamily: 'JetBrains Mono, monospace', fontStyle: 'normal' }}>{(live * 100).toFixed(1)}¢</strong> in overnight trade — a four-point swing, the largest since the March payrolls revision. The move tracked closely with a Wall Street Journal op-ed by Governor Waller, who argued the case for a cut "had strengthened materially," and a softer-than-expected core services print earlier in the week.
              <div style={{ height: 8 }} />
              Volume on the contract surpassed <strong style={{ color: c.ink, fontFamily: 'JetBrains Mono, monospace', fontStyle: 'normal' }}>$2.1M</strong> in 24 hours. Open interest now stands near a cycle high.
            </div>

            {/* RIGHT STAT BLOCK */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
              <div style={{ background: c.paper, border: `1px solid ${c.rule}`, padding: '14px 16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <Kicker color={c.up}>Yes</Kicker>
                  <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, color: c.up }}>+4.1pp</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginTop: 2 }}>
                  <span style={{ fontFamily: '"Instrument Serif", Georgia, serif', fontSize: 56, lineHeight: 0.95, fontVariantNumeric: 'tabular-nums', letterSpacing: -1.5 }}>{(live * 100).toFixed(1)}</span>
                  <span style={{ fontSize: 18, color: c.dim, fontFamily: '"Instrument Serif", Georgia, serif' }}>¢</span>
                </div>
                <div style={{ height: 4, background: c.ruleSoft, marginTop: 8, position: 'relative' }}>
                  <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: live * 100 + '%', background: c.up }} />
                </div>
              </div>
              <div style={{ background: c.paper, borderLeft: `1px solid ${c.rule}`, borderRight: `1px solid ${c.rule}`, borderBottom: `1px solid ${c.rule}`, padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <Kicker color={c.down}>No</Kicker>
                <span style={{ fontFamily: '"Instrument Serif", Georgia, serif', fontSize: 26, fontVariantNumeric: 'tabular-nums' }}>{((1 - live) * 100).toFixed(1)}<span style={{ fontSize: 12, color: c.dim }}>¢</span></span>
                <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, color: c.down }}>−4.1pp</span>
              </div>

              {/* Compact numbers grid */}
              <div style={{ marginTop: 12, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0, border: `1px solid ${c.rule}`, background: c.paper }}>
                {[
                  ['Vol 24h', '$2.1M'],
                  ['Open Int.', '$12.8M'],
                  ['7d range', '60–69¢'],
                  ['Liquidity', '$2.31M'],
                ].map(([l, v], i) => (
                  <div key={l} style={{ padding: '10px 12px', borderRight: i % 2 === 0 ? `1px solid ${c.rule}` : 'none', borderBottom: i < 2 ? `1px solid ${c.rule}` : 'none' }}>
                    <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 9, color: c.dim, textTransform: 'uppercase', letterSpacing: 1.4 }}>{l}</div>
                    <div style={{ fontFamily: '"Instrument Serif", Georgia, serif', fontSize: 18, fontVariantNumeric: 'tabular-nums', marginTop: 2 }}>{v}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Pull quote */}
          <div style={{ borderTop: `1px solid ${c.ink}`, borderBottom: `1px solid ${c.ink}`, padding: '12px 0', margin: '14px 0 14px', textAlign: 'center' }}>
            <div style={{ fontFamily: '"Instrument Serif", Georgia, serif', fontSize: 22, fontStyle: 'italic', lineHeight: 1.25, color: c.ink, letterSpacing: -0.2 }}>
              "The case for a June cut has strengthened materially."
            </div>
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 9, color: c.dim, textTransform: 'uppercase', letterSpacing: 1.6, marginTop: 6 }}>
              — Gov. Waller, op-ed · cited <strong style={{ color: c.up }}>+5.0pp</strong>
            </div>
          </div>

          {/* Hero chart with marginalia */}
          <div style={{ position: 'relative', flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 8 }}>
              <Kicker>Implied Probability · 90 Days</Kicker>
              <div style={{ display: 'flex', gap: 0, fontSize: 10, fontFamily: 'JetBrains Mono, monospace' }}>
                {['1D', '1W', '1M', '3M', 'ALL'].map((r, i) => (
                  <span key={r} style={{ padding: '3px 9px', borderTop: `1px solid ${c.rule}`, borderBottom: `1px solid ${c.rule}`, borderLeft: i === 0 ? `1px solid ${c.rule}` : 'none', borderRight: `1px solid ${c.rule}`, color: i === 2 ? c.paper : c.dim, background: i === 2 ? c.ink : 'transparent', cursor: 'pointer', textTransform: 'uppercase', letterSpacing: 1 }}>{r}</span>
                ))}
              </div>
            </div>
            <div style={{ position: 'relative', flex: 1, minHeight: 220 }}>
              <ProbChart market={market} series={series} news={news} variant="editorial" width={680} height={230} />
              {/* Margin annotations — newspaper marginalia style */}
              <div style={{ position: 'absolute', top: 6, left: 130, fontFamily: '"Instrument Serif", Georgia, serif', fontSize: 11, fontStyle: 'italic', color: c.dim, lineHeight: 1.3, maxWidth: 130 }}>
                <span style={{ fontFamily: 'JetBrains Mono, monospace', fontStyle: 'normal', color: c.down, fontSize: 9, marginRight: 3 }}>1.</span>
                Powell signals patience at Jackson Hole
              </div>
              <div style={{ position: 'absolute', top: 100, left: 320, fontFamily: '"Instrument Serif", Georgia, serif', fontSize: 11, fontStyle: 'italic', color: c.dim, lineHeight: 1.3, maxWidth: 130, textAlign: 'center' }}>
                <span style={{ fontFamily: 'JetBrains Mono, monospace', fontStyle: 'normal', color: c.up, fontSize: 9, marginRight: 3 }}>2.</span>
                CPI prints 0.1pp soft on services
              </div>
              <div style={{ position: 'absolute', top: 6, right: 8, fontFamily: '"Instrument Serif", Georgia, serif', fontSize: 11, fontStyle: 'italic', color: c.dim, lineHeight: 1.3, maxWidth: 110, textAlign: 'right' }}>
                <span style={{ fontFamily: 'JetBrains Mono, monospace', fontStyle: 'normal', color: c.up, fontSize: 9, marginRight: 3 }}>3.</span>
                Waller op-ed lands
              </div>
            </div>
          </div>
        </div>

        {/* COLUMN 3 · RIGHT RAIL — The Wire + Watching */}
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: 0 }}>
          {/* The Wire */}
          <div style={{ padding: '18px 24px 12px', borderBottom: `1px solid ${c.rule}` }}>
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 2 }}>
              <span style={{ fontFamily: '"Instrument Serif", Georgia, serif', fontSize: 22, fontStyle: 'italic', letterSpacing: -0.3 }}>The Wire</span>
              <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 9, color: c.dim, textTransform: 'uppercase', letterSpacing: 1.4, display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                <span style={{ width: 6, height: 6, borderRadius: 3, background: c.up, opacity: tick % 2 ? 1 : 0.5, transition: 'opacity .4s' }} />
                Live shifts
              </span>
            </div>
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 9, color: c.dim2, textTransform: 'uppercase', letterSpacing: 1.4, marginBottom: 8 }}>Updated continuously · Streaming via CLOB</div>

            {TICKER_FEED.slice(0, 6).map((t, i) => (
              <div key={i} style={{ display: 'grid', gridTemplateColumns: '32px 56px 1fr', columnGap: 8, padding: '7px 0', borderBottom: i < 5 ? `1px dotted ${c.rule}` : 'none', alignItems: 'baseline' }}>
                <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, color: c.dim }}>{t.t}</span>
                <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: t.delta >= 0 ? c.up : c.down, fontWeight: 600 }}>{fmtPp(t.delta)}</span>
                <div>
                  <div style={{ fontFamily: '"Instrument Serif", Georgia, serif', fontSize: 14, color: c.ink, lineHeight: 1.2 }}>{t.mkt}</div>
                  <div style={{ fontSize: 10, color: c.dim, fontStyle: 'italic', marginTop: 1 }}>{t.reason}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Watching */}
          <div style={{ padding: '14px 24px 8px', flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 8 }}>
              <span style={{ fontFamily: '"Instrument Serif", Georgia, serif', fontSize: 18, fontStyle: 'italic', letterSpacing: -0.2 }}>On the Watchlist</span>
              <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 9, color: c.dim, textTransform: 'uppercase', letterSpacing: 1.4 }}>4 markets</span>
            </div>
            {MARKETS.slice(1, 5).map((m, idx) => {
              const lv = useLive(m.yes, 0.002);
              const up = m.delta24 >= 0;
              return (
                <div key={m.id} style={{ padding: '8px 0', borderBottom: idx < 3 ? `1px solid ${c.ruleSoft}` : 'none' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 8 }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <Kicker color={c.dim}>{m.cat}</Kicker>
                      <div style={{ fontFamily: '"Instrument Serif", Georgia, serif', fontSize: 14, lineHeight: 1.2, marginTop: 2, color: c.ink }}>{m.short}</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontFamily: '"Instrument Serif", Georgia, serif', fontSize: 24, lineHeight: 1, fontVariantNumeric: 'tabular-nums', letterSpacing: -0.4 }}>{(lv * 100).toFixed(0)}<span style={{ fontSize: 11, color: c.dim }}>¢</span></div>
                      <div style={{ fontSize: 10, fontFamily: 'JetBrains Mono, monospace', color: up ? c.up : c.down, marginTop: 1, fontWeight: 600 }}>{fmtPp(m.delta24)}</div>
                    </div>
                  </div>
                  <div style={{ marginTop: 4 }}>
                    <MiniSpark seed={m.seed} target={m.yes} up={up ? c.up : c.down} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ───── FOOTER ───── */}
      <div style={{ borderTop: `2px solid ${c.ink}`, padding: '8px 32px', display: 'flex', justifyContent: 'space-between', fontSize: 10, fontFamily: 'JetBrains Mono, monospace', color: c.dim, textTransform: 'uppercase', letterSpacing: 1.4, background: c.bg }}>
        <span>Streaming · 14ms · CLOB</span>
        <span>Sources · Gamma · CLOB · Data API · BLS · BAFTA · WSJ</span>
        <span>Page 01 of 06 · Continued p.02 →</span>
      </div>
    </div>
  );
}

function MiniSpark({ seed, target, up }) {
  const series = React.useMemo(() => {
    const r = mulberry32(seed); const out = []; let v = target - 0.1 + r() * 0.2;
    for (let i = 0; i < 40; i++) { v += (target - v) * 0.06 + (r() - 0.5) * 0.04; v = Math.max(0.05, Math.min(0.95, v)); out.push(v); }
    out[out.length - 1] = target;
    return out;
  }, [seed, target]);
  const w = 280, h = 22;
  const path = series.map((v, i) => `${i ? 'L' : 'M'}${(i / (series.length - 1)) * w},${(1 - v) * h}`).join(' ');
  return (
    <svg width="100%" height={h} viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none">
      <path d={path} fill="none" stroke={up} strokeWidth="1.2" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
}

Object.assign(window, { Editorial, MiniSpark });
