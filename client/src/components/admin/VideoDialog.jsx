import { useEffect, useState } from "react";
import { FiCamera } from "react-icons/fi";
import { toast } from "react-toastify";
import api from "../../api/api";
import "../../css/ProductDialog.css";

function VideoDialog({ open, onClose, fetchVideos, selectedVideo }) {
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState("");

  const [formData, setFormData] = useState({
    thumbnail: "",
    title: "",
    description: "",
    duration: "",
    youtubeUrl: "",
    facebookUrl: "",
  });

  useEffect(() => {
    if (selectedVideo) {
      setFormData({
        thumbnail: "",
        title: selectedVideo.title || "",
        description: selectedVideo.description || "",
        duration: selectedVideo.duration || "",
        youtubeUrl: selectedVideo.youtubeUrl || "",
        facebookUrl: selectedVideo.facebookUrl || "",
      });

      setPreview(selectedVideo.thumbnail || "");
    } else {
      setFormData({
        thumbnail: "",
        title: "",
        description: "",
        duration: "",
        youtubeUrl: "",
        facebookUrl: "",
      });

      setPreview("");
    }
  }, [selectedVideo, open]);

  const handleThumbnail = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onloadend = () => {
      setFormData({ ...formData, thumbnail: reader.result });
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

      if (selectedVideo) {
        await api.put(`/videos/${selectedVideo._id}`, formData);
        toast.success("Video updated successfully");
      } else {
        await api.post("/videos", formData);
        toast.success("Video uploaded successfully");
      }

      fetchVideos();
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
          placeholder="Video Title"
          value={formData.title}
          onChange={(e) =>
            setFormData({ ...formData, title: e.target.value })
          }
        />

        <textarea
          placeholder="Description"
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
        />

        <input
          type="text"
          placeholder="Duration e.g 12:45"
          value={formData.duration}
          onChange={(e) =>
            setFormData({ ...formData, duration: e.target.value })
          }
        />

        <input
          type="text"
          placeholder="YouTube URL"
          value={formData.youtubeUrl}
          onChange={(e) =>
            setFormData({ ...formData, youtubeUrl: e.target.value })
          }
        />

        <input
          type="text"
          placeholder="Facebook URL"
          value={formData.facebookUrl}
          onChange={(e) =>
            setFormData({ ...formData, facebookUrl: e.target.value })
          }
        />

        <div className="dialog-actions">
          <button onClick={onClose} disabled={loading}>
            Cancel
          </button>

          <button onClick={handleSubmit} disabled={loading}>
            {loading
              ? selectedVideo
                ? "Updating..."
                : "Uploading..."
              : selectedVideo
              ? "Update"
              : "Upload"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default VideoDialog;