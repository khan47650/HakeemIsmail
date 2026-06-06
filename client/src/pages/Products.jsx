import { useEffect, useState } from "react";
import api from "../api/api";
import ProductDetailDialog from "../components/ProductDetailPage";
import "../css/Products.css";
import { useNavigate } from "react-router-dom";

function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await api.get("/products");
      setProducts(res.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

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
            <div className="admin-empty-state">
              Products Not Uploaded Yet.
            </div>
          ) : (
            products.map((product, index) => (
              <div
                className={`all-products-card fade-up fade-up-delay-${(index % 6) + 1
                  }`}
                key={product._id}
                onClick={() => navigate(`/products/${product._id}`)}
              >
                <div className="all-products-image-wrap">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="all-products-image"
                  />
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
      </div>
    </section>
  );
}

export default Products;