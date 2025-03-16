import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import { Calendar, Clock, FileText, X } from "lucide-react";

interface UpdateAssignmentProps {
  onClose: () => void; // Function to close the modal
  onAssignmentUpdated: (updatedAssignment: any) => void; // Callback after successful update
}

const UpdateAssignment: React.FC<UpdateAssignmentProps> = ({
  onClose,
  onAssignmentUpdated,
}) => {
  const { assignmentId } = useParams<{ assignmentId: string }>();
  const { user } = useSelector((state: any) => state.user) || {};

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    dueDate: new Date().toISOString().slice(0, 16),
  });

  const [file, setFile] = useState<File | null>(null);
  const [solutionFile, setSolutionFile] = useState<File | null>(null);
  const [dragging, setDragging] = useState(false);
  const [previousQuestionFile, setPreviousQuestionFile] = useState<string | null>(null);
  const [previousSolutionFile, setPreviousSolutionFile] = useState<string | null>(null);

  // Fetch assignment details when the component mounts
  useEffect(() => {
    const fetchAssignment = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/api/classrooms/assignments/${assignmentId}`,
          { withCredentials: true }
        );
        const assignment = response.data;
        console.log(assignment);
        setFormData({
          title: assignment.title,
          content: assignment.content,
          dueDate: assignment.dueDate.slice(0, 16), // Ensure the date is in the correct format
        });
        setPreviousQuestionFile(assignment.questionFilePath);
        setPreviousSolutionFile(assignment.solutionFilePath);
      } catch (error) {
        toast.error("Failed to fetch assignment details.");
        console.error(error);
      }
    };

    fetchAssignment();
  }, [assignmentId]);

  const updateForm = (field: string, value: string) => {
    setFormData((prevData) => ({ ...prevData, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const submissionData = new FormData();
    submissionData.append("title", formData.title);
    submissionData.append("content", formData.content);
    submissionData.append("dueDate", formData.dueDate);
    if (file) submissionData.append("file", file);
    if (solutionFile) submissionData.append("solutionFile", solutionFile);

    try {
      const response = await axios.put(
        `http://localhost:8080/api/classrooms/assignments/${assignmentId}`,
        submissionData,
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      if (response.status === 200) {
        toast.success("Assignment updated successfully!");
        onAssignmentUpdated(response.data); // Pass the updated assignment to the parent
        onClose(); // Close the modal
      } else {
        toast.error("Failed to update assignment.");
      }
    } catch (err) {
      toast.error("Error updating assignment.");
      console.error(err);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="space-y-6"
    >
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-center">Update Assignment</h2>
        <button
          onClick={onClose}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
        >
          <X className="w-6 h-6 text-gray-600" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Title */}
        <input
          type="text"
          value={formData.title}
          onChange={(e) => updateForm("title", e.target.value)}
          className="w-full p-3 border-none rounded-lg bg-gray-100 text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-blue-500"
          placeholder="Assignment Title"
          required
        />

        {/* Content */}
        <textarea
          value={formData.content}
          onChange={(e) => updateForm("content", e.target.value)}
          className="w-full p-3 border-none rounded-lg bg-gray-100 text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-blue-500"
          rows={4}
          placeholder="Assignment Details"
        />

        {/* Due Date */}
        <div className="flex items-center space-x-2">
          <Calendar className="w-5 h-5 text-gray-600" />
          <input
            type="datetime-local"
            value={formData.dueDate}
            onChange={(e) => updateForm("dueDate", e.target.value)}
            className="w-full p-3 border-none rounded-lg bg-gray-100 text-gray-800 focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Previous Assignment File */}
        {previousQuestionFile && (
          <div className="flex items-center space-x-2">
            <FileText className="w-5 h-5 text-blue-600" />
            <a
              href={previousQuestionFile}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              View Previous Assignment File
            </a>
          </div>
        )}

        {/* Assignment File Upload */}
        <div
          className={`w-full p-6 border-2 border-dashed rounded-lg text-center cursor-pointer ${dragging ? "border-blue-500 bg-blue-50" : "border-gray-300 bg-gray-100"
            }`}
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragging(false);
            const droppedFile = e.dataTransfer.files?.[0];
            if (droppedFile?.type === "application/pdf") {
              setFile(droppedFile);
            } else {
              toast.error("Only PDF files are allowed.");
            }
          }}
        >
          <input
            type="file"
            accept="application/pdf"
            className="hidden"
            id="fileUpload"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
          />
          <label htmlFor="fileUpload" className="cursor-pointer text-gray-600">
            {file ? (
              <span className="text-blue-600 font-medium">{file.name}</span>
            ) : (
              "Upload New Assignment PDF"
            )}
          </label>
        </div>

        {/* Previous Solution File */}
        {previousSolutionFile && (
          <div className="flex items-center space-x-2">
            <FileText className="w-5 h-5 text-green-600" />
            <a
              href={previousSolutionFile}
              target="_blank"
              rel="noopener noreferrer"
              className="text-green-600 hover:underline"
            >
              View Previous Solution File
            </a>
          </div>
        )}

        {/* Solution File Upload */}
        <div
          className={`w-full p-6 border-2 border-dashed rounded-lg text-center cursor-pointer ${dragging ? "border-green-500 bg-green-50" : "border-gray-300 bg-gray-100"
            }`}
        >
          <input
            type="file"
            accept="application/pdf"
            className="hidden"
            id="solutionUpload"
            onChange={(e) => setSolutionFile(e.target.files?.[0] || null)}
          />
          <label htmlFor="solutionUpload" className="cursor-pointer text-gray-600">
            {solutionFile ? (
              <span className="text-green-600 font-medium">{solutionFile.name}</span>
            ) : (
              "Upload New Solution PDF"
            )}
          </label>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-lg font-semibold text-lg hover:scale-105 transition-transform transform origin-center"
        >
          Update Assignment
        </button>
      </form>
    </motion.div>
  );
};

export default UpdateAssignment;