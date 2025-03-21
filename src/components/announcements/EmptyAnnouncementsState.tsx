import React from "react";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Bell, Plus } from "lucide-react";

interface EmptyAnnouncementsStateProps {
  role: string | undefined;
  onCreateClick: () => void;
}

const EmptyAnnouncementsState: React.FC<EmptyAnnouncementsStateProps> = ({
  role,
  onCreateClick,
}) => {
  const isStudent = role === "STUDENT";

  return (
    <Card className="py-10">
      <CardContent className="flex flex-col items-center justify-center text-center">
        <Bell className="w-12 h-12 text-gray-300 mb-4" />
        <h3 className="text-xl font-medium text-gray-700 mb-2">
          No announcements yet
        </h3>
        <p className="text-gray-500 mb-6 max-w-md">
          Announcements from your instructors will appear here.
        </p>
        {!isStudent && (
          <Button
            onClick={onCreateClick}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create First Announcement
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default EmptyAnnouncementsState;