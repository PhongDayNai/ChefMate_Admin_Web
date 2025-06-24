"use client"

import {
  ShoppingBag,
  DollarSign,
  Coffee,
  Clock,
  TrendingUp,
  Users,
  ArrowUpRight,
} from "lucide-react"
import "../Content.css"

const DashboardCard = ({ title, value, change, icon, color, bgColor }) => (
  <div className={`dashboard-card ${bgColor}`}>
    <div className="card-content">
      <div className="card-info">
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <h3>{value}</h3>
        <div className={`card-trend ${change.startsWith("+") ? "trend-up" : "trend-down"}`}>
          {change.startsWith("+") ? (
            <TrendingUp className="h-3 w-3 mr-1" />
          ) : (
            <ArrowUpRight className="h-3 w-3 mr-1 transform rotate-90" />
          )}
          {change}
        </div>
      </div>
      <div className={`card-icon ${color}`}>{icon}</div>
    </div>
  </div>
)

export default DashboardCard;