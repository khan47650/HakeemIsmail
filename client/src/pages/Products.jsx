import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiSearch, FiArrowRight } from "react-icons/fi";
import api from "../api/api";
import SEO from "../components/SEO";
import "../css/Products.css";

const PRODUCTS_PER_PAGE = 9;

function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [showAll, setShowAll] = useState(false);
  const navigate = useNavigate();

  useEffect(() => { fetchProducts(); }, []);
  useEffect(() => { setShowAll(false); }, [searchQuery]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await api.get("/products");

      const published = (res.data || []).filter((p) => p.status === "published");
      setProducts(published);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  // SEO: Product JSON-LD
  useEffect(() => {
    if (!products.length) return;

    const data = {
      "@context": "https://schema.org",
      "@type": "ItemList",
      itemListElement: products.map((p, i) => ({
        "@type": "ListItem",
        position: i + 1,
        item: {
          "@type": "Product",
          name: p.name,
          image: p.image || undefined,
          description:
            p.metaDescription ||
            (p.description ? p.description.replace(/<[^>]+>/g, "").slice(0, 160) : p.name),
          offers: {
            "@type": "Offer",
            priceCurrency: "PKR",
            price: p.price,
            availability: "https://schema.org/InStock",
          },
        },
      })),
    };

    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.setAttribute("data-products-jsonld", "true");
    script.text = JSON.stringify(data);
    document.head.appendChild(script);

    return () => {
      document.head
        .querySelectorAll('script[data-products-jsonld="true"]')
        .forEach((el) => el.remove());
    };
  }, [products]);

  const handleBuy = (e, product) => {
    e.stopPropagation();

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

  const filtered = products
    .filter((p) => !searchQuery || p.name.toLowerCase().includes(searchQuery.toLowerCase()));

  const visible = showAll ? filtered : filtered.slice(0, PRODUCTS_PER_PAGE);
  const hasMore = !showAll && filtered.length > PRODUCTS_PER_PAGE;

  return (
    <section className="all-products-page page-fade-up">
      <SEO
        title="Our Products | Hakeem Ismail"
        description="Explore pure herbal products, natural remedies and wellness items from Hakeem Ismail with delivery across Pakistan."
        canonical="/products"
      />

      <div className="container">
        <div className="all-products-header fade-up fade-up-delay-1">
          <h1 className="all-products-title">Our Products</h1>
          <div className="all-products-title-line"></div>
        </div>

        {/* Search bar only */}
        <div className="all-products-toolbar">
          <div className="products-search-wrap">
            <FiSearch className="products-search-icon" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="products-search-input"
            />
          </div>
        </div>

        <div className="all-products-grid">
          {loading ? (
            [...Array(9)].map((_, index) => (
              <div className="all-products-skeleton" key={index}></div>
            ))
          ) : filtered.length === 0 ? (
            <div className="admin-empty-state">No products found.</div>
          ) : (
            visible.map((product, index) => (
              <div
                className={`all-products-card fade-up fade-up-delay-${(index % 6) + 1}`}
                key={product._id}
              >
                {/* Popular Badge */}
                {product.category === "popular" && (
                  <span className="all-products-popular-badge">Popular</span>
                )}

                <div className="all-products-image-wrap">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="all-products-image"
                    loading="lazy"
                  />

                  <button
                    className="all-products-view-details-btn"
                    onClick={() => navigate(`/products/${product._id}`)}
                  >
                    View Details <FiArrowRight />
                  </button>
                </div>

                <div className="all-products-content">
                  <h3 className="all-products-name">{product.name}</h3>
                  <p className="all-products-price">Rs. {product.price}</p>

                  <button
                    className="all-products-buy-btn"
                    onClick={(e) => handleBuy(e, product)}
                  >
                    Buy
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Show More */}
        {hasMore && (
          <div className="all-products-more-wrap">
            <button className="all-products-show-more" onClick={() => setShowAll(true)}>
              Show More
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

export default Products;