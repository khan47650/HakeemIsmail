import { useEffect, useState } from "react";
import api from "../../api/api";
import "../../css/ProductDialog.css";

function ArticleDialog({ open, onClose, fetchArticles, selectedArticle }) {
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        title: "",
        excerpt: "",
    });

    useEffect(() => {
        if (selectedArticle) {
            setFormData({
                title: selectedArticle.title || "",
                excerpt: selectedArticle.excerpt || "",
            });
        } else {
            setFormData({
                title: "",
                excerpt: "",
            });
        }
    }, [selectedArticle]);

    const handleSubmit = async () => {
        try {
            setLoading(true);

            if (selectedArticle) {
                await api.put(`/articles/${selectedArticle._id}`, formData);
            } else {
                await api.post("/articles", formData);
            }

            fetchArticles();
            onClose();
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    if (!open) return null;

    return (
        <div className="dialog-overlay">
            <div className="product-dialog">
                <input
                    type="text"
                    placeholder="Article Title"
                    dir="rtl"
                    value={formData.title}
                    onChange={(e) =>
                        setFormData({ ...formData, title: e.target.value })
                    }
                />

                <textarea
                    placeholder="Article Description"
                    dir="rtl"
                    value={formData.excerpt}
                    onChange={(e) =>
                        setFormData({ ...formData, excerpt: e.target.value })
                    }
                />

                <div className="dialog-actions">
                    <button onClick={onClose} disabled={loading}>
                        Cancel
                    </button>

                    <button onClick={handleSubmit} disabled={loading}>
                        {loading
                            ? selectedArticle
                                ? "Updating..."
                                : "Creating..."
                            : selectedArticle
                                ? "Update"
                                : "Create"}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ArticleDialog;