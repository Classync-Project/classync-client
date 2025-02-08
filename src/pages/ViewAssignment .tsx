import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { Assignment } from "@/types/Assignment";

const ViewAssignment: React.FC = () => {
  const { classroomId } = useParams<{ classroomId: string }>();
  const { user } = useSelector((state: any) => state.user) || {};

  const submittedById = user?.id;

  const { assignmentId } = useParams<{ assignmentId: string }>();
  const [assignment, setAssignment] = useState<Assignment[]>([]);
  const [formData, setFormData] = useState({
    classroomId: classroomId || "",
    submittedById: submittedById || "",
    assignmentId: assignmentId || "",
  });
  console.log(formData);

  const [file, setFile] = useState<File | null>(null);
  const isLate = new Date(assignment.dueDate) < new Date();

  useEffect(() => {
    const fetchAssignment = async () => {
      try {
        const { data } = await axios.get(
          `http://localhost:8080/api/classrooms/assignments/${assignmentId}`,
          { withCredentials: true }
        );
        console.log("assignment ", data);
        setAssignment(data);
      } catch (error) {
        console.error("Failed to fetch assignment", error);
      }
    };

    fetchAssignment();
  }, [assignmentId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!file) {
      toast.error("Please upload a PDF file.");
      return;
    }
    const submissionData = new FormData();
    submissionData.append("classroomId", formData.classroomId);
    submissionData.append("submittedById", formData.submittedById);
    submissionData.append("assignmentId", formData.assignmentId);
    submissionData.append("file", file);

    console.log("submission form data : ", submissionData);
    try {
      const response = await axios.post(
        `http://localhost:8080/api/classrooms/assignments/submissions/add`,
        submissionData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (response.status === 200) {
        toast.success("Assignment created successfully!");
        setFormData({
          classroomId: "",
          submittedById: "",
          assignmentId: "",
        });
        setFile(null);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to create assignment.");
    }
  };

  const [dragging, setDragging] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = () => setDragging(false);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile && droppedFile.type === "application/pdf") {
      setFile(droppedFile);
    } else {
      toast.error("Only PDF files are allowed.");
    }
  };

  if (!assignment) return <p>Loading...</p>;

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-bold">{assignment.title}</h1>
      <p className="text-gray-700 mt-2">{assignment.content}</p>
      {assignment.filePath && (
        <a
          href={assignment.filePath}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600"
        >
          Download Assignment
        </a>
      )}
      <p className="mt-2">
        <strong>Due Date:</strong> {assignment.dueDate}
      </p>

      {/* Submission Upload */}
      <div className="mt-6">
        <label className="block text-gray-700 font-medium">
          Upload Submission
        </label>
        <div
          className={`w-full mt-2 p-6 border-2 border-dashed rounded-lg text-center cursor-pointer ${
            dragging ? "border-blue-500 bg-blue-100" : "border-gray-300"
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <input
            type="file"
            accept="application/pdf"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="hidden"
            id="fileUpload"
          />
          <label htmlFor="fileUpload" className="cursor-pointer text-gray-700">
            {file ? file.name : "Drag & Drop a PDF here or Click to Upload"}
          </label>
        </div>
        {/* <button
                    onClick={handleSubmit}
                    className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg"
                >
                    Submit Assignment
                </button> */}
        <button
          onClick={handleSubmit}
          className={`mt-4 px-4 py-2 rounded-lg ${
            isLate ? "bg-red-600" : "bg-blue-600"
          } text-white`}
        >
          {isLate ? "Late Submit" : "Submit Assignment"}
        </button>
      </div>
    </div>
  );
};

export default ViewAssignment;
