import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Globe, Cpu, Database, ShieldCheck, Activity, Layers, Server } from 'lucide-react'

const TOPOLOGY_NODES = [
  { id: 'client', name: 'Global Users', type: 'Ingress', icon: Globe, status: 'Active', metric: '10k req/sec', detail: 'Route53 DNS + CloudFront CDN Edge Caching' },
  { id: 'gateway', name: 'API Gateway', type: 'Routing', icon: Layers, status: 'Healthy', metric: '12ms P99', detail: 'REST & WebSocket Gateways with WAF Policy' },
  { id: 'fargate', name: 'ECS Fargate', type: 'Compute', icon: Server, status: 'Auto-Scaling', metric: '8 Tasks Active', detail: 'Multi-AZ Docker Containers running on Fargate' },
  { id: 'lambda', name: 'Serverless Lambda', type: 'Compute', icon: Cpu, status: 'Event Driven', metric: '150ms Cold', detail: 'Microservices triggered via EventBridge & SQS' },
  { id: 'msk', name: 'AWS MSK (Kafka)', type: 'Messaging', icon: Activity, status: 'Stream Ready', metric: '4 Broker Nodes', detail: 'Managed Streaming Kafka for Event-driven Pub/Sub' },
  { id: 'aurora', name: 'Aurora PostgreSQL', type: 'Database', icon: Database, status: 'Multi-AZ', metric: '0.4s Repl', detail: 'Auto-scaling Serverless Storage with Read Replicas' },
  { id: 'datadog', name: 'Datadog & Snyk', type: 'Observability', icon: ShieldCheck, status: 'Monitoring', metric: '100% Audit', detail: 'APM Tracing, Log Aggregation & Security Scans' },
]

export default function TopologyCanvas() {
  const [activeNode, setActiveNode] = useState(TOPOLOGY_NODES[2])

  return (
    <div className="topology-wrapper">
      <div className="topology-header">
        <div>
          <span className="mono text-gold">AWS CLOUD TOPOLOGY MAP</span>
          <h4 className="topology-title">
            Interactive Multi-Region <span className="serif-it">VPC Architecture</span>
          </h4>
        </div>
        <span className="mono text-smoke">Click nodes to inspect specs</span>
      </div>

      <div className="topology-grid-container">
        {/* TOPOLOGY GRAPH */}
        <div className="topology-canvas-area">
          <svg className="topology-connections-svg" viewBox="0 0 700 320">
            {/* Connection Lines with Animated Pulses */}
            <line x1="70" y1="160" x2="180" y2="160" stroke="rgba(232,228,220,0.2)" strokeWidth="2" strokeDasharray="4 4" />
            <line x1="180" y1="160" x2="310" y2="90" stroke="rgba(232,228,220,0.2)" strokeWidth="2" strokeDasharray="4 4" />
            <line x1="180" y1="160" x2="310" y2="230" stroke="rgba(232,228,220,0.2)" strokeWidth="2" strokeDasharray="4 4" />
            <line x1="310" y1="90" x2="450" y2="90" stroke="rgba(232,228,220,0.2)" strokeWidth="2" strokeDasharray="4 4" />
            <line x1="310" y1="230" x2="450" y2="230" stroke="rgba(232,228,220,0.2)" strokeWidth="2" strokeDasharray="4 4" />
            <line x1="450" y1="90" x2="590" y2="160" stroke="rgba(232,228,220,0.2)" strokeWidth="2" strokeDasharray="4 4" />
            <line x1="450" y1="230" x2="590" y2="160" stroke="rgba(232,228,220,0.2)" strokeWidth="2" strokeDasharray="4 4" />

            {/* Glowing Flow Indicator */}
            <circle r="4" fill="var(--gold)">
              <animateMotion path="M 70 160 L 180 160 L 310 90 L 450 90 L 590 160" dur="4s" repeatCount="indefinite" />
            </circle>
            <circle r="4" fill="var(--wine-bright)">
              <animateMotion path="M 180 160 L 310 230 L 450 230 L 590 160" dur="5s" repeatCount="indefinite" />
            </circle>
          </svg>

          {/* NODE CARDS ON CANVAS */}
          <div className="topology-node-list">
            {TOPOLOGY_NODES.map((node, index) => {
              const Icon = node.icon
              const isSelected = activeNode.id === node.id
              return (
                <motion.button
                  key={node.id}
                  className={`topology-node-btn node-pos-${index} ${isSelected ? 'active' : ''}`}
                  onClick={() => setActiveNode(node)}
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.96 }}
                >
                  <div className="node-icon-box">
                    <Icon size={18} />
                  </div>
                  <div className="node-label-box">
                    <span className="node-name">{node.name}</span>
                    <span className="node-type mono">{node.type}</span>
                  </div>
                </motion.button>
              )
            })}
          </div>
        </div>

        {/* INSPECTOR PANEL */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeNode.id}
            className="topology-inspector"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25 }}
          >
            <div className="inspector-head">
              <span className="mono text-gold">COMPONENT INSPECTOR</span>
              <span className="inspector-status-pill mono">
                <span className="status-dot" /> {activeNode.status}
              </span>
            </div>

            <h3 className="inspector-node-title">{activeNode.name}</h3>
            <div className="inspector-metric-box">
              <span className="inspector-metric-label mono">PERFORMANCE STAT</span>
              <span className="inspector-metric-val">{activeNode.metric}</span>
            </div>

            <p className="inspector-desc">{activeNode.detail}</p>

            <div className="inspector-tags">
              <span className="bento-tag">AWS VPC Subnet</span>
              <span className="bento-tag">Terraform Managed</span>
              <span className="bento-tag">Encrypted TLS</span>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
