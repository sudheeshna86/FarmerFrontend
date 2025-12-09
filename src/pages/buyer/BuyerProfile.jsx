import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { User, MapPin, Briefcase, Trash2, Plus, Edit2, Save } from "lucide-react";
import apiClient from "../../api/apiClient"; // Make sure this path is correct

export default function BuyerProfile() {
  const [activeTab, setActiveTab] = useState("profile");
  const [loading, setLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(true);

  // --- STATE: User Info ---
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    phone: "",
    gender: "male",
    businessType: "Consumer",
  });

  // --- STATE: Addresses ---
  const [addresses, setAddresses] = useState([]); // Stores alladdress array
  const [mainAddress, setMainAddress] = useState(""); // Stores single address string

  // --- STATE: Address Form ---
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
    type: "Home",
  });

  // 1️⃣ INITIAL FETCH
  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const res = await apiClient.get("/users/profile");
      const { name, email, phone, gender, businessType, alladdress, address } = res.data;

      setProfileData({
        name: name || "",
        email: email || "",
        phone: phone || "",
        gender: gender || "male",
        businessType: businessType || "Consumer",
      });

      setAddresses(alladdress || []);
      setMainAddress(address || "");
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setDataLoading(false);
    }
  };

  // 2️⃣ SAVE PERSONAL INFO
  const saveProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await apiClient.put("/users/profile", profileData);
      alert("✅ Profile updated successfully!");
    } catch (error) {
      alert(error.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  // 3️⃣ HANDLE ADDRESS FORM SUBMIT
  const handleAddressSubmit = async (e) => {
    e.preventDefault();
    if (!newAddress.addressLine || !newAddress.city || !newAddress.pincode) {
      alert("Please fill required fields (Address, City, Pincode)");
      return;
    }

    try {
      let res;
      if (editingAddressId) {
        // Update existing
        res = await apiClient.put(`/users/address/${editingAddressId}`, newAddress);
        alert("✅ Address updated!");
      } else {
        // Add new
        res = await apiClient.post("/users/address", newAddress);
        alert("✅ New address added!");
      }

      // Update local state with fresh data from backend
      setAddresses(res.data.alladdress);
      setMainAddress(res.data.address);
      
      // Reset form
      setShowAddAddress(false);
      setEditingAddressId(null);
      setNewAddress({ name: "", phone: "", addressLine: "", locality: "", city: "", state: "", pincode: "", type: "Home" });

    } catch (error) {
      console.error(error);
      alert("Failed to save address");
    }
  };

  // 4️⃣ EDIT ADDRESS CLICK
const handleEditClick = (addr) => {
  const realId = addr._id || addr.id;

  setNewAddress({
    name: addr.name,
    phone: addr.phone,
    addressLine: addr.addressLine,
    locality: addr.locality,
    city: addr.city,
    state: addr.state,
    pincode: addr.pincode,
    type: addr.type
  });

  setEditingAddressId(realId);
  setShowAddAddress(true);
  window.scrollTo(0, 0);
};


  // 5️⃣ DELETE ADDRESS
  const handleDeleteClick = async (addrId) => {
    if (!window.confirm("Are you sure you want to delete this address?")) return;
    try {
      const res = await apiClient.delete(`/users/address/${addrId}`);
      setAddresses(res.data.alladdress);
      setMainAddress(res.data.address);
    } catch (error) {
      alert("Failed to delete address");
    }
  };

  if (dataLoading) return <div className="text-center py-5">Loading Profile...</div>;

  return (
    <div className="container-fluid bg-light min-vh-100 py-4">
      <div className="container">
        <div className="row">
          
          {/* SIDEBAR NAVIGATION */}
          <div className="col-md-3 mb-4">
            <div className="card shadow-sm border-0">
              <div className="card-body p-0">
                <div className="p-3 border-bottom d-flex align-items-center gap-3">
                  <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center" style={{ width: 50, height: 50 }}>
                    <User size={24} />
                  </div>
                  <div>
                    <div className="small text-muted">Hello,</div>
                    <div className="fw-bold text-truncate" style={{maxWidth: '150px'}}>{profileData.name}</div>
                  </div>
                </div>
                <div className="list-group list-group-flush">
                  <button
                    className={`list-group-item list-group-item-action border-0 py-3 ${activeTab === "profile" ? "text-primary fw-bold bg-light" : ""}`}
                    onClick={() => setActiveTab("profile")}
                  >
                    <User size={18} className="me-2" /> Profile Information
                  </button>
                  <button
                    className={`list-group-item list-group-item-action border-0 py-3 ${activeTab === "address" ? "text-primary fw-bold bg-light" : ""}`}
                    onClick={() => setActiveTab("address")}
                  >
                    <MapPin size={18} className="me-2" /> Manage Addresses
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* MAIN CONTENT AREA */}
          <div className="col-md-9">
            
            {/* === TAB 1: PROFILE FORM === */}
            {activeTab === "profile" && (
              <div className="card shadow-sm border-0">
                <div className="card-header bg-white py-3">
                  <h5 className="mb-0 fw-bold">Personal Information</h5>
                </div>
                <div className="card-body p-4">
                  <form onSubmit={saveProfile}>
                    <div className="row g-3 mb-3">
                      <div className="col-md-6">
                        <label className="form-label text-muted small fw-bold">Full Name</label>
                        <input
                          type="text"
                          className="form-control"
                          value={profileData.name}
                          onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                        />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label text-muted small fw-bold">Mobile Number</label>
                        <input
                          type="text"
                          className="form-control"
                          value={profileData.phone}
                          onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                        />
                      </div>
                    </div>

                    <div className="mb-3">
                      <label className="form-label text-muted small fw-bold">Gender</label>
                      <div className="d-flex gap-4">
                        <div className="form-check">
                          <input className="form-check-input" type="radio" name="gender" value="male" 
                            checked={profileData.gender === "male"} 
                            onChange={(e) => setProfileData({...profileData, gender: e.target.value})} 
                          />
                          <label className="form-check-label">Male</label>
                        </div>
                        <div className="form-check">
                          <input className="form-check-input" type="radio" name="gender" value="female" 
                            checked={profileData.gender === "female"} 
                            onChange={(e) => setProfileData({...profileData, gender: e.target.value})} 
                          />
                          <label className="form-check-label">Female</label>
                        </div>
                      </div>
                    </div>

                    <div className="row g-3 mb-3">
                      <div className="col-md-6">
                        <label className="form-label text-muted small fw-bold">Email Address</label>
                        <input type="email" className="form-control" value={profileData.email} disabled />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label text-muted small fw-bold">Business Type</label>
                        <div className="input-group">
                          <span className="input-group-text"><Briefcase size={18}/></span>
                          <select 
                            className="form-select" 
                            value={profileData.businessType} 
                            onChange={(e) => setProfileData({...profileData, businessType: e.target.value})}
                          >
                            <option value="Consumer">Consumer</option>
                            <option value="Retailer">Retailer</option>
                            <option value="Wholesaler">Wholesaler</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    <button type="submit" className="btn btn-primary px-4 py-2" disabled={loading}>
                      {loading ? "Saving..." : "Save Changes"}
                    </button>
                  </form>
                </div>
              </div>
            )}

            {/* === TAB 2: ADDRESS MANAGEMENT === */}
            {activeTab === "address" && (
              <div className="card shadow-sm border-0">
                <div className="card-header bg-white py-3">
                  <h5 className="mb-0 fw-bold">Manage Addresses</h5>
                </div>
                <div className="card-body p-4">
                  
                  {/* BUTTON: Add New Address */}
                  {!showAddAddress && (
                    <div 
                      className="border rounded p-3 mb-4 d-flex align-items-center text-primary cursor-pointer bg-light" 
                      onClick={() => {
                        setEditingAddressId(null);
                        setNewAddress({ name: profileData.name, phone: profileData.phone, addressLine: "", locality: "", city: "", state: "", pincode: "", type: "Home" });
                        setShowAddAddress(true);
                      }}
                    >
                      <Plus size={20} className="me-2" />
                      <strong>ADD A NEW ADDRESS</strong>
                    </div>
                  )}

                  {/* FORM: Add/Edit Address */}
                  {showAddAddress && (
                    <div className="bg-light p-4 rounded mb-4 border">
                      <h6 className="text-primary fw-bold mb-3">{editingAddressId ? "EDIT ADDRESS" : "ADD NEW ADDRESS"}</h6>
                      <form onSubmit={handleAddressSubmit}>
                        
                        <div className="row g-3 mb-3">
                          <div className="col-md-6">
                            <input type="text" className="form-control" placeholder="Pincode" value={newAddress.pincode} onChange={(e)=>setNewAddress({...newAddress, pincode: e.target.value})} required />
                          </div>
                          <div className="col-md-6">
                            <input type="text" className="form-control" placeholder="Locality" value={newAddress.locality} onChange={(e)=>setNewAddress({...newAddress, locality: e.target.value})} />
                          </div>
                        </div>
                        <div className="mb-3">
                          <textarea className="form-control" rows="3" placeholder="Address (Area and Street)" value={newAddress.addressLine} onChange={(e)=>setNewAddress({...newAddress, addressLine: e.target.value})} required></textarea>
                        </div>
                        <div className="row g-3 mb-3">
                          <div className="col-md-6">
                            <input type="text" className="form-control" placeholder="City" value={newAddress.city} onChange={(e)=>setNewAddress({...newAddress, city: e.target.value})} required />
                          </div>
                          <div className="col-md-6">
                            <input type="text" className="form-control" placeholder="State" value={newAddress.state} onChange={(e)=>setNewAddress({...newAddress, state: e.target.value})} required />
                          </div>
                        </div>
                        
                        <div className="mb-3">
                          <label className="text-muted small fw-bold me-3">Address Type:</label>
                          <div className="form-check form-check-inline">
                            <input className="form-check-input" type="radio" name="addrType" value="Home" checked={newAddress.type === "Home"} onChange={(e)=>setNewAddress({...newAddress, type: e.target.value})} />
                            <label className="form-check-label">Home</label>
                          </div>
                          <div className="form-check form-check-inline">
                            <input className="form-check-input" type="radio" name="addrType" value="Work" checked={newAddress.type === "Work"} onChange={(e)=>setNewAddress({...newAddress, type: e.target.value})} />
                            <label className="form-check-label">Work</label>
                          </div>
                        </div>

                        <div className="d-flex gap-2">
                          <button type="submit" className="btn btn-primary px-4">Save</button>
                          <button type="button" className="btn btn-outline-secondary" onClick={() => setShowAddAddress(false)}>Cancel</button>
                        </div>
                      </form>
                    </div>
                  )}

                  {/* LIST: Saved Addresses */}
                  {addresses.map((addr) => (
                    <div key={addr._id} className="border rounded p-3 mb-3 position-relative bg-white">
                      <div className="d-flex justify-content-between">
                        <div>
                          <div className="d-flex align-items-center mb-2">
                            <span className="badge bg-light text-dark border text-uppercase me-2" style={{fontSize: '10px'}}>{addr.type}</span>
                            <span className="fw-bold">{addr.name}</span>
                            <span className="ms-3 fw-bold">{addr.phone}</span>
                          </div>
                          <p className="mb-0 text-muted small">
                            {addr.addressLine}, {addr.locality} <br />
                            {addr.city}, {addr.state} - <span className="fw-bold">{addr.pincode}</span>
                          </p>
                        </div>
                        
                        <div className="d-flex gap-2">
                          <button className="btn btn-link text-primary p-0" onClick={() => handleEditClick(addr)}

 title="Edit">
                            <Edit2 size={18} />
                          </button>
                          <button className="btn btn-link text-danger p-0" onClick={() => handleDeleteClick(addr._id || addr.id)}
 title="Delete">
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* DEFAULT ADDRESS DISPLAY */}
                  <div className="mt-4 p-3 bg-light border rounded">
                    <h6 className="fw-bold text-success mb-1">Current Active Address</h6>
                    <p className="text-muted small mb-0">{mainAddress || "No address set yet"}</p>
                  </div>

                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}