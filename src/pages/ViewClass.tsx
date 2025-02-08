import React, { useEffect, useState } from "react";
import "../style.css"; // Adjust the path as necessary
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
import { useNavigate, useParams } from "react-router-dom";
import { Assignment } from "../types/Assignment";
import CreateAssignment from "./CreateAssignment";
import { Button } from "../components/ui/button";

const ViewClass: React.FC = () => {
  const { classroomId } = useParams<{ classroomId: string }>();
  const [participants, setParticipants] = useState<Participants[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const navigate = useNavigate();

  const [showAnnouncementModal, setShowAnnouncementModal] = useState(false);

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const { data } = await axios.get(
          `http://localhost:8080/api/classrooms/assignments/${classroomId}/assignments`,
          { withCredentials: true }
        );
        console.log("assignments ", data);
        setAssignments(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchAssignments();
  }, [classroomId]);

  // Fetch Announcements
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

  // Function to handle adding a new announcement
  const handleAddAnnouncement = async (title: string, content: string) => {
    try {
      const userEmail = localStorage.getItem("useremail");
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

  //     // Fetch participants
  useEffect(() => {
    const fetchParticipants = async () => {
      try {
        const { data } = await axios.get(
          `http://localhost:8080/api/classrooms/${classroomId}/participants`,
          {
            withCredentials: true,
          }
        );
        setParticipants(data);
        console.log(" participants : ", data);
        if (data == null) {
          toast.error("No participants found");
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchParticipants();
  }, [classroomId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <Tabs defaultValue="assignments" className="w-full">
        <TabsList>
          <TabsTrigger value="assignments">Assignments</TabsTrigger>
          <TabsTrigger value="participants">Participants</TabsTrigger>
          <TabsTrigger value="announcements">Annoucements</TabsTrigger>
        </TabsList>

        <TabsContent value="assignments">
          <Button
            variant="outline"
            className="mb-4 "
            onClick={() => setShowModal(true)}
          >
            Add Assignment
          </Button>

          {/* Modal */}
          {showModal && (
            <div className="modal-backdrop">
              <div className="modal">
                <button
                  className="modal-close "
                  onClick={() => setShowModal(false)} // Close modal
                >
                  ×
                </button>
                <CreateAssignment />
              </div>
            </div>
          )}
          <Card>
            <CardHeader>
              <CardTitle>Assignments</CardTitle>
              <CardDescription>
                View and manage assignments for this classroom.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {assignments.length === 0 ? (
                <p>No Assignments Currently ...</p>
              ) : (
                <div className="space-y-4">
                  {assignments.map((assignment) => (
                    <div
                      key={assignment.id}
                      className="border p-4 rounded-lg"
                      onClick={() =>
                        navigate(
                          `/classrooms/${classroomId}/assignments/${assignment.id}`
                        )
                      }
                    >
                      <h3 className="font-semibold">{assignment.title}</h3>
                      <p className="text-sm text-gray-600">
                        {assignment.content}
                      </p>
                      {assignment.filePath && (
                        <a
                          href={`${assignment.filePath}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Download PDF
                        </a>
                      )}
                      <p>due date : {assignment.dueDate}</p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="participants">
          <Card>
            <CardHeader>
              <CardTitle>Participants</CardTitle>
              <CardDescription>
                List of all users in this classroom.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {participants.length === 0 ? (
                <p>No participants found.</p>
              ) : (
                <div className="space-y-4">
                  {participants.map((user) => (
                    <div key={user.id} className="border p-4 rounded-lg">
                      <h3 className="font-semibold">{user.fullName} </h3>
                      <p className="text-sm text-gray-600">{user.email}</p>
                      <p className="text-sm text-gray-600">{user.role}</p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="announcements">
          <Button onClick={() => setShowAnnouncementModal(true)}>
            Add Announcement
          </Button>

          {showAnnouncementModal && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
              <div className="bg-[#0A192F] text-white rounded-lg shadow-lg p-8 w-full max-w-md relative">
                {" "}
                {/* Modal container */}
                {/* Close Button */}
                <button
                  className="absolute top-4 right-4 bg-[#0d0d28] text-[#161d29] rounded-full w-8 h-8 flex items-center justify-center hover:bg-[#ab2f2f] transition-colors shadow-lg"
                  onClick={() => setShowAnnouncementModal(false)}
                >
                  ×
                </button>
                {/* Modal Content */}
                <h2 className="text-2xl font-bold mb-6">
                  Add New Announcement
                </h2>
                <input
                  type="text"
                  placeholder="Title"
                  className="bg-[#112240] text-white border border-[#233554] rounded-lg p-3 w-full mb-4 focus:outline-none focus:border-[#64FFDA]"
                  id="announcementTitle"
                  required
                />
                <textarea
                  placeholder="Content"
                  className="bg-[#112240] text-white border border-[#233554] rounded-lg p-3 w-full mb-6 focus:outline-none focus:border-[#64FFDA] resize-none"
                  id="announcementContent"
                  rows={4}
                  required
                ></textarea>
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
                      toast.error(
                        "Please fill in both the title and content fields."
                      );
                      return;
                    }

                    handleAddAnnouncement(title, content);
                  }}
                  className="w-full bg-[#64FFDA] text-[#0A192F] font-semibold py-2 rounded-lg hover:bg-[#52E3C2] transition-colors"
                >
                  Submit
                </Button>
              </div>
            </div>
          )}

          <Card className="bg-black text-white">
            <CardHeader>
              <div className="flex justify-center">
                {" "}
                {/* Center the title */}
                <CardTitle>Announcements</CardTitle>
              </div>

              <CardDescription className="text-gray-300">
                View all announcements in this classroom.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {announcements.length === 0 ? (
                <p className="text-gray-300">No Announcements Available...</p>
              ) : (
                <div className="flex gap-6">
                  {/* Upcoming Submissions Box */}
                  <div className="w-1/4">
                    <Card className="bg-[#112240] text-white">
                      <CardHeader>
                        <CardTitle>Upcoming Submissions</CardTitle>
                        <CardDescription className="text-gray-300">
                          Your next submission is due soon.
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        {assignments.length > 0 ? (
                          <div className="space-y-4">
                            {assignments
                              .filter(
                                (assignment) =>
                                  new Date(assignment.dueDate) > new Date()
                              ) // Filter upcoming assignments
                              .sort(
                                (b, a) =>
                                  new Date(a.dueDate).getTime() -
                                  new Date(b.dueDate).getTime()
                              ) // Sort by due date
                              .slice(0, 1) // Show only the next submission
                              .map((assignment) => (
                                <div
                                  key={assignment.id}
                                  className="border border-[#233554] rounded-lg p-4"
                                >
                                  <h3 className="font-semibold">
                                    {assignment.title}
                                  </h3>
                                  <p className="text-sm text-gray-300">
                                    Due:{" "}
                                    {new Date(
                                      assignment.dueDate
                                    ).toLocaleDateString()}
                                  </p>
                                </div>
                              ))}
                          </div>
                        ) : (
                          <p className="text-gray-300">
                            No upcoming submissions.
                          </p>
                        )}
                      </CardContent>
                    </Card>
                  </div>

                  {/* Announcements List */}
                  <div className="w-3/4 space-y-4">
                    {announcements.map((announcement) => (
                      <div
                        key={announcement.id}
                        className="border border-[#333] rounded-lg p-6   bg-cyan-950 text-white shadow-lg hover:shadow-xl transition-shadow duration-300"
                      >
                        <h3 className="font-semibold text-xl mb-2">
                          {announcement.title}
                        </h3>
                        <p className="text-sm text-gray-300 mb-4">
                          {announcement.content}
                        </p>
                        <div className="flex items-center text-sm text-gray-400">
                          <span className="mr-2">By:</span>
                          <span className="font-medium text-[#ffffff]">
                            {announcement.author.email}
                          </span>
                        </div>
                        <div className="mt-2 text-sm text-gray-400">
                          <span>Posted on: </span>
                          <span className="font-medium text-[#e8e8e8]">
                            {new Date(
                              announcement.createdAt
                            ).toLocaleDateString()}
                          </span>
                        </div>

                        <div className="mt-6">
                          <textarea
                            placeholder="Add a comment..."
                            className="bg-[#111] text-white border border-[#333] rounded-lg p-3 w-full focus:outline-none focus:border-[#64FFDA] resize-none"
                            rows={2}
                          ></textarea>
                          <Button
                            className="mt-2 bg-[#0d0f25] text-[#ffffff] font-semibold py-2 rounded-lg hover:bg-[#52E3C2] transition-colors"
                            onClick={() => {
                              // Handle comment submission
                              toast.success("Comment added!");
                            }}
                          >
                            Add Comment
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ViewClass;
