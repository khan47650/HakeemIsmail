import { FiArrowLeft, FiPlus, FiEdit2, FiTrash2 } from 'react-icons/fi';
import { FaYoutube, FaFacebook } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import '../../css/AdminShorts.css';

function AdminShorts() {
    const navigate = useNavigate();

    const shorts = [
        { id: 1, title: 'Powerful Herbal Tips for Daily Life', thumbnail: '/short-1.jpeg', duration: '0:42', url: 'https://www.youtube.com/shorts/your-short-id-1' },
        { id: 2, title: 'Natural Honey Benefits You Should Know', thumbnail: '/short-2.jpeg', duration: '0:35', url: 'https://www.youtube.com/shorts/your-short-id-2' },
        { id: 3, title: 'Black Seed Routine Guide', thumbnail: '/short-3.jpeg', duration: '0:51', url: 'https://www.facebook.com/reel/your-reel-id-1' },
        { id: 4, title: 'Quick Organic Lifestyle Tips', thumbnail: '/short-4.jpeg', duration: '0:29', url: 'https://www.youtube.com/shorts/your-short-id-3' },
        { id: 5, title: 'Natural Skin Care in Simple Steps', thumbnail: '/short-5.jpeg', duration: '0:47', url: 'https://www.facebook.com/reel/your-reel-id-2' },
        { id: 6, title: 'Simple Home Remedy Short Guide', thumbnail: '/short-6.jpeg', duration: '0:38', url: 'https://www.youtube.com/shorts/your-short-id-4' },
    ];

    const getPlatform = (url) => url.includes('facebook') ? 'facebook' : 'youtube';

    return (
        <section className="admin-shorts-page page-fade-up">
            <div className="admin-shorts-top">
                <div className="admin-shorts-title-wrap">
                    <button className="admin-shorts-back-btn" onClick={() => navigate(-1)}>
                        <FiArrowLeft />
                    </button>
                    <h1>Shorts</h1>
                </div>

                <button className="admin-add-short-btn">
                    <FiPlus />
                    Add New
                </button>
            </div>

            <div className="admin-shorts-grid">
                {shorts.map((short, index) => {
                    const platform = getPlatform(short.url);

                    return (
                        <div className={`fade-up fade-up-delay-${(index % 6) + 1}`} key={short.id}>
                            <div className="admin-short-card">
                                <img src={short.thumbnail} alt={short.title} className="admin-short-thumb" />

                                <div className="admin-short-overlay"></div>

                                <div className="admin-short-actions">
                                    <button className="admin-short-edit-btn">
                                        <FiEdit2 />
                                    </button>
                                    <button className="admin-short-delete-btn">
                                        <FiTrash2 />
                                    </button>
                                </div>

                                <span className="admin-short-duration">{short.duration}</span>

                                <div className="admin-short-content">
                                    <h3 className="admin-short-title">{short.title}</h3>

                                    <div className="admin-short-btn-wrap">
                                        <span className={`admin-short-platform-btn ${platform}`}>
                                            {platform === 'youtube' ? (
                                                <FaYoutube className="admin-short-platform-icon" />
                                            ) : (
                                                <FaFacebook className="admin-short-platform-icon" />
                                            )}
                                            <span>{platform === 'youtube' ? 'YouTube' : 'Facebook'}</span>
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </section>
    );
}

export default AdminShorts;