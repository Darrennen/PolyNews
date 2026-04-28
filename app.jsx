// App — wires the three artboards into a Design Canvas.
// On mount, fetches live data from Polymarket APIs before rendering artboards.

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "accent": "warm",
  "density": "comfortable",
  "showLive": true
}/*EDITMODE-END*/;

function App() {
  const [tweaks, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const [dataStatus, setDataStatus] = React.useState('loading'); // 'loading' | 'ready'

  React.useEffect(() => {
    loadPolymarketData()
      .then(() => setDataStatus('ready'))
      .catch((err) => {
        console.warn('[Polymarket] API unavailable — using mock data.', err.message);
        setDataStatus('ready');
      });
  }, []);

  if (dataStatus === 'loading') {
    return (
      <div style={{
        height: '100vh', display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', gap: 12,
        background: '#f0eee9',
      }}>
        <div style={{
          fontFamily: 'JetBrains Mono, monospace', fontSize: 11,
          letterSpacing: 2, color: 'rgba(0,0,0,0.35)', textTransform: 'uppercase',
        }}>
          Fetching live markets…
        </div>
        <div style={{
          width: 160, height: 2, background: 'rgba(0,0,0,0.08)', borderRadius: 2, overflow: 'hidden',
        }}>
          <div style={{
            height: '100%', background: 'rgba(0,0,0,0.3)', borderRadius: 2,
            animation: 'pm-progress 1.4s ease-in-out infinite',
          }} />
        </div>
        <style>{`
          @keyframes pm-progress {
            0%   { width: 0%;   margin-left: 0;    }
            50%  { width: 60%;  margin-left: 20%;  }
            100% { width: 0%;   margin-left: 100%; }
          }
        `}</style>
      </div>
    );
  }

  return (
    <>
      <DesignCanvas>
        <DCSection
          id="probability-tracker"
          title="Probability Tracker · 3 directions"
          subtitle="Real-time market sentiment pulled live from Polymarket (Gamma + CLOB APIs). Each direction commits to a different reading posture."
        >
          <DCArtboard id="editorial" label="A · Editorial Terminal" width={1280} height={900}>
            <Editorial />
          </DCArtboard>
          <DCArtboard id="mission" label="B · Mission Control" width={1440} height={820}>
            <MissionControl />
          </DCArtboard>
          <DCArtboard id="almanac" label="C · Almanac" width={1100} height={820}>
            <Almanac />
          </DCArtboard>
        </DCSection>

        <DCPostIt top={20} left={60} rotate={-2} width={220}>
          Three reading postures: a daily dispatch, a trader's cockpit, a reflective almanac. All three pull live from Polymarket (Gamma + CLOB APIs).
        </DCPostIt>
      </DesignCanvas>

      <TweaksPanel title="Tweaks">
        <TweakSection title="Mood">
          <TweakRadio
            label="Accent"
            value={tweaks.accent}
            onChange={(v) => setTweak('accent', v)}
            options={[
              { value: 'warm', label: 'Warm' },
              { value: 'cool', label: 'Cool' },
              { value: 'mono', label: 'Mono' },
            ]}
          />
          <TweakRadio
            label="Density"
            value={tweaks.density}
            onChange={(v) => setTweak('density', v)}
            options={[
              { value: 'compact', label: 'Compact' },
              { value: 'comfortable', label: 'Comfortable' },
            ]}
          />
          <TweakToggle
            label="Live ticking"
            value={tweaks.showLive}
            onChange={(v) => setTweak('showLive', v)}
          />
        </TweakSection>
        <TweakSection title="About">
          <div style={{ fontSize: 12, color: 'rgba(0,0,0,0.6)', lineHeight: 1.5 }}>
            Click any artboard label to focus it fullscreen. Drag the grip to reorder. Use ←/→ in focus mode.
          </div>
        </TweakSection>
      </TweaksPanel>
    </>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
