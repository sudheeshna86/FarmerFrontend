import React from 'react';
import { DollarSign } from 'lucide-react';

export default function DriverEarnings() {
  // Dummy data
  const completedDeliveries = [
    { id: 1, crop: 'Organic Tomatoes', createdAt: new Date().toISOString() },
    { id: 2, crop: 'Wheat', createdAt: new Date().toISOString() },
  ];
  const totalEarnings = completedDeliveries.length * 500;

  return (
    <div>
      <h2>Earnings</h2>
      <div className="metric-card large">
        <DollarSign size={48} />
        <div>
          <h3>₹{totalEarnings}</h3>
          <p>Total Earnings</p>
        </div>
      </div>
      <h3 className="mt-4">Completed Deliveries</h3>
      <div className="table-responsive">
        <table className="table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Product</th>
              <th>Distance</th>
              <th>Earnings</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {completedDeliveries.map(order => (
              <tr key={order.id}>
                <td>#{order.id}</td>
                <td>{order.crop}</td>
                <td>~25 km</td>
                <td>₹500</td>
                <td>{new Date(order.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
