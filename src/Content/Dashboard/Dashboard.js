"use client"

import { useState, useEffect } from "react"
import {
  UserRound,
  CookingPot,
  AlertTriangle,
  MessageCircle
} from "lucide-react"
import "../Content.css"
import DashboardCard from "./DashboardCard";

const Dashboard = () => {
  const [users, setUsers] = useState([])
  const [recipes, setRecipes] = useState([])
  const [comments, setComments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchUsers = async () => {
    try {
      const data = await fetch("http://localhost:8080/api/users/all", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }).then((res) => res.json())
      console.log(data)
      setUsers(data.data)
      setError(null)
    } catch (err) {
      setError("Failed to load users. Please try again later.")
    } finally {
    }
  }

  const fetchRecipes = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/recipes/all", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        throw new Error(`Lỗi: ${response.status}`)
      }

      const data = await response.json()
      setRecipes(data.data || [])
    } catch (err) {
      console.error("Lấy dữ liệu công thức thất bại:", err)
      setError("Không thể tải dữ liệu công thức. Vui lòng thử lại sau.")
    }
  }

  const fetchComments = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/interactions/comments", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        throw new Error(`Lỗi: ${response.status}`)
      }

      const data = await response.json()
      setComments(data.data || [])
    } catch (err) {
      console.error("Lấy dữ liệu bình luận thất bại:", err)
      setError("Không thể tải dữ liệu bình luận. Vui lòng thử lại sau.")
    }
  }

  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      await Promise.all([fetchUsers(), fetchRecipes(), fetchComments()])
      setLoading(false)
    }
    loadData()
  }, [])

  return (
    <div className="space-y-6">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div className="d-flex align-items-center">
        </div>
        <button onClick={() => Promise.all([fetchUsers(), fetchRecipes(), fetchComments()])} className="btn btn-outline-primary">
          Làm mới
        </button>
      </div>

      <div>
        {loading ? (
          <div className="text-center">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Đang tải...</span>
            </div>
          </div>
        ) : error ? (
          <div className="alert alert-danger d-flex align-items-center" role="alert">
            <AlertTriangle className="me-2" size={24} />
            <span>{error}</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 dashboard-grid">
            <DashboardCard
              title="Số lượng người dùng"
              value={users.length}
              change="+12.5%"
              icon={<UserRound className="h-6 w-6 text-indigo-600" />}
              color="bg-indigo-100"
              bgColor="card-gradient-indigo"
            />
            <DashboardCard
              title="Số lượng công thức"
              value={recipes.length}
              change="+8.2%"
              icon={<CookingPot className="h-6 w-6 text-green-600" />}
              color="bg-green-100"
              bgColor="card-gradient-green"
            />
            <DashboardCard
              title="Số lượng bình luận"
              value={comments.length}
              change="+2"
              icon={<MessageCircle className="h-6 w-6 text-green-600" />}
              color="bg-blue-100"
              bgColor="card-gradient-blue"
            />
          </div>
        )}
      </div>
    </div>
  )
}

export default Dashboard;
