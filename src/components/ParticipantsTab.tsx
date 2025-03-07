import React, { useState } from "react";
import { Participants } from "../types/Participants";
import {
  Card,
  CardContent
} from "../components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from "../components/ui/tabs";
import { Button } from "../components/ui/button";
import {
  Avatar,
  AvatarFallback,
  AvatarImage
} from "../components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "../components/ui/dialog";
import { Badge } from "../components/ui/badge";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from "../components/ui/select";
import { Separator } from "../components/ui/separator";
import { motion } from "framer-motion";
import {
  UserCircle,
  UserPlus,
  Mail,
  Calendar,
  Clock,
  Search,
  GraduationCap,
  User,
  UserCog,
  CheckCircle,
  Loader2,
  Pencil,
  ChevronRight,
  UserCheck
} from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";

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
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("STUDENT");
  const [isInviting, setIsInviting] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingUser, setEditingUser] = useState<number | null>(null);

  // Sort and filter participants
  const teachers = participants.filter(p => p.role === "TEACHER" &&
    (searchTerm === "" || p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.email.toLowerCase().includes(searchTerm.toLowerCase())));

  const students = participants.filter(p => p.role === "STUDENT" &&
    (searchTerm === "" || p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.email.toLowerCase().includes(searchTerm.toLowerCase())));

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
        icon: <CheckCircle className="text-green-500" />
      });
    } catch (error) {
      toast.error("Failed to update role", {
        position: "bottom-right"
      });
      console.error(error);
    }
  };

  const handleInviteUser = async () => {
    if (!inviteEmail.trim()) {
      toast.error("Please enter an email address");
      return;
    }

    setIsInviting(true);
    try {
      await axios.post(
        `http://localhost:8080/api/classrooms/${classRoomId}/invite`,
        { email: inviteEmail, role: inviteRole },
        { withCredentials: true }
      );
      toast.success(`Invitation sent to ${inviteEmail}`, {
        position: "bottom-right",
        icon: <UserCheck className="text-green-500" />
      });
      setInviteEmail("");
      setShowInviteDialog(false);
    } catch (error) {
      toast.error("Failed to send invitation");
      console.error(error);
    } finally {
      setIsInviting(false);
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  return (
    <>
      <div className="flex flex-col space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-200">
              Classroom People
            </h2>
            <p className="text-gray-500 mt-1">
              {participants.length} participants in this classroom
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search participants..."
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {Role !== "STUDENT" && (
              <Dialog open={showInviteDialog} onOpenChange={setShowInviteDialog}>
                <DialogTrigger asChild>
                  <Button
                    className="bg-blue-600 hover:bg-blue-700 text-white flex items-center space-x-2 shadow-md transition-all duration-200"
                  >
                    <UserPlus className="w-4 h-4" />
                    <span>Invite Participant</span>
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Invite to Classroom</DialogTitle>
                    <DialogDescription>
                      Send an invitation email to add a new participant to this classroom.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="Enter email address"
                        value={inviteEmail}
                        onChange={(e) => setInviteEmail(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="role">Role</Label>
                      <Select
                        value={inviteRole}
                        onValueChange={setInviteRole}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select a role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>Roles</SelectLabel>
                            <SelectItem value="STUDENT">
                              <div className="flex items-center">
                                <GraduationCap className="mr-2 h-4 w-4" />
                                <span>Student</span>
                              </div>
                            </SelectItem>
                            <SelectItem value="TEACHER">
                              <div className="flex items-center">
                                <UserCog className="mr-2 h-4 w-4" />
                                <span>Teacher</span>
                              </div>
                            </SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <DialogFooter className="sm:justify-end">
                    <Button
                      variant="secondary"
                      onClick={() => setShowInviteDialog(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      onClick={handleInviteUser}
                      disabled={isInviting}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      {isInviting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Sending Invitation...
                        </>
                      ) : (
                        <>
                          <UserPlus className="mr-2 h-4 w-4" />
                          Send Invitation
                        </>
                      )}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            )}
          </div>
        </div>

        <Tabs defaultValue="all" className="w-full">
          <TabsList className="bg-white shadow-sm mb-6 rounded-lg">
            <TabsTrigger value="all" className="rounded-md">All ({participants.length})</TabsTrigger>
            <TabsTrigger value="teachers" className="rounded-md">Teachers ({teachers.length})</TabsTrigger>
            <TabsTrigger value="students" className="rounded-md">Students ({students.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="all">
            <div className="bg-white p-6 rounded-xl shadow-sm mb-6">
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
                      onRoleChange={handleRoleChange}
                      isEditing={editingUser === teacher.id}
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
                      onRoleChange={handleRoleChange}
                      isEditing={editingUser === student.id}
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
                      onRoleChange={handleRoleChange}
                      isEditing={editingUser === teacher.id}
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
                      onRoleChange={handleRoleChange}
                      isEditing={editingUser === student.id}
                      setEditing={setEditingUser}
                    />
                  ))}
                </motion.div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
};

// Participant Card Component
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
  setEditing
}) => {
  const isCurrentUser = participant.email === localStorage.getItem("useremail");

  // Generate initials for avatar
  const getInitials = () => {
    if (participant.name) {
      return participant.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    }
    return participant.email.slice(0, 2).toUpperCase();
  };

  // Generate background color for avatar based on user id
  const getAvatarColor = () => {
    const colors = [
      "bg-blue-100 text-blue-800",
      "bg-green-100 text-green-800",
      "bg-amber-100 text-amber-800",
      "bg-purple-100 text-purple-800",
      "bg-pink-100 text-pink-800",
      "bg-indigo-100 text-indigo-800",
      "bg-emerald-100 text-emerald-800"
    ];
    return colors[participant.id % colors.length];
  };

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
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
                {participant.name || "Unnamed User"}
                {isCurrentUser && (
                  <Badge variant="outline" className="ml-2 text-xs">You</Badge>
                )}
              </h3>
              <div className="flex items-center text-sm text-gray-500 space-x-2">
                <Mail className="w-3.5 h-3.5" />
                <span className="truncate">{participant.email}</span>
              </div>

              <div className="mt-2 flex items-center">
                {isEditing ? (
                  <div className="flex items-center space-x-2 mt-1">
                    <Select
                      defaultValue={participant.role}
                      onValueChange={(value) => onRoleChange(participant.id, value)}
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
                      variant={participant.role === "TEACHER" ? "default" : "secondary"}
                      className="text-xs capitalize"
                    >
                      {participant.role === "TEACHER" ? (
                        <div className="flex items-center">
                          <UserCog className="mr-1 h-3 w-3" />
                          <span>Teacher</span>
                        </div>
                      ) : (
                        <div className="flex items-center">
                          <GraduationCap className="mr-1 h-3 w-3" />
                          <span>Student</span>
                        </div>
                      )}
                    </Badge>

                    {currentRole === "TEACHER" && !isCurrentUser && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="ml-2 h-7 w-7 p-0 rounded-full"
                        onClick={() => setEditing(participant.id)}
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

export default ParticipantsTab;