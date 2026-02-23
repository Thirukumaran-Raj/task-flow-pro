export type Priority = "High" | "Medium" | "Low";
export type Status = "Pending" | "In-Progress" | "Done";

export interface Task {
  id: string;
  title: string;
  description: string;
  priority: Priority;
  status: Status;
  dueDate: string | null;
  createdAt: string;
}

export type ViewFilter = "all" | "today" | "completed";
export type DueDateFilter = "all" | "overdue" | "today" | "upcoming";
