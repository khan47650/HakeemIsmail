import { useEffect, useState } from "react";
import { FiArrowLeft, FiPlus, FiEdit2, FiTrash2 } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../../api/api";
import ArticleDeleteDialog from "../../components/admin/DeleteDialog";
import "../../css/AdminArticles.css";

function AdminArticles() {
    const navigate = useNavigate();

    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [deleteDialog, setDeleteDialog] = useState(false);
    const [deleteId, setDeleteId] = useState(null);

    const fetchArticles = async () => {
        try {
            setLoading(true);
            const res = await api.get("/articles");
            setArticles(res.data || []);
        } catch (error) {
            console.log(error);
            toast.error("Failed to load articles");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchArticles();
    }, []);

    const handleDelete = async () => {
        try {
            await api.delete(`/articles/${deleteId}`);
            toast.success("Article deleted successfully");
            fetchArticles();
            setDeleteDialog(false);
        } catch (error) {
            console.log(error);
            toast.error("Failed to delete article");
        }
    };

    const formatDate = (date) =>
        new Date(date).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });

    const statusClass = (a) => (a.status === "published" ? "published" : "draft");
    const statusLabel = (a) => (a.status === "published" ? "Published" : "Draft");

    return (
        <section className="admin-articles-page page-fade-up">
            <div className="admin-articles-top">
                <div className="admin-articles-title-wrap">
                    <button className="admin-articles-back-btn" onClick={() => navigate(-1)}>
                        <FiArrowLeft />
                    </button>
                    <h1>Articles</h1>
                </div>

                <button className="admin-add-article-btn" onClick={() => navigate("/admin/articles/new")}>
                    <FiPlus />
                    Add New Article
                </button>
            </div>

            <div className="admin-articles-grid">
                {loading ? (
                    [...Array(6)].map((_, index) => (
                        <div className="admin-article-skeleton" key={index}></div>
                    ))
                ) : articles.length === 0 ? (
                    <div className="admin-empty-state">
                        <div>📝</div>
                        <div>No articles yet. Start creating!</div>
                    </div>
                ) : (
                    articles.map((article, index) => (
                        <div key={article._id} className={`admin-article-item fade-up fade-up-delay-${Math.min((index % 6) + 1, 6)}`}>
                            <div className="admin-article-card">
                                <div className="admin-article-card-top">
                                    <span className="admin-article-date">
                                        {formatDate(article.date || article.createdAt)}
                                    </span>
                                    <span className={`admin-article-status ${statusClass(article)}`}>
                                        {statusLabel(article)}
                                    </span>
                                </div>

                                <div className="admin-article-card-body">
                                    <h3 className="admin-article-title" title={article.title}>
                                        {article.title}
                                    </h3>

                                    <p className="admin-article-text">
                                        {(article.excerpt || article.content?.replace(/<[^>]+>/g, "") || "").slice(0, 140).trim()}
                                        {(article.excerpt || article.content?.replace(/<[^>]+>/g, "") || "").length > 140 ? "..." : ""}
                                    </p>

                                    {article.tags?.length > 0 && (
                                        <div className="admin-article-tags">
                                            {article.tags.slice(0, 4).map((t) => (
                                                <span key={t}>#{t.replace(/\s+/g, "")}</span>
                                            ))}
                                        </div>
                                    )}

                                    <div className="admin-article-bottom">
                                        <div className="admin-article-actions">
                                            <button
                                                className="admin-article-edit-btn"
                                                title="Edit article"
                                                onClick={() => navigate(`/admin/articles/edit/${article._id}`)}
                                            >
                                                <FiEdit2 />
                                            </button>
                                            <button
                                                className="admin-article-delete-btn"
                                                title="Delete article"
                                                onClick={() => { setDeleteId(article._id); setDeleteDialog(true); }}
                                            >
                                                <FiTrash2 />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            <ArticleDeleteDialog
                open={deleteDialog}
                onClose={() => setDeleteDialog(false)}
                onConfirm={handleDelete}
            />
        </section>
    );
}

export default AdminArticles;