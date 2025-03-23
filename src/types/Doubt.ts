import { DoubtResponse } from "./DoubtResponse";

export interface Doubt {
    id: string;
    title: string;
    content: string;
    createdBy: {
      id: string;
      name: string;
    };
    createdAt: string;
    classroomId: string;
    resolved: boolean;
    responses?: DoubtResponse[];
  }