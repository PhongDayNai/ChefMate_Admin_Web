"use client"

import { useState, useEffect } from "react"
import "./App.css"
import Sidebar from "./SideBar"
import Content from "./Content"
import Header from "./Header"
import CallStaffNotification from "./CallStaffNotification"

function App() {
  const [selectedPage, setSelectedPage] = useState("dashboard")
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setSidebarOpen(false)
      }
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  return (
    <>
      <CallStaffNotification />
      <div className="App">
        <Sidebar onSelect={setSelectedPage} selectedPage={selectedPage} isOpen={sidebarOpen} />

        <div className="content-container">
          <Header toggleSidebar={toggleSidebar} />
          <Content selectedPage={selectedPage} />
        </div>
      </div>
    </>
  )
}

export default App
