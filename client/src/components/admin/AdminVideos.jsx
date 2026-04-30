import { FiArrowLeft, FiPlus, FiEdit2, FiTrash2 } from 'react-icons/fi';
import { FaYoutube, FaFacebook } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import '../../css/AdminVideos.css';

function AdminVideos() {
    const navigate = useNavigate();

    const videos = [
        {
            id: 1,
            title: 'Best Herbal Tips for Daily Health',
            platform: 'YouTube',
            thumbnail: '/video-1.jpeg',
            duration: '12:45',
            description: 'Useful herbal guidance and simple daily wellness tips for a healthier lifestyle.',
        },
        {
            id: 2,
            title: 'How to Use Natural Honey Properly',
            platform: 'Facebook',
            thumbnail: '/video-2.jpeg',
            duration: '08:20',
            description: 'Learn the right way to use natural honey in your daily routine.',
        },
        {
            id: 3,
            title: 'Benefits of Black Seed in Routine',
            platform: 'YouTube',
            thumbnail: '/video-3.jpeg',
            duration: '10:05',
            description: 'Explore the traditional benefits of black seed and its wellness uses.',
        },
        {
            id: 4,
            title: 'Organic Lifestyle Tips for Better Health',
            platform: 'Facebook',
            thumbnail: '/video-4.jpeg',
            duration: '07:40',
            description: 'Easy organic lifestyle improvements that can make your routine better.',
        },
        {
            id: 5,
            title: 'Simple Home Remedies You Should Know',
            platform: 'YouTube',
            thumbnail: '/video-5.jpeg',
            duration: '09:30',
            description: 'Common home remedies explained in a simple and practical way.',
        },
        {
            id: 6,
            title: 'Skin Care with Natural Products',
            platform: 'Facebook',
            thumbnail: '/video-4.jpeg',
            duration: '06:55',
            description: 'Natural product based skin care guidance for a clean routine.',
        },
    ];

    return (
        <section className="admin-videos-page page-fade-up">
            <div className="admin-videos-top">
                <div className="admin-videos-title-wrap">
                    <button className="admin-videos-back-btn" onClick={() => navigate(-1)}>
                        <FiArrowLeft />
                    </button>
                    <h1>Videos</h1>
                </div>

                <button className="admin-add-video-btn">
                    <FiPlus />
                    Add New
                </button>
            </div>

            <div className="admin-videos-grid">
                {videos.map((video, index) => (
                    <div className={`fade-up fade-up-delay-${(index % 6) + 1}`} key={video.id}>
                        <div className="admin-video-card">
                            <div className="admin-video-thumb-wrap">
                                <img
                                    src={video.thumbnail}
                                    alt={video.title}
                                    className="admin-video-thumb"
                                />

                                <div className="admin-video-actions">
                                    <button className="admin-video-edit-btn">
                                        <FiEdit2 />
                                    </button>
                                    <button className="admin-video-delete-btn">
                                        <FiTrash2 />
                                    </button>
                                </div>

                                <span className="admin-video-duration">{video.duration}</span>
                            </div>

                            <div className="admin-video-content">
                                <h3 className="admin-video-card-title">{video.title}</h3>
                                <p className="admin-video-card-text">{video.description}</p>

                                <div className="admin-video-btn-wrap">
                                    <span className={`admin-video-platform-btn ${video.platform.toLowerCase()}`}>
                                        {video.platform === 'YouTube' ? (
                                            <FaYoutube className="admin-video-icon" />
                                        ) : (
                                            <FaFacebook className="admin-video-icon" />
                                        )}
                                        <span>{video.platform}</span>
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}

export default AdminVideos;