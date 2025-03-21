import axios from "axios";

const API_URL = "http://localhost:8080/api/comments";

export const fetchCommentsByAnnouncement = async (announcementId: any) => {
  const response = await axios.get(
    `${API_URL}/announcement/${announcementId}`,
    { withCredentials: true }
  );
  return response.data;
};

interface AddCommentParams {
  userId: string;
  announcementId: string;
  content: string;
}

export const addComment = async (params: AddCommentParams) => {
  const response = await axios.post(
    `${API_URL}/add`,
    params,
    { withCredentials: true }
  );
  return response.data;
};

export const deleteComment = async (commentId: string, userEmail: string) => {
  const response = await axios.delete(
    `${API_URL}/${commentId}`,
    {
      withCredentials: true,
      params: { userEmail }
    }
  );
  return response.data;
};
