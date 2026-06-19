import { FiMenu } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import '../../css/AdminHeader.css';

function AdminHeader({ sidebarOpen, setIsOpen }) {
    const navigate = useNavigate();

    return (
        <header className="admin-header">
            <button
                className="admin-menu-btn"
                onClick={() => setIsOpen(!sidebarOpen)}
            >
                <FiMenu />
            </button>

            <h2>Welcome Admin</h2>

            <div className="admin-header-actions">
                <button onClick={() => navigate('/')}>Home</button>
                <button onClick={() => navigate('/')}>Logout</button>
            </div>
        </header>
    );
}

export default AdminHeader;