# 🛡️ AegisMesh — Autonomous Multi-Agent Crisis Command Center

An autonomous multi-agent crisis management system powered by **CrewAI** and **Google Gemini**. Twelve specialized AI agents collaborate in a sequential pipeline to detect, investigate, analyze, and resolve complex infrastructure incidents — from initial triage to final recovery plan.

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                     React Frontend (Vite)                       │
│  Dashboard · Agent Matrix · Telemetry Radar · Report Viewer     │
└──────────────────────────┬──────────────────────────────────────┘
                           │ REST API
┌──────────────────────────▼──────────────────────────────────────┐
│                   FastAPI Backend (api.py)                       │
│  /api/kickoff · /api/agents · /api/telemetry · /api/report      │
└──────────────────────────┬──────────────────────────────────────┘
                           │
┌──────────────────────────▼──────────────────────────────────────┐
│                CrewAI Sequential Pipeline                        │
│                                                                  │
│  1. Crisis Detection & Triage Commander                          │
│  2. Sensor Data & Time-Series Pattern Specialist                 │
│  3. Physical Infrastructure & Facilities Forensics Specialist    │
│  4. Network & Connectivity Forensics Specialist                  │
│  5. Cybersecurity Threat & Behavioral Analysis Specialist        │
│  6. Operational Risk & Business Impact Analyst                   │
│  7. Cross-Domain Evidence Synthesis & Causal Reasoning           │
│  8. Incident Scenario Modeling & Consequence Simulation          │
│  9. Hypothesis Challenger & Investigation Quality Enforcer       │
│  10. Root Cause Analysis & Causal Chain Reconstruction           │
│  11. Crisis Command Authority & Final Decision Maker             │
│  12. Incident Response Planning & Recovery Architecture          │
│                                                                  │
│  LLM: Google Gemini (gemini/gemini-1.5-flash)                    │
└──────────────────────────────────────────────────────────────────┘
```

## 🤖 The 12 Agents

| # | Agent | Role |
|---|-------|------|
| 1 | **Emergency Team Lead** | Detects early warnings, triages severity (P1–P4), and activates specialist domains |
| 2 | **Data & Metrics Analyst** | Analyzes sensor telemetry, statistical anomalies, and time-series deviations |
| 3 | **Server & Hardware Engineer** | Investigates HVAC, cooling, electrical, UPS, and physical infrastructure |
| 4 | **Internet & Network Specialist** | Examines latency, packet loss, BGP flapping, and connectivity failures |
| 5 | **Cybersecurity & Hacker Hunter** | Hunts for intrusions, lateral movement, malware, and threat indicators |
| 6 | **Business & Customer Impact Analyst** | Quantifies affected users, SLA exposure, revenue risk, and regulatory impact |
| 7 | **Lead Detective (Clue Connector)** | Synthesizes cross-domain evidence and builds unified causal hypotheses |
| 8 | **Future Scenario Forecaster** | Simulates consequence scenarios and predicts cascading failures |
| 9 | **Fact Checker & Quality Reviewer** | Adversarially challenges hypotheses to eliminate confirmation bias |
| 10 | **Root Cause Investigator** | Reconstructs the complete causal chain with confidence scoring |
| 11 | **Chief Decision Maker** | Makes the final command decision — autonomous response or human escalation |
| 12 | **Fix & Recovery Planner** | Produces the actionable response plan and comprehensive final report |

## ⚡ Prerequisites

- **Python** >= 3.10, < 3.14
- **Node.js** >= 18 (for the frontend)
- **[uv](https://docs.astral.sh/uv/)** — Python package manager
- **Google Gemini API Key** — get one free at [Google AI Studio](https://aistudio.google.com/apikey)

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/Sudharsana125/Autonomous_Multi-Agent_Crisis_Command_Center..git
cd Autonomous_Multi-Agent_Crisis_Command_Center.
```

### 2. Install Python dependencies

```bash
pip install uv
uv sync
```

Or using CrewAI CLI:

```bash
crewai install
```

### 3. Configure environment variables

Create a `.env` file in the project root:

```env
# Google Gemini (Recommended — used by this project)
GEMINI_API_KEY=your_gemini_api_key_here
MODEL=gemini/gemini-1.5-flash

# Optional: Exa Search for enhanced web research
# EXA_API_KEY=your_exa_api_key_here
```

> **Note:** This project uses **Google Gemini** as the LLM provider. The `.env.example` file also documents alternative providers (OpenAI, Anthropic, Ollama) if you wish to switch.

### 4. Run the CrewAI backend

```bash
crewai run
```

This launches the 12-agent pipeline with a pre-configured multi-domain crisis scenario involving:
- 🌡️ HVAC chiller failure with server room overheating
- 🌐 BGP peering link flapping with 22% packet loss
- 🔐 140+ unauthorized SSH lateral movement attempts
- 💳 Payment gateway latency degraded by 380%

### 5. Run the frontend dashboard (optional)

```bash
cd frontend
npm install
npm run dev
```

### 6. Run the API server (optional)

```bash
uvicorn aegismesh_crisis_command_center.api:app --reload --port 8000
```

**API Endpoints:**

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/status` | System status and active model |
| `GET` | `/api/agents` | List all 12 agents with roles and goals |
| `GET` | `/api/telemetry` | Live telemetry signals |
| `POST` | `/api/kickoff` | Trigger a new crew investigation |
| `GET` | `/api/jobs/{id}` | Check job status |
| `GET` | `/api/report` | Retrieve the final crisis report |

## 📁 Project Structure

```
├── src/aegismesh_crisis_command_center/
│   ├── config/
│   │   ├── agents.yaml          # 12 agent definitions (role, goal, backstory)
│   │   └── tasks.yaml           # 12 task definitions with context dependencies
│   ├── tools/
│   │   └── custom_tool.py       # Custom tool implementations
│   ├── crew.py                  # Crew orchestration with Gemini LLM config
│   ├── api.py                   # FastAPI server
│   └── main.py                  # CLI entry point
├── frontend/                    # React + Vite dashboard
│   ├── src/
│   │   ├── components/          # AgentMatrix, TelemetryRadar, ReportViewer, etc.
│   │   └── services/            # API client and scenario definitions
│   └── ...
├── knowledge/                   # Knowledge base resources
├── output/                      # Generated crisis reports
├── .env.example                 # Environment variable template
└── pyproject.toml               # Project config and dependencies
```

## 📊 Output

After a successful run, the system generates a comprehensive **Final Incident Report** at `output/final_crisis_report.md` containing:

- Incident summary and timeline
- Detected anomalies (confirmed and suspected)
- Evidence collected by domain (telemetry, infrastructure, network, security)
- Agent findings per specialist
- Conflicting evidence and alternative hypotheses
- Simulation results and worst-case scenarios
- Root cause analysis with confidence score
- Severity classification (P1–P4)
- Business impact assessment
- Immediate, short-term, and long-term response actions
- Agent decision trace

## 🛠️ Customization

- **Agents**: Edit `src/aegismesh_crisis_command_center/config/agents.yaml` to modify agent roles, goals, and backstories
- **Tasks**: Edit `src/aegismesh_crisis_command_center/config/tasks.yaml` to adjust investigation tasks and dependencies
- **LLM Model**: Change `MODEL` in `.env` (e.g., `gemini/gemini-2.0-flash`, `openai/gpt-4o`, `ollama/llama3`)
- **Scenario**: Edit the `inputs` dict in `main.py` to simulate different crisis scenarios

## 📝 License

This project is open source and available under the [MIT License](LICENSE).
