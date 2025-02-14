import React, { useEffect, useState } from "react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "../components/ui/card";
import { Participants } from "../types/Participants";
import axios from "axios";
import { toast } from "react-toastify";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Assignment } from "../types/Assignment";
import CreateAssignment from "./CreateAssignment";
import { Button } from "../components/ui/button";
import CommentsService from "../components/CommentsService";
import { useSelector } from "react-redux";
import { Calendar, Users, Bell, Plus, X, Clock, Download, MessageCircle } from "lucide-react";
import ParticipantsTab from "../components/ParticipantsTab";


const ViewClass: React.FC = () => {
  const { classroomId } = useParams<{ classroomId: string }>();
  const [participants, setParticipants] = useState<Participants[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [showAnnouncementModal, setShowAnnouncementModal] = useState(false);
  const [commentInputs, setCommentInputs] = useState<{ [key: string]: string }>(
    {}
  ); // State to manage comment inputs for each announcement
  const [comments, setComments] = useState({});
  const { user } = useSelector((state: any) => state.user) || {};
  console.log(user);

  const userEmail = localStorage.getItem("useremail");
  const navigate = useNavigate();
  const location = useLocation();
  const role = location.state?.role;
  console.log("Role : ", role);
  // const { user } = useSelector((state: any) => state.user) || {};
  // console.log("user : ", user);

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

  // Handle adding a new announcement
  const handleAddAnnouncement = async (title: string, content: string) => {
    try {
      await axios.post(
        `http://localhost:8080/api/announcements/create`,
        {
          title,
          content,
          classId: classroomId,
          userEmail,
        },
        { withCredentials: true }
      );

      toast.success("Announcement added successfully!");
      setShowAnnouncementModal(false);

      // Fetch updated announcements
      const { data } = await axios.get(
        `http://localhost:8080/api/announcements/${classroomId}`,
        { withCredentials: true }
      );
      setAnnouncements(data);
    } catch (error) {
      toast.error("Failed to add announcement.");
      console.error(error);
    }
  };

  const handleAddComment = async (announceId, commentTxt) => {
    console.log("Hello in adding comment!");

    if (!user.id || !announceId || commentTxt == "") {
      console.log("Please validate your annoucement!!");
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

      console.log("Comment added successfully:", response.data);
    } catch (error) {
      console.error("Error adding comment:");
    }
  };

  const fetchComments = async (announcementId) => {
    const result = await CommentsService.getCommentsByAnnouncement(
      announcementId
    );
    setComments((prev) => ({
      ...prev,
      [announcementId]: result,
    }));
  };

  // Fetch participants
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


  const handleRoleUpdate = (userId: number, newRole: string) => {
    setParticipants((prevParticipants) =>
      prevParticipants.map((user) =>
        user.id === userId ? { ...user, role: newRole } : user
      )
    );
  };


  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="p-6 bg-red-50 rounded-lg text-red-600">
          Error: {error}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <Tabs defaultValue="assignments" className="w-full max-w-7xl mx-auto">
        <TabsList className="bg-white p-1 rounded-xl shadow-sm mb-6">
          <TabsTrigger
            value="assignments"
            className="flex items-center space-x-2"
          >
            <Calendar className="w-4 h-4" />
            <span>Assignments</span>
          </TabsTrigger>
          <TabsTrigger
            value="participants"
            className="flex items-center space-x-2"
          >
            <Users className="w-4 h-4" />
            <span>Participants</span>
          </TabsTrigger>
          <TabsTrigger
            value="announcements"
            className="flex items-center space-x-2"
          >
            <Bell className="w-4 h-4" />
            <span>Announcements</span>
          </TabsTrigger>
        </TabsList>


        <TabsContent value="assignments">
          <div className="flex justify-end mb-6">
            <Button
              onClick={() => setShowModal(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>New Assignment</span>
            </Button>
          </div>

          <div className="">
            {assignments.length === 0 ? (
              <div className="col-span-full flex items-center justify-center p-12 bg-white rounded-xl shadow-sm">
                <p className="text-gray-500">No assignments available</p>
              </div>
            ) : (
              assignments.map((assignment) => (
                <Card
                  key={assignment.id}
                  className="w-full hover:shadow-lg transition-shadow duration-200 cursor-pointer bg-white"
                  onClick={() =>
                    navigate(
                      `/classrooms/${classroomId}/assignments/${assignment.id}`
                    )
                  }
                >
                  <CardHeader>
                    <CardTitle className="text-xl font-semibold text-gray-800">
                      {assignment.title}
                    </CardTitle>
                    <CardDescription className="line-clamp-2">
                      {assignment.content}
                    </CardDescription>
                  </CardHeader>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        <ParticipantsTab
          participants={participants || ""}
          classRoomId={classroomId || ""}
          onRoleUpdate={handleRoleUpdate}
        />


        <TabsContent value="announcements">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">
              Class Announcements
            </h2>
            <Button
              onClick={() => setShowAnnouncementModal(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>New Announcement</span>
            </Button>
          </div>

          <div className="grid gap-6 grid-cols-4">
            <div className="col-span-1">
              <Card className="bg-white shadow-sm sticky top-6">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold">
                    Upcoming Due
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {
                    assignments.length == 0
                      ?
                      <>
                        <h2>Whooooo !! Currently No Assignment</h2>
                      </>
                      :
                      assignments
                        .filter(
                          (assignment) => new Date(assignment.dueDate) > new Date()
                        )
                        .sort(
                          (a, b) =>
                            new Date(a.dueDate).getTime() -
                            new Date(b.dueDate).getTime()
                        )
                        .slice(0, 3)
                        .map((assignment) => (
                          <div
                            key={assignment.id}
                            className="p-3 rounded-lg bg-gray-50 mb-3 last:mb-0 border border-gray-100"
                          >
                            <h4 className="font-medium text-gray-800 mb-1">
                              {assignment.title}
                            </h4>
                            <p className="text-sm text-gray-600">
                              Due:{" "}
                              {new Date(assignment.dueDate).toLocaleDateString()}
                            </p>
                          </div>
                        ))}
                </CardContent>
              </Card>
            </div>

            <div className="col-span-3 space-y-6">
              {announcements.map((announcement) => (
                <Card key={announcement.id} className="bg-white shadow-sm">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-xl font-semibold text-gray-800">
                          {announcement.title}
                        </CardTitle>
                        <CardDescription>
                          Posted by {announcement.author.email} on{" "}
                          {new Date(
                            announcement.createdAt
                          ).toLocaleDateString()}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-gray-700">{announcement.content}</p>
                    <div className="border-t pt-4">
                      <div className="flex items-center space-x-2">
                        <MessageCircle className="w-4 h-4 text-gray-400" />
                        <textarea
                          placeholder="Add a comment..."
                          className="flex-1 p-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 outline-none resize-none"
                          rows={1}
                          value={commentInputs[announcement.id] || ""}
                          onChange={(e) =>
                            setCommentInputs((prev) => ({
                              ...prev,
                              [announcement.id]: e.target.value,
                            }))
                          }
                        />
                        <Button
                          className="bg-blue-600 hover:bg-blue-700 text-white"
                          onClick={() =>
                            handleAddComment(
                              announcement.id,
                              commentInputs[announcement.id]
                            )
                          }
                        >
                          Comment
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>
      {/* Modals */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Create Assignment</h2>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <CreateAssignment onClose={() => setShowModal(false)} />
          </div>
        </div>
      )}
      {showAnnouncementModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">New Announcement</h2>
              <button
                onClick={() => setShowAnnouncementModal(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  id="announcementTitle"
                  className="w-full p-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 outline-none"
                  placeholder="Enter announcement title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Content
                </label>
                <textarea
                  id="announcementContent"
                  rows={4}
                  className="w-full p-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 outline-none resize-none"
                  placeholder="Enter announcement content"
                />
              </div>
              <div className="flex justify-end">
                <Button
                  onClick={() => {
                    const title = (
                      document.getElementById(
                        "announcementTitle"
                      ) as HTMLInputElement
                    ).value.trim();
                    const content = (
                      document.getElementById(
                        "announcementContent"
                      ) as HTMLTextAreaElement
                    ).value.trim();
                    if (!title || !content) {
                      toast.error("Please fill in both fields");
                      return;
                    }
                    handleAddAnnouncement(title, content);
                  }}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Post Announcement
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewClass;