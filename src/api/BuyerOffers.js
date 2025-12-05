// src/api/BuyerOffers.js
import apiClient from "./apiClient";

/* ------------------------------------------------------------------
   🧾 BUYER OFFER MANAGEMENT
------------------------------------------------------------------ */

// ✅ Get all offers made by the logged-in buyer
export const getMyOffers = async () => {
  const res = await apiClient.get("/offers/my", {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
  return res.data;
};

// ✅ Buyer accepts a farmer’s counter offer
export const acceptCounterOffer = async (offerId) => {
  const res = await apiClient.patch(`/offers/${offerId}/buyer-accept`, {}, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
  return res.data;
};

// ✅ Buyer rejects a farmer’s counter offer
export const rejectCounterOffer = async (offerId) => {
  const res = await apiClient.patch(`/offers/${offerId}/buyer-reject`, {}, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
  return res.data;
};
export const getMyOrders = async () => {
  const res = await apiClient.get("/offers/my-orders", {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
  return res.data;
};

// ✅ Delete offer (remove rejected one)
export const deleteOffer = async (offerId) => {
  const res = await apiClient.delete(`/offers/${offerId}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
  return res.data;
};

// ✅ Buyer makes initial offer
export const makeOffer = async (offerData) => {
  // console.log("res")
  const res = await apiClient.post("/buyer/offers", offerData);
  
  return res.data;
};

// ✅ Buyer sends counter offer
// ✅ Buyer sends counter offer (create or update based on listingId)
export const buyerCounterOffer = async ({ listingId, counterOfferPrice, quantity }) => {
  console.log("frontend entered")
  const res = await apiClient.patch("/offers/buyer/counter", {
    listingId,
    counterOfferPrice,
    quantity,
  });
  return res.data;
};
