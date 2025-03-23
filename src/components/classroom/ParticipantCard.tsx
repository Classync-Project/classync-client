import React from "react";
import { Participants } from "../../types/Participants";
import { Card, CardContent } from "../ui/card";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Mail, UserCog, User, GraduationCap, Pencil } from "lucide-react";
import { motion } from "framer-motion";

interface ParticipantCardProps {
  participant: Participants;
  currentRole: string;
  onRoleChange: (userId: number, newRole: string) => void;
  isEditing: boolean;
  setEditing: (userId: number | null) => void;
}

const ParticipantCard: React.FC<ParticipantCardProps> = ({
  participant,
  currentRole,
  onRoleChange,
  isEditing,
  setEditing,
}) => {
  const isCurrentUser = participant.email === localStorage.getItem("useremail");
  const isCreator = participant.role === "CREATOR";

  const getInitials = () => {
    if (participant.name) {
      return participant.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
    }
    return participant.email.slice(0, 2).toUpperCase();
  };

  const getAvatarColor = () => {
    const colors = [
      "bg-blue-100 text-blue-800",
      "bg-green-100 text-green-800",
      "bg-amber-100 text-amber-800",
      "bg-purple-100 text-purple-800",
      "bg-pink-100 text-pink-800",
      "bg-indigo-100 text-indigo-800",
      "bg-emerald-100 text-emerald-800",
    ];
    return colors[Number(participant.id) % colors.length];
  };

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
      }}
      transition={{ duration: 0.3 }}
    >
      <Card className="overflow-hidden hover:shadow-md transition-all duration-300 border-gray-100">
        <CardContent className="p-4">
          <div className="flex items-center space-x-4">
            <Avatar className="h-12 w-12 border border-gray-100">
              <AvatarFallback className={getAvatarColor()}>
                {getInitials()}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-gray-800 truncate">
                {participant.fullName || "Unnamed User"}
                {isCurrentUser && (
                  <Badge variant="outline" className="ml-2 text-xs">
                    You
                  </Badge>
                )}
              </h3>
              <div className="flex items-center text-sm text-gray-500 space-x-2">
                <Mail className="w-3.5 h-3.5" />
                <span className="truncate">{participant.email}</span>
              </div>

              <div className="mt-2 flex items-center">
                {isEditing && !isCreator ? (
                  <div className="flex items-center space-x-2 mt-1">
                    <Select
                      defaultValue={participant.role}
                      onValueChange={(value) => onRoleChange(Number(participant.id), value)}
                    >
                      <SelectTrigger className="h-8 text-xs w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="STUDENT">Student</SelectItem>
                        <SelectItem value="TEACHER">Teacher</SelectItem>
                      </SelectContent>
                    </Select>

                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 px-2 text-xs"
                      onClick={() => setEditing(null)}
                    >
                      Cancel
                    </Button>
                  </div>
                ) : (
                  <>
                    <Badge
                      variant={
                        participant.role === "TEACHER"
                          ? "default"
                          : participant.role === "CREATOR"
                            ? "default"
                            : "secondary"
                      }
                      className="text-xs capitalize"
                    >
                      {participant.role === "TEACHER" ? (
                        <div className="flex items-center">
                          <UserCog className="mr-1 h-3 w-3" />
                          <span>Teacher</span>
                        </div>
                      ) : participant.role === "CREATOR" ? (
                        <div className="flex items-center">
                          <User className="mr-1 h-3 w-3" />
                          <span>Creator</span>
                        </div>
                      ) : (
                        <div className="flex items-center">
                          <GraduationCap className="mr-1 h-3 w-3" />
                          <span>Student</span>
                        </div>
                      )}
                    </Badge>

                    {currentRole === "CREATOR" && !isCurrentUser && !isCreator && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="ml-2 h-7 w-7 p-0 rounded-full"
                        onClick={() => setEditing(Number(participant.id))}
                      >
                        <Pencil className="h-3.5 w-3.5 text-gray-500" />
                      </Button>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ParticipantCard;