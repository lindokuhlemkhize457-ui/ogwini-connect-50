import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { GraduationCap, Users, Shield, ClipboardList, Calendar, Bell } from "lucide-react";

const portalOptions = [
  {
    title: "Student Portal",
    description: "Access your results, timetables, and academic resources.",
    icon: GraduationCap,
    color: "primary",
    features: ["View Results", "Download Timetables", "Access Past Papers", "OG Assist Chatbot"],
  },
  {
    title: "Teacher Portal",
    description: "Upload content, manage classes, and track student progress.",
    icon: Users,
    color: "accent",
    features: ["Upload Notes", "Upload Results", "Manage Timetables", "Parent Communication"],
  },
  {
    title: "Parent Portal",
    description: "Stay informed about your child's education and school events.",
    icon: Bell,
    color: "primary",
    features: ["Meeting Reminders", "View Child's Results", "School Announcements", "R20/month Subscription"],
  },
  {
    title: "Admin Portal",
    description: "Full system administration and management capabilities.",
    icon: Shield,
    color: "accent",
    features: ["User Management", "Content Moderation", "System Settings", "Analytics Dashboard"],
  },
];

const userRoles = [
  { role: "Learner", description: "Access academic resources and track progress" },
  { role: "Teacher", description: "Upload content and manage student performance" },
  { role: "Grade Head", description: "Oversee grade-level academics and discipline" },
  { role: "Principal", description: "School-wide oversight and approvals" },
  { role: "Admin", description: "System administration and technical management" },
];

export default function PortalPage() {
  return (
    <Layout>
      {/* Header */}
      <section className="py-16 lg:py-20 bg-card">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <span className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
              User Portals
            </span>
            <h1 className="font-heading text-4xl lg:text-5xl font-bold text-foreground mb-4">
              Access Your <span className="text-primary">Portal</span>
            </h1>
            <p className="text-muted-foreground">
              Choose your portal to access personalized features and resources based on your role.
            </p>
          </div>
        </div>
      </section>

      {/* Portal Options */}
      <section className="py-12 lg:py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-6">
            {portalOptions.map((portal) => (
              <div key={portal.title} className="glass-card p-8 hover:border-primary/50 transition-all duration-300">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-4 ${
                  portal.color === "primary" ? "bg-primary/10" : "bg-accent/10"
                }`}>
                  <portal.icon className={`w-7 h-7 ${
                    portal.color === "primary" ? "text-primary" : "text-accent"
                  }`} />
                </div>
                <h3 className="font-heading text-xl font-semibold text-foreground mb-2">{portal.title}</h3>
                <p className="text-muted-foreground text-sm mb-4">{portal.description}</p>
                <ul className="space-y-2 mb-6">
                  {portal.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Button variant={portal.color === "primary" ? "default" : "accent"} className="w-full" asChild>
                  <Link to="/login">Access Portal</Link>
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* User Roles */}
      <section className="py-12 lg:py-16 bg-card">
        <div className="container mx-auto px-4">
          <h2 className="font-heading text-2xl font-bold text-foreground text-center mb-8">System User Roles</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {userRoles.map((user) => (
              <div key={user.role} className="glass-card p-4 text-center">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-3">
                  <ClipboardList className="w-5 h-5 text-primary" />
                </div>
                <h4 className="font-semibold text-foreground text-sm">{user.role}</h4>
                <p className="text-xs text-muted-foreground mt-1">{user.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Parent Subscription Info */}
      <section className="py-12 lg:py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="glass-card p-8 max-w-2xl mx-auto text-center">
            <div className="w-14 h-14 rounded-2xl bg-accent/10 flex items-center justify-center mx-auto mb-4">
              <Calendar className="w-7 h-7 text-accent" />
            </div>
            <h3 className="font-heading text-2xl font-bold text-foreground mb-2">Parent Meeting Reminders</h3>
            <p className="text-muted-foreground mb-4">
              Subscribe for R20/month to receive automated reminders about parent meetings and important school events.
            </p>
            <div className="flex justify-center gap-4">
              <Button asChild>
                <Link to="/signup">Subscribe Now</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link to="/about">Learn More</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
