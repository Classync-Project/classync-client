import { useEffect, useState } from "react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import axios from "axios";
import { useLocation, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { Participants } from "../types/Participants";
import { Assignment } from "../types/Assignment";
import ParticipantsTab from "../components/ParticipantsTab";
import AssignmentsTab from "../components/AssignmentsTab";
import AnnouncementsTab from "../components/AnnouncementsTab";
import { motion } from "framer-motion";
import { Toaster } from "../components/ui/sonner";
import { ScrollArea } from "../components/ui/scroll-area";
import { Calendar, Users, Bell, BookOpen, HelpCircle } from "lucide-react";
import DoubtsTab from "../components/DoubtsTab";

const ViewClass = () => {
  const { classroomId } = useParams<{ classroomId: string }>();
  const [participants, setParticipants] = useState<Participants[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [classInfo, setClassInfo] = useState<any>(null);
  const [doubts, setDoubts] = useState<any[]>([]); // Add state for doubts

  const location = useLocation();
  const role = location.state?.role;
  const { user } = useSelector((state: any) => state.user) || {};

  // Fetch class info
  useEffect(() => {
    const fetchClassInfo = async () => {
      try {
        const { data } = await axios.get(
          `http://localhost:8080/api/classrooms/${classroomId}`,
          { withCredentials: true }
        );
        console.log(data);
        setClassInfo(data);
      } catch (err) {
        console.error("Error fetching class info:", err);
      }
    };

    fetchClassInfo();
  }, [classroomId]);

  // Fetch participants
  useEffect(() => {
    const fetchParticipants = async () => {
      try {
        const { data } = await axios.get(
          `http://localhost:8080/api/classrooms/${classroomId}/participants`,
          { withCredentials: true }
        );
        setParticipants(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchParticipants();
  }, [classroomId]);

  // Fetch assignments
  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const { data } = await axios.get(
          `http://localhost:8080/api/classrooms/assignments/${classroomId}/assignments`,
          { withCredentials: true }
        );
        setAssignments(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchAssignments();
  }, [classroomId]);

  // Fetch announcements
  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const { data } = await axios.get(
          `http://localhost:8080/api/announcements/${classroomId}`,
          { withCredentials: true }
        );
        setAnnouncements(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchAnnouncements();
  }, [classroomId]);

  const handleRoleUpdate = (userId: number, newRole: string) => {
    setParticipants((prevParticipants) =>
      prevParticipants.map((user) =>
        user.id === String(userId) ? { ...user, role: newRole } : user
      )
    );
  };  

  // Update assignments after new creation
  const updateAssignments = async () => {
    try {
      const { data } = await axios.get(
        `http://localhost:8080/api/classrooms/assignments/${classroomId}/assignments`,
        { withCredentials: true }
      );
      setAssignments(data);
    } catch (error) {
      console.error(error);
    }
  };

  // Update announcements after new creation
  const updateAnnouncements = async () => {
    try {
      const { data } = await axios.get(
        `http://localhost:8080/api/announcements/${classroomId}`,
        { withCredentials: true }
      );
      setAnnouncements(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const fetchDoubts = async () => {
      try {
        const { data } = await axios.get(
          `http://localhost:8080/api/doubts/${classroomId}`,
          { withCredentials: true }
        );
        // console.log('fetched doubts : ', doubts);
        setDoubts(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchDoubts();
  }, [classroomId]);

  // Update doubts after new creation
  const updateDoubts = async () => {
    try {
      const { data } = await axios.get(
        `http://localhost:8080/api/doubts/${classroomId}`,
        { withCredentials: true }
      );
      setDoubts(data);
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-blue-50 to-white">
        <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-blue-600 font-medium">Loading classroom...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-red-50">
        <div className="p-8 bg-white rounded-lg shadow-lg text-center">
          <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 text-red-600">
            <svg
              className="w-8 h-8"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h3 className="mb-2 text-xl font-semibold text-red-800">
            Error Loading Classroom
          </h3>
          <p className="mb-4 text-gray-600">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <ScrollArea className="h-screen">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto p-6  text-white"
      > 
        {classInfo && (
          <div className="mb-8">
            <motion.div
              initial={{ y: -20 }}
              animate={{ y: 0 }}
              transition={{ delay: 0.1 }}
              className="flex items-center justify-between"
            >
              <div>
                <h1 className="text-3xl font-bold text-gray-200 mb-1">
                  {classInfo.className || "Class Name"}
                </h1>
                <p className="text-gray-600">
                  {classInfo.description || ""}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <div className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                  {role || "Role"}
                </div>
                <div className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                  {classInfo.subject || "Subject"}
                </div>
              </div>
            </motion.div>
          </div>
        )} 

        <Tabs defaultValue="assignments" className="w-full max-w-7xl mx-auto mt-20 ">
          <TabsList className=" p-1 rounded-xl shadow-md mb-8 flex w-full bg- py-3">
            <TabsTrigger
              value="assignments"
              className="flex-1 data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 flex items-center justify-center space-x-2 py-3"
            >
              <Calendar className="w-5 h-5" />
              <span>Assignments</span>
            </TabsTrigger>
            <TabsTrigger
              value="participants"
              className="flex-1 data-[state=active]:bg-purple-50 data-[state=active]:text-purple-700 flex items-center justify-center space-x-2 py-3"
            >
              <Users className="w-5 h-5" />
              <span>People</span>
            </TabsTrigger>
            <TabsTrigger
              value="announcements"
              className="flex-1 data-[state=active]:bg-amber-50 data-[state=active]:text-amber-700 flex items-center justify-center space-x-2 py-3"
            >
              <Bell className="w-5 h-5" />
              <span>Announcements</span>
            </TabsTrigger>
            <TabsTrigger
              value="doubts"
              className="flex-1 data-[state=active]:bg-emerald-50 data-[state=active]:text-emerald-700 flex items-center justify-center space-x-2 py-3"
            >
              <HelpCircle className="w-5 h-5" />
              <span>Doubts</span>
            </TabsTrigger>
          </TabsList>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <TabsContent value="assignments" className="focus:outline-none">
              <AssignmentsTab
                assignments={assignments}
                classroomId={classroomId}
                role={role}
                onAssignmentCreated={updateAssignments}
              />
            </TabsContent>

            <TabsContent value="participants" className="focus:outline-none">
              <ParticipantsTab
                participants={participants}
                classRoomId={classroomId || ""}
                onRoleUpdate={handleRoleUpdate}
                Role={role || ""}
              />
            </TabsContent>

            <TabsContent value="announcements" className="focus:outline-none">
              <AnnouncementsTab
                announcements={announcements}
                assignments={assignments}
                classroomId={classroomId}
                role={role}
                user={user}
                onAnnouncementCreated={updateAnnouncements}
              />
            </TabsContent>

            <TabsContent value="resources" className="focus:outline-none">
              <div className="flex flex-col items-center justify-center py-20 bg-white rounded-lg shadow-sm border border-gray-100">
                <BookOpen className="w-16 h-16 text-emerald-400 mb-4" />
                <h3 className="text-xl font-medium text-gray-800 mb-2">
                  Resources Coming Soon
                </h3>
                <p className="text-gray-600 text-center max-w-md">
                  This feature is currently under development. Check back soon
                  for class materials, readings, and more!
                </p>
              </div>
            </TabsContent>

            <TabsContent value="doubts" className="focus:outline-none">
              <DoubtsTab
                doubts={doubts}
                classroomId={classroomId}
                role={role}
                user={user}
                onDoubtCreated={updateDoubts}
              />
            </TabsContent>

          </motion.div>
        </Tabs>
      </motion.div>
      <Toaster />
    </ScrollArea>
  );
};

export default ViewClass;
