export interface DoubtResponse {
    id: string;
    content: string;
    createdBy: {
      id: string;
      name: string;
    };
    createdAt: string;
    doubtId: string;
  }