import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { fetchCommentsByAnnouncement, addComment, deleteComment } from "../service/commentService";

const useComments = (announcementId: string, user: any) => {
  const [comments, setComments] = useState<any[]>([]);
  const [commentInput, setCommentInput] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (announcementId) {
      loadComments();
    }
  }, [announcementId]);

  const loadComments = async () => {
    try {
      setIsLoading(true);
      const fetchedComments = await fetchCommentsByAnnouncement(announcementId);
      setComments(fetchedComments);
    } catch (error) {
      console.error("Error fetching comments:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCommentInput(e.target.value);
  };

  const handleAddComment = async () => {
    if (!user?.id || !announcementId || commentInput.trim() === "") {
      toast.info("Please enter a comment");
      return;
    }

    try {
      await addComment({
        userId: user.id,
        announcementId,
        content: commentInput.trim()
      });
      
      setCommentInput("");
      await loadComments();
    } catch (error) {
      toast.error("Error adding comment");
      console.error("Error adding comment:", error);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    try {
      await deleteComment(commentId, user?.email);
      await loadComments();
      toast.success("Comment deleted successfully!");
    } catch (error) {
      toast.error("Failed to delete comment.");
      console.error("Error deleting comment:", error);
    }
  };

  const toggleComments = () => {
    setIsExpanded((prev) => !prev);
  };

  return {
    comments,
    commentInput,
    isExpanded,
    isLoading,
    handleInputChange,
    handleAddComment,
    handleDeleteComment,
    toggleComments
  };
};

export default useComments;