import { useEffect, useRef, useState } from "react";
import {
    FiImage,
    FiUploadCloud,
    FiTrash2,
    FiX,
    FiCheckCircle,
    FiAlertCircle,
} from "react-icons/fi";
import { toast } from "react-toastify";
import api from "../../api/api";
import "../../css/SliderImages.css";

function SliderImages() {
    const fileInputRef = useRef(null);

    const [images, setImages] = useState([]);
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState("");
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [deletingId, setDeletingId] = useState(null);
    const [deleteDialog, setDeleteDialog] = useState(null);

    const fetchSliderImages = async () => {
        try {
            setLoading(true);

            const response = await api.get("/slider-images");

            setImages(
                Array.isArray(response.data)
                    ? response.data
                    : []
            );
        } catch (error) {
            console.error("Slider images fetch error:", error);
            toast.error("Unable to load slider images.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSliderImages();
    }, []);

    useEffect(() => {
        return () => {
            if (previewUrl) {
                URL.revokeObjectURL(previewUrl);
            }
        };
    }, [previewUrl]);

    const handleFileChange = (event) => {
        const file = event.target.files?.[0];

        if (!file) return;

        const allowedTypes = [
            "image/jpeg",
            "image/jpg",
            "image/png",
            "image/webp",
        ];

        if (!allowedTypes.includes(file.type)) {
            toast.error("Only JPG, PNG and WEBP images are allowed.");
            event.target.value = "";
            return;
        }

        if (file.size > 8 * 1024 * 1024) {
            toast.error("The image size must be less than 8MB.");
            event.target.value = "";
            return;
        }

        if (previewUrl) {
            URL.revokeObjectURL(previewUrl);
        }

        setSelectedFile(file);
        setPreviewUrl(URL.createObjectURL(file));
    };

    const clearSelectedFile = () => {
        if (previewUrl) {
            URL.revokeObjectURL(previewUrl);
        }

        setSelectedFile(null);
        setPreviewUrl("");

        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const handleUpload = async () => {
        if (!selectedFile) {
            toast.error("Please select an image first.");
            return;
        }

        if (images.length >= 10) {
            toast.error("A maximum of 10 slider images is allowed.");
            return;
        }

        try {
            setUploading(true);

            const formData = new FormData();
            formData.append("image", selectedFile);

            const response = await api.post(
                "/slider-images",
                formData
            );

            if (response.data?.image) {
                setImages((previous) => [
                    ...previous,
                    response.data.image,
                ]);
            } else {
                await fetchSliderImages();
            }

            clearSelectedFile();

            toast.success(
                "Slider image uploaded successfully."
            );
        } catch (error) {
            console.error("Slider image upload error:", error);

            toast.error(
                error.response?.data?.message ||
                "Unable to upload the slider image."
            );
        } finally {
            setUploading(false);
        }
    };

    const handleDelete = async () => {
        if (!deleteDialog?._id) return;

        try {
            setDeletingId(deleteDialog._id);

            await api.delete(
                `/slider-images/${deleteDialog._id}`
            );

            setImages((previous) =>
                previous.filter(
                    (image) => image._id !== deleteDialog._id
                )
            );

            setDeleteDialog(null);

            toast.success(
                "Slider image deleted successfully."
            );
        } catch (error) {
            console.error("Slider image delete error:", error);

            toast.error(
                error.response?.data?.message ||
                "Unable to delete the slider image."
            );
        } finally {
            setDeletingId(null);
        }
    };

    const formatDate = (date) => {
        if (!date) return "Unknown date";

        return new Date(date).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        });
    };

    return (
        <div className="slider-admin-page">
            <div className="slider-admin-hero">
                <div className="slider-admin-hero-content">
                    <div className="slider-admin-title-icon">
                        <FiImage />
                    </div>

                    <div>
                        <span className="slider-admin-eyebrow">
                            Homepage Management
                        </span>

                        <h1>Homepage Slider</h1>

                        <p>
                            Upload and manage the images displayed in the
                            homepage slider. One uploaded image will remain
                            static, while multiple uploaded images will rotate
                            automatically.
                        </p>
                    </div>
                </div>

                <div className="slider-admin-count">
                    <strong>{images.length}</strong>
                    <span>of 10 images</span>
                </div>
            </div>

            <div className="slider-admin-info-grid">
                <div className="slider-admin-info-card">
                    <FiCheckCircle />

                    <div>
                        <h3>One Uploaded Image</h3>
                        <p>
                            The single image will remain visible without sliding.
                        </p>
                    </div>
                </div>

                <div className="slider-admin-info-card">
                    <FiImage />

                    <div>
                        <h3>Multiple Uploaded Images</h3>
                        <p>
                            All uploaded images will rotate automatically.
                        </p>
                    </div>
                </div>

                <div className="slider-admin-info-card">
                    <FiAlertCircle />

                    <div>
                        <h3>No Uploaded Images</h3>
                        <p>
                            The default slide_4.jpeg image will be displayed.
                        </p>
                    </div>
                </div>
            </div>

            <section className="slider-upload-card">
                <div className="slider-section-heading">
                    <div>
                        <span>New Slider Image</span>
                        <h2>Upload a New Slider Image</h2>
                    </div>

                    <div className="slider-upload-limit">
                        JPG, PNG, WEBP • Maximum 8MB
                    </div>
                </div>

                {!previewUrl ? (
                    <button
                        type="button"
                        className="slider-upload-dropzone"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={images.length >= 10}
                    >
                        <div className="slider-upload-icon">
                            <FiUploadCloud />
                        </div>

                        <h3>
                            {images.length >= 10
                                ? "Maximum image limit reached"
                                : "Select an image to upload"}
                        </h3>

                        <p>
                            This image is not live yet. Select a wide landscape
                            image, preferably with a 16:9 ratio.
                        </p>

                        <span>
                            Choose Image
                        </span>
                    </button>
                ) : (
                    <div className="slider-preview-area">
                        <div className="slider-preview-image-wrapper">
                            <img
                                src={previewUrl}
                                alt="Selected slider preview"
                            />

                            <button
                                type="button"
                                className="slider-preview-remove"
                                onClick={clearSelectedFile}
                                disabled={uploading}
                                aria-label="Remove selected image"
                            >
                                <FiX />
                            </button>
                        </div>

                        <div className="slider-preview-details">
                            <div>
                                <span className="slider-preview-status">
                                    Selected Image Preview — Not Live Yet
                                </span>

                                <h3>{selectedFile?.name}</h3>

                                <p>
                                    {selectedFile
                                        ? `${(
                                            selectedFile.size /
                                            1024 /
                                            1024
                                        ).toFixed(2)} MB`
                                        : ""}
                                </p>
                            </div>

                            <div className="slider-preview-actions">
                                <button
                                    type="button"
                                    className="slider-change-button"
                                    onClick={() =>
                                        fileInputRef.current?.click()
                                    }
                                    disabled={uploading}
                                >
                                    Change Image
                                </button>

                                <button
                                    type="button"
                                    className="slider-upload-button"
                                    onClick={handleUpload}
                                    disabled={uploading}
                                >
                                    {uploading ? (
                                        <>
                                            <span className="slider-button-spinner" />
                                            Uploading...
                                        </>
                                    ) : (
                                        <>
                                            <FiUploadCloud />
                                            Upload and Publish
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handleFileChange}
                    hidden
                />
            </section>

            <section className="slider-gallery-card">
                <div className="slider-section-heading">
                    <div>
                        <span>Live on Homepage</span>
                        <h2>Active Slider Images</h2>
                    </div>

                    <div className="slider-status-badge">
                        {images.length > 1
                            ? "Automatic slider is active"
                            : images.length === 1
                                ? "Single static image is active"
                                : "Default image is active"}
                    </div>
                </div>

                {loading ? (
                    <div className="slider-loading-state">
                        <span className="slider-main-spinner" />

                        <p>Loading active slider images...</p>
                    </div>
                ) : images.length === 0 ? (
                    <div className="slider-empty-state">
                        <div>
                            <FiImage />
                        </div>

                        <h3>No slider images have been uploaded</h3>

                        <p>
                            The default slide_4.jpeg image from the public
                            folder is currently displayed on the homepage.
                            Upload an image above to replace it.
                        </p>

                        <button
                            type="button"
                            onClick={() =>
                                fileInputRef.current?.click()
                            }
                        >
                            <FiUploadCloud />
                            Upload First Image
                        </button>
                    </div>
                ) : (
                    <div className="slider-images-grid">
                        {images.map((image, index) => (
                            <article
                                className="slider-image-card"
                                key={image._id}
                            >
                                <div className="slider-image-preview">
                                    <img
                                        src={image.imageUrl}
                                        alt={`Homepage slider ${index + 1}`}
                                    />

                                    <div className="slider-image-position">
                                        Slide {index + 1}
                                    </div>

                                    <button
                                        type="button"
                                        className="slider-delete-button"
                                        onClick={() =>
                                            setDeleteDialog(image)
                                        }
                                        disabled={
                                            deletingId === image._id
                                        }
                                        aria-label="Delete slider image"
                                    >
                                        {deletingId === image._id ? (
                                            <span className="slider-small-spinner" />
                                        ) : (
                                            <FiTrash2 />
                                        )}
                                    </button>
                                </div>

                                <div className="slider-image-details">
                                    <div>
                                        <h3>
                                            {image.originalName ||
                                                `Slider Image ${index + 1}`}
                                        </h3>

                                        <p>
                                            Uploaded{" "}
                                            {formatDate(image.createdAt)}
                                        </p>
                                    </div>

                                    <span className="slider-live-badge">
                                        Live
                                    </span>
                                </div>
                            </article>
                        ))}
                    </div>
                )}
            </section>

            {deleteDialog && (
                <div
                    className="slider-dialog-overlay"
                    onClick={() => {
                        if (!deletingId) {
                            setDeleteDialog(null);
                        }
                    }}
                >
                    <div
                        className="slider-delete-dialog"
                        onClick={(event) =>
                            event.stopPropagation()
                        }
                    >
                        <button
                            type="button"
                            className="slider-dialog-close"
                            onClick={() =>
                                setDeleteDialog(null)
                            }
                            disabled={Boolean(deletingId)}
                            aria-label="Close dialog"
                        >
                            <FiX />
                        </button>

                        <div className="slider-dialog-icon">
                            <FiTrash2 />
                        </div>

                        <h2>Delete Slider Image?</h2>

                        <p>
                            This image will be permanently removed from
                            the homepage slider, database and Cloudinary.
                        </p>

                        <div className="slider-dialog-preview">
                            <img
                                src={deleteDialog.imageUrl}
                                alt="Image selected for deletion"
                            />
                        </div>

                        <div className="slider-dialog-actions">
                            <button
                                type="button"
                                className="slider-cancel-button"
                                onClick={() =>
                                    setDeleteDialog(null)
                                }
                                disabled={Boolean(deletingId)}
                            >
                                Cancel
                            </button>

                            <button
                                type="button"
                                className="slider-confirm-delete"
                                onClick={handleDelete}
                                disabled={Boolean(deletingId)}
                            >
                                {deletingId ? (
                                    <>
                                        <span className="slider-button-spinner" />
                                        Deleting...
                                    </>
                                ) : (
                                    <>
                                        <FiTrash2 />
                                        Delete Image
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default SliderImages;