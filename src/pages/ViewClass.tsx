import React, { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { Toaster } from "../components/ui/sonner";
import { ScrollArea } from "../components/ui/scroll-area";
import { TabsContent } from "../components/ui/tabs";
import { motion } from "framer-motion";
import { UserPlus, Send, X } from "lucide-react";

// Types
import { RootState } from "../types/RootState";

// Custom hooks
// import
import { useClassInfo } from "../hooks/useClassInfo";
import { useParticipants } from "../hooks/useParticipants";
import { useAssignments } from "../hooks/useAssignments";
import { useAnnouncements } from "../hooks/useAnnouncements";
import { useDoubts } from "../hooks/useDoubts";
import useCheckClassroomAccess from "../hooks/useCheckClassroomAccess"; // Import the new hook

// Components
import ClassHeader from "../components/classroom/ClassHeader";
import ClassroomTabs from "../components/classroom/ClassroomTabs";
import LoadingSpinner from "../components/common/LoadingSpinner";
import ErrorDisplay from "../components/common/ErrorDisplay";
import ParticipantsTab from "../components/classroom/tabs/ParticipantsTab";
import AssignmentsTab from "../components/classroom/tabs/AssignmentsTab";
import AnnouncementsTab from "../components/announcements/AnnouncementsTab";
import DoubtsTab from "../components/classroom/tabs/DoubtsTab";
import AIAssistantTab from "../components/classroom/tabs/ai-assistant-tab";
import { toast } from "react-toastify";
import axios from "axios";

interface LocationState {
  role?: string;
}

// Email Form Component
const EmailForm = ({ onSubmit, onCancel, isSubmitting }) => {
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(email);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-gray-800 bg-opacity-90 backdrop-blur-md p-6 rounded-lg border border-blue-500 shadow-lg w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-blue-100">
            Share Classroom Code
          </h3>
          <button
            onClick={onCancel}
            className="p-1 rounded-full hover:bg-blue-800 text-blue-300"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-blue-200 mb-1"
            >
              Email Address
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter recipient's email"
              required
              className="w-full px-3 py-2 bg-gray-800 text-white border border-blue-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder-blue-400"
            />
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 bg-gray-800 text-blue-200 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-500 focus:outline-none focus:ring-2 focus:ring-green-400 flex items-center transition-colors"
            >
              <Send className="mr-2 h-4 w-4" />
              {isSubmitting ? "Sending..." : "Send"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const ViewClass: React.FC = () => {
  const { classroomId } = useParams<{ classroomId: string }>();
  const location = useLocation();
  const { role } = (location.state as LocationState) || {};
  const { user } = useSelector((state: RootState) => state.user);
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [isSendingEmail, setIsSendingEmail] = useState(false);

  // Check if the user has access to the classroom
  const hasAccess = useCheckClassroomAccess();

  // Custom hooks for data fetching
  const {
    classInfo,
    loading: classLoading,
    error: classError,
  } = useClassInfo(classroomId);
  const {
    participants,
    loading: participantsLoading,
    error: participantsError,
    handleRoleUpdate,
  } = useParticipants(classroomId);
  const { assignments, refreshAssignments } = useAssignments(classroomId);
  const { announcements, refreshAnnouncements } = useAnnouncements(classroomId);
  const { doubts, refreshDoubts } = useDoubts(classroomId);

  // Store role in localStorage
  useEffect(() => {
    if (role && classroomId) {
      localStorage.setItem(`classroom-${classroomId}-role`, role);
    }
  }, [role, classroomId]);

  // Handle email submission

  const handleSendEmail = async (email: string) => {
    setIsSendingEmail(true);
    const className = classInfo?.className;
    console.log(classInfo?.classroomCode);
    // console.log("class info is " +);
    try {
      // Ensure className is defined
      if (!className) {
        throw new Error("Class name is undefined.");
      }

      // Prepare welcome email content
      const subject = `${className} Classroom Code Shared – Join Now!`;
      const message = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
          <h2 style="color: #4a64e1;">Join ${className} Today!</h2>
          <p>Hello,</p>
          <p>The classroom code for <strong>${className}</strong> has been shared with you! Please use this code to join the class and continue your learning journey.</p>
    
          <h3 style="color: #4a64e1; margin-top: 20px;">How to Join:</h3>
          <ul>
            <li>Use the provided classroom code ${classInfo?.classroomCode} to access the class</li>
            <li>Check the Assignments tab for upcoming tasks and deadlines</li>
            <li>Stay updated with Announcements and participate in discussions</li>
            <li>Engage with classmates in the Participants section</li>
          </ul>
    
          <p>Keep working hard and make the most of your learning experience. Happy learning!</p>
          <p style="margin-top: 30px;">Best regards,<br>The ${className} Team</p>
        </div>
      `;

      // Send the email request
      await axios.post(
        "http://localhost:8080/api/mail/send",
        {
          to: email,
          subject: subject,
          message: message,
        },
        { withCredentials: true }
      );

      toast.success(`Classroom Code has been shared successfully!`);
      setShowEmailForm(false);
    } catch (error) {
      toast.error("Failed to send invitation email");
      console.error("Error sending invitation:", error);
    } finally {
      setIsSendingEmail(false);
    }
  };

  // Determine if we're in a loading state
  const isLoading = classLoading || participantsLoading;

  // Determine if we have any errors
  const error = classError || participantsError;

  // If the user doesn't have access, don't render the page
  if (!hasAccess) {
    return null;
  }

  if (isLoading) {
    return <LoadingSpinner message="Loading classroom..." />;
  }

  if (error) {
    return <ErrorDisplay error={error} />;
  }

  return (
    <ScrollArea className="h-screen">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto p-6 text-white"
      >
        <div className="flex items-center mb-6">
          <div className="w-1/4"></div>

          {/* Add padding to the container instead */}
          <div className="flex-1 flex justify-center px-8">
            <ClassHeader classInfo={classInfo} role={role} />
          </div>

          <div className="w-1/4 flex justify-end">
            {(role === "TEACHER" || role === "CREATOR") && (
              <button
                onClick={() => setShowEmailForm(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-400 flex items-center transition-colors"
              >
                <UserPlus className="mr-2 h-4 w-4" />
                Invite
              </button>
            )}
          </div>
        </div>
        <ClassroomTabs defaultTab="assignments">
          <TabsContent value="assignments" className="focus:outline-none">
            <AssignmentsTab
              assignments={assignments}
              classroomId={classroomId || ""}
              role={role}
              onAssignmentCreated={refreshAssignments}
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
              classroomId={classroomId || ""}
              role={role}
              user={user}
              onAnnouncementCreated={refreshAnnouncements}
            />
          </TabsContent>

          <TabsContent value="doubts" className="focus:outline-none">
            <DoubtsTab
              doubts={doubts}
              classroomId={classroomId || ""}
              role={role}
              user={user}
              onDoubtCreated={refreshDoubts}
            />
          </TabsContent>

          <TabsContent value="ai-assistant" className="focus:outline-none">
            <AIAssistantTab classroomId={classroomId || ""} user={user} />
          </TabsContent>
        </ClassroomTabs>
      </motion.div>

      {/* Email Form Modal */}
      {showEmailForm && (
        <EmailForm
          onSubmit={handleSendEmail}
          onCancel={() => setShowEmailForm(false)}
          isSubmitting={isSendingEmail}
        />
      )}

      <Toaster />
    </ScrollArea>
  );
};

export default ViewClass;
