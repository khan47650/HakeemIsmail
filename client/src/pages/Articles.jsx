import { useEffect, useState } from "react";
import api from "../api/api";
import SEO from "../components/SEO";
import { FiSearch } from "react-icons/fi";
import "../css/Articles.css";

function Articles() {
  const [expandedId, setExpandedId] = useState(null);
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const ARTICLES_PER_PAGE = 8;

  const fetchArticles = async () => {
    try {
      setLoading(true);
      const res = await api.get("/articles");
      const published = (res.data || []).filter(a => a.status === "published");
      setArticles(published);
      setCurrentPage(1);
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

  // Filter by search
  const filteredArticles = articles.filter(article =>
    article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (article.content || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination
  const totalPages = Math.ceil(filteredArticles.length / ARTICLES_PER_PAGE);
  const startIndex = (currentPage - 1) * ARTICLES_PER_PAGE;
  const endIndex = startIndex + ARTICLES_PER_PAGE;
  const paginatedArticles = filteredArticles.slice(startIndex, endIndex);

  const visibleArticles = expandedId
    ? paginatedArticles.filter((article) => article._id === expandedId)
    : paginatedArticles;

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

        {/* Search Bar */}
        <div className="articles-toolbar">
          <div className="articles-search-wrap">
            <FiSearch className="articles-search-icon" />
            <input
              type="text"
              className="articles-search-input"
              placeholder="Search articles..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>
        </div>

        <div
          className={`article-list-grid ${expandedId ? "article-list-grid-expanded" : ""}`}
        >
          {loading ? (
            [...Array(6)].map((_, index) => (
              <div className="article-skeleton" key={index}></div>
            ))
          ) : filteredArticles.length === 0 ? (
            <div className="articles-empty-state">
              {searchTerm ? "No articles found matching your search." : "Articles Not Uploaded Yet."}
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
                            style={{ direction: 'rtl', textAlign: 'right' }}
                            dangerouslySetInnerHTML={{ __html: article.content }}
                          />
                        </div>

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

        {/* Pagination */}
        {!loading && filteredArticles.length > ARTICLES_PER_PAGE && !expandedId && (
          <div className="articles-pagination">
            <button
              className="articles-show-more-btn"
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage >= totalPages}
            >
              Show More
            </button>
            <span className="articles-page-info">
              Page {currentPage} of {totalPages}
            </span>
          </div>
        )}
      </div>
    </section>
  );
}

export default Articles;