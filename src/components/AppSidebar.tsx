import { ListTodo, CalendarDays, CheckCircle2, Plus, LayoutDashboard } from "lucide-react";
import { cn } from "@/lib/utils";
import { ViewFilter } from "@/types/task";
import { Button } from "@/components/ui/button";

interface AppSidebarProps {
  viewFilter: ViewFilter;
  onViewChange: (view: ViewFilter) => void;
  onNewTask: () => void;
  counts: { all: number; today: number; completed: number };
  collapsed?: boolean;
}

const navItems: { label: string; value: ViewFilter; icon: React.ElementType }[] = [
  { label: "All Tasks", value: "all", icon: ListTodo },
  { label: "Today", value: "today", icon: CalendarDays },
  { label: "Completed", value: "completed", icon: CheckCircle2 },
];

export function AppSidebar({ viewFilter, onViewChange, onNewTask, counts, collapsed }: AppSidebarProps) {
  return (
    <aside
      className={cn(
        "flex flex-col border-r border-border bg-card transition-all duration-200",
        collapsed ? "w-16" : "w-64"
      )}
    >
      {/* Logo */}
      <div className="flex items-center gap-2 px-4 py-5 border-b border-border">
        <LayoutDashboard className="h-6 w-6 text-primary shrink-0" />
        {!collapsed && <span className="text-lg font-bold tracking-tight text-foreground">TaskManager Pro</span>}
      </div>

      {/* New Task Button */}
      <div className="p-3">
        <Button onClick={onNewTask} className="w-full gap-2" size={collapsed ? "icon" : "default"}>
          <Plus className="h-4 w-4" />
          {!collapsed && "New Task"}
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2 py-1 space-y-1">
        {navItems.map((item) => {
          const active = viewFilter === item.value;
          const count = counts[item.value];
          return (
            <button
              key={item.value}
              onClick={() => onViewChange(item.value)}
              className={cn(
                "flex items-center w-full gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                active
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <item.icon className="h-4 w-4 shrink-0" />
              {!collapsed && (
                <>
                  <span className="flex-1 text-left">{item.label}</span>
                  <span className={cn(
                    "text-xs tabular-nums rounded-full px-2 py-0.5",
                    active ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
                  )}>
                    {count}
                  </span>
                </>
              )}
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
