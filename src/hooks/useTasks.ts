import { useState, useCallback, useMemo, useEffect } from "react";
import { Task, Priority, Status, ViewFilter, DueDateFilter } from "@/types/task";
import { isToday, isPast, isFuture, parseISO, startOfDay } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<Status | "all">("all");
  const [priorityFilter, setPriorityFilter] = useState<Priority | "all">("all");
  const [dueDateFilter, setDueDateFilter] = useState<DueDateFilter>("all");
  const [viewFilter, setViewFilter] = useState<ViewFilter>("all");
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchTasks = useCallback(async () => {
    if (!user) { setTasks([]); setLoading(false); return; }
    setLoading(true);
    const { data, error } = await supabase
      .from("tasks")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast({ title: "Error loading tasks", description: error.message, variant: "destructive" });
    } else {
      setTasks((data || []).map((row) => ({
        id: row.id,
        title: row.title,
        description: row.description,
        priority: row.priority as Priority,
        status: row.status as Status,
        dueDate: row.due_date,
        createdAt: row.created_at,
      })));
    }
    setLoading(false);
  }, [user, toast]);

  useEffect(() => { fetchTasks(); }, [fetchTasks]);

  const addTask = useCallback(async (task: Omit<Task, "id" | "createdAt">) => {
    if (!user) return;
    const { error } = await supabase.from("tasks").insert({
      title: task.title,
      description: task.description,
      priority: task.priority,
      status: task.status,
      due_date: task.dueDate,
      user_id: user.id,
    });
    if (error) {
      toast({ title: "Error creating task", description: error.message, variant: "destructive" });
    } else {
      fetchTasks();
    }
  }, [user, fetchTasks, toast]);

  const updateTask = useCallback(async (id: string, updates: Partial<Omit<Task, "id" | "createdAt">>) => {
    const dbUpdates: Record<string, unknown> = {};
    if (updates.title !== undefined) dbUpdates.title = updates.title;
    if (updates.description !== undefined) dbUpdates.description = updates.description;
    if (updates.priority !== undefined) dbUpdates.priority = updates.priority;
    if (updates.status !== undefined) dbUpdates.status = updates.status;
    if (updates.dueDate !== undefined) dbUpdates.due_date = updates.dueDate;

    const { error } = await supabase.from("tasks").update(dbUpdates).eq("id", id);
    if (error) {
      toast({ title: "Error updating task", description: error.message, variant: "destructive" });
    } else {
      fetchTasks();
    }
  }, [fetchTasks, toast]);

  const deleteTask = useCallback(async (id: string) => {
    const { error } = await supabase.from("tasks").delete().eq("id", id);
    if (error) {
      toast({ title: "Error deleting task", description: error.message, variant: "destructive" });
    } else {
      fetchTasks();
    }
  }, [fetchTasks, toast]);

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      if (viewFilter === "today") {
        if (!task.dueDate || !isToday(parseISO(task.dueDate))) return false;
      }
      if (viewFilter === "completed") {
        if (task.status !== "Done") return false;
      }
      if (search) {
        const q = search.toLowerCase();
        if (!task.title.toLowerCase().includes(q) && !task.description.toLowerCase().includes(q)) return false;
      }
      if (statusFilter !== "all" && task.status !== statusFilter) return false;
      if (priorityFilter !== "all" && task.priority !== priorityFilter) return false;
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
    allTasks: tasks,
    counts,
    loading,
    search, setSearch,
    statusFilter, setStatusFilter,
    priorityFilter, setPriorityFilter,
    dueDateFilter, setDueDateFilter,
    viewFilter, setViewFilter,
    addTask, updateTask, deleteTask,
  };
}
