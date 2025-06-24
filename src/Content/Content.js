"use client"

import { BookOpen } from "lucide-react"
import "./Content.css"
import Dashboard from "./Dashboard/Dashboard"
import UserManagement from "./User/UserSection"
import ReportSection from "./Report/ReportSection"
import RecipeManager from "./Recipe/RecipeSection"
import CommentManager from "./Comment/CommentSection"

const Content = ({ selectedPage }) => {
  switch (selectedPage) {
    case "dashboard":
      return <Dashboard />
    case "user":
      return <UserManagement />
    case "recipe":
      return <RecipeManager icon={<BookOpen className="h-5 w-5" />} />
    case "comment":
      return <CommentManager icon={<BookOpen className="h-5 w-5" />} />
    case "reports":
      return <ReportSection />
    default:
      return <Dashboard />
  }
}

export default Content
