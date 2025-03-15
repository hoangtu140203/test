import { ChatMessage as ChatMessageType } from "../../contexts/ChatContext";
import { Card, CardContent } from "@/components/ui/card";
import { format } from "date-fns";
import QueryVisualization from "./QueryVisualization";

interface ChatMessageProps {
  message: ChatMessageType;
}

export default function ChatMessage({ message }: ChatMessageProps) {
  const isAI = message.sender === "ai";

  return (
    <div
      className={`flex ${isAI ? "justify-start" : "justify-end"} mb-4`}
    >
      <Card
        className={`max-w-[80%] ${
          isAI ? "bg-secondary" : "bg-primary text-primary-foreground"
        }`}
      >
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="font-semibold">
              {isAI ? "AI Assistant" : "You"}
            </span>
            <span className="text-xs opacity-70">
              {format(new Date(message.timestamp), "p")}
            </span>
          </div>
          <p className="mb-2">{message.content}</p>
          {message.response && (
            <div className="mt-4">
              {message.response.sql_query && (
                <div className="bg-black/10 p-4 rounded-md mb-4 font-mono text-sm overflow-x-auto">
                  {message.response.sql_query}
                </div>
              )}
              <p className="mb-4">{message.response.natural_language}</p>
              {message.response.data && (
                <QueryVisualization
                  data={message.response.data}
                  chartType={message.response.kind_of_chart || "bar"}
                />
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
