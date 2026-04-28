// MISSION CONTROL — dark, dense, multi-panel trader UI. Mono-forward.
// Orderbook + chart + position sizer + live event log. Probability is just
// one signal among many — feels like a Bloomberg-meets-trading-floor view.

function MissionControl() {
  const market = MARKETS[1]; // BTC > $120k
  const series = React.useMemo(() => buildSeries(market), [market.id]);
  const news = NEWS_BY_MARKET[market.id];
  const book = React.useMemo(() => buildBook(market), [market.id]);
  const live = useLive(market.yes, 0.005);
  const tick = useTicker(2);

  const c = {
    bg: '#0a0d0c',
    panel: '#11161a',
    panelHi: '#161b20',
    rule: 'rgba(255,255,255,0.06)',
    txt: '#e8e6e0',
    dim: 'rgba(232,230,224,0.45)',
    dim2: 'rgba(232,230,224,0.28)',
    up: '#39d98a',
    down: '#ff5d5d',
    accent: '#ffb84d',
    blue: '#5db3ff',
  };

  const Panel = ({ title, right, children, style = {} }) => (
    <div style={{ background: c.panel, border: `1px solid ${c.rule}`, display: 'flex', flexDirection: 'column', minHeight: 0, ...style }}>
      <div style={{ padding: '7px 10px', borderBottom: `1px solid ${c.rule}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontFamily: 'JetBrains Mono, monospace', fontSize: 10, textTransform: 'uppercase', letterSpacing: 1.5, color: c.dim }}>
        <span>{title}</span>
        {right && <span>{right}</span>}
      </div>
      <div style={{ flex: 1, minHeight: 0, overflow: 'hidden' }}>{children}</div>
    </div>
  );

  return (
    <div style={{ width: '100%', height: '100%', background: c.bg, color: c.txt, fontFamily: 'Geist, system-ui, sans-serif', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      {/* Top status bar */}
      <div style={{ height: 28, borderBottom: `1px solid ${c.rule}`, display: 'flex', alignItems: 'center', padding: '0 12px', gap: 18, fontFamily: 'JetBrains Mono, monospace', fontSize: 10, color: c.dim, textTransform: 'uppercase', letterSpacing: 1.2 }}>
        <span style={{ color: c.accent, fontWeight: 600 }}>◉ MCTL</span>
        <span><span style={{ color: c.up }}>●</span> CLOB 14ms</span>
        <span><span style={{ color: c.up }}>●</span> Gamma 22ms</span>
        <span><span style={{ color: c.up }}>●</span> Data 18ms</span>
        <span style={{ flex: 1 }} />
        <span>P&L 24h <span style={{ color: c.up }}>+$1,284.40</span></span>
        <span>EQ $48,210</span>
        <span>UTC 14:22:{String(tick % 60).padStart(2, '0')}</span>
      </div>

      {/* Symbol / header strip */}
      <div style={{ padding: '12px 14px', borderBottom: `1px solid ${c.rule}`, display: 'flex', alignItems: 'center', gap: 16 }}>
        <div>
          <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, color: c.dim, textTransform: 'uppercase', letterSpacing: 1.2 }}>{market.cat} · {market.id.toUpperCase()}</div>
          <div style={{ fontSize: 14, marginTop: 2, color: c.txt }}>{market.q}</div>
        </div>
        <div style={{ flex: 1 }} />
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, color: c.dim, textTransform: 'uppercase', letterSpacing: 1.2 }}>YES</div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginTop: 2 }}>
            <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 28, color: c.up, fontVariantNumeric: 'tabular-nums', fontWeight: 600 }}>{(live * 100).toFixed(2)}¢</span>
            <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 12, color: c.down }}>{fmtPp(market.delta24)}</span>
          </div>
        </div>
        <div style={{ width: 1, height: 38, background: c.rule }} />
        <Stat label="VOL 24H" v="$8.2M" />
        <Stat label="OI" v="$8.2M" />
        <Stat label="LIQ" v="$1.4M" />
        <Stat label="HIGH" v="46.1¢" />
        <Stat label="LOW" v="38.8¢" />
      </div>

      {/* Main grid */}
      <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1.7fr 0.85fr 1fr', gap: 1, background: c.rule, minHeight: 0 }}>
        {/* Chart panel */}
        <Panel title="Implied Probability · 90D" right={<span>YES · ¢ · UTC</span>} style={{ background: c.bg }}>
          <div style={{ padding: 12, height: '100%', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', gap: 6, marginBottom: 8, fontFamily: 'JetBrains Mono, monospace', fontSize: 10 }}>
              {['1H', '1D', '1W', '1M', '3M', 'ALL'].map((r, i) => (
                <span key={r} style={{ padding: '3px 8px', background: i === 4 ? c.panelHi : 'transparent', color: i === 4 ? c.txt : c.dim, border: `1px solid ${i === 4 ? c.rule : 'transparent'}`, cursor: 'pointer' }}>{r}</span>
              ))}
              <span style={{ flex: 1 }} />
              <span style={{ color: c.dim }}>annot</span>
              <span style={{ color: c.txt }}>news</span>
              <span style={{ color: c.dim }}>orders</span>
              <span style={{ color: c.dim }}>vol</span>
            </div>
            <div style={{ flex: 1, minHeight: 0 }}>
              <ProbChart market={market} series={series} news={news} variant="mission" width={420} height={220} />
            </div>
            {/* news rail */}
            <div style={{ marginTop: 6, borderTop: `1px solid ${c.rule}`, paddingTop: 8, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
              {news.map((n, i) => (
                <div key={i} style={{ fontSize: 10, lineHeight: 1.35 }}>
                  <div style={{ fontFamily: 'JetBrains Mono, monospace', color: n.impact >= 0 ? c.up : c.down, fontSize: 9 }}>{i + 1} · {fmtPp(n.impact)} · {n.t}</div>
                  <div style={{ color: c.txt, marginTop: 2 }}>{n.headline}</div>
                </div>
              ))}
            </div>
          </div>
        </Panel>

        {/* Orderbook */}
        <Panel title="Order Book · YES" right={<span>{((book.asks[0].p - book.bids[0].p) * 100).toFixed(1)}¢ spread</span>}>
          <OrderBook book={book} variant="mission" height="100%" />
        </Panel>

        {/* Right column: trade ticket + log */}
        <div style={{ display: 'grid', gridTemplateRows: 'auto 1fr', gap: 1, background: c.rule, minHeight: 0 }}>
          <Panel title="Ticket">
            <div style={{ padding: 12, fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: c.txt }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6, marginBottom: 8 }}>
                <button style={{ padding: '8px', background: 'rgba(57,217,138,0.12)', color: c.up, border: `1px solid ${c.up}`, fontFamily: 'inherit', fontSize: 11, letterSpacing: 1, cursor: 'pointer', fontWeight: 600 }}>BUY YES</button>
                <button style={{ padding: '8px', background: 'transparent', color: c.dim, border: `1px solid ${c.rule}`, fontFamily: 'inherit', fontSize: 11, letterSpacing: 1, cursor: 'pointer' }}>BUY NO</button>
              </div>
              <Field label="Type" v="LIMIT" />
              <Field label="Price" v={`${(live * 100).toFixed(1)}¢`} c={c.up} />
              <Field label="Size" v="2,500" />
              <Field label="Total" v={`$${(live * 2500).toFixed(0)}`} />
              <Field label="Slippage" v="0.4%" c={c.dim} />
              <Field label="If filled" v="+$1,062" c={c.up} />
              <button style={{ width: '100%', marginTop: 10, padding: '10px', background: c.up, color: '#021107', border: 'none', fontFamily: 'inherit', fontSize: 11, letterSpacing: 1.4, cursor: 'pointer', fontWeight: 700 }}>SUBMIT · ⌘↵</button>
            </div>
          </Panel>
          <Panel title="Event Log" right={<span>live</span>}>
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, padding: '6px 10px', overflowY: 'auto', height: '100%', lineHeight: 1.6 }}>
              {[
                { t: '14:22:18', tag: 'TRADE', col: c.txt, msg: 'BUY 1,200 @ 42.1¢ · taker' },
                { t: '14:22:16', tag: 'BOOK', col: c.dim, msg: 'ask 42.4 → 42.5 · 18.2k' },
                { t: '14:22:14', tag: 'NEWS', col: c.accent, msg: 'Treasury floats stablecoin clarification' },
                { t: '14:22:09', tag: 'TRADE', col: c.txt, msg: 'SELL 800 @ 42.0¢ · taker' },
                { t: '14:21:58', tag: 'PRICE', col: c.down, msg: 'YES −0.8pp on heavy ask flow' },
                { t: '14:21:42', tag: 'BOOK', col: c.dim, msg: 'bid 41.8 cancelled · 12.0k' },
                { t: '14:21:31', tag: 'TRADE', col: c.txt, msg: 'BUY 3,400 @ 42.3¢ · maker' },
                { t: '14:21:14', tag: 'ALERT', col: c.blue, msg: 'BTC spot ↘ −0.4% (Coinbase)' },
                { t: '14:21:02', tag: 'TRADE', col: c.txt, msg: 'SELL 2,100 @ 42.1¢' },
                { t: '14:20:48', tag: 'PRICE', col: c.up, msg: 'YES +1.2pp · ETF inflow tape' },
                { t: '14:20:31', tag: 'BOOK', col: c.dim, msg: 'ask 42.6 added · 22.0k' },
                { t: '14:20:14', tag: 'TRADE', col: c.txt, msg: 'BUY 600 @ 42.2¢' },
              ].map((row, i) => (
                <div key={i} style={{ display: 'flex', gap: 8 }}>
                  <span style={{ color: c.dim2 }}>{row.t}</span>
                  <span style={{ color: row.col, width: 44 }}>{row.tag}</span>
                  <span style={{ color: c.txt, opacity: row.tag === 'BOOK' ? 0.7 : 1 }}>{row.msg}</span>
                </div>
              ))}
            </div>
          </Panel>
        </div>
      </div>

      {/* Bottom: positions strip */}
      <div style={{ height: 80, borderTop: `1px solid ${c.rule}`, padding: '8px 14px', display: 'flex', gap: 14, alignItems: 'center', overflow: 'hidden' }}>
        <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, textTransform: 'uppercase', letterSpacing: 1.2, color: c.dim, writingMode: 'vertical-rl', transform: 'rotate(180deg)', alignSelf: 'stretch', display: 'flex', alignItems: 'center' }}>POSITIONS · 4</div>
        {MARKETS.slice(0, 4).map((m) => {
          const lv = useLive(m.yes, 0.002);
          const up = m.delta24 >= 0;
          return (
            <div key={m.id} style={{ flex: 1, background: c.panel, border: `1px solid ${c.rule}`, padding: '8px 10px', minWidth: 0 }}>
              <div style={{ fontSize: 10, fontFamily: 'JetBrains Mono, monospace', color: c.dim, textTransform: 'uppercase', letterSpacing: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{m.short}</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginTop: 4 }}>
                <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 16, color: c.txt, fontWeight: 600 }}>{(lv * 100).toFixed(1)}¢</span>
                <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, color: up ? c.up : c.down }}>{fmtPp(m.delta24)}</span>
              </div>
              <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 9, color: c.dim, marginTop: 2 }}>YES 1.2k · ${(lv * 1200).toFixed(0)}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function Stat({ label, v }) {
  return (
    <div>
      <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 9, color: 'rgba(232,230,224,0.45)', textTransform: 'uppercase', letterSpacing: 1.2 }}>{label}</div>
      <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 13, color: '#e8e6e0', marginTop: 2, fontVariantNumeric: 'tabular-nums' }}>{v}</div>
    </div>
  );
}

function Field({ label, v, c }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
      <span style={{ color: 'rgba(232,230,224,0.45)', textTransform: 'uppercase', fontSize: 10, letterSpacing: 1.2 }}>{label}</span>
      <span style={{ color: c || '#e8e6e0' }}>{v}</span>
    </div>
  );
}

Object.assign(window, { MissionControl });
