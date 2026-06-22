// BlogDetailPage.jsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import SEO from "../components/SEO";
import api from "../api/api";
import "../css/BlogDetailPage.css";
import { FiArrowLeft } from "react-icons/fi";

function BlogDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [blog, setBlog] = useState(null);
    const [relatedBlogs, setRelatedBlogs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        window.scrollTo(0, 0);
        fetchBlog();
    }, [id]);

    const fetchBlog = async () => {
        try {
            setLoading(true);
            const res = await api.get(`/blogs/${id}`);
            setBlog(res.data);

            const allRes = await api.get("/blogs");
            const published = allRes.data.filter(
                (b) => b.status === "published" && b._id !== id
            );
            // Same category first, then others
            const sameCategory = published.filter((b) => b.category === res.data.category);
            const others = published.filter((b) => b.category !== res.data.category);
            setRelatedBlogs([...sameCategory, ...others].slice(0, 3));
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

    if (loading) {
        return (
            <div className="bdp-loading">
                <div className="bdp-spinner" />
            </div>
        );
    }

    if (!blog) {
        return (
            <div className="bdp-not-found">
                <p>Blog not found.</p>
                <button onClick={() => navigate("/blogs")}>Back to Blogs</button>
            </div>
        );
    }

    return (
        <main className="bdp-page">
            <SEO
                title={blog.metaTitle || blog.title}
                description={blog.metaDescription || blog.excerpt}
                canonical={`/blogs/${blog._id}`}
            />

            {/* Fixed back button */}
            <button className="info-back-btn" onClick={() => navigate(-1)}>
                <FiArrowLeft />
            </button>

            {/* ── HERO IMAGE ── */}
            <div className="bdp-hero">
                <img src={blog.image} alt={blog.title} className="bdp-hero-img" />
                <div className="bdp-hero-overlay" />

                {/* Category pill on image */}
                {blog.category && (
                    <span className="bdp-category-pill">
                        {blog.category.charAt(0).toUpperCase() + blog.category.slice(1)}
                    </span>
                )}
            </div>

            {/* ── ARTICLE ── */}
            <div className="bdp-wrapper">
                <article className="bdp-article">

                    {/* Meta row */}
                    <div className="bdp-meta">
                        <span className="bdp-date">{formatDate(blog.date || blog.createdAt)}</span>

                    </div>

                    {/* Title — Urdu font */}
                    <h1 className="bdp-title">{blog.title}</h1>

                    {/* Divider */}
                    <div className="bdp-divider" />

                    {/* Body content */}
                    <div
                        className="bdp-body quill-content"
                        dangerouslySetInnerHTML={{ __html: blog.content }}
                    />
                </article>
            </div>

            {/* ── RELATED BLOGS ── */}
            {relatedBlogs.length > 0 && (
                <section className="bdp-related">
                    <div className="bdp-related-inner">
                        <div className="bdp-related-header">
                            <h2 className="bdp-related-title">Related Blogs</h2>
                            <p className="bdp-related-sub">More articles you might enjoy</p>
                        </div>

                        <div className="bdp-related-grid">
                            {relatedBlogs.map((rb) => (
                                <div
                                    key={rb._id}
                                    className="bdp-related-card"
                                    onClick={() => navigate(`/blogs/${rb._id}`)}
                                >
                                    <div className="bdp-related-img-wrap">
                                        <img src={rb.image} alt={rb.title} loading="lazy" />
                                    </div>
                                    <div className="bdp-related-body">
                                        <p className="bdp-related-cat">
                                            {rb.category
                                                ? rb.category.charAt(0).toUpperCase() + rb.category.slice(1)
                                                : "Blog"}
                                        </p>
                                        <h3 className="bdp-related-card-title">{rb.title}</h3>
                                        <span className="bdp-related-readmore">مزید پڑھیں →</span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="bdp-all-wrap">
                            <button
                                className="bdp-all-btn"
                                onClick={() => navigate("/blogs")}
                            >
                                View All Blogs
                            </button>
                        </div>
                    </div>
                </section>
            )}
        </main>
    );
}

export default BlogDetailPage;