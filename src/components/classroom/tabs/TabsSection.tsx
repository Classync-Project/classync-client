import React from "react";
import { Participants } from "../../../types/Participants";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../../ui/tabs";
import { Separator } from "../../ui/separator";
import { motion } from "framer-motion";
import ParticipantCard from "../ParticipantCard";
import { GraduationCap, User, UserCog } from "lucide-react";

interface TabsSectionProps {
  participants: Participants[];
  creators: Participants[];
  teachers: Participants[];
  students: Participants[];
  Role: string;
  onRoleChange: (userId: number, newRole: string) => void;
  editingUser: number | null;
  setEditingUser: (userId: number | null) => void;
}

const TabsSection: React.FC<TabsSectionProps> = ({
  participants,
  creators,
  teachers,
  students,
  Role,
  onRoleChange,
  editingUser,
  setEditingUser,
}) => {
  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  return (
    <Tabs defaultValue="all" className="w-full">
      <TabsList className="bg-white shadow-sm mb-6 rounded-lg">
        <TabsTrigger value="all" className="rounded-md">
          All ({participants.length})
        </TabsTrigger>
        <TabsTrigger value="teachers" className="rounded-md">
          Teachers ({teachers.length})
        </TabsTrigger>
        <TabsTrigger value="students" className="rounded-md">
          Students ({students.length})
        </TabsTrigger>
        <TabsTrigger value="creators" className="rounded-md">
          Creators ({creators.length})
        </TabsTrigger>
      </TabsList>

      <TabsContent value="all">
        <div className="bg-white p-6 rounded-xl shadow-sm mb-6">
          <h3 className="text-lg font-semibold mb-4">Creator</h3>
          {creators.length === 0 ? (
            <p className="text-gray-500 italic">No creator found</p>
          ) : (
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
              variants={container}
              initial="hidden"
              animate="visible"
            >
              {creators.map((creator) => (
                <ParticipantCard
                  key={creator.id}
                  participant={creator}
                  currentRole={Role}
                  onRoleChange={onRoleChange}
                  isEditing={editingUser === Number(creator.id)}
                  setEditing={setEditingUser}
                />
              ))}
            </motion.div>
          )}

          <Separator className="my-6" />

          <h3 className="text-lg font-semibold mb-4">Teachers</h3>
          {teachers.length === 0 ? (
            <p className="text-gray-500 italic">No teachers found</p>
          ) : (
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
              variants={container}
              initial="hidden"
              animate="visible"
            >
              {teachers.map((teacher) => (
                <ParticipantCard
                  key={teacher.id}
                  participant={teacher}
                  currentRole={Role}
                  onRoleChange={onRoleChange}
                  isEditing={editingUser === Number(teacher.id)}
                  setEditing={setEditingUser}
                />
              ))}
            </motion.div>
          )}

          <Separator className="my-6" />

          <h3 className="text-lg font-semibold mb-4">Students</h3>
          {students.length === 0 ? (
            <p className="text-gray-500 italic">No students found</p>
          ) : (
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
              variants={container}
              initial="hidden"
              animate="visible"
            >
              {students.map((student) => (
                <ParticipantCard
                  key={student.id}
                  participant={student}
                  currentRole={Role}
                  onRoleChange={onRoleChange}
                  isEditing={editingUser === Number(student.id)}
                  setEditing={setEditingUser}
                />
              ))}
            </motion.div>
          )}
        </div>
      </TabsContent>

      <TabsContent value="teachers">
        <div className="bg-white p-6 rounded-xl shadow-sm">
          {teachers.length === 0 ? (
            <div className="text-center py-8">
              <UserCog className="mx-auto h-12 w-12 text-gray-300 mb-3" />
              <h3 className="text-lg font-medium text-gray-700">No teachers found</h3>
              <p className="text-gray-500 mt-1">Try adjusting your search criteria</p>
            </div>
          ) : (
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
              variants={container}
              initial="hidden"
              animate="visible"
            >
              {teachers.map((teacher) => (
                <ParticipantCard
                  key={teacher.id}
                  participant={teacher}
                  currentRole={Role}
                  onRoleChange={onRoleChange}
                  isEditing={editingUser === Number(teacher.id)}
                  setEditing={setEditingUser}
                />
              ))}
            </motion.div>
          )}
        </div>
      </TabsContent>

      <TabsContent value="students">
        <div className="bg-white p-6 rounded-xl shadow-sm">
          {students.length === 0 ? (
            <div className="text-center py-8">
              <GraduationCap className="mx-auto h-12 w-12 text-gray-300 mb-3" />
              <h3 className="text-lg font-medium text-gray-700">No students found</h3>
              <p className="text-gray-500 mt-1">Try adjusting your search criteria</p>
            </div>
          ) : (
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
              variants={container}
              initial="hidden"
              animate="visible"
            >
              {students.map((student) => (
                <ParticipantCard
                  key={student.id}
                  participant={student}
                  currentRole={Role}
                  onRoleChange={onRoleChange}
                  isEditing={editingUser === Number(student.id)}
                  setEditing={setEditingUser}
                />
              ))}
            </motion.div>
          )}
        </div>
      </TabsContent>

      <TabsContent value="creators">
        <div className="bg-white p-6 rounded-xl shadow-sm">
          {creators.length === 0 ? (
            <div className="text-center py-8">
              <User className="mx-auto h-12 w-12 text-gray-300 mb-3" />
              <h3 className="text-lg font-medium text-gray-700">No creators found</h3>
              <p className="text-gray-500 mt-1">Try adjusting your search criteria</p>
            </div>
          ) : (
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
              variants={container}
              initial="hidden"
              animate="visible"
            >
              {creators.map((creator) => (
                <ParticipantCard
                  key={creator.id}
                  participant={creator}
                  currentRole={Role}
                  onRoleChange={onRoleChange}
                  isEditing={editingUser === Number(creator.id)}
                  setEditing={setEditingUser}
                />
              ))}
            </motion.div>
          )}
        </div>
      </TabsContent>
    </Tabs>
  );
};

export default TabsSection;