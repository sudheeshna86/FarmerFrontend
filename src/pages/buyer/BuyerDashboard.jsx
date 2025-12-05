import React from 'react';
import { Package, Heart, DollarSign, TrendingUp, Search, CheckCircle, ShoppingCart } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';

export default function BuyerDashboard() {
  const kpis = [
    { label: 'Orders in Progress', value: 6, icon: Package, color: 'text-primary', bg: 'bg-light' },
    { label: 'Saved Suppliers', value: 14, icon: Heart, color: 'text-danger', bg: 'bg-light' },
    { label: 'Monthly Spend', value: '₹1.2L', icon: DollarSign, color: 'text-success', bg: 'bg-light' },
    { label: 'Savings This Month', value: '18%', icon: TrendingUp, color: 'text-warning', bg: 'bg-light' },
  ];

  const savedSuppliers = [
    { id: 1, name: 'Green Valley Farms', location: 'Karnataka', rating: 4.8, verified: true, specialties: ['Organic Vegetables', 'Leafy Greens'], lastOrder: '3 days ago' },
    { id: 2, name: 'Sunrise Agriculture', location: 'Maharashtra', rating: 4.9, verified: true, specialties: ['Fruits', 'Seasonal Produce'], lastOrder: '1 week ago' },
    { id: 3, name: 'Fresh Fields Co-op', location: 'Punjab', rating: 4.7, verified: true, specialties: ['Grains', 'Pulses'], lastOrder: '2 weeks ago' },
  ];

  const recommendedSuppliers = [
    { id: 4, name: 'Organic Earth Farmers', location: 'Tamil Nadu', rating: 4.9, verified: true, match: 95, reason: 'Specializes in products you frequently order' },
    { id: 5, name: 'Highland Produce', location: 'Himachal Pradesh', rating: 4.6, verified: true, match: 88, reason: 'Offers competitive pricing on seasonal items' },
  ];

  const recentOrders = [
    { id: 1, item: 'Organic Tomatoes', supplier: 'Green Valley Farms', status: 'in_transit', date: 'Oct 22' },
    { id: 2, item: 'Fresh Carrots', supplier: 'Sunrise Agriculture', status: 'delivered', date: 'Oct 20' },
    { id: 3, item: 'Potatoes', supplier: 'Green Valley Farms', status: 'processing', date: 'Oct 21' },
  ];

  return (
    <div className="container my-5">
      <div className="mb-4">
        <h1 className="fw-bold fs-3 text-dark">Welcome, John Doe!</h1>
        <p className="text-muted">Manage your procurement and discover quality suppliers</p>
      </div>
      <div className="row g-4 mb-4">
        {kpis.map((kpi, i) => (
          <div className="col-md-6 col-lg-3" key={i}>
            <Card hover>
              <div className="p-4">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <div className={`d-flex align-items-center justify-content-center rounded-3 ${kpi.bg}`} style={{ width: '50px', height: '50px' }}>
                    <kpi.icon className={kpi.color} size={24} />
                  </div>
                  <h3 className="fw-bold">{kpi.value}</h3>
                </div>
                <p className="text-secondary small mb-0">{kpi.label}</p>
              </div>
            </Card>
          </div>
        ))}
      </div>
      <Card className="mb-4">
        <div className="p-4 d-flex align-items-center gap-3">
          <Search className="text-muted" size={22} />
          <input type="text" placeholder="Search for produce, suppliers, or locations..." className="form-control flex-grow-1" />
          <Button>Search</Button>
        </div>
      </Card>
      <div className="row g-4 mb-4">
        <div className="col-lg-6">
          <Card>
            <div className="p-4">
              <h4 className="fw-bold mb-3">Recommended Suppliers</h4>
              {recommendedSuppliers.map((s) => (
                <div key={s.id} className="p-3 mb-3 bg-light border rounded">
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <div>
                      <h5 className="mb-0 fw-bold">{s.name}</h5>
                      <small className="text-muted">{s.location}</small>
                    </div>
                    <Badge variant="success">{s.match}% match</Badge>
                  </div>
                  <p className="text-success small mb-2">{s.reason}</p>
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <span className="text-warning fw-semibold">★ {s.rating}</span>
                      {s.verified && <Badge variant="info" size="sm">Verified</Badge>}
                    </div>
                    <Button size="sm" variant="outline">View Profile</Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
        <div className="col-lg-6">
          <Card>
            <div className="p-4">
              <h4 className="fw-bold mb-3">Saved Suppliers</h4>
              {savedSuppliers.map((s) => (
                <div key={s.id} className="p-3 mb-3 border rounded">
                  <div className="d-flex justify-content-between mb-2">
                    <div>
                      <h5 className="fw-bold mb-0">{s.name}</h5>
                      <small className="text-muted">{s.location}</small>
                    </div>
                    <span className="text-warning fw-semibold">★ {s.rating}</span>
                  </div>
                  <div className="mb-2">
                    {s.specialties.map((spec, idx) => (
                      <Badge key={idx} size="sm" className="me-1">{spec}</Badge>
                    ))}
                  </div>
                  <div className="d-flex justify-content-between small text-muted">
                    <span>Last order: {s.lastOrder}</span>
                    <Button size="sm" variant="outline">View Listings</Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
      <Card>
        <div className="p-4">
          <h4 className="fw-bold mb-3">Recent Orders</h4>
          {recentOrders.map((order) => (
            <div key={order.id} className="d-flex justify-content-between align-items-center py-2 border-bottom">
              <div>
                <strong>{order.item}</strong>
                <div className="small text-muted">{order.supplier} • {order.date}</div>
              </div>
              <div className="d-flex align-items-center gap-2">
                <Badge
                  variant={
                    order.status === 'delivered' ? 'success' :
                    order.status === 'in_transit' ? 'info' :
                    'warning'
                  }
                >
                  {order.status.replace('_', ' ')}
                </Badge>
                <Button size="sm" variant="outline">Track</Button>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
