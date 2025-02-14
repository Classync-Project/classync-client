// src/services/CommentsService.js
import axios from 'axios';

const API_URL = 'http://localhost:8080/api/comments';

const CommentsService = {
  // Fetch comments by announcement ID
  getCommentsByAnnouncement: async (announcementId) => {
    try {
      console.log("in fetching comments");
      const response = await axios.get(`${API_URL}/announcement/${announcementId}`,{
        withCredentials: true      });
      return response.data;
    } catch (error) {
      console.error('Error fetching comments:', error);
      return [];
    }
  },
};

export default CommentsService;
