import React from "react";
import { FaArrowUp, FaTint, FaWind, FaAward, FaUsers, FaChartBar } from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";


export default function Sustainability() {
  const globalMetrics = [
    { label: "Kg Saved", value: "2.3M", icon: <FaArrowUp />, color: "text-success", trend: "+23%" },
    { label: "Water Saved", value: "450K", icon: <FaTint />, color: "text-primary", trend: "+18%" },
    { label: "CO₂ Reduced", value: "450T", icon: <FaWind />, color: "text-secondary", trend: "+31%" },
    { label: "Communities Served", value: "850+", icon: <FaUsers />, color: "text-warning", trend: "+45%" },
  ];

  const topContributors = [
    { rank: 1, name: "Green Valley Farms", location: "Karnataka", impact: 24500, badge: "gold" },
    { rank: 2, name: "Sunrise Agriculture", location: "Maharashtra", impact: 21300, badge: "silver" },
    { rank: 3, name: "Fresh Fields Co-op", location: "Punjab", impact: 18900, badge: "bronze" },
    { rank: 4, name: "Organic Earth Farmers", location: "Tamil Nadu", impact: 16200, badge: "none" },
    { rank: 5, name: "Highland Produce", location: "Himachal Pradesh", impact: 14800, badge: "none" },
    { rank: 6, name: "Valley Fresh Farms", location: "Gujarat", impact: 13400, badge: "none" },
    { rank: 7, name: "Eco Harvest Co.", location: "Rajasthan", impact: 12100, badge: "none" },
    { rank: 8, name: "Nature's Bounty Farm", location: "Kerala", impact: 10900, badge: "none" },
  ];

  const monthlyData = [
    { month: "Apr", foodSaved: 180, water: 35 },
    { month: "May", foodSaved: 195, water: 38 },
    { month: "Jun", foodSaved: 210, water: 42 },
    { month: "Jul", foodSaved: 225, water: 45 },
    { month: "Aug", foodSaved: 240, water: 48 },
    { month: "Sep", foodSaved: 255, water: 51 },
    { month: "Oct", foodSaved: 270, water: 54 },
  ];

  return (
    <div className="container py-5">
      <div className="mb-4">
        <h1 className="fw-bold text-dark mb-2">Sustainability Dashboard</h1>
        <p className="text-muted">Track our collective environmental impact and contributions</p>
      </div>

      {/* Global Metrics */}
      <div className="row g-4 mb-5">
        {globalMetrics.map((metric, i) => (
          <div className="col-12 col-md-6 col-lg-3" key={i}>
            <div className="card shadow-sm border-0 h-100">
              <div className="card-body text-center">
                <div className={`display-6 mb-3 ${metric.color}`}>{metric.icon}</div>
                <h2 className="fw-bold text-dark">{metric.value}</h2>
                <p className="text-muted">{metric.label}</p>
                <span className="badge bg-success">{metric.trend}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Monthly Trends + Top Contributors */}
      <div className="row g-4 mb-4">
        {/* Monthly Trends */}
        <div className="col-lg-6">
          <div className="card shadow-sm border-0">
            <div className="card-body">
              <h5 className="fw-bold mb-3 d-flex align-items-center">
                <FaChartBar className="me-2 text-success" /> Monthly Impact Trends
              </h5>

              <div className="mb-4">
                <div className="d-flex justify-content-between mb-2">
                  <span className="text-muted">Food Saved (tons)</span>
                  <strong className="text-success">270T this month</strong>
                </div>
                <div className="d-flex align-items-end" style={{ height: "150px" }}>
                  {monthlyData.map((data, i) => (
                    <div key={i} className="flex-fill text-center mx-1">
                      <div
                        className="bg-success rounded-top"
                        style={{
                          height: `${(data.foodSaved / 300) * 100}%`,
                          transition: "0.3s",
                        }}
                      ></div>
                      <small className="text-muted d-block mt-1">{data.month}</small>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <div className="d-flex justify-content-between mb-2">
                  <span className="text-muted">Water Saved (M Liters)</span>
                  <strong className="text-primary">54M this month</strong>
                </div>
                <div className="d-flex align-items-end" style={{ height: "120px" }}>
                  {monthlyData.map((data, i) => (
                    <div key={i} className="flex-fill text-center mx-1">
                      <div
                        className="bg-primary rounded-top"
                        style={{
                          height: `${(data.water / 60) * 100}%`,
                          transition: "0.3s",
                        }}
                      ></div>
                      <small className="text-muted d-block mt-1">{data.month}</small>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Top Contributors */}
        <div className="col-lg-6">
          <div className="card shadow-sm border-0">
            <div className="card-body">
              <h5 className="fw-bold mb-3 d-flex align-items-center">
                <FaAward className="me-2 text-warning" /> Top Contributors
              </h5>
              {topContributors.map((contributor) => (
                <div
                  key={contributor.rank}
                  className={`p-3 mb-3 rounded ${
                    contributor.rank <= 3 ? "bg-warning bg-opacity-10 border border-warning" : "bg-light"
                  }`}
                >
                  <div className="d-flex align-items-center">
                    <div
                      className={`rounded-circle d-flex align-items-center justify-content-center fw-bold text-white me-3`}
                      style={{
                        width: "40px",
                        height: "40px",
                        background:
                          contributor.rank === 1
                            ? "#f1b400"
                            : contributor.rank === 2
                            ? "#c0c0c0"
                            : contributor.rank === 3
                            ? "#cd7f32"
                            : "#adb5bd",
                      }}
                    >
                      {contributor.rank}
                    </div>
                    <div className="flex-grow-1">
                      <strong>{contributor.name}</strong>
                      <div className="text-muted small">{contributor.location}</div>
                    </div>
                    <div className="text-end">
                      <strong className="text-success">{contributor.impact} kg</strong>
                      <div className="text-muted small">saved</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Impact Calculator */}
      <div className="card shadow-sm border-0">
        <div className="card-body">
          <h5 className="fw-bold mb-4">Impact Calculator</h5>
          <div className="row g-4">
            <div className="col-md-4">
              <div className="p-4 bg-success bg-opacity-10 rounded text-center">
                <p className="text-muted mb-1">1 kg food saved equals</p>
                <h3 className="text-success fw-bold">2.5 meals</h3>
                <small className="text-muted">served to people in need</small>
              </div>
            </div>
            <div className="col-md-4">
              <div className="p-4 bg-primary bg-opacity-10 rounded text-center">
                <p className="text-muted mb-1">1 kg food saved equals</p>
                <h3 className="text-primary fw-bold">195 liters</h3>
                <small className="text-muted">of water conserved</small>
              </div>
            </div>
            <div className="col-md-4">
              <div className="p-4 bg-secondary bg-opacity-10 rounded text-center">
                <p className="text-muted mb-1">1 kg food saved equals</p>
                <h3 className="text-secondary fw-bold">2.1 kg</h3>
                <small className="text-muted">of CO₂ emissions prevented</small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
