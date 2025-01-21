import React, { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../components/ui/card";
import { Participants } from "../types/Participants";
import axios from "axios";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";

const ViewClass: React.FC = () => {
    const { classroomId } = useParams<{ classroomId: string }>();
    const [participants, setParticipants] = useState<Participants[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

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
            <h1 className="text-2xl font-bold mb-6">Classroom ID: {classroomId}</h1>

            <Tabs defaultValue="assignments" className="w-full">
                <TabsList>
                    <TabsTrigger value="assignments">Assignments</TabsTrigger>
                    <TabsTrigger value="participants">Participants</TabsTrigger>
                </TabsList>

                <TabsContent value="assignments">
                    <Card>
                        <CardHeader>
                            <CardTitle>Assignments</CardTitle>
                            <CardDescription>View and manage assignments for this classroom.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {/* Add assignment-related content here */}
                            <p>No assignments available.</p>
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