import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from '../pages/admin/AdminSidebar'
import AdminHeader from '../pages/admin/AdminHeader';
import '../css/AdminPanel.css';

function AdminPanel() {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="admin-layout">
            <AdminSidebar
                isOpen={sidebarOpen}
                setIsOpen={setSidebarOpen}
            />

            <div className="admin-content">
                <AdminHeader
                    sidebarOpen={sidebarOpen}
                    setIsOpen={setSidebarOpen}
                />

                <main className="admin-main">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}

export default AdminPanel;