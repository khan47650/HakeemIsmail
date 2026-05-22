import { useEffect, useState } from "react";
import api from "../../api/api";
import "../../css/ProductDialog.css";
import { toast } from "react-toastify";

function ReplyDialog({ open, onClose, selectedMessage, fetchMessages }) {
    const [reply, setReply] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (selectedMessage) {
            setReply(selectedMessage.reply || "");
        }
    }, [selectedMessage]);

    const handleReply = async () => {
        try {
            setLoading(true);

            await api.post(`/contact-messages/reply/${selectedMessage._id}`, {
                reply,
            });

            fetchMessages();
            onClose();
        } catch (error) {
            console.log(error);
            toast.error("Message sending failed!");
        } finally {
            setLoading(false);
        }
    };

    if (!open) return null;

    return (
        <div className="dialog-overlay">
            <div className="product-dialog">
                <h3>Reply to {selectedMessage?.name}</h3>

                <textarea
                    placeholder="Write reply..."
                    value={reply}
                    onChange={(e) => setReply(e.target.value)}
                />

                <div className="dialog-actions">
                    <button onClick={onClose} disabled={loading}>
                        Cancel
                    </button>

                    <button onClick={handleReply} disabled={loading}>
                        {loading ? "Sending..." : "Send Reply"}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ReplyDialog;