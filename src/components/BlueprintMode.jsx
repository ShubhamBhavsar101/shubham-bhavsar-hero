import { useEffect, useState } from 'react'
import { Compass, Ruler } from 'lucide-react'

export default function BlueprintMode() {
  const [blueprint, setBlueprint] = useState(false)

  useEffect(() => {
    document.body.classList.toggle('blueprint-mode', blueprint)
    return () => document.body.classList.remove('blueprint-mode')
  }, [blueprint])

  return (
    <div className="blueprint-toggle" role="group" aria-label="Blueprint mode switcher">
      <button
        className={`mode-btn ${!blueprint ? 'active' : ''}`}
        onClick={() => setBlueprint(false)}
        aria-pressed={!blueprint}
      >
        <Compass size={12} /> Editorial
      </button>
      <button
        className={`mode-btn ${blueprint ? 'active' : ''}`}
        onClick={() => setBlueprint(true)}
        aria-pressed={blueprint}
      >
        <Ruler size={12} /> Blueprint
      </button>
    </div>
  )
}
