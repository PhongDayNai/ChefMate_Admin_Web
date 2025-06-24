"use client"

import {
  ShoppingBag,
  DollarSign,
  Coffee,
  Clock,
  Users,
} from "lucide-react"
import "../Content.css"
import DashboardCard from "./DashboardCard";
import DashboardSection from "./DashboardSection";

const Dashboard = () => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 dashboard-grid">
      <DashboardCard
        title="Total Users"
        value="156"
        change="+12.5%"
        icon={<ShoppingBag className="h-6 w-6 text-indigo-600" />}
        color="bg-indigo-100"
        bgColor="card-gradient-indigo"
      />
      <DashboardCard
        title="Total Recipes"
        value="4,320"
        change="+8.2%"
        icon={<DollarSign className="h-6 w-6 text-green-600" />}
        color="bg-green-100"
        bgColor="card-gradient-green"
      />
      <DashboardCard
        title="Total Comments"
        value="12/20"
        change="-2"
        icon={<Coffee className="h-6 w-6 text-blue-600" />}
        color="bg-blue-100"
        bgColor="card-gradient-blue"
      />
    </div>
  </div>
)

export default Dashboard;
