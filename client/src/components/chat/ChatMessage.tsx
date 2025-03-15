import { ChatMessage as ChatMessageType } from "../../contexts/ChatContext";
import { Card, CardContent } from "@/components/ui/card";
import { format } from "date-fns";

interface ChatMessageProps {
  message: ChatMessageType;
}

export default function ChatMessage({ message }: ChatMessageProps) {
  const isAI = message.sender === "ai";

  return (
    <div className={`flex ${isAI ? "justify-start" : "justify-end"} mb-4`}>
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
          <p>{message.content}</p>
          {isAI && message.response?.natural_language && (
            <p className="mt-2 text-sm">{message.response.natural_language}</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}