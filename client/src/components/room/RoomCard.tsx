import { Link } from "wouter";
import { ChatRoom } from "../../contexts/ChatContext";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

interface RoomCardProps {
  room: ChatRoom;
}

export default function RoomCard({ room }: RoomCardProps) {
  return (
    <Link href={`/room/${room.id}`}>
      <Card className="cursor-pointer hover:shadow-lg transition-shadow">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>{room.name}</span>
            <Badge variant={room.dbType === "sql" ? "default" : "secondary"}>
              {room.dbType.toUpperCase()}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm text-muted-foreground">
            <p>
              <strong>DBMS:</strong> {room.dbms}
            </p>
            <p>
              <strong>Database:</strong> {room.databaseName}
            </p>
            <p>
              <strong>Created:</strong>{" "}
              {format(new Date(room.createdAt), "PPP")}
            </p>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
