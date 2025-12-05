// src/api/BuyerList.js
import apiClient from "./apiClient";

/* ------------------------------------------------------------------
   🛒 BUYER MARKETPLACE API
------------------------------------------------------------------ */

// ✅ Fetch all farmer listings (visible to buyers)
export const getAllListings = async () => {
  const response = await apiClient.get("/buyer/listings");
  return response.data;
};

// ✅ Fetch one listing by ID
export const getListingById = async (id) => {
  const response = await apiClient.get(`/buyer/listings/${id}`);
  return response.data;
};

// // ✅ Make an offer to a farmer (buyer only)
// export const makeOffer = async (offerData) => {
//   const response = await apiClient.post("/buyer/offers", offerData, {
//     headers: {
//       Authorization: `Bearer ${localStorage.getItem("token")}`,
//     },
//   });
//   return response.data;
// };
