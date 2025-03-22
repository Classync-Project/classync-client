import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { Submission } from "@/types/Submission";
import * as submissionService from "../service/submissionService";

interface UseSubmissionsProps {
  assignmentId: string;
  submittedById: string;
}

interface UseSubmissionsReturn {
  submissions: Submission[];
  isLoading: boolean;
  error: Error | null;
  refetchSubmissions: () => Promise<void>;
  submitAssignment: (classroomId: string, file: File) => Promise<void>;
  updateSubmission: (submissionId: string, file: File) => Promise<void>;
  deleteSubmission: (submissionId: string) => Promise<void>;
  evaluateSubmission: (submissionId: string) => Promise<void>;
  loadingScores: { [key: string]: boolean };
}

export const useSubmissions = ({
  assignmentId,
  submittedById,
}: UseSubmissionsProps): UseSubmissionsReturn => {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [loadingScores, setLoadingScores] = useState<{
    [key: string]: boolean;
  }>({});

  const fetchSubmissions = async (): Promise<void> => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await submissionService.fetchSubmissions(
        assignmentId,
        submittedById
      );
      setSubmissions(data);
    } catch (err) {
      const error =
        err instanceof Error ? err : new Error("An unknown error occurred");
      setError(error);
      toast.error("Failed to load your submissions.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSubmissions();
  }, [assignmentId, submittedById]);

  const submitAssignment = async (
    classroomId: string,
    file: File
  ): Promise<void> => {
    try {
      await submissionService.createSubmission(
        classroomId,
        assignmentId,
        submittedById,
        file
      );
      toast.success("Assignment submitted successfully!");
      await fetchSubmissions();
    } catch (error) {
      console.error(error);
      toast.error("Failed to submit assignment.");
    }
  };

  const updateSubmissionFile = async (
    submissionId: string,
    file: File
  ): Promise<void> => {
    try {
      await submissionService.updateSubmission(submissionId, file);
      toast.success("Assignment updated successfully!");
      await fetchSubmissions();
    } catch (error) {
      console.error(error);
      toast.error("Failed to update assignment.");
    }
  };

  const removeSubmission = async (submissionId: string): Promise<void> => {
    try {
      await submissionService.deleteSubmission(submissionId);
      toast.success("Submission deleted successfully.");
      await fetchSubmissions();
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete submission.");
    }
  };

  const requestEvaluation = async (submissionId: string): Promise<void> => {
    setLoadingScores((prev) => ({ ...prev, [submissionId]: true }));
    try {
      await submissionService.evaluateSubmission(submissionId);
      toast.success("Evaluation requested successfully!");
      await fetchSubmissions();
    } catch (error) {
      console.error("Error during evaluation", error);
      toast.error("Failed to evaluate submission.");
    } finally {
      setLoadingScores((prev) => ({ ...prev, [submissionId]: false }));
    }
  };

  return {
    submissions,
    isLoading,
    error,
    refetchSubmissions: fetchSubmissions,
    submitAssignment,
    updateSubmission: updateSubmissionFile,
    deleteSubmission: removeSubmission,
    evaluateSubmission: requestEvaluation,
    loadingScores,
  };
};
