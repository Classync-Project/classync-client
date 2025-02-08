import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const CreateAssignment: React.FC = () => {
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
  const [dragging, setDragging] = useState(false);

  const updateForm = (field: string, value: string) => {
    setFormData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!file) {
      toast.error("Please upload a PDF file.");
      return;
    }

    const submissionData = new FormData();
    submissionData.append("title", formData.title);
    submissionData.append("content", formData.content);
    submissionData.append("classroomId", formData.classroomId);
    submissionData.append("createdById", formData.createdById);
    submissionData.append("dueDate", formData.dueDate);
    submissionData.append("file", file);

    try {
      const response = await axios.post(
        `http://localhost:8080/api/classrooms/assignments/add`,
        submissionData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 200) {
        console.log("Assignment created successfully:", response.data);
        toast.success("Assignment created successfully!");
        console.log("Navigating to classroom:", classroomId);
        navigate(`/classrooms/${classroomId}`);
      } else {
        console.error("Unexpected response status:", response.status);
        toast.error("Failed to create assignment.");
      }
    } catch (error) {
      console.error("Error creating assignment:", error);
      toast.error("Failed to create assignment.");
    }
  };

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

  return (
    <div className="flex items-center justify-center bg-gradient-to-r from-gray-900 to-gray-800">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-lg bg-navy-900 p-8 rounded-3xl shadow-2xl space-y-6 transform transition-all duration-300 hover:shadow-3xl"
      >
        <h2 className="text-3xl font-bold text-center text-white mb-6">
          Create Assignment
        </h2>

        <div>
          <label className="block text-gray-300 font-medium mb-2">Title</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => updateForm("title", e.target.value)}
            className="w-full mt-1 p-3 border-2 border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-300 bg-gray-800 text-white placeholder-gray-400"
            placeholder="Enter assignment title"
            required
          />
        </div>

        <div>
          <label className="block text-gray-300 font-medium mb-2">
            Content
          </label>
          <textarea
            value={formData.content}
            onChange={(e) => updateForm("content", e.target.value)}
            className="w-full mt-1 p-3 border-2 border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-300 bg-gray-800 text-white placeholder-gray-400"
            rows={4}
            placeholder="Enter assignment content"
          />
        </div>

        <div
          className={`w-full mt-1 p-6 border-2 border-dashed rounded-lg text-center cursor-pointer transition-all duration-300 ${
            dragging
              ? "border-blue-500 bg-blue-900"
              : "border-gray-700 bg-gray-800"
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
          <label htmlFor="fileUpload" className="cursor-pointer text-gray-300">
            {file ? (
              <span className="text-blue-400 font-medium">{file.name}</span>
            ) : (
              <>
                <span className="text-gray-400">Drag & Drop a PDF here or</span>{" "}
                <span className="text-blue-400 font-medium">
                  Click to Upload
                </span>
              </>
            )}
          </label>
        </div>

        <div>
          <label className="block text-gray-300 font-medium mb-2">
            Due Date
          </label>
          <input
            type="datetime-local"
            value={formData.dueDate}
            onChange={(e) => updateForm("dueDate", e.target.value)}
            className="w-full mt-1 p-3 border-2 border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-300 bg-gray-800 text-white"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-lg font-semibold text-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
        >
          Create Assignment
        </button>
      </form>
    </div>
  );
};

export default CreateAssignment;
