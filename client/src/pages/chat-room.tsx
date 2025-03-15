import { useParams, useLocation } from "wouter";
import { useChat } from "@/contexts/ChatContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import ChatMessage from "@/components/chat/ChatMessage";
import QueryVisualization from "@/components/chat/QueryVisualization";
import { ArrowLeft, Send } from "lucide-react";
import { useState, useRef, useEffect } from "react";

export default function ChatRoom() {
  const { id } = useParams();
  const [, setLocation] = useLocation();
  const { rooms, messages, sendMessage } = useChat();
  const [newMessage, setNewMessage] = useState("");
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const room = rooms.find((r) => r.id === id);
  const roomMessages = messages[id || ""] || [];

  useEffect(() => {
    // Scroll to bottom when new messages arrive
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [roomMessages]);

  if (!room) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Room not found</h1>
          <Button onClick={() => setLocation("/")}>Return Home</Button>
        </div>
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    sendMessage(room.id, newMessage.trim());
    setNewMessage("");
  };

  const latestMessage = roomMessages[roomMessages.length - 1];

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setLocation("/")}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-xl font-bold">{room.name}</h1>
            <p className="text-sm text-muted-foreground">
              {room.dbType.toUpperCase()} • {room.dbms} • {room.databaseName}
            </p>
          </div>
        </div>
      </header>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 container mx-auto px-4 py-6 gap-6">
        {/* Left side: SQL Query and Visualization */}
        <div className="space-y-4">
          <div className="sticky top-24">
            <h2 className="text-lg font-semibold mb-4">Query Analysis</h2>
            {latestMessage?.response && (
              <div className="border rounded-lg p-4 bg-card">
                {latestMessage.response.sql_query && (
                  <div className="mb-4">
                    <h3 className="text-sm font-medium mb-2">SQL Query</h3>
                    <pre className="bg-muted p-4 rounded-md overflow-x-auto text-sm">
                      {latestMessage.response.sql_query}
                    </pre>
                  </div>
                )}
                {latestMessage.response.data && (
                  <div className="mt-6">
                    <h3 className="text-sm font-medium mb-2">Visualization</h3>
                    <QueryVisualization
                      data={latestMessage.response.data}
                      chartType={latestMessage.response.kind_of_chart || "bar"}
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right side: Chat Messages */}
        <div className="flex flex-col h-[calc(100vh-8rem)]">
          <ScrollArea ref={scrollAreaRef} className="flex-1 pr-4">
            <div className="space-y-4">
              {roomMessages.map((message) => (
                <ChatMessage key={message.id} message={message} />
              ))}
            </div>
          </ScrollArea>

          <form onSubmit={handleSubmit} className="mt-4 flex gap-2">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Ask a question about your database..."
              className="flex-1"
            />
            <Button type="submit" size="icon">
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}