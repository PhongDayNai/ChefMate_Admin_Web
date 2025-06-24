"use client"

import { useState, useEffect } from "react"
import { X, Clock, Eye, Heart, MessageCircle, Users, ChefHat, AlertTriangle } from "lucide-react"
import "bootstrap/dist/css/bootstrap.min.css"

const RecipeSection = ({ icon }) => {
  const [recipes, setRecipes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedRecipe, setSelectedRecipe] = useState(null)
  const [showModal, setShowModal] = useState(false)

  const fetchRecipes = async () => {
    try {
      setLoading(true)
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
      setError(null)
    } catch (err) {
      console.error("Lấy dữ liệu công thức thất bại:", err)
      setError("Không thể tải dữ liệu công thức. Vui lòng thử lại sau.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchRecipes()
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

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div className="d-flex align-items-center">
          {icon && <span className="me-2">{icon}</span>}
          <h2 className="h4 fw-bold text-dark">Quản lý Công thức</h2>
        </div>
        <button onClick={fetchRecipes} className="btn btn-outline-primary">
          Làm mới Công thức
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
        ) : recipes.length === 0 ? (
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
                  <div className="recipe-image-container overflow-hidden">
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
                        <span>{recipe.ration} người</span>
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
                        <span>{selectedRecipe.ration} người</span>
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

                {selectedRecipe.ingredients && selectedRecipe.ingredients.length > 0 && (
                  <div className="mb-4">
                    <h3 className="h5 fw-semibold mb-3 d-flex align-items-center">
                      <ChefHat className="me-2 text-primary" size={20} />
                      Nguyên liệu
                    </h3>
                    <div className="row row-cols-1 row-cols-md-2 g-3">
                      {selectedRecipe.ingredients.map((ingredient) => (
                        <div
                          key={ingredient.ingredientId}
                          className="d-flex justify-content-between align-items-center p-3 bg-primary-subtle border border-primary-subtle rounded-3"
                        >
                          <span className="fw-medium">{ingredient.ingredientName}</span>
                          <span className="text-primary fw-semibold">
                            {ingredient.weight} {ingredient.unit.toLowerCase()}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {selectedRecipe.cookingSteps && selectedRecipe.cookingSteps.length > 0 && (
                  <div>
                    <h3 className="h5 fw-semibold mb-3">Cách làm</h3>
                    <div className="d-flex flex-column gap-3">
                      {selectedRecipe.cookingSteps
                        .sort((a, b) => a.indexStep - b.indexStep)
                        .map((step) => (
                          <div
                            key={step.indexStep}
                            className="d-flex gap-3 p-3 bg-primary-subtle border border-primary-subtle rounded-3"
                          >
                            <div
                              className="flex-shrink-0 w-8 h-8 bg-primary text-white rounded-circle d-flex align-items-center justify-content-center fw-semibold"
                            >
                              {step.indexStep}
                            </div>
                            <div className="flex-1">
                              <p className="mb-0">{step.stepContent}</p>
                            </div>
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

export default RecipeSection