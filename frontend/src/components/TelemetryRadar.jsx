import { useEffect, useState } from 'react';
import { api } from '../services/api';
import { Radio, Activity, AlertTriangle, Cpu, ArrowUpRight, Gauge } from 'lucide-react';

export default function TelemetryRadar() {
  const [signals, setSignals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getTelemetry()
      .then(d => setSignals(d.signals))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="card">
      <div className="card-header">
        <span className="card-title"><Radio size={16} /> Live Telemetry Feed</span>
      </div>
      <div className="loading-state">
        <div className="spinner" />
        <span>Synthesizing multi-modal telemetry streams…</span>
      </div>
    </div>
  );

  return (
    <div className="card">
      <div className="card-header">
        <span className="card-title">
          <Activity size={16} color="var(--primary-light)" />
          Live Telemetry & Anomaly Radar
        </span>
        <span style={{ fontSize: 11.5, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 6 }}>
          <span className="status-dot online" />
          {signals.length} Monitored Vectors Active
        </span>
      </div>
      <div className="signal-grid">
        {signals.map(sig => (
          <div key={sig.id} className={`signal-card ${sig.severity}`}>
            <div className="signal-header">
              <div className="signal-source">{sig.source}</div>
              <span className={`signal-status ${sig.status}`}>{sig.status}</span>
            </div>
            <div className="signal-metric">{sig.metric}</div>
            <div className="signal-value">{sig.value}</div>
            <div className="signal-delta">
              <span style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>{sig.temp}</span>
              &nbsp;·&nbsp;
              <span>{sig.delta}</span>
            </div>
            <div className="signal-alert">
              <AlertTriangle size={13} style={{ display: 'inline', marginRight: 5, verticalAlign: '-2px' }} />
              {sig.alert}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
