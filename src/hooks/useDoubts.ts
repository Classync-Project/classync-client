import { useState, useEffect } from "react";
import axios, { AxiosError } from "axios";
import { Doubt } from "../types/Doubt";

export const useDoubts = (classroomId: string | undefined) => {
  const [doubts, setDoubts] = useState<Doubt[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDoubts = async () => {
    if (!classroomId) return;

    try {
      setLoading(true);
      const { data } = await axios.get<Doubt[]>(
        `http://localhost:8080/api/doubts/${classroomId}`,
        { withCredentials: true }
      );
      setDoubts(data);
      setError(null);
    } catch (err) {
      console.error("Error fetching doubts:", err);
      setError(err instanceof AxiosError ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (classroomId) {
      fetchDoubts();
    }
  }, [classroomId]);

  return { doubts, loading, error, refreshDoubts: fetchDoubts };
};
