import React from "react";
import AnnouncementCard from "./AnnouncementCard";

interface AnnouncementListProps {
  announcements: any[];
  user: any;
}

const AnnouncementList: React.FC<AnnouncementListProps> = ({ 
  announcements, 
  user 
}) => {
  return (
    <>
      {announcements.map((announcement) => (
        <AnnouncementCard
          key={announcement.id}
          announcement={announcement}
          user={user}
        />
      ))}
    </>
  );
};

export default AnnouncementList;