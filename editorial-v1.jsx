// EDITORIAL TERMINAL — serif headlines, warm cream background, news feed
// dominant. Probability shifts read like dispatches; the chart is annotated
// with inline newspaper-style callouts.

function Editorial() {
  const market = MARKETS[0]; // Fed rate cut
  const series = React.useMemo(() => buildSeries(market), [market.id]);
  const news = NEWS_BY_MARKET[market.id];
  const live = useLive(market.yes, 0.004);
  const tick = useTicker(2);

  const c = {
    bg: '#f4f1ea',
    surface: '#fbf8f1',
    ink: '#1a1612',
    dim: 'rgba(26,22,18,0.55)',
    rule: 'rgba(26,22,18,0.12)',
    up: '#0f6b3e',
    down: '#9a2a2a',
    accent: '#b8651b',
  };

  return (
    <div style={{ width: '100%', height: '100%', background: c.bg, color: c.ink, fontFamily: 'Geist, system-ui, sans-serif', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      {/* Masthead */}
      <div style={{ padding: '18px 28px 14px', borderBottom: `1px solid ${c.rule}`, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
        <div>
          <div style={{ fontFamily: '"Instrument Serif", Georgia, serif', fontSize: 30, lineHeight: 1, letterSpacing: -0.5 }}>The <span style={{ fontStyle: 'italic' }}>Forecast</span> Daily</div>
          <div style={{ fontSize: 11, color: c.dim, marginTop: 6, fontFamily: 'JetBrains Mono, monospace', textTransform: 'uppercase', letterSpacing: 1 }}>Vol. III · No. 184 · Tuesday, April 28, 2026 · Live</div>
        </div>
        <div style={{ display: 'flex', gap: 18, fontSize: 12, color: c.dim }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            <span style={{ width: 6, height: 6, borderRadius: 3, background: c.up, opacity: tick % 2 ? 1 : 0.4, transition: 'opacity .4s' }} />
            6,231 markets
          </span>
          <span>$148.2M open interest</span>
          <span style={{ color: c.ink }}>Search ⌘K</span>
        </div>
      </div>

      {/* Lead column */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', flex: 1, minHeight: 0 }}>
        {/* LEFT: lead story */}
        <div style={{ padding: '22px 28px', borderRight: `1px solid ${c.rule}`, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 11, fontFamily: 'JetBrains Mono, monospace', color: c.accent, textTransform: 'uppercase', letterSpacing: 1.4 }}>
            <span>↗ Top Mover · Macro</span>
            <span style={{ width: 4, height: 4, borderRadius: 2, background: c.dim }} />
            <span style={{ color: c.dim }}>Closes Jun 17</span>
          </div>
          <h1 style={{ fontFamily: '"Instrument Serif", Georgia, serif', fontWeight: 400, fontSize: 36, lineHeight: 1.05, letterSpacing: -0.6, margin: '10px 0 4px' }}>
            Will the Fed cut rates at the <span style={{ fontStyle: 'italic' }}>June</span> meeting?
          </h1>
          <p style={{ fontSize: 13, color: c.dim, margin: '0 0 14px', maxWidth: 560, lineHeight: 1.5 }}>
            Market-implied odds rose <strong style={{ color: c.up }}>+4.1pp</strong> overnight on a Waller op-ed and softer-than-expected core services CPI. Resolution: target rate range cut by ≥25bps at the FOMC June statement.
          </p>

          {/* Big YES/NO row */}
          <div style={{ display: 'flex', gap: 14, marginBottom: 16, alignItems: 'stretch' }}>
            <div style={{ flex: 1, background: c.surface, border: `1px solid ${c.rule}`, padding: '14px 16px' }}>
              <div style={{ fontSize: 11, fontFamily: 'JetBrains Mono, monospace', color: c.up, textTransform: 'uppercase', letterSpacing: 1 }}>Yes</div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginTop: 4 }}>
                <span style={{ fontFamily: '"Instrument Serif", Georgia, serif', fontSize: 44, lineHeight: 1, color: c.ink, fontVariantNumeric: 'tabular-nums' }}>{(live * 100).toFixed(1)}</span>
                <span style={{ fontSize: 16, color: c.dim }}>¢</span>
                <span style={{ fontSize: 12, color: c.up, fontFamily: 'JetBrains Mono, monospace' }}>+4.1pp</span>
              </div>
            </div>
            <div style={{ flex: 1, background: c.surface, border: `1px solid ${c.rule}`, padding: '14px 16px' }}>
              <div style={{ fontSize: 11, fontFamily: 'JetBrains Mono, monospace', color: c.down, textTransform: 'uppercase', letterSpacing: 1 }}>No</div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginTop: 4 }}>
                <span style={{ fontFamily: '"Instrument Serif", Georgia, serif', fontSize: 44, lineHeight: 1, color: c.ink, fontVariantNumeric: 'tabular-nums' }}>{((1 - live) * 100).toFixed(1)}</span>
                <span style={{ fontSize: 16, color: c.dim }}>¢</span>
                <span style={{ fontSize: 12, color: c.down, fontFamily: 'JetBrains Mono, monospace' }}>−4.1pp</span>
              </div>
            </div>
            <div style={{ width: 130, background: c.ink, color: c.surface, padding: '14px 16px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div style={{ fontSize: 11, fontFamily: 'JetBrains Mono, monospace', textTransform: 'uppercase', letterSpacing: 1, opacity: 0.7 }}>Volume 24h</div>
              <div>
                <div style={{ fontFamily: '"Instrument Serif", Georgia, serif', fontSize: 24, lineHeight: 1 }}>$2.1M</div>
                <div style={{ fontSize: 10, opacity: 0.6, marginTop: 2, fontFamily: 'JetBrains Mono, monospace' }}>OI $12.8M</div>
              </div>
            </div>
          </div>

          {/* Annotated chart */}
          <div style={{ position: 'relative', background: c.surface, border: `1px solid ${c.rule}`, padding: '18px 16px 8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
              <div style={{ fontSize: 11, fontFamily: 'JetBrains Mono, monospace', color: c.dim, textTransform: 'uppercase', letterSpacing: 1 }}>Implied Probability · 90 Days</div>
              <div style={{ display: 'flex', gap: 4, fontSize: 10, fontFamily: 'JetBrains Mono, monospace', color: c.dim }}>
                {['1D', '1W', '1M', '3M', 'ALL'].map((r, i) => (
                  <span key={r} style={{ padding: '2px 6px', border: `1px solid ${i === 2 ? c.ink : 'transparent'}`, color: i === 2 ? c.ink : c.dim, cursor: 'pointer' }}>{r}</span>
                ))}
              </div>
            </div>
            <ProbChart market={market} series={series} news={news} variant="editorial" width={560} height={170} />
            {/* Inline annotations */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginTop: 8, fontSize: 11, lineHeight: 1.4 }}>
              {news.map((n, i) => (
                <div key={i} style={{ borderTop: `1px solid ${c.rule}`, paddingTop: 6 }}>
                  <div style={{ display: 'flex', gap: 6, fontFamily: 'JetBrains Mono, monospace', fontSize: 10, color: n.impact >= 0 ? c.up : c.down }}>
                    <span>{i + 1}.</span><span>{fmtPp(n.impact)}</span><span style={{ color: c.dim }}>· {n.t}</span>
                  </div>
                  <div style={{ fontFamily: '"Instrument Serif", Georgia, serif', fontSize: 13, color: c.ink, marginTop: 2, fontStyle: i === 1 ? 'italic' : 'normal' }}>{n.headline}</div>
                  <div style={{ fontSize: 10, color: c.dim, marginTop: 2 }}>{n.src}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT: ticker + related */}
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: 0 }}>
          {/* Live ticker */}
          <div style={{ padding: '16px 20px 8px', borderBottom: `1px solid ${c.rule}` }}>
            <div style={{ fontSize: 11, fontFamily: 'JetBrains Mono, monospace', color: c.dim, textTransform: 'uppercase', letterSpacing: 1, display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <span style={{ width: 6, height: 6, borderRadius: 3, background: c.up, opacity: tick % 2 ? 1 : 0.5, transition: 'opacity .4s' }} />
              The Wire · live shifts
            </div>
            {TICKER_FEED.slice(0, 6).map((t, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'baseline', gap: 8, padding: '6px 0', borderBottom: i < 5 ? `1px dotted ${c.rule}` : 'none', fontSize: 12 }}>
                <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, color: c.dim, width: 28 }}>{t.t}</span>
                <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: t.delta >= 0 ? c.up : c.down, width: 50 }}>{fmtPp(t.delta)}</span>
                <span style={{ fontFamily: '"Instrument Serif", Georgia, serif', fontSize: 14, color: c.ink, flex: 1, lineHeight: 1.2 }}>{t.mkt}</span>
                <span style={{ fontSize: 10, color: c.dim, fontStyle: 'italic' }}>{t.reason}</span>
              </div>
            ))}
          </div>

          {/* Other markets */}
          <div style={{ padding: '14px 20px', flex: 1, overflow: 'hidden' }}>
            <div style={{ fontSize: 11, fontFamily: 'JetBrains Mono, monospace', color: c.dim, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10 }}>Watching</div>
            {MARKETS.slice(1, 5).map((m) => {
              const lv = useLive(m.yes, 0.002);
              return (
                <div key={m.id} style={{ padding: '10px 0', borderBottom: `1px solid ${c.rule}` }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 8 }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 10, color: c.dim, fontFamily: 'JetBrains Mono, monospace', textTransform: 'uppercase', letterSpacing: 0.8 }}>{m.cat}</div>
                      <div style={{ fontFamily: '"Instrument Serif", Georgia, serif', fontSize: 15, lineHeight: 1.2, marginTop: 2, color: c.ink }}>{m.short}</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontFamily: '"Instrument Serif", Georgia, serif', fontSize: 22, lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>{(lv * 100).toFixed(0)}<span style={{ fontSize: 12, color: c.dim }}>¢</span></div>
                      <div style={{ fontSize: 10, fontFamily: 'JetBrains Mono, monospace', color: m.delta24 >= 0 ? c.up : c.down, marginTop: 2 }}>{fmtPp(m.delta24)}</div>
                    </div>
                  </div>
                  {/* mini sparkline */}
                  <div style={{ marginTop: 6 }}>
                    <MiniSpark seed={m.seed} target={m.yes} up={m.delta24 >= 0 ? c.up : c.down} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Footer status */}
      <div style={{ padding: '8px 28px', borderTop: `1px solid ${c.rule}`, display: 'flex', justifyContent: 'space-between', fontSize: 10, fontFamily: 'JetBrains Mono, monospace', color: c.dim, textTransform: 'uppercase', letterSpacing: 1 }}>
        <span>Streaming · 14ms</span>
        <span>CLOB · Gamma · Data API</span>
        <span>Last update {tick}s ago</span>
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
  const w = 280, h = 24;
  const path = series.map((v, i) => `${i ? 'L' : 'M'}${(i / (series.length - 1)) * w},${(1 - v) * h}`).join(' ');
  return (
    <svg width="100%" height={h} viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none">
      <path d={path} fill="none" stroke={up} strokeWidth="1.2" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
}

Object.assign(window, { Editorial, MiniSpark });
