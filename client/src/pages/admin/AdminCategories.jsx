import { useEffect, useState } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiSearch, FiFilter, FiArrowLeft } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import api from '../../api/api';
import AdminCategoryForm from '../../components/admin/AdminCategoryForm';
import '../../css/AdminCategories.css';

function AdminCategories() {
    const navigate = useNavigate();
    const [categories, setCategories] = useState([]);
    const [filteredCategories, setFilteredCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedType, setSelectedType] = useState('articles');
    const [showForm, setShowForm] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);
    const [isSaving, setIsSaving] = useState(false);

    const contentTypes = [
        { value: 'articles', label: 'Articles' },
        { value: 'blogs', label: 'Blogs' },
        { value: 'videos', label: 'Videos' },
        { value: 'shorts', label: 'Shorts' }
    ];

    const fetchCategories = async () => {
        try {
            setLoading(true);
            const res = await api.get(`/categories?type=${selectedType}`);
            setCategories(res.data || []);
            setFilteredCategories(res.data || []);
        } catch (error) {
            toast.error('Failed to fetch categories');
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, [selectedType]);

    useEffect(() => {
        const filtered = categories.filter((cat) =>
            cat.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setFilteredCategories(filtered);
    }, [searchQuery, categories]);

    const handleAdd = () => {
        setEditingCategory(null);
        setShowForm(true);
    };

    const handleEdit = (category) => {
        setEditingCategory(category);
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this category?')) return;

        try {
            await api.delete(`/categories/${id}`);
            setCategories((prev) => prev.filter((cat) => cat._id !== id));
            toast.success('Category deleted successfully');
        } catch (error) {
            toast.error('Failed to delete category');
            console.log(error);
        }
    };

    const handleSaveCategory = async (categoryData) => {
        try {
            setIsSaving(true);
            if (editingCategory) {
                await api.put(`/categories/${editingCategory._id}`, {
                    ...categoryData,
                    type: selectedType
                });
                toast.success('Category updated successfully');
            } else {
                await api.post('/categories', {
                    ...categoryData,
                    type: selectedType
                });
                toast.success('Category created successfully');
            }
            setShowForm(false);
            setEditingCategory(null);
            fetchCategories();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to save category');
            console.log(error);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="admin-categories-page">
            <div className="admin-categories-header">
                <div className="admin-categories-header-top">
                    <button
                        className="admin-categories-back-btn"
                        onClick={() => navigate(-1)}
                        title="Go back"
                    >
                        <FiArrowLeft />
                    </button>
                    <div>
                        <h1>Categories Management</h1>
                        <p>Manage categories for Articles, Blogs, Videos, and Shorts</p>
                    </div>
                </div>
                <button
                    className="admin-btn-primary"
                    onClick={handleAdd}
                    disabled={isSaving}
                >
                    <FiPlus /> {isSaving ? 'Creating...' : 'Add Category'}
                </button>
            </div>

            <div className="admin-categories-controls">
                <div className="admin-filter-group">
                    <FiFilter />
                    <select
                        value={selectedType}
                        onChange={(e) => setSelectedType(e.target.value)}
                        className="admin-select"
                        disabled={isSaving}
                    >
                        {contentTypes.map((type) => (
                            <option key={type.value} value={type.value}>
                                {type.label}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="admin-search-group">
                    <FiSearch />
                    <input
                        type="text"
                        placeholder="Search categories..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="admin-search-input"
                        disabled={isSaving}
                    />
                </div>
            </div>

            {showForm && (
                <AdminCategoryForm
                    category={editingCategory}
                    type={selectedType}
                    onSave={handleSaveCategory}
                    onCancel={() => {
                        if (!isSaving) {
                            setShowForm(false);
                            setEditingCategory(null);
                        }
                    }}
                    isSaving={isSaving}
                />
            )}

            <div className="admin-categories-table-wrapper">
                {loading ? (
                    <div className="admin-loading">Loading categories...</div>
                ) : filteredCategories.length === 0 ? (
                    <div className="admin-empty-state">
                        <p>No categories found for {selectedType}.</p>
                        <button
                            className="admin-btn-secondary"
                            onClick={handleAdd}
                            disabled={isSaving}
                        >
                            <FiPlus /> Create first category
                        </button>
                    </div>
                ) : (
                    <table className="admin-categories-table">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Slug</th>
                                <th>Description</th>
                                <th>Type</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredCategories.map((category) => (
                                <tr key={category._id}>
                                    <td>
                                        <strong>{category.name}</strong>
                                    </td>
                                    <td>
                                        <code>{category.slug}</code>
                                    </td>
                                    <td className="admin-cell-text">
                                        {category.description ? category.description.slice(0, 50) + '...' : '-'}
                                    </td>
                                    <td>
                                        <span className="admin-badge">{category.type}</span>
                                    </td>
                                    <td>
                                        <div className="admin-actions">
                                            <button
                                                className="admin-btn-icon edit"
                                                onClick={() => handleEdit(category)}
                                                title="Edit"
                                                disabled={isSaving}
                                            >
                                                <FiEdit2 />
                                            </button>
                                            <button
                                                className="admin-btn-icon delete"
                                                onClick={() => handleDelete(category._id)}
                                                title="Delete"
                                                disabled={isSaving}
                                            >
                                                <FiTrash2 />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}

export default AdminCategories;