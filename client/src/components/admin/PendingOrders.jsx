import { FiArrowLeft } from 'react-icons/fi';
import '../../css/PendingOrders.css';

function PendingOrders() {
    const orders = [
        { id: 1, userName: 'Ali Khan', productName: 'Herbal Medicine', date: '03/12/2026' },
        { id: 2, userName: 'Ahmed Raza', productName: 'Health Package', date: '03/13/2026' },
        { id: 3, userName: 'Sara Ahmed', productName: 'Natural Oil', date: '04/26/2026' },
        { id: 4, userName: 'Admin', productName: 'Herbal Tea', date: '05/01/2026' },
    ];

    return (
        <div className="pending-orders-page">
            <div className="pending-orders-header">
                <FiArrowLeft className="pending-back-icon" />
                <h1>Pending Orders</h1>
            </div>

            <div className="pending-orders-card">
                <table className="pending-orders-table">
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
                                    <div className="pending-actions">
                                        <button className="cancel-btn">Cancel</button>
                                        <button className="details-btn">View Details</button>
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

export default PendingOrders;