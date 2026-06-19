import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SEO from "../components/SEO";
import {
  FaLeaf,
  FaTruck,
  FaUserMd,
  FaShieldAlt,
  FaYoutube,
  FaFacebook,
  FaChartLine,
  FaGlobeAsia,
} from "react-icons/fa";
import { FiArrowRight, FiExternalLink } from "react-icons/fi";

import api from "../api/api";
import "../css/Home.css";

function Home() {
  const navigate = useNavigate();
  const [counterStarted, setCounterStarted] = useState(false);
  const [counterValue, setCounterValue] = useState(0);

  const [popularProducts, setPopularProducts] = useState([]);
  const [articles, setArticles] = useState([]);
  const [videos, setVideos] = useState([]);
  const [shorts, setShorts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchHomeData = async () => {
    try {
      setLoading(true);

      const [productsRes, articlesRes, videosRes, shortsRes] =
        await Promise.all([
          api.get("/products"),
          api.get("/articles"),
          api.get("/videos"),
          api.get("/shorts"),
        ]);

      const popular = (productsRes.data || []).filter(
        (product) =>
          product.category === "popular" && product.status === "published"
      );
      setPopularProducts(popular);

      // ✅ Filter only published articles
      const publishedArticles = (articlesRes.data || []).filter(
        (article) => article.status === "published"
      );
      setArticles(publishedArticles);

      const publishedVideos = (videosRes.data || []).filter(
        (video) => video.status === "published"
      );
      setVideos(publishedVideos);

      const publishedShorts = (shortsRes.data || []).filter(
        (short) => short.status === "published"
      );
      setShorts(publishedShorts);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHomeData();
  }, []);

  useEffect(() => {
    if (!counterStarted) return;

    let start = 347;
    setCounterValue(start);

    const timer = setInterval(() => {
      const shouldIncrease = Math.random() > 0.3;

      if (shouldIncrease) {
        start += Math.floor(Math.random() * 2) + 1;
        setCounterValue(start);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [counterStarted]);

  useEffect(() => {
    const revealElements = document.querySelectorAll(".reveal-on-scroll");
    const counterSection = document.querySelector(".website-counter-section");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("show");

            if (entry.target === counterSection) {
              setCounterStarted(true);
            }
          }
        });
      },
      { threshold: 0.25 }
    );

    revealElements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [loading]);

  const latestArticles = articles.slice(0, 3);
  const featuredVideos = videos.slice(0, 3);
  const featuredShorts = shorts.slice(0, 4);

  const openVideoLink = (item) => {
    const url = item.youtubeUrl || item.facebookUrl;
    if (url) window.open(url, "_blank", "noreferrer");
  };

  return (
    <main className="home-page">
      <SEO
        title="Hakeem Ismail | Herbal Products & Unani Treatment"
        description="Hakeem Ismail provides natural herbal products, Unani treatment guidance, health articles, videos and wellness remedies in Pakistan."
        canonical="/"
      />
      <section className="home-hero-section">
        <div className="container">
          <div
            className="home-info-card"
            onClick={() => navigate("/about")}
            role="button"
          >
            <div className="row align-items-center g-4">
              <div className="col-lg-4 col-md-5 col-12">
                <div className="hakeem-image-box">
                  <img
                    src="/hakeem.jpeg"
                    alt="Hakeem Muhammad Ismail - Unani Medicine Specialist"
                    className="hakeem-image"
                  />
                </div>
              </div>

              <div className="col-lg-8 col-md-7 col-12">
                <div className="hakeem-content">
                  <span className="hero-badge">Natural Unani Healing</span>

                  <h1 className="hakeem-name">Hakeem Muhammad Ismail</h1>

                  <p className="hakeem-subtitle">
                    Specialist in Unani Single-Organ Therapy
                  </p>

                  <p className="hero-description">
                    Pure herbal medicines, natural treatment guidance, and
                    trusted Unani healthcare services across Pakistan.
                  </p>

                  <div className="hero-actions">
                    <button
                      className="primary-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        document
                          .getElementById("popular-products")
                          ?.scrollIntoView({ behavior: "smooth" });
                      }}
                    >
                      View Products <FiArrowRight />
                    </button>

                    <button
                      className="secondary-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate("/contact");
                      }}
                    >
                      Contact Us
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="why-section reveal-on-scroll">
            <div className="section-header">
              <h2>Why Choose Hakeem Ismail?</h2>
              <p>
                Trusted natural healthcare with experience, purity and
                professional guidance.
              </p>
              <div className="products-title-line"></div>
            </div>

            <div className="why-grid">
              <div className="why-card" role="button" onClick={() => navigate("/about")}>
                <FaUserMd />
                <h3>15+ Years Experience</h3>
                <p>Expert Unani diagnosis and herbal treatment guidance.</p>
              </div>

              <div className="why-card" role="button" onClick={() => navigate("/products")}>
                <FaLeaf />
                <h3>Pure Herbal Medicines</h3>
                <p>Natural herbs prepared with care and quality control.</p>
              </div>

              <div className="why-card" role="button" onClick={() => navigate("/clinic")}>
                <FaShieldAlt />
                <h3>Registered Clinic</h3>
                <p>Professional and trusted healthcare service.</p>
              </div>

              <div className="why-card" role="button" onClick={() => navigate("/delivery")}>
                <FaTruck />
                <h3>Pakistan Delivery</h3>
                <p>Order herbal products from anywhere in Pakistan.</p>
              </div>
            </div>
          </div>

          {loading && (
            <section className="home-skeleton-section">
              <div className="row g-4">
                {[...Array(6)].map((_, index) => (
                  <div key={index} className="col-lg-4 col-md-6 col-12">
                    <div className="home-skeleton-card">
                      <div className="home-skeleton-image"></div>
                      <div className="home-skeleton-title"></div>
                      <div className="home-skeleton-text"></div>
                      <div className="home-skeleton-text short"></div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {!loading && popularProducts.length > 0 && (
            <section id="popular-products" className="popular-products-section reveal-on-scroll">
              <div className="section-header">
                <h2>Our Popular Products</h2>
                <p>
                  Explore our trusted herbal products prepared with natural
                  ingredients.
                </p>
                <div className="products-title-line"></div>
              </div>

              <div className="row g-4">
                {popularProducts.map((product) => (
                  <div key={product._id} className="col-lg-4 col-md-6 col-12">
                    <div
                      className="product-card"
                      onClick={() => navigate(`/products/${product._id}`)}
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

                        {product.tags?.length > 0 && (
                          <div className="home-product-hashtags">
                            {product.tags.slice(0, 3).map((tag) => (
                              <span key={tag}>#{tag.replace(/\s+/g, "")}</span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {!loading && latestArticles.length > 0 && (
            <section className="home-preview-section reveal-on-scroll">
              <div className="section-header">
                <h2>Latest Health Articles</h2>
                <p>
                  Read useful natural health tips and Unani treatment awareness.
                </p>
                <div className="products-title-line"></div>
              </div>

              <div className="home-article-grid">
                {latestArticles.map((article) => {
                  const plainText = article.excerpt || article.content?.replace(/<[^>]+>/g, "") || "";
                  const truncated = plainText.slice(0, 110);

                  return (
                    <div className="home-article-card" key={article._id}>
                      <h3>{article.title}</h3>

                      <p className="home-article-excerpt">
                        {truncated}
                        {plainText.length > 110 && <span className="article-ellipsis">...</span>}
                      </p>

                      {article.tags?.length > 0 && (
                        <div className="home-article-hashtags">
                          {article.tags.slice(0, 3).map((tag) => (
                            <span key={tag}>#{tag}</span>
                          ))}
                        </div>
                      )}

                      <button onClick={() => navigate("/articles")}>
                        مزید پڑھیں <FiArrowRight />
                      </button>
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {!loading && featuredVideos.length > 0 && (
            <section className="home-preview-section">
              <div className="section-header">
                <h2>Health & Wellness Videos</h2>
                <p>
                  Watch helpful videos about herbal awareness and natural
                  lifestyle.
                </p>
                <div className="products-title-line"></div>
              </div>

              <div className="home-video-grid">
                {featuredVideos.map((video) => (
                  <div className="home-video-card" key={video._id}>
                    <div className="home-video-img-wrap">
                      <img
                        src={video.thumbnail || "/video-1.jpeg"}
                        alt={video.title}
                      />
                      <span>{video.duration}</span>
                    </div>

                    <div className="home-video-content">
                      <h3>{video.title}</h3>

                      <div
                        className="home-video-desc quill-content"
                        dangerouslySetInnerHTML={{ __html: video.description }}
                      />

                      {video.tags?.length > 0 && (
                        <div className="home-video-hashtags">
                          {video.tags.slice(0, 3).map((tag) => (
                            <span key={tag}>#{tag.replace(/\s+/g, "")}</span>
                          ))}
                        </div>
                      )}

                      <button onClick={() => openVideoLink(video)}>
                        Watch Now{" "}
                        {video.youtubeUrl ? <FaYoutube /> : <FaFacebook />}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {!loading && featuredShorts.length > 0 && (
            <section className="home-preview-section">
              <div className="section-header">
                <h2>Patient Education Shorts</h2>
                <p>
                  Quick short videos for herbal tips and natural health
                  awareness.
                </p>
                <div className="products-title-line"></div>
              </div>

              <div className="home-shorts-grid">
                {featuredShorts.map((short) => (
                  <div
                    className="home-short-card"
                    key={short._id}
                    onClick={() => openVideoLink(short)}
                  >
                    <img
                      src={short.thumbnail || "/short-1.jpeg"}
                      alt={short.title}
                    />

                    <div className="home-short-overlay"></div>

                    <span>{short.duration}</span>

                    <div>
                      {short.tags?.length > 0 && (
                        <div className="home-short-hashtags">
                          {short.tags.slice(0, 2).map((tag) => (
                            <span key={tag}>#{tag.replace(/\s+/g, "")}</span>
                          ))}
                        </div>
                      )}

                      <h3>{short.title}</h3>
                      <button>
                        Watch <FiExternalLink />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          <section className="home-about-preview reveal-on-scroll">
            <div className="home-about-content">
              <span>About Hakeem Ismail</span>
              <h2>Natural Healing Through Trusted Unani Medicine</h2>
              <p>
                Hakeem Muhammad Ismail has years of experience in Unani
                medicine, herbal remedies and natural treatment. His mission is
                to provide pure herbal solutions and trusted healthcare guidance
                to every home.
              </p>

              <button onClick={() => navigate("/about")}>
                Read Full Story <FiArrowRight />
              </button>
            </div>
          </section>

          <section className="website-counter-section reveal-on-scroll">
            <div className="counter-top-icon">
              <FaChartLine />
            </div>

            <h2>Website Views</h2>

            <div className="counter-title-line">
              <span></span>
              <b></b>
              <span></span>
            </div>

            <p className="views-description">
              Trusted by visitors exploring natural healing, herbal remedies,
              wellness articles, videos and expert Unani guidance.
            </p>

            <div className="counter-boxes">
              {String(counterValue)
                .padStart(4, "0")
                .slice(-4)
                .split("")
                .map((digit, index) => (
                  <div className="counter-box" key={index}>
                    {digit}
                  </div>
                ))}
            </div>

            <div className="counter-bottom-icon">
              <FaGlobeAsia />
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}

export default Home;