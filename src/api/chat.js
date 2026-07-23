import apiClient from "./apiClient";

export const getChatUsers = async (role) => {
  const res = await apiClient.get("/chats/users", { params: { role } });
  return res.data;
};

export const createOrGetChat = async (participantId, participantRole) => {
  const res = await apiClient.post("/chats/create", { participantId, participantRole });
  return res.data;
};

export const getUserChats = async () => {
  const res = await apiClient.get("/chats/my");
  return res.data;
};

export const getChatMessages = async (chatId) => {
  const res = await apiClient.get(`/chats/${chatId}/messages`);
  return res.data;
};

export const sendChatMessage = async (payload) => {
  const res = await apiClient.post("/chats/send", payload);
  return res.data;
};

export const markChatAsRead = async (chatId) => {
  const res = await apiClient.patch(`/chats/${chatId}/read`);
  return res.data;
};
