import { useState } from "react";
import { useTasks } from "@/hooks/useTasks";
import { AppSidebar } from "@/components/AppSidebar";
import { TaskCard } from "@/components/TaskCard";
import { TaskDialog } from "@/components/TaskDialog";
import { TaskFilters } from "@/components/TaskFilters";
import { EmptyState } from "@/components/EmptyState";
import { Task } from "@/types/task";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";

const viewTitles = {
  all: "All Tasks",
  today: "Today",
  completed: "Completed",
};

const Index = () => {
  const {
    tasks, counts,
    search, setSearch,
    statusFilter, setStatusFilter,
    priorityFilter, setPriorityFilter,
    dueDateFilter, setDueDateFilter,
    viewFilter, setViewFilter,
    addTask, updateTask, deleteTask,
  } = useTasks();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const openNew = () => { setEditingTask(null); setDialogOpen(true); };
  const openEdit = (task: Task) => { setEditingTask(task); setDialogOpen(true); };

  const handleSave = (data: Omit<Task, "id" | "createdAt">) => {
    if (editingTask) {
      updateTask(editingTask.id, data);
    } else {
      addTask(data);
    }
  };

  const handleToggleDone = (task: Task) => {
    updateTask(task.id, { status: task.status === "Done" ? "Pending" : "Done" });
  };

  const hasFilters = search !== "" || statusFilter !== "all" || priorityFilter !== "all" || dueDateFilter !== "all";

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-foreground/20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-30 lg:relative lg:z-0
        transform transition-transform duration-200
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0 lg:hidden"}
      `}>
        <AppSidebar
          viewFilter={viewFilter}
          onViewChange={(v) => { setViewFilter(v); setSidebarOpen(false); }}
          onNewTask={() => { openNew(); setSidebarOpen(false); }}
          counts={counts}
        />
      </div>

      {/* Main */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="flex items-center gap-3 px-6 py-4 border-b border-border bg-card">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-bold text-foreground">{viewTitles[viewFilter]}</h1>
          <span className="text-sm text-muted-foreground">
            {tasks.length} task{tasks.length !== 1 ? "s" : ""}
          </span>
        </header>

        <div className="flex-1 overflow-auto p-6 space-y-6">
          <TaskFilters
            search={search}
            onSearchChange={setSearch}
            statusFilter={statusFilter}
            onStatusChange={setStatusFilter}
            priorityFilter={priorityFilter}
            onPriorityChange={setPriorityFilter}
            dueDateFilter={dueDateFilter}
            onDueDateChange={setDueDateFilter}
          />

          {tasks.length === 0 ? (
            <EmptyState onNewTask={openNew} hasFilters={hasFilters} />
          ) : (
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {tasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onEdit={openEdit}
                  onDelete={deleteTask}
                  onToggleDone={handleToggleDone}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      <TaskDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onSave={handleSave}
        task={editingTask}
      />
    </div>
  );
};

export default Index;
