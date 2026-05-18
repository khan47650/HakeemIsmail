import { FiArrowLeft, FiPlus, FiEdit2, FiTrash2 } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import '../../css/AdminProducts.css';
import { useEffect, useState } from 'react';
import api from '../../api/api';
import ProductDialog from './ProductDialog';
import DeleteDialog from './DeleteDialog';

function AdminProducts() {

    const navigate = useNavigate();

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    const [dialogOpen, setDialogOpen] = useState(false);

    const [selectedProduct, setSelectedProduct] = useState(null);

    const [deleteDialog, setDeleteDialog] = useState(false);

    const [deleteId, setDeleteId] = useState(null);


    const fetchProducts = async () => {
        try {

            setLoading(true);

            const res = await api.get('/products');

            setProducts(res.data);

        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);


    const handleDelete = async () => {
        try {

            await api.delete(`/products/${deleteId}`);

            fetchProducts();

            setDeleteDialog(false);

        } catch (error) {
            console.log(error);
        }
    };


    return (
        <section className="admin-products-page">

            <div className="admin-products-top">

                <div className="admin-products-title-wrap">

                    <button
                        className="admin-products-back-btn"
                        onClick={() => navigate(-1)}
                    >
                        <FiArrowLeft />
                    </button>

                    <h1>Products</h1>

                </div>

                <button
                    className="admin-add-product-btn"
                    onClick={() => {
                        setSelectedProduct(null);
                        setDialogOpen(true);
                    }}
                >
                    <FiPlus />
                    Add New
                </button>

            </div>

            <div className="admin-products-grid">

                {loading ? (

                    [...Array(6)].map((_, index) => (
                        <div className="admin-product-skeleton" key={index}></div>
                    ))

                ) : products.length === 0 ? (

                    <div className="admin-empty-state">
                        Products Not Uploaded Yet.
                    </div>

                ) : (

                    products.map((product, index) => (

                        <div
                            className={`admin-product-card fade-up fade-up-delay-${(index % 6) + 1}`}
                            key={product._id}
                        >

                            <div className="admin-product-image-wrap">

                                <img
                                    src={product.image}
                                    alt={product.name}
                                    className="admin-product-image"
                                />

                                {product.category === "popular" && (
                                    <span className="admin-product-badge">
                                        Popular
                                    </span>
                                )}

                            </div>

                            <div className="admin-product-content">

                                <h3>{product.name}</h3>

                                <p>Rs. {product.price}</p>

                                <div className="admin-product-actions">

                                    <button
                                        className="admin-product-edit-btn"
                                        onClick={() => {
                                            setSelectedProduct(product);
                                            setDialogOpen(true);
                                        }}
                                    >
                                        <FiEdit2 />
                                    </button>

                                    <button
                                        className="admin-product-delete-btn"
                                        onClick={() => {
                                            setDeleteId(product._id);
                                            setDeleteDialog(true);
                                        }}
                                    >
                                        <FiTrash2 />
                                    </button>

                                </div>

                            </div>

                        </div>
                    ))
                )}

            </div>

            <ProductDialog
                open={dialogOpen}
                onClose={() => setDialogOpen(false)}
                fetchProducts={fetchProducts}
                selectedProduct={selectedProduct}
            />

            <DeleteDialog
                open={deleteDialog}
                onClose={() => setDeleteDialog(false)}
                onConfirm={handleDelete}
            />

        </section>
    );
}

export default AdminProducts;