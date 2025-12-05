import React, { useState, useEffect } from "react";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Modal } from "../../components/ui/Modal";
import { Input } from "../../components/ui/Input";
import { Package, Inbox, ShoppingCart, DollarSign } from "lucide-react";
import { useData } from "../../contexts/DataContext";

export default function FarmerDashboard() {
  const { listings, offers, orders } = useData();
  const [stats, setStats] = useState({
    activeListings: 0,
    pendingOffers: 0,
    activeOrders: 0,
    totalEarnings: 0,
  });

  useEffect(() => {
    setStats({
      activeListings: listings.filter(l => l.status === "active").length,
      pendingOffers: offers.filter(o => o.status === "pending").length,
      activeOrders: orders.filter(o => o.status !== "Delivered" && o.status !== "Completed").length,
      totalEarnings: orders.filter(o => o.status === "Delivered").reduce((sum, o) => sum + o.total, 0),
    });
  }, [listings, offers, orders]);

  return (
    <div className="container py-4">
      {/* FARMER METRICS */}
      <div className="row mb-4">
        <div className="col-md-3">
          <Card className="d-flex flex-column align-items-center gap-2 py-3">
            <Package size={32} />
            <h5 className="mb-1">Active Listings</h5>
            <span className="fs-4 fw-bold text-primary">{stats.activeListings}</span>
          </Card>
        </div>
        <div className="col-md-3">
          <Card className="d-flex flex-column align-items-center gap-2 py-3">
            <Inbox size={32} />
            <h5 className="mb-1">Pending Offers</h5>
            <span className="fs-4 fw-bold text-warning">{stats.pendingOffers}</span>
          </Card>
        </div>
        <div className="col-md-3">
          <Card className="d-flex flex-column align-items-center gap-2 py-3">
            <ShoppingCart size={32} />
            <h5 className="mb-1">Active Orders</h5>
            <span className="fs-4 fw-bold text-success">{stats.activeOrders}</span>
          </Card>
        </div>
        <div className="col-md-3">
          <Card className="d-flex flex-column align-items-center gap-2 py-3">
            <DollarSign size={32} />
            <h5 className="mb-1">Total Earnings</h5>
            <span className="fs-4 fw-bold text-info">₹{stats.totalEarnings}</span>
          </Card>
        </div>
      </div>

      {/* RECENT ORDERS OVERVIEW */}
      <Card className="mb-4">
        <h4 className="fw-semibold mb-3">Recent Orders</h4>
        <div className="table-responsive">
          <table className="table align-middle border">
            <thead className="table-light">
              <tr>
                <th>Buyer</th>
                <th>Product</th>
                <th>Qty</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.slice(0, 5).map(order => (
                <tr key={order.id}>
                  <td>{order.buyerName}</td>
                  <td>{order.crop}</td>
                  <td>{order.qty} kg</td>
                  <td>
                    <span className={`badge bg-${order.status === "Delivered" ? "success" : "warning"}`}>
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* MINI AI INSIGHTS PREVIEW */}
      <Card>
        <h4 className="fw-semibold mb-3">AI Insights</h4>
        <p className="text-secondary">
          Your mango crop yield is expected to increase by 12% next month due to good weather conditions.
        </p>
        <Button size="sm">View Full Insights</Button>
      </Card>
    </div>
  );
}
