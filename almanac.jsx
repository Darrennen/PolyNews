// ALMANAC — light, generous, chart-as-hero. Designed for a slower, more
// reflective read. Single big timeline with major event annotations
// rendered as captions; sparse data; "regret meter" novel element.

function Almanac() {
  const market = MARKETS[3]; // Best Picture
  const series = React.useMemo(() => buildSeries(market), [market.id]);
  const news = NEWS_BY_MARKET[market.id];
  const live = useLive(market.yes, 0.003);
  const tick = useTicker(2);

  const c = {
    bg: '#faf8f3',
    surface: '#ffffff',
    ink: '#2c2620',
    dim: 'rgba(44,38,32,0.55)',
    dim2: 'rgba(44,38,32,0.3)',
    rule: 'rgba(44,38,32,0.1)',
    up: '#2f5d3a',
    down: '#8a2828',
    accent: '#a8631c',
  };

  // Regret meter — how much the market has moved against a hypothetical
  // YES position taken 90 days ago, with a marker for the current position.
  const entry = series[0].v;
  const regret = (live - entry); // pp move

  return (
    <div style={{ width: '100%', height: '100%', background: c.bg, color: c.ink, fontFamily: 'Geist, system-ui, sans-serif', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      {/* Header */}
      <div style={{ padding: '24px 36px 16px', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', borderBottom: `1px solid ${c.rule}` }}>
        <div>
          <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, color: c.accent, textTransform: 'uppercase', letterSpacing: 2.4 }}>Almanac · Culture · 2027 Awards</div>
          <h1 style={{ fontFamily: '"Instrument Serif", Georgia, serif', fontWeight: 400, fontSize: 44, lineHeight: 1.0, letterSpacing: -1, margin: '8px 0 0', maxWidth: 720 }}>
            Will <span style={{ fontStyle: 'italic' }}>The Quiet Hours</span> take Best Picture?
          </h1>
        </div>
        <div style={{ display: 'flex', gap: 24, fontSize: 11, color: c.dim, fontFamily: 'JetBrains Mono, monospace', textTransform: 'uppercase', letterSpacing: 1.4 }}>
          <span>Resolves Mar 7, 2027</span>
          <span>·</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ width: 6, height: 6, borderRadius: 3, background: c.up, opacity: tick % 2 ? 1 : 0.4, transition: 'opacity .4s' }} />
            Live
          </span>
        </div>
      </div>

      {/* Hero number */}
      <div style={{ padding: '32px 36px 16px', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 32, borderBottom: `1px solid ${c.rule}` }}>
        <div>
          <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, color: c.dim, textTransform: 'uppercase', letterSpacing: 1.6 }}>Implied probability</div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginTop: 8 }}>
            <span style={{ fontFamily: '"Instrument Serif", Georgia, serif', fontSize: 88, lineHeight: 0.9, letterSpacing: -2, fontVariantNumeric: 'tabular-nums' }}>{(live * 100).toFixed(1)}</span>
            <span style={{ fontFamily: '"Instrument Serif", Georgia, serif', fontSize: 32, color: c.dim }}>%</span>
          </div>
          <div style={{ marginTop: 4, fontSize: 13, color: c.up, fontFamily: 'JetBrains Mono, monospace' }}>+6.0pp · 24h · BAFTA win</div>
        </div>
        <div>
          <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, color: c.dim, textTransform: 'uppercase', letterSpacing: 1.6 }}>Regret meter <span style={{ color: c.dim2 }}>· vs. 90d ago</span></div>
          <div style={{ marginTop: 16 }}>
            <RegretBar entry={entry} current={live} c={c} />
          </div>
          <div style={{ marginTop: 10, fontSize: 12, color: c.dim, lineHeight: 1.45 }}>
            A YES bet placed 90 days ago at <strong style={{ color: c.ink }}>{(entry * 100).toFixed(0)}¢</strong> would now be up <strong style={{ color: c.up }}>{(regret * 100).toFixed(1)}pp</strong>.
          </div>
        </div>
        <div>
          <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, color: c.dim, textTransform: 'uppercase', letterSpacing: 1.6 }}>Field</div>
          <div style={{ marginTop: 8 }}>
            {[
              { name: 'The Quiet Hours', v: live, lead: true },
              { name: 'After the Fire', v: 0.21 },
              { name: 'A Borrowed Light', v: 0.16 },
              { name: 'Other (8)', v: 0.32 },
            ].map((row) => (
              <div key={row.name} style={{ display: 'flex', alignItems: 'baseline', gap: 8, padding: '4px 0' }}>
                <span style={{ flex: 1, fontFamily: '"Instrument Serif", Georgia, serif', fontSize: 14, color: row.lead ? c.ink : c.dim, fontStyle: row.lead ? 'normal' : 'italic' }}>{row.name}</span>
                <div style={{ width: 70, height: 4, background: c.rule, position: 'relative' }}>
                  <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: row.v * 100 + '%', background: row.lead ? c.ink : c.dim2 }} />
                </div>
                <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: c.ink, width: 38, textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>{(row.v * 100).toFixed(0)}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Hero chart with editorial annotations */}
      <div style={{ flex: 1, padding: '20px 36px 8px', minHeight: 0, position: 'relative' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
          <div style={{ fontFamily: '"Instrument Serif", Georgia, serif', fontSize: 22, fontStyle: 'italic' }}>Three months of doubt and turn</div>
          <div style={{ fontSize: 10, fontFamily: 'JetBrains Mono, monospace', color: c.dim, textTransform: 'uppercase', letterSpacing: 1.4 }}>Jan 28 → Apr 28</div>
        </div>
        <div style={{ marginTop: 12, position: 'relative' }}>
          <ProbChart market={market} series={series} news={news} variant="almanac" width={780} height={200} />
          {/* Inline editorial captions placed around the chart */}
          <Caption x={130} y={-10} c={c} num="1">
            NYFCC sweep — early consensus forms.
          </Caption>
          <Caption x={360} y={70} c={c} num="2" align="right">
            PGA splits; momentum cools and the line gives back four points.
          </Caption>
          <Caption x={620} y={-10} c={c} num="3">
            BAFTA win — the line jumps overnight.
          </Caption>
        </div>
      </div>

      {/* Footer: notable shifts ledger */}
      <div style={{ padding: '14px 36px 18px', borderTop: `1px solid ${c.rule}` }}>
        <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, color: c.dim, textTransform: 'uppercase', letterSpacing: 1.4, marginBottom: 8 }}>Ledger of notable shifts</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
          {news.map((n, i) => (
            <div key={i} style={{ display: 'flex', gap: 12 }}>
              <div style={{ fontFamily: '"Instrument Serif", Georgia, serif', fontSize: 28, color: c.accent, lineHeight: 1, fontStyle: 'italic' }}>{i + 1}.</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, color: n.impact >= 0 ? c.up : c.down, textTransform: 'uppercase', letterSpacing: 1.2 }}>{fmtPp(n.impact)} · {n.t}</div>
                <div style={{ fontFamily: '"Instrument Serif", Georgia, serif', fontSize: 14, lineHeight: 1.3, marginTop: 2, color: c.ink }}>{n.headline}</div>
                <div style={{ fontSize: 10, color: c.dim, marginTop: 3, fontFamily: 'JetBrains Mono, monospace' }}>{n.src}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Caption({ x, y, c, num, align = 'left', children }) {
  return (
    <div style={{
      position: 'absolute', left: x, top: y, maxWidth: 180, fontSize: 11, lineHeight: 1.4,
      color: c.ink, fontFamily: '"Instrument Serif", Georgia, serif', fontStyle: 'italic',
      textAlign: align,
    }}>
      <span style={{ fontFamily: 'JetBrains Mono, monospace', fontStyle: 'normal', fontSize: 10, color: c.accent, marginRight: 4 }}>{num}.</span>
      {children}
    </div>
  );
}

function RegretBar({ entry, current, c }) {
  const min = 0, max = 1;
  const pos = (v) => ((v - min) / (max - min)) * 100;
  const up = current >= entry;
  return (
    <div>
      <div style={{ position: 'relative', height: 32 }}>
        {/* axis */}
        <div style={{ position: 'absolute', left: 0, right: 0, top: 16, height: 1, background: c.rule }} />
        {/* fill between entry and current */}
        <div style={{
          position: 'absolute', top: 13, height: 7,
          left: pos(Math.min(entry, current)) + '%', width: Math.abs(pos(current) - pos(entry)) + '%',
          background: up ? c.up : c.down, opacity: 0.25,
        }} />
        {/* entry tick */}
        <div style={{ position: 'absolute', left: pos(entry) + '%', top: 8, transform: 'translateX(-50%)', width: 1, height: 16, background: c.dim }} />
        <div style={{ position: 'absolute', left: pos(entry) + '%', top: 26, transform: 'translateX(-50%)', fontFamily: 'JetBrains Mono, monospace', fontSize: 9, color: c.dim, whiteSpace: 'nowrap' }}>entry {(entry * 100).toFixed(0)}</div>
        {/* current */}
        <div style={{ position: 'absolute', left: pos(current) + '%', top: 8, transform: 'translateX(-50%)', width: 3, height: 16, background: up ? c.up : c.down }} />
        <div style={{ position: 'absolute', left: pos(current) + '%', top: 26, transform: 'translateX(-50%)', fontFamily: 'JetBrains Mono, monospace', fontSize: 9, color: up ? c.up : c.down, whiteSpace: 'nowrap', fontWeight: 600 }}>now {(current * 100).toFixed(0)}</div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'JetBrains Mono, monospace', fontSize: 9, color: c.dim2, marginTop: 24 }}>
        <span>0¢</span><span>50¢</span><span>100¢</span>
      </div>
    </div>
  );
}

Object.assign(window, { Almanac });
