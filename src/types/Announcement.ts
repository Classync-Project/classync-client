export interface Announcement {
    id: string;
    title: string;
    content: string;
    createdBy: {
      id: string;
      name: string;
    };
    createdAt: string;
    classroomId: string;
  }