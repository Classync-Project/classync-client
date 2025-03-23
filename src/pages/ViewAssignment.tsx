import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useSelector } from "react-redux";
import { Assignment } from "@/types/Assignment";
// import SubmitAssignment from "./SubmitAssignment";
import SubmitAssignment from "../components/SubmitAssignment/SubmitAssignment";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Calendar, Clock, FileText, ArrowLeft, Edit } from "lucide-react";
import UpdateAssignment from "./UpdateAssignment";

const ViewAssignment: React.FC = () => {
  const { classroomId } = useParams<{ classroomId: string }>();
  const { user } = useSelector((state: any) => state.user) || {};
  const { assignmentId } = useParams<{ assignmentId: string }>();
  const [assignment, setAssignment] = useState<Assignment | null>(null);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const navigate = useNavigate();
  const [isTeacherOrCreator, setIsTeacherOrCreator] = useState(false);
  const submittedById = user?.id;
  const role = localStorage.getItem(`classroom-${classroomId}-role`);

  useEffect(() => {
    if (role === "CREATOR" || role === "TEACHER") {
      setIsTeacherOrCreator(true);
    } else {
      setIsTeacherOrCreator(false);
    }
  }, [role]);

  useEffect(() => {
    const fetchAssignment = async () => {
      try {
        const { data } = await axios.get(
          `http://localhost:8080/api/classrooms/assignments/${assignmentId}`,
          { withCredentials: true }
        );
        setAssignment(data);
      } catch (error) {
        console.error("Failed to fetch assignment", error);
      }
    };

    fetchAssignment();
  }, [assignmentId]);

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/api/classrooms/assignments/submissions?assignmentId=${assignmentId}&submittedById=${submittedById}`,
          { withCredentials: true }
        );
        if (response.data.length > 0) {
          setHasSubmitted(true); // Student has submitted at least once
        }
      } catch (error) {
        console.error("Failed to fetch submissions", error);
      }
    };

    if (!isTeacherOrCreator) {
      fetchSubmissions();
    }
  }, [assignmentId, submittedById, isTeacherOrCreator]);

  if (!assignment)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-pulse flex space-x-4">
          <div className="h-12 w-12 rounded-full bg-gray-200"></div>
          <div className="space-y-4">
            <div className="h-4 w-48 bg-gray-200 rounded"></div>
            <div className="h-4 w-32 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 transition duration-200 mb-4"
      >
        <ArrowLeft className="w-5 h-5" />
        <span>Back to Assignments</span>
      </button>

      <Card className="border-0 shadow-lg rounded-xl bg-gradient-to-br from-white to-gray-50">
        <CardHeader className="space-y-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
              {assignment.title}
            </CardTitle>

            {/* Edit Button (Visible to Creator/Teacher) */}
            {isTeacherOrCreator && (
              <button
                onClick={() => setIsUpdateModalOpen(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors duration-200"
              >
                <Edit className="w-4 h-4" />
                <span>Edit Assignment</span>
              </button>
            )}
          </div>
          <div className="flex items-center space-x-6 text-gray-600">
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4" />
              <span className="text-sm">
                Due: {new Date(assignment.dueDate).toLocaleDateString()}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4" />
              <span className="text-sm">
                {new Date(assignment.dueDate).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="prose max-w-none">
            <p className="text-gray-700 leading-relaxed">
              {assignment.content}
            </p>
          </div>

          {assignment.questionFilePath && (
            <a
              href={assignment.questionFilePath}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors duration-200"
            >
              <FileText className="w-4 h-4" />
              <span>Download Assignment Materials</span>
            </a>
          )}

          {/* Show SubmitAssignment for students who haven't submitted or need to update */}
          {!isTeacherOrCreator && (
            <div className="mt-8">
              <SubmitAssignment
                classroomId={classroomId || ""}
                assignmentId={assignmentId || ""}
                submittedById={submittedById || ""}
                dueDate={assignment.dueDate}
                hasSubmitted={hasSubmitted}
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Update Assignment Modal */}
      {isUpdateModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
            <UpdateAssignment
              onClose={() => setIsUpdateModalOpen(false)}
              onAssignmentUpdated={(updatedAssignment) => {
                setAssignment(updatedAssignment);
                setIsUpdateModalOpen(false);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewAssignment;