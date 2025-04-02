import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

interface Participant {
  id: number;
  fullName: string;
  email: string;
  role: string;
}

export default function ClassroomParticipants() {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [classroom, setClassroom] = useState<{
    className: string;
    classroomCode: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const { classroomId } = useParams();

  useEffect(() => {
    const fetchParticipants = async () => {
      try {
        // Fetch classroom details
        const classroomResponse = await axios.get(
          `http://localhost:8080/api/classrooms/${classroomId}`,
          {
            withCredentials: true,
          }
        );
        setClassroom(classroomResponse.data);

        // Fetch participants
        const participantsResponse = await axios.get(
          `http://localhost:8080/api/classrooms/${classroomId}/participants`,
          {
            withCredentials: true,
          }
        );
        setParticipants(participantsResponse.data);
      } catch (error) {
        console.error("Error fetching classroom participants:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchParticipants();
  }, [classroomId]);

  return (
    <div className="container mx-auto p-6">
      {loading ? (
        <p className="text-gray-400">Loading...</p>
      ) : classroom ? (
        <>
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-200">
              {classroom.className}
            </h1>
            <p className="text-gray-400">
              Class Code: {classroom.classroomCode}
            </p>
          </div>

          <h2 className="text-xl font-semibold text-gray-200 mb-4">
            Participants
          </h2>

          {participants.length === 0 ? (
            <p className="text-gray-400">
              No participants found in this class.
            </p>
          ) : (
            <div className="bg-gray-900 rounded-lg shadow overflow-hidden">
              <table className="min-w-full divide-y divide-gray-800">
                <thead className="bg-gray-800">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
                    >
                      Name
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
                    >
                      Email
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
                    >
                      Role
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-gray-900 divide-y divide-gray-800">
                  {participants.map((participant) => (
                    <tr key={participant.id} className="hover:bg-gray-800">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-200">
                        {participant.fullName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                        {participant.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                        {participant.role}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      ) : (
        <p className="text-gray-400">Classroom not found.</p>
      )}
    </div>
  );
}
