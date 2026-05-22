import { useEffect, useState } from "react";
import { FaYoutube, FaFacebook } from "react-icons/fa";
import { FiChevronDown, FiExternalLink } from "react-icons/fi";
import api from "../api/api";
import "../css/Shorts.css";

function Shorts() {
  const [shorts, setShorts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDropdown, setOpenDropdown] = useState(null);

  const fetchShorts = async () => {
    try {
      setLoading(true);
      const res = await api.get("/shorts");
      setShorts(res.data || []);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShorts();
  }, []);

  return (
    <section className="shorts-showcase-page page-fade-up">
      <div className="container">
        <div className="shorts-showcase-header fade-up fade-up-delay-1">
          <h1 className="shorts-showcase-title">Our Shorts</h1>

          <p className="shorts-showcase-subtitle">
            Watch quick and engaging short videos filled with wellness tips,
            herbal awareness, and natural lifestyle guidance.
          </p>

          <div className="shorts-showcase-line"></div>
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
          ) : shorts.length === 0 ? (
            <div className="shorts-empty-state">
              No shorts found.
            </div>
          ) : (
            shorts.map((short, index) => (
              <div
                className={`fade-up fade-up-delay-${(index % 6) + 1}`}
                key={short._id}
              >
                <div className="shorts-showcase-card">
                  <img
                    src={short.thumbnail || "/short-1.jpeg"}
                    alt={short.title}
                    className="shorts-showcase-thumb"
                  />

                  <div className="shorts-showcase-overlay"></div>

                  <span className="shorts-showcase-duration">
                    {short.duration}
                  </span>

                  <div className="shorts-showcase-content">
                    <h3 className="shorts-showcase-card-title">
                      {short.title}
                    </h3>

                    <div className="video-dropdown-wrapper">
                      <button
                        className="admin-video-platform-btn"
                        onClick={() =>
                          setOpenDropdown(
                            openDropdown === short._id ? null : short._id
                          )
                        }
                      >
                        Watch Now
                        <FiChevronDown />
                      </button>

                      {openDropdown === short._id && (
                        <div className="video-dropdown">
                          {short.youtubeUrl && (
                            <a
                              href={short.youtubeUrl}
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
                            <a
                              href={short.facebookUrl}
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

export default Shorts;