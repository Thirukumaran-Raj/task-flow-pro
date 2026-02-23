import { Priority, Status, DueDateFilter } from "@/types/task";
import { Search, SlidersHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface TaskFiltersProps {
  search: string;
  onSearchChange: (v: string) => void;
  statusFilter: Status | "all";
  onStatusChange: (v: Status | "all") => void;
  priorityFilter: Priority | "all";
  onPriorityChange: (v: Priority | "all") => void;
  dueDateFilter: DueDateFilter;
  onDueDateChange: (v: DueDateFilter) => void;
}

export function TaskFilters({
  search, onSearchChange,
  statusFilter, onStatusChange,
  priorityFilter, onPriorityChange,
  dueDateFilter, onDueDateChange,
}: TaskFiltersProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search tasks..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9 bg-card"
        />
      </div>

      <div className="flex gap-2 flex-wrap">
        <Select value={statusFilter} onValueChange={(v) => onStatusChange(v as Status | "all")}>
          <SelectTrigger className="w-[130px] bg-card">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="Pending">Pending</SelectItem>
            <SelectItem value="In-Progress">In-Progress</SelectItem>
            <SelectItem value="Done">Done</SelectItem>
          </SelectContent>
        </Select>

        <Select value={priorityFilter} onValueChange={(v) => onPriorityChange(v as Priority | "all")}>
          <SelectTrigger className="w-[130px] bg-card">
            <SelectValue placeholder="Priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Priority</SelectItem>
            <SelectItem value="High">High</SelectItem>
            <SelectItem value="Medium">Medium</SelectItem>
            <SelectItem value="Low">Low</SelectItem>
          </SelectContent>
        </Select>

        <Select value={dueDateFilter} onValueChange={(v) => onDueDateChange(v as DueDateFilter)}>
          <SelectTrigger className="w-[130px] bg-card">
            <SelectValue placeholder="Due Date" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Dates</SelectItem>
            <SelectItem value="overdue">Overdue</SelectItem>
            <SelectItem value="today">Today</SelectItem>
            <SelectItem value="upcoming">Upcoming</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
