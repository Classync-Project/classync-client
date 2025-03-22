import React, { useState } from "react";
import { Button } from "../ui/button";
import { Plus } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";
import AnnouncementForm from "./AnnouncementForm";
import AnnouncementList from "./AnnouncementList";
import UpcomingAssignments from "./UpcomingAssignments";
import EmptyAnnouncementsState from "./EmptyAnnouncementsState";
import { Dialog, DialogTrigger } from "../ui/dialog";

interface AnnouncementsTabProps {
  announcements: any[];
  assignments: Assignment[];
  classroomId: string | undefined;
  role: string | undefined;
  user: any;
  onAnnouncementCreated: () => void;
}

const AnnouncementsTab: React.FC<AnnouncementsTabProps> = ({
  announcements,
  assignments,
  classroomId,
  role,
  user,
  onAnnouncementCreated,
}) => {
  const [showAnnouncementModal, setShowAnnouncementModal] = useState(false);
  const [activeTab, setActiveTab] = useState("all");

  const filteredAnnouncements = announcements.length == 0 ? [] : announcements.filter((announcement) => {
    if (activeTab === "recent") {
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      return new Date(announcement.createdAt) >= oneWeekAgo;
    }
    return true;
  });

  const isStudent = role === "STUDENT";

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-200">
          Class Announcements
        </h2>
        {!isStudent && (
          <Dialog
            open={showAnnouncementModal}
            onOpenChange={setShowAnnouncementModal}
          >
            <DialogTrigger asChild>
              <Button
                className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
                size="sm"
              >
                <Plus className="w-4 h-4" />
                <span>New Announcement</span>
              </Button>
            </DialogTrigger>
            <AnnouncementForm
              classroomId={classroomId}
              onSuccess={() => {
                setShowAnnouncementModal(false);
                onAnnouncementCreated();
              }}
              onCancel={() => setShowAnnouncementModal(false)}
            />
          </Dialog>
        )}
      </div>

      <Tabs
        defaultValue="all"
        className="mb-6"
        value={activeTab}
        onValueChange={setActiveTab}
      >
        <TabsList className="mb-4">
          <TabsTrigger value="all">All Announcements</TabsTrigger>
          <TabsTrigger value="recent">Recent</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="grid gap-6 lg:grid-cols-4 md:grid-cols-1">
        <div className="lg:col-span-1">
          <UpcomingAssignments assignments={assignments} />
        </div>

        <div className="lg:col-span-3 space-y-6">
          {filteredAnnouncements.length === 0 ? (
            <EmptyAnnouncementsState
              role={role}
              onCreateClick={() => setShowAnnouncementModal(true)}
            />
          ) : (
            <AnnouncementList
              announcements={filteredAnnouncements}
              user={user}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default AnnouncementsTab;