import { useEffect, useState } from "react";
import { FiArrowLeft, FiPlus, FiEdit2, FiTrash2 } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import api from "../../api/api";
import ArticleDialog from "./ArticleDialog";
import ArticleDeleteDialog from "./DeleteDialog";
import "../../css/AdminArticles.css";

function AdminArticles() {
    const navigate = useNavigate();

    const [expandedId, setExpandedId] = useState(null);
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);

    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedArticle, setSelectedArticle] = useState(null);

    const [deleteDialog, setDeleteDialog] = useState(false);
    const [deleteId, setDeleteId] = useState(null);

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

    const handleDelete = async () => {
        try {
            await api.delete(`/articles/${deleteId}`);
            fetchArticles();
            setDeleteDialog(false);
            setExpandedId(null);
        } catch (error) {
            console.log(error);
        }
    };

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
        <section className="admin-articles-page page-fade-up">
            <div className="admin-articles-top">
                <div className="admin-articles-title-wrap">
                    <button
                        className="admin-articles-back-btn"
                        onClick={() => navigate(-1)}
                    >
                        <FiArrowLeft />
                    </button>

                    <h1>Articles</h1>
                </div>

                <button
                    className="admin-add-article-btn"
                    onClick={() => {
                        setSelectedArticle(null);
                        setDialogOpen(true);
                    }}
                >
                    <FiPlus />
                    Add New
                </button>
            </div>

            <div
                className={`admin-articles-grid ${expandedId ? "admin-articles-grid-expanded" : ""
                    }`}
            >
                {loading ? (
                    [...Array(6)].map((_, index) => (
                        <div className="admin-article-skeleton" key={index}></div>
                    ))
                ) : articles.length === 0 ? (
                    <div className="admin-empty-state">
                        Articles Not Uploaded Yet.
                    </div>
                ) : (
                    visibleArticles.map((article, index) => {
                        const isExpanded = expandedId === article._id;

                        return (
                            <div
                                key={article._id}
                                className={`admin-article-item fade-up fade-up-delay-${(index % 6) + 1
                                    }`}
                            >
                                <div
                                    className={`admin-article-card ${isExpanded ? "admin-article-card-expanded" : ""
                                        }`}
                                >
                                    <div className="admin-article-card-top">
                                        <span className="admin-article-date">
                                            {formatDate(article.date || article.createdAt)}
                                        </span>

                                        <h3
                                            className={`admin-article-title ${isExpanded ? "admin-article-title-expanded" : ""
                                                }`}
                                            title={article.title}
                                        >
                                            {article.title}
                                        </h3>

                                        <div className="admin-article-badge">
                                            {index + 1}
                                        </div>
                                    </div>

                                    <div className="admin-article-card-body">
                                        <p className="admin-article-text">
                                            {isExpanded
                                                ? article.excerpt
                                                : `${article.excerpt.slice(0, 120)}...`}
                                        </p>

                                        <div className="admin-article-bottom">
                                            {!isExpanded ? (
                                                <button
                                                    className="admin-article-link"
                                                    onClick={() => setExpandedId(article._id)}
                                                >
                                                    Read more
                                                </button>
                                            ) : (
                                                <button
                                                    className="admin-article-link"
                                                    onClick={() => setExpandedId(null)}
                                                >
                                                    See less
                                                </button>
                                            )}

                                            {!isExpanded && (
                                                <div className="admin-article-actions">
                                                    <button
                                                        className="admin-article-edit-btn"
                                                        onClick={() => {
                                                            setSelectedArticle(article);
                                                            setDialogOpen(true);
                                                        }}
                                                    >
                                                        <FiEdit2 />
                                                    </button>

                                                    <button
                                                        className="admin-article-delete-btn"
                                                        onClick={() => {
                                                            setDeleteId(article._id);
                                                            setDeleteDialog(true);
                                                        }}
                                                    >
                                                        <FiTrash2 />
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>

            <ArticleDialog
                open={dialogOpen}
                onClose={() => setDialogOpen(false)}
                fetchArticles={fetchArticles}
                selectedArticle={selectedArticle}
            />

            <ArticleDeleteDialog
                open={deleteDialog}
                onClose={() => setDeleteDialog(false)}
                onConfirm={handleDelete}
            />
        </section>
    );
}

export default AdminArticles;