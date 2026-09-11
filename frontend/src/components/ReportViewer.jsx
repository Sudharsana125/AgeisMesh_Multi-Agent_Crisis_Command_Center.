import { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { api } from '../services/api';
import { RefreshCw, FileText, Download, Copy, Check, Sparkles, Terminal } from 'lucide-react';

export default function ReportViewer({ refreshTrigger, activeJob }) {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  const fetchReport = () => {
    setLoading(true);
    api.getReport()
      .then(setReport)
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchReport(); }, [refreshTrigger]);

  const handleCopy = () => {
    if (!report?.content) return;
    navigator.clipboard.writeText(report.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!report?.content) return;
    const blob = new Blob([report.content], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `AegisMesh_Crisis_Report_${new Date().toISOString().slice(0, 10)}.md`;
    link.click();
    URL.revokeObjectURL(url);
  };

  if (loading) return (
    <div className="card">
      <div className="card-header">
        <span className="card-title"><FileText size={16} /> Crisis Synthesis Intelligence Report</span>
      </div>
      <div className="loading-state">
        <div className="spinner" />
        <span>Synthesizing multi-agent intelligence report…</span>
      </div>
    </div>
  );

  const wordCount = report?.content ? report.content.split(/\s+/).filter(Boolean).length : 0;

  return (
    <div className="card">
      <div className="card-header" style={{ flexWrap: 'wrap', gap: 12 }}>
        <div>
          <span className="card-title">
            <FileText size={16} color="var(--primary-light)" />
            Crisis Intelligence & Root Cause Synthesis Report
          </span>
          {report?.last_modified && (
            <div style={{ fontSize: 11.5, color: 'var(--text-muted)', marginTop: 4, fontFamily: 'var(--font-mono)' }}>
              Generated: {new Date(report.last_modified).toLocaleString()} &nbsp;·&nbsp; {wordCount.toLocaleString()} words &nbsp;·&nbsp; {report.size_bytes ? `${(report.size_bytes / 1024).toFixed(1)} KB` : ''}
            </div>
          )}
        </div>

        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          {report?.exists && (
            <>
              <button className="btn btn-ghost btn-sm" onClick={handleCopy} title="Copy markdown content">
                {copied ? <Check size={13} color="var(--primary-light)" /> : <Copy size={13} />}
                <span>{copied ? 'Copied!' : 'Copy'}</span>
              </button>
              <button className="btn btn-ghost btn-sm" onClick={handleDownload} title="Download markdown report">
                <Download size={13} />
                <span>Download .MD</span>
              </button>
            </>
          )}
          <button className="btn btn-ghost btn-sm btn-icon" onClick={fetchReport} title="Refresh report">
            <RefreshCw size={14} />
          </button>
        </div>
      </div>

      {!report?.exists ? (
        <div className="empty-state" style={{ padding: '64px 20px' }}>
          <div style={{
            width: 54, height: 54, borderRadius: '50%',
            background: 'var(--bg-surface)', border: '1px solid var(--border)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 8
          }}>
            <FileText size={28} color="var(--text-muted)" />
          </div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 700, color: 'var(--text-primary)' }}>
            No Investigation Report Generated Yet
          </div>
          <p style={{ maxWidth: 460 }}>
            Kick off the 12-Agent Swarm using one of the Quick Simulation presets or click <strong>Launch Crew</strong> in the header.
          </p>
        </div>
      ) : (
        <div className="report-viewer">
          <ReactMarkdown>{report.content}</ReactMarkdown>
        </div>
      )}
    </div>
  );
}
