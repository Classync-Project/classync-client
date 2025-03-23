// types.ts
export interface Solution {
    id: number;
    assignmentId: number;
    submittedById: number;
    submitterName: string;
    submitterEmail: string;
    fileUrl: string;
    submissionDate: string;
    grade: string | null;
    feedback: string | null;
}