import { useState, useEffect, useRef } from 'react';
import './index.css';
import Header from './components/Header';
import AgentMatrix from './components/AgentMatrix';
import TelemetryRadar from './components/TelemetryRadar';
import ResponsePlanView from './components/ResponsePlanView';
import ReportViewer from './components/ReportViewer';
import IncidentTriggerModal from './components/IncidentTriggerModal';
import QuickScenarioLauncher from './components/QuickScenarioLauncher';
import { api } from './services/api';
import {
  LayoutDashboard,
  Bot,
  Radio,
  ListChecks,
  FileText,
  AlertTriangle,
  Cpu,
  Layers,
  Sparkles,
  Zap
} from 'lucide-react';

const TABS = [
  { id: 'overview',  label: 'Command Matrix', icon: LayoutDashboard },
  { id: 'agents',    label: 'Agent Swarm', icon: Bot },
  { id: 'telemetry', label: 'Live Telemetry', icon: Radio },
  { id: 'plan',      label: 'Containment Plan', icon: ListChecks },
  { id: 'report',    label: 'Synthesis Report', icon: FileText },
];

export default function App() {
  const [tab, setTab] = useState('overview');
  const [status, setStatus] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [activeJob, setActiveJob] = useState(null);
  const [reportRefresh, setReportRefresh] = useState(0);
  const pollRef = useRef(null);

  useEffect(() => {
    api.getStatus().then(setStatus).catch(() => {});
  }, []);

  // Poll active job
  useEffect(() => {
    if (!activeJob || activeJob.status === 'completed' || activeJob.status === 'failed') return;
    pollRef.current = setInterval(async () => {
      try {
        const job = await api.getJob(activeJob.id);
        setActiveJob(job);
        if (job.status === 'completed') {
          setReportRefresh(r => r + 1);
          clearInterval(pollRef.current);
        }
        if (job.status === 'failed') clearInterval(pollRef.current);
      } catch {}
    }, 2500);
    return () => clearInterval(pollRef.current);
  }, [activeJob?.id, activeJob?.status]);

  const handleJobStarted = (job) => {
    setActiveJob(job);
    setTab('report');
  };

  return (
    <div className="app-shell">
      <Header status={status} onKickoff={() => setShowModal(true)} />

      <main className="main-content">
        {/* Status Bar */}
        {status && (
          <div className="stat-row" style={{ marginBottom: 24 }}>
            <div className="stat-box">
              <div className="stat-label">Active Incident</div>
              <div className="stat-value" style={{ fontSize: 15, fontFamily: 'var(--font-mono)' }}>
                {status.active_incident}
              </div>
            </div>
            <div className="stat-box">
              <div className="stat-label">Threat Severity</div>
              <div className="stat-value red" style={{ fontSize: 16 }}>
                {status.threat_severity}
              </div>
            </div>
            <div className="stat-box">
              <div className="stat-label">Agents Deployed</div>
              <div className="stat-value accent">
                {status.agents_count} <span style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 400 }}>Specialists</span>
              </div>
            </div>
            <div className="stat-box">
              <div className="stat-label">Tasks Pipeline</div>
              <div className="stat-value">
                {status.tasks_count} <span style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 400 }}>Phases</span>
              </div>
            </div>
            <div className="stat-box">
              <div className="stat-label">LLM Engine</div>
              <div className="stat-value accent" style={{ fontSize: 13, fontFamily: 'var(--font-mono)' }}>
                {status.active_model?.split('/').pop() || 'gpt-4o-mini'}
              </div>
            </div>
            <div className="stat-box">
              <div className="stat-label">Report Status</div>
              <div className="stat-value accent" style={{ fontSize: 14 }}>
                {status.report_generated ? '✓ Generated' : '⏳ Ready to Run'}
              </div>
            </div>
          </div>
        )}

        {/* Active Job Alert Banner */}
        {activeJob && (
          <div className={`job-banner ${activeJob.status}`}>
            {activeJob.status === 'running' && <div className="spinner" />}
            <strong>Job {activeJob.id}</strong>
            &nbsp;—&nbsp;
            {activeJob.status === 'queued' && 'Queued, waiting for agent swarm to initialize…'}
            {activeJob.status === 'running' && 'Multi-Agent Swarm active — conducting multi-domain forensics & root-cause synthesis…'}
            {activeJob.status === 'completed' && '✓ Investigation completed! Synthesis report is ready.'}
            {activeJob.status === 'failed' && `✗ Execution failed: ${activeJob.error}`}
            {(activeJob.status === 'completed' || activeJob.status === 'failed') && (
              <button className="btn btn-ghost btn-sm" style={{ marginLeft: 'auto' }} onClick={() => setActiveJob(null)}>Dismiss</button>
            )}
          </div>
        )}

        {/* Quick Scenario 1-Click Simulation Launcher */}
        <QuickScenarioLauncher
          onJobStarted={handleJobStarted}
          onCustomClick={() => setShowModal(true)}
          activeJob={activeJob}
        />

        {/* Nav Tabs */}
        <nav className="nav-tabs" style={{ marginBottom: 24 }}>
          {TABS.map(t => {
            const IconComponent = t.icon;
            return (
              <button
                key={t.id}
                className={`nav-tab ${tab === t.id ? 'active' : ''}`}
                onClick={() => setTab(t.id)}
              >
                <IconComponent size={15} />
                <span>{t.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Tab Content */}
        {tab === 'overview' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            <TelemetryRadar />
            <AgentMatrix />
            <ResponsePlanView />
          </div>
        )}
        {tab === 'agents' && <AgentMatrix />}
        {tab === 'telemetry' && <TelemetryRadar />}
        {tab === 'plan' && <ResponsePlanView />}
        {tab === 'report' && <ReportViewer refreshTrigger={reportRefresh} activeJob={activeJob} />}
      </main>

      {showModal && (
        <IncidentTriggerModal
          onClose={() => setShowModal(false)}
          onJobStarted={handleJobStarted}
        />
      )}
    </div>
  );
}
