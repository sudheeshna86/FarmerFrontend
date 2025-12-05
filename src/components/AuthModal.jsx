import React, { useState } from "react";
import { Sprout, ShoppingBag, Heart } from "lucide-react";
import { Modal } from "./ui/Modal";
import { Input } from "./ui/Input";
import { Button } from "./ui/Button";
import { useAuth } from "../contexts/AuthContext";
import "bootstrap/dist/css/bootstrap.min.css";
import apiClient from "../api/apiClient";
const AuthModal = ({ isOpen, onClose, initialRole = "" }) => {
  const [mode, setMode] = useState("signup");
  const [role, setRole] = useState(initialRole);

  // form state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  // address OR location
  const [addressMode, setAddressMode] = useState("manual"); // "manual" | "gps"
  const [address, setAddress] = useState("");

  const { login, signup } = useAuth();

  // ---------------------- 🔥 GPS GETTER ------------------------
  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      alert("Geo location not supported");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;

        try {
          const response = await apiClient.get(
            
            `/auth/location?lat=${lat}&lng=${lng}`
          );

          const data = await response.data;
          console.log("📌 API Response:", response);

          if (data?.address) {
            setAddress(data.address);
          } else {
            setAddress(`${lat}, ${lng}`);
          }
        } catch (err) {
          console.error("Backend reverse geocode failed:", err);
          setAddress(`${lat}, ${lng}`);
        }
      },
      (err) => {
        console.error("Geolocation failed:", err);
        alert("Unable to read your location");
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const roles = [
    { value: "farmer", label: "Farmer", icon: Sprout, color: "success" },
    { value: "buyer", label: "Buyer", icon: ShoppingBag, color: "primary" },
    { value: "driver", label: "Driver", icon: Heart, color: "danger" },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!role) return;

    try {
      if (mode === "login") {
        await login(email || phone, password, role);
      } else {
        if (!address) return alert("Address required");

        await signup({
          name,
          email,
          phone,
          password,
          role,
          address,
        });
      }

      onClose();
      window.location.href = "/dashboard";
    } catch (err) {
      alert("Authentication failed");
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md">
      <div
        className="mx-auto p-4 shadow-lg bg-white rounded"
        style={{
          maxWidth: "520px",
          animation: "fadeInUp 0.35s ease-out",
        }}
      >
        <h2 className="text-center fw-bold fs-3 mb-4">
          {mode === "login" ? "Login" : "Create Account"}
        </h2>

        <form onSubmit={handleSubmit} className="d-flex flex-column gap-3">

          {/* ROLE */}
          <div>
            <label className="fw-semibold mb-2">Select Role</label>
            <div className="d-flex gap-2">
              {roles.map((r) => {
                const Icon = r.icon;
                return (
                  <button
                    key={r.value}
                    type="button"
                    onClick={() => setRole(r.value)}
                    className={`flex-grow-1 p-3 rounded border role-btn text-center ${
                      role === r.value ? `border-${r.color}` : "border-secondary"
                    }`}
                    style={{
                      transition: "0.25s",
                    }}
                  >
                    <Icon
                      size={20}
                      className={role === r.value ? `text-${r.color}` : "text-muted"}
                    />
                    <div className="mt-1">{r.label}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* SIGNUP FIELDS */}
          {mode === "signup" && (
            <>
              <Input
                label="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />

              <Input
                label="Email (optional)"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <Input
                label="Phone Number"
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />

              {/* ADDRESS OPTION */}
              <div className="border p-3 rounded bg-light">
                <label className="fw-semibold mb-2">Choose Address Type</label>

                <div className="d-flex gap-2 mb-2">
                  <button
                    type="button"
                    className={`w-50 btn ${
                      addressMode === "manual" ? "btn-primary" : "btn-outline-primary"
                    }`}
                    onClick={() => setAddressMode("manual")}
                  >
                    Enter Address
                  </button>

                  <button
                    type="button"
                    className={`w-50 btn ${
                      addressMode === "gps" ? "btn-success" : "btn-outline-success"
                    }`}
                    onClick={() => {
                      setAddressMode("gps");
                      handleGetLocation();
                    }}
                  >
                    Use My Location
                  </button>
                </div>

                {addressMode === "manual" && (
                  <Input
                    label="Full Address"
                    placeholder="Village / Area / Street / House No"
                    value={address}
                    required
                    onChange={(e) => setAddress(e.target.value)}
                  />
                )}

                {addressMode === "gps" && (
                  <div
                    className="mt-3 small p-3"
                    style={{
                      background: "#f7f8fc",
                      border: "1px solid #ddd",
                      borderRadius: "10px",
                      minHeight: "48px",
                    }}
                  >
                    📍 <strong>{address || "Fetching location..."}</strong>
                  </div>
                )}
              </div>
            </>
          )}

          {/* LOGIN */}
          {mode === "login" && (
            <Input
              label="Email or Phone"
              value={email || phone}
              required
              onChange={(e) => {
                const v = e.target.value;
                /^\d+$/.test(v) ? setPhone(v) : setEmail(v);
              }}
            />
          )}

          <Input
            label="Password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <Button type="submit" className="w-100">
            Continue
          </Button>
        </form>

        <div className="text-center mt-3">
          <button
            className="btn btn-link p-0"
            onClick={() => {
              setMode(mode === "login" ? "signup" : "login");
            }}
          >
            {mode === "login" ? "Create an account" : "Already registered? Login"}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default AuthModal;
