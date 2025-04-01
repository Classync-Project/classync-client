import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

interface Classroom {
  id: number;
  className: string;
  classroomCode: string;
}

export default function ClassroomDetails() {
  const { classroomId } = useParams();
  const [classroom, setClassroom] = useState<Classroom | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log("Classroom ID:", classroomId);

    const fetchClassroom = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/api/classrooms/${classroomId}`
        );
        console.log("Classroom Data:", response.data);
        setClassroom(response.data);
      } catch (error) {
        console.error("Error fetching classroom:", error);
        setError("There was an error fetching the classroom data.");
      } finally {
        setLoading(false);
      }
    };

    if (classroomId) {
      fetchClassroom();
    } else {
      setLoading(false); // If no classroomId is available
      setError("Classroom ID is missing.");
    }
  }, [classroomId]);

  if (loading) return <p className="text-gray-400">Loading...</p>;

  if (error) return <p className="text-red-500">{error}</p>;

  if (!classroom) return <p className="text-red-500">Classroom not found.</p>;

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold text-gray-200">
        {classroom?.className}
      </h1>
      <p className="text-gray-400">Class Code: {classroom?.classroomCode}</p>
    </div>
  );
}
