import { useEffect, useState } from "react";
import { FaYoutube, FaFacebook } from "react-icons/fa";
import { FiChevronDown, FiExternalLink } from "react-icons/fi";
import api from "../api/api";
import SEO from "../components/SEO";
import "../css/Videos.css";

function Videos() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDropdown, setOpenDropdown] = useState(null);

  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");

  const fetchVideos = async () => {
    try {
      setLoading(true);

      const res = await api.get("/videos");

      const publishedVideos = (res.data || []).filter(
        (video) => video.status === "published"
      );

      setVideos(publishedVideos);

      const uniqueCategories = [
        ...new Set(publishedVideos.map((video) => video.category).filter(Boolean)),
      ];

      setCategories(uniqueCategories);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  const filteredVideos = selectedCategory
    ? videos.filter((video) => video.category === selectedCategory)
    : videos;

  return (
    <section className="lux-videos-page page-fade-up">
      <SEO
        title="Our Videos | Hakeem Ismail"
        description="Watch wellness videos, herbal awareness content, natural health tips and Unani guidance from Hakeem Muhammad Ismail."
        canonical="/videos"
      />

      <div className="container">
        <div className="lux-videos-header fade-up fade-up-delay-1">
          <h1 className="lux-videos-title">Our Videos</h1>

          <p className="lux-videos-subtitle">
            Explore our latest YouTube and Facebook videos for wellness
            guidance, natural health tips, and herbal awareness.
          </p>

          <div className="lux-videos-title-line"></div>
        </div>

        <div className="lux-videos-toolbar">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="lux-video-filter"
          >
            <option value="">All Categories</option>

            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div className="lux-videos-grid">
          {loading ? (
            [1, 2, 3, 4, 5, 6].map((item) => (
              <div className="lux-video-card video-skeleton" key={item}>
                <div className="video-skeleton-thumb" />
                <div className="video-skeleton-content">
                  <span />
                  <p />
                  <button />
                </div>
              </div>
            ))
          ) : filteredVideos.length === 0 ? (
            <div className="lux-videos-empty">No videos found.</div>
          ) : (
            filteredVideos.map((video, index) => (
              <div className={`fade-up fade-up-delay-${(index % 6) + 1}`} key={video._id}>
                <div className="lux-video-card">
                  <div className="lux-video-thumb-wrap">
                    <img
                      src={video.thumbnail || "/video-1.jpeg"}
                      alt={video.title}
                      className="lux-video-thumb"
                    />

                    <span className="lux-video-duration">{video.duration}</span>
                  </div>

                  <div className="lux-video-content">
                    {video.category && (
                      <span className="lux-video-category">{video.category}</span>
                    )}

                    <h3 className="lux-video-card-title">{video.title}</h3>

                    <div
                      className="lux-video-card-text quill-content"
                      dangerouslySetInnerHTML={{ __html: video.description }}
                    />

                    {video.tags?.length > 0 && (
                      <div className="lux-video-hashtags">
                        {video.tags.slice(0, 3).map((tag) => (
                          <span className="lux-video-hashtag" key={tag}>
                            #{tag.replace(/\s+/g, "")}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="video-dropdown-wrapper">
                      <button
                        className="admin-video-platform-btn"
                        onClick={() =>
                          setOpenDropdown(openDropdown === video._id ? null : video._id)
                        }
                      >
                        Watch Now
                        <FiChevronDown />
                      </button>

                      {openDropdown === video._id && (
                        <div className="video-dropdown">
                          {video.youtubeUrl && (

                            <a href={video.youtubeUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="video-dropdown-item youtube"
                            >
                              <FaYoutube />
                              <span>YouTube</span>
                              <FiExternalLink className="right-icon" />
                            </a>
                          )}

                          {video.facebookUrl && (

                            <a href={video.facebookUrl}
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
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}

export default Videos;