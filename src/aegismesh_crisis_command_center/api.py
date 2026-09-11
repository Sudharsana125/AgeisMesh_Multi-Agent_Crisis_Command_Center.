import asyncio
import os
import uuid
import yaml
from pathlib import Path
from typing import Dict, Any, Optional
from datetime import datetime
from dotenv import load_dotenv

load_dotenv()

from fastapi import FastAPI, BackgroundTasks, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI(title="AegisMesh Crisis Command Center API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

PROJECT_ROOT = Path(__file__).resolve().parent.parent.parent
CONFIG_DIR = Path(__file__).resolve().parent / "config"
OUTPUT_DIR = PROJECT_ROOT / "output"
REPORT_PATH = OUTPUT_DIR / "final_crisis_report.md"

# In-memory jobs store
JOBS: Dict[str, Dict[str, Any]] = {}


class KickoffRequest(BaseModel):
    incident_id: str = "INC-2026-8942"
    organization_name: str = "Aegis Mesh Global Systems"
    environment_context: str = "Production Data Center Pod-4 & Hybrid Cloud Interconnect (AWS us-east-1)"
    escalation_threshold: str = "P1 Critical - Operational Disruption Risk"
    raw_signals: str = (
        "1. Telemetry Alert: HVAC Chiller unit 3 coolant pressure dropped 65% in 8 minutes; rack temperatures in Zone B spiking to 39.8°C.\n"
        "2. Network Forensics: Primary BGP peering link with Tier-1 provider flapping with 22% packet loss; router CPU at 96%.\n"
        "3. Security SIEM: 140+ unauthorized SSH lateral movement attempts detected from staging jump-host IP 10.14.22.8.\n"
        "4. Business Risk: Core payment gateway and event streaming ingestion latency degraded by 380%; SLA breach timer active at 45 minutes."
    )


def _load_agents_yaml() -> Dict[str, Any]:
    agents_file = CONFIG_DIR / "agents.yaml"
    if agents_file.exists():
        with open(agents_file, "r", encoding="utf-8") as f:
            return yaml.safe_load(f) or {}
    return {}


def _run_crew_task(job_id: str, inputs: Dict[str, Any]):
    try:
        from aegismesh_crisis_command_center.crew import AegismeshCrisisCommandCenterCrew
        JOBS[job_id]["status"] = "running"
        JOBS[job_id]["started_at"] = datetime.utcnow().isoformat()
        
        crew_instance = AegismeshCrisisCommandCenterCrew().crew()
        result = crew_instance.kickoff(inputs=inputs)
        
        raw_result = result.raw if hasattr(result, "raw") else str(result)
        JOBS[job_id]["status"] = "completed"
        JOBS[job_id]["completed_at"] = datetime.utcnow().isoformat()
        JOBS[job_id]["result"] = raw_result
        
        # Ensure output directory exists and save result
        OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
        with open(REPORT_PATH, "w", encoding="utf-8") as f:
            f.write(raw_result)
            
    except Exception as exc:
        JOBS[job_id]["status"] = "failed"
        JOBS[job_id]["error"] = str(exc)
        JOBS[job_id]["failed_at"] = datetime.utcnow().isoformat()


@app.get("/api/status")
def get_status():
    model_name = os.getenv("MODEL", os.getenv("OPENAI_MODEL_NAME", "openai/gpt-4o-mini"))
    agents = _load_agents_yaml()
    report_exists = REPORT_PATH.exists()
    
    return {
        "status": "online",
        "system_name": "AegisMesh Autonomous Crisis Command Center",
        "version": "1.0.0",
        "active_incident": "INC-2026-8942",
        "threat_severity": "P1 Critical",
        "agents_count": len(agents),
        "tasks_count": 12,
        "active_model": model_name,
        "report_generated": report_exists,
        "sla_timer_minutes": 45,
    }


@app.get("/api/agents")
def get_agents():
    agents_data = _load_agents_yaml()
    friendly_info = {
        "crisis_detection_triage_commander": {
            "friendly_name": "Emergency Team Lead",
            "domain": "Emergency Lead",
            "badge": "Team Lead",
            "simple_goal": "Detects early warnings, checks how serious the issue is, and brings the right helpers together."
        },
        "sensor_data_time_series_pattern_specialist": {
            "friendly_name": "Data & Metrics Analyst",
            "domain": "Sensor Analyst",
            "badge": "Data Specialist",
            "simple_goal": "Monitors live server charts to spot sudden spikes in temperature, traffic, or errors."
        },
        "physical_infrastructure_facilities_forensics_specialist": {
            "friendly_name": "Server & Hardware Engineer",
            "domain": "Hardware & Cooling",
            "badge": "Server Rooms",
            "simple_goal": "Checks physical server health, room overheating, cooling fans, and power cables."
        },
        "network_connectivity_forensics_specialist": {
            "friendly_name": "Internet & Network Specialist",
            "domain": "Network & Internet",
            "badge": "Network Lead",
            "simple_goal": "Investigates internet drops, slow lines, and broken connections between servers."
        },
        "cybersecurity_threat_behavioral_analysis_specialist": {
            "friendly_name": "Cybersecurity & Hacker Hunter",
            "domain": "Security & Defense",
            "badge": "Security Guard",
            "simple_goal": "Detects suspicious logins, malware, and unauthorized attempts to break into systems."
        },
        "operational_risk_business_impact_analyst": {
            "friendly_name": "Business & Customer Impact Analyst",
            "domain": "Business Impact",
            "badge": "Risk Advisor",
            "simple_goal": "Estimates how many customers are affected and calculates financial or reputation risks."
        },
        "cross_domain_evidence_synthesis_causal_reasoning_specialist": {
            "friendly_name": "Lead Detective (Clue Connector)",
            "domain": "Clue Connector",
            "badge": "Lead Detective",
            "simple_goal": "Connects clues from hardware, internet, and security to find how problems are linked."
        },
        "incident_scenario_modeling_consequence_simulation_specialist": {
            "friendly_name": "Future Scenario Forecaster",
            "domain": "Risk Forecaster",
            "badge": "Predictor",
            "simple_goal": "Predicts what might break next if the problem is not fixed immediately."
        },
        "hypothesis_challenger_investigation_quality_enforcer": {
            "friendly_name": "Fact Checker & Quality Reviewer",
            "domain": "Fact Checker",
            "badge": "Reviewer",
            "simple_goal": "Double-checks all theories to make sure the team doesn't jump to the wrong conclusion."
        },
        "root_cause_analysis_causal_chain_reconstruction_specialist": {
            "friendly_name": "Root Cause Investigator",
            "domain": "Root Cause",
            "badge": "Root Cause Lead",
            "simple_goal": "Identifies the exact single problem that started the whole chain reaction."
        },
        "crisis_command_authority_final_decision_maker": {
            "friendly_name": "Chief Decision Maker",
            "domain": "Command Authority",
            "badge": "Commander",
            "simple_goal": "Authorizes emergency plans and makes final high-level operational decisions."
        },
        "incident_response_planning_recovery_architecture_specialist": {
            "friendly_name": "Fix & Recovery Planner",
            "domain": "Fix & Recovery",
            "badge": "Recovery Lead",
            "simple_goal": "Creates clear, step-by-step instructions to fix the issue and prevent it from happening again."
        },
    }

    result = []
    for key, data in agents_data.items():
        meta = friendly_info.get(key, {
            "friendly_name": key.replace("_", " ").title(),
            "domain": "Helper",
            "badge": "Assistant",
            "simple_goal": data.get("goal", "")
        })
        result.append({
            "id": key,
            "role": meta["friendly_name"],
            "goal": meta["simple_goal"],
            "backstory": data.get("backstory", ""),
            "domain": meta["domain"],
            "badge": meta["badge"],
            "status": "ready"
        })
    return result


@app.get("/api/telemetry")
def get_telemetry():
    return {
        "signals": [
            {
                "id": "sig-1",
                "source": "Server Room Air Conditioning",
                "status": "CRITICAL",
                "metric": "Cooling System Pressure",
                "value": "-65% (Failing)",
                "temp": "39.8°C (Too Hot)",
                "delta": "Spiked in 8 mins",
                "severity": "critical",
                "alert": "Server room is overheating (Safe Limit: 27°C)"
            },
            {
                "id": "sig-2",
                "source": "Main Internet Provider Line",
                "status": "CRITICAL",
                "metric": "Internet Data Loss",
                "value": "22% Dropped",
                "temp": "Router overloaded (96%)",
                "delta": "Unstable connection",
                "severity": "critical",
                "alert": "Nearly a quarter of web visitors are losing connection"
            },
            {
                "id": "sig-3",
                "source": "Security Defense System",
                "status": "HIGH",
                "metric": "Suspicious Login Attempts",
                "value": "140+ Attempts",
                "temp": "IP 10.14.22.8",
                "delta": "From test machine",
                "severity": "high",
                "alert": "Possible hacker trying to guess passwords on internal servers"
            },
            {
                "id": "sig-4",
                "source": "Customer Payment System",
                "status": "HIGH",
                "metric": "Checkout Loading Time",
                "value": "4x Slower",
                "temp": "45 Mins Deadline",
                "delta": "Checkout delays",
                "severity": "high",
                "alert": "Customers are experiencing slow checkouts; danger of payment failures"
            }
        ]
    }


@app.get("/api/report")
def get_report():
    if not REPORT_PATH.exists():
        return {"exists": False, "content": "No report generated yet. Kick off the crew to generate one."}
    
    with open(REPORT_PATH, "r", encoding="utf-8") as f:
        content = f.read()
        
    stats = REPORT_PATH.stat()
    return {
        "exists": True,
        "content": content,
        "last_modified": datetime.fromtimestamp(stats.st_mtime).isoformat(),
        "size_bytes": stats.st_size
    }


@app.post("/api/kickoff")
def kickoff_crew(req: KickoffRequest, background_tasks: BackgroundTasks):
    job_id = f"job-{uuid.uuid4().hex[:8]}"
    JOBS[job_id] = {
        "id": job_id,
        "status": "queued",
        "created_at": datetime.utcnow().isoformat(),
        "inputs": req.dict(),
    }
    background_tasks.add_task(_run_crew_task, job_id, req.dict())
    return {"job_id": job_id, "status": "queued", "message": "Crew kickoff dispatched in background"}


@app.get("/api/jobs/{job_id}")
def get_job_status(job_id: str):
    if job_id not in JOBS:
        raise HTTPException(status_code=404, detail="Job not found")
    return JOBS[job_id]


@app.get("/api/jobs")
def list_jobs():
    return list(JOBS.values())
