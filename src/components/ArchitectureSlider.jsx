import { useState, useRef } from 'react'
import { SlidersHorizontal, AlertTriangle, CheckCircle, ArrowRight, Zap, ShieldCheck } from 'lucide-react'

export default function ArchitectureSlider() {
  const [sliderPos, setSliderPos] = useState(50)
  const containerRef = useRef(null)

  const handleMove = (clientX) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width))
    const percent = (x / rect.width) * 100
    setSliderPos(percent)
  }

  const onMouseMove = (e) => handleMove(e.clientX)

  const onTouchMove = (e) => {
    if (e.touches[0]) handleMove(e.touches[0].clientX)
  }

  return (
    <div className="arch-slider-wrapper">
      <div className="arch-slider-header">
        <div>
          <span className="mono text-gold">INTERACTIVE ARCHITECTURE DIFF</span>
          <h4 className="arch-slider-headline">
            Legacy Monolith vs. <span className="serif-it">Refactored Cloud IaC</span>
          </h4>
        </div>
        <div className="arch-slider-hint mono">
          <SlidersHorizontal size={14} /> Move Cursor to Compare
        </div>
      </div>

      <div
        ref={containerRef}
        className="arch-slider-container"
        onMouseMove={onMouseMove}
        onTouchMove={onTouchMove}
      >
        {/* AFTER CARD (Base / Right Side) */}
        <div className="arch-card arch-card-after">
          <div className="arch-card-badge after-badge mono">
            <CheckCircle size={12} /> REFACTORED IAC (AFTER)
          </div>
          <div className="arch-metrics-grid">
            <div className="arch-stat-box">
              <span className="arch-stat-num text-gold">$6.2k</span>
              <span className="arch-stat-label mono">AWS Monthly Cost</span>
              <span className="arch-stat-change positive">-50% Cost</span>
            </div>
            <div className="arch-stat-box">
              <span className="arch-stat-num text-gold">38ms</span>
              <span className="arch-stat-label mono">P99 API Latency</span>
              <span className="arch-stat-change positive">10x Speed</span>
            </div>
            <div className="arch-stat-box">
              <span className="arch-stat-num text-gold">4.2 min</span>
              <span className="arch-stat-label mono">CI/CD Deploy Time</span>
              <span className="arch-stat-change positive">50% Faster</span>
            </div>
          </div>
          <div className="arch-specs-list">
            <div className="arch-spec-item">
              <Zap size={14} className="text-gold" />
              <span><strong>AWS Lambda (Zip Packages):</strong> Instant cold starts & lightweight deployment artifacts.</span>
            </div>
            <div className="arch-spec-item">
              <ShieldCheck size={14} className="text-gold" />
              <span><strong>Datadog Managed MSK:</strong> Right-sized brokers with dynamic memory caching layers.</span>
            </div>
            <div className="arch-spec-item">
              <CheckCircle size={14} className="text-gold" />
              <span><strong>Modular Terraform:</strong> Reproducible environment blueprints for Dev, Staging & Prod.</span>
            </div>
          </div>
        </div>

        {/* BEFORE CARD (Clipped Left Side) */}
        <div
          className="arch-card arch-card-before"
          style={{ clipPath: `polygon(0 0, ${sliderPos}% 0, ${sliderPos}% 100%, 0 100%)` }}
        >
          <div className="arch-card-badge before-badge mono">
            <AlertTriangle size={12} /> LEGACY ARCHITECTURE (BEFORE)
          </div>
          <div className="arch-metrics-grid">
            <div className="arch-stat-box">
              <span className="arch-stat-num text-wine">$12.4k</span>
              <span className="arch-stat-label mono">AWS Monthly Cost</span>
              <span className="arch-stat-change negative">Over-provisioned</span>
            </div>
            <div className="arch-stat-box">
              <span className="arch-stat-num text-wine">380ms</span>
              <span className="arch-stat-label mono">P99 API Latency</span>
              <span className="arch-stat-change negative">High Latency</span>
            </div>
            <div className="arch-stat-box">
              <span className="arch-stat-num text-wine">8.5 min</span>
              <span className="arch-stat-label mono">CI/CD Deploy Time</span>
              <span className="arch-stat-change negative">Heavy Containers</span>
            </div>
          </div>
          <div className="arch-specs-list">
            <div className="arch-spec-item">
              <AlertTriangle size={14} className="text-wine" />
              <span><strong>Heavy Docker Containers:</strong> Large base images slowing down deployment pipelines.</span>
            </div>
            <div className="arch-spec-item">
              <AlertTriangle size={14} className="text-wine" />
              <span><strong>Unoptimized MSK Brokers:</strong> Idle CPU cycles driving up monthly Cloud bills.</span>
            </div>
            <div className="arch-spec-item">
              <AlertTriangle size={14} className="text-wine" />
              <span><strong>Manual Config:</strong> Unaudited changes across environment drift.</span>
            </div>
          </div>
        </div>

        {/* SLIDER HANDLE */}
        <div
          className="arch-slider-divider"
          style={{ left: `${sliderPos}%` }}
        >
          <div className="arch-slider-line" />
          <div className="arch-slider-button">
            <ArrowRight size={12} style={{ transform: 'rotate(180deg)' }} />
            <ArrowRight size={12} />
          </div>
        </div>
      </div>
    </div>
  )
}
