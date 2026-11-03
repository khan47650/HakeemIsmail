import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FiArrowLeft, FiShoppingBag, FiPackage, FiArrowRight } from "react-icons/fi";
import { toast } from "react-toastify";
import api from "../api/api";
import SEO from "../components/SEO";
import "../css/ProductDetail.css";

function ProductDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [product, setProduct] = useState(null);
    const [recommendedProducts, setRecommendedProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    const getArray = (data) => {
        if (Array.isArray(data)) return data;
        if (Array.isArray(data?.products)) return data.products;
        if (Array.isArray(data?.data)) return data.data;
        return [];
    };

    const sanitizeProductDescription = (html = "") => {
        if (!html) return "";
        const parser = new DOMParser();
        const parsedDocument = parser.parseFromString(html, "text/html");
        parsedDocument.body.querySelectorAll("*").forEach((element) => {
            element.removeAttribute("dir");
            element.classList.remove("ql-direction-rtl", "ql-align-right", "ql-align-center", "ql-align-justify");
            element.style.removeProperty("direction");
            element.style.removeProperty("text-align");
            element.style.removeProperty("unicode-bidi");
            if (!element.getAttribute("style")) element.removeAttribute("style");
            if (!element.className) element.removeAttribute("class");
        });
        return parsedDocument.body.innerHTML;
    };

    const fetchProductData = async () => {
        try {
            setLoading(true);
            const res = await api.get("/products");
            const products = getArray(res.data).filter((item) => item.status === "published");
            const selectedProduct = products.find((item) => item._id === id);

            setProduct(selectedProduct || null);

            const recommended = products.filter((item) => item._id !== id).slice(-3).reverse();
            setRecommendedProducts(recommended);
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
    }, [id]);

    useEffect(() => {
        if (!product) return;
        const data = {
            "@context": "https://schema.org",
            "@type": "Product",
            name: product.name,
            image: product.image || undefined,
            description: product.metaDescription || (product.description ? product.description.replace(/<[^>]+>/g, "").slice(0, 160) : product.name),
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
            document.head.querySelectorAll('script[data-product-jsonld="true"]').forEach((el) => el.remove());
        };
    }, [product]);

    const handleBuy = () => {
        if (!product || Number(product.price) <= 0) return;
        const message = `Assalam o Alaikum,\n\nMujhe ye product buy karna hai.\n\nProduct: ${product.name}\nPrice: Rs. ${product.price}\n\nImage:\n${product.image}`;
        const url = `https://wa.me/923054800448?text=${encodeURIComponent(message)}`;
        window.open(url, "_blank");
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
                description={product.metaDescription || (product.description ? product.description.replace(/<[^>]+>/g, "").slice(0, 155) : "Explore this herbal product by Hakeem Ismail.")}
                canonical={`/products/${product._id}`}
            />

            <button className="product-back-btn" onClick={() => navigate(-1)}>
                <FiArrowLeft />
            </button>

            <section className="product-detail-hero page-reveal">

                {/* Top Row: 2 Columns (Image on Left, Info on Right) */}
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
                                {product.category === "popular" ? "Popular Product" : "Herbal Product"}
                            </span>
                        </div>

                        <h1 className="normal-title">{product.name}</h1>

                        {Number(product.price) > 0 ? (
                            <p className="product-detail-price-text">Rs. {product.price}</p>
                        ) : (
                            <div className="product-detail-coming-soon">Coming Soon</div>
                        )}

                        <button
                            className={`product-detail-buy-now ${Number(product.price) <= 0 ? "product-detail-buy-disabled" : ""}`}
                            onClick={handleBuy}
                            disabled={Number(product.price) <= 0}
                        >
                            <FiShoppingBag />
                            {Number(product.price) > 0 ? "Buy Now" : "Not Available Yet"}
                        </button>
                    </div>
                </div>

                {/* Bottom Row: Full Width About Section (No White Card) */}
                <div className="pd-about-product-card page-reveal" dir="ltr">
                    <h3>About This Product</h3>
                    <div
                        className="pd-about-product-content"
                        dir="ltr"
                        dangerouslySetInnerHTML={{
                            __html: sanitizeProductDescription(product.description),
                        }}
                    />
                </div>

            </section>

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
                                    <span>{item.category === "popular" ? "Popular Product" : "Herbal Product"}</span>
                                    <h3>{item.name}</h3>
                                    {Number(item.price) > 0 && <p>Rs. {item.price}</p>}
                                    <button onClick={(e) => { e.stopPropagation(); navigate(`/products/${item._id}`); }}>
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