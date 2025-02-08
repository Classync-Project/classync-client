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
                            <CardDescription>View and manage assignments for this classroom.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {assignments.length === 0 ? (
                                <p>No Assignments Currently ...</p>
                            ) : (

                                <div className="space-y-4">

                                    {assignments.map((assignment) => (
                                        <div key={assignment.id} className="border p-4 rounded-lg" onClick={() => navigate(`/classrooms/${classroomId}/assignments/${assignment.id}`)}>
                                            <h3 className="font-semibold">{assignment.title}</h3>
                                            <p className="text-sm text-gray-600">{assignment.content}</p>
                                            {assignment.filePath && (
                                                <a href={`${assignment.filePath}`} target="_blank" rel="noopener noreferrer">
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
                            <CardDescription>List of all users in this classroom.</CardDescription>
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
            <div className="modal-backdrop">
              <div className="modal">
                <button
                  className="modal-close"
                  onClick={() => setShowAnnouncementModal(false)}
                >
                  ×
                </button>
                <h2>Add New Announcement</h2>
                <input
                  type="text"
                  placeholder="Title"
                  className="border p-2 w-full mb-2"
                  id="announcementTitle"
                />
                <textarea
                  placeholder="Content"
                  className="border p-2 w-full mb-2"
                  id="announcementContent"
                ></textarea>
                <Button
                  onClick={() => {
                    const title = (
                      document.getElementById(
                        "announcementTitle"
                      ) as HTMLInputElement
                    ).value;
                    const content = (
                      document.getElementById(
                        "announcementContent"
                      ) as HTMLTextAreaElement
                    ).value;
                    handleAddAnnouncement(title, content);
                  }}
                >
                  Submit
                </Button>
              </div>
            </div>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Announcements</CardTitle>
              <CardDescription>
                View all announcements in this classroom.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {announcements.length === 0 ? (
                <p>No Announcements Available...</p>
              ) : (
                <div className="space-y-4">
                  {announcements.map((announcement) => (
                    <div
                      key={announcement.id}
                      className="border p-4 rounded-lg"
                    >
                      <h3 className="font-semibold">{announcement.title}</h3>
                      <p className="text-sm text-gray-600">
                        {announcement.content}
                      </p>
                      <p className="text-sm text-gray-500">
                        By: {announcement.author.email}
                      </p>
                    </div>
                  ))}
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
