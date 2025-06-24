"use client"

import { useState, useEffect } from "react"
import { BarChart, Search, FileText, PieChart, Loader2, AlertCircle } from "lucide-react"
import "../Content.css"
import DashboardSection from "../Dashboard/DashboardSection"

const tabButtonStyles = {
  active: "relative overflow-hidden bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-md",
  inactive: "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200",
}

const ReportSection = () => {
  const [activeTab, setActiveTab] = useState("recipe")

  const [recipeReportMonth, setRecipeReportMonth] = useState(5)
  const [recipeReportYear, setRecipeReportYear] = useState(2025)
  const [recipeReportData, setRecipeReportData] = useState([])
  const [recipeReportLoading, setRecipeReportLoading] = useState(false)
  const [recipeReportError, setRecipeReportError] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")

  const [revenueReportYear, setRevenueReportYear] = useState(2025) // Default to 2025
  const [revenueReportData, setRevenueReportData] = useState([])
  const [revenueReportLoading, setRevenueReportLoading] = useState(false)
  const [revenueReportError, setRevenueReportError] = useState(null)

  const fetchRecipeReport = async () => {
    try {
      setRecipeReportLoading(true)
      setRecipeReportError(null)

      const response = await fetch("http://localhost:8080/api/payments/report", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          month: recipeReportMonth,
          year: recipeReportYear,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to fetch recipe report data")
      }

      const data = await response.json()
      setRecipeReportData(data.report || [])
    } catch (err) {
      console.error("Error fetching recipe report:", err)
      setRecipeReportError("Không thể tải dữ liệu báo cáo món ăn. Vui lòng thử lại sau.")
    } finally {
      setRecipeReportLoading(false)
    }
  }

  // Fetch revenue report data
  const fetchRevenueReport = async () => {
    try {
      setRevenueReportLoading(true)
      setRevenueReportError(null)

      const response = await fetch("http://localhost:8080/api/payments/reportRevenue", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          year: revenueReportYear,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to fetch revenue report data")
      }

      const data = await response.json()
      setRevenueReportData(data.report || [])
    } catch (err) {
      console.error("Error fetching revenue report:", err)
      setRevenueReportError("Không thể tải dữ liệu báo cáo doanh thu. Vui lòng thử lại sau.")
    } finally {
      setRevenueReportLoading(false)
    }
  }

  useEffect(() => {
    if (activeTab === "recipe" && recipeReportMonth && recipeReportYear) {
      fetchRecipeReport()
    }
  }, [recipeReportMonth, recipeReportYear, activeTab])

  const filteredRecipeReportData = recipeReportData.filter(
    (item) =>
      item.DishName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.Category?.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount)
  }

  const monthOptions = Array.from({ length: 12 }, (_, i) => i + 1)

  const yearOptions = Array.from({ length: 11 }, (_, i) => 2020 + i)

  return (
    <div className="space-y-6">
      <DashboardSection title="Báo cáo" icon={<FileText className="h-5 w-5" />}>
        {/* Tab navigation */}
        <div className="mb-6">
          <div className="grid grid-cols-2 gap-2 p-1 bg-gray-100 rounded-xl">
            <button
              className={`relative flex items-center justify-center py-3 px-4 text-sm font-medium rounded-lg transition-all duration-300 ${
                activeTab === "recipe" ? tabButtonStyles.active : tabButtonStyles.inactive
              }`}
              onClick={() => setActiveTab("recipe")}
            >
              <BarChart className={`h-5 w-5 ${activeTab === "recipe" ? "text-white" : "text-indigo-500"} mr-2`} />
              <span>Báo cáo món ăn</span>
              {activeTab === "recipe" && (
                <span
                  className="absolute inset-0 bg-white opacity-20 rounded-lg"
                  style={{
                    background:
                      "linear-gradient(45deg, transparent 25%, rgba(255,255,255,0.2) 25%, rgba(255,255,255,0.2) 50%, transparent 50%, transparent 75%, rgba(255,255,255,0.2) 75%)",
                    backgroundSize: "4px 4px",
                  }}
                />
              )}
            </button>
            <button
              className={`relative flex items-center justify-center py-3 px-4 text-sm font-medium rounded-lg transition-all duration-300 ${
                activeTab === "revenue" ? tabButtonStyles.active : tabButtonStyles.inactive
              }`}
              onClick={() => setActiveTab("revenue")}
            >
              <PieChart className={`h-5 w-5 ${activeTab === "revenue" ? "text-white" : "text-indigo-500"} mr-2`} />
              <span>Báo cáo doanh thu</span>
              {activeTab === "revenue" && (
                <span
                  className="absolute inset-0 bg-white opacity-20 rounded-lg"
                  style={{
                    background:
                      "linear-gradient(45deg, transparent 25%, rgba(255,255,255,0.2) 25%, rgba(255,255,255,0.2) 50%, transparent 50%, transparent 75%, rgba(255,255,255,0.2) 75%)",
                    backgroundSize: "4px 4px",
                  }}
                />
              )}
            </button>
          </div>
        </div>

        {/* Recipe Report Tab */}
        {activeTab === "recipe" && (
          <div>
            <div className="flex flex-wrap gap-4 mb-4 items-end">
              <div className="form-group">
                <label htmlFor="month" className="form-label">
                  Tháng
                </label>
                <select
                  id="month"
                  className="form-input"
                  value={recipeReportMonth}
                  onChange={(e) => setRecipeReportMonth(Number(e.target.value))}
                >
                  {monthOptions.map((month) => (
                    <option key={month} value={month}>
                      Tháng {month}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="year" className="form-label">
                  Năm
                </label>
                <select
                  id="year"
                  className="form-input"
                  value={recipeReportYear}
                  onChange={(e) => setRecipeReportYear(Number(e.target.value))}
                >
                  {yearOptions.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="order-search-container">
              <Search className="order-search-icon h-4 w-4" />
              <input
                type="text"
                placeholder="Tìm kiếm theo tên món hoặc danh mục..."
                className="order-search-input"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {recipeReportError && (
              <div className="error-alert">
                <AlertCircle className="h-5 w-5" />
                {recipeReportError}
              </div>
            )}

            {recipeReportLoading ? (
              <div className="loading-container">
                <Loader2 className="h-8 w-8 loading-spinner" />
                <span className="ml-2 text-gray-600">Đang tải dữ liệu báo cáo...</span>
              </div>
            ) : (
              <>
                {filteredRecipeReportData.length === 0 ? (
                  <div className="empty-state">
                    <p>
                      Không có dữ liệu báo cáo cho tháng {recipeReportMonth}/{recipeReportYear}.
                    </p>
                  </div>
                ) : (
                  <div className="overflow-x-auto w-full">
                    <table className="orders-table">
                      <thead>
                        <tr>
                          <th>Tên món</th>
                          <th>Danh mục</th>
                          <th>Tổng số lượng đã đặt</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredRecipeReportData.map((item, index) => (
                          <tr key={index}>
                            <td className="font-medium">{item.DishName}</td>
                            <td>{item.Category}</td>
                            <td>
                              <span className="quantity-badge">{item.TotalQuantityOrdered}</span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* Revenue Report Tab */}
        {activeTab === "revenue" && (
          <div>
            <div className="flex flex-wrap gap-4 mb-4 items-end">
              <div className="form-group">
                <label htmlFor="revenueYear" className="form-label">
                  Năm
                </label>
                <select
                  id="revenueYear"
                  className="form-input"
                  value={revenueReportYear}
                  onChange={(e) => setRevenueReportYear(Number(e.target.value))}
                >
                  {yearOptions.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>
              <button onClick={fetchRevenueReport} className="refresh-button" disabled={revenueReportLoading}>
                {revenueReportLoading ? <Loader2 className="h-4 w-4 mr-2 loading-spinner" /> : null}
                Tạo báo cáo
              </button>
            </div>

            {revenueReportError && (
              <div className="error-alert">
                <AlertCircle className="h-5 w-5" />
                {revenueReportError}
              </div>
            )}

            {revenueReportLoading ? (
              <div className="loading-container">
                <Loader2 className="h-8 w-8 loading-spinner" />
                <span className="ml-2 text-gray-600">Đang tải dữ liệu báo cáo doanh thu...</span>
              </div>
            ) : (
              <>
                {revenueReportData.length === 0 ? (
                  <div className="empty-state">
                    <p>Không có dữ liệu báo cáo doanh thu cho năm {revenueReportYear}.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto w-full">
                    <table className="orders-table">
                      <thead>
                        <tr>
                          <th>Tháng</th>
                          <th>Tổng số đơn hàng</th>
                          <th>Tổng doanh thu</th>
                        </tr>
                      </thead>
                      <tbody>
                        {revenueReportData.map((item, index) => (
                          <tr key={index}>
                            <td className="font-medium">Tháng {item.Month}</td>
                            <td>{item.TotalOrders}</td>
                            <td className="font-medium">{formatCurrency(item.TotalRevenue)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </DashboardSection>
    </div>
  )
}

export default ReportSection
