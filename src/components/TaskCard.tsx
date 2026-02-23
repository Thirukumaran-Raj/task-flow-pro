import { Task } from "@/types/task";
import { Calendar, Flag, MoreHorizontal, Pencil, Trash2, Clock } from "lucide-react";
import { format, parseISO, isPast, isToday, startOfDay } from "date-fns";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onToggleDone: (task: Task) => void;
}

export function TaskCard({ task, onEdit, onDelete, onToggleDone }: TaskCardProps) {
  const isDone = task.status === "Done";
  const isOverdue = task.dueDate && isPast(startOfDay(parseISO(task.dueDate))) && !isToday(parseISO(task.dueDate)) && !isDone;

  return (
    <div className={cn(
      "group bg-card rounded-xl border border-border p-4 transition-all hover:shadow-md animate-fade-in",
      isDone && "opacity-60"
    )}>
      <div className="flex items-start gap-3">
        <Checkbox
          checked={isDone}
          onCheckedChange={() => onToggleDone(task)}
          className="mt-1 shrink-0"
        />

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h3 className={cn(
              "font-semibold text-sm text-card-foreground",
              isDone && "line-through text-muted-foreground"
            )}>
              {task.title}
            </h3>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-md hover:bg-muted -mt-1 -mr-1">
                  <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onEdit(task)}>
                  <Pencil className="h-4 w-4 mr-2" /> Edit
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onDelete(task.id)} className="text-destructive focus:text-destructive">
                  <Trash2 className="h-4 w-4 mr-2" /> Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {task.description && (
            <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
              {task.description}
            </p>
          )}

          <div className="flex items-center gap-2 mt-3 flex-wrap">
            <Badge variant="outline" className={cn("text-[10px] font-semibold border-0 px-2 py-0.5", {
              "priority-high": task.priority === "High",
              "priority-medium": task.priority === "Medium",
              "priority-low": task.priority === "Low",
            })}>
              <Flag className="h-3 w-3 mr-1" />
              {task.priority}
            </Badge>

            <Badge variant="outline" className={cn("text-[10px] font-semibold border-0 px-2 py-0.5", {
              "status-pending": task.status === "Pending",
              "status-progress": task.status === "In-Progress",
              "status-done": task.status === "Done",
            })}>
              {task.status}
            </Badge>

            {task.dueDate && (
              <span className={cn(
                "flex items-center gap-1 text-[10px] font-medium",
                isOverdue ? "text-destructive" : "text-muted-foreground"
              )}>
                {isOverdue ? <Clock className="h-3 w-3" /> : <Calendar className="h-3 w-3" />}
                {format(parseISO(task.dueDate), "MMM d")}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
