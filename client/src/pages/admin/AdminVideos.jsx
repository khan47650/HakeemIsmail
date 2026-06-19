import React from "react";
import { FiArrowLeft, FiPlus, FiEdit2, FiTrash2 } from "react-icons/fi";
import { FaYoutube, FaFacebook } from "react-icons/fa";
import { FiChevronDown, FiExternalLink } from "react-icons/fi";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../../api/api";
import VideoDeleteDialog from "../../components/admin/VideoDeleteDialog";
import "../../css/AdminVideos.css";

function AdminVideos() {
    const navigate = useNavigate();

    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [openDropdown, setOpenDropdown] = useState(null);

    const [deleteOpen, setDeleteOpen] = useState(false);
    const [deleteVideo, setDeleteVideo] = useState(null);

    const fetchVideos = async () => {
        try {
            setLoading(true);
            const res = await api.get("/videos");
            setVideos(res.data || []);
        } catch (error) {
            toast.error("Videos did not load");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchVideos();
    }, []);

    const handleAdd = () => {
        navigate("/admin/videos/new");
    };

    const handleEdit = (video) => {
        navigate(`/admin/videos/edit/${video._id}`);
    };

    const handleDeleteClick = (video) => {
        setDeleteVideo(video);
        setDeleteOpen(true);
    };

    const confirmDelete = async () => {
        await api.delete(`/videos/${deleteVideo._id}`);
        toast.success("Video deleted successfully");
        setDeleteOpen(false);
        setDeleteVideo(null);
        fetchVideos();
    };

    const getStatusLabel = (video) =>
        video.status === "published" ? "Published" : "Draft";

    const getStatusClass = (video) =>
        video.status === "published" ? "published" : "draft";

    const renderPlatformLink = (url, type) => {
        if (!url) return null;

        const isYoutube = type === "youtube";

        return React.createElement(
            "a",
            {
                href: url,
                target: "_blank",
                rel: "noreferrer",
                className: `video-dropdown-item ${type}`,
            },
            React.createElement(isYoutube ? FaYoutube : FaFacebook, { key: "icon" }),
            React.createElement(
                "span",
                { key: "label" },
                isYoutube ? "YouTube" : "Facebook"
            ),
            React.createElement(FiExternalLink, {
                key: "ext",
                className: "right-icon",
            })
        );
    };

    return (
        <section className="admin-videos-page page-fade-up">
            <div className="admin-videos-top">
                <div className="admin-videos-title-wrap">
                    <button className="admin-videos-back-btn" onClick={() => navigate(-1)}>
                        <FiArrowLeft />
                    </button>
                    <h1>Videos</h1>
                </div>

                <button className="admin-add-video-btn" onClick={handleAdd}>
                    <FiPlus />
                    Add New Video
                </button>
            </div>

            {loading ? (
                <div className="admin-videos-grid">
                    {[1, 2, 3, 4, 5, 6].map((item) => (
                        <div className="admin-video-card video-skeleton" key={item}>
                            <div className="video-skeleton-thumb" />
                            <div className="video-skeleton-content">
                                <span />
                                <p />
                                <button />
                            </div>
                        </div>
                    ))}
                </div>
            ) : videos.length === 0 ? (
                <p className="admin-videos-empty">No videos found.</p>
            ) : (
                <div className="admin-videos-grid">
                    {videos.map((video, index) => (
                        <div className={`fade-up fade-up-delay-${(index % 6) + 1}`} key={video._id}>
                            <div className="admin-video-card">
                                <div className="admin-video-thumb-wrap">
                                    <img
                                        src={video.thumbnail || "/video-1.jpeg"}
                                        alt={video.title}
                                        className="admin-video-thumb"
                                    />

                                    <div className="admin-video-actions">
                                        <button className="admin-video-edit-btn" onClick={() => handleEdit(video)}>
                                            <FiEdit2 />
                                        </button>

                                        <button className="admin-video-delete-btn" onClick={() => handleDeleteClick(video)}>
                                            <FiTrash2 />
                                        </button>
                                    </div>

                                    <span className={`admin-video-status ${getStatusClass(video)}`}>
                                        {getStatusLabel(video)}
                                    </span>

                                    <span className="admin-video-duration">{video.duration}</span>
                                </div>

                                <div className="admin-video-content">
                                    {video.category && (
                                        <span className="admin-video-category">{video.category}</span>
                                    )}

                                    <h3 className="admin-video-card-title">{video.title}</h3>
                                    <div
                                        className="admin-video-card-text quill-content"
                                        dangerouslySetInnerHTML={{
                                            __html: video.description,
                                        }}
                                    />

                                    {video.tags?.length > 0 && (
                                        <div className="admin-video-hashtags">
                                            {video.tags.slice(0, 3).map((tag) => (
                                                <span className="admin-video-hashtag" key={tag}>
                                                    #{tag.replace(/\s+/g, "")}
                                                </span>
                                            ))}
                                        </div>
                                    )}


                                    <div className="video-dropdown-wrapper">
                                        <button
                                            className="admin-video-platform-btn"
                                            onClick={() =>
                                                setOpenDropdown(openDropdown === video._id ? null : video._id)
                                            }
                                        >
                                            Watch Now
                                            <FiChevronDown />
                                        </button>

                                        {openDropdown === video._id && (
                                            <div className="video-dropdown">
                                                {renderPlatformLink(video.youtubeUrl, "youtube")}
                                                {renderPlatformLink(video.facebookUrl, "facebook")}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <VideoDeleteDialog
                open={deleteOpen}
                onClose={() => setDeleteOpen(false)}
                onConfirm={confirmDelete}
            />
        </section>
    );
}

export default AdminVideos;