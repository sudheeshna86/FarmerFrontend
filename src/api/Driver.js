import apiClient from "./apiClient";

// 🟢 Driver — Available deliveries
export const getAvailableDeliveries = async () => {
  const res = await apiClient.get("/driver/available");
  return res.data;
};

// 🟢 Driver — My accepted deliveries
export const getMyDeliveries = async () => {
  console.log("get")
  const res = await apiClient.get("/driver/my-deliveries");
  return res.data;
};

// 🟢 Driver accepts delivery
export const acceptDelivery = async (orderId) => {
  console.log("accepted",{orderId})
  const res = await apiClient.patch(`/driver/accept/${orderId}`);
  return res.data;
};

// 🟡 Driver declines delivery (NEW)
export const declineDelivery = async (orderId) => {
  const res = await apiClient.patch(`/driver/decline/${orderId}`);
  return res.data;
};
// 🟢 Driver completes delivery
export const completeDelivery = async (orderId) => {
  const res = await apiClient.patch(`/driver/complete/${orderId}`);
  return res.data;
};
