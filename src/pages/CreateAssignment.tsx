import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";

const CreateAssignment: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { classroomId } = useParams<{ classroomId: string }>();
  const { user } = useSelector((state: any) => state.user) || {};
  const navigate = useNavigate();

  const createdById = user?.id;

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    classroomId: classroomId || "",
    createdById: createdById || "",
    dueDate: new Date().toISOString().slice(0, 16),
  });

  const [file, setFile] = useState<File | null>(null);
  const [solutionFile, setSolutionFile] = useState<File | null>(null);
  const [dragging, setDragging] = useState(false);

  const updateForm = (field: string, value: string) => {
    setFormData((prevData) => ({ ...prevData, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      toast.error("Please upload a PDF file for the assignment.");
      return;
    }
    if (!solutionFile) {
      toast.error("Please upload a solution file.");
      return;
    }

    const submissionData = new FormData();
    submissionData.append("title", formData.title);
    submissionData.append("content", formData.content);
    submissionData.append("classroomId", formData.classroomId);
    submissionData.append("createdById", formData.createdById);
    submissionData.append("dueDate", formData.dueDate);
    submissionData.append("file", file);
    submissionData.append("solutionFile", solutionFile);

    try {
      const response = await axios.post(
        "http://localhost:8080/api/classrooms/assignments/add",
        submissionData,
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      if (response.status === 200) {
        toast.success("Assignment created successfully!");
        navigate(`/classrooms/${classroomId}`);
        onClose();
      } else {
        toast.error("Failed to create assignment.");
      }
    } catch (err) {
      toast.error("Error creating assignment.");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="w-full max-w-lg bg-gray-900 p-8 rounded-3xl shadow-xl space-y-6 relative text-white"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white text-xl"
        >
          ×
        </button>
        <h2 className="text-3xl font-bold text-center">Create Assignment</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            value={formData.title}
            onChange={(e) => updateForm("title", e.target.value)}
            className="w-full p-3 border-none rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500"
            placeholder="Assignment Title"
            required
          />
          <textarea
            value={formData.content}
            onChange={(e) => updateForm("content", e.target.value)}
            className="w-full p-3 border-none rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500"
            rows={4}
            placeholder="Assignment Details"
          />
          <input
            type="datetime-local"
            value={formData.dueDate}
            onChange={(e) => updateForm("dueDate", e.target.value)}
            className="w-full p-3 border-none rounded-lg bg-gray-800 text-white focus:ring-2 focus:ring-blue-500"
            required
          />
          
          {/* Assignment File Upload */}
          <div
            className={`w-full p-6 border-2 border-dashed rounded-lg text-center cursor-pointer ${
              dragging ? "border-blue-500 bg-blue-900" : "border-gray-700 bg-gray-800"
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
            <label htmlFor="fileUpload" className="cursor-pointer text-gray-300">
              {file ? <span className="text-blue-400 font-medium">{file.name}</span> : "Upload Assignment PDF"}
            </label>
          </div>

          {/* Solution File Upload */}
          <div
            className={`w-full p-6 border-2 border-dashed rounded-lg text-center cursor-pointer ${
              dragging ? "border-green-500 bg-green-900" : "border-gray-700 bg-gray-800"
            }`}
          >
            <input
              type="file"
              accept="application/pdf"
              className="hidden"
              id="solutionUpload"
              onChange={(e) => setSolutionFile(e.target.files?.[0] || null)}
            />
            <label htmlFor="solutionUpload" className="cursor-pointer text-gray-300">
              {solutionFile ? <span className="text-green-400 font-medium">{solutionFile.name}</span> : "Upload Solution PDF"}
            </label>
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-lg font-semibold text-lg hover:scale-105 transition-all"
          >
            Submit Assignment
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default CreateAssignment;
