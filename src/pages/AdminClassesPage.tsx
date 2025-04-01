import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

interface Classroom {
  id: number;
  className: string;
  classroomCode: string;
}

export default function AllClasses() {
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/api/classrooms/all",
          {
            withCredentials: true,
          }
        );
        setClassrooms(response.data);
      } catch (error) {
        console.error("Error fetching classrooms:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchClasses();
  }, []);

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold text-gray-200 mb-4">All Classes</h1>
      {loading ? (
        <p className="text-gray-400">Loading...</p>
      ) : classrooms.length === 0 ? (
        <p className="text-gray-400">No classes found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {classrooms.map((classroom) => (
            <div
              key={classroom.id}
              className="p-4 bg-gray-900 text-white rounded-lg shadow-md cursor-pointer hover:bg-gray-800 transition"
              onClick={() => navigate(`/classroom/${classroom.id}`)}
            >
              <h2 className="text-xl font-semibold">{classroom.className}</h2>
              <p className="text-gray-400">
                Class Code: {classroom.classroomCode}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
