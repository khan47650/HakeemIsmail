import { useState } from 'react';
import { FiArrowLeft, FiTrash2, FiMessageCircle } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import '../../css/Messages.css';

function Messages() {
    const navigate = useNavigate();
    const [expandedId, setExpandedId] = useState(null);

    const messages = [
        {
            id: 1,
            userName: 'Ali Khan',
            email: 'alikhan@gmail.com',
            message: 'Mujhe herbal medicine ke usage ke bare me detail chahiye.',
        },
        {
            id: 2,
            userName: 'Sara Ahmed',
            email: 'saraahmed@gmail.com',
            message: 'Natural oil kis tarah use karna hai aur delivery kitne din me hoti hai? Aur mujhe ye bhi batayen ke is product ko kitni dafa daily use karna chahiye.',
        },
        {
            id: 3,
            userName: 'Ahmed Raza',
            email: 'ahmedraza@gmail.com',
            message: 'Kya aap ke products cash on delivery available hain?',
        },
        {
            id: 4,
            userName: 'Admin User',
            email: 'adminuser@gmail.com',
            message: 'Mujhe product consultation ke liye contact karna hai. Please mujhe detail me guide kar dein ke kaunsa product meri health condition ke liye suitable rahega.',
        },
    ];

    return (
        <section className="admin-messages-page">
            <div className="admin-messages-top">
                <div className="admin-messages-title-wrap">
                    <button className="admin-messages-back-btn" onClick={() => navigate(-1)}>
                        <FiArrowLeft />
                    </button>
                    <h1>Messages</h1>
                </div>
            </div>

            <div className="admin-messages-grid">
                {messages.map((item, index) => {
                    const isExpanded = expandedId === item.id;
                    const isLongMessage = item.message.length > 95;

                    return (
                        <div key={item.id}
                            className={`admin-message-card fade-up fade-up-delay-${(index % 6) + 1} ${isExpanded ? 'expanded' : ''}`}>
                            <div className="admin-message-card-top">
                                <div>
                                    <h3>{item.userName}</h3>
                                    <p>{item.email}</p>
                                </div>

                                <div className="admin-message-actions">
                                    <button className="admin-message-reply-btn">
                                        <FiMessageCircle />
                                    </button>
                                    <button className="admin-message-delete-btn">
                                        <FiTrash2 />
                                    </button>
                                </div>
                            </div>

                            <div className="admin-message-body">
                                <p className={isExpanded ? 'message-expanded' : 'message-clamped'}>
                                    {item.message}
                                </p>

                                {isLongMessage && (
                                    <button
                                        className="admin-message-read-btn"
                                        onClick={() => setExpandedId(isExpanded ? null : item.id)}
                                    >
                                        {isExpanded ? 'See less' : 'Read more'}
                                    </button>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </section>
    );
}

export default Messages;