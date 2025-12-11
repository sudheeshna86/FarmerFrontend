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
export const getBuyerDashboardData = async () => {
  try {
    // Logic to go to the specific route
    const response = await apiClient.get("/buyer/dashboard");
    return response.data;
  } catch (error) {
    console.error("Error in getBuyerDashboardData:", error);
    throw error; // Re-throw so the component can handle it if needed
  }
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
