import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FiArrowLeft, FiCamera, FiX, FiSave } from "react-icons/fi";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import { toast } from "react-toastify";
import api from "../../api/api";
import "../../css/AdminBlogForm.css";

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

function AdminBlogForm() {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEdit = Boolean(id);

    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(isEdit);
    const [preview, setPreview] = useState("");
    const [slugTouched, setSlugTouched] = useState(false);
    const [tagInput, setTagInput] = useState("");
    const [errors, setErrors] = useState({});
    const [categories, setCategories] = useState([]);

    const [formData, setFormData] = useState({
        title: "",
        slug: "",
        image: "",
        excerpt: "",
        content: "",
        tags: [],
        category: "health",
        metaTitle: "",
        metaDescription: "",
        status: "draft",
    });

    useEffect(() => {
        if (isEdit) fetchBlog();
    }, [id]);

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const res = await api.get('/categories?type=blogs');
            setCategories(res.data || []);
        } catch (error) {
            console.log('Failed to fetch categories:', error);
        }
    };

    const fetchBlog = async () => {
        try {
            setFetching(true);
            const res = await api.get(`/blogs/${id}`);
            const b = res.data;
            setFormData({
                title: b.title || "",
                slug: b.slug || "",
                image: "",          // don't prefill base64; preview handles display
                excerpt: b.excerpt || "",
                content: b.content || "",
                tags: b.tags || [],
                category: b.category || "health",
                metaTitle: b.metaTitle || "",
                metaDescription: b.metaDescription || "",
                status: b.status || "draft",
            });
            setPreview(b.image || "");
            setSlugTouched(true);
        } catch (error) {
            toast.error("Failed to load blog");
            navigate(-1);
        } finally {
            setFetching(false);
        }
    };

    // Image → base64 stored in formData.image; backend uploads to Cloudinary
    const handleImage = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () => {
            setFormData((prev) => ({ ...prev, image: reader.result }));
            setPreview(reader.result);
        };
    };

    const handleTitleChange = (value) => {
        setFormData((p) => ({
            ...p,
            title: value,
            slug: slugTouched ? p.slug : slugify(value),
        }));
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
        if (!isEdit && !formData.image) errs.image = "Image is required";
        if (formData.slug && !/^[a-z0-9-]+$/.test(formData.slug))
            errs.slug = "Slug can only contain lowercase letters, numbers and hyphens";
        setErrors(errs);
        return Object.keys(errs).length === 0;
    };

    const handleSubmit = async () => {
        if (!validate()) {
            toast.error("Please fill all required fields");
            return;
        }
        try {
            setLoading(true);

            // Send base64 image directly — backend handles Cloudinary upload
            const payload = {
                ...formData,
                tags: formData.tags.join(","),
            };

            // On edit: if no new image selected, remove image key so backend keeps existing
            if (isEdit && !formData.image) {
                delete payload.image;
            }

            if (isEdit) {
                await api.put(`/blogs/${id}`, payload);
                toast.success("Blog updated successfully!");
            } else {
                await api.post("/blogs", payload);
                toast.success("Blog created successfully!");
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
            <section className="bf-page">
                <div className="bf-loading">Loading...</div>
            </section>
        );
    }

    return (
        <section className="bf-page">

            {/* TOP BAR */}
            <div className="bf-top">
                <div className="bf-title-wrap">
                    <button className="bf-back-btn" onClick={() => navigate(-1)}>
                        <FiArrowLeft />
                    </button>
                    <div>
                        <h1 className="bf-heading">{isEdit ? "Edit Blog" : "Add New Blog"}</h1>
                        <p className="bf-subheading">Fill in all the blog details below</p>
                    </div>
                </div>

                <div className="bf-top-actions">
                    <button className="bf-cancel-btn" onClick={() => navigate(-1)} disabled={loading}>
                        Cancel
                    </button>
                    <button className="bf-save-btn" onClick={handleSubmit} disabled={loading}>
                        <FiSave />
                        {loading ? "Saving..." : isEdit ? "Update Blog" : "Publish Blog"}
                    </button>
                </div>
            </div>

            {/* GRID */}
            <div className="bf-grid">

                {/* LEFT */}
                <div className="bf-col">

                    {/* Image */}
                    <div className="bf-card">
                        <h3 className="bf-card-title">Blog Image</h3>
                        <div className={`bf-thumb ${errors.image ? "bf-thumb--error" : ""}`}>
                            {preview ? (
                                <img src={preview} alt="" className="bf-thumb-img" />
                            ) : (
                                <div className="bf-thumb-placeholder">
                                    <FiCamera />
                                    <span>تصویر منتخب کریں</span>
                                </div>
                            )}
                            <input type="file" accept="image/*" onChange={handleImage} />
                        </div>
                        {errors.image && <span className="bf-field-error">{errors.image}</span>}
                    </div>

                    {/* Organize */}
                    <div className="bf-card">
                        <h3 className="bf-card-title">Organize</h3>

                        <label className="bf-label">Category</label>
                        <select
                            className="bf-select"
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

                        <label className="bf-label">Tags / Keywords</label>
                        <div className="bf-tags-wrap">
                            {formData.tags.map((tag) => (
                                <span className="bf-tag-chip" key={tag}>
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
                        <span className="bf-hint">Tags improve the blog's search visibility.</span>
                    </div>

                    {/* Status */}
                    <div className="bf-card">
                        <h3 className="bf-card-title">Publish Status</h3>

                        <div className="bf-toggle">
                            <span className={formData.status === "draft" ? "active" : ""}>Draft</span>
                            <button
                                type="button"
                                className={`bf-switch ${formData.status === "published" ? "on" : ""}`}
                                onClick={() =>
                                    setFormData((p) => ({
                                        ...p,
                                        status: p.status === "published" ? "draft" : "published",
                                    }))
                                }
                            >
                                <span className="bf-knob" />
                            </button>
                            <span className={formData.status === "published" ? "active" : ""}>Published</span>
                        </div>

                        <p className="bf-status-hint">
                            {formData.status === "draft"
                                ? "This blog will stay hidden until you publish it."
                                : "This blog is visible to everyone on the website."}
                        </p>
                    </div>
                </div>

                {/* RIGHT */}
                <div className="bf-col">

                    {/* Details */}
                    <div className="bf-card">
                        <h3 className="bf-card-title">Blog Details</h3>

                        <label className="bf-label">عنوان — Title *</label>
                        <input
                            type="text"
                            placeholder="بلاگ کا عنوان یہاں لکھیں"
                            value={formData.title}
                            dir="rtl"
                            className={`bf-urdu-input ${errors.title ? "bf-input--error" : ""}`}
                            onChange={(e) => handleTitleChange(e.target.value)}
                        />
                        {errors.title && <span className="bf-field-error">{errors.title}</span>}

                        <label className="bf-label">Slug / URL</label>
                        <div className={`bf-slug-wrap ${errors.slug ? "bf-input--error" : ""}`}>
                            <span className="bf-slug-prefix">yoursite.com/blog/</span>
                            <input
                                type="text"
                                placeholder="blog-url-here"
                                value={formData.slug}
                                onChange={(e) => handleSlugChange(e.target.value)}
                            />
                        </div>
                        {errors.slug && <span className="bf-field-error">{errors.slug}</span>}
                        <span className="bf-hint">Slug is auto-generated from the title. You can edit it manually.</span>

                        <label className="bf-label">مختصر تعارف — Excerpt</label>
                        <textarea
                            placeholder="بلاگ کا مختصر تعارف جو کارڈ پر نظر آئے گا..."
                            value={formData.excerpt}
                            dir="rtl"
                            rows={3}
                            className="bf-urdu-input bf-textarea"
                            onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                        />
                        <span className="bf-hint">Short summary shown on blog listing cards.</span>

                        <label className="bf-label">مضمون — Content *</label>
                        <div className={`bf-quill-wrap ${errors.content ? "bf-input--error" : ""}`}>
                            <ReactQuill
                                theme="snow"
                                value={formData.content}
                                onChange={(value) => setFormData({ ...formData, content: value })}
                                placeholder="یہاں بلاگ کا مکمل مضمون لکھیں..."
                                modules={QUILL_MODULES}
                            />
                        </div>
                        {errors.content && <span className="bf-field-error">{errors.content}</span>}
                    </div>

                    {/* SEO */}
                    <div className="bf-card">
                        <h3 className="bf-card-title">SEO Settings</h3>

                        <label className="bf-label bf-label--row">
                            Meta Title
                            <span className="bf-char-count">{formData.metaTitle.length}/60</span>
                        </label>
                        <input
                            type="text"
                            placeholder="Title shown in search engine results"
                            value={formData.metaTitle}
                            maxLength={60}
                            className="bf-input"
                            onChange={(e) => setFormData({ ...formData, metaTitle: e.target.value })}
                        />
                        <span className="bf-hint">Keep it under 60 characters for best results.</span>

                        <label className="bf-label bf-label--row">
                            Meta Description
                            <span className="bf-char-count">{formData.metaDescription.length}/160</span>
                        </label>
                        <textarea
                            placeholder="Description shown below the title in search results"
                            value={formData.metaDescription}
                            maxLength={160}
                            className="bf-input bf-textarea"
                            onChange={(e) => setFormData({ ...formData, metaDescription: e.target.value })}
                        />
                        <span className="bf-hint">Keep it under 160 characters for best results.</span>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default AdminBlogForm;