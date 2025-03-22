import { useState, useEffect } from 'react';
import axios, { AxiosError } from 'axios';
import { Assignment } from '../types/Assignment';

export const useAssignments = (classroomId: string | undefined) => {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAssignments = async () => {
    if (!classroomId) return;
    
    try {
      setLoading(true);
      const { data } = await axios.get<Assignment[]>(
        `http://localhost:8080/api/classrooms/assignments/${classroomId}/assignments`,
        { withCredentials: true }
      );
      setAssignments(data);
      setError(null);
    } catch (err) {
      console.error("Error fetching assignments:", err);
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
      fetchAssignments();
    }
  }, [classroomId]);

  return { assignments, loading, error, refreshAssignments: fetchAssignments };
};