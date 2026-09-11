import os
from dotenv import load_dotenv

load_dotenv()

from crewai import LLM, Agent, Crew, Process, Task
from crewai.project import CrewBase, agent, crew, task
from crewai_tools import EXASearchTool, FileReadTool


import re
import time

try:
    from crewai.llms.providers.gemini.completion import GeminiCompletion

    _orig_gemini_handle_completion = GeminiCompletion._handle_completion

    def _auto_retry_gemini_handle_completion(self, *args, **kwargs):
        max_retries = 6
        for attempt in range(max_retries):
            try:
                return _orig_gemini_handle_completion(self, *args, **kwargs)
            except Exception as e:
                err_msg = str(e)
                if "429" in err_msg or "RESOURCE_EXHAUSTED" in err_msg:
                    match = re.search(r"retry in (\d+(\.\d+)?)s", err_msg, re.IGNORECASE)
                    wait_sec = float(match.group(1)) + 3.0 if match else 35.0
                    print(
                        f"\n[Rate-Limit Backoff] Free-tier limit reached. Pausing for {wait_sec:.1f}s to allow quota replenishment... (Attempt {attempt+1}/{max_retries})",
                        flush=True,
                    )
                    time.sleep(wait_sec)
                else:
                    raise e
        return _orig_gemini_handle_completion(self, *args, **kwargs)

    GeminiCompletion._handle_completion = _auto_retry_gemini_handle_completion
except Exception:
    pass


def _get_llm() -> LLM:
    model = os.getenv("MODEL", os.getenv("GEMINI_MODEL", "gemini/gemini-3.5-flash-lite"))
    return LLM(model=model)


def _get_tools(include_file_read: bool = False):
    tools = []
    if os.getenv("EXA_API_KEY"):
        try:
            tools.append(EXASearchTool())
        except Exception:
            pass
    if include_file_read:
        tools.append(FileReadTool())
    return tools


@CrewBase
class AegismeshCrisisCommandCenterCrew:
    """AegismeshCrisisCommandCenter crew"""

    agents_config = "config/agents.yaml"
    tasks_config = "config/tasks.yaml"

    @agent
    def crisis_detection_triage_commander(self) -> Agent:
        return Agent(
            config=self.agents_config["crisis_detection_triage_commander"],  # type: ignore[index]
            tools=_get_tools(include_file_read=True),
            reasoning=False,
            max_reasoning_attempts=None,
            inject_date=True,
            allow_delegation=False,
            max_iter=25,
            max_rpm=10,
            max_execution_time=None,
            llm=_get_llm(),
        )

    @agent
    def sensor_data_time_series_pattern_specialist(self) -> Agent:
        return Agent(
            config=self.agents_config["sensor_data_time_series_pattern_specialist"],  # type: ignore[index]
            tools=_get_tools(include_file_read=True),
            reasoning=False,
            max_reasoning_attempts=None,
            inject_date=True,
            allow_delegation=False,
            max_iter=25,
            max_rpm=10,
            max_execution_time=None,
            llm=_get_llm(),
        )

    @agent
    def physical_infrastructure_facilities_forensics_specialist(self) -> Agent:
        return Agent(
            config=self.agents_config["physical_infrastructure_facilities_forensics_specialist"],  # type: ignore[index]
            tools=_get_tools(include_file_read=True),
            reasoning=False,
            max_reasoning_attempts=None,
            inject_date=True,
            allow_delegation=False,
            max_iter=25,
            max_rpm=10,
            max_execution_time=None,
            llm=_get_llm(),
        )

    @agent
    def network_connectivity_forensics_specialist(self) -> Agent:
        return Agent(
            config=self.agents_config["network_connectivity_forensics_specialist"],  # type: ignore[index]
            tools=_get_tools(include_file_read=True),
            reasoning=False,
            max_reasoning_attempts=None,
            inject_date=True,
            allow_delegation=False,
            max_iter=25,
            max_rpm=10,
            max_execution_time=None,
            llm=_get_llm(),
        )

    @agent
    def cybersecurity_threat_behavioral_analysis_specialist(self) -> Agent:
        return Agent(
            config=self.agents_config["cybersecurity_threat_behavioral_analysis_specialist"],  # type: ignore[index]
            tools=_get_tools(include_file_read=True),
            reasoning=False,
            max_reasoning_attempts=None,
            inject_date=True,
            allow_delegation=False,
            max_iter=25,
            max_rpm=10,
            max_execution_time=None,
            llm=_get_llm(),
        )

    @agent
    def operational_risk_business_impact_analyst(self) -> Agent:
        return Agent(
            config=self.agents_config["operational_risk_business_impact_analyst"],  # type: ignore[index]
            tools=_get_tools(include_file_read=False),
            reasoning=False,
            max_reasoning_attempts=None,
            inject_date=True,
            allow_delegation=False,
            max_iter=25,
            max_rpm=10,
            max_execution_time=None,
            llm=_get_llm(),
        )

    @agent
    def cross_domain_evidence_synthesis_causal_reasoning_specialist(self) -> Agent:
        return Agent(
            config=self.agents_config["cross_domain_evidence_synthesis_causal_reasoning_specialist"],  # type: ignore[index]
            tools=_get_tools(include_file_read=False),
            reasoning=False,
            max_reasoning_attempts=None,
            inject_date=True,
            allow_delegation=False,
            max_iter=25,
            max_rpm=10,
            max_execution_time=None,
            llm=_get_llm(),
        )

    @agent
    def incident_scenario_modeling_consequence_simulation_specialist(self) -> Agent:
        return Agent(
            config=self.agents_config["incident_scenario_modeling_consequence_simulation_specialist"],  # type: ignore[index]
            tools=_get_tools(include_file_read=False),
            reasoning=False,
            max_reasoning_attempts=None,
            inject_date=True,
            allow_delegation=False,
            max_iter=25,
            max_rpm=10,
            max_execution_time=None,
            llm=_get_llm(),
        )

    @agent
    def hypothesis_challenger_investigation_quality_enforcer(self) -> Agent:
        return Agent(
            config=self.agents_config["hypothesis_challenger_investigation_quality_enforcer"],  # type: ignore[index]
            tools=_get_tools(include_file_read=False),
            reasoning=False,
            max_reasoning_attempts=None,
            inject_date=True,
            allow_delegation=False,
            max_iter=25,
            max_rpm=10,
            max_execution_time=None,
            llm=_get_llm(),
        )

    @agent
    def root_cause_analysis_causal_chain_reconstruction_specialist(self) -> Agent:
        return Agent(
            config=self.agents_config["root_cause_analysis_causal_chain_reconstruction_specialist"],  # type: ignore[index]
            tools=_get_tools(include_file_read=False),
            reasoning=False,
            max_reasoning_attempts=None,
            inject_date=True,
            allow_delegation=False,
            max_iter=25,
            max_rpm=10,
            max_execution_time=None,
            llm=_get_llm(),
        )

    @agent
    def crisis_command_authority_final_decision_maker(self) -> Agent:
        return Agent(
            config=self.agents_config["crisis_command_authority_final_decision_maker"],  # type: ignore[index]
            tools=_get_tools(include_file_read=False),
            reasoning=False,
            max_reasoning_attempts=None,
            inject_date=True,
            allow_delegation=False,
            max_iter=25,
            max_rpm=10,
            max_execution_time=None,
            llm=_get_llm(),
        )

    @agent
    def incident_response_planning_recovery_architecture_specialist(self) -> Agent:
        return Agent(
            config=self.agents_config["incident_response_planning_recovery_architecture_specialist"],  # type: ignore[index]
            tools=_get_tools(include_file_read=False),
            reasoning=False,
            max_reasoning_attempts=None,
            inject_date=True,
            allow_delegation=False,
            max_iter=25,
            max_rpm=10,
            max_execution_time=None,
            llm=_get_llm(),
        )

    @task
    def incident_detection_and_triage(self) -> Task:
        return Task(
            config=self.tasks_config["incident_detection_and_triage"],  # type: ignore[index]
            markdown=False,
        )

    @task
    def telemetry_analysis(self) -> Task:
        return Task(
            config=self.tasks_config["telemetry_analysis"],  # type: ignore[index]
            markdown=False,
        )

    @task
    def infrastructure_investigation(self) -> Task:
        return Task(
            config=self.tasks_config["infrastructure_investigation"],  # type: ignore[index]
            markdown=False,
        )

    @task
    def network_investigation(self) -> Task:
        return Task(
            config=self.tasks_config["network_investigation"],  # type: ignore[index]
            markdown=False,
        )

    @task
    def security_investigation(self) -> Task:
        return Task(
            config=self.tasks_config["security_investigation"],  # type: ignore[index]
            markdown=False,
        )

    @task
    def business_impact_assessment(self) -> Task:
        return Task(
            config=self.tasks_config["business_impact_assessment"],  # type: ignore[index]
            markdown=False,
        )

    @task
    def evidence_correlation(self) -> Task:
        return Task(
            config=self.tasks_config["evidence_correlation"],  # type: ignore[index]
            markdown=False,
        )

    @task
    def scenario_simulation(self) -> Task:
        return Task(
            config=self.tasks_config["scenario_simulation"],  # type: ignore[index]
            markdown=False,
        )

    @task
    def adversarial_critique(self) -> Task:
        return Task(
            config=self.tasks_config["adversarial_critique"],  # type: ignore[index]
            markdown=False,
        )

    @task
    def root_cause_analysis(self) -> Task:
        return Task(
            config=self.tasks_config["root_cause_analysis"],  # type: ignore[index]
            markdown=False,
        )

    @task
    def incident_commander_decision(self) -> Task:
        return Task(
            config=self.tasks_config["incident_commander_decision"],  # type: ignore[index]
            markdown=False,
        )

    @task
    def response_planning_and_final_report(self) -> Task:
        return Task(
            config=self.tasks_config["response_planning_and_final_report"],  # type: ignore[index]
            markdown=False,
        )

    @crew
    def crew(self) -> Crew:
        """Creates the AegismeshCrisisCommandCenter crew"""
        return Crew(
            agents=self.agents,
            tasks=self.tasks,
            process=Process.sequential,
            verbose=True,
            max_rpm=10,
            chat_llm=_get_llm(),
        )
