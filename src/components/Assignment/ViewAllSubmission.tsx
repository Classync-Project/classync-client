import React, { useState, useEffect } from "react";
import axios from "axios";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "../../components/ui/table";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Eye, Trash2, PencilLine } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { toast } from "react-toastify";
import UpdateGradeModal from "./UpdateGradeModal";
import SubmissionViewerModal from "./SubmissionViewerModal";
import DeleteConfirmationDialog from "../common/DeleteConfirmationDialog";
import { Solution } from "@/types/Solution";

interface ViewAllSubmissionsProps {
    assignmentId: string;
}

const ViewAllSubmissions: React.FC<ViewAllSubmissionsProps> = ({
    assignmentId,
}) => {
    const [submissions, setSubmissions] = useState<Solution[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [evaluatingId, setEvaluatingId] = useState<number | null>(null);

    // Modal states
    const [updateModalOpen, setUpdateModalOpen] = useState(false);
    const [viewerModalOpen, setViewerModalOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [selectedSubmission, setSelectedSubmission] = useState<Solution | null>(null);
    const [submissionToDelete, setSubmissionToDelete] = useState<number | null>(null);

    useEffect(() => {
        fetchSubmissions();
    }, [assignmentId]);

    const fetchSubmissions = async () => {
        setLoading(true);
        try {
            const { data } = await axios.get(
                `http://localhost:8080/api/classrooms/assignments/${assignmentId}/all-submissions`,
                { withCredentials: true }
            );
            setSubmissions(data);
            console.log(" All submissions : ", data);
            setError(null);
        } catch (err) {
            console.error("Failed to fetch submissions", err);
            setError("Failed to load submissions. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    const handleEvaluate = async (submissionId: number) => {
        setEvaluatingId(submissionId);
        try {
            await axios.get(
                `http://localhost:8080/api/classrooms/assignments/submissions/${submissionId}/evaluate`,
                { withCredentials: true }
            );

            fetchSubmissions();
            toast.success("Submission evaluated successfully.");

        } catch (err) {
            console.error("Failed to evaluate submission", err);
            toast.error("Failed to evaluate submission. Please try again later.");
        } finally {
            setEvaluatingId(null);
        }
    };

    const openDeleteDialog = (submissionId: number) => {
        setSubmissionToDelete(submissionId);
        setDeleteDialogOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (submissionToDelete === null) return;

        try {
            await axios.delete(
                `http://localhost:8080/api/classrooms/assignments/submissions/${submissionToDelete}`,
                { withCredentials: true }
            );
            setSubmissions(prev => prev.filter(sub => sub.id !== submissionToDelete));
            toast.success("Submission deleted successfully.");
        } catch (err) {
            console.error("Failed to delete submission", err);
            toast.error("Failed to delete submission. Please try again later.");
        }
    };

    const openUpdateGradeModal = (submission: Solution) => {
        setSelectedSubmission(submission);
        setUpdateModalOpen(true);
    };

    const openSubmissionViewer = (submission: Solution) => {
        setSelectedSubmission(submission);
        setViewerModalOpen(true);
    };

    const handleGradeUpdated = (submissionId: number, grade: string, feedback: string) => {
        // Update the submission in the local state
        setSubmissions(prev =>
            prev.map(sub =>
                sub.id === submissionId
                    ? { ...sub, grade, feedback }
                    : sub
            )
        );
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center py-8">
                <div className="animate-pulse flex space-x-4">
                    <div className="h-12 w-12 rounded-full bg-gray-200"></div>
                    <div className="space-y-4">
                        <div className="h-4 w-48 bg-gray-200 rounded"></div>
                        <div className="h-4 w-32 bg-gray-200 rounded"></div>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-8">
                <p className="text-red-500">{error}</p>
                <Button
                    variant="outline"
                    onClick={fetchSubmissions}
                    className="mt-4"
                >
                    Try Again
                </Button>
            </div>
        );
    }

    return (
        <>
            <Card className="mt-8">
                <CardHeader>
                    <CardTitle>Student Submissions</CardTitle>
                </CardHeader>
                <CardContent>
                    {submissions.length === 0 ? (
                        <p className="text-center text-gray-500 py-8">
                            No submissions yet for this assignment.
                        </p>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Student</TableHead>
                                    <TableHead>Submitted</TableHead>
                                    <TableHead>Grade</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {submissions.map((submission) => (
                                    <TableRow key={submission.id}>
                                        <TableCell className="font-medium">
                                            <div>{submission.submitterName}</div>
                                            <div className="text-sm text-gray-500">
                                                {submission.submitterEmail}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            {formatDistanceToNow(new Date(submission.submissionDate), {
                                                addSuffix: true,
                                            })}
                                        </TableCell>
                                        <TableCell>
                                            {submission.grade ? (
                                                <div className="flex flex-col">
                                                    <span className="font-bold">{submission.grade}</span>
                                                    {submission.feedback && (
                                                        <span className="text-xs text-gray-500 max-w-xs truncate">
                                                            {submission.feedback}
                                                        </span>
                                                    )}
                                                </div>
                                            ) : (
                                                <span className="text-yellow-500">Not graded</span>
                                            )}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end space-x-2">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => openSubmissionViewer(submission)}
                                                >
                                                    <Eye className="h-4 w-4 mr-1" />
                                                    View
                                                </Button>

                                                {submission.grade ? (
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => openUpdateGradeModal(submission)}
                                                    >
                                                        <PencilLine className="h-4 w-4 mr-1" />
                                                        Update Grade
                                                    </Button>
                                                ) : (
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => handleEvaluate(submission.id)}
                                                        disabled={evaluatingId === submission.id}
                                                    >
                                                        <PencilLine className="h-4 w-4 mr-1" />
                                                        {evaluatingId === submission.id ? "Evaluating..." : "Evaluate"}
                                                    </Button>
                                                )}

                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => openDeleteDialog(submission.id)}
                                                    className="text-red-500 hover:text-red-700"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>

            {/* Modular Components */}
            <UpdateGradeModal
                isOpen={updateModalOpen}
                onClose={() => setUpdateModalOpen(false)}
                submission={selectedSubmission}
                onGradeUpdated={handleGradeUpdated}
            />

            <SubmissionViewerModal
                isOpen={viewerModalOpen}
                onClose={() => setViewerModalOpen(false)}
                submission={selectedSubmission}
            />

            <DeleteConfirmationDialog
                isOpen={deleteDialogOpen}
                onClose={() => setDeleteDialogOpen(false)}
                onConfirm={handleConfirmDelete}
                title="Delete Submission"
                description="Are you sure you want to delete this submission? This action cannot be undone."
            />
        </>
    );
};

export default ViewAllSubmissions;