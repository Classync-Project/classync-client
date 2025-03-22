import { useState, useEffect } from "react";
import axios, { AxiosError } from "axios";
import { ClassInfo } from "../types/ClassInfo";

export const useClassInfo = (classroomId: string | undefined) => {
  const [classInfo, setClassInfo] = useState<ClassInfo | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchClassInfo = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get<ClassInfo>(
          `http://localhost:8080/api/classrooms/${classroomId}`,
          { withCredentials: true }
        );
        setClassInfo(data);
        setError(null);
      } catch (err) {
        console.error("Error fetching class info:", err);
        setError(err instanceof AxiosError ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    if (classroomId) {
      fetchClassInfo();
    }
  }, [classroomId]);

  return { classInfo, loading, error };
};