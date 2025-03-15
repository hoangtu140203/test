import { useParams, useLocation } from "wouter";
import { useChat } from "@/contexts/ChatContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import ChatMessage from "@/components/chat/ChatMessage";
import QueryVisualization from "@/components/chat/QueryVisualization";
import { ArrowLeft, Send, Code, LineChart } from "lucide-react";
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
        <div className="space-y-6">
          <div className="sticky top-24 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 rounded-lg border shadow-sm">
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                <Code className="h-5 w-5" /> Query Analysis
              </h2>
              {latestMessage?.response ? (
                <div className="space-y-6">
                  {latestMessage.response.sql_query && (
                    <div>
                      <h3 className="text-sm font-medium mb-3 text-muted-foreground uppercase tracking-wide">
                        SQL Query
                      </h3>
                      <pre className="bg-primary/5 border rounded-lg p-4 overflow-x-auto text-sm font-mono">
                        {latestMessage.response.sql_query.split(/\b(SELECT|FROM|WHERE|GROUP BY|ORDER BY|HAVING|JOIN|ON|AND|OR|AS|LIMIT|COUNT|SUM|AVG|MIN|MAX|BETWEEN|IN|LIKE|IS NULL|IS NOT NULL|DESC|ASC|DISTINCT|CASE|WHEN|THEN|END|INNER|LEFT|RIGHT|FULL|OUTER)\b/gi).map((part, index) => {
                          const isKeyword = /^(SELECT|FROM|WHERE|GROUP BY|ORDER BY|HAVING|JOIN|ON|AND|OR|AS|LIMIT|COUNT|SUM|AVG|MIN|MAX|BETWEEN|IN|LIKE|IS NULL|IS NOT NULL|DESC|ASC|DISTINCT|CASE|WHEN|THEN|END|INNER|LEFT|RIGHT|FULL|OUTER)$/i.test(part);
                          const isFunctionOrAggregate = /^(COUNT|SUM|AVG|MIN|MAX)$/i.test(part);

                          if (isKeyword) {
                            return (
                              <span key={index} className="text-blue-600 dark:text-blue-400 font-semibold">
                                {part.toUpperCase().startsWith("GROUP") || part.toUpperCase().startsWith("ORDER") ? "\n  " : "\n"}{part.toUpperCase()}{" "}
                              </span>
                            );
                          } else if (isFunctionOrAggregate) {
                            return (
                              <span key={index} className="text-green-600 dark:text-green-400">
                                {part.toUpperCase()}
                              </span>
                            );
                          } else {
                            return <span key={index}>{part}</span>;
                          }
                        })}
                      </pre>
                    </div>
                  )}
                  {latestMessage.response.data && (
                    <div>
                      <h3 className="text-sm font-medium mb-3 text-muted-foreground uppercase tracking-wide flex items-center gap-2">
                        <LineChart className="h-4 w-4" /> Visualization
                      </h3>
                      <QueryVisualization
                        data={latestMessage.response.data}
                        chartType={latestMessage.response.kind_of_chart || "bar"}
                      />
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-8">
                  Start a conversation to see query analysis and visualizations
                </p>
              )}
            </div>
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