import { useState, useEffect } from 'react';
import { ShieldAlert, Clock, Play, Sparkles, Palette } from 'lucide-react';

function SlaTimer({ minutes }) {
  const [secs, setSecs] = useState(minutes * 60);
  useEffect(() => {
    if (secs <= 0) return;
    const t = setInterval(() => setSecs(s => s - 1), 1000);
    return () => clearInterval(t);
  }, []);
  const m = Math.floor(secs / 60).toString().padStart(2, '0');
  const s = (secs % 60).toString().padStart(2, '0');
  return (
    <div className="sla-timer">
      <Clock size={13} color="var(--red)" />
      <span className="sla-label">SLA Breach</span>
      <span className="sla-value">{m}:{s}</span>
    </div>
  );
}

const THEMES = [
  { id: 'amber', name: 'Sunset Amber', pillClass: 'amber-pill' },
  { id: 'amethyst', name: 'Royal Amethyst', pillClass: 'amethyst-pill' },
  { id: 'titanium', name: 'Titanium Stealth', pillClass: 'titanium-pill' },
  { id: 'crimson', name: 'Crimson Ember', pillClass: 'crimson-pill' },
];

export default function Header({ status, onKickoff }) {
  const [theme, setTheme] = useState(() => localStorage.getItem('aegis_theme') || 'amber');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('aegis_theme', theme);
  }, [theme]);

  return (
    <header className="site-header">
      <div className="header-inner">
        <div className="header-brand">
          <div className="brand-icon">
            <ShieldAlert size={22} color="#000000" />
          </div>
          <div>
            <div className="brand-name">AEGISMESH</div>
            <div className="brand-sub">Autonomous Crisis Command</div>
          </div>
        </div>

        <div className="header-center">
          <span className="severity-badge p1">
            <span className="status-dot critical" />
            P1 CRITICAL
          </span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--text-secondary)' }}>
            INC-2026-8942
          </span>
          <SlaTimer minutes={45} />
        </div>

        <div className="header-right">
          {/* Theme Palette Switcher */}
          <div className="theme-switcher" title="Switch Theme Palette">
            <Palette size={13} color="var(--text-muted)" style={{ marginRight: 2 }} />
            {THEMES.map(t => (
              <button
                key={t.id}
                className={`theme-pill ${t.pillClass} ${theme === t.id ? 'active' : ''}`}
                onClick={() => setTheme(t.id)}
                title={t.name}
              />
            ))}
          </div>

          {status && (
            <span className="severity-badge online">
              <span className="status-dot online" />
              API Connected
            </span>
          )}
          <button className="btn btn-primary btn-sm" onClick={onKickoff}>
            <Sparkles size={14} />
            <span>Launch Crew</span>
          </button>
        </div>
      </div>
    </header>
  );
}
