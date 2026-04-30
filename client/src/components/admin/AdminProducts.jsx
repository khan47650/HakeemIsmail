import { FiArrowLeft, FiPlus, FiEdit2, FiTrash2 } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import '../../css/AdminProducts.css';

function AdminProducts() {
    const navigate = useNavigate();

    const products = [
        { id: 1, name: 'Herbal Medicine', price: 'Rs. 1200', image: '/product-1.jpeg', isPopular: true },
        { id: 2, name: 'Natural Oil', price: 'Rs. 950', image: '/product-2.jpeg' },
        { id: 3, name: 'Herbal Tea', price: 'Rs. 650', image: '/prduct-3.jpeg', isPopular: true },
        { id: 4, name: 'Health Package', price: 'Rs. 2200', image: '/product-2.jpeg' },
        { id: 5, name: 'Skin Care Oil', price: 'Rs. 1500', image: '/product-1.jpeg' },
        { id: 6, name: 'Digestive Powder', price: 'Rs. 800', image: '/prduct-3.jpeg' },
    ];

    return (
        <section className="admin-products-page">
            <div className="admin-products-top">
                <div className="admin-products-title-wrap">
                    <button className="admin-products-back-btn" onClick={() => navigate(-1)}>
                        <FiArrowLeft />
                    </button>
                    <h1>Products</h1>
                </div>

                <button className="admin-add-product-btn">
                    <FiPlus />
                    Add New
                </button>
            </div>

            <div className="admin-products-grid">
                {products.map((product) => (
                    <div className={`admin-product-card fade-up fade-up-delay-${product.id}`}>
                        <div className="admin-product-image-wrap">
                            <img src={product.image} alt={product.name} className="admin-product-image" />

                            {product.isPopular && (
                                <span className="admin-product-badge">Popular</span>
                            )}
                        </div>

                        <div className="admin-product-content">
                            <h3>{product.name}</h3>
                            <p>{product.price}</p>

                            <div className="admin-product-actions">
                                <button className="admin-product-edit-btn">
                                    <FiEdit2 />
                                </button>
                                <button className="admin-product-delete-btn">
                                    <FiTrash2 />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}

export default AdminProducts;