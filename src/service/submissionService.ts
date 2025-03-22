import axios from "axios";
import { Submission } from "@/types/Submission";

// const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";
const API_BASE_URL = "http://localhost:8080/api";

export const fetchSubmissions = async (assignmentId: string, submittedById: string): Promise<Submission[]> => {
  const response = await axios.get(
    `${API_BASE_URL}/classrooms/assignments/submissions?assignmentId=${assignmentId}&submittedById=${submittedById}`,
    { withCredentials: true }
  );
  return response.data;
};

export const createSubmission = async (
  classroomId: string,
  assignmentId: string,
  submittedById: string,
  file: File
): Promise<Submission> => {
  const submissionData = new FormData();
  submissionData.append("classroomId", classroomId);
  submissionData.append("submittedById", submittedById);
  submissionData.append("assignmentId", assignmentId);
  submissionData.append("file", file);

  const response = await axios.post(
    `${API_BASE_URL}/classrooms/assignments/submissions/add`,
    submissionData,
    {
      withCredentials: true,
      headers: { "Content-Type": "multipart/form-data" },
    }
  );
  return response.data;
};

export const updateSubmission = async (submissionId: string, file: File): Promise<Submission> => {
  const submissionData = new FormData();
  submissionData.append("file", file);

  const response = await axios.put(
    `${API_BASE_URL}/classrooms/assignments/submissions/${submissionId}`,
    submissionData,
    {
      withCredentials: true,
      headers: { "Content-Type": "multipart/form-data" },
    }
  );
  return response.data;
};

export const deleteSubmission = async (submissionId: string): Promise<void> => {
  await axios.delete(`${API_BASE_URL}/classrooms/assignments/submissions/${submissionId}`, {
    withCredentials: true,
  });
};

export const evaluateSubmission = async (submissionId: string): Promise<Submission> => {
  const response = await axios.get(
    `${API_BASE_URL}/classrooms/assignments/submissions/${submissionId}/evaluate`,
    { withCredentials: true }
  );
  console.log(response.data);
  return response.data;
};
