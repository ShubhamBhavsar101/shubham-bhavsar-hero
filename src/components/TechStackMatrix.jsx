import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Terminal, CheckCircle2, ChevronRight } from 'lucide-react'

const TECH_ITEMS = [
  {
    name: 'Terraform',
    category: 'IaC & Infrastructure',
    tag: 'v1.7+',
    code: `module "ecs_cluster" {
  source  = "terraform-aws-modules/ecs/aws"
  name    = "production-fargate"
  capacity_providers = ["FARGATE_SPOT"]
}`,
    stats: '100% Modular Infrastructure',
  },
  {
    name: 'AWS Cloud',
    category: 'Cloud Services',
    tag: 'Architect',
    code: `resource "aws_route53_record" "api" {
  zone_id = aws_route53_zone.primary.zone_id
  name    = "api.prod.domain.com"
  type    = "A"
  alias { name = aws_lb.main.dns_name }
}`,
    stats: 'VPC, ECS, Lambda, Aurora, MSK',
  },
  {
    name: 'GitHub Actions',
    category: 'CI/CD Pipelines',
    tag: 'Automation',
    code: `name: Production Deployment
on: [push]
jobs:
  security-gate:
    uses: ./.github/workflows/snyk-ruff.yml`,
    stats: '25% Faster Build Pipelines',
  },
  {
    name: 'Datadog',
    category: 'Observability',
    tag: 'Monitoring',
    code: `monitors:
  - name: "P99 API Latency High"
    type: "metric alert"
    query: "avg(last_5m):p99.latency > 100"
    message: "@slack-sre-team Alert!"`,
    stats: 'P99 Metrics & APM Tracing',
  },
  {
    name: 'Docker & ECS',
    category: 'Containerization',
    tag: 'Runtime',
    code: `FROM python:3.11-slim
COPY --from=builder /install /usr/local
ENTRYPOINT ["uvicorn", "main:app", "--host", "0.0.0.0"]`,
    stats: 'Zero-Downtime Rolling Deploys',
  },
  {
    name: 'Snyk & Ruff',
    category: 'DevSecOps',
    tag: 'Security',
    code: `- name: Run Snyk Container Scan
  uses: snyk/actions/docker@master
  with:
    command: monitor
    args: --severity-threshold=high`,
    stats: 'Automated Security Gates',
  },
]

export default function TechStackMatrix() {
  const [selectedTech, setSelectedTech] = useState(TECH_ITEMS[0])

  return (
    <div className="tech-matrix-wrapper">
      <div className="tech-matrix-header">
        <div>
          <span className="mono text-gold">DEVOPS STACK MATRIX</span>
          <h4 className="tech-matrix-title">
            Production Tools &amp; <span className="serif-it">Code Blueprints</span>
          </h4>
        </div>
        <span className="mono text-smoke">Hover pills to preview IaC configs</span>
      </div>

      <div className="tech-matrix-grid">
        {/* TECH SELECTOR PILLS */}
        <div className="tech-pills-list">
          {TECH_ITEMS.map((item) => {
            const isSelected = selectedTech.name === item.name
            return (
              <button
                key={item.name}
                className={`tech-pill-btn ${isSelected ? 'active' : ''}`}
                onMouseEnter={() => setSelectedTech(item)}
                onClick={() => setSelectedTech(item)}
              >
                <div className="pill-main">
                  <span className="pill-name">{item.name}</span>
                  <span className="pill-cat mono">{item.category}</span>
                </div>
                <div className="pill-badge mono">{item.tag}</div>
                <ChevronRight size={14} className="pill-arrow" />
              </button>
            )
          })}
        </div>

        {/* CODE SNIPPET PREVIEW WINDOW */}
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedTech.name}
            className="tech-code-window"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <div className="window-header">
              <div className="window-dots">
                <span className="dot red" />
                <span className="dot yellow" />
                <span className="dot green" />
              </div>
              <span className="window-title mono">
                <Terminal size={12} /> {selectedTech.name.toLowerCase().replace(/\s+/g, '-')}.tf
              </span>
              <span className="window-stat mono">{selectedTech.stats}</span>
            </div>

            <div className="window-body">
              <pre className="code-block">
                <code>{selectedTech.code}</code>
              </pre>
            </div>

            <div className="window-footer mono">
              <CheckCircle2 size={12} className="text-gold" /> AUDITED IAC BLUEPRINT • PRODUCTION READY
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
