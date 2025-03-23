import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { isDatePassed } from '../../utils/dateUtils';
import { useSubmissions } from "../../hooks/useSubmissions";
import DueDate from './DueDate';
import FileUploader from './FileUploader';
import SubmissionList from './SubmissionList';
import { Eye, Plus } from 'lucide-react';

interface SubmitAssignmentProps {
  classroomId: string;
  assignmentId: string;
  submittedById: string;
  dueDate: string;
  hasSubmitted: boolean;
}

const SubmitAssignment: React.FC<SubmitAssignmentProps> = ({
  classroomId,
  assignmentId,
  submittedById,
  dueDate,
  hasSubmitted,
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [showSubmissionForm, setShowSubmissionForm] = useState(!hasSubmitted);
  const isLate = isDatePassed(dueDate);
  const isDueDatePassed = isDatePassed(dueDate);

  const {
    submissions,
    isLoading,
    submitAssignment,
    deleteSubmission,
    evaluateSubmission,
    loadingScores,
  } = useSubmissions({
    assignmentId,
    submittedById,
  });

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    if (!file) {
      toast.error("Please upload a PDF file.");
      return;
    }

      await submitAssignment(classroomId, file);

    setFile(null);
    setShowSubmissionForm(false);
  };

  return (
    <div className="space-y-8">
      {hasSubmitted ? (
        <>
          <div className="flex flex-col space-y-4">
            <h3 className="text-xl font-semibold text-gray-800">Your Assignment</h3>
            
            <DueDate dueDate={dueDate} isLate={isLate} />

            <div className="flex gap-4">
              <button
                onClick={() => setShowSubmissionForm(false)}
                className={`flex-1 py-3 px-4 ${!showSubmissionForm ? 'bg-blue-700' : 'bg-blue-600 hover:bg-blue-700'} text-white rounded-lg font-medium transition-all duration-200 flex items-center justify-center`}
              >
                <Eye className="w-5 h-5 mr-2" />
                View Submissions
              </button>
              
              <button
                onClick={() => setShowSubmissionForm(true)}
                className={`flex-1 py-3 px-4 ${showSubmissionForm ? 'bg-green-700' : 'bg-green-600 hover:bg-green-700'} text-white rounded-lg font-medium transition-all duration-200 flex items-center justify-center`}
              >
                <Plus className="w-5 h-5 mr-2" />
                Submit New Version
              </button>
            </div>
          </div>

          {showSubmissionForm ? (
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-800">
                Submit New Version
              </h3>

              <FileUploader
                onFileSelect={setFile}
                selectedFile={file}
                isLate={isLate}
              />

              <div className="flex gap-4">
                <button
                  onClick={() => setShowSubmissionForm(false)}
                  className="flex-1 py-3 px-4 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-medium transition-all duration-200"
                >
                  Cancel
                </button>
                
                <button
                  onClick={handleSubmit}
                  className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all duration-200 
                    ${isLate
                      ? "bg-yellow-500 hover:bg-yellow-600 text-white"
                      : "bg-blue-600 hover:bg-blue-700 text-white"
                    }`}
                >
                  Submit New Version
                </button>
              </div>
            </div>
          ) : (
            <SubmissionList
              submissions={submissions}
              isLoading={isLoading}
              onDelete={deleteSubmission}
              onEvaluate={evaluateSubmission}
              loadingScores={loadingScores}
              isDueDatePassed={isDueDatePassed}
            />
          )}
        </>
      ) : (
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-gray-800">
            Submit Your Work
          </h3>

          <DueDate dueDate={dueDate} isLate={isLate} />

          <FileUploader
            onFileSelect={setFile}
            selectedFile={file}
            isLate={isLate}
          />

          <div className="flex gap-4">
            <button
              onClick={handleSubmit}
              className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all duration-200 
                ${isLate
                  ? "bg-yellow-500 hover:bg-yellow-600 text-white"
                  : "bg-blue-600 hover:bg-blue-700 text-white"
                }`}
            >
              {isLate ? "Submit Late Assignment" : "Submit Assignment"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubmitAssignment;