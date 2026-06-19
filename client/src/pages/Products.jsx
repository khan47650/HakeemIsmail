import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import SEO from "../components/SEO";
import "../css/Products.css";

function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await api.get("/products");

      // sirf published products (drafts hide)
      const published = (res.data || []).filter((p) => p.status === "published");
      setProducts(published);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // SEO: Product JSON-LD (price/offers ke saath)
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

        <div className="all-products-grid">
          {loading ? (
            [...Array(6)].map((_, index) => (
              <div className="all-products-skeleton" key={index}></div>
            ))
          ) : products.length === 0 ? (
            <div className="admin-empty-state">Products Not Uploaded Yet.</div>
          ) : (
            products.map((product, index) => (
              <div
                className={`all-products-card fade-up fade-up-delay-${(index % 6) + 1}`}
                key={product._id}
                onClick={() => navigate(`/products/${product._id}`)}
              >
                <div className="all-products-image-wrap">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="all-products-image"
                    loading="lazy"
                  />
                </div>

                <div className="all-products-content">
                  <h3 className="all-products-name">{product.name}</h3>
                  <p className="all-products-price">Rs. {product.price}</p>

                  {product.tags?.length > 0 && (
                    <div className="all-products-hashtags">
                      {product.tags.slice(0, 3).map((tag) => (
                        <span className="all-products-hashtag" key={tag}>
                          #{tag.replace(/\s+/g, "")}
                        </span>
                      ))}
                    </div>
                  )}

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
      </div>
    </section>
  );
}

export default Products;