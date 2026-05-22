import { useEffect, useState } from "react";
import api from "../api/api";
import "../css/Home.css";
import ProductDetailDialog from "../components/ProductDetailDialog";

function Home() {
  const [popularProducts, setPopularProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const [detailOpen, setDetailOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchPopularProducts = async () => {
    try {
      setLoading(true);

      const res = await api.get("/products");

      const popular = res.data.filter(
        (product) => product.category === "popular"
      );

      setPopularProducts(popular);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPopularProducts();
  }, []);

  return (
    <main className="home-page">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12">
            <div className="home-info-card">
              <div className="row align-items-center g-4">
                <div className="col-lg-4 col-md-5 col-12">
                  <div className="hakeem-image-box">
                    <img
                      src="/hakeem.jpeg"
                      alt="Hakeem Ismail"
                      className="hakeem-image"
                    />
                  </div>
                </div>

                <div className="col-lg-8 col-md-7 col-12">
                  <div className="hakeem-content">
                    <h2 className="hakeem-name">
                      Hakeem Muhammad Ismail
                    </h2>

                    <p className="hakeem-subtitle">
                      Specialist in Unani Single-Organ Therapy
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {!loading && popularProducts.length > 0 && (
          <div id="popular-products" className="popular-products-section">
            <div className="row">
              <div className="col-12">
                <h2 className="section-heading">Our Popular Products</h2>
                <div className="products-title-line"></div>
              </div>
            </div>

            <div className="row g-4">
              {popularProducts.map((product) => (
                <div key={product._id} className="col-lg-4 col-md-6 col-12">
                  <div
                    className="product-card"
                    onClick={() => {
                      setSelectedProduct(product);
                      setDetailOpen(true);
                    }}
                  >
                    <div className="product-image-box">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="product-image"
                      />
                    </div>

                    <div className="product-content">
                      <h3 className="product-name">{product.name}</h3>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      <ProductDetailDialog
        open={detailOpen}
        onClose={() => setDetailOpen(false)}
        product={selectedProduct}
      />
    </main>
  );
}

export default Home;