import React, { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { Badge } from "../components/ui/badge";
import { Separator } from "../components/ui/separator";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog";
import {
  Plus,
  MessageCircle,
  Calendar,
  Clock,
  User,
  Bell,
  ChevronRight,
  Send,
  Trash,
  MoreVertical,
} from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";
import CommentsService from "../components/CommentsService";
import { Assignment } from "../types/Assignment";
import { ScrollArea } from "../components/ui/scroll-area";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";

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
  const [commentInputs, setCommentInputs] = useState<{ [key: string]: string }>(
    {}
  );
  const [comments, setComments] = useState<{ [key: string]: any[] }>({});
  const [announcementTitle, setAnnouncementTitle] = useState("");
  const [announcementContent, setAnnouncementContent] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [expandedComments, setExpandedComments] = useState<{
    [key: string]: boolean;
  }>({});
  const userEmail = localStorage.getItem("useremail");
  const [announcementFile, setAnnouncementFile] = useState<File | null>(null);

  useEffect(() => {
    announcements.forEach((announcement) => {
      fetchComments(announcement.id);
    });
  }, [announcements]);

  const handleAddAnnouncement = async () => {
    if (!announcementTitle.trim() || !announcementContent.trim()) {
      toast.error("Please fill in both fields");
      return;
    }

    const formData = new FormData();
    formData.append("title", announcementTitle);
    formData.append("content", announcementContent);
    formData.append("classId", classroomId || "");
    formData.append("userEmail", userEmail || "");
    if (announcementFile) {
      formData.append("file", announcementFile);
    }

    try {
      await axios.post(
        `http://localhost:8080/api/announcements/create`,
        formData,
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      toast.success("Announcement added successfully!");
      setShowAnnouncementModal(false);
      setAnnouncementTitle("");
      setAnnouncementContent("");
      setAnnouncementFile(null);
      onAnnouncementCreated();
    } catch (error) {
      toast.error("Failed to add announcement.");
      console.error(error);
    }
  };

  const handleAddComment = async (announceId: string, commentTxt: string) => {
    if (!user?.id || !announceId || commentTxt === "") {
      toast.info("Please enter a comment");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:8080/api/comments/add",
        {
          userId: user.id,
          announcementId: announceId,
          content: commentTxt,
        },
        {
          withCredentials: true,
        }
      );

      setCommentInputs((prev) => ({
        ...prev,
        [announceId]: "",
      }));

      fetchComments(announceId);
    } catch (error) {
      toast.error("Error adding comment");
      console.error("Error adding comment:", error);
    }
  };

  const handleDeleteComment = async (
    announcementId: string,
    commentId: string
  ) => {
    try {
      await axios.delete(`http://localhost:8080/api/comments/${commentId}`, {
        withCredentials: true,
        params: { userEmail: user?.email },
      });

      fetchComments(announcementId);
      toast.success("Comment deleted successfully!");
    } catch (error) {
      toast.error("Failed to delete comment.");
      console.error("Error deleting comment:", error);
    }
  };

  const fetchComments = async (announcementId: string) => {
    try {
      const result = await CommentsService.getCommentsByAnnouncement(
        announcementId
      );
      setComments((prev) => ({
        ...prev,
        [announcementId]: result,
      }));
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  const toggleComments = (announcementId: string) => {
    setExpandedComments((prev) => ({
      ...prev,
      [announcementId]: !prev[announcementId],
    }));
  };

  const getInitials = (email: string) => {
    if (!email) return "U";
    return email
      .split("@")[0]
      .split(".")
      .map((part) => part[0])
      .join("")
      .toUpperCase();
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
    }).format(date);
  };

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-200">
          Class Announcements
        </h2>
        {role !== "STUDENT" && (
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
            <DialogContent className="sm:max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create New Announcement</DialogTitle>
                <DialogDescription>
                  Post an announcement to the class. All students will receive a
                  notification.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Title
                  </label>
                  <Input
                    placeholder="Enter announcement title"
                    value={announcementTitle}
                    onChange={(e) => setAnnouncementTitle(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Content
                  </label>
                  <Textarea
                    placeholder="Enter announcement content"
                    rows={5}
                    value={announcementContent}
                    onChange={(e) => setAnnouncementContent(e.target.value)}
                    className="resize-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Attach File
                  </label>
                  <Input
                    type="file"
                    onChange={(e) =>
                      setAnnouncementFile(e.target.files?.[0] || null)
                    }
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setShowAnnouncementModal(false)}
                >
                  Cancel
                </Button>
                <Button onClick={handleAddAnnouncement}>
                  Post Announcement
                </Button>
              </DialogFooter>
            </DialogContent>
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
          <Card className="bg-white shadow-sm sticky top-6">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <Calendar className="w-4 h-4 text-blue-500" />
                <span>Upcoming Assignments</span>
              </CardTitle>
            </CardHeader>
            <Separator />
            <CardContent className="pt-4">
              {assignments.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-6 text-center">
                  <Badge
                    variant="outline"
                    className="mb-2 bg-green-50 text-green-600 border-green-200"
                  >
                    All caught up!
                  </Badge>
                  <p className="text-sm text-gray-500">
                    No upcoming assignments
                  </p>
                </div>
              ) : (
                <ScrollArea className="max-h-96 pr-4">
                  {assignments
                    .filter(
                      (assignment) => new Date(assignment.dueDate) > new Date()
                    )
                    .sort(
                      (a, b) =>
                        new Date(a.dueDate).getTime() -
                        new Date(b.dueDate).getTime()
                    )
                    .slice(0, 5)
                    .map((assignment) => (
                      <div
                        key={assignment.id}
                        className="p-3 rounded-lg bg-gray-50 mb-3 last:mb-0 border border-gray-100 hover:border-blue-200 hover:bg-blue-50 transition-all duration-200 cursor-pointer group"
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="font-medium text-gray-800 mb-1 group-hover:text-blue-600 transition-colors">
                              {assignment.title}
                            </h4>
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                              <Clock className="w-3 h-3" />
                              <p>
                                Due:{" "}
                                {new Date(
                                  assignment.dueDate
                                ).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-blue-500 transition-colors" />
                        </div>
                      </div>
                    ))}
                </ScrollArea>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-3 space-y-6">
          {announcements.length === 0 ? (
            <Card className="py-10">
              <CardContent className="flex flex-col items-center justify-center text-center">
                <Bell className="w-12 h-12 text-gray-300 mb-4" />
                <h3 className="text-xl font-medium text-gray-700 mb-2">
                  No announcements yet
                </h3>
                <p className="text-gray-500 mb-6 max-w-md">
                  Announcements from your instructors will appear here.
                </p>
                {role !== "STUDENT" && (
                  <Button
                    onClick={() => setShowAnnouncementModal(true)}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Create First Announcement
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            announcements
              .filter((announcement) => {
                if (activeTab === "recent") {
                  const oneWeekAgo = new Date();
                  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
                  return new Date(announcement.createdAt) >= oneWeekAgo;
                }
                return true;
              })
              .map((announcement) => (
                <Card
                  key={announcement.id}
                  className="bg-white shadow-sm overflow-hidden"
                >
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
                            {announcement.author.email} •{" "}
                            {formatDate(announcement.createdAt)}
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
                    <div className="w-full">
                      <div className="flex items-center gap-2 mb-3">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-gray-500 hover:text-blue-600"
                          onClick={() => toggleComments(announcement.id)}
                        >
                          <MessageCircle className="w-4 h-4 mr-1" />
                          {comments[announcement.id]?.length || 0} Comments
                        </Button>
                      </div>

                      {expandedComments[announcement.id] &&
                        comments[announcement.id]?.length > 0 && (
                          <div className="bg-gray-50 p-3 rounded-lg mb-3 space-y-3 max-h-60 overflow-y-auto">
                            {comments[announcement.id]?.map((comment, idx) => (
                              <div
                                key={idx}
                                className="flex items-start gap-2 group"
                              >
                                <Avatar className="w-8 h-8">
                                  <AvatarImage
                                    src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                                      comment.author?.email || "User"
                                    )}&background=random`}
                                  />
                                  <AvatarFallback>
                                    {getInitials(
                                      comment.author?.email || "User"
                                    )}
                                  </AvatarFallback>
                                </Avatar>
                                <div className="bg-white rounded-lg p-3 flex-1 shadow-sm relative">
                                  <div className="flex justify-between items-center mb-1">
                                    <p className="text-xs font-medium">
                                      {comment.author?.email || "User"}
                                    </p>
                                    <span className="text-xs text-gray-400">
                                      {formatDate(comment.createdAt)}
                                    </span>
                                  </div>
                                  <p className="text-sm pr-6">
                                    {comment.content}
                                  </p>

                                  {comment.author?.email === user?.email && (
                                    <div className="absolute top-3 right-3">
                                      <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                          <Button
                                            variant="ghost"
                                            size="sm"
                                            className="h-7 w-7 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                                          >
                                            <MoreVertical className="h-4 w-4 text-gray-400" />
                                          </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent
                                          align="end"
                                          className="w-36"
                                        >
                                          <DropdownMenuItem
                                            className="text-red-500 focus:text-red-500 cursor-pointer flex items-center gap-2"
                                            onClick={() =>
                                              handleDeleteComment(
                                                announcement.id,
                                                comment.id
                                              )
                                            }
                                          >
                                            <Trash className="h-4 w-4" />
                                            <span>Delete</span>
                                          </DropdownMenuItem>
                                        </DropdownMenuContent>
                                      </DropdownMenu>
                                    </div>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}

                      <div className="flex items-center gap-2">
                        <Avatar className="w-8 h-8">
                          <AvatarImage
                            src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                              user?.email || "User"
                            )}&background=random`}
                          />
                          <AvatarFallback>
                            {getInitials(user?.email || "User")}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 relative">
                          <Input
                            placeholder="Add a comment..."
                            className="pl-3 pr-10 py-2 h-10"
                            value={commentInputs[announcement.id] || ""}
                            onChange={(e) =>
                              setCommentInputs((prev) => ({
                                ...prev,
                                [announcement.id]: e.target.value,
                              }))
                            }
                            onKeyDown={(e) => {
                              if (e.key === "Enter" && !e.shiftKey) {
                                e.preventDefault();
                                handleAddComment(
                                  announcement.id,
                                  commentInputs[announcement.id] || ""
                                );
                              }
                            }}
                          />
                          <Button
                            size="icon"
                            variant="ghost"
                            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-blue-600 h-6 w-6"
                            onClick={() =>
                              handleAddComment(
                                announcement.id,
                                commentInputs[announcement.id] || ""
                              )
                            }
                          >
                            <Send className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardFooter>
                </Card>
              ))
          )}
        </div>
      </div>
    </>
  );
};

export default AnnouncementsTab;
