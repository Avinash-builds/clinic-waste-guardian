import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Leaf, Shield, BarChart3, Truck, Building2, Recycle, ArrowRight, CheckCircle } from "lucide-react";

const Landing = () => {
  const navigate = useNavigate();

  const features = [
    { icon: Leaf, title: "Waste Tracking", desc: "Record and categorize biomedical waste with color-coded classification (Yellow, Red, Blue, White, Sharps)." },
    { icon: Truck, title: "Pickup Scheduling", desc: "Clinics submit pickup requests, management verifies and schedules collection dates seamlessly." },
    { icon: Recycle, title: "Recycling Management", desc: "Track recycling batches, measure output weight, and monitor recycling rates in real-time." },
    { icon: BarChart3, title: "Analytics & Reports", desc: "Generate downloadable PDF reports with waste trends, category breakdowns, and scheduling data." },
    { icon: Building2, title: "Clinic Management", desc: "Register clinics, track compliance status, and manage clinic profiles from a single dashboard." },
    { icon: Shield, title: "Role-Based Access", desc: "Secure system with admin, moderator, and clinic staff roles with row-level data protection." },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 bg-card/80 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
              <Leaf className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-display font-bold text-xl text-foreground">BioWaste</span>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" onClick={() => navigate("/auth")}>Sign In</Button>
            <Button onClick={() => navigate("/auth")} className="bg-primary hover:bg-primary/90">
              Get Started <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
            <Shield className="w-4 h-4" /> Compliant Biomedical Waste Management
          </div>
          <h1 className="font-display text-5xl md:text-6xl font-extrabold text-foreground leading-tight mb-6">
            Smart Biomedical<br />
            <span className="text-primary">Waste Management</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            Track, manage, and report biomedical waste from clinics with real-time analytics, 
            automated pickup scheduling, and comprehensive compliance reporting.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Button size="lg" onClick={() => navigate("/auth")} className="bg-primary hover:bg-primary/90 text-lg px-8 py-6">
              Start Managing Waste <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 px-6 bg-card border-y border-border">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { value: "5+", label: "Waste Categories" },
            { value: "100%", label: "RLS Secured" },
            { value: "PDF", label: "Report Export" },
            { value: "Real-time", label: "Data Sync" },
          ].map(s => (
            <div key={s.label}>
              <p className="text-3xl font-bold text-primary">{s.value}</p>
              <p className="text-sm text-muted-foreground mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl font-bold text-foreground mb-3">Everything You Need</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              A complete platform for managing biomedical waste lifecycle from entry to disposal.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map(f => (
              <div key={f.title} className="p-6 rounded-xl bg-card border border-border hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                  <f.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-display font-semibold text-lg text-foreground mb-2">{f.title}</h3>
                <p className="text-sm text-muted-foreground">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 px-6 bg-card border-y border-border">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-display text-3xl font-bold text-foreground text-center mb-12">How It Works</h2>
          <div className="space-y-8">
            {[
              { step: "1", title: "Register & Log In", desc: "Create your account, get assigned a role, and access the dashboard." },
              { step: "2", title: "Record Waste Entries", desc: "Select clinic, category, and weight to log biomedical waste records." },
              { step: "3", title: "Schedule Pickups", desc: "Submit pickup requests. Management verifies and schedules collection." },
              { step: "4", title: "Generate Reports", desc: "Download PDF reports with waste entry details and scheduling data." },
            ].map(s => (
              <div key={s.step} className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold shrink-0">
                  {s.step}
                </div>
                <div>
                  <h3 className="font-display font-semibold text-foreground">{s.title}</h3>
                  <p className="text-sm text-muted-foreground">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-display text-3xl font-bold text-foreground mb-4">Ready to Get Started?</h2>
          <p className="text-muted-foreground mb-8">Join the platform and start managing biomedical waste efficiently.</p>
          <Button size="lg" onClick={() => navigate("/auth")} className="bg-primary hover:bg-primary/90 text-lg px-8 py-6">
            Create Your Account <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-border">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Leaf className="w-5 h-5 text-primary" />
            <span className="font-display font-bold text-foreground">BioWaste</span>
          </div>
          <p className="text-sm text-muted-foreground">© {new Date().getFullYear()} BioWaste Management System</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
