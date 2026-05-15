import React from "react";
import { TrendingUp, AlertTriangle, Lightbulb, Check, X } from "lucide-react";
import { useLanguage } from "../../contexts/LanguageContext";

export default function AIInsights() {
  const { t } = useLanguage();

  const insights = [
    {
      id: "1",
      icon: Lightbulb,
      title: "High Demand Forecast for Leafy Greens",
      description:
        "Market data shows 45% increase in demand for leafy greens next week. Consider planting spinach or lettuce.",
      confidence: 87,
      color: "success",
      action: "Plan Planting",
      data: {
        expectedPrice: "+₹12/kg",
        demandIncrease: "+45%",
        optimalHarvestDate: "Nov 15-20",
      },
    },
    {
      id: "2",
      icon: AlertTriangle,
      title: "Price Drop Alert: Tomatoes",
      description:
        "Tomato prices expected to drop 20% in 3 days due to market surplus. Consider selling current inventory now.",
      confidence: 92,
      color: "warning",
      action: "Review Listings",
      data: {
        currentPrice: "₹45/kg",
        predictedPrice: "₹36/kg",
        timeframe: "3 days",
      },
    },
    {
      id: "3",
      icon: TrendingUp,
      title: "Optimal Harvest Window",
      description:
        "Weather forecast and soil data suggest ideal harvesting conditions Oct 28-30 for your carrot crop.",
      confidence: 94,
      color: "primary",
      action: "Set Reminder",
      data: {
        temperature: "18-22°C",
        rainfall: "Minimal",
        soilMoisture: "Optimal",
      },
    },
    {
      id: "4",
      icon: Lightbulb,
      title: "Certification Opportunity",
      description:
        "Your farming practices qualify for organic certification. This could increase your price by 30-40%.",
      confidence: 78,
      color: "info",
      action: "Learn More",
      data: {
        estimatedIncrease: "+35% price",
        certificationCost: "₹5,000",
        timeToComplete: "4-6 weeks",
      },
    },
  ];

  return (
    <div className="container py-5">
      {/* Header */}
      <div className="mb-4">
        <h1 className="fw-bold fs-3 mb-2">{t("nav.insights")}</h1>
        <p className="text-muted">
          AI-powered recommendations to optimize your farming decisions
        </p>
      </div>

      {/* Insights Score */}
      <div className="card border border-info mb-4 bg-gradient p-4 shadow-sm">
        <div className="d-flex align-items-center gap-3">
          <div className="bg-white rounded-3 p-3 shadow-sm d-flex align-items-center justify-content-center">
            <TrendingUp className="text-success" size={32} />
          </div>
          <div className="flex-grow-1">
            <h5 className="fw-bold mb-1">Your Insights Score</h5>
            <p className="text-muted mb-0">
              Based on market data, weather patterns, and soil conditions
            </p>
          </div>
          <div className="text-end">
            <div className="fw-bold fs-1 text-success">8.7</div>
            <div className="text-muted small">out of 10</div>
          </div>
        </div>
      </div>

      {/* Insights List */}
      <div className="d-flex flex-column gap-3">
        {insights.map((insight) => {
          const IconComp = insight.icon;
          return (
            <div
              key={insight.id}
              className="card shadow-sm border-0 p-4 rounded-4"
            >
              <div className="d-flex align-items-start gap-3">
                <div
                  className={`rounded-3 bg-${insight.color}-subtle p-3 d-flex align-items-center justify-content-center`}
                  style={{ width: "56px", height: "56px" }}
                >
                  <IconComp className={`text-${insight.color}`} size={28} />
                </div>

                <div className="flex-grow-1">
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <div>
                      <h5 className="fw-bold mb-1">{insight.title}</h5>
                      <p className="text-muted mb-0">{insight.description}</p>
                    </div>
                    <span
                      className={`badge bg-${
                        insight.confidence > 85
                          ? "success"
                          : insight.confidence > 70
                          ? "info"
                          : "warning"
                      }`}
                    >
                      {insight.confidence}% confidence
                    </span>
                  </div>

                  <div className="row g-3 bg-light rounded-3 p-3 mb-3">
                    {Object.entries(insight.data).map(([key, val]) => (
                      <div className="col-4" key={key}>
                        <div className="text-muted small text-capitalize">
                          {key.replace(/([A-Z])/g, " $1").trim()}
                        </div>
                        <div className="fw-semibold text-dark">{val}</div>
                      </div>
                    ))}
                  </div>

                  <div className="d-flex gap-2">
                    <button className="btn btn-sm btn-success d-flex align-items-center">
                      <Check size={16} className="me-1" />
                      {insight.action}
                    </button>
                    <button className="btn btn-sm btn-outline-secondary d-flex align-items-center">
                      <X size={16} className="me-1" />
                      Dismiss
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Market Forecast Charts */}
      <div className="card mt-4 p-4 rounded-4 shadow-sm">
        <h5 className="fw-bold mb-3">Market Forecast Charts</h5>
        <div className="row g-3">
          <div className="col-md-6">
            <div className="d-flex flex-column justify-content-center align-items-center rounded-3 bg-success-subtle py-5">
              <TrendingUp className="text-success mb-2" size={48} />
              <div className="fw-semibold text-dark">Price Trends</div>
            </div>
          </div>
          <div className="col-md-6">
            <div className="d-flex flex-column justify-content-center align-items-center rounded-3 bg-primary-subtle py-5">
              <TrendingUp className="text-primary mb-2" size={48} />
              <div className="fw-semibold text-dark">Demand Forecast</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
