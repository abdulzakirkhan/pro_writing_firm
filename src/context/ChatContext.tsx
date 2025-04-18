// context/ChatContext.tsx
import { createContext, useContext, useState } from "react";

type ChatUser = {
  id: number;
  name: string;
  avatar: string;
  message: string;
  unread?: number;
  isSupport?: boolean;
  isActive?: boolean;
};

type ChatContextType = {
  selectedUser: ChatUser | null;
  setSelectedUser: (user: ChatUser) => void;
};

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedUser, setSelectedUser] = useState<ChatUser | null>(null);

  return (
    <ChatContext.Provider value={{ selectedUser, setSelectedUser }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChat must be used within ChatProvider");
  }
  return context;
};
