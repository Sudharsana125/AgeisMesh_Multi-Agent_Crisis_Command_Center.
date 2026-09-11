import { useState } from 'react';
import { X, Play, Loader, Sparkles, AlertCircle, Bookmark } from 'lucide-react';
import { api } from '../services/api';
import { SCENARIO_PRESETS } from '../services/scenarios';

export default function IncidentTriggerModal({ onClose, onJobStarted }) {
  const [selectedPresetId, setSelectedPresetId] = useState(SCENARIO_PRESETS[0].id);
  const [form, setForm] = useState(SCENARIO_PRESETS[0].data);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSelectPreset = (preset) => {
    setSelectedPresetId(preset.id);
    setForm(preset.data);
  };

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const job = await api.kickoff(form);
      onJobStarted(job);
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to trigger investigation');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="modal-backdrop" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal-box">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <div className="modal-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Sparkles size={18} color="var(--primary-light)" />
            <span>Launch Multi-Agent Crisis Investigation</span>
          </div>
          <button className="btn btn-ghost btn-icon btn-sm" onClick={onClose}><X size={16} /></button>
        </div>

        {/* Preset Selector Chips */}
        <div style={{ marginBottom: 20 }}>
          <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Bookmark size={12} />
            <span>Scenario Template Presets</span>
          </label>
          <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 4 }}>
            {SCENARIO_PRESETS.map(p => (
              <button
                key={p.id}
                type="button"
                onClick={() => handleSelectPreset(p)}
                style={{
                  padding: '7px 12px',
                  borderRadius: 'var(--radius-sm)',
                  border: `1px solid ${selectedPresetId === p.id ? 'var(--border-active)' : 'var(--border)'}`,
                  background: selectedPresetId === p.id ? 'var(--gold-dim)' : 'rgba(0, 0, 0, 0.3)',
                  color: selectedPresetId === p.id ? 'var(--primary-light)' : 'var(--text-secondary)',
                  fontSize: 11.5,
                  fontWeight: 600,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.15s ease'
                }}
              >
                {p.title.split(' ')[0]} {p.title.split(' ')[1]}
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid-2" style={{ gap: 14 }}>
            <div className="form-field">
              <label className="form-label">Incident Identifier</label>
              <input className="form-input" value={form.incident_id} onChange={e => set('incident_id', e.target.value)} />
            </div>
            <div className="form-field">
              <label className="form-label">Organization Context</label>
              <input className="form-input" value={form.organization_name} onChange={e => set('organization_name', e.target.value)} />
            </div>
          </div>

          <div className="form-field">
            <label className="form-label">Infrastructure Environment</label>
            <input className="form-input" value={form.environment_context} onChange={e => set('environment_context', e.target.value)} />
          </div>

          <div className="form-field">
            <label className="form-label">Escalation Severity & Threshold</label>
            <input className="form-input" value={form.escalation_threshold} onChange={e => set('escalation_threshold', e.target.value)} />
          </div>

          <div className="form-field">
            <label className="form-label">Multi-Modal Telemetry & Raw Incident Signals</label>
            <textarea
              className="form-textarea"
              value={form.raw_signals}
              onChange={e => set('raw_signals', e.target.value)}
              rows={5}
            />
          </div>

          {error && (
            <div className="job-banner failed" style={{ marginBottom: 16 }}>
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          <div className="modal-actions">
            <button type="button" className="btn btn-ghost" onClick={onClose} disabled={loading}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? (
                <>
                  <div className="spinner" />
                  <span>Dispatching Swarm…</span>
                </>
              ) : (
                <>
                  <Play size={14} />
                  <span>Kickoff 12-Agent Swarm</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
