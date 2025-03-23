import React from 'react';
import { FileText, Trash2, Loader } from 'lucide-react';
import { Submission } from '../../types/Submission';
import { formatDate } from '../../utils/dateUtils';

interface SubmissionItemProps {
  submission: Submission;
  index: number;
  onDelete: (id: string) => void;
  onEvaluate: (id: string) => void;
  isLoading: boolean;
  isDueDatePassed: boolean;
}

const SubmissionItem: React.FC<SubmissionItemProps> = ({
  submission,
  index,
  onDelete,
  onEvaluate,
  isLoading,
  isDueDatePassed,
}) => {

  console.log(submission)

  return (
    <div className="flex flex-col p-4 bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <FileText className="w-5 h-5 text-blue-500" />
          <div>
            <a
              href={submission.fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-blue-600 hover:text-blue-800"
            >
              Submission {index + 1}
            </a>
            <p className="text-xs text-gray-500">
              Submitted: {formatDate(submission.submittedAt)}
            </p>
          </div>
        </div>

        {submission.grade && (
          <div className="flex items-center bg-green-50 py-1 px-3 rounded-full">
            <span className="text-sm font-medium text-green-700">
              Grade: {submission.grade}
            </span>
          </div>
        )}
      </div>

      <div className="flex items-center space-x-3 mt-3">
        {!submission.grade && isDueDatePassed && (
          <button
            onClick={() => onEvaluate(submission.id)}
            disabled={isLoading}
            className="flex-1 py-2 px-4 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-green-400 transition-colors duration-200 flex items-center justify-center"
          >
            {isLoading ? (
              <>
                <Loader className="w-4 h-4 mr-2 animate-spin" />
                Evaluating...
              </>
            ) : (
              "Request Evaluation"
            )}
          </button>
        )}
        <button
          onClick={() => onDelete(submission.id)}
          className="py-2 px-4 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>

      {submission.feedback && (
        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <h5 className="text-sm font-semibold text-gray-700 mb-2">
            Feedback:
          </h5>
          <p className="text-sm text-gray-600">
            {submission.feedback}
          </p>
        </div>
      )}
    </div>
  );
};

export default SubmissionItem;