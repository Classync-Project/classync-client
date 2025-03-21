import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "../ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { User } from "lucide-react";
import { Separator } from "../ui/separator";
import { formatDate, getInitials } from "../../utils/formatters";
import CommentSection from "./CommentSection";

interface AnnouncementCardProps {
  announcement: any;
  user: any;
}

const AnnouncementCard: React.FC<AnnouncementCardProps> = ({
  announcement,
  user,
}) => {

  return (
    <Card className="bg-white shadow-sm overflow-hidden">
      <CardHeader className="pb-3 bg-gray-50">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            <Avatar className="w-10 h-10 border">
              <AvatarImage
                src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                  announcement.author.email
                )}&background=random`}
              />
              <AvatarFallback>
                {getInitials(announcement.author.email)}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-lg font-semibold text-gray-800">
                {announcement.title}
              </CardTitle>
              <CardDescription className="flex items-center gap-1 mt-1">
                <User className="w-3 h-3" />
                {announcement.author.email} • {formatDate(announcement.createdAt)}
              </CardDescription>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="py-4">
        <p className="text-gray-700 whitespace-pre-line">
          {announcement.content}
        </p>
        {announcement.fileUrl && (
          <div className="mt-2">
            <a
              href={announcement.fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              View Attached File
            </a>
          </div>
        )}
      </CardContent>
      <Separator />
      <CardFooter className="pt-3 pb-4 flex flex-col">
        <CommentSection
          announcementId={announcement.id}
          user={user}
        />
      </CardFooter>
    </Card>
  );
};

export default AnnouncementCard;