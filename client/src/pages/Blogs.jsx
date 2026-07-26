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

    useEffect(() => {
        fetchBlogs();
    }, []);

    useEffect(() => {
        setShowAll(false);
    }, [selectedCategory]);

    const fetchBlogs = async () => {
        try {
            setLoading(true);

            const res = await api.get("/blogs");

            const publishedBlogs = (res.data || []).filter(
                (blog) => blog.status === "published"
            );

            setBlogs(publishedBlogs);
        } catch (error) {
            console.log("Blogs fetch error:", error);
        } finally {
            setLoading(false);
        }
    };

    const categoryOptions = [
        {
            value: "all",
            label: "All Categories",
        },
        ...Array.from(
            new Set(
                blogs
                    .map((blog) => blog.category)
                    .filter(Boolean)
            )
        ).map((category) => ({
            value: category,
            label:
                category.charAt(0).toUpperCase() +
                category.slice(1).replace(/-/g, " "),
        })),
    ];

    const plainText = (html = "") => {
        const div = document.createElement("div");
        div.innerHTML = html;

        return div.textContent || div.innerText || "";
    };

    const getExcerpt = (blog) => {
        const text = blog.excerpt
            ? plainText(blog.excerpt)
            : plainText(blog.content);

        return text.trim();
    };

    const filteredBlogs =
        selectedCategory === "all"
            ? blogs
            : blogs.filter(
                (blog) => blog.category === selectedCategory
            );

    const visibleBlogs = showAll
        ? filteredBlogs
        : filteredBlogs.slice(0, BLOGS_PER_PAGE);

    const hasMore =
        !showAll &&
        filteredBlogs.length > BLOGS_PER_PAGE;

    return (
        <main className="blogs-page">
            <SEO
                title="Blogs | Hakeem Ismail - Health & Wellness Articles"
                description="Read our collection of health, wellness, and Unani medicine blogs."
                canonical="/blogs"
            />

            <section className="blogs-hero">
                <div className="container">
                    <h1 className="blogs-hero-title">
                        Our Blogs
                    </h1>

                    <p className="blogs-hero-sub">
                        Explore helpful reads, wellness tips, and natural
                        health insights carefully curated for you.
                    </p>

                    <div className="blogs-hero-line" />
                </div>
            </section>

            <section className="blogs-section">
                <div className="container">
                    <div className="blogs-filter-bar">
                        <div className="blogs-category-wrap">
                            <select
                                className="blogs-category-select"
                                value={selectedCategory}
                                onChange={(event) =>
                                    setSelectedCategory(
                                        event.target.value
                                    )
                                }
                            >
                                {categoryOptions.map((category) => (
                                    <option
                                        key={category.value}
                                        value={category.value}
                                    >
                                        {category.label}
                                    </option>
                                ))}
                            </select>

                            <span className="blogs-category-arrow">
                                &#8964;
                            </span>
                        </div>
                    </div>

                    {loading ? (
                        <div className="blogs-grid">
                            {[...Array(8)].map((_, index) => (
                                <div
                                    key={index}
                                    className="blog-skeleton-card"
                                >
                                    <div className="sk-image" />

                                    <div className="sk-body">
                                        <div className="sk-title" />
                                        <div className="sk-text" />
                                        <div className="sk-text sk-text--short" />
                                        <div className="sk-footer" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : filteredBlogs.length === 0 ? (
                        <div className="blogs-empty">
                            <p>
                                No blogs found in this category.
                            </p>
                        </div>
                    ) : (
                        <>
                            <div className="blogs-grid">
                                {visibleBlogs.map((blog, index) => {
                                    const excerpt = getExcerpt(blog);

                                    return (
                                        <article
                                            key={blog._id}
                                            className={`blog-card fade-up fade-up-delay-${(index % 6) + 1}`}
                                            onClick={() =>
                                                navigate(
                                                    `/blogs/${blog._id}`
                                                )
                                            }
                                        >
                                            <div className="blog-card-image">
                                                <img
                                                    src={blog.image}
                                                    alt={blog.title}
                                                    loading="lazy"
                                                />
                                            </div>

                                            <div className="blog-card-body">
                                                <h3 className="blog-card-title">
                                                    {blog.title}
                                                </h3>

                                                {excerpt && (
                                                    <p className="blog-card-excerpt">
                                                        {excerpt}
                                                    </p>
                                                )}

                                                <div className="blog-card-footer blog-card-footer-left">
                                                    <span className="blog-card-readmore">
                                                        مزید پڑھیں
                                                    </span>
                                                </div>
                                            </div>
                                        </article>
                                    );
                                })}
                            </div>

                            {hasMore && (
                                <div className="blogs-more-wrap">
                                    <button
                                        type="button"
                                        className="blogs-show-more"
                                        onClick={() => setShowAll(true)}
                                    >
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