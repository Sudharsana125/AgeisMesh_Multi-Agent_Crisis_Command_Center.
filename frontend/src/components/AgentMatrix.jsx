import { useEffect, useState } from 'react';
import { api } from '../services/api';
import {
  Bot,
  Shield,
  Activity,
  Cpu,
  Sparkles,
  Search,
  Layers,
  ChevronDown,
  ChevronUp,
  Award,
  Zap,
  Radio,
  Lock,
  Server,
  Wifi,
  GitMerge,
  FileCheck
} from 'lucide-react';

const PHASES = [
  {
    phase: 1,
    title: 'Phase 1: Incident Detection & Triage',
    description: 'Initial signal correlation, severity classification, and cross-team bridge activation.',
    agentIds: ['crisis_detection_triage_commander']
  },
  {
    phase: 2,
    title: 'Phase 2: Multi-Domain Deep-Dive Forensics',
    description: 'Autonomous parallel investigation across telemetry, facilities, network, cybersecurity, and financial risk.',
    agentIds: [
      'sensor_data_time_series_pattern_specialist',
      'physical_infrastructure_facilities_forensics_specialist',
      'network_connectivity_forensics_specialist',
      'cybersecurity_threat_behavioral_analysis_specialist',
      'operational_risk_business_impact_analyst'
    ]
  },
  {
    phase: 3,
    title: 'Phase 3: Cross-Domain Causal Synthesis & Simulation',
    description: 'Adversarial hypothesis validation, counter-evidence analysis, and consequence trajectory simulation.',
    agentIds: [
      'cross_domain_evidence_synthesis_causal_reasoning_specialist',
      'incident_scenario_modeling_consequence_simulation_specialist',
      'hypothesis_challenger_investigation_quality_enforcer'
    ]
  },
  {
    phase: 4,
    title: 'Phase 4: Root Cause & Causal Chain Reconstruction',
    description: 'Unambiguous timeline synthesis from root trigger to compound cascading impact.',
    agentIds: ['root_cause_analysis_causal_chain_reconstruction_specialist']
  },
  {
    phase: 5,
    title: 'Phase 5: Command Authority & Recovery Architecture',
    description: 'Executive decisioning, mitigation prioritization, and long-term architectural remediation.',
    agentIds: [
      'crisis_command_authority_final_decision_maker',
      'incident_response_planning_recovery_architecture_specialist'
    ]
  }
];

function AgentCard({ agent, expanded, onToggle }) {
  return (
    <div className="agent-card" style={{ cursor: 'pointer' }} onClick={onToggle}>
      <div>
        <div className="agent-card-header">
          <span className="agent-domain-badge">{agent.domain}</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span className="status-dot ready" />
            <span style={{ fontSize: 10, color: 'var(--primary-light)', fontWeight: 700, letterSpacing: '0.05em' }}>ONLINE</span>
          </div>
        </div>
        <div className="agent-role">{agent.role}</div>
        <div className="agent-goal" style={{ WebkitLineClamp: expanded ? 'unset' : 3 }}>
          {agent.goal}
        </div>

        {expanded && agent.backstory && (
          <div style={{
            marginTop: 12,
            padding: 10,
            background: 'rgba(0,0,0,0.35)',
            borderRadius: 'var(--radius-sm)',
            borderLeft: '2px solid var(--primary)',
            fontSize: 11.5,
            color: 'var(--text-secondary)',
            lineHeight: 1.5
          }}>
            <strong>Backstory & Capabilities:</strong>
            <p style={{ marginTop: 4 }}>{agent.backstory}</p>
          </div>
        )}
      </div>

      <div className="agent-footer">
        <span className="agent-badge">#{agent.badge}</span>
        <span style={{ fontSize: 11, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 4 }}>
          {expanded ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
          {expanded ? 'Collapse' : 'Inspect'}
        </span>
      </div>
    </div>
  );
}

export default function AgentMatrix() {
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [expandedAgent, setExpandedAgent] = useState(null);

  useEffect(() => {
    api.getAgents()
      .then(setAgents)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const toggleAgent = (id) => {
    setExpandedAgent(curr => curr === id ? null : id);
  };

  const agentMap = {};
  agents.forEach(a => { agentMap[a.id] = a; });

  const filteredAgents = agents.filter(a =>
    a.role.toLowerCase().includes(search.toLowerCase()) ||
    a.domain.toLowerCase().includes(search.toLowerCase()) ||
    a.badge.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return (
    <div className="card">
      <div className="card-header">
        <span className="card-title"><Bot size={16} /> Multi-Agent Crisis Swarm</span>
      </div>
      <div className="loading-state">
        <div className="spinner" />
        <span>Initializing Agent Swarm Matrix…</span>
      </div>
    </div>
  );

  return (
    <div className="card">
      <div className="card-header" style={{ flexWrap: 'wrap', gap: 12 }}>
        <div>
          <span className="card-title">
            <Bot size={16} color="var(--primary-light)" />
            Multi-Agent Investigation Pipeline (12 Autonomous Specialists)
          </span>
          <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>
            Click any agent to inspect its reasoning capability, persona backstory, and specialized operational domain.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ position: 'relative', minWidth: 200 }}>
            <Search size={13} color="var(--text-muted)" style={{ position: 'absolute', left: 10, top: 11 }} />
            <input
              type="text"
              placeholder="Search specialists…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="form-input"
              style={{ paddingLeft: 30, paddingRight: 10, paddingTop: 6, paddingBottom: 6, fontSize: 12 }}
            />
          </div>
          <span style={{
            fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--primary-light)',
            background: 'var(--gold-dim)', padding: '4px 12px', borderRadius: 'var(--radius-full)',
            border: '1px solid var(--border-hover)', fontWeight: 600, whiteSpace: 'nowrap'
          }}>
            {agents.length} Agents Ready
          </span>
        </div>
      </div>

      {search ? (
        <div className="agent-grid" style={{ marginTop: 16 }}>
          {filteredAgents.map(a => (
            <AgentCard
              key={a.id}
              agent={a}
              expanded={expandedAgent === a.id}
              onToggle={() => toggleAgent(a.id)}
            />
          ))}
          {filteredAgents.length === 0 && (
            <div className="empty-state" style={{ gridColumn: '1 / -1' }}>
              <p>No agents matching "{search}"</p>
            </div>
          )}
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24, marginTop: 8 }}>
          {PHASES.map(p => {
            const phaseAgents = p.agentIds.map(id => agentMap[id]).filter(Boolean);
            if (phaseAgents.length === 0) return null;

            return (
              <div
                key={p.phase}
                style={{
                  background: 'rgba(0, 0, 0, 0.2)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-md)',
                  padding: '18px',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
                  <div>
                    <div style={{ fontFamily: 'var(--font-display)', fontSize: 13.5, fontWeight: 700, color: 'var(--primary-light)' }}>
                      {p.title}
                    </div>
                    <div style={{ fontSize: 11.5, color: 'var(--text-muted)', marginTop: 2 }}>
                      {p.description}
                    </div>
                  </div>
                  <span style={{
                    fontSize: 10.5,
                    fontFamily: 'var(--font-mono)',
                    color: 'var(--text-secondary)',
                    background: 'rgba(255, 255, 255, 0.05)',
                    padding: '2px 8px',
                    borderRadius: 'var(--radius-xs)',
                    border: '1px solid var(--border)'
                  }}>
                    {phaseAgents.length} Agents
                  </span>
                </div>

                <div className="agent-grid">
                  {phaseAgents.map(a => (
                    <AgentCard
                      key={a.id}
                      agent={a}
                      expanded={expandedAgent === a.id}
                      onToggle={() => toggleAgent(a.id)}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
