import axios from "axios";

const API_URL = "http://localhost:8080/api";

interface CreateAnnouncementParams {
  title: string;
  content: string;
  classId: string;
  userEmail: string;
  file: File | null;
}

export const createAnnouncement = async (params: CreateAnnouncementParams) => {
  const { title, content, classId, userEmail, file } = params;
  
  const formData = new FormData();
  formData.append("title", title);
  formData.append("content", content);
  formData.append("classId", classId);
  formData.append("userEmail", userEmail);
  
  if (file) {
    formData.append("file", file);
  }

  const response = await axios.post(
    `${API_URL}/announcements/create`,
    formData,
    {
      withCredentials: true,
      headers: { "Content-Type": "multipart/form-data" },
    }
  );
  
  return response.data;
};