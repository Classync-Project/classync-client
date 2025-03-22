import { useState, useEffect } from 'react';
import axios, { AxiosError } from 'axios';
import { Participants } from '../types/Participants';

export const useParticipants = (classroomId: string | undefined) => {
  const [participants, setParticipants] = useState<Participants[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchParticipants = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get<Participants[]>(
        `http://localhost:8080/api/classrooms/${classroomId}/participants`,
        { withCredentials: true }
      );
      setParticipants(data);
      setError(null);
    } catch (err) {
      setError(
        err instanceof AxiosError 
          ? err.message 
          : "An error occurred"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (classroomId) {
      fetchParticipants();
    }
  }, [classroomId]);

  const handleRoleUpdate = async (userId: number, newRole: string) => {
    setParticipants((prevParticipants) =>
      prevParticipants.map((user) =>
        user.id === String(userId) ? { ...user, role: newRole } : user
      )
    );
    await fetchParticipants();
  }; 

  return { participants, loading, error, handleRoleUpdate };
};
