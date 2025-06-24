"use client"

import { useState, useEffect } from "react"
import { FileText, Loader2, AlertTriangle } from "lucide-react"
import "bootstrap/dist/css/bootstrap.min.css"
import DashboardSection from "../Dashboard/DashboardSection"

const ReportSection = () => {
  const [reportData, setReportData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchReport = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch("http://localhost:8080/api/recipes/growth-report", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        throw new Error("Failed to fetch recipe growth report")
      }

      const data = await response.json()
      setReportData(data.data || [])
    } catch (err) {
      console.error("Error fetching recipe growth report:", err)
      setError("Không thể tải dữ liệu báo cáo. Vui lòng thử lại sau.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchReport()
  }, [])

  return (
    <div className="container py-4">
      <DashboardSection title="Báo cáo Số lượng Công thức" icon={<FileText className="h-5 w-5" />}>
        {error && (
          <div className="alert alert-danger d-flex align-items-center" role="alert">
            <AlertTriangle className="me-2" size={24} />
            <span>{error}</span>
          </div>
        )}

        {loading ? (
          <div className="text-center">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <span className="ms-2 text-muted">Đang tải dữ liệu báo cáo...</span>
          </div>
        ) : reportData.length === 0 ? (
          <div className="text-center text-muted">
            <p>Không có dữ liệu báo cáo.</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table table-striped table-hover">
              <thead>
                <tr>
                  <th scope="col" className="fw-medium">
                    Tháng
                  </th>
                  <th scope="col" className="fw-medium">
                    Năm
                  </th>
                  <th scope="col" className="fw-medium">
                    Số lượng công thức
                  </th>
                </tr>
              </thead>
              <tbody>
                {reportData.map((item, index) => (
                  <tr key={index}>
                    <td>Tháng {item.month}</td>
                    <td>{item.year}</td>
                    <td>
                      <span className="badge bg-primary">{item.recipeCount}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </DashboardSection>
    </div>
  )
}

export default ReportSection