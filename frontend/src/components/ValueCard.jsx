import React from 'react'

export default function ValueCard({ icon, title, children }) {
  return (
    <div className="value-card">
      <div className="value-icon" aria-hidden="true">{icon}</div>
      <h4 className="value-title">{title}</h4>
      <p className="value-desc">{children}</p>
    </div>
  )
}

