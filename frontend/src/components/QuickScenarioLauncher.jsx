import { useState } from 'react';
import { SCENARIO_PRESETS } from '../services/scenarios';
import { Play, Sparkles, SlidersHorizontal, AlertTriangle, ShieldCheck, Zap } from 'lucide-react';
import { api } from '../services/api';

export default function QuickScenarioLauncher({ onJobStarted, onCustomClick, activeJob }) {
  const [loadingPreset, setLoadingPreset] = useState(null);
  const [error, setError] = useState(null);

  const handleLaunchPreset = async (preset) => {
    if (activeJob && activeJob.status === 'running') return;
    setLoadingPreset(preset.id);
    setError(null);
    try {
      const job = await api.kickoff(preset.data);
      onJobStarted(job);
    } catch (err) {
      setError(err.message || 'Failed to trigger crew');
    } finally {
      setLoadingPreset(null);
    }
  };

  return (
    <div className="card" style={{ marginBottom: 24, border: '1px solid var(--border-hover)' }}>
      <div className="card-header">
        <span className="card-title">
          <Zap size={16} color="var(--primary-light)" />
          Quick Crisis Simulation Scenarios
        </span>
        <button className="btn btn-ghost btn-sm" onClick={onCustomClick}>
          <SlidersHorizontal size={13} />
          <span>Custom Incident Parameters</span>
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 16 }}>
        {SCENARIO_PRESETS.map(p => {
          const isLoading = loadingPreset === p.id;
          const isRunning = activeJob && activeJob.status === 'running';

          return (
            <div
              key={p.id}
              style={{
                background: 'rgba(0, 0, 0, 0.3)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-md)',
                padding: '16px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                transition: 'all 0.2s ease',
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <span style={{
                    fontSize: 10.5,
                    fontFamily: 'var(--font-mono)',
                    fontWeight: 700,
                    padding: '2px 8px',
                    borderRadius: 'var(--radius-full)',
                    background: p.severity === 'critical' ? 'var(--red-dim)' : 'var(--gold-dim)',
                    color: p.severity === 'critical' ? '#fecdd3' : 'var(--primary-light)',
                    border: `1px solid ${p.severity === 'critical' ? 'rgba(244, 63, 94, 0.4)' : 'rgba(245, 158, 11, 0.4)'}`
                  }}>
                    {p.badge}
                  </span>
                  <span style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                    {p.data.incident_id}
                  </span>
                </div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 6 }}>
                  {p.title}
                </div>
                <div style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: 14 }}>
                  {p.description}
                </div>
              </div>

              <button
                className="btn btn-primary btn-sm"
                style={{ width: '100%' }}
                disabled={isLoading || isRunning}
                onClick={() => handleLaunchPreset(p)}
              >
                {isLoading ? (
                  <>
                    <div className="spinner" />
                    <span>Dispatching Crew…</span>
                  </>
                ) : (
                  <>
                    <Play size={13} />
                    <span>Simulate Incident</span>
                  </>
                )}
              </button>
            </div>
          );
        })}
      </div>

      {error && (
        <div className="job-banner failed" style={{ marginTop: 14, marginBottom: 0 }}>
          <AlertTriangle size={15} />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
