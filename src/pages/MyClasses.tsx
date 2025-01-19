import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Classroom } from "../types/Classroom"; // Define your Classroom type
import axios from "axios";
import { toast } from "react-toastify";

const MyClasses: React.FC = () => {
    const [classrooms, setClassrooms] = useState<Classroom[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const useremail = localStorage.getItem('useremail');
    // Fetch classrooms for the logged-in user
    // useEffect(() => {

    //     const fetchClassrooms = async () => {
    //         setLoading(true);
    //         try {
    //             const { data } = await axios.get("http://localhost:8080/api/classrooms/myclassrooms", {
    //                 params: { useremail },
    //                 withCredentials: true,
    //             });
    //             console.log(data); // Log the response to check its structure
    //             setClassrooms(data); // Ensure response.data is an array
    //         } catch (err) {
    //             console.error(err);
    //             toast.error("Error fetching classrooms");
    //         } finally {
    //             setLoading(false);
    //         }
    //     };


    //     fetchClassrooms();
    // }, []);

    useEffect(() => {
        if (!useremail) {
            toast.error("User email is not available. Please log in again.");
            return;
        }

        const fetchClassrooms = async () => {
            setLoading(true);
            try {
                const { data } = await axios.get("http://localhost:8080/api/classrooms/myclassrooms", {
                    params: { useremail },
                    withCredentials: true,
                });
                console.log(data); // Log the response to check its structure
                setClassrooms(data);
            } catch (err) {
                console.error(err);
                toast.error("Error fetching classrooms");
            } finally {
                setLoading(false);
            }
        };

        fetchClassrooms();
    }, [useremail]);

    if (loading) {
        return <div>Loading...</div>;
    }


    return (
        <div className="container mx-auto p-4" style={{ color: "white" }}>
            <h1 className="text-2xl font-bold mb-6">My Classes</h1>
            {classrooms.length === 0 ? (
                <p>You are not enrolled in any classes yet.</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {Array.isArray(classrooms) && classrooms.map((classroom) => (
                        <Card key={classroom.classroomCode} className="hover:shadow-lg transition-shadow">
                            <CardHeader>
                                <CardTitle>{classroom.className}</CardTitle>
                                <CardDescription>Class Code: {classroom.classroomCode}</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Button variant="outline" className="w-full">
                                    View Class
                                </Button>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyClasses;