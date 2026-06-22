import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FiArrowLeft, FiX, FiSave } from "react-icons/fi";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import { toast } from "react-toastify";
import api from "../../api/api";
import "../../css/AdminVideoForm.css";
import "../../css/AdminArticleForm.css";

const slugify = (text = "") =>
    text.toString().toLowerCase().trim()
        .replace(/[^\w\s-]/g, "")
        .replace(/[\s_-]+/g, "-")
        .replace(/^-+|-+$/g, "");

const QUILL_MODULES = {
    toolbar: [
        [{ header: [2, 3, false] }],
        ["bold", "italic", "underline"],
        [{ list: "ordered" }, { list: "bullet" }],
        ["link", "blockquote"],
        ["clean"],
    ],
};

function AdminArticleForm() {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEdit = Boolean(id);

    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(isEdit);
    const [slugTouched, setSlugTouched] = useState(false);
    const [tagInput, setTagInput] = useState("");
    const [errors, setErrors] = useState({});
    const [categories, setCategories] = useState([]);

    const [formData, setFormData] = useState({
        title: "",
        slug: "",
        excerpt: "",
        content: "",
        tags: [],
        category: "",
        metaTitle: "",
        metaDescription: "",
        status: "draft",
    });

    useEffect(() => {
        if (isEdit) fetchArticle();
    }, [id]);

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const res = await api.get('/categories?type=articles');
            setCategories(res.data || []);
        } catch (error) {
            console.log('Failed to fetch categories:', error);
        }
    };

    const fetchArticle = async () => {
        try {
            setFetching(true);
            const res = await api.get(`/articles/${id}`);
            const a = res.data;
            setFormData({
                title: a.title || "",
                slug: a.slug || "",
                excerpt: a.excerpt || "",
                content: a.content || "",
                tags: a.tags || [],
                category: a.category || "",
                metaTitle: a.metaTitle || "",
                metaDescription: a.metaDescription || "",
                status: a.status || "draft",
            });
            setSlugTouched(true);
        } catch (error) {
            toast.error("Failed to load article");
            navigate(-1);
        } finally {
            setFetching(false);
        }
    };

    const handleTitleChange = (value) => {
        setFormData((p) => ({ ...p, title: value, slug: slugTouched ? p.slug : slugify(value) }));
    };

    const handleSlugChange = (value) => {
        setSlugTouched(true);
        setFormData((p) => ({ ...p, slug: slugify(value) }));
    };

    const addTag = (raw) => {
        const value = raw.trim().replace(/,$/, "");
        if (!value) return;
        setFormData((p) => (p.tags.includes(value) ? p : { ...p, tags: [...p.tags, value] }));
        setTagInput("");
    };

    const handleTagKeyDown = (e) => {
        if (e.key === "Enter" || e.key === ",") {
            e.preventDefault();
            addTag(tagInput);
        } else if (e.key === "Backspace" && !tagInput && formData.tags.length) {
            setFormData((p) => ({ ...p, tags: p.tags.slice(0, -1) }));
        }
    };

    const removeTag = (tag) =>
        setFormData((p) => ({ ...p, tags: p.tags.filter((t) => t !== tag) }));

    const stripHtml = (html = "") => html.replace(/<[^>]+>/g, "").trim();

    const validate = () => {
        const errs = {};
        if (!formData.title.trim()) errs.title = "Title is required";
        if (!stripHtml(formData.content)) errs.content = "Content is required";
        if (formData.slug && !/^[a-z0-9-]+$/.test(formData.slug)) {
            errs.slug = "Slug can only contain lowercase letters, numbers and hyphens";
        }
        setErrors(errs);
        return Object.keys(errs).length === 0;
    };

    const handleSubmit = async () => {
        if (!validate()) {
            toast.error("Some fields in the form are invalid");
            return;
        }
        try {
            setLoading(true);
            const payload = { ...formData, tags: formData.tags.join(",") };

            if (isEdit) {
                await api.put(`/articles/${id}`, payload);
                toast.success("Article updated successfully");
            } else {
                await api.post("/articles", payload);
                toast.success("Article published successfully");
            }
            navigate(-1);
        } catch (error) {
            const apiErrors = error?.response?.data?.errors;
            if (apiErrors) setErrors((p) => ({ ...p, ...apiErrors }));
            toast.error(error?.response?.data?.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    if (fetching) {
        return (
            <section className="video-form-page page-fade-up">
                <div className="video-form-loading">Loading...</div>
            </section>
        );
    }

    return (
        <section className="video-form-page page-fade-up">
            <div className="video-form-top">
                <div className="video-form-title-wrap">
                    <button className="video-form-back-btn" onClick={() => navigate(-1)}>
                        <FiArrowLeft />
                    </button>
                    <div>
                        <h1>{isEdit ? "Edit Article" : "Add New Article"}</h1>
                        <p>Fill all the article details below</p>
                    </div>
                </div>

                <div className="video-form-top-actions">
                    <button className="video-form-cancel-btn" onClick={() => navigate(-1)} disabled={loading}>Cancel</button>
                    <button className="video-form-save-btn" onClick={handleSubmit} disabled={loading}>
                        <FiSave />
                        {loading ? "Saving..." : isEdit ? "Update Article" : "Publish Article"}
                    </button>
                </div>
            </div>

            <div className="video-form-grid">
                {/* LEFT */}
                <div className="video-form-col">
                    <div className="video-form-card">
                        <h3 className="video-form-card-title">Organize</h3>

                        <label className="video-form-label">Category</label>
                        <select
                            value={formData.category}
                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        >
                            <option value="">Select Category</option>
                            {categories.map((cat) => (
                                <option key={cat._id} value={cat.name}>
                                    {cat.name}
                                </option>
                            ))}
                        </select>

                        <label className="video-form-label">Tags / Keywords</label>
                        <div className="video-tags-input">
                            {formData.tags.map((tag) => (
                                <span className="video-tag-chip" key={tag}>
                                    {tag}
                                    <button type="button" onClick={() => removeTag(tag)}><FiX /></button>
                                </span>
                            ))}
                            <input
                                type="text"
                                placeholder="Type a tag and press Enter"
                                value={tagInput}
                                onChange={(e) => setTagInput(e.target.value)}
                                onKeyDown={handleTagKeyDown}
                                onBlur={() => addTag(tagInput)}
                            />
                        </div>
                        <span className="field-hint">Tags improve the article's search visibility.</span>
                    </div>

                    <div className="video-form-card">
                        <h3 className="video-form-card-title">Publish Status</h3>
                        <div className="video-status-toggle">
                            <span className={formData.status === "draft" ? "active" : ""}>Draft</span>
                            <button
                                type="button"
                                className={`video-status-switch ${formData.status === "published" ? "on" : ""}`}
                                onClick={() =>
                                    setFormData((p) => ({ ...p, status: p.status === "published" ? "draft" : "published" }))
                                }
                            >
                                <span className="video-status-knob" />
                            </button>
                            <span className={formData.status === "published" ? "active" : ""}>Published</span>
                        </div>
                        <p className="video-status-hint">
                            {formData.status === "draft"
                                ? "This article will stay hidden until it's Published."
                                : "This article will be visible to everyone on the website."}
                        </p>
                    </div>
                </div>

                {/* RIGHT */}
                <div className="video-form-col">
                    <div className="video-form-card">
                        <h3 className="video-form-card-title">Article Details</h3>

                        <label className="video-form-label">Title (Urdu)</label>
                        <input
                            type="text"
                            placeholder="آرٹیکل کا عنوان"
                            value={formData.title}
                            dir="rtl"
                            className={`article-urdu-input ${errors.title ? "input-error" : ""}`}
                            onChange={(e) => handleTitleChange(e.target.value)}
                        />
                        {errors.title && <span className="field-error">{errors.title}</span>}

                        <label className="video-form-label">Slug / URL</label>
                        <div className={`video-slug-wrap ${errors.slug ? "input-error" : ""}`}>
                            <span className="video-slug-prefix">yourwebsite.com/articles/</span>
                            <input
                                type="text"
                                placeholder="article-title"
                                value={formData.slug}
                                onChange={(e) => handleSlugChange(e.target.value)}
                            />
                        </div>
                        {errors.slug && <span className="field-error">{errors.slug}</span>}
                        <span className="field-hint">Urdu title se slug nahi banta — yahan English slug likhein.</span>

                        <label className="video-form-label">Excerpt (short summary)</label>
                        <textarea
                            placeholder="مختصر تعارف جو کارڈ پر نظر آئے گا..."
                            value={formData.excerpt}
                            dir="rtl"
                            rows={3}
                            className="article-urdu-input"
                            onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                        />

                        <label className="video-form-label">Content (Urdu)</label>
                        <div className="video-quill-wrap article-quill">
                            <ReactQuill
                                theme="snow"
                                value={formData.content}
                                onChange={(value) => setFormData({ ...formData, content: value })}
                                placeholder="یہاں مکمل آرٹیکل لکھیں..."
                                modules={QUILL_MODULES}
                            />
                        </div>
                        {errors.content && <span className="field-error">{errors.content}</span>}
                    </div>

                    <div className="video-form-card">
                        <h3 className="video-form-card-title">SEO Settings</h3>

                        <label className="video-form-label video-form-label-row">
                            Meta Title
                            <span className="char-count">{formData.metaTitle.length}/60</span>
                        </label>
                        <input
                            type="text"
                            value={formData.metaTitle}
                            maxLength={60}
                            dir="rtl"
                            onChange={(e) => setFormData({ ...formData, metaTitle: e.target.value })}
                        />

                        <label className="video-form-label video-form-label-row">
                            Meta Description
                            <span className="char-count">{formData.metaDescription.length}/160</span>
                        </label>
                        <textarea
                            value={formData.metaDescription}
                            maxLength={160}
                            dir="rtl"
                            onChange={(e) => setFormData({ ...formData, metaDescription: e.target.value })}
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}

export default AdminArticleForm;