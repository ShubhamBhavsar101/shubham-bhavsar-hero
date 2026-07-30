import { useState, useEffect } from 'react'

export default function Typewriter({ roles }) {
  const [roleIndex, setRoleIndex] = useState(0)
  const [charIndex, setCharIndex] = useState(0)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    const currentRole = roles[roleIndex]
    let timer

    if (!isDeleting && charIndex < currentRole.length) {
      timer = setTimeout(() => setCharIndex((prev) => prev + 1), 80)
    } else if (!isDeleting && charIndex === currentRole.length) {
      timer = setTimeout(() => setIsDeleting(true), 2000)
    } else if (isDeleting && charIndex > 0) {
      timer = setTimeout(() => setCharIndex((prev) => prev - 1), 40)
    } else if (isDeleting && charIndex === 0) {
      setIsDeleting(false)
      setRoleIndex((prev) => (prev + 1) % roles.length)
    }

    return () => clearTimeout(timer)
  }, [charIndex, isDeleting, roleIndex, roles])

  return (
    <span className="dynamic-role">
      {roles[roleIndex].substring(0, charIndex)}
    </span>
  )
}
