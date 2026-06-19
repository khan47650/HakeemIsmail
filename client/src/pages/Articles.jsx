import { useEffect, useState } from "react";
import api from "../api/api";
import SEO from "../components/SEO";
import "../css/Articles.css";

function Articles() {
  const [expandedId, setExpandedId] = useState(null);
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchArticles = async () => {
    try {
      setLoading(true);
      const res = await api.get("/articles");
      // ✅ Filter only published articles
      const published = (res.data || []).filter(a => a.status === "published");
      setArticles(published);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  const stripHtml = (html = "") => html.replace(/<[^>]+>/g, "").trim();

  const visibleArticles = expandedId
    ? articles.filter((article) => article._id === expandedId)
    : articles;

  return (
    <section className="articles-page-section page-fade-up">
      <SEO
        title="Our Articles | Hakeem Ismail"
        description="Explore wellness tips, natural remedies, Unani insights and informative articles by Hakeem Muhammad Ismail."
        canonical="/articles"
      />
      <div className="container">
        <div className="articles-page-header fade-up fade-up-delay-1">
          <h1 className="articles-page-title">Our Articles</h1>

          <p className="articles-page-subtitle">
            Explore helpful reads, wellness tips, and natural health insights
            carefully curated for you.
          </p>

          <div className="articles-page-title-line"></div>
        </div>

        <div
          className={`article-list-grid ${expandedId ? "article-list-grid-expanded" : ""}`}
        >
          {loading ? (
            [...Array(6)].map((_, index) => (
              <div className="article-skeleton" key={index}></div>
            ))
          ) : articles.length === 0 ? (
            <div className="articles-empty-state">
              Articles Not Uploaded Yet.
            </div>
          ) : (
            visibleArticles.map((article, index) => {
              const isExpanded = expandedId === article._id;
              const plainText = stripHtml(article.excerpt || article.content);
              const truncatedText = plainText.slice(0, 140);

              return (
                <div
                  key={article._id}
                  className={`article-grid-item fade-up fade-up-delay-${(index % 6) + 1}`}
                >
                  <div
                    className={`article-story-card ${isExpanded ? "article-story-card-expanded" : ""}`}
                  >
                    {/* HEADER - Title, Date, Status */}
                    <div className="article-story-card-top">
                      <span className="article-story-date">
                        {formatDate(article.date || article.createdAt)}
                      </span>

                      <h3
                        className={`article-story-title ${isExpanded ? "article-story-title-expanded" : ""}`}
                        title={article.title}
                      >
                        {article.title}
                      </h3>

                      <div className="article-story-badge">{index + 1}</div>
                    </div>

                    {/* BODY */}
                    {!isExpanded ? (
                      /* COLLAPSED VIEW */
                      <div className="article-story-card-body">
                        <p className="article-story-text">
                          {truncatedText}
                          {plainText.length > 140 && <span className="article-text-dots">...</span>}
                        </p>

                        {/* HASHTAGS */}
                        {article.tags?.length > 0 && (
                          <div className="article-tags">
                            {article.tags.slice(0, 4).map((tag) => (
                              <span key={tag} className="article-tag">
                                #{tag}
                              </span>
                            ))}
                          </div>
                        )}

                        <button
                          className="article-story-link"
                          onClick={() => setExpandedId(article._id)}
                        >
                          مزید پڑھیں
                        </button>
                      </div>
                    ) : (
                      /* EXPANDED VIEW - SCROLLABLE */
                      <div className="article-story-card-body article-expanded-body">
                        <div className="article-expanded-content">
                          {/* ✅ RENDER HTML WITH JAMEEL NOORI */}
                          <div
                            className="article-full-content quill-content"
                            dangerouslySetInnerHTML={{ __html: article.content }}
                          />
                        </div>

                        {/* HASHTAGS */}
                        {article.tags?.length > 0 && (
                          <div className="article-tags article-tags-expanded">
                            {article.tags.map((tag) => (
                              <span key={tag} className="article-tag">
                                #{tag}
                              </span>
                            ))}
                          </div>
                        )}

                        <button
                          className="article-story-link article-close-link"
                          onClick={() => setExpandedId(null)}
                        >
                          کم کریں
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </section>
  );
}

export default Articles;