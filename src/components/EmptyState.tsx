import { ClipboardList, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  onNewTask: () => void;
  hasFilters: boolean;
}

export function EmptyState({ onNewTask, hasFilters }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 animate-fade-in">
      <div className="rounded-2xl bg-muted p-6 mb-6">
        <ClipboardList className="h-12 w-12 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-semibold text-foreground mb-1">
        {hasFilters ? "No tasks match your filters" : "No tasks yet"}
      </h3>
      <p className="text-sm text-muted-foreground mb-6 max-w-xs text-center">
        {hasFilters
          ? "Try adjusting your filters or search to find what you're looking for."
          : "Create your first task to get started with organizing your work."}
      </p>
      {!hasFilters && (
        <Button onClick={onNewTask} className="gap-2">
          <Plus className="h-4 w-4" /> Create a Task
        </Button>
      )}
    </div>
  );
}
