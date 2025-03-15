import { createContext, ReactNode, useContext, useState } from "react";
import { mockRooms, mockResponses } from "../lib/mock-data";

export interface ChatRoom {
  id: string;
  name: string;
  createdAt: string;
  dbType: "sql" | "nosql";
  dbms: string;
  username: string;
  databaseName: string;
  host?: string;
  port?: number;
}

export interface ChatMessage {
  id: string;
  sender: string;
  content: string;
  timestamp: string;
  response?: {
    sql_query?: string;
    natural_language: string;
    kind_of_chart?: string;
    data?: {
      labels: string[];
      values: number[];
    };
  };
}

interface ChatContextType {
  rooms: ChatRoom[];
  messages: Record<string, ChatMessage[]>;
  createRoom: (room: Omit<ChatRoom, "id" | "createdAt">) => void;
  sendMessage: (roomId: string, content: string) => void;
  searchRooms: (query: string) => ChatRoom[];
  sortRooms: (key: keyof ChatRoom) => void;
}

const ChatContext = createContext<ChatContextType | null>(null);

export function ChatProvider({ children }: { children: ReactNode }) {
  const [rooms, setRooms] = useState<ChatRoom[]>(mockRooms);
  const [messages, setMessages] = useState<Record<string, ChatMessage[]>>({});

  const createRoom = (room: Omit<ChatRoom, "id" | "createdAt">) => {
    const newRoom: ChatRoom = {
      ...room,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString(),
    };
    setRooms((prev) => [...prev, newRoom]);
  };

  const sendMessage = (roomId: string, content: string) => {
    const newMessage: ChatMessage = {
      id: Math.random().toString(36).substr(2, 9),
      sender: "user",
      content,
      timestamp: new Date().toISOString(),
    };

    // Mock AI response
    const aiResponse: ChatMessage = {
      id: Math.random().toString(36).substr(2, 9),
      sender: "ai",
      content: "Here's the analysis of your query:",
      timestamp: new Date().toISOString(),
      response: mockResponses[Math.floor(Math.random() * mockResponses.length)],
    };

    setMessages((prev) => ({
      ...prev,
      [roomId]: [...(prev[roomId] || []), newMessage, aiResponse],
    }));
  };

  const searchRooms = (query: string) => {
    return rooms.filter(
      (room) =>
        room.name.toLowerCase().includes(query.toLowerCase()) ||
        room.dbms.toLowerCase().includes(query.toLowerCase()) ||
        room.databaseName.toLowerCase().includes(query.toLowerCase())
    );
  };

  const sortRooms = (key: keyof ChatRoom) => {
    setRooms((prev) => [...prev].sort((a, b) => (a[key] > b[key] ? 1 : -1)));
  };

  return (
    <ChatContext.Provider
      value={{ rooms, messages, createRoom, sendMessage, searchRooms, sortRooms }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
}
