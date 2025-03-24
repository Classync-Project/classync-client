import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import { useClassInfo } from "../hooks/useClassInfo";
import { useParticipants } from "../hooks/useParticipants";

const CreateAssignment: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { classroomId } = useParams<{ classroomId: string }>();
  const { user } = useSelector((state: any) => state.user) || {};
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const createdById = user?.id;

  const getCurrentDateTime = () => {
    const now = new Date();
    return now.toISOString().slice(0, 16);
  };

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    classroomId: classroomId || "",
    createdById: createdById || "",
    dueDate: getCurrentDateTime(),
  });

  const [file, setFile] = useState<File | null>(null);
  const [solutionFile, setSolutionFile] = useState<File | null>(null);
  const [dragging, setDragging] = useState(false);
  const [minDate, setMinDate] = useState(getCurrentDateTime());

  const {
    classInfo,
    loading: classLoading,
    error: classError,
  } = useClassInfo(classroomId);
  const {
    participants,
    loading: participantsLoading,
    error: participantsError,
    handleRoleUpdate,
  } = useParticipants(classroomId);

  useEffect(() => {
    setMinDate(getCurrentDateTime());
  }, []);

  const updateForm = (field: string, value: string) => {
    setFormData((prevData) => ({ ...prevData, [field]: value }));
  };


  
  const handleSendEmail = async (title: string) => {
    // setIsSendingEmail(true);
    const className = classInfo?.className;
    const classId = classInfo?.id;
    console.log(classInfo?.classroomCode);
    // console.log("class info is " +);
    try {
      // Ensure className is defined
      if (!className) {
        throw new Error("Class name is undefined.");
      }

      const subject = `New Assignment: "${title}" Uploaded in ${className}!`;

      const message = `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
    <h2 style="color: #4a64e1;">New Assignment Alert! 📚</h2>
    <p>Hello,</p>
    <p>A new assignment titled <strong>${title}</strong> has been uploaded in your class <strong>${className}</strong>.</p>

    <h3 style="color: #4a64e1; margin-top: 20px;">Assignment Details:</h3>
    <ul>
      <li><strong>Title:</strong> ${title}</li>
      <li><strong>Class:</strong> ${className}</li>
      <li>Check the Assignments tab for submission details and deadlines</li>
      <li>Ensure timely submission to avoid penalties</li>
      <li>Reach out to your instructor for any queries</li>
    </ul>

    <p>Click the button below to view the assignment:</p>
    <a href="http://localhost:5173/classrooms/${classId}" 
       style="display: inline-block; padding: 12px 20px; font-size: 16px; color: #ffffff; background-color: #4a64e1; text-decoration: none; border-radius: 5px; font-weight: bold; text-align: center;">
      View Assignment
    </a>

    <p style="margin-top: 30px;">Best regards,<br>The ${className} Team</p>
  </div>
`;

    


      // Send the email request

      for (const participant of participants) {
        await axios.post(
          "http://localhost:8080/api/mail/send",
          {
            to: participant.email, // Accessing each participant's email
            subject: subject,
            message: message,
          },
          { withCredentials: true }
        );
      }
      
        
      toast.success(`Assignment notification has been shared!`);
      // setShowEmailForm(false);
    } catch (error) {
      toast.error("Failed to send invitation email");
      console.error("Error sending invitation:", error);
    } finally {
      // setIsSendingEmail(false);
    }
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

    setIsLoading(true);
    
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
        handleSendEmail(formData.title,);
        navigate(`/classrooms/${classroomId}`);
        onClose();
      } else {
        toast.error("Failed to create assignment.");
      }
    } catch (err) {
      toast.error("Error creating assignment.");
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="space-y-6 inset-0"
    >
      <h2 className="text-3xl font-bold text-center">Create Assignment</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          value={formData.title}
          onChange={(e) => updateForm("title", e.target.value)}
          className="w-full p-3 border-none rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500"
          placeholder="Assignment Title"
          required
          disabled={isLoading}
        />
        <textarea
          value={formData.content}
          onChange={(e) => updateForm("content", e.target.value)}
          className="w-full p-3 border-none rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500"
          rows={4}
          placeholder="Assignment Details"
          disabled={isLoading}
        />

        <div className="relative">
          <label htmlFor="dueDate" className="block text-sm font-medium text-gray-300 mb-1">
            Due Date
          </label>
          <input
            type="datetime-local"
            id="dueDate"
            value={formData.dueDate}
            min={minDate}
            onChange={(e) => updateForm("dueDate", e.target.value)}
            className="w-full p-3 border-none rounded-lg bg-gray-800 text-white focus:ring-2 focus:ring-blue-500"
            required
            disabled={isLoading}
          />
        </div>

        {/* Assignment File Upload */}
        <div
          className={`w-full p-6 border-2 border-dashed rounded-lg text-center cursor-pointer ${isLoading ? "opacity-70 cursor-not-allowed" : ""} ${dragging ? "border-blue-500 bg-blue-900" : "border-gray-700 bg-gray-800"}`}
          onDragOver={(e) => {
            if (isLoading) return;
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => {
            if (isLoading) return;
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
            disabled={isLoading}
          />
          <label htmlFor="fileUpload" className={`cursor-pointer text-gray-300 ${isLoading ? "cursor-not-allowed" : ""}`}>
            {file ? <span className="text-blue-400 font-medium">{file.name}</span> : "Upload Assignment PDF"}
          </label>
        </div>

        {/* Solution File Upload */}
        <div
          className={`w-full p-6 border-2 border-dashed rounded-lg text-center cursor-pointer ${isLoading ? "opacity-70 cursor-not-allowed" : ""} ${dragging ? "border-green-500 bg-green-900" : "border-gray-700 bg-gray-800"}`}
        >
          <input
            type="file"
            accept="application/pdf"
            className="hidden"
            id="solutionUpload"
            onChange={(e) => setSolutionFile(e.target.files?.[0] || null)}
            disabled={isLoading}
          />
          <label htmlFor="solutionUpload" className={`cursor-pointer text-gray-300 ${isLoading ? "cursor-not-allowed" : ""}`}>
            {solutionFile ? <span className="text-green-400 font-medium">{solutionFile.name}</span> : "Upload Solution PDF"}
          </label>
        </div>

        <button
          type="submit"
          className={`w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-lg font-semibold text-lg transition-all ${isLoading ? "opacity-70 cursor-not-allowed" : "hover:scale-105 transform origin-center"}`}
          disabled={isLoading}
        >
          {isLoading ? (
            <div className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Creating Assignment...
            </div>
          ) : (
            "Create Assignment"
          )}
        </button>
      </form>
    </motion.div>
  );
};

export default CreateAssignment;