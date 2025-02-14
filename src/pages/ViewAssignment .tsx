import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useSelector } from "react-redux";
import { Assignment } from "@/types/Assignment";
import SubmitAssignment from "./SubmitAssignment";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Calendar, Clock, FileText } from "lucide-react";

const ViewAssignment: React.FC = () => {
  const { classroomId } = useParams<{ classroomId: string }>();
  const { user } = useSelector((state: any) => state.user) || {};
  const { assignmentId } = useParams<{ assignmentId: string }>();
  const [assignment, setAssignment] = useState<Assignment | null>(null);

  const submittedById = user?.id;

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
      <Card className="border-0 shadow-lg rounded-xl bg-gradient-to-br from-white to-gray-50">
        <CardHeader className="space-y-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
              {assignment.title}
            </CardTitle>
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

          {assignment.filePath && (
            <a
              href={assignment.filePath}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors duration-200"
            >
              <FileText className="w-4 h-4" />
              <span>Download Assignment Materials</span>
            </a>
          )}

          <div className="mt-8">
            <SubmitAssignment
              classroomId={classroomId || ""}
              assignmentId={assignmentId || ""}
              submittedById={submittedById || ""}
              dueDate={assignment.dueDate}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ViewAssignment;
