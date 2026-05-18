import { useEffect, useState } from "react";
import api from "../../api/api";
import {
    FiCamera
} from "react-icons/fi";

import "../../css/ProductDialog.css";

function ProductDialog({
    open,
    onClose,
    fetchProducts,
    selectedProduct,
}) {

    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        image: "",
        name: "",
        price: "",
        description: "",
        category: "nonpopular",
    });

    const [preview, setPreview] = useState("");

    useEffect(() => {

        if (selectedProduct) {

            setFormData(selectedProduct);

            setPreview(selectedProduct.image);

        } else {

            setFormData({
                image: "",
                name: "",
                price: "",
                description: "",
                category: "nonpopular",
            });

            setPreview("");
        }

    }, [selectedProduct]);


    const handleImage = (e) => {

        const file = e.target.files[0];

        if (!file) return;

        const reader = new FileReader();

        reader.readAsDataURL(file);

        reader.onloadend = () => {

            setFormData({
                ...formData,
                image: reader.result,
            });

            setPreview(reader.result);
        };
    };


    const handleSubmit = async () => {

        try {

            setLoading(true);

            if (selectedProduct) {

                await api.put(
                    `/products/${selectedProduct._id}`,
                    formData
                );

            } else {

                await api.post(
                    "/products",
                    formData
                );
            }

            fetchProducts();

            onClose();

        } catch (error) {

            console.log(error);

        } finally {

            setLoading(false);
        }
    };


    if (!open) return null;

    return (
        <div className="dialog-overlay">

            <div className="product-dialog">

                <div className="product-dialog-image-wrap">

                    {preview ? (

                        <img
                            src={preview}
                            alt=""
                            className="product-dialog-image"
                        />

                    ) : (

                        <div className="product-dialog-placeholder">
                            <FiCamera />
                        </div>
                    )}

                    <input
                        type="file"
                        onChange={handleImage}
                    />

                </div>

                <input
                    type="text"
                    placeholder="Name"
                    value={formData.name}
                    onChange={(e) =>
                        setFormData({
                            ...formData,
                            name: e.target.value,
                        })
                    }
                />

                <input
                    type="number"
                    placeholder="Price"
                    value={formData.price}
                    onChange={(e) =>
                        setFormData({
                            ...formData,
                            price: e.target.value,
                        })
                    }
                />

                <textarea
                    placeholder="Description"
                    value={formData.description}
                    onChange={(e) =>
                        setFormData({
                            ...formData,
                            description: e.target.value,
                        })
                    }
                />

                <label>

                    <input
                        type="checkbox"
                        checked={formData.category === "popular"}
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                category: e.target.checked
                                    ? "popular"
                                    : "nonpopular",
                            })
                        }
                    />

                    Popular Product

                </label>

                <div className="dialog-actions">

                    <button
                        onClick={onClose}
                        disabled={loading}
                    >
                        Cancel
                    </button>

                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                    >
                        {loading
                            ? selectedProduct
                                ? "Updating..."
                                : "Creating..."
                            : selectedProduct
                                ? "Update"
                                : "Create"
                        }
                    </button>

                </div>

            </div>

        </div>
    );
}

export default ProductDialog;