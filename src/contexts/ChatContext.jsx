import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { useAuth } from "./AuthContext";
import { useSocket } from "./SocketContext";
import {
  createOrGetChat,
  getChatMessages,
  getChatUsers,
  getUserChats,
  markChatAsRead,
  sendChatMessage,
} from "../api/chat";

const ChatContext = createContext(null);

export const ChatProvider = ({ children }) => {
  const { user } = useAuth();
  const { socket, connected } = useSocket();

  const [isOpen, setIsOpen] = useState(false);
  const [conversations, setConversations] = useState([]);
  const [activeChatId, setActiveChatId] = useState(null);
  const [messagesByChatId, setMessagesByChatId] = useState({});
  const [loadingChats, setLoadingChats] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [newChatRole, setNewChatRole] = useState("");
  const [newChatUsers, setNewChatUsers] = useState([]);
  const [selectedNewUser, setSelectedNewUser] = useState("");
  const [onlineUsers, setOnlineUsers] = useState({});
  const [typingUsers, setTypingUsers] = useState({});
  const [isSending, setIsSending] = useState(false);
  const [showNewChat, setShowNewChat] = useState(false);
  const activeChatIdRef = useRef(activeChatId);
  const typingTimersRef = useRef({});

  useEffect(() => {
    activeChatIdRef.current = activeChatId;
  }, [activeChatId]);

  const activeConversation = useMemo(
    () => conversations.find((conversation) => conversation._id === activeChatId) || null,
    [conversations, activeChatId]
  );

  const activeMessages = useMemo(() => {
    if (!activeChatId) return [];
    return messagesByChatId[activeChatId] || [];
  }, [activeChatId, messagesByChatId]);

  const unreadCount = useMemo(
    () => conversations.reduce((total, conversation) => total + (conversation.unreadCount || 0), 0),
    [conversations]
  );

  const filteredConversations = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return conversations;
    return conversations.filter((conversation) => {
      const name = conversation.otherUser?.name || "";
      const lastMessage = conversation.lastMessage || "";
      return name.toLowerCase().includes(term) || lastMessage.toLowerCase().includes(term);
    });
  }, [conversations, searchTerm]);

  const appendMessage = useCallback((message) => {
    if (!message?.chatId) return;

    setMessagesByChatId((prev) => {
      const prevMessages = prev[message.chatId] || [];
      const exists = prevMessages.some(
        (item) => item._id === message._id || (item.tempId && message.tempId && item.tempId === message.tempId)
      );

      if (exists) {
        return {
          ...prev,
          [message.chatId]: prevMessages.map((item) => {
            if (item._id === message._id || (item.tempId && message.tempId && item.tempId === message.tempId)) {
              return { ...item, ...message, status: message.status || item.status };
            }
            return item;
          }),
        };
      }

      return {
        ...prev,
        [message.chatId]: [...prevMessages, message],
      };
    });

    setConversations((prev) => {
      const matched = prev.find((conversation) => conversation._id === message.chatId);
      if (!matched) return prev;

      const isIncoming = Boolean(message.senderId && message.senderId !== user?._id);
      const updatedConversation = {
        ...matched,
        lastMessage: message.message || matched.lastMessage,
        lastMessageTime: message.timestamp || new Date().toISOString(),
        updatedAt: message.timestamp || new Date().toISOString(),
        unreadCount: isIncoming && activeChatIdRef.current !== message.chatId ? (matched.unreadCount || 0) + 1 : matched.unreadCount,
      };

      return [updatedConversation, ...prev.filter((conversation) => conversation._id !== message.chatId)];
    });
  }, [user?._id]);

  const refreshConversations = useCallback(async () => {
    try {
      setLoadingChats(true);
      const data = await getUserChats();
      setConversations(data || []);
    } catch (error) {
      console.error("Failed to load conversations", error);
    } finally {
      setLoadingChats(false);
    }
  }, []);

  useEffect(() => {
    if (!user?._id) return;
    refreshConversations();
  }, [refreshConversations, user?._id]);

  useEffect(() => {
    if (!socket || !user?._id) return;

    const handleNewMessage = (payload) => {
      const message = payload.message || payload;
      if (!message?.chatId) return;

      appendMessage(message);

      if (!document.hasFocus() && message.senderId !== user._id) {
        try {
          if (window.Notification && Notification.permission === "granted") {
            new Notification("New AgriConnect message", {
              body: message.message,
            });
          }
        } catch (error) {
          console.error("Notification failed", error);
        }
      }
    };

    const handlePresence = (payload) => {
      setOnlineUsers((prev) => ({ ...prev, [payload.userId]: payload.online }));
    };

    const handleTyping = (payload) => {
      if (!payload?.chatId || payload.userId === user._id) return;

      setTypingUsers((prev) => ({
        ...prev,
        [payload.chatId]: payload.typing ? payload.userId : null,
      }));

      if (payload.typing) {
        clearTimeout(typingTimersRef.current[payload.chatId]);
        typingTimersRef.current[payload.chatId] = setTimeout(() => {
          setTypingUsers((prev) => ({ ...prev, [payload.chatId]: null }));
        }, 1500);
      }
    };

    socket.on("chat:new-message", handleNewMessage);
    socket.on("chat:presence", handlePresence);
    socket.on("chat:typing", handleTyping);

    socket.emit("chat:connect", { userId: user._id, token: localStorage.getItem("token") });

    return () => {
      socket.off("chat:new-message", handleNewMessage);
      socket.off("chat:presence", handlePresence);
      socket.off("chat:typing", handleTyping);
      Object.values(typingTimersRef.current).forEach((timer) => clearTimeout(timer));
      typingTimersRef.current = {};
    };
  }, [appendMessage, connected, socket, user?._id]);

  useEffect(() => {
    if (!socket || !activeChatId || !user?._id) return;
    socket.emit("chat:join", { chatId: activeChatId, userId: user._id });
  }, [activeChatId, socket, user?._id]);

  const openConversation = useCallback(
    async (conversation) => {
      if (!conversation?._id) return;
      setIsOpen(true);
      setActiveChatId(conversation._id);
      setShowNewChat(false);

      try {
        if (!messagesByChatId[conversation._id]) {
          setLoadingMessages(true);
          const data = await getChatMessages(conversation._id);
          setMessagesByChatId((prev) => ({ ...prev, [conversation._id]: data || [] }));
        }
        await markChatAsRead(conversation._id);
        await refreshConversations();
      } catch (error) {
        console.error("Failed to open conversation", error);
      } finally {
        setLoadingMessages(false);
      }
    },
    [messagesByChatId, refreshConversations]
  );

  const openChatWithUser = useCallback(
    async (participant, role) => {
      if (!participant?._id) return;
      setIsOpen(true);
      setShowNewChat(false);

      try {
        const response = await createOrGetChat(participant._id, role || participant.role);
        const chat = response.chat;
        const conversationData = {
          ...chat,
          otherUser: participant,
          unreadCount: 0,
        };

        setConversations((prev) => {
          const exists = prev.find((conversation) => conversation._id === chat._id);
          if (exists) {
            return prev.map((conversation) =>
              conversation._id === chat._id ? { ...conversation, otherUser: participant } : conversation
            );
          }
          return [conversationData, ...prev];
        });
        setActiveChatId(chat._id);

        if (!messagesByChatId[chat._id]) {
          const data = await getChatMessages(chat._id);
          setMessagesByChatId((prev) => ({ ...prev, [chat._id]: data || [] }));
        }

        await markChatAsRead(chat._id);
        await refreshConversations();
      } catch (error) {
        console.error("Failed to initialize chat", error);
      }
    },
    [messagesByChatId, refreshConversations]
  );

  const sendMessage = useCallback(async (text) => {
    if (!text?.trim() || !activeConversation?.otherUser || !activeChatId) return;

    const trimmed = text.trim();
    const tempId = `temp-${Date.now()}`;
    const optimisticMessage = {
      _id: tempId,
      tempId,
      chatId: activeChatId,
      senderId: user._id,
      senderRole: user.role,
      receiverId: activeConversation.otherUser._id,
      receiverRole: activeConversation.otherUser.role,
      message: trimmed,
      timestamp: new Date().toISOString(),
      status: "sending",
    };

    appendMessage(optimisticMessage);
    setIsSending(true);

    try {
      if (socket?.connected) {
        socket.emit("chat:send", {
          chatId: activeChatId,
          receiverId: activeConversation.otherUser._id,
          receiverRole: activeConversation.otherUser.role,
          senderId: user._id,
          senderRole: user.role,
          message: trimmed,
          tempId,
        });
      } else {
        const response = await sendChatMessage({
          chatId: activeChatId,
          receiverId: activeConversation.otherUser._id,
          receiverRole: activeConversation.otherUser.role,
          message: trimmed,
        });

        const serverMessage = response?.message || response;
        if (serverMessage) {
          appendMessage({
            ...serverMessage,
            _id: serverMessage._id || tempId,
            tempId,
            status: "sent",
          });
        }
      }
    } catch (error) {
      console.error("Send failed", error);
    } finally {
      setIsSending(false);
    }
  }, [activeChatId, activeConversation, appendMessage, socket, user?._id, user?.role]);

  const startTyping = useCallback(() => {
    if (!socket || !activeChatId) return;
    socket.emit("chat:typing", { chatId: activeChatId, typing: true });
  }, [activeChatId, socket]);

  const stopTyping = useCallback(() => {
    if (!socket || !activeChatId) return;
    socket.emit("chat:typing", { chatId: activeChatId, typing: false });
  }, [activeChatId, socket]);

  useEffect(() => {
    if (!newChatRole) {
      setNewChatUsers([]);
      return;
    }

    const loadUsers = async () => {
      try {
        const users = await getChatUsers(newChatRole);
        setNewChatUsers(users || []);
      } catch (error) {
        console.error("Failed to load chat users", error);
      }
    };

    loadUsers();
  }, [newChatRole]);

  const createNewChat = useCallback(async () => {
    if (!selectedNewUser) return;
    const selectedUser = newChatUsers.find((userOption) => userOption._id === selectedNewUser);
    if (!selectedUser) return;
    await openChatWithUser(selectedUser, newChatRole);
    setSelectedNewUser("");
    setNewChatRole("");
    setShowNewChat(false);
  }, [newChatRole, newChatUsers, openChatWithUser, selectedNewUser]);

  const value = useMemo(
    () => ({
      isOpen,
      setIsOpen,
      conversations,
      activeConversation,
      activeMessages,
      loadingChats,
      loadingMessages,
      searchTerm,
      setSearchTerm,
      unreadCount,
      filteredConversations,
      openConversation,
      openChatWithUser,
      sendMessage,
      isSending,
      onlineUsers,
      typingUsers,
      startTyping,
      stopTyping,
      showNewChat,
      setShowNewChat,
      newChatRole,
      setNewChatRole,
      newChatUsers,
      selectedNewUser,
      setSelectedNewUser,
      createNewChat,
      connected,
      refreshConversations,
    }),
    [activeConversation, activeMessages, connected, conversations, createNewChat, filteredConversations, isOpen, isSending, loadingChats, loadingMessages, newChatRole, newChatUsers, openChatWithUser, openConversation, onlineUsers, refreshConversations, searchTerm, selectedNewUser, sendMessage, showNewChat, startTyping, stopTyping, typingUsers, unreadCount]
  );

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};

export const useChat = () => useContext(ChatContext);
