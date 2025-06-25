"use client"

import { useState, useEffect } from "react"
import { FileText, AlertTriangle } from "lucide-react"
import "bootstrap/dist/css/bootstrap.min.css"
import DashboardSection from "../Dashboard/DashboardSection"
import { Line } from "react-chartjs-2"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js"

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)

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

  // Chuẩn bị dữ liệu cho biểu đồ
  const chartData = {
    labels: reportData.map(item => `Tháng ${item.month}/${item.year}`),
    datasets: [
      {
        label: "Số lượng công thức",
        data: reportData.map(item => item.recipeCount),
        borderColor: "rgb(75, 192, 192)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        tension: 0.1,
      },
    ],
  }

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Báo cáo Tăng trưởng Số lượng Công thức",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Số lượng công thức",
        },
      },
      x: {
        title: {
          display: true,
          text: "Thời gian",
        },
      },
    },
  }

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
              <span className="visually-hidden">Đang tải...</span>
            </div>
            <span className="ms-2 text-muted">Đang tải dữ liệu báo cáo...</span>
          </div>
        ) : reportData.length === 0 ? (
          <div className="text-center text-muted">
            <p>Không có dữ liệu báo cáo.</p>
          </div>
        ) : (
          <>
            {/* Biểu đồ */}
            <div className="mb-5">
              <Line data={chartData} options={chartOptions} />
            </div>

            {/* Bảng dữ liệu */}
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
          </>
        )}
      </DashboardSection>
    </div>
  )
}

export default ReportSection