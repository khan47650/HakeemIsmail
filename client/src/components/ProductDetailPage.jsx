import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FiArrowLeft, FiTrash2, FiArrowRight } from "react-icons/fi";
import { toast } from "react-toastify";

import api from "../api/api";
import { useAuth } from "../context/AuthContext";
import "../css/ProductDetail.css";

function ProductDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user, isAdmin } = useAuth();

    const [product, setProduct] = useState(null);
    const [allProducts, setAllProducts] = useState([]);
    const [reviews, setReviews] = useState([]);
    const [reviewText, setReviewText] = useState("");
    const [recommendedProducts, setRecommendedProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadingReviews, setLoadingReviews] = useState(false);

    const canReview = user && !isAdmin;

    const getArray = (data) => {
        if (Array.isArray(data)) return data;
        if (Array.isArray(data?.products)) return data.products;
        if (Array.isArray(data?.data)) return data.data;
        return [];
    };

    const fetchProductData = async () => {
        try {
            setLoading(true);

            const res = await api.get("/products");
            const products = getArray(res.data);

            const selectedProduct = products.find((item) => item._id === id);

            setAllProducts(products);
            setProduct(selectedProduct || null);

            const recommended = products
                .filter((item) => item._id !== id)
                .slice(-3)
                .reverse();

            setRecommendedProducts(recommended);
        } catch (error) {
            console.log(error);
            toast.error("Failed to load product");
        } finally {
            setLoading(false);
        }
    };

    const fetchReviews = async () => {
        if (!id) return;

        try {
            setLoadingReviews(true);
            const res = await api.get(`/reviews/product/${id}`);
            setReviews(getArray(res.data));
        } catch (error) {
            console.log(error);
        } finally {
            setLoadingReviews(false);
        }
    };

    useEffect(() => {
        fetchProductData();
        fetchReviews();
        setReviewText("");
        window.scrollTo({ top: 0, behavior: "smooth" });
    }, [id]);

    const handleBuy = () => {
        if (!product) return;

        const message = `
Assalam o Alaikum,

Mujhe ye product buy karna hai.

Product: ${product.name}
Price: Rs. ${product.price}

Image:
${product.image}
`;

        const url = `https://wa.me/923054800448?text=${encodeURIComponent(message)}`;
        window.open(url, "_blank");
    };

    const handleAddReview = async () => {
        if (!user) {
            toast.error("Please login first");
            return;
        }

        if (!reviewText.trim()) {
            toast.error("Please write your review");
            return;
        }

        try {
            const res = await api.post("/reviews", {
                productId: id,
                userId: user.id || user._id,
                userName:
                    user.name ||
                    `${user.firstName || ""} ${user.lastName || ""}`.trim() ||
                    "User",
                review: reviewText,
            });

            setReviews((prev) => [res.data, ...prev]);
            setReviewText("");
            toast.success("Review added successfully");
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to add review");
        }
    };

    const handleDeleteReview = async (reviewId) => {
        try {
            await api.delete(`/reviews/${reviewId}`, {
                data: { isAdmin },
            });

            setReviews((prev) => prev.filter((item) => item._id !== reviewId));
            toast.success("Review deleted");
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to delete review");
        }
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        });
    };

    if (loading) {
        return (
            <main className="product-detail-page">
                <button className="product-back-btn" onClick={() => navigate(-1)}>
                    <FiArrowLeft />
                </button>

                <div className="product-detail-loading">
                    Loading product...
                </div>
            </main>
        );
    }

    if (!product) {
        return (
            <main className="product-detail-page">
                <button className="product-back-btn" onClick={() => navigate(-1)}>
                    <FiArrowLeft />
                </button>

                <div className="product-detail-loading">
                    Product not found.
                </div>
            </main>
        );
    }

    return (
        <main className="product-detail-page">
            <button className="product-back-btn" onClick={() => navigate(-1)}>
                <FiArrowLeft />
            </button>

            <section className="product-detail-hero page-reveal">
                <div className="product-detail-image-area">
                    <img
                        src={product.image}
                        alt={product.name}
                        className="product-detail-main-image"
                    />
                </div>

                <div className="product-detail-info-area">
                    <span className="product-detail-badge">
                        {product.category === "popular" ? "Popular Product" : "Herbal Product"}
                    </span>

                    <h1>{product.name}</h1>

                    <p className="product-detail-price-text">Rs. {product.price}</p>

                    <div className="product-detail-description">
                        <h3>Description</h3>
                        <p>{product.description}</p>
                    </div>

                    <button className="product-detail-buy-now" onClick={handleBuy}>
                        Buy Now
                    </button>
                </div>
            </section>

            <section className="product-detail-reviews page-reveal">
                <div className="product-section-heading">
                    <h2>Reviews</h2>
                    <p>Customer opinions and feedback about this product.</p>
                </div>

                {canReview && (
                    <div className="review-input-area">
                        <textarea
                            value={reviewText}
                            onChange={(e) => setReviewText(e.target.value)}
                            placeholder="Write your review..."
                        />

                        <button onClick={handleAddReview}>Add Review</button>
                    </div>
                )}

                {loadingReviews ? (
                    <div className="reviews-empty-box">Loading reviews...</div>
                ) : reviews.length === 0 ? (
                    <div className="reviews-empty-box">No reviews yet.</div>
                ) : (
                    <div className="reviews-list">
                        {reviews.map((item) => (
                            <div className="review-row" key={item._id}>


                                <div className="review-row-top">
                                    <div className="review-user">
                                        <div className="review-avatar">
                                            {item.userName?.charAt(0).toUpperCase()}
                                        </div>

                                        <div>
                                            <strong>{item.userName}</strong>
                                            <small>{formatDate(item.createdAt)}</small>
                                        </div>
                                    </div>

                                    {isAdmin && (
                                        <button
                                            className="review-delete-btn"
                                            onClick={() => handleDeleteReview(item._id)}
                                        >
                                            <FiTrash2 />
                                        </button>
                                    )}
                                </div>

                                <p>{item.review}</p>
                            </div>
                        ))}
                    </div>
                )}
            </section>

            {recommendedProducts.length > 0 && (
                <section className="recommended-section page-reveal">
                    <div className="product-section-heading">
                        <h2>Recommended Products</h2>
                        <p>Explore more herbal products you may like.</p>
                    </div>

                    <div className="recommended-grid">
                        {recommendedProducts.map((item) => (
                            <div
                                className="recommended-card"
                                key={item._id}
                                onClick={() => navigate(`/products/${item._id}`)}
                            >
                                <div className="recommended-image-box">
                                    <img src={item.image} alt={item.name} />
                                </div>

                                <div className="recommended-content">
                                    <h3>{item.name}</h3>
                                    <p>Rs. {item.price}</p>

                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            navigate(`/products/${item._id}`);
                                        }}
                                    >
                                        View Product <FiArrowRight />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            )}
        </main>
    );
}

export default ProductDetailPage;