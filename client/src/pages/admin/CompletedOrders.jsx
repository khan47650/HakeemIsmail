import { FiArrowLeft } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import '../../css/CompletedOrders.css';

function CompletedOrders() {
    const navigate = useNavigate();

    const orders = [
        { id: 1, userName: 'Ali Khan', productName: 'Herbal Medicine', date: '03/12/2026' },
        { id: 2, userName: 'Ahmed Raza', productName: 'Health Package', date: '03/13/2026' },
        { id: 3, userName: 'Sara Ahmed', productName: 'Natural Oil', date: '04/26/2026' },
        { id: 4, userName: 'Admin', productName: 'Herbal Tea', date: '05/01/2026' },
    ];

    return (
        <div className="completed-orders-page">
            <div className="completed-orders-top">
                <button className="completed-back-btn" onClick={() => navigate(-1)}>
                    <FiArrowLeft />
                </button>
                <h1>Completed Orders</h1>
            </div>

            <div className="completed-orders-card">
                <table className="completed-orders-table">
                    <thead>
                        <tr>
                            <th>User Name</th>
                            <th>Product Name</th>
                            <th>Date</th>
                            <th>Action</th>
                        </tr>
                    </thead>

                    <tbody>
                        {orders.map((order) => (
                            <tr key={order.id}>
                                <td>{order.userName}</td>
                                <td>{order.productName}</td>
                                <td>{order.date}</td>
                                <td>
                                    <div className="completed-actions">
                                        <button className="completed-delete-btn">
                                            Delete
                                        </button>
                                        <button className="completed-details-btn">
                                            View Details
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default CompletedOrders;