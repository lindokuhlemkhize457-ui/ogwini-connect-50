import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { GraduationCap, Users, Shield, ClipboardList, Calendar, Bell, Clock, CheckCircle, XCircle, LogOut } from "lucide-react";
import { useAuth, useRoleRedirect } from "@/hooks/useAuth";
import schoolTrophy from "@/assets/school-trophy.jpg";

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
  const { user, registration, role, loading, signOut, isApproved } = useAuth();
  const { redirectToDashboard } = useRoleRedirect();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  // If user is approved, show button to go to dashboard
  const renderUserStatus = () => {
    if (!user) {
      return (
        <div className="bg-card border border-border rounded-2xl p-8 max-w-2xl mx-auto text-center shadow-lg">
          <h3 className="font-heading text-2xl font-bold text-foreground mb-4">Get Started</h3>
          <p className="text-muted-foreground mb-6">
            Sign in to access your personalized portal or create an account to join our community.
          </p>
          <div className="flex justify-center gap-4">
            <Button asChild>
              <Link to="/login">Sign In</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/signup">Create Account</Link>
            </Button>
          </div>
        </div>
      );
    }

    if (registration?.status === "pending") {
      return (
        <div className="bg-accent/10 border border-accent/30 rounded-2xl p-8 max-w-2xl mx-auto text-center">
          <div className="w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center mx-auto mb-4">
            <Clock className="w-8 h-8 text-accent" />
          </div>
          <h3 className="font-heading text-2xl font-bold text-foreground mb-2">Registration Pending</h3>
          <p className="text-muted-foreground mb-4">
            Your registration is awaiting approval from the school administration. You'll receive an email once your account is activated.
          </p>
          <p className="text-sm text-muted-foreground mb-6">
            Registered as: <span className="font-semibold text-accent capitalize">{registration.role}</span>
          </p>
          <Button variant="outline" onClick={handleSignOut}>
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </div>
      );
    }

    if (registration?.status === "declined") {
      return (
        <div className="bg-destructive/10 border border-destructive/30 rounded-2xl p-8 max-w-2xl mx-auto text-center">
          <div className="w-16 h-16 rounded-full bg-destructive/20 flex items-center justify-center mx-auto mb-4">
            <XCircle className="w-8 h-8 text-destructive" />
          </div>
          <h3 className="font-heading text-2xl font-bold text-foreground mb-2">Registration Declined</h3>
          <p className="text-muted-foreground mb-6">
            Unfortunately, your registration was not approved. Please contact the school administration for more information.
          </p>
          <Button variant="outline" onClick={handleSignOut}>
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </div>
      );
    }

    if (isApproved && role) {
      return (
        <div className="bg-primary/10 border border-primary/30 rounded-2xl p-8 max-w-2xl mx-auto text-center">
          <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-primary" />
          </div>
          <h3 className="font-heading text-2xl font-bold text-foreground mb-2">Welcome Back!</h3>
          <p className="text-muted-foreground mb-4">
            Your account is active. Access your dashboard to view resources and manage your profile.
          </p>
          <p className="text-sm text-muted-foreground mb-6">
            Role: <span className="font-semibold text-primary capitalize">{role.replace("_", " ")}</span>
          </p>
          <div className="flex justify-center gap-4">
            <Button onClick={redirectToDashboard}>
              Go to Dashboard
            </Button>
            <Button variant="outline" onClick={handleSignOut}>
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <Layout>
      {/* Hero with Image */}
      <section className="relative py-20 lg:py-28 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={schoolTrophy}
            alt="School achievements"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-primary/70" />
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-2xl mx-auto text-center text-white">
            <span className="inline-block px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm text-white text-sm font-medium mb-4">
              User Portals
            </span>
            <h1 className="font-heading text-4xl lg:text-5xl font-bold mb-4">
              Access Your Portal
            </h1>
            <p className="text-white/90">
              Choose your portal to access personalized features and resources based on your role.
            </p>
          </div>
        </div>
      </section>

      {/* User Status Section */}
      <section className="py-12 lg:py-16 bg-background">
        <div className="container mx-auto px-4">
          {loading ? (
            <div className="text-center py-8">
              <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
              <p className="text-muted-foreground mt-4">Loading...</p>
            </div>
          ) : (
            renderUserStatus()
          )}
        </div>
      </section>

      {/* Portal Options */}
      <section className="py-12 lg:py-16 bg-secondary/30">
        <div className="container mx-auto px-4">
          <h2 className="font-heading text-2xl font-bold text-foreground text-center mb-8">Available Portals</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {portalOptions.map((portal) => (
              <div key={portal.title} className="bg-card border border-border rounded-xl p-8 hover:border-primary/50 hover:shadow-lg transition-all duration-300">
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
                <Button variant={portal.color === "primary" ? "default" : "outline"} className="w-full" asChild>
                  <Link to="/login">Access Portal</Link>
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* User Roles */}
      <section className="py-12 lg:py-16 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="font-heading text-2xl font-bold text-foreground text-center mb-8">System User Roles</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {userRoles.map((user) => (
              <div key={user.role} className="bg-card border border-border rounded-xl p-4 text-center hover:shadow-md transition-shadow">
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
      <section className="py-12 lg:py-16 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="bg-card border border-border rounded-2xl p-8 max-w-2xl mx-auto text-center shadow-lg">
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
