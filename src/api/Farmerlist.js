// src/api/Farmerlist.js
import apiClient from "./apiClient";

/* ------------------------------------------------------------------
   🌾 FARMER LISTING MANAGEMENT
------------------------------------------------------------------ */

// ✅ Add a new farmer listing
export const addFarmerListing = async (formData) => {
  const data = new FormData();

  for (const [key, value] of Object.entries(formData)) {
    if (key !== "photos") data.append(key, value);
  }

  // Image upload logic
  const firstPhoto = formData.photos?.find((p) => p.file);
  if (firstPhoto) data.append("image", firstPhoto.file);

  const firstUrl = formData.photos?.find((p) => typeof p === "string");
  if (firstUrl) data.append("imageUrl", firstUrl);
  // console.log(localStorage.getItem("token"))
  const response = await apiClient.post("/farmer/add", data, {
    
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    
  });
  return response.data;
};

// ✅ Get all listings of the logged-in farmer
export const getMyListings = async () => {
  const res = await apiClient.get("/farmer/my-listings", {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
  return res.data;
};

// ✅ Update a listing
export const updateFarmerListing = async (id, formData) => {
  const data = new FormData();
  for (const [key, value] of Object.entries(formData)) {
    if (key !== "photos") data.append(key, value);
  }

  const firstPhoto = formData.photos?.find((p) => p.file);
  if (firstPhoto) data.append("image", firstPhoto.file);

  const response = await apiClient.put(`/farmer/update/${id}`, data, {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
  return response.data;
};

// ✅ Delete a listing
export const deleteFarmerListing = async (id) => {
  const res = await apiClient.delete(`/farmer/${id}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
  return res.data;
};

/* ------------------------------------------------------------------
   💬 FARMER OFFER MANAGEMENT
------------------------------------------------------------------ */

// ✅ Get all offers received for this farmer’s listings
export const getFarmerOffers = async () => {
  const res = await apiClient.get("/offers/farmer", {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
  return res.data;
};

// ✅ Accept an offer
export const acceptOffer = async (id) => {
  const res = await apiClient.patch(`/offers/${id}/accept`, {}, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
  
  return res.data;
};

// ✅ Reject an offer
export const rejectOffer = async (id) => {
  const res = await apiClient.patch(`/offers/${id}/reject`, {}, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
  return res.data;
};

// ✅ Send a counter offer
export const counterOffer = async (id, payload) => {
  const res = await apiClient.patch(`/offers/${id}/counter`, payload, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
  return res.data;
};

// ✅ Get all farmer orders (accepted offers)
// export const getFarmerOrders = async () => {
//   const res = await apiClient.get("/farmer/orders", {
//     headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
//   });
//   return res.data;
// };

// // ✅ Assign driver to an order
// export const assignDriverToOrder = async (orderId, payload) => {
//   const res = await apiClient.patch(`/farmer/orders/${orderId}/assign-driver`, payload, {
//     headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
//   });
//   return res.data;
// };
