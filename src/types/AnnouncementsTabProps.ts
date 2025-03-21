export interface AnnouncementsTabProps {
    announcements: any[];
    assignments: Assignment[];
    classroomId: string | undefined;
    role: string | undefined;
    user: any;
    onAnnouncementCreated: () => void;
  }