// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import {
//     Table,
//     TableBody,
//     TableCell,
//     TableHead,
//     TableHeader,
//     TableRow,
// } from "../../components/ui/table";
// import {
//     Card,
//     CardContent,
//     CardHeader,
//     CardTitle,
// } from "../../components/ui/card";
// import { Button } from "../../components/ui/button";
// import { Download, Eye, Trash2, PencilLine } from "lucide-react";
// import { formatDistanceToNow } from "date-fns";
// import { toast } from "react-toastify";
// import {
//     Dialog,
//     DialogContent,
//     DialogHeader,
//     DialogTitle,
//     DialogFooter,
// } from "../../components/ui/dialog";
// import { Input } from "../../components/ui/input";
// import { Textarea } from "../../components/ui/textarea";
// import { Label } from "../../components/ui/label";

// interface Solution {
//     id: number;
//     assignmentId: number;
//     submittedById: number;
//     submitterName: string;
//     submitterEmail: string;
//     fileUrl: string;
//     submissionDate: string;
//     grade: string | null;
//     feedback: string | null;
// }

// interface UpdateGradeRequest {
//     grade: string;
//     feedback: string;
// }

// interface ViewAllSubmissionsProps {
//     assignmentId: string;
// }

// const ViewAllSubmissions: React.FC<ViewAllSubmissionsProps> = ({
//     assignmentId,
// }) => {
//     const [submissions, setSubmissions] = useState<Solution[]>([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState<string | null>(null);
//     const [evaluatingId, setEvaluatingId] = useState<number | null>(null);
//     const [updateModalOpen, setUpdateModalOpen] = useState(false);
//     const [selectedSubmission, setSelectedSubmission] = useState<Solution | null>(null);
//     const [newGrade, setNewGrade] = useState("");
//     const [newFeedback, setNewFeedback] = useState("");
//     const [updating, setUpdating] = useState(false);

//     useEffect(() => {
//         fetchSubmissions();
//     }, [assignmentId]);

//     const fetchSubmissions = async () => {
//         setLoading(true);
//         try {
//             const { data } = await axios.get(
//                 `http://localhost:8080/api/classrooms/assignments/${assignmentId}/all-submissions`,
//                 { withCredentials: true }
//             );
//             setSubmissions(data);
//             console.log(" All submissions : ", data);
//             setError(null);
//         } catch (err) {
//             console.error("Failed to fetch submissions", err);
//             setError("Failed to load submissions. Please try again later.");
//         } finally {
//             setLoading(false);
//         }
//     };

//     const handleEvaluate = async (submissionId: number) => {
//         setEvaluatingId(submissionId);
//         try {
//             const { data } = await axios.get(
//                 `http://localhost:8080/api/classrooms/assignments/submissions/${submissionId}/evaluate`,
//                 { withCredentials: true }
//             );

//             fetchSubmissions();
//             toast.success("Submission evaluated successfully.");

//         } catch (err) {
//             console.error("Failed to evaluate submission", err);
//             toast.error("Failed to evaluate submission. Please try again later.");
//         } finally {
//             setEvaluatingId(null);
//         }
//     };

//     const handleDelete = async (submissionId: number) => {
//         if (window.confirm("Are you sure you want to delete this submission?")) {
//             try {
//                 await axios.delete(
//                     `http://localhost:8080/api/classrooms/submissions/${submissionId}`,
//                     { withCredentials: true }
//                 );
//                 setSubmissions(prev => prev.filter(sub => sub.id !== submissionId));
//                 toast.success("Submission deleted successfully.");
//             } catch (err) {
//                 console.error("Failed to delete submission", err);
//                 toast.error("Failed to delete submission. Please try again later.");
//             }
//         }
//     };

//     const openUpdateGradeModal = (submission: Solution) => {
//         setSelectedSubmission(submission);
//         setNewGrade(submission.grade || "");
//         setNewFeedback(submission.feedback || "");
//         setUpdateModalOpen(true);
//     };

//     const handleUpdateGrade = async () => {
//         if (!selectedSubmission) return;

//         setUpdating(true);
//         try {
//             const updateGradeRequest: UpdateGradeRequest = {
//                 grade: newGrade,
//                 feedback: newFeedback
//             };

//             const { data } = await axios.put(
//                 `http://localhost:8080/api/classrooms/assignments/submissions/${selectedSubmission.id}/update-grade`,
//                 updateGradeRequest,
//                 { withCredentials: true }
//             );

//             // Update the submission in the local state
//             setSubmissions(prev =>
//                 prev.map(sub =>
//                     sub.id === selectedSubmission.id
//                         ? { ...sub, grade: newGrade, feedback: newFeedback }
//                         : sub
//                 )
//             );

//             toast.success("Grade updated successfully.");
//             setUpdateModalOpen(false);
//         } catch (err) {
//             console.error("Failed to update grade", err);
//             toast.error("Failed to update grade. Please try again later.");
//         } finally {
//             setUpdating(false);
//         }
//     };

//     if (loading) {
//         return (
//             <div className="flex justify-center items-center py-8">
//                 <div className="animate-pulse flex space-x-4">
//                     <div className="h-12 w-12 rounded-full bg-gray-200"></div>
//                     <div className="space-y-4">
//                         <div className="h-4 w-48 bg-gray-200 rounded"></div>
//                         <div className="h-4 w-32 bg-gray-200 rounded"></div>
//                     </div>
//                 </div>
//             </div>
//         );
//     }

//     if (error) {
//         return (
//             <div className="text-center py-8">
//                 <p className="text-red-500">{error}</p>
//                 <Button
//                     variant="outline"
//                     onClick={fetchSubmissions}
//                     className="mt-4"
//                 >
//                     Try Again
//                 </Button>
//             </div>
//         );
//     }

//     return (
//         <>
//             <Card className="mt-8">
//                 <CardHeader>
//                     <CardTitle>Student Submissions</CardTitle>
//                 </CardHeader>
//                 <CardContent>
//                     {submissions.length === 0 ? (
//                         <p className="text-center text-gray-500 py-8">
//                             No submissions yet for this assignment.
//                         </p>
//                     ) : (
//                         <Table>
//                             <TableHeader>
//                                 <TableRow>
//                                     <TableHead>Student</TableHead>
//                                     <TableHead>Submitted</TableHead>
//                                     <TableHead>Grade</TableHead>
//                                     <TableHead className="text-right">Actions</TableHead>
//                                 </TableRow>
//                             </TableHeader>
//                             <TableBody>
//                                 {submissions.map((submission) => (
//                                     <TableRow key={submission.id}>
//                                         <TableCell className="font-medium">
//                                             <div>{submission.submitterName}</div>
//                                             <div className="text-sm text-gray-500">
//                                                 {submission.submitterEmail}
//                                             </div>
//                                         </TableCell>
//                                         <TableCell>
//                                             {formatDistanceToNow(new Date(submission.submissionDate), {
//                                                 addSuffix: true,
//                                             })}
//                                         </TableCell>
//                                         <TableCell>
//                                             {submission.grade ? (
//                                                 <div className="flex flex-col">
//                                                     <span className="font-bold">{submission.grade}</span>
//                                                     {submission.feedback && (
//                                                         <span className="text-xs text-gray-500 max-w-xs truncate">
//                                                             {submission.feedback}
//                                                         </span>
//                                                     )}
//                                                 </div>
//                                             ) : (
//                                                 <span className="text-yellow-500">Not graded</span>
//                                             )}
//                                         </TableCell>
//                                         <TableCell className="text-right">
//                                             <div className="flex justify-end space-x-2">
//                                                 <Button
//                                                     variant="outline"
//                                                     size="sm"
//                                                     onClick={() => window.open(submission.fileUrl, "_blank")}
//                                                 >
//                                                     <Download className="h-4 w-4 mr-1" />
//                                                     Download
//                                                 </Button>

//                                                 {submission.grade ? (
//                                                     <Button
//                                                         variant="outline"
//                                                         size="sm"
//                                                         onClick={() => openUpdateGradeModal(submission)}
//                                                     >
//                                                         <PencilLine className="h-4 w-4 mr-1" />
//                                                         Update Grade
//                                                     </Button>
//                                                 ) : (
//                                                     <Button
//                                                         variant="outline"
//                                                         size="sm"
//                                                         onClick={() => handleEvaluate(submission.id)}
//                                                         disabled={evaluatingId === submission.id}
//                                                     >
//                                                         <Eye className="h-4 w-4 mr-1" />
//                                                         {evaluatingId === submission.id ? "Evaluating..." : "Evaluate"}
//                                                     </Button>
//                                                 )}

//                                                 <Button
//                                                     variant="outline"
//                                                     size="sm"
//                                                     onClick={() => handleDelete(submission.id)}
//                                                     className="text-red-500 hover:text-red-700"
//                                                 >
//                                                     <Trash2 className="h-4 w-4" />
//                                                 </Button>
//                                             </div>
//                                         </TableCell>
//                                     </TableRow>
//                                 ))}
//                             </TableBody>
//                         </Table>
//                     )}
//                 </CardContent>
//             </Card>

//             {/* Update Grade Modal */}
//             <Dialog open={updateModalOpen} onOpenChange={setUpdateModalOpen}>
//                 <DialogContent className="sm:max-w-md">
//                     <DialogHeader>
//                         <DialogTitle>Update Submission Grade</DialogTitle>
//                     </DialogHeader>

//                     {selectedSubmission && (
//                         <div className="space-y-4">
//                             <div>
//                                 <p className="text-sm font-medium mb-1">Student: {selectedSubmission.submitterName}</p>
//                                 <p className="text-sm text-gray-500">{selectedSubmission.submitterEmail}</p>
//                             </div>

//                             <div className="grid w-full items-center gap-1.5">
//                                 <Label htmlFor="grade">Grade</Label>
//                                 <Input
//                                     id="grade"
//                                     value={newGrade}
//                                     onChange={(e) => setNewGrade(e.target.value)}
//                                     placeholder="Enter grade (e.g. A, B+, 95/100)"
//                                 />
//                             </div>

//                             <div className="grid w-full items-center gap-1.5">
//                                 <Label htmlFor="feedback">Feedback</Label>
//                                 <Textarea
//                                     id="feedback"
//                                     value={newFeedback}
//                                     onChange={(e) => setNewFeedback(e.target.value)}
//                                     placeholder="Provide feedback on the submission"
//                                     rows={4}
//                                 />
//                             </div>

//                             <div>
//                                 <Button
//                                     variant="outline"
//                                     size="sm"
//                                     onClick={() => window.open(selectedSubmission.fileUrl, "_blank")}
//                                     className="w-full"
//                                 >
//                                     <Eye className="h-4 w-4 mr-2" />
//                                     View Submission
//                                 </Button>
//                             </div>
//                         </div>
//                     )}

//                     <DialogFooter>
//                         <Button
//                             variant="outline"
//                             onClick={() => setUpdateModalOpen(false)}
//                         >
//                             Cancel
//                         </Button>
//                         <Button
//                             onClick={handleUpdateGrade}
//                             disabled={updating}
//                         >
//                             {updating ? "Updating..." : "Update Grade"}
//                         </Button>
//                     </DialogFooter>
//                 </DialogContent>
//             </Dialog>
//         </>
//     );
// };

// export default ViewAllSubmissions;

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
import { Download, Eye, Trash2, PencilLine } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { toast } from "react-toastify";
import UpdateGradeModal from "./UpdateGradeModal";
import SubmissionViewerModal from "./SubmissionViewerModal";
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
    const [selectedSubmission, setSelectedSubmission] = useState<Solution | null>(null);

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
            const { data } = await axios.get(
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

    const handleDelete = async (submissionId: number) => {
        if (window.confirm("Are you sure you want to delete this submission?")) {
            try {
                await axios.delete(
                    `http://localhost:8080/api/classrooms/submissions/${submissionId}`,
                    { withCredentials: true }
                );
                setSubmissions(prev => prev.filter(sub => sub.id !== submissionId));
                toast.success("Submission deleted successfully.");
            } catch (err) {
                console.error("Failed to delete submission", err);
                toast.error("Failed to delete submission. Please try again later.");
            }
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
                                                    onClick={() => handleDelete(submission.id)}
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
        </>
    );
};

export default ViewAllSubmissions;