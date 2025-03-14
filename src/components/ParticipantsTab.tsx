import React, { useState } from "react";
import { Participants } from "../types/Participants";
// import { Tabs, TabsList, TabsTrigger, TabsContent } from "../components/ui/tabs";
// import { Button } from "../components/ui/button";
// import { Dialog } from "../components/ui/dialog";
// import { Input } from "../components/ui/input";
// import { Separator } from "../components/ui/separator";
// import { motion } from "framer-motion";
// import { Search, UserPlus } from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";
// import ParticipantCard from "../components/ParticipantCard";
// import InviteDialog from "../components/InviteDialog";
import SearchBar from "../components/SearchBar";
import TabsSection from "../components/TabsSection";
import { CheckCircle } from "lucide-react";

interface ParticipantsTabProps {
  participants: Participants[];
  classRoomId: string;
  onRoleUpdate: (userId: number, newRole: string) => void;
  Role: string;
}

const ParticipantsTab: React.FC<ParticipantsTabProps> = ({
  participants,
  classRoomId,
  onRoleUpdate,
  Role,
}) => {
  const [showInviteDialog, setShowInviteDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingUser, setEditingUser] = useState<number | null>(null);

  // Sort and filter participants
  const creators = participants.filter(
    (p) =>
      p.role === "CREATOR" &&
      (searchTerm === "" ||
        p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const teachers = participants.filter(
    (p) =>
      p.role === "TEACHER" &&
      (searchTerm === "" ||
        p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const students = participants.filter(
    (p) =>
      p.role === "STUDENT" &&
      (searchTerm === "" ||
        p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleRoleChange = async (userId: number, newRole: string) => {
    try {
      await axios.put(
        `http://localhost:8080/api/classrooms/${classRoomId}/participants/${userId}/role`,
        { role: newRole },
        { withCredentials: true }
      );
      onRoleUpdate(userId, newRole);
      setEditingUser(null);
      toast.success("Role updated successfully!", {
        position: "bottom-right",
        icon: <CheckCircle className="text-green-500" />,
      });
    } catch (error) {
      toast.error("Failed to update role", {
        position: "bottom-right",
      });
      console.error(error);
    }
  };

  return (
    <div className="flex flex-col space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-200">Classroom People</h2>
          <p className="text-gray-500 mt-1">
            {participants.length} participants in this classroom
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

          {/* {Role !== "STUDENT" && (
            <InviteDialog
              showInviteDialog={showInviteDialog}
              setShowInviteDialog={setShowInviteDialog}
              classRoomId={classRoomId}
            />
          )} */}
        </div>
      </div>

      <TabsSection
        participants={participants}
        creators={creators}
        teachers={teachers}
        students={students}
        Role={Role}
        onRoleChange={handleRoleChange}
        editingUser={editingUser}
        setEditingUser={setEditingUser}
      />
    </div>
  );
};

export default ParticipantsTab;