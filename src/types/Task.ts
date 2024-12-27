export interface Task {
  id: string;
  title: string;
  course: string;
  dueDate: string;
  status: "pending" | "completed" | "overdue";
  priority: "low" | "medium" | "high";
}
