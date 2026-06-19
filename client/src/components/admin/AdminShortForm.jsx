import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FiArrowLeft, FiCamera, FiX, FiSave } from "react-icons/fi";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import { toast } from "react-toastify";
import api from "../../api/api";
import "../../css/AdminVideoForm.css";

const CATEGORY_OPTIONS = [
    "Tib-e-Yunani",
    "General Health",
    "Diet & Nutrition",
    "Fitness & Exercise",
    "Mental Health",
    "Women's Health",
    "Kids Health",
];

const YOUTUBE_REGEX =
    /^(https?:\/\/)?(www\.)?(youtube\.com\/(watch\?v=|embed\/|shorts\/)|youtu\.be\/)[\w-]+/i;
const FACEBOOK_REGEX = /^(https?:\/\/)?(www\.)?(facebook\.com|fb\.watch)\/.+/i;

const slugify = (text = "") =>
    text
        .toString()
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, "")
        .replace(/[\s_-]+/g, "-")
        .replace(/^-+|-+$/g, "");

const QUILL_MODULES = {
    toolbar: [
        ["bold", "italic", "underline"],
        [{ list: "ordered" }, { list: "bullet" }],
        ["link"],
        ["clean"],
    ],
};

function AdminShortForm() {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEdit = Boolean(id);

    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(isEdit);
    const [preview, setPreview] = useState("");
    const [slugTouched, setSlugTouched] = useState(false);
    const [tagInput, setTagInput] = useState("");
    const [errors, setErrors] = useState({});

    const [formData, setFormData] = useState({
        title: "",
        slug: "",
        description: "",
        tags: [],
        category: "",
        duration: "",
        thumbnail: "",
        youtubeUrl: "",
        facebookUrl: "",
        metaTitle: "",
        metaDescription: "",
        status: "draft",
    });

    useEffect(() => {
        if (isEdit) fetchShort();
    }, [id]);

    const fetchShort = async () => {
        try {
            setFetching(true);
            const res = await api.get(`/shorts/${id}`);
            const s = res.data;

            setFormData({
                title: s.title || "",
                slug: s.slug || "",
                description: s.description || "",
                tags: s.tags || [],
                category: s.category || "",
                duration: s.duration || "",
                thumbnail: "",
                youtubeUrl: s.youtubeUrl || "",
                facebookUrl: s.facebookUrl || "",
                metaTitle: s.metaTitle || "",
                metaDescription: s.metaDescription || "",
                status: s.status || "draft",
            });

            setPreview(s.thumbnail || "");
            setSlugTouched(true);
        } catch (error) {
            toast.error("Failed to load short");
            navigate(-1);
        } finally {
            setFetching(false);
        }
    };

    const handleThumbnail = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.readAsDataURL(file);

        reader.onloadend = () => {
            setFormData((prev) => ({ ...prev, thumbnail: reader.result }));
            setPreview(reader.result);
        };
    };

    const handleTitleChange = (value) => {
        setFormData((prev) => ({
            ...prev,
            title: value,
            slug: slugTouched ? prev.slug : slugify(value),
        }));
    };

    const handleSlugChange = (value) => {
        setSlugTouched(true);
        setFormData((prev) => ({ ...prev, slug: slugify(value) }));
    };

    const addTag = (raw) => {
        const value = raw.trim().replace(/,$/, "");
        if (!value) return;

        setFormData((prev) => {
            if (prev.tags.includes(value)) return prev;
            return { ...prev, tags: [...prev.tags, value] };
        });

        setTagInput("");
    };

    const handleTagKeyDown = (e) => {
        if (e.key === "Enter" || e.key === ",") {
            e.preventDefault();
            addTag(tagInput);
        } else if (e.key === "Backspace" && !tagInput && formData.tags.length) {
            setFormData((prev) => ({
                ...prev,
                tags: prev.tags.slice(0, -1),
            }));
        }
    };

    const removeTag = (tag) => {
        setFormData((prev) => ({
            ...prev,
            tags: prev.tags.filter((t) => t !== tag),
        }));
    };

    const validate = () => {
        const errs = {};

        if (!formData.title.trim()) {
            errs.title = "Title is required";
        }

        if (!formData.youtubeUrl && !formData.facebookUrl) {
            errs.youtubeUrl = "YouTube or Facebook URL is required";
        }

        if (formData.youtubeUrl && !YOUTUBE_REGEX.test(formData.youtubeUrl)) {
            errs.youtubeUrl = "Enter a valid YouTube URL";
        }

        if (formData.facebookUrl && !FACEBOOK_REGEX.test(formData.facebookUrl)) {
            errs.facebookUrl = "Enter a valid Facebook URL";
        }

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
            if (!payload.thumbnail) delete payload.thumbnail;

            if (isEdit) {
                await api.put(`/shorts/${id}`, payload);
                toast.success("Short updated successfully");
            } else {
                await api.post("/shorts", payload);
                toast.success("Short uploaded successfully");
            }

            navigate(-1);
        } catch (error) {
            const apiErrors = error?.response?.data?.errors;
            if (apiErrors) setErrors((prev) => ({ ...prev, ...apiErrors }));
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
                        <h1>{isEdit ? "Edit Short" : "Add New Short"}</h1>
                        <p>Fill all the short details below</p>
                    </div>
                </div>

                <div className="video-form-top-actions">
                    <button
                        className="video-form-cancel-btn"
                        onClick={() => navigate(-1)}
                        disabled={loading}
                    >
                        Cancel
                    </button>
                    <button className="video-form-save-btn" onClick={handleSubmit} disabled={loading}>
                        <FiSave />
                        {loading ? "Saving..." : isEdit ? "Update Short" : "Publish Short"}
                    </button>
                </div>
            </div>

            <div className="video-form-grid">
                {/* LEFT COLUMN */}
                <div className="video-form-col">
                    <div className="video-form-card">
                        <h3 className="video-form-card-title">Thumbnail</h3>

                        <div className="video-thumb-upload">
                            {preview ? (
                                <img src={preview} alt="" className="video-thumb-preview" />
                            ) : (
                                <div className="video-thumb-placeholder">
                                    <FiCamera />
                                    <span>Upload Thumbnail</span>
                                </div>
                            )}

                            <input type="file" accept="image/*" onChange={handleThumbnail} />
                        </div>
                    </div>

                    <div className="video-form-card">
                        <h3 className="video-form-card-title">Short Links</h3>

                        <label className="video-form-label">YouTube URL</label>
                        <input
                            type="text"
                            placeholder="https://www.youtube.com/shorts/..."
                            value={formData.youtubeUrl}
                            onChange={(e) => setFormData({ ...formData, youtubeUrl: e.target.value })}
                            className={errors.youtubeUrl ? "input-error" : ""}
                        />
                        {errors.youtubeUrl && <span className="field-error">{errors.youtubeUrl}</span>}

                        <label className="video-form-label">Facebook URL</label>
                        <input
                            type="text"
                            placeholder="https://www.facebook.com/..."
                            value={formData.facebookUrl}
                            onChange={(e) => setFormData({ ...formData, facebookUrl: e.target.value })}
                            className={errors.facebookUrl ? "input-error" : ""}
                        />
                        {errors.facebookUrl && <span className="field-error">{errors.facebookUrl}</span>}

                        <label className="video-form-label">Duration</label>
                        <input
                            type="text"
                            placeholder="e.g 0:45"
                            value={formData.duration}
                            onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                        />
                    </div>

                    <div className="video-form-card">
                        <h3 className="video-form-card-title">Publish Status</h3>

                        <div className="video-status-toggle">
                            <span className={formData.status === "draft" ? "active" : ""}>Draft</span>

                            <button
                                type="button"
                                className={`video-status-switch ${formData.status === "published" ? "on" : ""
                                    }`}
                                onClick={() =>
                                    setFormData((prev) => ({
                                        ...prev,
                                        status: prev.status === "published" ? "draft" : "published",
                                    }))
                                }
                            >
                                <span className="video-status-knob" />
                            </button>

                            <span className={formData.status === "published" ? "active" : ""}>
                                Published
                            </span>
                        </div>

                        <p className="video-status-hint">
                            {formData.status === "draft"
                                ? "This short will stay hidden on the website until it's Published."
                                : "This short will be visible to everyone on the website."}
                        </p>
                    </div>
                </div>

                {/* RIGHT COLUMN */}
                <div className="video-form-col">
                    <div className="video-form-card">
                        <h3 className="video-form-card-title">Short Details</h3>

                        <label className="video-form-label">Title</label>
                        <input
                            type="text"
                            placeholder="Short Title"
                            value={formData.title}
                            onChange={(e) => handleTitleChange(e.target.value)}
                            className={errors.title ? "input-error" : ""}
                        />
                        {errors.title && <span className="field-error">{errors.title}</span>}

                        <label className="video-form-label">Slug / URL</label>
                        <div className={`video-slug-wrap ${errors.slug ? "input-error" : ""}`}>
                            <span className="video-slug-prefix">yourwebsite.com/short/</span>
                            <input
                                type="text"
                                placeholder="short-title"
                                value={formData.slug}
                                onChange={(e) => handleSlugChange(e.target.value)}
                            />
                        </div>
                        {errors.slug && <span className="field-error">{errors.slug}</span>}

                        <label className="video-form-label">Category</label>
                        <select
                            value={formData.category}
                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        >
                            <option value="">Select Category</option>
                            {CATEGORY_OPTIONS.map((cat) => (
                                <option key={cat} value={cat}>
                                    {cat}
                                </option>
                            ))}
                        </select>

                        <label className="video-form-label">Tags / Keywords</label>
                        <div className="video-tags-input">
                            {formData.tags.map((tag) => (
                                <span className="video-tag-chip" key={tag}>
                                    {tag}
                                    <button type="button" onClick={() => removeTag(tag)}>
                                        <FiX />
                                    </button>
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
                        <span className="field-hint">
                            Tags improve the short's search visibility.
                        </span>

                        <label className="video-form-label">Description</label>
                        <div className="video-quill-wrap">
                            <ReactQuill
                                theme="snow"
                                value={formData.description}
                                onChange={(value) => setFormData({ ...formData, description: value })}
                                placeholder="Write the short description..."
                                modules={QUILL_MODULES}
                            />
                        </div>
                    </div>

                    <div className="video-form-card">
                        <h3 className="video-form-card-title">SEO Settings</h3>

                        <label className="video-form-label video-form-label-row">
                            Meta Title
                            <span className="char-count">{formData.metaTitle.length}/60</span>
                        </label>
                        <input
                            type="text"
                            placeholder="Title for search engines"
                            value={formData.metaTitle}
                            maxLength={60}
                            onChange={(e) => setFormData({ ...formData, metaTitle: e.target.value })}
                        />

                        <label className="video-form-label video-form-label-row">
                            Meta Description
                            <span className="char-count">{formData.metaDescription.length}/160</span>
                        </label>
                        <textarea
                            placeholder="Description for search engines"
                            value={formData.metaDescription}
                            maxLength={160}
                            onChange={(e) =>
                                setFormData({ ...formData, metaDescription: e.target.value })
                            }
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}

export default AdminShortForm;