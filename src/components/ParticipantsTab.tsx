import React, { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "../components/ui/card";
import { TabsContent } from "../components/ui/tabs";
import { Participants } from "@/types/Participants";
import axios from "axios";
import { toast } from "react-toastify";

type ParticipantsTabProps = {
  participants: Participants[];
  classRoomId: string;
  onRoleUpdate: (userId: number, newRole: string) => void;
  Role: string;
};

const ParticipantsTab: React.FC<ParticipantsTabProps> = ({
  participants,
  classRoomId,
  onRoleUpdate,
  Role,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<Participants | null>(null);
  const [creater, setCreater] = useState<Participants | null>(null);
  const [teachers, setTeachers] = useState<Participants[]>([]);
  const [students, setStudents] = useState<Participants[]>([]);

  useEffect(() => {
    const createrUser = participants.find((p) => p.role === "CREATER") || null;
    const teacherUsers = participants.filter((p) => p.role === "TEACHER");
    const studentUsers = participants.filter((p) => p.role === "STUDENT");

    setCreater(createrUser);
    setTeachers(teacherUsers);
    setStudents(studentUsers);
  }, [participants]);

  const handleUserClick = (user: Participants) => {
    if (Role === "CREATER") {
      setSelectedUser(user);
      setIsModalOpen(true);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
  };

  const updateRoleInBackend = async (
    userId: number,
    classroomId: string,
    newRoleName: string
  ) => {
    try {
      const response = await axios.put(
        `http://localhost:8080/api/userclassroom/updaterole`,
        { userId, classroomId, newRoleName },
        { withCredentials: true }
      );
      toast.success(response.data);
      return true;
    } catch (error) {
      toast.error("Error updating role: " + error);
      return false;
    }
  };

  const handleRoleUpdate = async (newRole: string) => {
    if (Role !== "CREATER") {
      toast.error("Only the class CREATER can update roles!");
      return;
    }
    if (selectedUser) {
      const success = await updateRoleInBackend(selectedUser.id, classRoomId, newRole);
      if (success) {
        onRoleUpdate(selectedUser.id, newRole);
        closeModal();
      }
    }
  };

  return (
    <TabsContent value="participants">
      <Card className="bg-white shadow-sm p-4">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Class Participants</CardTitle>
          <CardDescription>Total participants: {participants.length}</CardDescription>
        </CardHeader>
        <CardContent>
          {creater && (
            <div>
              <h2 className="text-xl font-bold">Creater</h2>
              <div
                className="p-4 bg-yellow-100 border border-yellow-400 rounded-lg cursor-pointer"
                onClick={() => handleUserClick(creater)}
              >
                <p className="font-semibold">{creater.fullName}</p>
                <p className="text-sm text-gray-600">{creater.email}</p>
              </div>
            </div>
          )}

          {teachers.length > 0 && (
            <div className="mt-4">
              <h2 className="text-xl font-bold">Teachers</h2>
              {teachers.map((teacher) => (
                <div
                  key={teacher.id}
                  className="p-4 bg-blue-100 border border-blue-400 rounded-lg cursor-pointer"
                  onClick={() => handleUserClick(teacher)}
                >
                  <p className="font-semibold">{teacher.fullName}</p>
                  <p className="text-sm text-gray-600">{teacher.email}</p>
                </div>
              ))}
            </div>
          )}

          {students.length > 0 && (
            <div className="mt-4">
              <h2 className="text-xl font-bold">Students</h2>
              {students.map((student) => (
                <div
                  key={student.id}
                  className="p-4 bg-green-100 border border-green-400 rounded-lg cursor-pointer"
                  onClick={() => handleUserClick(student)}
                >
                  <p className="font-semibold">{student.fullName}</p>
                  <p className="text-sm text-gray-600">{student.email}</p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

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
                onChange={(e) => setSelectedUser({ ...selectedUser, role: e.target.value })}
              >
                <option value="STUDENT">STUDENT</option>
                <option value="TEACHER">TEACHER</option>
              </select>
            </div>
            <div className="flex justify-end space-x-2">
              <button className="px-4 py-2 bg-gray-300 rounded-md" onClick={closeModal}>Cancel</button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-md" onClick={() => handleRoleUpdate(selectedUser.role)}>Update Role</button>
            </div>
          </div>
        </div>
      )}
    </TabsContent>
  );
};

export default ParticipantsTab;
