import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiArrowLeft, FiPlus, FiEdit2, FiTrash2 } from "react-icons/fi";
import api from "../../api/api";
import DeleteDialog from "../../components/admin/DeleteDialog";
import "../../css/AdminBlogs.css";

function AdminBlogs() {
    const navigate = useNavigate();

    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [deleteDialog, setDeleteDialog] = useState(false);
    const [deleteId, setDeleteId] = useState(null);

    const fetchBlogs = async () => {
        try {
            setLoading(true);
            const res = await api.get("/blogs");
            setBlogs(res.data || []);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBlogs();
    }, []);

    const handleDelete = async () => {
        try {
            await api.delete(`/blogs/${deleteId}`);
            fetchBlogs();
            setDeleteDialog(false);
        } catch (error) {
            console.log(error);
        }
    };

    const formatDate = (date) =>
        new Date(date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });

    return (
        <section className="admin-blogs-page">
            <div className="admin-blogs-top">
                <div className="admin-blogs-title-wrap">
                    <button className="admin-blogs-back-btn" onClick={() => navigate(-1)}>
                        <FiArrowLeft />
                    </button>
                    <h1>Blogs</h1>
                </div>

                <button
                    className="admin-add-blog-btn"
                    onClick={() => navigate("/admin/blogs/new")}
                >
                    <FiPlus />
                    New Blog
                </button>
            </div>

            <div className="admin-blogs-grid">
                {loading ? (
                    [...Array(6)].map((_, i) => (
                        <div className="admin-blog-skeleton" key={i} />
                    ))
                ) : blogs.length === 0 ? (
                    <div className="admin-blogs-empty">
                        No blog uploaded yet!
                    </div>
                ) : (
                    blogs.map((blog, index) => (
                        <div
                            className={`admin-blog-card fade-up fade-up-delay-${(index % 6) + 1}`}
                            key={blog._id}
                        >
                            <div className="admin-blog-image-wrap">
                                <img
                                    src={blog.image}
                                    alt={blog.title}
                                    className="admin-blog-image"
                                />

                                <span
                                    className={`admin-blog-status ${blog.status === "published" ? "published" : "draft"
                                        }`}
                                >
                                    {blog.status === "published" ? "Published" : "Draft"}
                                </span>

                                {blog.category && (
                                    <span className="admin-blog-category-badge">
                                        {blog.category}
                                    </span>
                                )}
                            </div>

                            <div className="admin-blog-content">
                                <h3 className="admin-blog-title">{blog.title}</h3>

                                {blog.excerpt && (
                                    <p className="admin-blog-excerpt">{blog.excerpt}</p>
                                )}

                                {blog.tags?.length > 0 && (
                                    <div className="admin-blog-hashtags">
                                        {blog.tags.slice(0, 3).map((tag) => (
                                            <span className="admin-blog-hashtag" key={tag}>
                                                #{tag}
                                            </span>
                                        ))}
                                    </div>
                                )}

                                <div className="admin-blog-meta">
                                    <span>{formatDate(blog.createdAt || blog.date)}</span>
                                </div>

                                <div className="admin-blog-actions">
                                    <button
                                        className="admin-blog-edit-btn"
                                        onClick={() =>
                                            navigate(`/admin/blogs/edit/${blog._id}`)
                                        }
                                    >
                                        <FiEdit2 />
                                    </button>

                                    <button
                                        className="admin-blog-delete-btn"
                                        onClick={() => {
                                            setDeleteId(blog._id);
                                            setDeleteDialog(true);
                                        }}
                                    >
                                        <FiTrash2 />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            <DeleteDialog
                open={deleteDialog}
                onClose={() => setDeleteDialog(false)}
                onConfirm={handleDelete}
            />
        </section>
    );
}

export default AdminBlogs;
