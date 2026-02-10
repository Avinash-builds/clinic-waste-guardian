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
  Leaf,
  Truck
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

interface NavItem {
  icon: React.ElementType;
  label: string;
  href: string;
}

const mainNavItems: NavItem[] = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
  { icon: ClipboardList, label: "Waste Entry", href: "/waste-entry" },
  { icon: Recycle, label: "Recycling", href: "/recycling" },
  { icon: BarChart3, label: "Analytics", href: "/analytics" },
  { icon: Building2, label: "Clinics", href: "/clinics" },
  { icon: Truck, label: "Schedule Pickup", href: "/schedule-pickup" },
  { icon: Users, label: "Users", href: "/users" },
];

const secondaryNavItems: NavItem[] = [
  { icon: Bell, label: "Notifications", href: "/notifications" },
  { icon: Settings, label: "Settings", href: "/settings" },
];

export function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    navigate("/auth");
  };

  // Get user initials from email or name
  const getUserInitials = () => {
    if (user?.user_metadata?.full_name) {
      const names = user.user_metadata.full_name.split(" ");
      return names.map((n: string) => n[0]).join("").toUpperCase().slice(0, 2);
    }
    return user?.email?.slice(0, 2).toUpperCase() || "U";
  };

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
          <Link
            key={item.label}
            to={item.href}
            className={cn("nav-link", location.pathname === item.href && "active")}
          >
            <item.icon className="w-5 h-5" />
            <span className="font-medium">{item.label}</span>
          </Link>
        ))}

        <div className="pt-6">
          <p className="px-4 py-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            System
          </p>
          {secondaryNavItems.map((item) => (
            <Link
              key={item.label}
              to={item.href}
              className={cn("nav-link", location.pathname === item.href && "active")}
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </Link>
          ))}
        </div>
      </nav>

      {/* User Profile */}
      <div className="p-4 border-t border-sidebar-border">
        <div className="flex items-center gap-3 p-3 rounded-lg bg-accent/50">
          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
            <span className="text-sm font-semibold text-primary">{getUserInitials()}</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground truncate">
              {user?.user_metadata?.full_name || user?.email?.split("@")[0] || "User"}
            </p>
            <p className="text-xs text-muted-foreground">Clinic Staff</p>
          </div>
          <button 
            onClick={handleSignOut}
            className="p-2 rounded-lg hover:bg-accent transition-colors"
            title="Sign out"
          >
            <LogOut className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>
      </div>
    </aside>
  );
}
