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
import { FiArrowRight } from "react-icons/fi";

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
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);


  const fetchHomeData = async () => {
    try {
      setLoading(true);

      const [productsRes, articlesRes, videosRes, shortsRes, blogsRes] =
        await Promise.all([
          api.get("/products"),
          api.get("/articles"),
          api.get("/videos"),
          api.get("/shorts"),
          api.get("/blogs"),
        ]);

      const popular = (productsRes.data || []).filter(
        (product) =>
          product.category === "popular" && product.status === "published"
      );
      setPopularProducts(popular);

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
      const publishedBlogs = (blogsRes.data || []).filter(
        (blog) => blog.status === "published"
      );
      setBlogs(publishedBlogs);
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

  const latestArticles = articles.slice(0, 2); // Changed from 3 to 2
  const featuredVideos = videos.slice(0, 4); // Changed from 3 to 4
  const featuredShorts = shorts.slice(0, 4);

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  const stripHtml = (html = "") => html.replace(/<[^>]+>/g, "").trim();

  const openVideoLink = (item) => {
    const url = item.youtubeUrl || item.facebookUrl;
    if (url) window.open(url, "_blank", "noreferrer");
  };

  const handleVideoClick = (video) => {
    const hasYT = Boolean(video.youtubeUrl);
    const hasFB = Boolean(video.facebookUrl);

    if (hasYT && hasFB) {
      window.open(video.youtubeUrl, "_blank", "noreferrer");
    } else if (hasYT) {
      window.open(video.youtubeUrl, "_blank", "noreferrer");
    } else if (hasFB) {
      window.open(video.facebookUrl, "_blank", "noreferrer");
    }
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
                    src="/hakeem_Ismail_new.jpeg"
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

          <section className="popular-products-section">
            <div className="container">
              <div className="section-header">
                <h2>Popular Products</h2>
                <p>Explore our bestselling herbal products and wellness remedies</p>
                <div className="products-title-line"></div>
              </div>

              <div className="home-products-grid">
                {popularProducts.slice(0, 6).map((product) => (
                  <div
                    key={product._id}
                    className="home-product-card-wrapper"
                    onClick={() => navigate(`/products/${product._id}`)}
                  >
                    <div className="home-product-card">
                      {product.category === "popular" && (
                        <span className="all-products-popular-badge">Popular</span>
                      )}

                      <div className="home-product-image-box">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="home-product-image"
                          loading="lazy"
                        />
                      </div>

                      <div className="home-product-content">
                        <h3 className="home-product-name">{product.name}</h3>
                        <p className="home-product-price">Rs. {product.price}</p>

                        <button
                          className="home-product-buy-btn"
                          onClick={(e) => {
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
                          }}
                        >
                          Buy
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {!loading && latestArticles.length > 0 && (
            <section className="home-preview-section reveal-on-scroll">
              <div className="section-header">
                <h2>Latest Health Articles</h2>
                <p>
                  Read useful natural health tips and Unani treatment awareness.
                </p>
                <div className="products-title-line"></div>
              </div>

              <div className="home-articles-grid">
                {latestArticles.map((article, index) => {
                  const plainText = stripHtml(article.excerpt || article.content);

                  return (
                    <div key={article._id} className="article-grid-item">
                      <div className="article-story-card">

                        <div className="article-story-card-top">
                          <span className="article-story-date">
                            {new Date(article.date || article.createdAt)
                              .toLocaleDateString("en-GB", {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              })
                              .toUpperCase()}
                          </span>
                        </div>

                        <div className="article-story-card-body">
                          <h3 className="article-story-title">{article.title}</h3>
                          <p className="article-story-text">{plainText}</p>
                          <button
                            className="article-story-link"
                            onClick={() => navigate(`/articles/${article._id}`)}
                          >
                            مزید پڑھیں
                          </button>
                        </div>

                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {!loading && blogs.slice(0, 4).length > 0 && (
            <section className="home-preview-section">
              <div className="section-header">
                <h2>Latest Blogs</h2>
                <p>
                  Read our latest health, wellness and Unani medicine blogs.
                </p>
                <div className="products-title-line"></div>
              </div>

              <div className="home-blogs-grid">
                {blogs.slice(0, 4).map((blog) => (
                  <div
                    key={blog._id}
                    className="blog-card"
                    onClick={() => navigate(`/blogs/${blog._id}`)}
                  >
                    <div className="blog-card-image">
                      <img src={blog.image} alt={blog.title} loading="lazy" />
                    </div>
                    <div className="blog-card-body">
                      <h3 className="blog-card-title">{blog.title}</h3>
                      <p className="blog-card-excerpt">
                        {blog.excerpt
                          ? blog.excerpt.slice(0, 110)
                          : plainText(blog.content).slice(0, 110)}
                        ...
                      </p>
                      <span className="blog-card-readmore">مزید پڑھیں</span>
                    </div>
                  </div>
                ))}
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

              <div className="home-videos-grid">
                {featuredVideos.map((video) => (
                  <div key={video._id} className="home-video-card">
                    <div className="home-video-thumb-wrap">
                      <img
                        src={video.thumbnail || "/video-1.jpeg"}
                        alt={video.title}
                        className="home-video-thumb"
                      />
                    </div>
                    <div className="home-video-content">
                      <h3 className="home-video-card-title">{video.title}</h3>
                      <button
                        className="home-watch-now-btn"
                        onClick={() => handleVideoClick(video)}
                      >
                        Watch Now
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
                  <div key={short._id} className="home-short-card">
                    <div className="home-short-thumb-wrap">
                      <img
                        src={short.thumbnail || "/short-1.jpeg"}
                        alt={short.title}
                        className="home-short-thumb"
                      />
                    </div>
                    <div className="home-short-content">
                      <h3 className="home-short-card-title">{short.title}</h3>
                      <button
                        className="home-watch-now-btn"
                        onClick={() => handleVideoClick(short)}
                      >
                        Watch Now
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