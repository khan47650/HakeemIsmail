import { useState, useEffect } from 'react';
import { FiX } from 'react-icons/fi';
import '../../css/AdminCategoryForm.css';

function AdminCategoryForm({ category, type, onSave, onCancel, isSaving }) {
    const [formData, setFormData] = useState({
        name: '',
        slug: '',
        description: ''
    });

    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (category) {
            setFormData({
                name: category.name,
                slug: category.slug,
                description: category.description || ''
            });
        }
    }, [category]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));

        // Auto-generate slug from name
        if (name === 'name') {
            const slug = value
                .toLowerCase()
                .trim()
                .replace(/[^\w\s-]/g, '')
                .replace(/\s+/g, '-');
            setFormData((prev) => ({
                ...prev,
                slug: slug
            }));
        }

        // Clear error for this field
        setErrors((prev) => ({
            ...prev,
            [name]: ''
        }));
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.name.trim()) {
            newErrors.name = 'Category name is required';
        }

        if (!formData.slug.trim()) {
            newErrors.slug = 'Slug is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        onSave(formData);
    };

    return (
        <div className="admin-form-overlay">
            <div className="admin-form-modal">
                <div className="admin-form-header">
                    <h2>{category ? 'Edit Category' : 'Add New Category'}</h2>
                    <button
                        className="admin-form-close"
                        onClick={onCancel}
                        disabled={isSaving}
                    >
                        <FiX />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="admin-form">
                    <div className="admin-form-group">
                        <label>Category Name *</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Enter category name"
                            className={`admin-input ${errors.name ? 'error' : ''}`}
                            disabled={isSaving}
                            required
                        />
                        {errors.name && <span className="admin-error">{errors.name}</span>}
                    </div>

                    <div className="admin-form-group">
                        <label>Slug *</label>
                        <input
                            type="text"
                            name="slug"
                            value={formData.slug}
                            onChange={handleChange}
                            placeholder="auto-generated-slug"
                            className={`admin-input ${errors.slug ? 'error' : ''}`}
                            disabled={isSaving}
                            required
                        />
                        <small>Auto-generated from name. Edit if needed.</small>
                        {errors.slug && <span className="admin-error">{errors.slug}</span>}
                    </div>

                    <div className="admin-form-group">
                        <label>Description</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Enter category description (optional)"
                            className="admin-textarea"
                            rows="4"
                            disabled={isSaving}
                        />
                    </div>

                    <div className="admin-form-actions">
                        <button
                            type="button"
                            className="admin-btn-secondary"
                            onClick={onCancel}
                            disabled={isSaving}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="admin-btn-primary"
                            disabled={isSaving}
                        >
                            {isSaving ? (category ? 'Updating...' : 'Creating...') : (category ? 'Update Category' : 'Create Category')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default AdminCategoryForm;