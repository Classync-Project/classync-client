import React from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { ExternalLink } from "lucide-react";
import { Solution } from "@/types/Solution";

interface SubmissionViewerModalProps {
    isOpen: boolean;
    onClose: () => void;
    submission: Solution | null;
}

const SubmissionViewerModal: React.FC<SubmissionViewerModalProps> = ({
    isOpen,
    onClose,
    submission,
}) => {
    const openInNewTab = () => {
        if (submission) {
            window.open(submission.fileUrl, "_blank");
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-4xl h-[90%] flex flex-col">
                <DialogHeader>
                    <DialogTitle className="text-xl font-semibold">
                        {submission?.submitterName}'s Submission
                    </DialogTitle>
                </DialogHeader>

                {submission && (
                    <div className="flex flex-col h-full gap-4">
                        {/* Student Info and Actions */}
                        <div className="flex justify-between items-center bg-gray-50 p-4 rounded-lg">
                            <div>
                                <p className="text-sm font-medium text-gray-700">
                                    Student: {submission.submitterName}
                                </p>
                                <p className="text-sm text-gray-500">
                                    {submission.submitterEmail}
                                </p>
                                {submission.grade && (
                                    <p className="text-sm mt-1 text-gray-700">
                                        <span className="font-medium">Grade:</span> {submission.grade}
                                    </p>
                                )}
                            </div>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={openInNewTab}
                                className="flex items-center gap-2"
                            >
                                <ExternalLink className="h-4 w-4" />
                                Open in New Tab
                            </Button>
                        </div>

                        {/* Submission Content */}
                        <div className="flex-grow overflow-hidden border rounded-lg shadow-sm">
                            <iframe
                                src={submission.fileUrl}
                                className="w-full h-full"
                                title={`${submission.submitterName}'s submission`}
                                style={{ minHeight: "400px" }} // Ensure iframe has a minimum height
                            />
                        </div>

                        {/* Close Button */}
                        <div className="flex justify-end">
                            <Button
                                variant="outline"
                                onClick={onClose}
                                className="w-24"
                            >
                                Close
                            </Button>
                        </div>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
};

export default SubmissionViewerModal;