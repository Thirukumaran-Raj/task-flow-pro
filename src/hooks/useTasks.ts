import { useState, useCallback, useMemo } from "react";
import { Task, Priority, Status, ViewFilter, DueDateFilter } from "@/types/task";
import { isToday, isPast, isFuture, parseISO, startOfDay } from "date-fns";

const STORAGE_KEY = "taskmanager_tasks";

function generateId() {
  return crypto.randomUUID();
}

function loadTasks(): Task[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function saveTasks(tasks: Task[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>(loadTasks);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<Status | "all">("all");
  const [priorityFilter, setPriorityFilter] = useState<Priority | "all">("all");
  const [dueDateFilter, setDueDateFilter] = useState<DueDateFilter>("all");
  const [viewFilter, setViewFilter] = useState<ViewFilter>("all");

  const persist = useCallback((updated: Task[]) => {
    setTasks(updated);
    saveTasks(updated);
  }, []);

  const addTask = useCallback((task: Omit<Task, "id" | "createdAt">) => {
    const newTask: Task = {
      ...task,
      id: generateId(),
      createdAt: new Date().toISOString(),
    };
    persist([newTask, ...tasks]);
  }, [tasks, persist]);

  const updateTask = useCallback((id: string, updates: Partial<Omit<Task, "id" | "createdAt">>) => {
    persist(tasks.map((t) => (t.id === id ? { ...t, ...updates } : t)));
  }, [tasks, persist]);

  const deleteTask = useCallback((id: string) => {
    persist(tasks.filter((t) => t.id !== id));
  }, [tasks, persist]);

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      // View filter
      if (viewFilter === "today") {
        if (!task.dueDate || !isToday(parseISO(task.dueDate))) return false;
      }
      if (viewFilter === "completed") {
        if (task.status !== "Done") return false;
      }

      // Search
      if (search) {
        const q = search.toLowerCase();
        if (!task.title.toLowerCase().includes(q) && !task.description.toLowerCase().includes(q)) {
          return false;
        }
      }

      // Status filter
      if (statusFilter !== "all" && task.status !== statusFilter) return false;

      // Priority filter
      if (priorityFilter !== "all" && task.priority !== priorityFilter) return false;

      // Due date filter
      if (dueDateFilter !== "all" && task.dueDate) {
        const due = startOfDay(parseISO(task.dueDate));
        const today = startOfDay(new Date());
        if (dueDateFilter === "overdue" && !isPast(due)) return false;
        if (dueDateFilter === "today" && !isToday(due)) return false;
        if (dueDateFilter === "upcoming" && !isFuture(due)) return false;
      }
      if (dueDateFilter !== "all" && !task.dueDate) return false;

      return true;
    });
  }, [tasks, search, statusFilter, priorityFilter, dueDateFilter, viewFilter]);

  const counts = useMemo(() => ({
    all: tasks.length,
    today: tasks.filter((t) => t.dueDate && isToday(parseISO(t.dueDate))).length,
    completed: tasks.filter((t) => t.status === "Done").length,
  }), [tasks]);

  return {
    tasks: filteredTasks,
    counts,
    search, setSearch,
    statusFilter, setStatusFilter,
    priorityFilter, setPriorityFilter,
    dueDateFilter, setDueDateFilter,
    viewFilter, setViewFilter,
    addTask, updateTask, deleteTask,
  };
}
