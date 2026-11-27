import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
    FiArrowLeft,
    FiShoppingBag,
    FiPackage,
    FiArrowRight,
    FiChevronLeft,
    FiChevronRight,
} from "react-icons/fi";
import { toast } from "react-toastify";
import api from "../api/api";
import SEO from "../components/SEO";
import { getItemSlug, matchesSlugOrId } from "../utils/slugify";
import "../css/ProductDetail.css";

function ProductDetailPage() {
    const { slug } = useParams();
    const navigate = useNavigate();

    const [product, setProduct] = useState(null);
    const [recommendedProducts, setRecommendedProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    // Product Reviews Slider States
    const [reviews, setReviews] = useState([]);
    const [reviewIndex, setReviewIndex] = useState(0);
    const [slidesToShow, setSlidesToShow] = useState(3);
    const [isReviewHovered, setIsReviewHovered] = useState(false);

    const getArray = (data) => {
        if (Array.isArray(data)) return data;
        if (Array.isArray(data?.products)) return data.products;
        if (Array.isArray(data?.data)) return data.data;
        return [];
    };

    const fetchProductData = async () => {
        try {
            setLoading(true);
            const productsRes = await api.get("/products");
            const products = getArray(productsRes.data).filter(
                (item) => item.status === "published"
            );

            const selectedProduct = products.find((item) =>
                matchesSlugOrId(item, slug)
            );
            setProduct(selectedProduct || null);

            if (selectedProduct) {
                const canonicalSlug = getItemSlug(selectedProduct);
                let decodedParam = slug;
                try {
                    decodedParam = decodeURIComponent(slug);
                } catch {
                    decodedParam = slug;
                }

                if (canonicalSlug && decodedParam !== canonicalSlug) {
                    navigate(`/products/${canonicalSlug}`, { replace: true });
                }

                const recommended = products
                    .filter((item) => item._id !== selectedProduct._id)
                    .slice(-3)
                    .reverse();
                setRecommendedProducts(recommended);

                // Product ke actual _id se reviews fetch karein
                const reviewsRes = await api
                    .get(`/reviews/product/${selectedProduct._id}`)
                    .catch(() => ({ data: [] }));

                const productReviews = (
                    Array.isArray(reviewsRes.data) ? reviewsRes.data : []
                ).filter((item) => Boolean(item.image));
                setReviews(productReviews);
                setReviewIndex(0);
            } else {
                setRecommendedProducts([]);
                setReviews([]);
            }
        } catch (error) {
            console.log(error);
            toast.error("Failed to load product");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProductData();
        window.scrollTo({ top: 0, behavior: "smooth" });
    }, [slug]);

    // Responsive Slides Count
    useEffect(() => {
        const updateSlidesCount = () => {
            if (window.innerWidth <= 640) {
                setSlidesToShow(1);
            } else if (window.innerWidth <= 992) {
                setSlidesToShow(2);
            } else {
                setSlidesToShow(3);
            }
        };

        updateSlidesCount();
        window.addEventListener("resize", updateSlidesCount);
        return () => window.removeEventListener("resize", updateSlidesCount);
    }, []);

    const effectiveSlides = Math.max(1, Math.min(slidesToShow, reviews.length));
    const maxReviewIndex = Math.max(0, reviews.length - effectiveSlides);

    useEffect(() => {
        if (reviewIndex > maxReviewIndex) {
            setReviewIndex(maxReviewIndex);
        }
    }, [maxReviewIndex, reviewIndex]);

    // Smooth Auto-Slide (Hover par pause hoga)
    useEffect(() => {
        if (reviews.length <= effectiveSlides || isReviewHovered) return;

        const autoSlideTimer = setInterval(() => {
            setReviewIndex((prev) => (prev >= maxReviewIndex ? 0 : prev + 1));
        }, 3500);

        return () => clearInterval(autoSlideTimer);
    }, [reviews.length, effectiveSlides, maxReviewIndex, isReviewHovered]);

    const handlePrevReview = () => {
        setReviewIndex((prev) => (prev <= 0 ? maxReviewIndex : prev - 1));
    };

    const handleNextReview = () => {
        setReviewIndex((prev) => (prev >= maxReviewIndex ? 0 : prev + 1));
    };

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
        if (!product || Number(product.price) <= 0) return;
        const message = `Assalam o Alaikum,\n\nMujhe ye product buy karna hai.\n\nProduct: ${product.name}\nPrice: Rs. ${product.price}\n\nImage:\n${product.image}`;
        const url = `https://wa.me/923054800448?text=${encodeURIComponent(message)}`;
        window.open(url, "_blank");
    };

    const truncateTitle = (title) => {
        const words = title.split(" ");
        if (words.length > 4) {
            return words.slice(0, 4).join(" ") + "...";
        }
        return title;
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

    const isEnglish = product.isEnglishDescription || false;
    const productSlug = getItemSlug(product);

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
                canonical={`/products/${productSlug}`}
            />

            <button className="product-back-btn" onClick={() => navigate(-1)}>
                <FiArrowLeft />
            </button>

            <section className="product-detail-hero page-reveal">
                <div className="product-detail-top-row">
                    <div className="product-detail-image-area">
                        <img
                            src={product.image}
                            alt={product.name}
                            className="product-detail-main-image floating-image"
                        />
                    </div>

                    <div className="product-detail-main-info">
                        <div className="product-badge-row">
                            <span className="product-detail-badge">
                                <FiPackage />
                                {product.category === "popular"
                                    ? "Popular Product"
                                    : "Herbal Product"}
                            </span>
                        </div>

                        <h1 className="normal-title">{product.name}</h1>

                        {Number(product.price) > 0 ? (
                            <p className="product-detail-price-text">
                                Rs. {product.price}
                            </p>
                        ) : (
                            <div className="product-detail-coming-soon">
                                Coming Soon
                            </div>
                        )}

                        <button
                            className={`product-detail-buy-now ${Number(product.price) <= 0
                                    ? "product-detail-buy-disabled"
                                    : ""
                                }`}
                            onClick={handleBuy}
                            disabled={Number(product.price) <= 0}
                        >
                            <FiShoppingBag />
                            {Number(product.price) > 0
                                ? "Buy Now"
                                : "Not Available Yet"}
                        </button>
                    </div>
                </div>

                <div className="adp-bottom-divider" />

                <div className="adp-wrapper">
                    <article className="adp-article">
                        <div
                            className={
                                isEnglish
                                    ? "pd-about-product-content english-format"
                                    : "pd-about-product-content urdu-format"
                            }
                            dangerouslySetInnerHTML={{
                                __html: product.description,
                            }}
                        />
                    </article>
                </div>
            </section>

            {reviews.length > 0 && (
                <section
                    className="pd-reviews-section page-reveal"
                    onMouseEnter={() => setIsReviewHovered(true)}
                    onMouseLeave={() => setIsReviewHovered(false)}
                >
                    <div className="pd-reviews-header">
                        <h2>Customers FeedBack</h2>
                        <div className="pd-reviews-title-line"></div>
                    </div>

                    <div className="pd-reviews-fullbleed">
                        {reviews.length > effectiveSlides && (
                            <button
                                type="button"
                                className="pd-reviews-arrow prev"
                                onClick={handlePrevReview}
                                aria-label="Previous review"
                            >
                                <FiChevronLeft />
                            </button>
                        )}

                        <div className="pd-reviews-viewport">
                            <div
                                className="pd-reviews-track"
                                style={{
                                    transform: `translateX(-${reviewIndex * (100 / effectiveSlides)
                                        }%)`,
                                }}
                            >
                                {reviews.map((rev, idx) => (
                                    <div
                                        key={rev._id || idx}
                                        className="pd-review-tile"
                                        style={{
                                            flex: `0 0 ${100 / effectiveSlides}%`,
                                        }}
                                    >
                                        <img
                                            src={rev.image}
                                            alt={`${product.name} Review ${idx + 1}`}
                                            className="pd-review-img"
                                            loading="lazy"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>

                        {reviews.length > effectiveSlides && (
                            <button
                                type="button"
                                className="pd-reviews-arrow next"
                                onClick={handleNextReview}
                                aria-label="Next review"
                            >
                                <FiChevronRight />
                            </button>
                        )}
                    </div>
                </section>
            )}

            {/* Recommended Products */}
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
                        {recommendedProducts.map((item) => {
                            const itemSlug = getItemSlug(item);
                            return (
                                <div
                                    className="recommended-card"
                                    key={item._id}
                                    onClick={() => navigate(`/products/${itemSlug}`)}
                                >
                                    <div className="recommended-image-box">
                                        <img src={item.image} alt={item.name} />
                                    </div>
                                    <div className="recommended-content">
                                        <h3>{truncateTitle(item.name)}</h3>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                navigate(`/products/${itemSlug}`);
                                            }}
                                        >
                                            <FiArrowRight />
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </section>
            )}
        </main>
    );
}

export default ProductDetailPage;