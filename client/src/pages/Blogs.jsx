// Blogs.jsx - complete file
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SEO from "../components/SEO";
import api from "../api/api";
import "../css/Blogs.css";

const BLOGS_PER_PAGE = 12;

function Blogs() {
    const navigate = useNavigate();
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [showAll, setShowAll] = useState(false);

    useEffect(() => { fetchBlogs(); }, []);
    useEffect(() => { setShowAll(false); }, [selectedCategory]);

    const fetchBlogs = async () => {
        try {
            setLoading(true);
            const res = await api.get("/blogs");
            const published = res.data.filter((b) => b.status === "published");
            setBlogs(published);
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    };

    // Build dynamic categories from actual blog data
    const categoryOptions = [
        { value: "all", label: "All Categories" },
        ...Array.from(new Set(blogs.map((b) => b.category).filter(Boolean))).map((cat) => ({
            value: cat,
            label: cat.charAt(0).toUpperCase() + cat.slice(1).replace(/-/g, " "),
        })),
    ];

    const plainText = (html = "") => {
        const div = document.createElement("div");
        div.innerHTML = html;
        return div.textContent || div.innerText || "";
    };

    const filtered =
        selectedCategory === "all"
            ? blogs
            : blogs.filter((b) => b.category === selectedCategory);

    const visible = showAll ? filtered : filtered.slice(0, BLOGS_PER_PAGE);
    const hasMore = !showAll && filtered.length > BLOGS_PER_PAGE;

    return (
        <main className="blogs-page">
            <SEO
                title="Blogs | Hakeem Ismail - Health & Wellness Articles"
                description="Read our collection of health, wellness, and Unani medicine blogs."
                canonical="/blogs"
            />

            {/* HERO */}
            <section className="blogs-hero">
                <div className="container">
                    <h1 className="blogs-hero-title">Our Blogs</h1>
                    <p className="blogs-hero-sub">
                        Explore helpful reads, wellness tips, and natural health insights
                        carefully curated for you.
                    </p>
                    <div className="blogs-hero-line" />
                </div>
            </section>

            {/* CONTENT */}
            <section className="blogs-section">
                <div className="container">

                    {/* Category dropdown — left aligned */}
                    <div className="blogs-filter-bar">
                        <div className="blogs-category-wrap">
                            <select
                                className="blogs-category-select"
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                            >
                                {categoryOptions.map((cat) => (
                                    <option key={cat.value} value={cat.value}>
                                        {cat.label}
                                    </option>
                                ))}
                            </select>
                            <span className="blogs-category-arrow">&#8964;</span>
                        </div>
                    </div>

                    {/* Skeleton */}
                    {loading ? (
                        <div className="blogs-grid">
                            {[...Array(8)].map((_, i) => (
                                <div key={i} className="blog-skeleton-card">
                                    <div className="sk-image" />
                                    <div className="sk-title" />
                                    <div className="sk-text" />
                                    <div className="sk-text sk-text--short" />
                                </div>
                            ))}
                        </div>
                    ) : filtered.length === 0 ? (
                        <div className="blogs-empty">
                            <p>No blogs found in this category.</p>
                        </div>
                    ) : (
                        <>
                            <div className="blogs-grid">
                                {visible.map((blog) => (
                                    <div
                                        key={blog._id}
                                        className="blog-card"
                                        onClick={() => navigate(`/blogs/${blog._id}`)}
                                    >
                                        <div className="blog-card-image">
                                            <img src={blog.image} alt={blog.title} loading="lazy" />
                                        </div>
                                        <div className="blog-card-body">
                                            <h3 className="blog-card-title">{blog.title}</h3>
                                            <p className="blog-card-excerpt">
                                                {blog.excerpt
                                                    ? blog.excerpt.slice(0, 110)
                                                    : plainText(blog.content).slice(0, 110)}
                                                ...
                                            </p>
                                            <span className="blog-card-readmore">مزید پڑھیں</span>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {hasMore && (
                                <div className="blogs-more-wrap">
                                    <button className="blogs-show-more" onClick={() => setShowAll(true)}>
                                        Show More
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </section>
        </main>
    );
}

export default Blogs;