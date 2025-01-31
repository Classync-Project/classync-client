import React, { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../components/ui/card";
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
    const navigate = useNavigate();

    useEffect(() => {
        const fetchAssignments = async () => {
            try {
                const { data } = await axios.get(`http://localhost:8080/api/classrooms/assignments/${classroomId}/assignments`, { withCredentials: true });
                console.log("assignments ", data);
                setAssignments(data);
            } catch (error) {
                console.error(error);
            }
        };

        fetchAssignments();
    }, [classroomId]);

    // Fetch participants
    useEffect(() => {
        const fetchParticipants = async () => {
            try {
                const { data } = await axios.get(`http://localhost:8080/api/classrooms/${classroomId}/participants`, {
                    withCredentials: true,
                })
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
            {/* <h1 className="text-2xl font-bold mb-6">Classroom ID: {classroomId}</h1> */}

            <Tabs defaultValue="assignments" className="w-full">
                <TabsList>
                    <TabsTrigger value="assignments">Assignments</TabsTrigger>
                    <TabsTrigger value="participants">Participants</TabsTrigger>
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
            </Tabs>
        </div>
    );
};

export default ViewClass;