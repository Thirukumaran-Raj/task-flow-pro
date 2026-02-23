import { Task, Status } from "@/types/task";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import { TaskCard } from "@/components/TaskCard";

const columns: { status: Status; label: string; colorClass: string }[] = [
  { status: "Pending", label: "Pending", colorClass: "bg-status-pending-bg" },
  { status: "In-Progress", label: "In Progress", colorClass: "bg-status-progress-bg" },
  { status: "Done", label: "Done", colorClass: "bg-status-done-bg" },
];

interface TaskBoardProps {
  tasks: Task[];
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onToggleDone: (task: Task) => void;
  onStatusChange: (id: string, status: Status) => void;
}

export function TaskBoard({ tasks, onEdit, onDelete, onToggleDone, onStatusChange }: TaskBoardProps) {
  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const newStatus = result.destination.droppableId as Status;
    const taskId = result.draggableId;
    const task = tasks.find((t) => t.id === taskId);
    if (task && task.status !== newStatus) {
      onStatusChange(taskId, newStatus);
    }
  };

  const grouped = columns.map((col) => ({
    ...col,
    tasks: tasks.filter((t) => t.status === col.status),
  }));

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {grouped.map((col) => (
          <div key={col.status} className="flex flex-col">
            <div className="flex items-center gap-2 mb-3 px-1">
              <div className={`h-2.5 w-2.5 rounded-full ${col.status === "Pending" ? "bg-status-pending" : col.status === "In-Progress" ? "bg-status-progress" : "bg-status-done"}`} />
              <h3 className="text-sm font-semibold text-foreground">{col.label}</h3>
              <span className="text-xs text-muted-foreground ml-auto">{col.tasks.length}</span>
            </div>

            <Droppable droppableId={col.status}>
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className={`flex-1 space-y-2 rounded-xl p-2 min-h-[200px] transition-colors ${
                    snapshot.isDraggingOver ? "bg-primary/5 ring-2 ring-primary/20" : "bg-muted/40"
                  }`}
                >
                  {col.tasks.map((task, index) => (
                    <Draggable key={task.id} draggableId={task.id} index={index}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className={snapshot.isDragging ? "opacity-90 rotate-1" : ""}
                        >
                          <TaskCard
                            task={task}
                            onEdit={onEdit}
                            onDelete={onDelete}
                            onToggleDone={onToggleDone}
                          />
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>
        ))}
      </div>
    </DragDropContext>
  );
}
