import { FiArrowLeft, FiPlus, FiEdit2, FiTrash2 } from "react-icons/fi";
import { FaYoutube, FaFacebook } from "react-icons/fa";
import { FiChevronDown, FiExternalLink } from "react-icons/fi";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../../api/api";
import ShortDialog from "./ShortDialog";
import ShortDeleteDialog from "./ShortDeleteDialog";
import "../../css/AdminShorts.css";

function AdminShorts() {
  const navigate = useNavigate();

  const [shorts, setShorts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDropdown, setOpenDropdown] = useState(null);

  const [openDialog, setOpenDialog] = useState(false);
  const [selectedShort, setSelectedShort] = useState(null);

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteShort, setDeleteShort] = useState(null);

  const fetchShorts = async () => {
    try {
      setLoading(true);
      const res = await api.get("/shorts");
      setShorts(res.data || []);
    } catch (error) {
      toast.error("Shorts load nahi ho sakay");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShorts();
  }, []);

  const handleAdd = () => {
    setSelectedShort(null);
    setOpenDialog(true);
  };

  const handleEdit = (short) => {
    setSelectedShort(short);
    setOpenDialog(true);
  };

  const handleDeleteClick = (short) => {
    setDeleteShort(short);
    setDeleteOpen(true);
  };

  const confirmDelete = async () => {
    await api.delete(`/shorts/${deleteShort._id}`);
    toast.success("Short deleted successfully");
    setDeleteOpen(false);
    setDeleteShort(null);
    fetchShorts();
  };

  return (
    <section className="admin-shorts-page page-fade-up">
      <div className="admin-shorts-top">
        <div className="admin-shorts-title-wrap">
          <button
            className="admin-shorts-back-btn"
            onClick={() => navigate(-1)}
          >
            <FiArrowLeft />
          </button>

          <h1>Shorts</h1>
        </div>

        <button className="admin-add-short-btn" onClick={handleAdd}>
          <FiPlus />
          Add New
        </button>
      </div>

      <div className="admin-shorts-grid">
        {loading ? (
          [1, 2, 3, 4, 5, 6].map((item) => (
            <div className="admin-short-card short-skeleton" key={item}>
              <div className="short-skeleton-thumb" />
              <div className="short-skeleton-content">
                <span />
                <button />
              </div>
            </div>
          ))
        ) : shorts.length === 0 ? (
          <p className="admin-shorts-empty">No shorts found.</p>
        ) : (
          shorts.map((short, index) => (
            <div
              className={`fade-up fade-up-delay-${(index % 6) + 1}`}
              key={short._id}
            >
              <div className="admin-short-card">
                <img
                  src={short.thumbnail || "/short-1.jpeg"}
                  alt={short.title}
                  className="admin-short-thumb"
                />

                <div className="admin-short-overlay"></div>

                <div className="admin-short-actions">
                  <button
                    className="admin-short-edit-btn"
                    onClick={() => handleEdit(short)}
                  >
                    <FiEdit2 />
                  </button>

                  <button
                    className="admin-short-delete-btn"
                    onClick={() => handleDeleteClick(short)}
                  >
                    <FiTrash2 />
                  </button>
                </div>

                <span className="admin-short-duration">
                  {short.duration}
                </span>

                <div className="admin-short-content">
                  <h3 className="admin-short-title">{short.title}</h3>

                  <div className="video-dropdown-wrapper">
                    <button
                      className="admin-video-platform-btn"
                      onClick={() =>
                        setOpenDropdown(
                          openDropdown === short._id ? null : short._id
                        )
                      }
                    >
                      Watch Now
                      <FiChevronDown />
                    </button>

                    {openDropdown === short._id && (
                      <div className="video-dropdown">
                        {short.youtubeUrl && (
                          <a
                            href={short.youtubeUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="video-dropdown-item youtube"
                          >
                            <FaYoutube />
                            <span>YouTube</span>
                            <FiExternalLink className="right-icon" />
                          </a>
                        )}

                        {short.facebookUrl && (
                          <a
                            href={short.facebookUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="video-dropdown-item facebook"
                          >
                            <FaFacebook />
                            <span>Facebook</span>
                            <FiExternalLink className="right-icon" />
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <ShortDialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        fetchShorts={fetchShorts}
        selectedShort={selectedShort}
      />

      <ShortDeleteDialog
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={confirmDelete}
      />
    </section>
  );
}

export default AdminShorts;