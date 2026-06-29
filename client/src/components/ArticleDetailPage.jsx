// ArticleDetailPage.jsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import SEO from "../components/SEO";
import api from "../api/api";
import "../css/ArticleDetailPage.css";
import { FiArrowLeft, FiCalendar, FiTag } from "react-icons/fi";

function ArticleDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [article, setArticle] = useState(null);
    const [relatedArticles, setRelatedArticles] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        window.scrollTo(0, 0);
        fetchArticle();
    }, [id]);

    const fetchArticle = async () => {
        try {
            setLoading(true);
            const res = await api.get(`/articles/${id}`);
            setArticle(res.data);

            const allRes = await api.get("/articles");
            const published = allRes.data.filter(
                (a) => a.status === "published" && a._id !== id
            );
            setRelatedArticles(published.slice(0, 3));
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (date) =>
        new Date(date).toLocaleDateString("en-PK", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });

    const stripHtml = (html = "") => html.replace(/<[^>]+>/g, "").trim();

    if (loading) {
        return (
            <div className="adp-loading">
                <div className="adp-spinner" />
            </div>
        );
    }

    if (!article) {
        return (
            <div className="adp-not-found">
                <p>Article not found.</p>
                <button onClick={() => navigate("/articles")}>Back to Articles</button>
            </div>
        );
    }

    return (
        <main className="adp-page">
            <SEO
                title={article.title}
                description={stripHtml(article.excerpt || article.content).slice(0, 160)}
                canonical={`/articles/${article._id}`}
            />

            <button className="adp-back-btn" onClick={() => navigate(-1)}>
                <FiArrowLeft />
            </button>

            {/* ── HEADER ── */}
            <div className="adp-header-section">
                <div className="adp-header-inner">
                    <h1 className="adp-title">{article.title}</h1>
                    <div className="adp-meta-row">
                        <FiCalendar size={14} />
                        <span className="adp-date">{formatDate(article.date || article.createdAt)}</span>
                    </div>
                </div>
            </div>

            {/* ── ARTICLE BODY ── */}
            <div className="adp-wrapper">
                <article className="adp-article">
                    <div
                        className="adp-body quill-content"
                        dangerouslySetInnerHTML={{ __html: article.content }}
                    />

                    <div className="adp-bottom-divider" />

                    <div className="adp-footer-row">
                        <button className="adp-back-link" onClick={() => navigate("/articles")}>
                            <FiArrowLeft size={15} />
                            All Articles
                        </button>
                    </div>
                </article>
            </div>

            {/* ── RELATED ARTICLES ── */}
            {relatedArticles.length > 0 && (
                <section className="adp-related">
                    <div className="adp-related-inner">
                        <div className="adp-related-header">
                            <p className="adp-related-eyebrow">Read More</p>
                            <h2 className="adp-related-title">Related Articles</h2>
                        </div>

                        <div className="adp-related-grid">
                            {relatedArticles.map((ra) => (
                                <div
                                    key={ra._id}
                                    className="adp-related-card"
                                    onClick={() => navigate(`/articles/${ra._id}`)}
                                >
                                    <div className="adp-related-card-top">
                                        <span className="adp-related-date">
                                            {new Date(ra.date || ra.createdAt)
                                                .toLocaleDateString("en-GB", {
                                                    day: "2-digit",
                                                    month: "short",
                                                    year: "numeric",
                                                })
                                                .toUpperCase()}
                                        </span>
                                    </div>
                                    <div className="adp-related-body">
                                        <h3 className="adp-related-card-title">{ra.title}</h3>
                                        <span className="adp-related-readmore">مزید پڑھیں ←</span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="adp-all-wrap">
                            <button className="adp-all-btn" onClick={() => navigate("/articles")}>
                                View All Articles
                            </button>
                        </div>
                    </div>
                </section>
            )}
        </main>
    );
}

export default ArticleDetailPage;