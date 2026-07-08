
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import SEO from "../components/SEO";
import api from "../api/api";
import "../css/BlogDetailPage.css";
import { FiArrowLeft, FiCalendar, FiTag } from "react-icons/fi";

const buildImageGroup = (images = []) => {
    if (!images.length) return "";
    const cls = images.length === 1 ? "bdp-img-group single" : "bdp-img-group double";
    const imgs = images
        .map((src) => `<img src="${src}" alt="" class="bdp-content-img" />`)
        .join("");
    return `<div class="${cls}">${imgs}</div>`;
};

const injectImages = (html = "", midImages = [], endImages = []) => {
    if (!midImages.length && !endImages.length) return html;

    const div = document.createElement("div");
    div.innerHTML = html;
    const children = Array.from(div.children);
    const total = children.length;

    let result = "";

    children.forEach((el, idx) => {
        result += el.outerHTML;
        if (midImages.length && idx === Math.floor(total / 2) - 1) {
            result += buildImageGroup(midImages);
        }
    });

    if (endImages.length) {
        result += buildImageGroup(endImages);
    }

    return result;
};
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
            <button className="bdp-back-btn" onClick={() => navigate(-1)}>
                <FiArrowLeft />
            </button>

            {/* ── HEADER: Category + Title + Date ── */}
            <div className="bdp-header-section">
                <div className="bdp-header-inner">
                    {blog.category && (
                        <span className="bdp-category-pill">
                            <FiTag size={11} />
                            {blog.category.charAt(0).toUpperCase() + blog.category.slice(1)}
                        </span>
                    )}

                    <h1 className="bdp-title">{blog.title}</h1>

                    <div className="bdp-meta-row">
                        <FiCalendar size={14} />
                        <span className="bdp-date">{formatDate(blog.date || blog.createdAt)}</span>
                    </div>
                </div>
            </div>

            {/* ── FEATURED IMAGE ── */}
            <div className="bdp-image-wrap">
                <img src={blog.image} alt={blog.title} className="bdp-featured-img" />
            </div>

            {/* ── ARTICLE BODY ── */}
            <div className="bdp-wrapper">
                <article className="bdp-article">
                    <div
                        className="bdp-body quill-content"
                        dangerouslySetInnerHTML={{
                            __html: injectImages(
                                blog.content,
                                blog.midImages || [],
                                blog.endImages || []
                            ),
                        }}
                    />

                    <div className="bdp-bottom-divider" />

                    <div className="bdp-footer-row">
                        <button className="bdp-back-link" onClick={() => navigate("/blogs")}>
                            <FiArrowLeft size={15} />
                            All Blogs
                        </button>
                        {blog.category && (
                            <span className="bdp-footer-tag">
                                {blog.category.charAt(0).toUpperCase() + blog.category.slice(1)}
                            </span>
                        )}
                    </div>
                </article>
            </div>

            {/* ── RELATED BLOGS ── */}
            {relatedBlogs.length > 0 && (
                <section className="bdp-related">
                    <div className="bdp-related-inner">
                        <div className="bdp-related-header">
                            <p className="bdp-related-eyebrow">Read More</p>
                            <h2 className="bdp-related-title">Related Articles</h2>
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
                                        {rb.category && (
                                            <span className="bdp-related-badge">
                                                {rb.category.charAt(0).toUpperCase() + rb.category.slice(1)}
                                            </span>
                                        )}
                                    </div>
                                    <div className="bdp-related-body">
                                        <h3 className="bdp-related-card-title">{rb.title}</h3>
                                        <span className="bdp-related-readmore">مزید پڑھیں </span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="bdp-all-wrap">
                            <button className="bdp-all-btn" onClick={() => navigate("/blogs")}>
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