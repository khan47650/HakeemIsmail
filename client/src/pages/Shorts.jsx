// Shorts.jsx
import { useEffect, useState, useRef } from "react";
import { FaYoutube, FaFacebook, FaPlay } from "react-icons/fa";
import { FiExternalLink, FiSearch, FiX } from "react-icons/fi";
import api from "../api/api";
import SEO from "../components/SEO";
import "../css/Shorts.css";

const SHORTS_PER_PAGE = 12;

function Shorts() {
  const [shorts, setShorts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [showAll, setShowAll] = useState(false);
  const [platformModal, setPlatformModal] = useState(null);

  useEffect(() => { fetchShorts(); }, []);
  useEffect(() => { setShowAll(false); }, [selectedCategory, searchQuery]);

  // Close modal on outside click
  const modalRef = useRef(null);
  useEffect(() => {
    if (!platformModal) return;
    const handler = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        setPlatformModal(null);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [platformModal]);

  const fetchShorts = async () => {
    try {
      setLoading(true);
      const res = await api.get("/shorts");
      const published = (res.data || []).filter((s) => s.status === "published");
      setShorts(published);
      const uniqueCats = [...new Set(published.map((s) => s.category).filter(Boolean))];
      setCategories(uniqueCats);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const handleShortClick = (short) => {
    const hasYT = Boolean(short.youtubeUrl);
    const hasFB = Boolean(short.facebookUrl);

    if (hasYT && hasFB) {
      setPlatformModal({ youtubeUrl: short.youtubeUrl, facebookUrl: short.facebookUrl });
    } else if (hasYT) {
      window.open(short.youtubeUrl, "_blank", "noreferrer");
    } else if (hasFB) {
      window.open(short.facebookUrl, "_blank", "noreferrer");
    }
  };

  const filtered = shorts
    .filter((s) => !selectedCategory || s.category === selectedCategory)
    .filter((s) => !searchQuery || s.title.toLowerCase().includes(searchQuery.toLowerCase()));

  const visible = showAll ? filtered : filtered.slice(0, SHORTS_PER_PAGE);
  const hasMore = !showAll && filtered.length > SHORTS_PER_PAGE;

  return (
    <section className="shorts-page page-fade-up">
      <SEO
        title="Wellness Shorts & Quick Health Tips | Hakeem Ismail"
        description="Watch quick wellness shorts, herbal awareness clips, Tib-e-Yunani tips and natural lifestyle guidance by Hakeem Muhammad Ismail."
        canonical="/shorts"
      />

      <div className="container">

        {/* Header */}
        <div className="shorts-header fade-up fade-up-delay-1">
          <h1 className="shorts-title">Our Shorts</h1>
          <p className="shorts-subtitle">
            Watch quick and engaging short videos filled with wellness tips,
            herbal awareness, and natural lifestyle guidance.
          </p>
          <div className="shorts-title-line" />
        </div>

        {/* Toolbar */}
        <div className="shorts-toolbar">
          <div className="shorts-category-wrap">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="shorts-filter"
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div className="shorts-search-wrap">
            <FiSearch className="shorts-search-icon" />
            <input
              type="text"
              placeholder="Search shorts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="shorts-search-input"
            />
          </div>
        </div>

        {/* Grid */}
        <div className="shorts-grid">
          {loading ? (
            [...Array(8)].map((_, i) => (
              <div className="shorts-card shorts-skeleton" key={i}>
                <div className="shorts-skeleton-thumb" />
                <div className="shorts-skeleton-content"><span /></div>
              </div>
            ))
          ) : filtered.length === 0 ? (
            <div className="shorts-empty">No shorts found.</div>
          ) : (
            visible.map((short, index) => (
              <div
                className={`shorts-card fade-up fade-up-delay-${(index % 4) + 1}`}
                key={short._id}
                onClick={() => handleShortClick(short)}
              >
                <div className="shorts-thumb-wrap">
                  <img
                    src={short.thumbnail || "/short-1.jpeg"}
                    alt={short.title}
                    className="shorts-thumb"
                    loading="lazy"
                  />

                  {/* Play icon overlay on hover */}
                  <div className="shorts-hover-overlay">
                    <div className="shorts-play-btn">
                      <FaPlay />
                    </div>
                  </div>
                </div>

                <div className="shorts-content">
                  <h3 className="shorts-card-title">{short.title}</h3>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Show More */}
        {hasMore && (
          <div className="shorts-more-wrap">
            <button className="shorts-show-more" onClick={() => setShowAll(true)}>
              Show More
            </button>
          </div>
        )}
      </div>

      {/* Platform Picker Modal */}
      {platformModal && (
        <div className="shorts-modal-backdrop">
          <div className="shorts-modal" ref={modalRef}>
            <button className="shorts-modal-close" onClick={() => setPlatformModal(null)}>
              <FiX />
            </button>
            <p className="shorts-modal-title">Watch on</p>


            <a href={platformModal.youtubeUrl}
              target="_blank"
              rel="noreferrer"
              className="shorts-modal-option youtube"
              onClick={() => setPlatformModal(null)}
            >
              <FaYoutube />
              <span>YouTube</span>
              <FiExternalLink className="right-icon" />
            </a>


            <a href={platformModal.facebookUrl}
              target="_blank"
              rel="noreferrer"
              className="shorts-modal-option facebook"
              onClick={() => setPlatformModal(null)}
            >
              <FaFacebook />
              <span>Facebook</span>
              <FiExternalLink className="right-icon" />
            </a>
          </div>
        </div >
      )
      }
    </section >
  );
}

export default Shorts;