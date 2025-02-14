import React, { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "../components/ui/card"; // Adjust imports based on your UI library
import { TabsContent } from "../components/ui/tabs";
import { Participants } from "@/types/Participants";
import axios from "axios";
import { toast } from "react-toastify";


// Define the props for the component
type ParticipantsTabProps = {
  participants: Participants[];
  classRoomId: string;
  onRoleUpdate: (userId: number, newRole: string) => void;
};

const ParticipantsTab: React.FC<ParticipantsTabProps> = ({ participants, classRoomId, onRoleUpdate }) => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedUser, setSelectedUser] = useState<Participants | null>(null);

  // Function to open the modal and set the selected user
  const handleUserClick = (user: Participants) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  // Function to close the modal
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
  };

  const updateRoleInBackend = async (userId: number, classroomId: number, newRoleName: string) => {
    try {
      console.log(userId, classroomId, newRoleName);
      const response = await axios.put(
        `http://localhost:8080/api/userclassroom/updaterole`,
        {
          userId,
          classroomId,
          newRoleName
        },
        { withCredentials: true }
      );

      console.log(response.data);
      toast.success(response.data);
      return true;
    } catch (error) {
      toast.error("Error updating role:" + error);
      console.error("Error updating role:", error);
      return false;
    }
  };
  // Function to handle role update
  const handleRoleUpdate = async (newRole: string) => {
    if (selectedUser) {
      // Update the user's role in the state (or send to the backend)
      const success = await updateRoleInBackend(selectedUser.id, classRoomId, newRole);
      const updatedParticipants = participants.map((user) =>
        user.id === selectedUser.id ? { ...user, role: newRole } : user
      );
      console.log("Updated Participants:", updatedParticipants);
      if (success) {
        // Update the local state in the parent component
        onRoleUpdate(selectedUser.id, newRole);
        closeModal();
      }
    }
  };

  return (
    <TabsContent value="participants">
      <Card className="bg-white shadow-sm">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-gray-800">
            Class Participants
          </CardTitle>
          <CardDescription>Total participants: {participants.length}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {participants.map((user) => (
              <div
                key={user.id}
                className="p-4 rounded-lg bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 cursor-pointer"
                onClick={() => handleUserClick(user)} // Open modal on click
              >
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
                    {user.fullName.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">{user.fullName}</h3>
                    <p className="text-sm text-gray-600">{user.email}</p>
                    <span className="inline-block px-2 py-1 mt-2 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                      {user.role}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Modal for User Profile and Role Update */}
      {isModalOpen && selectedUser && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg w-96">
            <h2 className="text-xl font-semibold mb-4">{selectedUser.fullName}'s Profile</h2>
            <p className="text-gray-600 mb-2">Email: {selectedUser.email}</p>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Role</label>
              <select
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                value={selectedUser.role}
                onChange={(e) =>
                  setSelectedUser({ ...selectedUser, role: e.target.value })
                }
              >
                <option value="STUDENT">STUDENT</option>
                <option value="TEACHER">TEACHER</option>
              </select>
            </div>
            <div className="flex justify-end space-x-2">
              <button
                className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400"
                onClick={closeModal}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                onClick={() => handleRoleUpdate(selectedUser.role)}
              >
                Update Role
              </button>
            </div>
          </div>
        </div>
      )}
    </TabsContent>
  );
};

export default ParticipantsTab;