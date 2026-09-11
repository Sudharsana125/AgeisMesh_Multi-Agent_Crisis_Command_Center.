const API_BASE = 'http://localhost:8000';

async function request(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  });
  if (!res.ok) throw new Error(`API error ${res.status}: ${await res.text()}`);
  return res.json();
}

export const api = {
  getStatus:   ()         => request('/api/status'),
  getAgents:   ()         => request('/api/agents'),
  getTelemetry:()         => request('/api/telemetry'),
  getReport:   ()         => request('/api/report'),
  listJobs:    ()         => request('/api/jobs'),
  getJob:      (id)       => request(`/api/jobs/${id}`),
  kickoff:     (payload)  => request('/api/kickoff', {
    method: 'POST',
    body: JSON.stringify(payload),
  }),
};
