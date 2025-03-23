import React, { useEffect } from "react";
import { useLocation, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { Toaster } from "../components/ui/sonner";
import { ScrollArea } from "../components/ui/scroll-area";
import { TabsContent } from "../components/ui/tabs";
import { motion } from "framer-motion";

// Types
import { RootState } from "../types/RootState";

// Custom hooks
import { useClassInfo } from "../hooks/useClassInfo";
import { useParticipants } from "../hooks/useParticipants";
import { useAssignments } from "../hooks/useAssignments";
import { useAnnouncements } from "../hooks/useAnnouncements";
import { useDoubts } from "../hooks/useDoubts";

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

interface LocationState {
  role?: string;
}

const ViewClass: React.FC = () => {
  const { classroomId } = useParams<{ classroomId: string }>();
  const location = useLocation();
  const { role } = (location.state as LocationState) || {};
  const { user } = useSelector((state: RootState) => state.user);

  // Custom hooks for data fetching
  const { classInfo, loading: classLoading, error: classError } = useClassInfo(classroomId);
  const {
    participants,
    loading: participantsLoading,
    error: participantsError,
    handleRoleUpdate
  } = useParticipants(classroomId);
  const {
    assignments,

    refreshAssignments
  } = useAssignments(classroomId);
  const {
    announcements,

    refreshAnnouncements
  } = useAnnouncements(classroomId);
  const {
    doubts,

    refreshDoubts
  } = useDoubts(classroomId);

  // Store role in localStorage
  useEffect(() => {
    if (role && classroomId) {
      localStorage.setItem(`classroom-${classroomId}-role`, role);
    }
  }, [role, classroomId]);

  // Determine if we're in a loading state
  const isLoading = classLoading || participantsLoading;

  // Determine if we have any errors
  const error = classError || participantsError;

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
        <ClassHeader classInfo={classInfo} role={role} />

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


          <TabsContent value='ai-assistant' className="focus:outline-none">
            <AIAssistantTab
              classroomId={classroomId || ""}
              user={user}
            />
          </TabsContent>
        </ClassroomTabs>
      </motion.div>
      <Toaster />
    </ScrollArea>
  );
};

export default ViewClass;
