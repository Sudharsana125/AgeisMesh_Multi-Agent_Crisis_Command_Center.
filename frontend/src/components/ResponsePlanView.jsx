import { CheckCircle2, Circle, ChevronRight, User, Clock, ShieldCheck, ListChecks, RotateCcw, CheckCheck } from 'lucide-react';
import { useState } from 'react';

const PLAN = {
  immediate: {
    label: 'Immediate Containment',
    timeframe: '0 – 1 Hour',
    phase: 'immediate',
    actions: [
      { id: 'ICA-01', title: 'P1 Crisis Command Bridge Activation', owner: 'Incident Commander (Director of Ops)' },
      { id: 'ICA-02', title: 'Staging Host Network Isolation — IP 10.14.22.8', owner: 'Lead SOC Analyst' },
      { id: 'ICA-03', title: 'Environmental Thermal Stabilization — Pod-4 Zone B', owner: 'Facilities Engineering Lead' },
      { id: 'ICA-04', title: 'BGP Traffic Engineering & Rerouting', owner: 'Principal Network Engineer' },
      { id: 'ICA-05', title: 'Core Payment Gateway Failover to Secondary Region', owner: 'Principal SRE Lead' },
    ],
  },
  short: {
    label: 'Short-Term Mitigation',
    timeframe: '1 – 24 Hours',
    phase: 'short-term',
    actions: [
      { id: 'STM-01', title: 'Forensic Process & Memory Analysis on 10.14.22.8', owner: 'Senior Forensic Investigator' },
      { id: 'STM-02', title: 'Facilities Mechanical Root-Cause Audit (Chiller Unit 3)', owner: 'Facilities Maintenance Director' },
      { id: 'STM-03', title: 'Hardware Thermal Throttling Audit — IPMI/iLO logs', owner: 'Systems Hardware Lead' },
      { id: 'STM-04', title: 'Network Telemetry & NetFlow Ingestion Analysis', owner: 'Network Security Engineer' },
      { id: 'STM-05', title: 'SLA Reconciliation & Stakeholder Executive Briefing', owner: 'Operations Risk Manager' },
    ],
  },
  long: {
    label: 'Long-Term Corrective Actions',
    timeframe: '1 – 30 Days',
    phase: 'long-term',
    actions: [
      { id: 'LTM-01', title: 'HVAC Redundancy & Automation Upgrade', owner: 'Facilities Engineering Director' },
      { id: 'LTM-02', title: 'Network Control-Plane Hardening (CoPP)', owner: 'Principal Network Architect' },
      { id: 'LTM-03', title: 'Staging Infrastructure Zero-Trust Micro-Segmentation', owner: 'CISO / Enterprise Security Lead' },
      { id: 'LTM-04', title: 'Compound Incident Playbook Development', owner: 'Incident Response Architect' },
    ],
  },
};

const ALL_ACTIONS = [
  ...PLAN.immediate.actions,
  ...PLAN.short.actions,
  ...PLAN.long.actions,
];

export default function ResponsePlanView() {
  const [checked, setChecked] = useState({});
  const [filter, setFilter] = useState('all');

  const toggle = (id) => setChecked(s => ({ ...s, [id]: !s[id] }));
  const resolvedCount = Object.values(checked).filter(Boolean).length;
  const progressPct = Math.round((resolvedCount / ALL_ACTIONS.length) * 100);

  const checkAll = () => {
    const all = {};
    ALL_ACTIONS.forEach(a => { all[a.id] = true; });
    setChecked(all);
  };

  const resetAll = () => setChecked({});

  return (
    <div className="card">
      <div className="card-header" style={{ flexWrap: 'wrap', gap: 12 }}>
        <div>
          <span className="card-title">
            <ListChecks size={16} color="var(--primary-light)" />
            Incident Containment & Recovery Action Matrix
          </span>
          <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>
            Track containment tasks across operational bridges, network engineering, and infrastructure recovery teams.
          </p>
        </div>

        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <button className="btn btn-ghost btn-sm" onClick={checkAll} title="Mark all resolved">
            <CheckCheck size={13} />
            <span>Resolve All</span>
          </button>
          <button className="btn btn-ghost btn-sm" onClick={resetAll} title="Reset resolution states">
            <RotateCcw size={13} />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* Progress Bar Header */}
      <div style={{
        background: 'rgba(0, 0, 0, 0.3)',
        borderRadius: 'var(--radius-md)',
        padding: '16px 20px',
        marginBottom: 20,
        border: '1px solid var(--border)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <ShieldCheck size={16} color="var(--primary-light)" />
            <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>
              Overall Incident Remediation Progress
            </span>
          </div>
          <span style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 13,
            fontWeight: 700,
            color: 'var(--primary-light)'
          }}>
            {resolvedCount} / {ALL_ACTIONS.length} Tasks ({progressPct}%)
          </span>
        </div>
        <div style={{
          width: '100%',
          height: 6,
          background: 'rgba(255, 255, 255, 0.08)',
          borderRadius: 3,
          overflow: 'hidden'
        }}>
          <div style={{
            width: `${progressPct}%`,
            height: '100%',
            background: 'var(--primary-gradient)',
            transition: 'width 0.3s ease',
            borderRadius: 3
          }} />
        </div>
      </div>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 20, overflowX: 'auto' }}>
        {[
          { id: 'all', label: 'All Actions' },
          { id: 'immediate', label: 'Immediate (0-1h)' },
          { id: 'short', label: 'Short-Term (1-24h)' },
          { id: 'long', label: 'Long-Term (1-30d)' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setFilter(tab.id)}
            style={{
              padding: '6px 14px',
              borderRadius: 'var(--radius-sm)',
              border: `1px solid ${filter === tab.id ? 'var(--border-hover)' : 'var(--border)'}`,
              background: filter === tab.id ? 'var(--gold-dim)' : 'transparent',
              color: filter === tab.id ? 'var(--primary-light)' : 'var(--text-secondary)',
              fontSize: 12,
              fontWeight: 600,
              cursor: 'pointer',
              whiteSpace: 'nowrap'
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Action Groups */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {(filter === 'all' || filter === 'immediate') && (
          <PhaseGroup group={PLAN.immediate} checked={checked} onToggle={toggle} />
        )}
        {(filter === 'all' || filter === 'short') && (
          <PhaseGroup group={PLAN.short} checked={checked} onToggle={toggle} />
        )}
        {(filter === 'all' || filter === 'long') && (
          <PhaseGroup group={PLAN.long} checked={checked} onToggle={toggle} />
        )}
      </div>
    </div>
  );
}

function PhaseGroup({ group, checked, onToggle }) {
  const done = group.actions.filter(a => checked[a.id]).length;

  return (
    <div style={{
      background: 'rgba(0, 0, 0, 0.25)',
      borderRadius: 'var(--radius-md)',
      padding: '18px',
      border: '1px solid var(--border)'
    }}>
      <div className="phase-header" style={{ marginBottom: 14 }}>
        <div>
          <div className={`phase-label ${group.phase}`}>{group.label}</div>
          <div style={{ fontSize: 11.5, color: 'var(--text-muted)', marginTop: 2, display: 'flex', alignItems: 'center', gap: 5 }}>
            <Clock size={12} /> {group.timeframe}
          </div>
        </div>
        <div style={{
          fontSize: 11, color: 'var(--text-secondary)',
          background: 'rgba(0, 0, 0, 0.35)', padding: '3px 10px',
          borderRadius: 'var(--radius-full)', border: '1px solid var(--border)',
          fontFamily: 'var(--font-mono)', fontWeight: 600
        }}>
          {done}/{group.actions.length} completed
        </div>
      </div>

      {group.actions.map(a => (
        <div key={a.id} className={`action-item ${checked[a.id] ? 'done' : ''}`} onClick={() => onToggle(a.id)}>
          <div className="action-checkbox">
            {checked[a.id] ? <CheckCircle2 size={15} color="#000000" /> : null}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 4 }}>
              <span className="action-id">{a.id}</span>
              <span className="action-title">{a.title}</span>
            </div>
            <div className="action-owner" style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <User size={12} color="var(--text-muted)" /> {a.owner}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
