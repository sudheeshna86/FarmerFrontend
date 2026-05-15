import React, { useState } from "react";
import {
  FaLeaf,
  FaShoppingBag,
  FaHeart,
  FaArrowRight,
  FaUsers,
  FaChartLine,
  FaAward,
} from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";
import AuthModal from "../components/AuthModal"; // ✅ make sure this path is correct

export default function Landing() {
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState("");

  const openAuth = (role) => {
    setSelectedRole(role);
    setAuthModalOpen(true);
  };

  return (
    <div className="min-vh-100">
      {/* Hero Section */}
      <section className="position-relative bg-light py-5 overflow-hidden">
        {/* Background gradient circles */}
        <div className="position-absolute top-0 start-0 w-100 h-100">
          <div className="position-absolute top-25 start-10 bg-success rounded-circle opacity-25 blur-circle-emerald"></div>
          <div className="position-absolute bottom-0 end-10 bg-primary rounded-circle opacity-25 blur-circle-blue"></div>
        </div>

        <div className="container position-relative text-center">
          <h1 className="display-4 fw-bold text-dark mb-3">
            Connecting Farmers, Buyers & NGOs
          </h1>
          <p className="lead text-secondary mb-5">
            Empowering sustainability through real-time collaboration and smarter food distribution.
          </p>

          <div className="d-flex flex-wrap justify-content-center gap-3 mb-5">
            <button
              className="btn btn-success btn-lg shadow-sm d-flex align-items-center"
              onClick={() => openAuth("farmer")}
            >
              <FaLeaf className="me-2" />
              Join as Farmer
            </button>
            <button
              className="btn btn-primary btn-lg shadow-sm d-flex align-items-center"
              onClick={() => openAuth("buyer")}
            >
              <FaShoppingBag className="me-2" />
              Join as Buyer
            </button>
            <button
              className="btn btn-outline-secondary btn-lg shadow-sm d-flex align-items-center"
              onClick={() => openAuth("driver")}
            >
              <FaHeart className="me-2" />
              Join as Driver
            </button>
          </div>

          {/* Steps */}
          <div className="row g-4 mt-4">
            <div className="col-md-4">
              <div className="card shadow-sm border-0 h-100 hover-lift">
                <div className="card-body text-center">
                  <div className="bg-success bg-opacity-10 rounded p-3 d-inline-block mb-3">
                    <FaUsers size={28} className="text-success" />
                  </div>
                  <h4 className="fw-bold text-dark mb-2">Connect</h4>
                  <p className="text-secondary">
                    Farmers, buyers, and NGOs come together to reduce food waste and increase profits.
                  </p>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card shadow-sm border-0 h-100 hover-lift">
                <div className="card-body text-center">
                  <div className="bg-primary bg-opacity-10 rounded p-3 d-inline-block mb-3">
                    <FaChartLine size={28} className="text-primary" />
                  </div>
                  <h4 className="fw-bold text-dark mb-2">Track</h4>
                  <p className="text-secondary">
                    Real-time tracking of food distribution and sustainability metrics across communities.
                  </p>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card shadow-sm border-0 h-100 hover-lift">
                <div className="card-body text-center">
                  <div className="bg-warning bg-opacity-10 rounded p-3 d-inline-block mb-3">
                    <FaAward size={28} className="text-warning" />
                  </div>
                  <h4 className="fw-bold text-dark mb-2">Reward</h4>
                  <p className="text-secondary">
                    Earn recognition and rewards for sustainable actions and community impact.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Real-Time Impact */}
      <section className="bg-white py-5">
        <div className="container text-center">
          <h2 className="fw-bold display-6 text-dark mb-3">Real-Time Impact</h2>
          <p className="text-secondary mb-5">
            Making a difference, one harvest at a time
          </p>
          <div className="row g-4">
            {[
              { label: "Farmers Connected", value: "12,450+" },
              { label: "Kg Food Saved", value: "2.3M+" },
              { label: "Communities Served", value: "850+" },
              { label: "CO₂ Reduced", value: "450T+" },
            ].map((stat, index) => (
              <div key={index} className="col-6 col-md-3">
                <div className="fw-bold fs-2 text-success mb-2">{stat.value}</div>
                <div className="text-secondary">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-success bg-gradient text-white py-5">
        <div className="container text-center">
          <h2 className="fw-bold display-6 mb-3">Ready to Make an Impact?</h2>
          <p className="lead mb-4">
            Join thousands of farmers, buyers, and organizations creating a sustainable future.
          </p>
          <button
            className="btn btn-light btn-lg text-success fw-bold d-flex align-items-center mx-auto"
            onClick={() => setAuthModalOpen(true)}
          >
            Get Started Today
            <FaArrowRight className="ms-2" />
          </button>
        </div>
      </section>

      {/* ✅ Auth Modal Component */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialRole={selectedRole}
      />
    </div>
  );
}
