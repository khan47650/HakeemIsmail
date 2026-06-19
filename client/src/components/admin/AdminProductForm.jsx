import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FiArrowLeft, FiCamera, FiX, FiSave } from "react-icons/fi";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import { toast } from "react-toastify";
import api from "../../api/api";
import "../../css/AdminVideoForm.css";

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

function AdminProductForm() {
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
        name: "",
        slug: "",
        price: "",
        description: "",
        tags: [],
        category: "nonpopular",
        image: "",
        metaTitle: "",
        metaDescription: "",
        status: "draft",
    });

    useEffect(() => {
        if (isEdit) fetchProduct();
    }, [id]);

    const fetchProduct = async () => {
        try {
            setFetching(true);
            const res = await api.get(`/products/${id}`);
            const p = res.data;

            setFormData({
                name: p.name || "",
                slug: p.slug || "",
                price: p.price ?? "",
                description: p.description || "",
                tags: p.tags || [],
                category: p.category || "nonpopular",
                image: "",
                metaTitle: p.metaTitle || "",
                metaDescription: p.metaDescription || "",
                status: p.status || "draft",
            });

            setPreview(p.image || "");
            setSlugTouched(true);
        } catch (error) {
            toast.error("Failed to load product");
            navigate(-1);
        } finally {
            setFetching(false);
        }
    };

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

    const handleNameChange = (value) => {
        setFormData((prev) => ({
            ...prev,
            name: value,
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
            setFormData((prev) => ({ ...prev, tags: prev.tags.slice(0, -1) }));
        }
    };

    const removeTag = (tag) => {
        setFormData((prev) => ({ ...prev, tags: prev.tags.filter((t) => t !== tag) }));
    };

    const stripHtml = (html = "") => html.replace(/<[^>]+>/g, "").trim();

    const validate = () => {
        const errs = {};

        if (!formData.name.trim()) errs.name = "Name is required";

        if (formData.price === "" || isNaN(Number(formData.price))) {
            errs.price = "Valid price is required";
        } else if (Number(formData.price) < 0) {
            errs.price = "Price cannot be negative";
        }

        if (!stripHtml(formData.description)) errs.description = "Description is required";

        if (!isEdit && !formData.image) errs.image = "Product image is required";

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

            const payload = {
                ...formData,
                price: Number(formData.price),
                tags: formData.tags.join(","),
            };
            if (!payload.image) delete payload.image;

            if (isEdit) {
                await api.put(`/products/${id}`, payload);
                toast.success("Product updated successfully");
            } else {
                await api.post("/products", payload);
                toast.success("Product created successfully");
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
                        <h1>{isEdit ? "Edit Product" : "Add New Product"}</h1>
                        <p>Fill all the product details below</p>
                    </div>
                </div>

                <div className="video-form-top-actions">
                    <button className="video-form-cancel-btn" onClick={() => navigate(-1)} disabled={loading}>
                        Cancel
                    </button>
                    <button className="video-form-save-btn" onClick={handleSubmit} disabled={loading}>
                        <FiSave />
                        {loading ? "Saving..." : isEdit ? "Update Product" : "Publish Product"}
                    </button>
                </div>
            </div>

            <div className="video-form-grid">
                {/* LEFT COLUMN */}
                <div className="video-form-col">
                    <div className="video-form-card">
                        <h3 className="video-form-card-title">Product Image</h3>

                        <div className="video-thumb-upload">
                            {preview ? (
                                <img src={preview} alt="" className="video-thumb-preview" />
                            ) : (
                                <div className="video-thumb-placeholder">
                                    <FiCamera />
                                    <span>Upload Image</span>
                                </div>
                            )}
                            <input type="file" accept="image/*" onChange={handleImage} />
                        </div>
                        {errors.image && <span className="field-error">{errors.image}</span>}
                    </div>

                    <div className="video-form-card">
                        <h3 className="video-form-card-title">Pricing & Visibility</h3>

                        <label className="video-form-label">Price (Rs.)</label>
                        <input
                            type="number"
                            placeholder="e.g 1500"
                            value={formData.price}
                            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                            className={errors.price ? "input-error" : ""}
                        />
                        {errors.price && <span className="field-error">{errors.price}</span>}

                        <label className="video-form-label">Mark as Popular</label>
                        <div className="video-status-toggle">
                            <span className={formData.category === "nonpopular" ? "active" : ""}>Regular</span>

                            <button
                                type="button"
                                className={`video-status-switch ${formData.category === "popular" ? "on" : ""}`}
                                onClick={() =>
                                    setFormData((prev) => ({
                                        ...prev,
                                        category: prev.category === "popular" ? "nonpopular" : "popular",
                                    }))
                                }
                            >
                                <span className="video-status-knob" />
                            </button>

                            <span className={formData.category === "popular" ? "active" : ""}>Popular</span>
                        </div>
                    </div>

                    <div className="video-form-card">
                        <h3 className="video-form-card-title">Publish Status</h3>

                        <div className="video-status-toggle">
                            <span className={formData.status === "draft" ? "active" : ""}>Draft</span>

                            <button
                                type="button"
                                className={`video-status-switch ${formData.status === "published" ? "on" : ""}`}
                                onClick={() =>
                                    setFormData((prev) => ({
                                        ...prev,
                                        status: prev.status === "published" ? "draft" : "published",
                                    }))
                                }
                            >
                                <span className="video-status-knob" />
                            </button>

                            <span className={formData.status === "published" ? "active" : ""}>Published</span>
                        </div>

                        <p className="video-status-hint">
                            {formData.status === "draft"
                                ? "This product will stay hidden on the website until it's Published."
                                : "This product will be visible to everyone on the website."}
                        </p>
                    </div>
                </div>

                {/* RIGHT COLUMN */}
                <div className="video-form-col">
                    <div className="video-form-card">
                        <h3 className="video-form-card-title">Product Details</h3>

                        <label className="video-form-label">Name</label>
                        <input
                            type="text"
                            placeholder="Product Name"
                            value={formData.name}
                            onChange={(e) => handleNameChange(e.target.value)}
                            className={errors.name ? "input-error" : ""}
                        />
                        {errors.name && <span className="field-error">{errors.name}</span>}

                        <label className="video-form-label">Slug / URL</label>
                        <div className={`video-slug-wrap ${errors.slug ? "input-error" : ""}`}>
                            <span className="video-slug-prefix">yourwebsite.com/product/</span>
                            <input
                                type="text"
                                placeholder="product-name"
                                value={formData.slug}
                                onChange={(e) => handleSlugChange(e.target.value)}
                            />
                        </div>
                        {errors.slug && <span className="field-error">{errors.slug}</span>}

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
                        <span className="field-hint">Tags improve the product's search visibility.</span>

                        <label className="video-form-label">Description</label>
                        <div className="video-quill-wrap">
                            <ReactQuill
                                theme="snow"
                                value={formData.description}
                                onChange={(value) => setFormData({ ...formData, description: value })}
                                placeholder="Write the product description..."
                                modules={QUILL_MODULES}
                            />
                        </div>
                        {errors.description && <span className="field-error">{errors.description}</span>}
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
                            onChange={(e) => setFormData({ ...formData, metaDescription: e.target.value })}
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}

export default AdminProductForm;