"use client"

import { useState, useEffect } from "react"
import { X, Clock, Eye, Heart, MessageCircle, Users, AlertTriangle } from "lucide-react"
import "bootstrap/dist/css/bootstrap.min.css"

const CommentSection = ({ icon }) => {
  const [recipes, setRecipes] = useState([])
  const [comments, setComments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedRecipe, setSelectedRecipe] = useState(null)
  const [showModal, setShowModal] = useState(false)

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
      await Promise.all([fetchRecipes(), fetchComments()])
      setLoading(false)
    }
    loadData()
  }, [])

  const handleRecipeClick = (recipe) => {
    setSelectedRecipe(recipe)
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setSelectedRecipe(null)
  }

  const getImageUrl = (imagePath) => {
    if (!imagePath) return "/assets/default_recipe.png"
    return `http://localhost:8080${imagePath}`
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  // Tạo map để ánh xạ recipeId sang recipeName và image
  const recipeMap = recipes.reduce(
    (map, recipe) => {
      map.name[recipe.recipeId] = recipe.recipeName
      map.image[recipe.recipeId] = recipe.image
      return map
    },
    { name: {}, image: {} }
  )

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div className="d-flex align-items-center">
          {icon && <span className="me-2">{icon}</span>}
          <h2 className="h4 fw-bold text-dark">Quản lý Công thức</h2>
        </div>
        <button onClick={() => Promise.all([fetchRecipes(), fetchComments()])} className="btn btn-outline-primary">
          Làm mới
        </button>
      </div>

      <div>
        {loading ? (
          <div className="text-center">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : error ? (
          <div className="alert alert-danger d-flex align-items-center" role="alert">
            <AlertTriangle className="me-2" size={24} />
            <span>{error}</span>
          </div>
        ) : (
          <>
            {/* Danh sách bình luận */}
            <div className="mb-5">
              <h3 className="h5 fw-bold mb-3 d-flex align-items-center">
                <MessageCircle className="me-2 text-success" size={20} />
                Bình luận mới nhất
              </h3>
              {comments.length === 0 ? (
                <div className="text-center text-muted">
                  <p>Chưa có bình luận nào.</p>
                </div>
              ) : (
                <div className="list-group" style={{ maxHeight: "400px", overflowY: "auto" }}>
                  {comments
                    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                    .map((comment) => (
                      <div
                        key={comment.commentId}
                        className="list-group-item list-group-item-action p-3 d-flex flex-column flex-md-row align-items-md-center gap-3"
                      >
                        <div className="flex-grow-1">
                          <div className="d-flex justify-content-between mb-2">
                            <span className="fw-medium text-dark">
                              {comment.commentUser.fullName} bình luận về "{recipeMap.name[comment.recipeId] || "Công thức không xác định"}"
                            </span>
                            <span className="text-muted small">{formatDate(comment.createdAt)}</span>
                          </div>
                          <p className="mb-1 text-dark">{comment.content}</p>
                          <div className="text-muted small">
                            Công thức đăng bởi: {comment.recipeUser.fullName}
                          </div>
                        </div>
                        <div className="flex-shrink-0">
                          <img
                            src={getImageUrl(recipeMap.image[comment.recipeId])}
                            alt={recipeMap.name[comment.recipeId] || "Công thức"}
                            className="rounded-3 object-fit-cover"
                            style={{ width: "48px", height: "48px", border: "2px solid #fd7e14" }}
                            onError={(e) => {
                              e.target.onerror = null
                              e.target.src = "/assets/default_recipe.png"
                            }}
                          />
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>

            {/* Danh sách công thức */}
            {recipes.length === 0 ? (
              <div className="text-center text-muted">
                <p>Không tìm thấy công thức nào.</p>
              </div>
            ) : (
              <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 row-cols-xl-4 g-4">
                {recipes.map((recipe) => (
                  <div
                    key={recipe.recipeId}
                    className="col"
                    onClick={() => handleRecipeClick(recipe)}
                  >
                    <div className="card h-100 shadow-sm hover-shadow">
                      <div className="overflow-hidden">
                        <img
                          src={getImageUrl(recipe.image) || "/placeholder.svg"}
                          alt={recipe.recipeName}
                          className="card-img-top object-fit-cover"
                          style={{ height: "192px" }}
                          onError={(e) => {
                            e.target.onerror = null
                            e.target.src = "/assets/default_recipe.png"
                          }}
                        />
                      </div>
                      <div className="card-body">
                        <h3 className="card-title h5 fw-semibold text-dark mb-2 text-truncate">
                          {recipe.recipeName}
                        </h3>
                        <div className="d-flex justify-content-between text-muted mb-3">
                          <div className="d-flex align-items-center">
                            <Clock className="me-1" size={16} />
                            <span>{recipe.cookingTime}</span>
                          </div>
                          <div className="d-flex align-items-center">
                            <Users className="me-1" size={16} />
                            <span>{recipe.ration}</span>
                          </div>
                        </div>
                        <div className="d-flex justify-content-between text-sm">
                          <div className="d-flex align-items-center gap-3">
                            <div className="d-flex align-items-center text-danger">
                              <Heart className="me-1" size={16} />
                              <span>{recipe.likeQuantity}</span>
                            </div>
                            <div className="d-flex align-items-center text-primary">
                              <Eye className="me-1" size={16} />
                              <span>{recipe.viewCount}</span>
                            </div>
                            <div className="d-flex align-items-center text-success">
                              <MessageCircle className="me-1" size={16} />
                              <span>{recipe.comments.length}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* Recipe Detail Modal */}
      {showModal && selectedRecipe && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          onClick={closeModal}
        >
          <div
            className="modal-dialog modal-xl modal-dialog-scrollable"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-content">
              <div className="modal-header">
                <h2 className="modal-title h4 fw-bold">{selectedRecipe.recipeName}</h2>
                <button
                  type="button"
                  className="btn-close"
                  onClick={closeModal}
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body">
                <div className="row g-4 mb-4">
                  <div className="col-lg-6">
                    <img
                      src={getImageUrl(selectedRecipe.image) || "/placeholder.svg"}
                      alt={selectedRecipe.recipeName}
                      className="img-fluid rounded-3"
                      style={{ border: "4px solid #fd7e14" }}
                      onError={(e) => {
                        e.target.onerror = null
                        e.target.src = "/placeholder.svg?height=256&width=400"
                      }}
                    />
                  </div>
                  <div className="col-lg-6">
                    <div className="row g-3">
                      <div className="col-6 d-flex align-items-center">
                        <Clock className="me-2 text-primary" size={20} />
                        <span>{selectedRecipe.cookingTime}</span>
                      </div>
                      <div className="col-6 d-flex align-items-center">
                        <Users className="me-2 text-success" size={20} />
                        <span>{selectedRecipe.ration}</span>
                      </div>
                      <div className="col-6 d-flex align-items-center">
                        <Heart className="me-2 text-danger" size={20} />
                        <span>{selectedRecipe.likeQuantity} lượt thích</span>
                      </div>
                      <div className="col-6 d-flex align-items-center">
                        <Eye className="me-2 text-primary" size={20} />
                        <span>{selectedRecipe.viewCount} lượt xem</span>
                      </div>
                    </div>

                    {selectedRecipe.tags && selectedRecipe.tags.length > 0 && (
                      <div className="mt-4">
                        <h4 className="fw-semibold mb-2">Thẻ:</h4>
                        <div className="d-flex flex-wrap gap-2">
                          {selectedRecipe.tags.map((tag) => (
                            <span
                              key={tag.tagId}
                              className="badge bg-primary-subtle text-primary-emphasis rounded-pill"
                            >
                              {tag.tagName}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {selectedRecipe.comments && selectedRecipe.comments.length > 0 && (
                  <div className="mb-4">
                    <h3 className="h5 fw-semibold mb-3 d-flex align-items-center">
                      <MessageCircle className="me-2 text-success" size={20} />
                      Bình luận ({selectedRecipe.comments.length})
                    </h3>
                    <div className="d-flex flex-column gap-3">
                      {selectedRecipe.comments
                        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                        .map((comment) => (
                          <div
                            key={comment.commentId}
                            className="p-3 bg-light border border-light-subtle rounded-3"
                          >
                            <div className="d-flex justify-content-between mb-2">
                              <span className="fw-medium text-dark">{comment.userName}</span>
                              <span className="text-muted small">{formatDate(comment.createdAt)}</span>
                            </div>
                            <p className="mb-0 text-dark">{comment.content}</p>
                          </div>
                        ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default CommentSection