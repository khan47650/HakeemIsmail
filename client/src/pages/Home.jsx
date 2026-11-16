import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SEO from "../components/SEO";
import {
  FaLeaf,
  FaTruck,
  FaUserMd,
  FaShieldAlt,
  FaPlayCircle,
} from "react-icons/fa";
import {
  FiArrowRight, FiArrowUp, FiChevronLeft, FiChevronRight,
} from "react-icons/fi";

import api from "../api/api";
import "../css/Home.css";

function Home() {
  const navigate = useNavigate();
  const [counterStarted, setCounterStarted] = useState(false);
  const [counterValue, setCounterValue] = useState(0);
  const [targetViews] = useState(
    () => Math.floor(Math.random() * (4850 - 1150 + 1)) + 1150
  );

  const [latestProducts, setLatestProducts] = useState([]);
  const [articles, setArticles] = useState([]);
  const [videos, setVideos] = useState([]);
  const [shorts, setShorts] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [scrollVisible, setScrollVisible] = useState(false);
  const [activeHomeProductId, setActiveHomeProductId] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [reviewIndex, setReviewIndex] = useState(0);
  const [slidesToShow, setSlidesToShow] = useState(3);
  const [isReviewHovered, setIsReviewHovered] = useState(false);


  const fetchHomeData = async () => {
    try {
      setLoading(true);

      const [productsRes, articlesRes, videosRes, shortsRes, blogsRes, reviewsRes] =
        await Promise.all([
          api.get("/products"),
          api.get("/articles"),
          api.get("/videos"),
          api.get("/shorts"),
          api.get("/blogs"),
          api.get("/reviews").catch(() => ({ data: [] })),
        ]);

      const publishedProducts = (productsRes.data || []).filter(
        (product) => product.status === "published"
      );

      const latest = publishedProducts
        .sort((a, b) => b._id.localeCompare(a._id))
        .slice(0, 3);

      setLatestProducts(latest);

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

      const threeMonthsAgo = new Date();
      threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
      const recentReviews = (reviewsRes.data || []).filter((item) => {
        if (!item.image || !item.createdAt) return false;
        return new Date(item.createdAt) >= threeMonthsAgo;
      });
      setReviews(recentReviews);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHomeData();
  }, []);

  // Desktop par 3, Tablet par 2, Mobile par 1 full-width review slide
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

  const maxReviewIndex = Math.max(0, reviews.length - slidesToShow);

  useEffect(() => {
    if (reviewIndex > maxReviewIndex) {
      setReviewIndex(maxReviewIndex);
    }
  }, [maxReviewIndex, reviewIndex]);

  useEffect(() => {
    if (reviews.length <= slidesToShow || isReviewHovered) return;

    const autoSlideTimer = setInterval(() => {
      setReviewIndex((prev) => (prev >= maxReviewIndex ? 0 : prev + 1));
    }, 3500);

    return () => clearInterval(autoSlideTimer);
  }, [reviews.length, slidesToShow, maxReviewIndex, isReviewHovered]);

  const handlePrevReview = () => {
    setReviewIndex((prev) => (prev <= 0 ? maxReviewIndex : prev - 1));
  };

  const handleNextReview = () => {
    setReviewIndex((prev) => (prev >= maxReviewIndex ? 0 : prev + 1));
  };

  useEffect(() => {
    const handleScroll = () => setScrollVisible(window.scrollY > 300);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (!counterStarted) return;

    let animationFrameId;
    const duration = 1800;
    const startTime = performance.now();

    const animateCount = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 4);

      setCounterValue(Math.floor(easeOut * targetViews));

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(animateCount);
      } else {
        setCounterValue(targetViews);
      }
    };

    animationFrameId = requestAnimationFrame(animateCount);

    return () => cancelAnimationFrame(animationFrameId);
  }, [counterStarted, targetViews]);

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
  const handleHomeProductBuy = (event, product) => {
    event.stopPropagation();

    if (Number(product.price) <= 0) return;

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
      <div className="floating-buttons">

        <a href="https://wa.me/923054800448"
          target="_blank"
          rel="noreferrer"
          className="floating-whatsapp"
          aria-label="WhatsApp"
        >
          <img src="/whatsapp-icon.png" alt="WhatsApp" className="floating-whatsapp-img" />
        </a>
        <button
          className="floating-scroll-top"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          aria-label="Scroll to top"
          style={{ opacity: scrollVisible ? 1 : 0, pointerEvents: scrollVisible ? "auto" : "none" }}
        >
          <FiArrowUp />
        </button>
      </div>
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

                  {/* Margin bottom 0 kar diya taake neechay extra space na bache */}
                  <p className="hakeem-subtitle" style={{ marginBottom: 0 }}>
                    Specialist in Unani Single-Organ Therapy
                  </p>

                  {/* Yahan se description aur hero-actions (buttons) remove kar diye gaye hain */}
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

          <section id="latest-products" className="popular-products-section">
            <div className="container">
              <div className="section-header">
                <h2>Latest Products</h2>
                <p>Explore our newest herbal products and wellness remedies</p>
                <div className="products-title-line"></div>
              </div>

              <div className="home-products-grid">
                {latestProducts.map((product, index) => (
                  <article
                    key={product._id}
                    className={`home-product-card fade-up fade-up-delay-${(index % 4) + 1} ${activeHomeProductId === product._id ? "is-actions-open" : ""
                      }`}
                    onClick={() => {
                      setActiveHomeProductId((prev) =>
                        prev === product._id ? null : product._id
                      );
                    }}
                  >
                    {product.category === "popular" && (
                      <span className="home-product-popular-badge">
                        Popular
                      </span>
                    )}

                    <div className="home-product-image-box">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="home-product-image"
                        loading="lazy"
                      />

                      {/* Hover Actions Overlay */}
                      <div className="home-product-hover-actions">
                        {Number(product.price) > 0 ? (
                          <button
                            type="button"
                            className="home-hover-btn btn-buy"
                            onClick={(event) => handleHomeProductBuy(event, product)}
                          >
                            Buy
                          </button>
                        ) : (
                          <button
                            type="button"
                            className="home-hover-btn btn-coming-soon"
                            disabled
                          >
                            Coming Soon
                          </button>
                        )}
                        <button
                          type="button"
                          className="home-hover-btn btn-details"
                          onClick={(event) => {
                            event.stopPropagation();
                            navigate(`/products/${product._id}`);
                          }}
                        >
                          View Details <FiArrowRight />
                        </button>
                      </div>
                    </div>

                    <div className="home-product-content">
                      <h3 className="home-product-name">{product.name}</h3>

                      {Number(product.price) > 0 ? (
                        <p className="home-product-price">Rs.{product.price}</p>
                      ) : (
                        <p className="home-product-price-coming">Coming Soon</p>
                      )}
                    </div>
                  </article>
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

          {!loading && blogs.slice(0, 3).length > 0 && (
            <section className="home-preview-section">
              <div className="section-header">
                <h2>Latest Blogs</h2>
                <p>
                  Read our latest health, wellness and Unani medicine blogs.
                </p>
                <div className="products-title-line"></div>
              </div>

              <div className="home-blogs-grid">
                {blogs.slice(0, 3).map((blog, index) => {
                  const excerpt = stripHtml(blog.excerpt || blog.content);

                  return (
                    <article
                      key={blog._id}
                      className={`blog-card fade-up fade-up-delay-${(index % 4) + 1}`}
                      onClick={() => navigate(`/blogs/${blog._id}`)}
                    >
                      <div className="blog-card-image">
                        <img
                          src={blog.image}
                          alt={blog.title}
                          loading="lazy"
                        />
                      </div>

                      <div className="blog-card-body">
                        <h3 className="blog-card-title">
                          {blog.title}
                        </h3>

                        {excerpt && (
                          <p className="blog-card-excerpt">
                            {excerpt}
                          </p>
                        )}

                        <div className="blog-card-footer home-blog-card-footer">
                          <span className="blog-card-readmore">
                            مزید پڑھیں
                          </span>
                        </div>
                      </div>
                    </article>
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

              <div className="home-videos-grid">
                {featuredVideos.map((video) => (
                  <div key={video._id} className="home-video-card" onClick={() => handleVideoClick(video)}>
                    <div className="home-video-thumb-wrap">
                      <img
                        src={video.thumbnail || "/video-1.jpeg"}
                        alt={video.title}
                        className="home-video-thumb"
                      />
                      <div className="play-icon-overlay">
                        <FaPlayCircle />
                      </div>
                    </div>
                    <div className="home-video-content">
                      <h3 className="home-video-card-title">{video.title}</h3>
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
                  <div key={short._id} className="home-short-card" onClick={() => handleVideoClick(short)}>
                    <div className="home-short-thumb-wrap">
                      <img
                        src={short.thumbnail || "/short-1.jpeg"}
                        alt={short.title}
                        className="home-short-thumb"
                      />
                      <div className="play-icon-overlay">
                        <FaPlayCircle />
                      </div>
                    </div>
                    <div className="home-short-content">
                      <h3 className="home-short-card-title">{short.title}</h3>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {!loading && reviews.length > 0 && (() => {
            const effectiveSlides = Math.max(
              1,
              Math.min(slidesToShow, reviews.length)
            );

            return (
              <section
                className="home-reviews-section reveal-on-scroll"
                onMouseEnter={() => setIsReviewHovered(true)}
                onMouseLeave={() => setIsReviewHovered(false)}
              >
                <div className="section-header">
                  <h2>What Our Customers Say</h2>
                  <div className="products-title-line"></div>
                </div>

                <div className="home-reviews-fullbleed">
                  {reviews.length > effectiveSlides && (
                    <button
                      type="button"
                      className="reviews-arrow-btn prev"
                      onClick={handlePrevReview}
                      aria-label="Previous review"
                    >
                      <FiChevronLeft />
                    </button>
                  )}

                  <div className="home-reviews-viewport">
                    <div
                      className="home-reviews-track"
                      style={{
                        transform: `translateX(-${reviewIndex * (100 / effectiveSlides)
                          }%)`,
                      }}
                    >
                      {reviews.map((rev, idx) => (
                        <div
                          key={rev._id || idx}
                          className="home-review-tile"
                          style={{ flex: `0 0 ${100 / effectiveSlides}%` }}
                        >
                          <img
                            src={rev.image}
                            alt={`Customer Review ${idx + 1}`}
                            className="home-review-img"
                            loading="lazy"
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  {reviews.length > effectiveSlides && (
                    <button
                      type="button"
                      className="reviews-arrow-btn next"
                      onClick={handleNextReview}
                      aria-label="Next review"
                    >
                      <FiChevronRight />
                    </button>
                  )}
                </div>
              </section>
            );
          })()}


          <section className="website-counter-section reveal-on-scroll">
            <span className="views-eyebrow">Website Visitors</span>
            <div className="views-number-display">
              {counterValue.toLocaleString()}
            </div>
            <p className="views-description">
              Trusted by visitors exploring natural healing, herbal remedies &amp; Unani guidance.
            </p>
          </section>
        </div>
      </section>
    </main >
  );
}

export default Home;