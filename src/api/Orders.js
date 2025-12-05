import apiClient from "./apiClient"; // Axios instance with baseURL & token interceptor

// Buyer - My Orders
export const getMyOrders = async () => {
  const res = await apiClient.get("/orders/my-orders");
  return res.data;
};

// Farmer - My Orders
export const getFarmerOrders = async () => {
  const res = await apiClient.get("/orders/my-farmer-orders");
  return res.data;
};

// Create Order from accepted offer
export const createOrderFromOffer = async (offerId) => {
  const res = await apiClient.post(`/orders/create/${offerId}`);
  return res.data;
};

// Get specific order
export const getOrderById = async (orderId) => {
  const res = await apiClient.get(`/orders/${orderId}`);
  return res.data;
};

// Buyer Payment
export const payForOrder = async (orderId, method = "Online") => {
  const res = await apiClient.patch(`/orders/${orderId}/pay`, { method });
  return res.data;
};

// Get all drivers (farmer)
export const getDrivers = async () => {
  const res = await apiClient.get("/orders/drivers");
  return res.data;
};

/* -----------------------------------------------------
   🚀 MULTI DRIVER INVITE
------------------------------------------------------*/
// export const assignDriver = async (orderId, driverIdsArray) => {
//   console.log("📨 Sending multi-driver assignment:", driverIdsArray);

//   const res = await apiClient.patch(
//     `/orders/${orderId}/assign-driver`,
//     { driverIds: driverIdsArray }   // IMPORTANT 🔥
//   );

//   return res.data;
// };
export const assignDriver = async (orderId, driverIdsArray) => {
  console.log(orderId,driverIdsArray)
  const res = await apiClient.patch(
    `/orders/${orderId}/assign-driver`,
    { driverIds: driverIdsArray }
  );
  return res.data;
};

// Driver verifies OTP
export const verifyDeliveryOTP = async (orderId, otp) => {
  const res = await apiClient.patch(`/orders/${orderId}/verify-otp`, { otp });
  return res.data;
};
export const getReceipt = async (orderId) => {
  const res = await apiClient.get(`/orders/${orderId}/receipt`);
  return res.data;
};

// Release payment to farmer
export const releasePayment = async (orderId) => {
  const res = await apiClient.patch(`/orders/${orderId}/release-payment`);
  return res.data;
};
