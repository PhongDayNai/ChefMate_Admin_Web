"use client"

import "../Content.css"

const DashboardSection = ({ title, children, icon }) => (
    <div className="dashboard-section">
      <div className="section-header">
        <div className="section-title">
          {icon && <span className="section-icon">{icon}</span>}
          <h2 className="text-lg font-medium text-gray-900">{title}</h2>
        </div>
      </div>
      <div className="section-content">{children}</div>
    </div>
)

export default DashboardSection;
