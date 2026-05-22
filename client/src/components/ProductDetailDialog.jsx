import "../css/ProductDetail.css";

function ProductDetailDialog({ open, onClose, product }) {
    if (!open || !product) return null;

    const handleBuy = () => {
        const message = `
                Assalam o Alaikum,

                Mujhe ye product buy karna hai.

                Product: ${product.name}
                Price: Rs. ${product.price}

                Image:
                ${product.image}
                `;

                        const url = `https://wa.me/923054800448?text=${encodeURIComponent(message)}`;

                        window.open(url, "_blank");
                    };

    return (
        <div className="dialog-overlay">
            <div className="product-detail-dialog">
                <button className="product-detail-close" onClick={onClose}>
                    ×
                </button>

                <div className="product-detail-layout">
                    <div className="product-detail-image-wrap">
                        <img
                            src={product.image}
                            alt={product.name}
                            className="product-detail-image"
                        />
                    </div>

                    <div className="product-detail-content">
                        <span className="product-detail-category">
                            {product.category === "popular" ? "Popular Product" : "Herbal Product"}
                        </span>

                        <h2>{product.name}</h2>

                        <p className="product-detail-price">Rs. {product.price}</p>

                        <div className="product-detail-description-box">
                            <h4>Description</h4>
                            <p className="product-detail-description">{product.description}</p>
                        </div>

                        <button className="product-detail-buy-btn" onClick={handleBuy}>
                            Buy Now
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProductDetailDialog;