import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
    FiArrowLeft,
    FiTrash2,
    FiArrowRight,
    FiTruck,
    FiShield,
    FiCheckCircle,
    FiMessageCircle,
    FiShoppingBag,
    FiSend,
    FiPackage,
} from "react-icons/fi";
import { toast } from "react-toastify";

import api from "../api/api";
import { useAuth } from "../context/AuthContext";
import SEO from "../components/SEO";
import "../css/ProductDetail.css";

function ProductDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user, isAdmin } = useAuth();

    const [product, setProduct] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [reviewText, setReviewText] = useState("");
    const [recommendedProducts, setRecommendedProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadingReviews, setLoadingReviews] = useState(false);
    const [activeTab, setActiveTab] = useState("about");

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

            // sirf published products (drafts hide)
            const products = getArray(res.data).filter(
                (item) => item.status === "published"
            );

            const selectedProduct = products.find((item) => item._id === id);

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
        setActiveTab("about");
        window.scrollTo({ top: 0, behavior: "smooth" });
    }, [id]);

    // SEO: single Product JSON-LD (price/offers ke saath)
    useEffect(() => {
        if (!product) return;

        const data = {
            "@context": "https://schema.org",
            "@type": "Product",
            name: product.name,
            image: product.image || undefined,
            description:
                product.metaDescription ||
                (product.description
                    ? product.description.replace(/<[^>]+>/g, "").slice(0, 160)
                    : product.name),
            offers: {
                "@type": "Offer",
                priceCurrency: "PKR",
                price: product.price,
                availability: "https://schema.org/InStock",
            },
        };

        const script = document.createElement("script");
        script.type = "application/ld+json";
        script.setAttribute("data-product-jsonld", "true");
        script.text = JSON.stringify(data);
        document.head.appendChild(script);

        return () => {
            document.head
                .querySelectorAll('script[data-product-jsonld="true"]')
                .forEach((el) => el.remove());
        };
    }, [product]);

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

                <div className="product-detail-loading">Loading product...</div>
            </main>
        );
    }

    if (!product) {
        return (
            <main className="product-detail-page">
                <button className="product-back-btn" onClick={() => navigate(-1)}>
                    <FiArrowLeft />
                </button>

                <div className="product-detail-loading">Product not found.</div>
            </main>
        );
    }

    return (
        <main className="product-detail-page">
            <SEO
                title={product.metaTitle || `${product.name} | Hakeem Ismail`}
                description={
                    product.metaDescription ||
                    (product.description
                        ? product.description.replace(/<[^>]+>/g, "").slice(0, 155)
                        : "Explore this herbal product by Hakeem Ismail.")
                }
                canonical={`/products/${product._id}`}
            />

            <button className="product-back-btn" onClick={() => navigate(-1)}>
                <FiArrowLeft />
            </button>

            <section className="product-detail-hero page-reveal">
                <div className="product-detail-left">
                    <div className="product-breadcrumb">
                        Home / Products / Detail
                    </div>

                    <div className="product-detail-image-area">
                        <img
                            src={product.image}
                            alt={product.name}
                            className="product-detail-main-image"
                        />
                    </div>

                    <div className="product-tabs">
                        <button
                            className={activeTab === "about" ? "active" : ""}
                            onClick={() => setActiveTab("about")}
                        >
                            About
                        </button>

                        <button
                            className={activeTab === "reviews" ? "active" : ""}
                            onClick={() => setActiveTab("reviews")}
                        >
                            Reviews
                        </button>
                    </div>

                    {activeTab === "about" && (
                        <div className="product-about-box page-reveal">
                            <h3>About This Product</h3>
                            <div
                                className="quill-content"
                                dangerouslySetInnerHTML={{ __html: product.description }}
                            />
                        </div>
                    )}

                    {activeTab === "reviews" && (
                        <div className="product-review-panel page-reveal">
                            {canReview && (
                                <div className="review-input-area">
                                    <textarea
                                        value={reviewText}
                                        onChange={(e) => setReviewText(e.target.value)}
                                        placeholder="Write your review..."
                                    />

                                    <button onClick={handleAddReview}>
                                        Submit Review <FiSend />
                                    </button>
                                </div>
                            )}

                            {loadingReviews ? (
                                <div className="reviews-empty-box">Loading reviews...</div>
                            ) : reviews.length === 0 ? (
                                <div className="reviews-empty-box">
                                    <FiMessageCircle />
                                    <strong>No reviews yet.</strong>
                                    <span>Be the first to review this product.</span>
                                </div>
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
                        </div>
                    )}
                </div>

                <div className="product-detail-info-area">
                    <span className="product-detail-badge">
                        <FiPackage />
                        {product.category === "popular" ? "Popular Product" : "Herbal Product"}
                    </span>

                    <h1>{product.name}</h1>

                    <p className="product-detail-price-text">Rs. {product.price}</p>

                    <div className="product-tags-row">
                        {product.tags?.length > 0 ? (
                            product.tags.map((tag) => (
                                <span key={tag}>#{tag.replace(/\s+/g, "")}</span>
                            ))
                        ) : (
                            <>
                                <span>Herbal</span>
                                <span>Natural</span>
                                <span>Trusted</span>
                            </>
                        )}
                    </div>

                    <div className="product-detail-divider"></div>

                    <div className="product-benefits">
                        <div className="product-benefit-item">
                            <FiTruck />
                            <div>
                                <strong>Pakistan Delivery</strong>
                                <span>Order herbal products from anywhere in Pakistan.</span>
                            </div>
                        </div>

                        <div className="product-benefit-item">
                            <FiShield />
                            <div>
                                <strong>Authentic Product</strong>
                                <span>Prepared with quality ingredients and expert care.</span>
                            </div>
                        </div>

                        <div className="product-benefit-item">
                            <FiCheckCircle />
                            <div>
                                <strong>Natural Wellness</strong>
                                <span>Helpful for herbal care and natural health support.</span>
                            </div>
                        </div>
                    </div>

                    <div className="confidence-card">
                        <span>Customer Assurance</span>
                        <h2>Buy with confidence</h2>
                        <p>
                            Every product is prepared with care and listed to help customers
                            choose trusted herbal wellness solutions.
                        </p>

                        <div className="confidence-mini-grid">
                            <div>
                                <strong>Verified</strong>
                                <small>Trusted product listing.</small>
                            </div>

                            <div>
                                <strong>Secure</strong>
                                <small>WhatsApp order support.</small>
                            </div>
                        </div>
                    </div>

                    <button className="product-detail-buy-now" onClick={handleBuy}>
                        <FiShoppingBag />
                        Buy Now
                    </button>
                </div>
            </section>

            {recommendedProducts.length > 0 && (
                <section className="recommended-section page-reveal">
                    <div className="recommended-header">
                        <div>
                            <h2>Recommended Products</h2>
                            <p>Explore more herbal products you may like.</p>
                        </div>

                        <button onClick={() => navigate("/products")}>
                            View All <FiArrowRight />
                        </button>
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
                                    <span>
                                        {item.category === "popular" ? "Popular Product" : "Herbal Product"}
                                    </span>

                                    <h3>{item.name}</h3>
                                    <p>Rs. {item.price}</p>

                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            navigate(`/products/${item._id}`);
                                        }}
                                    >
                                        <FiArrowRight />
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