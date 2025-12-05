import React from "react";
import { DollarSign } from "lucide-react";
import { Card } from "../../components/ui/Card";

const dummyCompletedOrders = [
  { id: 101, crop: "Tomatoes", buyerName: "GreenMarket Co.", qty: 80, total: 2240, createdAt: "2025-10-15T08:30:00Z" },
  { id: 102, crop: "Mangoes", buyerName: "FreshCart Pvt Ltd", qty: 150, total: 6300, createdAt: "2025-10-12T10:15:00Z" },
  { id: 103, crop: "Wheat", buyerName: "AgroSupplies", qty: 400, total: 8800, createdAt: "2025-10-05T14:00:00Z" },
];

export default function Earnings() {
  const totalEarnings = dummyCompletedOrders.reduce((sum, order) => sum + order.total, 0);

  return (
    <div className="container py-4">
      <h2 className="fw-bold text-success mb-4">Earnings</h2>
      <Card className="d-flex align-items-center bg-light mb-4 p-4 rounded-4 shadow-sm">
        <DollarSign size={48} className="text-success me-3" />
        <div>
          <h3 className="fw-bold">₹{totalEarnings}</h3>
          <p className="text-muted mb-0">Total Earnings</p>
        </div>
      </Card>
      <h4 className="fw-semibold mb-3">Completed Orders</h4>
      <Card>
        <div className="table-responsive">
          <table className="table align-middle border">
            <thead className="table-light">
              <tr>
                <th>Order ID</th>
                <th>Product</th>
                <th>Buyer</th>
                <th>Qty</th>
                <th>Amount</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {dummyCompletedOrders.map(order => (
                <tr key={order.id}>
                  <td>#{order.id}</td>
                  <td>{order.crop}</td>
                  <td>{order.buyerName}</td>
                  <td>{order.qty} kg</td>
                  <td>₹{order.total}</td>
                  <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
