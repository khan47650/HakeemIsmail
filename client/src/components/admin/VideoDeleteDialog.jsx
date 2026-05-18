import { useState } from "react";
import "../../css/DeleteDialog.css";

function VideoDeleteDialog({ open, onClose, onConfirm }) {
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
        <h3>Delete Video?</h3>

        <p>Are you sure you want to delete this video?</p>

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

export default VideoDeleteDialog;