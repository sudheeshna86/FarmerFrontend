import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  User,
  MapPin,
  Briefcase,
  Trash2,
  Plus,
  Edit2,
} from "lucide-react";
import apiClient from "../../api/apiClient";

export default function DriverProfile() {
  const [activeTab, setActiveTab] = useState("profile");
  const [loading, setLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(true);

  // --- USER INFO STATE ---
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    phone: "",
    gender: "male",
    vehicleNumber: "",
    licenseNumber: "",
  });

  // --- ADDRESS STATES ---
  const [addresses, setAddresses] = useState([]);
  const [mainAddress, setMainAddress] = useState("");

  // --- ADDRESS FORM ---
  const [showAddAddress, setShowAddAddress] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState(null);
  const [newAddress, setNewAddress] = useState({
    name: "",
    phone: "",
    addressLine: "",
    locality: "",
    city: "",
    state: "",
    pincode: "",
    area: "",
    type: "Home",
  });

  // ============================================================
  // 1️⃣ GET DRIVER PROFILE DETAILS
  // ============================================================
  useEffect(() => {
    fetchDriverProfile();
  }, []);

  const fetchDriverProfile = async () => {
    try {
      const res = await apiClient.get("/users/profile");
      const {
        name,
        email,
        phone,
        gender,
        vehicleNumber,
        licenseNumber,
        alladdress,
        address,
      } = res.data;

      setProfileData({
        name,
        email,
        phone,
        gender: gender || "male",
        vehicleNumber: vehicleNumber || "",
        licenseNumber: licenseNumber || "",
      });

      setAddresses(alladdress || []);
      setMainAddress(address || "");
    } catch (error) {
      console.error("Profile fetch error:", error);
    } finally {
      setDataLoading(false);
    }
  };

  // ============================================================
  // 2️⃣ SAVE PROFILE INFO
  // ============================================================
  const saveProfile = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await apiClient.put("/users/profile", {
        ...profileData,
      });

      alert("Profile updated successfully!");
    } catch (error) {
      alert(
        error.response?.data?.message || "Failed to update profile"
      );
    } finally {
      setLoading(false);
    }
  };

  // ============================================================
  // 3️⃣ SAVE / UPDATE ADDRESS
  // ============================================================
  const handleAddressSubmit = async (e) => {
    e.preventDefault();

    if (!newAddress.addressLine || !newAddress.city || !newAddress.pincode) {
      return alert("Address Line, City, and Pincode are required!");
    }

    try {
      let res;

      if (editingAddressId) {
        res = await apiClient.put(
          `/users/address/${editingAddressId}`,
          newAddress
        );
        alert("Address updated!");
      } else {
        res = await apiClient.post("/users/address", newAddress);
        alert("New address added!");
      }

      setAddresses(res.data.alladdress);
      setMainAddress(res.data.mainAddress || "");

      setShowAddAddress(false);
      setEditingAddressId(null);

      setNewAddress({
        name: profileData.name,
        phone: profileData.phone,
        addressLine: "",
        locality: "",
        city: "",
        state: "",
        pincode: "",
        area: "",
        type: "Home",
      });
    } catch (error) {
      alert("Failed to save address");
    }
  };

  // ============================================================
  // 4️⃣ EDITING ADDRESS
  // ============================================================
  const handleEditClick = (addr) => {
    const id = addr._id || addr.id;

    setNewAddress({
      name: addr.name,
      phone: addr.phone,
      addressLine: addr.addressLine,
      locality: addr.locality,
      city: addr.city,
      state: addr.state,
      pincode: addr.pincode,
      area: addr.area || "",
      type: addr.type,
    });

    setEditingAddressId(id);
    setShowAddAddress(true);
    window.scrollTo(0, 0);
  };

  // ============================================================
  // 5️⃣ DELETE ADDRESS
  // ============================================================
  const handleDeleteClick = async (addrId) => {
    if (!window.confirm("Delete this address?")) return;

    try {
      const res = await apiClient.delete(`/users/address/${addrId}`);
      setAddresses(res.data.alladdress);
      setMainAddress(res.data.mainAddress || "");
    } catch (error) {
      alert("Failed to delete address");
    }
  };

  // ============================================================
  // 6️⃣ SET PRIMARY ADDRESS
  // ============================================================
  const handleSetPrimary = async (addrId) => {
    try {
      const res = await apiClient.put(
        `/users/address/${addrId}/select`
      );
      setAddresses(res.data.alladdress);
      setMainAddress(res.data.mainAddress);
    } catch (error) {
      alert("Failed to set primary");
    }
  };

  // ============================================================
  // 7️⃣ LOCATION AUTO-FILL
  // ============================================================
  const parseAddressString = (displayName) => {
    const parts = displayName.split(",").map((p) => p.trim());
    const pincode =
      /^\d{6}$/.test(parts[parts.length - 2]) && parts[parts.length - 2];

    const state = parts[parts.length - 3];
    const city = parts[parts.length - 4];
    const locality = parts[0];
    const addressLine = parts.slice(0, 2).join(", ");

    return { pincode, state, city, locality, addressLine };
  };

  const handleUseMyLocation = () => {
    if (!navigator.geolocation) return alert("Geolocation unsupported");

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;

        try {
          const res = await apiClient.get(
            `/auth/location?lat=${lat}&lng=${lng}`
          );

          if (res.data?.address) {
            const parsed = parseAddressString(res.data.address);

            setNewAddress((prev) => ({
              ...prev,
              ...parsed,
            }));

            alert("Location autofilled!");
          }
        } catch (err) {
          alert("Unable to fetch address");
        }
      },
      () => alert("Unable to read location")
    );
  };

  if (dataLoading)
    return <div className="text-center py-5">Loading...</div>;

  // =====================================================================
  // UI START
  // =====================================================================
  return (
    <div className="container-fluid bg-light min-vh-100 py-4">
      <div className="container">
        <div className="row">
          {/* SIDEBAR */}
          <div className="col-md-3 mb-4">
            <div className="card shadow-sm border-0">
              <div className="card-body p-0">
                <div className="p-3 border-bottom d-flex align-items-center gap-3">
                  <div
                    className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center"
                    style={{ width: 50, height: 50 }}
                  >
                    <User size={24} />
                  </div>
                  <div>
                    <div className="small text-muted">Hello,</div>
                    <div
                      className="fw-bold text-truncate"
                      style={{ maxWidth: "150px" }}
                    >
                      {profileData.name}
                    </div>
                  </div>
                </div>

                <div className="list-group list-group-flush">
                  <button
                    className={`list-group-item list-group-item-action border-0 py-3 ${
                      activeTab === "profile"
                        ? "text-primary fw-bold bg-light"
                        : ""
                    }`}
                    onClick={() => setActiveTab("profile")}
                  >
                    <User size={18} className="me-2" /> Profile Information
                  </button>

                  <button
                    className={`list-group-item list-group-item-action border-0 py-3 ${
                      activeTab === "address"
                        ? "text-primary fw-bold bg-light"
                        : ""
                    }`}
                    onClick={() => setActiveTab("address")}
                  >
                    <MapPin size={18} className="me-2" /> Manage Addresses
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* MAIN CONTENT */}
          <div className="col-md-9">
            {/* =======================================================
              PROFILE TAB
            ======================================================= */}
            {activeTab === "profile" && (
              <div className="card shadow-sm border-0">
                <div className="card-header bg-white py-3">
                  <h5 className="mb-0 fw-bold">Driver Information</h5>
                </div>

                <div className="card-body p-4">
                  <form onSubmit={saveProfile}>
                    <div className="row g-3 mb-3">
                      {/* NAME */}
                      <div className="col-md-6">
                        <label className="form-label text-muted small fw-bold">
                          Full Name
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          value={profileData.name}
                          onChange={(e) =>
                            setProfileData({
                              ...profileData,
                              name: e.target.value,
                            })
                          }
                        />
                      </div>

                      {/* PHONE */}
                      <div className="col-md-6">
                        <label className="form-label text-muted small fw-bold">
                          Phone Number
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          value={profileData.phone}
                          onChange={(e) =>
                            setProfileData({
                              ...profileData,
                              phone: e.target.value,
                            })
                          }
                        />
                      </div>
                    </div>

                    {/* GENDER */}
                    <div className="mb-3">
                      <label className="form-label text-muted small fw-bold">
                        Gender
                      </label>
                      <div className="d-flex gap-4">
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="radio"
                            name="gender"
                            value="male"
                            checked={profileData.gender === "male"}
                            onChange={(e) =>
                              setProfileData({
                                ...profileData,
                                gender: e.target.value,
                              })
                            }
                          />
                          <label className="form-check-label">Male</label>
                        </div>

                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="radio"
                            name="gender"
                            value="female"
                            checked={profileData.gender === "female"}
                            onChange={(e) =>
                              setProfileData({
                                ...profileData,
                                gender: e.target.value,
                              })
                            }
                          />
                          <label className="form-check-label">Female</label>
                        </div>
                      </div>
                    </div>

                    {/* EMAIL */}
                    <div className="row g-3 mb-4">
                      <div className="col-md-6">
                        <label className="form-label text-muted small fw-bold">
                          Email Address
                        </label>
                        <input
                          type="email"
                          className="form-control"
                          value={profileData.email}
                          disabled
                        />
                      </div>
                    </div>

                    {/* DRIVER EXTRA FIELDS */}
                    <div className="row g-3 mb-4">
                      <div className="col-md-6">
                        <label className="form-label text-muted small fw-bold">
                          Vehicle Number
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          value={profileData.vehicleNumber}
                          onChange={(e) =>
                            setProfileData({
                              ...profileData,
                              vehicleNumber: e.target.value,
                            })
                          }
                        />
                      </div>

                      <div className="col-md-6">
                        <label className="form-label text-muted small fw-bold">
                          License Number
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          value={profileData.licenseNumber}
                          onChange={(e) =>
                            setProfileData({
                              ...profileData,
                              licenseNumber: e.target.value,
                            })
                          }
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="btn btn-primary px-4 py-2"
                      disabled={loading}
                    >
                      {loading ? "Saving..." : "Save Changes"}
                    </button>
                  </form>
                </div>
              </div>
            )}

            {/* =======================================================
              ADDRESS TAB
            ======================================================= */}
            {activeTab === "address" && (
              <div className="card shadow-sm border-0">
                <div className="card-header bg-white py-3">
                  <h5 className="fw-bold mb-0">Manage Addresses</h5>
                </div>

                <div className="card-body p-4">
                  {/* ADD NEW ADDRESS BUTTON */}
                  {!showAddAddress && (
                    <div
                      className="border rounded p-3 mb-4 d-flex align-items-center text-primary bg-light"
                      style={{ cursor: "pointer" }}
                      onClick={() => {
                        setEditingAddressId(null);
                        setNewAddress({
                          name: profileData.name,
                          phone: profileData.phone,
                          addressLine: "",
                          locality: "",
                          city: "",
                          state: "",
                          pincode: "",
                          area: "",
                          type: "Home",
                        });
                        setShowAddAddress(true);
                      }}
                    >
                      <Plus size={20} className="me-2" />
                      <strong>Add a New Address</strong>
                    </div>
                  )}

                  {/* ADD / EDIT ADDRESS FORM */}
                  {showAddAddress && (
                    <div className="bg-light p-4 rounded border mb-4">
                      <h6 className="text-primary fw-bold mb-3">
                        {editingAddressId
                          ? "Edit Address"
                          : "Add New Address"}
                      </h6>

                      <form onSubmit={handleAddressSubmit}>
                        <div className="row g-3">
                          <div className="col-md-6">
                            <input
                              type="text"
                              className="form-control"
                              placeholder="Pincode"
                              value={newAddress.pincode}
                              onChange={(e) =>
                                setNewAddress({
                                  ...newAddress,
                                  pincode: e.target.value,
                                })
                              }
                              required
                            />
                          </div>

                          <div className="col-md-6">
                            <input
                              type="text"
                              className="form-control"
                              placeholder="Locality"
                              value={newAddress.locality}
                              onChange={(e) =>
                                setNewAddress({
                                  ...newAddress,
                                  locality: e.target.value,
                                })
                              }
                            />
                          </div>
                        </div>

                        <textarea
                          className="form-control my-3"
                          rows="3"
                          placeholder="Address Line"
                          value={newAddress.addressLine}
                          onChange={(e) =>
                            setNewAddress({
                              ...newAddress,
                              addressLine: e.target.value,
                            })
                          }
                          required
                        ></textarea>

                        <div className="row g-3">
                          <div className="col-md-6">
                            <input
                              type="text"
                              className="form-control"
                              placeholder="City"
                              value={newAddress.city}
                              onChange={(e) =>
                                setNewAddress({
                                  ...newAddress,
                                  city: e.target.value,
                                })
                              }
                              required
                            />
                          </div>

                          <div className="col-md-6">
                            <input
                              type="text"
                              className="form-control"
                              placeholder="State"
                              value={newAddress.state}
                              onChange={(e) =>
                                setNewAddress({
                                  ...newAddress,
                                  state: e.target.value,
                                })
                              }
                              required
                            />
                          </div>
                        </div>

                        <button
                          type="button"
                          className="btn btn-outline-success btn-sm mt-3"
                          onClick={handleUseMyLocation}
                        >
                          Use My Location
                        </button>

                        <div className="mt-4 d-flex gap-3">
                          <button
                            type="submit"
                            className="btn btn-primary"
                          >
                            Save
                          </button>

                          <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={() => setShowAddAddress(false)}
                          >
                            Cancel
                          </button>
                        </div>
                      </form>
                    </div>
                  )}

                  {/* SAVED ADDRESS LIST */}
                  {addresses.map((addr) => (
                    <div
                      key={addr._id}
                      className="border rounded p-3 mb-3 bg-white"
                    >
                      <div className="d-flex justify-content-between">
                        <div>
                          <p className="fw-bold mb-1">
                            {addr.name} - {addr.phone}
                          </p>
                          <p className="text-muted small mb-0">
                            {addr.addressLine}, {addr.locality},{" "}
                            {addr.city}, {addr.state} -{" "}
                            <strong>{addr.pincode}</strong>
                          </p>
                        </div>

                        <div className="d-flex gap-2 align-items-center">
                          {addr.isDefault ? (
                            <span className="badge bg-success text-white">
                              Primary
                            </span>
                          ) : (
                            <button
                              className="btn btn-sm btn-outline-success"
                              onClick={() =>
                                handleSetPrimary(addr._id || addr.id)
                              }
                            >
                              Set Primary
                            </button>
                          )}

                          <button
                            className="btn btn-link text-primary p-0"
                            onClick={() => handleEditClick(addr)}
                          >
                            <Edit2 size={18} />
                          </button>

                          <button
                            className="btn btn-link text-danger p-0"
                            onClick={() =>
                              handleDeleteClick(addr._id || addr.id)
                            }
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* CURRENT MAIN ADDRESS */}
                  <div className="mt-4 p-3 bg-light border rounded">
                    <h6 className="fw-bold text-success mb-1">
                      Current Primary Address
                    </h6>
                    <p className="text-muted small mb-0">
                      {mainAddress || "No primary address set"}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
          {/* MAIN END */}
        </div>
      </div>
    </div>
  );
}
