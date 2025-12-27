import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { GraduationCap, Mail, Lock, Eye, EyeOff, User, ArrowLeft, Phone } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import schoolLab from "@/assets/school-science-lab.jpg";

type RoleType = "learner" | "teacher" | "admin";

const userTypes: { value: RoleType; label: string }[] = [
  { value: "learner", label: "Learner" },
  { value: "teacher", label: "Teacher" },
  { value: "admin", label: "Admin" },
];

export default function SignupPage() {
  const { toast } = useToast();
  const { signUp, user, loading } = useAuth();
  const navigate = useNavigate();
  
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    userType: "learner" as RoleType,
  });

  useEffect(() => {
    if (!loading && user) {
      navigate("/portal");
    }
  }, [user, loading, navigate]);

  const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePhone = (phone: string) => /^(\+27|0)\d{9}$/.test(phone.replace(/\s/g, ""));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateEmail(formData.email)) {
      toast({ title: "Invalid Email", description: "Please enter a valid email.", variant: "destructive" });
      return;
    }

    if (formData.phone && !validatePhone(formData.phone)) {
      toast({ title: "Invalid Phone", description: "Please enter a valid SA phone number.", variant: "destructive" });
      return;
    }

    if (formData.password.length < 8) {
      toast({ title: "Weak Password", description: "Password must be at least 8 characters.", variant: "destructive" });
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast({ title: "Password Mismatch", description: "Passwords do not match.", variant: "destructive" });
      return;
    }

    setIsSubmitting(true);

    const { error } = await signUp(formData.email, formData.password, {
      first_name: formData.firstName,
      last_name: formData.lastName,
      role: formData.userType,
      phone: formData.phone,
    });

    if (!error) {
      navigate("/portal");
    }

    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left Side - Image */}
      <div className="hidden lg:block lg:w-1/2 relative">
        <img
          src={schoolLab}
          alt="Ogwini Comprehensive Technical High School Science Lab"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-primary/60" />
        <div className="absolute inset-0 flex flex-col justify-between p-12 text-white">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <GraduationCap className="w-7 h-7 text-white" />
            </div>
            <div>
              <span className="font-heading font-bold text-lg">Ogwini</span>
              <p className="text-xs text-white/80">Technical High School</p>
            </div>
          </Link>
          
          <div>
            <h1 className="font-heading text-4xl font-bold mb-4">
              Join the
              <br />
              Ogwini Community
            </h1>
            <p className="text-white/90 max-w-md">
              Create your account to access educational resources, track academic progress, and stay connected with the school.
            </p>
          </div>

          <p className="text-sm text-white/70">
            © {new Date().getFullYear()} Ogwini Comprehensive Technical High School
          </p>
        </div>
      </div>

      {/* Right Side - Signup Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-background overflow-y-auto">
        <div className="w-full max-w-md">
          <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 lg:hidden">
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>

          <div className="lg:hidden mb-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-primary-foreground" />
              </div>
              <span className="font-heading font-bold text-lg text-foreground">Ogwini</span>
            </div>
          </div>

          <h2 className="font-heading text-2xl font-bold text-foreground mb-2">Create Account</h2>
          <p className="text-muted-foreground mb-6">Fill in your details to get started</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* User Type */}
            <div>
              <Label>I am a</Label>
              <div className="flex gap-2 mt-1.5">
                {userTypes.map((type) => (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() => setFormData({ ...formData, userType: type.value })}
                    className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      formData.userType === type.value
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {type.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  placeholder="First name"
                  required
                  className="mt-1.5"
                />
              </div>
              <div>
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  placeholder="Last name"
                  required
                  className="mt-1.5"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="email">Email Address</Label>
              <div className="relative mt-1.5">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="pl-10"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="phone">Phone Number (Optional)</Label>
              <div className="relative mt-1.5">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="pl-10"
                  placeholder="0XX XXX XXXX"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="password">Password</Label>
              <div className="relative mt-1.5">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="pl-10 pr-10"
                  placeholder="Create a password (min 8 chars)"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <div className="relative mt-1.5">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  className="pl-10"
                  placeholder="Confirm your password"
                  required
                />
              </div>
            </div>

            <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
              {isSubmitting ? "Creating Account..." : "Create Account"}
            </Button>
          </form>

          <p className="text-center text-muted-foreground text-sm mt-6">
            Already have an account?{" "}
            <Link to="/login" className="text-primary hover:underline font-medium">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
