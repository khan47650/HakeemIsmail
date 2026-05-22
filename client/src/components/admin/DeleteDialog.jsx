import { useState } from "react";
import "../../css/DeleteDialog.css";

function DeleteDialog({
    open,
    onClose,
    onConfirm,
    title = "Delete Item?",
    text = "Are you sure you want to delete this item?",
}) {
    const [loading, setLoading] = useState(false);

    if (!open) return null;

    const handleDelete = async () => {
        try {
            setLoading(true);
            await onConfirm();
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="dialog-overlay">
            <div className="delete-dialog">
                <h3>{title}</h3>

                <p>{text}</p>

                <div className="dialog-actions">
                    <button onClick={onClose} disabled={loading}>
                        No
                    </button>

                    <button onClick={handleDelete} disabled={loading}>
                        {loading ? "Deleting..." : "Yes"}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default DeleteDialog;