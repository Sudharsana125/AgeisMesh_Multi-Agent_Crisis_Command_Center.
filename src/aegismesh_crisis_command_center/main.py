#!/usr/bin/env python
import sys
from aegismesh_crisis_command_center.crew import AegismeshCrisisCommandCenterCrew

# This main file is intended to be a way for your to run your
# crew locally, so refrain from adding unnecessary logic into this file.
# Replace with inputs you want to test with, it will automatically
# interpolate any tasks and agents information

def run():
    """
    Run the crew with a realistic multi-domain crisis scenario.
    """
    inputs = {
        'incident_id': 'INC-2026-8942',
        'organization_name': 'Aegis Mesh Global Systems',
        'environment_context': 'Production Data Center Pod-4 & Hybrid Cloud Interconnect (AWS us-east-1)',
        'escalation_threshold': 'P1 Critical - Operational Disruption Risk',
        'raw_signals': (
            "1. Telemetry Alert: HVAC Chiller unit 3 coolant pressure dropped 65% in 8 minutes; rack temperatures in Zone B spiking to 39.8°C.\n"
            "2. Network Forensics: Primary BGP peering link with Tier-1 provider flapping with 22% packet loss; router CPU at 96%.\n"
            "3. Security SIEM: 140+ unauthorized SSH lateral movement attempts detected from staging jump-host IP 10.14.22.8.\n"
            "4. Business Risk: Core payment gateway and event streaming ingestion latency degraded by 380%; SLA breach timer active at 45 minutes."
        )
    }
    result = AegismeshCrisisCommandCenterCrew().crew().kickoff(inputs=inputs)
    print("\n" + "=" * 80)
    print("=== AEGIS MESH CRISIS COMMAND CENTER - FINAL REPORT ===")
    print("=" * 80)
    print(result.raw if hasattr(result, "raw") else str(result))
    print("=" * 80)
    return result


def train():
    """
    Train the crew for a given number of iterations.
    """
    inputs = {
        'incident_id': 'sample_value',
        'organization_name': 'sample_value',
        'environment_context': 'sample_value',
        'escalation_threshold': 'sample_value',
        'raw_signals': 'sample_value'
    }
    try:
        AegismeshCrisisCommandCenterCrew().crew().train(n_iterations=int(sys.argv[1]), filename=sys.argv[2], inputs=inputs)

    except Exception as e:
        raise Exception(f"An error occurred while training the crew: {e}")

def replay():
    """
    Replay the crew execution from a specific task.
    """
    try:
        AegismeshCrisisCommandCenterCrew().crew().replay(task_id=sys.argv[1])

    except Exception as e:
        raise Exception(f"An error occurred while replaying the crew: {e}")

def test():
    """
    Test the crew execution and returns the results.
    """
    inputs = {
        'incident_id': 'sample_value',
        'organization_name': 'sample_value',
        'environment_context': 'sample_value',
        'escalation_threshold': 'sample_value',
        'raw_signals': 'sample_value'
    }
    try:
        AegismeshCrisisCommandCenterCrew().crew().test(n_iterations=int(sys.argv[1]), openai_model_name=sys.argv[2], inputs=inputs)

    except Exception as e:
        raise Exception(f"An error occurred while testing the crew: {e}")

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: main.py <command> [<args>]")
        sys.exit(1)

    command = sys.argv[1]
    if command == "run":
        run()
    elif command == "train":
        train()
    elif command == "replay":
        replay()
    elif command == "test":
        test()
    else:
        print(f"Unknown command: {command}")
        sys.exit(1)
