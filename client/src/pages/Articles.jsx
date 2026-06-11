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
      setArticles(res.data);
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
          className={`article-list-grid ${expandedId ? "article-list-grid-expanded" : ""
            }`}
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

              return (
                <div
                  key={article._id}
                  className={`article-grid-item fade-up fade-up-delay-${(index % 6) + 1
                    }`}
                >
                  <div
                    className={`article-story-card ${isExpanded ? "article-story-card-expanded" : ""
                      }`}
                  >
                    <div className="article-story-card-top">
                      <span className="article-story-date">
                        {formatDate(article.date || article.createdAt)}
                      </span>

                      <h3
                        className={`article-story-title ${isExpanded ? "article-story-title-expanded" : ""
                          }`}
                        title={article.title}
                      >
                        {article.title}
                      </h3>

                      <div className="article-story-badge">{index + 1}</div>
                    </div>

                    <div className="article-story-card-body">
                      <p className="article-story-text">
                        {isExpanded
                          ? article.excerpt
                          : `${article.excerpt.slice(0, 120)}...`}
                      </p>

                      {!isExpanded ? (
                        <button
                          className="article-story-link"
                          onClick={() => setExpandedId(article._id)}
                        >
                          Read more
                        </button>
                      ) : (
                        <button
                          className="article-story-link"
                          onClick={() => setExpandedId(null)}
                        >
                          See less
                        </button>
                      )}
                    </div>
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