
import { useEffect, useState, useRef, useEffect as useClickOutside } from "react";
import { FaYoutube, FaFacebook, FaPlay } from "react-icons/fa";
import { FiExternalLink, FiSearch, FiX } from "react-icons/fi";
import api from "../api/api";
import SEO from "../components/SEO";
import "../css/Videos.css";

const VIDEOS_PER_PAGE = 12;

function Videos() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [showAll, setShowAll] = useState(false);
  const [platformModal, setPlatformModal] = useState(null); // { youtubeUrl, facebookUrl }

  useEffect(() => { fetchVideos(); }, []);
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

  const fetchVideos = async () => {
    try {
      setLoading(true);
      const res = await api.get("/videos");
      const published = (res.data || []).filter((v) => v.status === "published");
      setVideos(published);
      const uniqueCats = [...new Set(published.map((v) => v.category).filter(Boolean))];
      setCategories(uniqueCats);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const handleVideoClick = (video) => {
    const hasYT = Boolean(video.youtubeUrl);
    const hasFB = Boolean(video.facebookUrl);

    if (hasYT && hasFB) {
      // Both — show platform picker modal
      setPlatformModal({ youtubeUrl: video.youtubeUrl, facebookUrl: video.facebookUrl });
    } else if (hasYT) {
      window.open(video.youtubeUrl, "_blank", "noreferrer");
    } else if (hasFB) {
      window.open(video.facebookUrl, "_blank", "noreferrer");
    }
  };

  const filtered = videos
    .filter((v) => !selectedCategory || v.category === selectedCategory)
    .filter((v) => !searchQuery || v.title.toLowerCase().includes(searchQuery.toLowerCase()));

  const visible = showAll ? filtered : filtered.slice(0, VIDEOS_PER_PAGE);
  const hasMore = !showAll && filtered.length > VIDEOS_PER_PAGE;

  return (
    <section className="lux-videos-page page-fade-up">
      <SEO
        title="Our Videos | Hakeem Ismail"
        description="Watch wellness videos, herbal awareness content, natural health tips and Unani guidance from Hakeem Muhammad Ismail."
        canonical="/videos"
      />

      <div className="container">

        {/* Header */}
        <div className="lux-videos-header fade-up fade-up-delay-1">
          <h1 className="lux-videos-title">Our Videos</h1>
          <p className="lux-videos-subtitle">
            Explore our latest YouTube and Facebook videos for wellness
            guidance, natural health tips, and herbal awareness.
          </p>
          <div className="lux-videos-title-line" />
        </div>

        {/* Toolbar */}
        <div className="lux-videos-toolbar">
          <div className="lux-category-wrap">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="lux-video-filter"
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div className="lux-search-wrap">
            <FiSearch className="lux-search-icon" />
            <input
              type="text"
              placeholder="Search videos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="lux-search-input"
            />
          </div>
        </div>

        {/* Grid */}
        <div className="lux-videos-grid">
          {loading ? (
            [...Array(8)].map((_, i) => (
              <div className="lux-video-card video-skeleton" key={i}>
                <div className="video-skeleton-thumb" />
                <div className="video-skeleton-content"><span /></div>
              </div>
            ))
          ) : filtered.length === 0 ? (
            <div className="lux-videos-empty">No videos found.</div>
          ) : (
            visible.map((video, index) => (
              <div
                className={`lux-video-card fade-up fade-up-delay-${(index % 4) + 1}`}
                key={video._id}
                onClick={() => handleVideoClick(video)}
              >
                <div className="lux-video-thumb-wrap">
                  <img
                    src={video.thumbnail || "/video-1.jpeg"}
                    alt={video.title}
                    className="lux-video-thumb"
                    loading="lazy"
                  />

                  {/* Play icon overlay on hover */}
                  <div className="lux-video-hover-overlay">
                    <div className="lux-play-btn">
                      <FaPlay />
                    </div>
                  </div>
                </div>

                <div className="lux-video-content">
                  <h3 className="lux-video-card-title">{video.title}</h3>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Show More */}
        {hasMore && (
          <div className="lux-videos-more-wrap">
            <button className="lux-videos-show-more" onClick={() => setShowAll(true)}>
              Show More
            </button>
          </div>
        )}
      </div>

      {/* Platform Picker Modal */}
      {platformModal && (
        <div className="lux-modal-backdrop">
          <div className="lux-modal" ref={modalRef}>
            <button className="lux-modal-close" onClick={() => setPlatformModal(null)}>
              <FiX />
            </button>
            <p className="lux-modal-title">Watch on</p>


            <a href={platformModal.youtubeUrl}
              target="_blank"
              rel="noreferrer"
              className="lux-modal-option youtube"
              onClick={() => setPlatformModal(null)}
            >
              <FaYoutube />
              <span>YouTube</span>
              <FiExternalLink className="right-icon" />
            </a>


            <a href={platformModal.facebookUrl}
              target="_blank"
              rel="noreferrer"
              className="lux-modal-option facebook"
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

export default Videos;