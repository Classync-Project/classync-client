import React, { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Classroom } from "../types/Classroom"; // Define your Classroom type
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const MyClasses: React.FC = () => {
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const useremail = localStorage.getItem("useremail");
  const navigate = useNavigate();

  useEffect(() => {
    if (!useremail) {
      toast.error("User email is not available. Please log in again.");
      return;
    }

    const fetchClassrooms = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get(
          "http://localhost:8080/api/classrooms/myclassrooms",
          {
            params: { useremail },
            withCredentials: true,
          }
        );
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
      <div className="flex justify-center">
        {" "}
        {/* Center the heading */}
        <h1 className="text-2xl font-bold mb-6">My Classes</h1>
      </div>
      {classrooms.length === 0 ? (
        <p>You are not enrolled in any classes yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.isArray(classrooms) &&
            classrooms.map((classroom) => (
              <Card
                key={classroom.classroomCode}
                className="bg-black text-white border border-gray-700 rounded-lg hover:shadow-lg transition-shadow duration-300 aspect-square flex flex-col justify-between"
              >
                <CardHeader>
                  <CardTitle className="text-xl font-semibold">
                    {classroom.className}
                  </CardTitle>
                  <CardDescription className="text-gray-300">
                    Class Code: {classroom.classroomCode}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button
                    variant="outline"
                    className="w-full bg-transparent border-white text-white hover:bg-white hover:text-black transition-colors duration-300"
                    onClick={() => {
                      navigate(`/classrooms/${classroom.id}`);
                    }}
                  >
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
