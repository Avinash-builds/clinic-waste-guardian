import { 
  LayoutDashboard, 
  ClipboardList, 
  Recycle, 
  BarChart3, 
  Building2, 
  Users, 
  Bell, 
  Settings,
  LogOut,
  Leaf
} from "lucide-react";
import { cn } from "@/lib/utils";

interface NavItem {
  icon: React.ElementType;
  label: string;
  href: string;
  active?: boolean;
}

const mainNavItems: NavItem[] = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/", active: true },
  { icon: ClipboardList, label: "Waste Entry", href: "/waste-entry" },
  { icon: Recycle, label: "Recycling", href: "/recycling" },
  { icon: BarChart3, label: "Analytics", href: "/analytics" },
  { icon: Building2, label: "Clinics", href: "/clinics" },
  { icon: Users, label: "Users", href: "/users" },
];

const secondaryNavItems: NavItem[] = [
  { icon: Bell, label: "Notifications", href: "/notifications" },
  { icon: Settings, label: "Settings", href: "/settings" },
];

export function Sidebar() {
  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-sidebar border-r border-sidebar-border flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
            <Leaf className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="font-display font-bold text-foreground">BioWaste</h1>
            <p className="text-xs text-muted-foreground">Management System</p>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        <p className="px-4 py-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Main Menu
        </p>
        {mainNavItems.map((item) => (
          <a
            key={item.label}
            href={item.href}
            className={cn("nav-link", item.active && "active")}
          >
            <item.icon className="w-5 h-5" />
            <span className="font-medium">{item.label}</span>
          </a>
        ))}

        <div className="pt-6">
          <p className="px-4 py-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            System
          </p>
          {secondaryNavItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="nav-link"
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </a>
          ))}
        </div>
      </nav>

      {/* User Profile */}
      <div className="p-4 border-t border-sidebar-border">
        <div className="flex items-center gap-3 p-3 rounded-lg bg-accent/50">
          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
            <span className="text-sm font-semibold text-primary">JD</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground truncate">John Doe</p>
            <p className="text-xs text-muted-foreground">Administrator</p>
          </div>
          <button className="p-2 rounded-lg hover:bg-accent transition-colors">
            <LogOut className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>
      </div>
    </aside>
  );
}
