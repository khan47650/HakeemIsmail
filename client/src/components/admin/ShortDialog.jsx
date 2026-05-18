import { useEffect, useState } from "react";
import { FiCamera } from "react-icons/fi";
import { toast } from "react-toastify";
import api from "../../api/api";
import "../../css/ProductDialog.css";

function ShortDialog({ open, onClose, fetchShorts, selectedShort }) {
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState("");

  const [formData, setFormData] = useState({
    thumbnail: "",
    title: "",
    duration: "",
    youtubeUrl: "",
    facebookUrl: "",
  });

  useEffect(() => {
    if (selectedShort) {
      setFormData({
        thumbnail: "",
        title: selectedShort.title || "",
        duration: selectedShort.duration || "",
        youtubeUrl: selectedShort.youtubeUrl || "",
        facebookUrl: selectedShort.facebookUrl || "",
      });

      setPreview(selectedShort.thumbnail || "");
    } else {
      setFormData({
        thumbnail: "",
        title: "",
        duration: "",
        youtubeUrl: "",
        facebookUrl: "",
      });

      setPreview("");
    }
  }, [selectedShort, open]);

  const handleThumbnail = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    const reader = new FileReader();

    reader.readAsDataURL(file);

    reader.onloadend = () => {
      setFormData({
        ...formData,
        thumbnail: reader.result,
      });

      setPreview(reader.result);
    };
  };

  const handleSubmit = async () => {
    if (!formData.youtubeUrl && !formData.facebookUrl) {
      toast.error("YouTube ya Facebook me se koi aik URL zaroor dein");
      return;
    }

    try {
      setLoading(true);

      if (selectedShort) {
        await api.put(`/shorts/${selectedShort._id}`, formData);
        toast.success("Short updated successfully");
      } else {
        await api.post("/shorts", formData);
        toast.success("Short uploaded successfully");
      }

      fetchShorts();
      onClose();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong");
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
            <img src={preview} alt="" className="product-dialog-image" />
          ) : (
            <div className="product-dialog-placeholder">
              <FiCamera />
            </div>
          )}

          <input type="file" accept="image/*" onChange={handleThumbnail} />
        </div>

        <input
          type="text"
          placeholder="Short Title"
          value={formData.title}
          onChange={(e) =>
            setFormData({
              ...formData,
              title: e.target.value,
            })
          }
        />

        <input
          type="text"
          placeholder="Duration e.g 0:42"
          value={formData.duration}
          onChange={(e) =>
            setFormData({
              ...formData,
              duration: e.target.value,
            })
          }
        />

        <input
          type="text"
          placeholder="YouTube Shorts URL"
          value={formData.youtubeUrl}
          onChange={(e) =>
            setFormData({
              ...formData,
              youtubeUrl: e.target.value,
            })
          }
        />

        <input
          type="text"
          placeholder="Facebook Reel URL"
          value={formData.facebookUrl}
          onChange={(e) =>
            setFormData({
              ...formData,
              facebookUrl: e.target.value,
            })
          }
        />

        <div className="dialog-actions">
          <button onClick={onClose} disabled={loading}>
            Cancel
          </button>

          <button onClick={handleSubmit} disabled={loading}>
            {loading
              ? selectedShort
                ? "Updating..."
                : "Uploading..."
              : selectedShort
              ? "Update"
              : "Upload"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ShortDialog;