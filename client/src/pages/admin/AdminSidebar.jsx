import {
    FiClock,
    FiCheckCircle,
    FiPackage,
    FiFileText,
    FiBook,
    FiVideo,
    FiMessageSquare,
    FiPlayCircle,
    FiX,
    FiTag
} from 'react-icons/fi';
import { useNavigate, useLocation } from 'react-router-dom';
import '../../css/AdminSidebar.css';

function AdminSidebar({ isOpen, setIsOpen }) {
    const navigate = useNavigate();
    const location = useLocation();

    const tabs = [
        { name: 'Pending Orders', icon: <FiClock />, path: '/admin/pending-orders' },
        { name: 'Completed Orders', icon: <FiCheckCircle />, path: '/admin/completed-orders' },
        { name: 'Products', icon: <FiPackage />, path: '/admin/products' },
        { name: 'Articles', icon: <FiFileText />, path: '/admin/articles' },
        { name: 'Blogs', icon: <FiBook />, path: '/admin/blogs' },
        { name: 'Videos', icon: <FiVideo />, path: '/admin/videos' },
        { name: 'Shorts', icon: <FiPlayCircle />, path: '/admin/shorts' },
        { name: 'Categories', icon: <FiTag />, path: '/admin/categories' },
        { name: 'Messages', icon: <FiMessageSquare />, path: '/admin/messages' },
    ];

    const handleNavigate = (path) => {
        navigate(path);
        setIsOpen(false);
    };

    return (
        <>
            <aside className={`admin-sidebar ${isOpen ? 'active' : ''}`}>
                <div className="admin-sidebar-header">
                    <div className="admin-brand">
                        <img src="/logo-store-2.png" alt="logo" />
                        <h2>HakeemIsmail</h2>
                    </div>

                    <button className="admin-close-btn" onClick={() => setIsOpen(false)}>
                        <FiX />
                    </button>
                </div>

                <nav className="admin-tabs">
                    {tabs.map((tab) => (
                        <button
                            key={tab.name}
                            className={`admin-tab ${location.pathname === tab.path ? 'active' : ''}`}
                            onClick={() => handleNavigate(tab.path)}
                        >
                            <span className="admin-icon">{tab.icon}</span>
                            {tab.name}
                        </button>
                    ))}
                </nav>
            </aside>

            {isOpen && (
                <div
                    className="admin-overlay"
                    onClick={() => setIsOpen(false)}
                />
            )}
        </>
    );
}

export default AdminSidebar;