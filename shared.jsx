// Shared primitives used across all 3 artboards: SVG sparkline/probability
// chart with news annotations, orderbook ladder, ticker, formatters.

const fmtPct = (v, d = 0) => (v * 100).toFixed(d) + '%';
const fmtPp = (v) => (v >= 0 ? '+' : '') + (v * 100).toFixed(1) + 'pp';
const fmtMoney = (v) => {
  if (v >= 1e9) return '$' + (v / 1e9).toFixed(1) + 'B';
  if (v >= 1e6) return '$' + (v / 1e6).toFixed(1) + 'M';
  if (v >= 1e3) return '$' + (v / 1e3).toFixed(0) + 'k';
  return '$' + v.toFixed(0);
};

// useTicker — drives a 1Hz pulse so live numbers wiggle a touch. Uses a
// shared timer so we don't fork N independent setIntervals.
function useTicker(hz = 1) {
  const [t, setT] = React.useState(0);
  React.useEffect(() => {
    const id = setInterval(() => setT((x) => x + 1), 1000 / hz);
    return () => clearInterval(id);
  }, [hz]);
  return t;
}

// Tiny live-jitter — adds a deterministic-ish sub-bp wobble to a base value
// so YES prices feel like they're streaming. Capped tightly.
function useLive(base, ampl = 0.003) {
  const t = useTicker(2);
  const j = Math.sin(t * 0.7 + base * 17) * ampl + Math.cos(t * 0.31 + base * 31) * ampl * 0.4;
  return Math.max(0.001, Math.min(0.999, base + j));
}

// ProbChart — main probability timeline.
//   variant: 'editorial' (warm cream, serif annotations)
//          | 'mission'   (dark grid, mono labels)
//          | 'almanac'   (light, hero-scale, big annotations)
function ProbChart({ market, series, news, width = 600, height = 220, variant = 'editorial', theme }) {
  const pad = { l: 36, r: 16, t: 18, b: 22 };
  const w = width - pad.l - pad.r;
  const h = height - pad.t - pad.b;
  const days = series.length;
  const x = (d) => pad.l + (d / (days - 1)) * w;
  const y = (v) => pad.t + (1 - v) * h;

  const path = series.map((p, i) => `${i ? 'L' : 'M'}${x(p.d).toFixed(1)},${y(p.v).toFixed(1)}`).join(' ');
  const areaPath = path + ` L${x(series[series.length - 1].d).toFixed(1)},${y(0).toFixed(1)} L${x(0).toFixed(1)},${y(0).toFixed(1)} Z`;

  const palette = {
    editorial: { line: '#1a1612', area: 'rgba(26,22,18,0.07)', grid: 'rgba(26,22,18,0.08)', txt: 'rgba(26,22,18,0.55)', up: '#0f6b3e', down: '#9a2a2a', annot: '#1a1612' },
    mission:   { line: '#39d98a', area: 'rgba(57,217,138,0.10)', grid: 'rgba(255,255,255,0.06)', txt: 'rgba(255,255,255,0.45)', up: '#39d98a', down: '#ff5d5d', annot: '#e8e6e0' },
    almanac:   { line: '#2c2620', area: 'rgba(44,38,32,0.05)', grid: 'rgba(44,38,32,0.06)', txt: 'rgba(44,38,32,0.5)', up: '#2f5d3a', down: '#8a2828', annot: '#2c2620' },
  }[variant];

  // y gridlines at 25/50/75
  const grid = [0.25, 0.5, 0.75];

  return (
    <svg width={width} height={height} style={{ display: 'block', overflow: 'visible' }}>
      {/* gridlines */}
      {grid.map((g) => (
        <g key={g}>
          <line x1={pad.l} x2={pad.l + w} y1={y(g)} y2={y(g)} stroke={palette.grid} strokeDasharray={g === 0.5 ? '0' : '2 4'} />
          <text x={pad.l - 6} y={y(g) + 3} fontSize="10" textAnchor="end" fill={palette.txt} style={{ fontFamily: 'JetBrains Mono, monospace' }}>{Math.round(g * 100)}</text>
        </g>
      ))}
      {/* area + line */}
      <path d={areaPath} fill={palette.area} />
      <path d={path} fill="none" stroke={palette.line} strokeWidth={variant === 'almanac' ? 2 : 1.5} strokeLinejoin="round" strokeLinecap="round" />

      {/* news markers */}
      {news.map((n, i) => {
        const sx = x(n.day);
        const sy = y(series[n.day].v);
        const up = n.impact >= 0;
        const col = up ? palette.up : palette.down;
        return (
          <g key={i}>
            <line x1={sx} x2={sx} y1={sy} y2={pad.t} stroke={col} strokeOpacity="0.18" strokeDasharray="2 3" />
            <circle cx={sx} cy={sy} r="3.5" fill={variant === 'mission' ? '#0f1410' : '#fff'} stroke={col} strokeWidth="1.5" />
          </g>
        );
      })}

      {/* current value pin */}
      <circle cx={x(days - 1)} cy={y(series[series.length - 1].v)} r="4" fill={palette.line} />
      <circle cx={x(days - 1)} cy={y(series[series.length - 1].v)} r="9" fill={palette.line} fillOpacity="0.15" />

      {/* x labels */}
      <text x={pad.l} y={height - 4} fontSize="10" fill={palette.txt} style={{ fontFamily: 'JetBrains Mono, monospace' }}>−90d</text>
      <text x={pad.l + w} y={height - 4} fontSize="10" textAnchor="end" fill={palette.txt} style={{ fontFamily: 'JetBrains Mono, monospace' }}>now</text>
    </svg>
  );
}

// Orderbook ladder. Variant maps to palette.
function OrderBook({ book, variant = 'editorial', height = 180, compact = false }) {
  const palette = {
    editorial: { yes: '#0f6b3e', no: '#9a2a2a', txt: '#1a1612', dim: 'rgba(26,22,18,0.5)', row: 'rgba(26,22,18,0.04)' },
    mission:   { yes: '#39d98a', no: '#ff5d5d', txt: '#e8e6e0', dim: 'rgba(232,230,224,0.45)', row: 'rgba(255,255,255,0.04)' },
    almanac:   { yes: '#2f5d3a', no: '#8a2828', txt: '#2c2620', dim: 'rgba(44,38,32,0.5)', row: 'rgba(44,38,32,0.03)' },
  }[variant];
  const maxSz = Math.max(...book.bids.map((b) => b.sz), ...book.asks.map((a) => a.sz));
  const rows = compact ? 5 : 7;
  const Row = ({ p, sz, side }) => {
    const pct = (sz / maxSz) * 100;
    const col = side === 'bid' ? palette.yes : palette.no;
    return (
      <div style={{ position: 'relative', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', fontFamily: 'JetBrains Mono, monospace', fontSize: 11, padding: '3px 8px', color: palette.txt }}>
        <div style={{ position: 'absolute', top: 0, bottom: 0, [side === 'bid' ? 'right' : 'left']: '50%', width: pct / 2 + '%', background: col, opacity: 0.10 }} />
        <div style={{ color: col, fontWeight: 500, position: 'relative' }}>{(p * 100).toFixed(1)}¢</div>
        <div style={{ textAlign: 'center', position: 'relative', color: palette.dim }}>{sz.toLocaleString()}</div>
        <div style={{ textAlign: 'right', position: 'relative', color: palette.dim }}>{(sz * p / 100).toFixed(0)}</div>
      </div>
    );
  };
  return (
    <div style={{ height }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', fontFamily: 'JetBrains Mono, monospace', fontSize: 10, padding: '4px 8px', color: palette.dim, textTransform: 'uppercase', letterSpacing: 0.5 }}>
        <div>Price</div><div style={{ textAlign: 'center' }}>Size</div><div style={{ textAlign: 'right' }}>$</div>
      </div>
      {book.asks.slice(0, rows).reverse().map((a, i) => <Row key={'a' + i} {...a} side="ask" />)}
      <div style={{ borderTop: `1px solid ${palette.row}`, borderBottom: `1px solid ${palette.row}`, padding: '4px 8px', fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: palette.txt, display: 'flex', justifyContent: 'space-between' }}>
        <span style={{ color: palette.dim }}>spread</span>
        <span>{((book.asks[0].p - book.bids[0].p) * 100).toFixed(1)}¢</span>
      </div>
      {book.bids.slice(0, rows).map((b, i) => <Row key={'b' + i} {...b} side="bid" />)}
    </div>
  );
}

Object.assign(window, { fmtPct, fmtPp, fmtMoney, useTicker, useLive, ProbChart, OrderBook });
