import { useEffect, useState } from "react";
import { FaYoutube, FaFacebook } from "react-icons/fa";
import { FiChevronDown, FiExternalLink } from "react-icons/fi";
import api from "../api/api";
import SEO from "../components/SEO";
import "../css/Shorts.css";

function Shorts() {
  const [shorts, setShorts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDropdown, setOpenDropdown] = useState(null);

  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");

  const fetchShorts = async () => {
    try {
      setLoading(true);
      const res = await api.get("/shorts");

      const publishedShorts = (res.data || []).filter(
        (short) => short.status === "published"
      );

      setShorts(publishedShorts);

      const uniqueCategories = [
        ...new Set(publishedShorts.map((s) => s.category).filter(Boolean)),
      ];
      setCategories(uniqueCategories);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShorts();
  }, []);

  const filteredShorts = selectedCategory
    ? shorts.filter((s) => s.category === selectedCategory)
    : shorts;

  // SEO: JSON-LD structured data
  useEffect(() => {
    if (!shorts.length) return;

    const data = {
      "@context": "https://schema.org",
      "@type": "ItemList",
      itemListElement: shorts.map((short, index) => ({
        "@type": "ListItem",
        position: index + 1,
        item: {
          "@type": "VideoObject",
          name: short.title,
          description:
            short.metaDescription ||
            (short.description
              ? short.description.replace(/<[^>]+>/g, "").slice(0, 160)
              : short.title),
          thumbnailUrl: short.thumbnail || undefined,
          uploadDate: short.createdAt,
          contentUrl: short.youtubeUrl || short.facebookUrl || undefined,
          embedUrl: short.youtubeUrl || undefined,
        },
      })),
    };

    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.setAttribute("data-shorts-jsonld", "true");
    script.text = JSON.stringify(data);
    document.head.appendChild(script);

    return () => {
      document.head
        .querySelectorAll('script[data-shorts-jsonld="true"]')
        .forEach((el) => el.remove());
    };
  }, [shorts]);

  return (
    <section className="shorts-showcase-page page-fade-up">
      <SEO
        title="Wellness Shorts & Quick Health Tips | Hakeem Ismail"
        description="Watch quick wellness shorts, herbal awareness clips, Tib-e-Yunani tips and natural lifestyle guidance by Hakeem Muhammad Ismail."
        canonical="/shorts"
      />

      <div className="container">
        <div className="shorts-showcase-header fade-up fade-up-delay-1">
          <h1 className="shorts-showcase-title">Our Shorts</h1>

          <p className="shorts-showcase-subtitle">
            Watch quick and engaging short videos filled with wellness tips,
            herbal awareness, and natural lifestyle guidance.
          </p>

          <div className="shorts-showcase-line"></div>
        </div>

        {/* Category dropdown (Videos page jaisa) */}
        <div className="shorts-videos-toolbar">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="shorts-video-filter"
          >
            <option value="">All Categories</option>

            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div className="shorts-showcase-grid">
          {loading ? (
            [1, 2, 3, 4, 5, 6].map((item) => (
              <div className="shorts-showcase-card shorts-skeleton" key={item}>
                <div className="shorts-skeleton-thumb" />
                <div className="shorts-skeleton-content">
                  <span />
                  <button />
                </div>
              </div>
            ))
          ) : filteredShorts.length === 0 ? (
            <div className="shorts-empty-state">No shorts found.</div>
          ) : (
            filteredShorts.map((short, index) => (
              <article
                className={`fade-up fade-up-delay-${(index % 6) + 1}`}
                key={short._id}
              >
                <div className="shorts-showcase-card">
                  <img
                    src={short.thumbnail || "/short-1.jpeg"}
                    alt={short.title}
                    className="shorts-showcase-thumb"
                    loading="lazy"
                  />

                  <div className="shorts-showcase-overlay"></div>

                  {short.category && (
                    <span className="shorts-showcase-category">{short.category}</span>
                  )}

                  <span className="shorts-showcase-duration">{short.duration}</span>

                  <div className="shorts-showcase-content">
                    {short.tags?.length > 0 && (
                      <div className="shorts-hashtags">
                        {short.tags.slice(0, 3).map((tag) => (
                          <span className="shorts-hashtag" key={tag}>
                            #{tag.replace(/\s+/g, "")}
                          </span>
                        ))}
                      </div>
                    )}

                    <h3 className="shorts-showcase-card-title">{short.title}</h3>

                    <div className="video-dropdown-wrapper">
                      <button
                        className="admin-video-platform-btn"
                        onClick={() =>
                          setOpenDropdown(openDropdown === short._id ? null : short._id)
                        }
                      >
                        Watch Now
                        <FiChevronDown />
                      </button>

                      {openDropdown === short._id && (
                        <div className="video-dropdown">
                          {short.youtubeUrl && (

                            <a href={short.youtubeUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="video-dropdown-item youtube"
                            >
                              <FaYoutube />
                              <span>YouTube</span>
                              <FiExternalLink className="right-icon" />
                            </a>
                          )}

                          {short.facebookUrl && (

                            <a href={short.facebookUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="video-dropdown-item facebook"
                            >
                              <FaFacebook />
                              <span>Facebook</span>
                              <FiExternalLink className="right-icon" />
                            </a>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </article>
            ))
          )}
        </div>
      </div>
    </section>
  );
}

export default Shorts;