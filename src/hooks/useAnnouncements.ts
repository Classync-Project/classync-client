import { useState, useEffect } from "react";
import axios, { AxiosError } from "axios";
import { Announcement } from "../types/Announcement";

export const useAnnouncements = (classroomId: string | undefined) => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAnnouncements = async () => {
    if (!classroomId) return;

    try {
      setLoading(true);
      const { data } = await axios.get<Announcement[]>(
        `http://localhost:8080/api/announcements/${classroomId}`,
        { withCredentials: true }
      );
      setAnnouncements(data);
      setError(null);
    } catch (err) {
      console.error("Error fetching announcements:", err);
      setError(err instanceof AxiosError ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (classroomId) {
      fetchAnnouncements();
    }
  }, [classroomId]);

  return {
    announcements,
    loading,
    error,
    refreshAnnouncements: fetchAnnouncements,
  };
};
