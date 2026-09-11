export const SCENARIO_PRESETS = [
  {
    id: 'compound-datacenter-breach',
    title: 'Compound Data Center Thermal & Cyber Pivot',
    badge: 'P1 Critical',
    severity: 'critical',
    description: 'Concurrent HVAC coolant drop in Pod-4 with lateral SSH brute-force from staging jump-host and BGP flapping.',
    data: {
      incident_id: 'INC-2026-8942',
      organization_name: 'Aegis Mesh Global Systems',
      environment_context: 'Production Data Center Pod-4 & Hybrid Cloud Interconnect (AWS us-east-1)',
      escalation_threshold: 'P1 Critical - Operational Disruption Risk',
      raw_signals: [
        '1. Telemetry Alert: HVAC Chiller unit 3 coolant pressure dropped 65% in 8 minutes; rack temperatures in Zone B spiking to 39.8°C.',
        '2. Network Forensics: Primary BGP peering link with Tier-1 provider flapping with 22% packet loss; router CPU at 96%.',
        '3. Security SIEM: 140+ unauthorized SSH lateral movement attempts detected from staging jump-host IP 10.14.22.8.',
        '4. Business Risk: Core payment gateway and event streaming ingestion latency degraded by 380%; SLA breach timer active at 45 minutes.'
      ].join('\n')
    }
  },
  {
    id: 'cloud-backbone-ddos',
    title: 'Cloud Transit DDoS & BGP Hijack Anomaly',
    badge: 'P1 Urgent',
    severity: 'critical',
    description: 'Transit provider route leaks causing 45% packet loss across Europe & US-East with synthetic transaction timeouts.',
    data: {
      incident_id: 'INC-2026-9104',
      organization_name: 'Aegis Mesh Edge Infrastructure',
      environment_context: 'Global Anycast CDN & Multi-Region VPC Peering (Frankfurt & Virginia)',
      escalation_threshold: 'P1 Critical - Global Traffic Degradation',
      raw_signals: [
        '1. Network Telemetry: Core edge AS-64512 observing 480Gbps volumetric UDP flood targeting port 443.',
        '2. BGP Monitoring: Unauthorized prefix announcement for /24 egress block detected in transit AS-3356.',
        '3. Cloud Observability: API gateway 502/504 error rate surged to 34.2% across EU-Central regions.',
        '4. Risk Assessment: Real-time transactional checkout failure rate exceeding 12,000 req/sec; executive escalation triggered.'
      ].join('\n')
    }
  },
  {
    id: 'ransomware-containment',
    title: 'Staging Pipeline Ransomware Lateral Movement',
    badge: 'P2 High',
    severity: 'high',
    description: 'Anomalous encryption signatures detected on Kubernetes staging worker nodes targeting persistent storage volumes.',
    data: {
      incident_id: 'INC-2026-7819',
      organization_name: 'Aegis Mesh Platform Engineering',
      environment_context: 'EKS Hybrid Cluster & Enterprise Ceph Storage Pool',
      escalation_threshold: 'P2 High - Data Integrity Containment',
      raw_signals: [
        '1. SIEM Detection: High-frequency IOPS spike with randomized .enc file extensions on shared NFS persistent volume claim.',
        '2. Endpoint Protection: Mimikatz process execution flagged on staging CI/CD runner pod container id c892f1.',
        '3. Identity Governance: Service account token sa-deployer executing unauthorized IAM assume-role policies.',
        '4. Facilities & Ops: Immediate snapshot lock requested; air-gap isolation required for staging cluster VPC.'
      ].join('\n')
    }
  }
];
