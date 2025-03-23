import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "../../components/ui/dialog";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Textarea } from "../../components/ui/textarea";
import { Label } from "../../components/ui/label";
import { Eye, ExternalLink } from "lucide-react";
import { Solution } from "@/types/Solution";

interface UpdateGradeRequest {
    grade: string;
    feedback: string;
}

interface UpdateGradeModalProps {
    isOpen: boolean;
    onClose: () => void;
    submission: Solution | null;
    onGradeUpdated: (submissionId: number, grade: string, feedback: string) => void;
}

const UpdateGradeModal: React.FC<UpdateGradeModalProps> = ({
    isOpen,
    onClose,
    submission,
    onGradeUpdated,
}) => {
    const [newGrade, setNewGrade] = useState(submission?.grade || "");
    const [newFeedback, setNewFeedback] = useState(submission?.feedback || "");
    const [updating, setUpdating] = useState(false);
    const [viewingSubmission, setViewingSubmission] = useState(false);

    // Reset form when submission changes
    React.useEffect(() => {
        if (submission) {
            setNewGrade(submission.grade || "");
            setNewFeedback(submission.feedback || "");
        }
    }, [submission]);

    const handleUpdateGrade = async () => {
        if (!submission) return;
        
        setUpdating(true);
        try {
            const updateGradeRequest: UpdateGradeRequest = {
                grade: newGrade,
                feedback: newFeedback
            };
            
            await axios.put(
                `http://localhost:8080/api/classrooms/submissions/${submission.id}/update-grade`,
                updateGradeRequest,
                { withCredentials: true }
            );
            
            onGradeUpdated(submission.id, newGrade, newFeedback);
            toast.success("Grade updated successfully.");
            onClose();
        } catch (err) {
            console.error("Failed to update grade", err);
            toast.error("Failed to update grade. Please try again later.");
        } finally {
            setUpdating(false);
        }
    };

    const toggleSubmissionView = () => {
        setViewingSubmission(!viewingSubmission);
    };

    const openInNewTab = () => {
        if (submission) {
            window.open(submission.fileUrl, "_blank");
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className={viewingSubmission ? "sm:max-w-4xl h-5/6" : "sm:max-w-md"}>
                <DialogHeader>
                    <DialogTitle>
                        {viewingSubmission 
                            ? `Viewing: ${submission?.submitterName}'s Submission` 
                            : "Update Submission Grade"}
                    </DialogTitle>
                </DialogHeader>
                
                {submission && !viewingSubmission && (
                    <div className="space-y-4">
                        <div>
                            <p className="text-sm font-medium mb-1">Student: {submission.submitterName}</p>
                            <p className="text-sm text-gray-500">{submission.submitterEmail}</p>
                        </div>
                        
                        <div className="grid w-full items-center gap-1.5">
                            <Label htmlFor="grade">Grade</Label>
                            <Input
                                id="grade"
                                value={newGrade}
                                onChange={(e) => setNewGrade(e.target.value)}
                                placeholder="Enter grade (e.g. A, B+, 95/100)"
                            />
                        </div>
                        
                        <div className="grid w-full items-center gap-1.5">
                            <Label htmlFor="feedback">Feedback</Label>
                            <Textarea
                                id="feedback"
                                value={newFeedback}
                                onChange={(e) => setNewFeedback(e.target.value)}
                                placeholder="Provide feedback on the submission"
                                rows={4}
                            />
                        </div>
                        
                        <div className="flex space-x-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={toggleSubmissionView}
                                className="flex-1"
                            >
                                <Eye className="h-4 w-4 mr-2" />
                                View Submission
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={openInNewTab}
                                className="px-2"
                            >
                                <ExternalLink className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                )}

                {submission && viewingSubmission && (
                    <div className="flex flex-col h-full">
                        <div className="mb-4 flex justify-between items-center">
                            <div>
                                <p className="text-sm font-medium">Student: {submission.submitterName}</p>
                                <p className="text-sm text-gray-500">{submission.submitterEmail}</p>
                            </div>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={openInNewTab}
                            >
                                <ExternalLink className="h-4 w-4 mr-2" />
                                Open in New Tab
                            </Button>
                        </div>
                        
                        <div className="flex-grow overflow-auto border rounded-md">
                            <iframe 
                                src={submission.fileUrl} 
                                className="w-full h-full" 
                                title={`${submission.submitterName}'s submission`}
                            />
                        </div>
                        
                        <Button
                            variant="outline" 
                            className="mt-4"
                            onClick={toggleSubmissionView}
                        >
                            Back to Grading
                        </Button>
                    </div>
                )}
                
                {!viewingSubmission && (
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={onClose}
                        >
                            Cancel
                        </Button>
                        <Button 
                            onClick={handleUpdateGrade}
                            disabled={updating}
                        >
                            {updating ? "Updating..." : "Update Grade"}
                        </Button>
                    </DialogFooter>
                )}
            </DialogContent>
        </Dialog>
    );
};

export default UpdateGradeModal;