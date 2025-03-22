import React, { useState, useCallback, useMemo, useEffect } from "react";
import { toast } from "react-toastify";
import { CheckCircle } from "lucide-react";
import axios from "axios";

import { Participants } from "../types/Participants";
import SearchBar from "../components/SearchBar";
import TabsSection from "../components/TabsSection";

const API_BASE_URL = "http://localhost:8080/api";

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
  const [searchTerm, setSearchTerm] = useState("");
  const [editingUser, setEditingUser] = useState<number | null>(null);
  const [localParticipants, setLocalParticipants] = useState<Participants[]>(participants);
  
  useEffect(() => {
    setLocalParticipants(participants);
  }, [participants]);

  const filteredParticipants = useMemo(() => {
    const normalizedSearchTerm = searchTerm.toLowerCase();
    
    const filterBySearch = (participant: Participants) => 
      searchTerm === "" ||
      participant.name?.toLowerCase().includes(normalizedSearchTerm) ||
      participant.email.toLowerCase().includes(normalizedSearchTerm);
    
    return {
      creators: localParticipants.filter(p => p.role === "CREATOR" && filterBySearch(p)),
      teachers: localParticipants.filter(p => p.role === "TEACHER" && filterBySearch(p)),
      students: localParticipants.filter(p => p.role === "STUDENT" && filterBySearch(p))
    };
  }, [localParticipants, searchTerm]);

  const handleRoleChange = useCallback(async (userId: number, newRole: string) => {
    try {
      await axios.put(
        `${API_BASE_URL}/classrooms/${classRoomId}/participants/${userId}/role`,
        { role: newRole },
        { withCredentials: true }
      );
      
      setLocalParticipants(prevParticipants => 
        prevParticipants.map(participant => 
          participant.userId === userId 
            ? { ...participant, role: newRole } 
            : participant
        )
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
      console.error("Error updating role:", error);
    }
  }, [classRoomId, onRoleUpdate]);

  return (
    <div className="flex flex-col space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-200">Classroom People</h2>
          <p className="text-gray-500 mt-1">
            {localParticipants.length} participants in this classroom
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <SearchBar 
            searchTerm={searchTerm} 
            setSearchTerm={setSearchTerm} 
          />
        </div>
      </div>

      <TabsSection
        participants={localParticipants}
        creators={filteredParticipants.creators}
        teachers={filteredParticipants.teachers}
        students={filteredParticipants.students}
        Role={Role}
        onRoleChange={handleRoleChange}
        editingUser={editingUser}
        setEditingUser={setEditingUser}
      />
    </div>
  );
};

export default ParticipantsTab;