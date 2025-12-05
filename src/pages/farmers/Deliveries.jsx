import React from "react";
import { Card } from "../../components/ui/Card";

export default function Deliveries() {
  // 🧩 Dummy data directly in this component
  const orders = [
    {
      id: 1,
      listingId: 1,
      farmerId: "farmer1",
      buyerId: "buyer1",
      buyerName: "John Doe",
      crop: "Wheat",
      qty: 50,
      price: 25,
      total: 1250,
      status: "Delivered",
      driverId: 1,
      createdAt: new Date().toISOString(),
    },
    {
      id: 2,
      listingId: 2,
      farmerId: "farmer2",
      buyerId: "buyer2",
      buyerName: "Amit Sharma",
      crop: "Rice",
      qty: 80,
      price: 30,
      total: 2400,
      status: "In Transit",
      driverId: 2,
      createdAt: new Date().toISOString(),
    },
    {
      id: 3,
      listingId: 3,
      farmerId: "farmer3",
      buyerId: "buyer3",
      buyerName: "Priya Verma",
      crop: "Corn",
      qty: 100,
      price: 20,
      total: 2000,
      status: "Awaiting Driver",
      createdAt: new Date().toISOString(),
    },
  ];

  // ✅ Filter only those with assigned driver (deliveries)
  const deliveries = orders.filter((o) => o.driverId);

  return (
    <div className="container py-4">
      <h2 className="fw-bold text-success mb-4">Deliveries</h2>

      <Card>
        <div className="table-responsive">
          <table className="table align-middle border">
            <thead className="table-light">
              <tr>
                <th>Order ID</th>
                <th>Product</th>
                <th>Buyer</th>
                <th>Qty</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {deliveries.map((order) => (
                <tr key={order.id}>
                  <td>#{order.id}</td>
                  <td>{order.crop}</td>
                  <td>{order.buyerName}</td>
                  <td>{order.qty} kg</td>
                  <td>
                    <span
                      className={`badge bg-${
                        order.status === "Delivered" ? "success" : "warning"
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>
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
