import { useEffect, useState } from "react";
import { FiArrowLeft, FiTrash2, FiMessageCircle } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import api from "../../api/api";
import ReplyDialog from "../../components/admin/ReplyDialog";
import DeleteDialog from "../../components/admin/DeleteDialog";
import "../../css/Messages.css";
import { toast } from "react-toastify";

function Messages() {
    const navigate = useNavigate();

    const [expandedId, setExpandedId] = useState(null);
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);

    const [replyOpen, setReplyOpen] = useState(false);
    const [selectedMessage, setSelectedMessage] = useState(null);

    const [deleteDialog, setDeleteDialog] = useState(false);
    const [deleteId, setDeleteId] = useState(null);

    const [deleteAllDialog, setDeleteAllDialog] = useState(false);

    const fetchMessages = async () => {
        try {
            setLoading(true);
            const res = await api.get("/contact-messages");
            setMessages(res.data);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMessages();
    }, []);

    const handleDelete = async () => {
        try {
            await api.delete(`/contact-messages/${deleteId}`);
            fetchMessages();
            setDeleteDialog(false);
        } catch (error) {
            console.log(error);
        }
    };

    const handleDeleteAll = async () => {
        try {
            await api.delete("/contact-messages/delete-all");
            fetchMessages();
            setDeleteAllDialog(false);
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <section className="admin-messages-page">
            <div className="admin-messages-top">
                <div className="admin-messages-title-wrap">
                    <button
                        className="admin-messages-back-btn"
                        onClick={() => navigate(-1)}
                    >
                        <FiArrowLeft />
                    </button>

                    <h1>Messages</h1>
                </div>

                {messages.length > 0 && (
                    <button
                        className="admin-message-delete-all-btn"
                        onClick={() => setDeleteAllDialog(true)}
                    >
                        Delete All
                    </button>
                )}
            </div>

            <div className="admin-messages-grid">
                {loading ? (
                    [...Array(6)].map((_, index) => (
                        <div className="admin-message-skeleton" key={index}></div>
                    ))
                ) : messages.length === 0 ? (
                    <div className="admin-empty-state">
                        Messages Not Found Yet.
                    </div>
                ) : (
                    messages.map((item, index) => {
                        const isExpanded = expandedId === item._id;
                        const isLongMessage = item.message.length > 95;

                        return (
                            <div
                                key={item._id}
                                className={`admin-message-card fade-up fade-up-delay-${(index % 6) + 1
                                    } ${isExpanded ? "expanded" : ""}`}
                            >
                                <div className="admin-message-card-top">
                                    <div>
                                        <h3>{item.name}</h3>
                                        <p>{item.email}</p>
                                    </div>

                                    <div className="admin-message-actions">
                                        <button
                                            className="admin-message-reply-btn"
                                            onClick={() => {
                                                setSelectedMessage(item);
                                                setReplyOpen(true);
                                            }}
                                        >
                                            <FiMessageCircle />
                                        </button>

                                        <button
                                            className="admin-message-delete-btn"
                                            onClick={() => {
                                                setDeleteId(item._id);
                                                setDeleteDialog(true);
                                            }}
                                        >
                                            <FiTrash2 />
                                        </button>
                                    </div>
                                </div>

                                <div className="admin-message-body">
                                    {item.isReplied && (
                                        <span className="admin-message-replied-badge">
                                            Replied
                                        </span>
                                    )}

                                    <p className={isExpanded ? "message-expanded" : "message-clamped"}>
                                        {item.message}
                                    </p>

                                    {isLongMessage && (
                                        <button
                                            className="admin-message-read-btn"
                                            onClick={() => setExpandedId(isExpanded ? null : item._id)}
                                        >
                                            {isExpanded ? "See less" : "Read more"}
                                        </button>
                                    )}
                                </div>
                            </div>
                        );
                    })
                )}
            </div>

            <ReplyDialog
                open={replyOpen}
                onClose={() => setReplyOpen(false)}
                selectedMessage={selectedMessage}
                fetchMessages={fetchMessages}
            />

            <DeleteDialog
                open={deleteDialog}
                onClose={() => setDeleteDialog(false)}
                onConfirm={handleDelete}
            />

            <DeleteDialog
                open={deleteAllDialog}
                onClose={() => setDeleteAllDialog(false)}
                onConfirm={handleDeleteAll}
            />
        </section>
    );
}

export default Messages;