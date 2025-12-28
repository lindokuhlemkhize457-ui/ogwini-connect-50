import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { 
  User, Mail, Phone, MapPin, Upload, CheckCircle, AlertCircle, 
  FileText, CreditCard, Copy, Check, Eye, EyeOff, GraduationCap, 
  Users, Shield, BookOpen, School
} from "lucide-react";
import schoolLab from "@/assets/school-science-lab.jpg";

type AppRole = "learner" | "teacher" | "grade_head" | "principal" | "admin";

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  role: AppRole;
  idNumber: string;
  address: string;
  grade: string;
  parentName: string;
  parentPhone: string;
  parentEmail: string;
}

interface UploadedFiles {
  idDocument: File | null;
  proofOfAddress: File | null;
  proofOfPayment: File | null;
}

const grades = [
  { name: "Grade 8", available: true },
  { name: "Grade 9", available: true },
  { name: "Grade 10", available: true },
  { name: "Grade 11", available: true },
  { name: "Grade 12", available: true },
];

const bankingDetails = {
  bankName: "FNB (First National Bank)",
  accountName: "Ogwini Comprehensive Technical High School",
  accountNumber: "62890547123",
  branchCode: "250655",
  reference: "REG-[YOUR ID NUMBER]",
};

const roleOptions: { value: AppRole; label: string; icon: React.ReactNode; description: string }[] = [
  { value: "learner", label: "Learner", icon: <GraduationCap className="w-6 h-6" />, description: "Student at the school" },
  { value: "teacher", label: "Teacher", icon: <BookOpen className="w-6 h-6" />, description: "Educator staff member" },
  { value: "grade_head", label: "Grade Head", icon: <Users className="w-6 h-6" />, description: "Head of a grade" },
  { value: "principal", label: "Principal", icon: <School className="w-6 h-6" />, description: "School principal" },
  { value: "admin", label: "Administrator", icon: <Shield className="w-6 h-6" />, description: "System administrator" },
];

export default function SignupPage() {
  const { toast } = useToast();
  const { signUp } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    role: "learner",
    idNumber: "",
    address: "",
    grade: "",
    parentName: "",
    parentPhone: "",
    parentEmail: "",
  });

  const [uploadedFiles, setUploadedFiles] = useState<UploadedFiles>({
    idDocument: null,
    proofOfAddress: null,
    proofOfPayment: null,
  });

  const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileUpload = (field: keyof UploadedFiles) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setUploadedFiles({ ...uploadedFiles, [field]: file });
    if (file) {
      toast({
        title: "File Selected",
        description: `${file.name} ready to upload.`,
      });
    }
  };

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    toast({ title: "Copied!", description: `${field} copied to clipboard.` });
    setTimeout(() => setCopiedField(null), 2000);
  };

  const nextStep = () => {
    if (step === 1) {
      if (!formData.role) {
        toast({ title: "Select Role", description: "Please select your role.", variant: "destructive" });
        return;
      }
    }
    if (step === 2) {
      if (!formData.firstName || !formData.lastName || !formData.email || !formData.password) {
        toast({ title: "Required Fields", description: "Please fill in all required fields.", variant: "destructive" });
        return;
      }
      if (!validateEmail(formData.email)) {
        toast({ title: "Invalid Email", description: "Please enter a valid email.", variant: "destructive" });
        return;
      }
      if (formData.password.length < 6) {
        toast({ title: "Weak Password", description: "Password must be at least 6 characters.", variant: "destructive" });
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        toast({ title: "Passwords Don't Match", description: "Please confirm your password.", variant: "destructive" });
        return;
      }
    }
    if (step === 3 && formData.role === "learner") {
      if (!formData.grade) {
        toast({ title: "Select Grade", description: "Please select your grade.", variant: "destructive" });
        return;
      }
    }
    setStep(step + 1);
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const { error } = await signUp(formData.email, formData.password, {
        first_name: formData.firstName,
        last_name: formData.lastName,
        role: formData.role,
        phone: formData.phone,
      });

      if (error) {
        setLoading(false);
        return;
      }

      await new Promise(resolve => setTimeout(resolve, 1000));

      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        const userId = session.user.id;

        await supabase
          .from('registrations')
          .update({
            phone: formData.phone,
            id_number: formData.idNumber,
            address: formData.address,
            grade: formData.grade,
            parent_name: formData.parentName,
            parent_phone: formData.parentPhone,
            parent_email: formData.parentEmail,
          })
          .eq('user_id', userId);
      }

      toast({
        title: "Registration Successful!",
        description: "Welcome! Redirecting to your dashboard...",
      });

      setTimeout(() => {
        switch (formData.role) {
          case "learner":
            navigate("/dashboard/learner");
            break;
          case "teacher":
            navigate("/dashboard/teacher");
            break;
          case "grade_head":
            navigate("/dashboard/grade-head");
            break;
          case "principal":
            navigate("/dashboard/principal");
            break;
          case "admin":
            navigate("/dashboard/admin");
            break;
          default:
            navigate("/portal");
        }
      }, 500);

    } catch (err) {
      console.error("Registration error:", err);
      toast({
        title: "Registration Failed",
        description: "An error occurred. Please try again.",
        variant: "destructive",
      });
    }
    setLoading(false);
  };

  const totalSteps = formData.role === "learner" ? 5 : 4;
  const stepLabels = formData.role === "learner" 
    ? ["Role", "Account", "Details", "Payment", "Complete"]
    : ["Role", "Account", "Details", "Complete"];

  return (
    <Layout>
      {/* Hero Header */}
      <section className="relative py-16 lg:py-20 overflow-hidden">
        <div className="absolute inset-0">
          <img src={schoolLab} alt="School" className="w-full h-full object-cover" />
          <div className="absolute inset-0 hero-gradient" />
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-2xl mx-auto text-center text-white">
            <span className="inline-block px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm text-sm font-bold mb-4 uppercase tracking-wider">
              Join Ogwini
            </span>
            <h1 className="font-heading text-4xl lg:text-5xl font-bold mb-4">
              Create Your Account
            </h1>
            <p className="text-white/80 text-lg">
              Register and get immediate access to your personalized dashboard
            </p>
          </div>

          {/* Progress Steps */}
          <div className="flex justify-center gap-2 mt-8 flex-wrap">
            {stepLabels.map((label, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all ${
                      step > i + 1 ? "bg-accent text-accent-foreground shadow-lg" :
                      step === i + 1 ? "bg-white text-primary shadow-lg scale-110" :
                      "bg-white/30 text-white/70"
                    }`}
                  >
                    {step > i + 1 ? <CheckCircle className="w-5 h-5" /> : i + 1}
                  </div>
                  <span className="text-xs text-white/80 mt-2 font-medium hidden sm:block">{label}</span>
                </div>
                {i < stepLabels.length - 1 && (
                  <div className={`w-12 h-1 rounded-full transition-all ${step > i + 1 ? "bg-accent" : "bg-white/30"}`} />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Form */}
      <section className="py-12 lg:py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <div className="glass-card p-8 border-2 border-primary/10">
              
              {/* Step 1: Role Selection */}
              {step === 1 && (
                <div className="space-y-6">
                  <h2 className="font-heading text-2xl font-bold text-foreground mb-2 flex items-center gap-3">
                    <Users className="w-7 h-7 text-primary" />
                    Select Your Role
                  </h2>
                  <p className="text-muted-foreground mb-6">Choose your role to get started with the right dashboard</p>
                  
                  <div className="grid gap-4">
                    {roleOptions.map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => setFormData({ ...formData, role: option.value })}
                        className={`p-5 rounded-xl border-2 transition-all text-left flex items-center gap-4 ${
                          formData.role === option.value
                            ? "border-primary bg-primary/10 shadow-lg"
                            : "border-border hover:border-primary/50 hover:bg-secondary/50"
                        }`}
                      >
                        <div className={`p-3 rounded-xl ${formData.role === option.value ? "bg-primary text-white" : "bg-secondary text-primary"}`}>
                          {option.icon}
                        </div>
                        <div className="flex-1">
                          <p className="font-bold text-foreground text-lg">{option.label}</p>
                          <p className="text-sm text-muted-foreground">{option.description}</p>
                        </div>
                        {formData.role === option.value && (
                          <CheckCircle className="w-6 h-6 text-primary" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 2: Account Details */}
              {step === 2 && (
                <div className="space-y-6">
                  <h2 className="font-heading text-2xl font-bold text-foreground mb-2 flex items-center gap-3">
                    <User className="w-7 h-7 text-primary" />
                    Account Details
                  </h2>
                  
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName" className="font-semibold">First Name *</Label>
                      <Input 
                        id="firstName" 
                        name="firstName" 
                        value={formData.firstName} 
                        onChange={handleChange} 
                        required 
                        placeholder="Enter first name"
                        className="h-12 text-base"
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName" className="font-semibold">Last Name *</Label>
                      <Input 
                        id="lastName" 
                        name="lastName" 
                        value={formData.lastName} 
                        onChange={handleChange} 
                        required 
                        placeholder="Enter last name"
                        className="h-12 text-base"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="email" className="font-semibold">Email Address *</Label>
                    <Input 
                      id="email" 
                      name="email" 
                      type="email" 
                      value={formData.email} 
                      onChange={handleChange} 
                      required 
                      placeholder="your@email.com"
                      className="h-12 text-base"
                    />
                  </div>

                  <div>
                    <Label htmlFor="phone" className="font-semibold">Phone Number</Label>
                    <Input 
                      id="phone" 
                      name="phone" 
                      value={formData.phone} 
                      onChange={handleChange} 
                      placeholder="0XX XXX XXXX"
                      className="h-12 text-base"
                    />
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="password" className="font-semibold">Password *</Label>
                      <div className="relative">
                        <Input 
                          id="password" 
                          name="password" 
                          type={showPassword ? "text" : "password"} 
                          value={formData.password} 
                          onChange={handleChange} 
                          required
                          placeholder="••••••••"
                          className="h-12 text-base pr-12"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        >
                          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="confirmPassword" className="font-semibold">Confirm Password *</Label>
                      <Input 
                        id="confirmPassword" 
                        name="confirmPassword" 
                        type="password" 
                        value={formData.confirmPassword} 
                        onChange={handleChange} 
                        required
                        placeholder="••••••••"
                        className="h-12 text-base"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Additional Details */}
              {step === 3 && (
                <div className="space-y-6">
                  <h2 className="font-heading text-2xl font-bold text-foreground mb-2 flex items-center gap-3">
                    <FileText className="w-7 h-7 text-primary" />
                    Additional Details
                  </h2>

                  <div>
                    <Label htmlFor="idNumber" className="font-semibold">SA ID Number</Label>
                    <Input 
                      id="idNumber" 
                      name="idNumber" 
                      value={formData.idNumber} 
                      onChange={handleChange} 
                      maxLength={13}
                      placeholder="13-digit ID number"
                      className="h-12 text-base"
                    />
                  </div>

                  <div>
                    <Label htmlFor="address" className="font-semibold">Home Address</Label>
                    <Input 
                      id="address" 
                      name="address" 
                      value={formData.address} 
                      onChange={handleChange} 
                      placeholder="Full residential address"
                      className="h-12 text-base"
                    />
                  </div>

                  {formData.role === "learner" && (
                    <>
                      <div>
                        <Label htmlFor="grade" className="font-semibold">Grade *</Label>
                        <select 
                          id="grade" 
                          name="grade" 
                          value={formData.grade} 
                          onChange={handleChange}
                          className="w-full h-12 px-4 rounded-lg bg-secondary border border-input text-foreground focus:outline-none focus:ring-2 focus:ring-primary text-base"
                        >
                          <option value="">Select a grade</option>
                          {grades.map((grade) => (
                            <option key={grade.name} value={grade.name}>
                              {grade.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="pt-4 border-t border-border">
                        <h3 className="font-bold text-foreground mb-4">Parent/Guardian Information</h3>
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="parentName" className="font-semibold">Parent Name</Label>
                            <Input 
                              id="parentName" 
                              name="parentName" 
                              value={formData.parentName} 
                              onChange={handleChange} 
                              placeholder="Parent/Guardian full name"
                              className="h-12 text-base"
                            />
                          </div>
                          <div className="grid sm:grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="parentPhone" className="font-semibold">Parent Phone</Label>
                              <Input 
                                id="parentPhone" 
                                name="parentPhone" 
                                value={formData.parentPhone} 
                                onChange={handleChange} 
                                placeholder="0XX XXX XXXX"
                                className="h-12 text-base"
                              />
                            </div>
                            <div>
                              <Label htmlFor="parentEmail" className="font-semibold">Parent Email</Label>
                              <Input 
                                id="parentEmail" 
                                name="parentEmail" 
                                type="email"
                                value={formData.parentEmail} 
                                onChange={handleChange} 
                                placeholder="parent@email.com"
                                className="h-12 text-base"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </>
                  )}

                  {/* Document Uploads */}
                  <div className="pt-4 border-t border-border space-y-4">
                    <h3 className="font-bold text-foreground">Upload Documents (Optional)</h3>
                    
                    <div className="border-2 border-dashed border-border rounded-xl p-4 hover:border-primary/50 transition-colors">
                      <Label htmlFor="idDocument" className="cursor-pointer">
                        <div className="flex items-center gap-3">
                          <FileText className="w-8 h-8 text-muted-foreground" />
                          <div className="flex-1">
                            <p className="font-semibold text-foreground">ID Document / Birth Certificate</p>
                            <p className="text-xs text-muted-foreground">PDF, JPG or PNG</p>
                          </div>
                          {uploadedFiles.idDocument && <CheckCircle className="w-6 h-6 text-primary" />}
                        </div>
                      </Label>
                      <Input id="idDocument" type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={handleFileUpload("idDocument")} className="hidden" />
                      {uploadedFiles.idDocument && <p className="text-xs text-primary mt-2 font-medium">{uploadedFiles.idDocument.name}</p>}
                    </div>

                    <div className="border-2 border-dashed border-border rounded-xl p-4 hover:border-primary/50 transition-colors">
                      <Label htmlFor="proofOfAddress" className="cursor-pointer">
                        <div className="flex items-center gap-3">
                          <MapPin className="w-8 h-8 text-muted-foreground" />
                          <div className="flex-1">
                            <p className="font-semibold text-foreground">Proof of Address</p>
                            <p className="text-xs text-muted-foreground">Utility bill or bank statement</p>
                          </div>
                          {uploadedFiles.proofOfAddress && <CheckCircle className="w-6 h-6 text-primary" />}
                        </div>
                      </Label>
                      <Input id="proofOfAddress" type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={handleFileUpload("proofOfAddress")} className="hidden" />
                      {uploadedFiles.proofOfAddress && <p className="text-xs text-primary mt-2 font-medium">{uploadedFiles.proofOfAddress.name}</p>}
                    </div>
                  </div>
                </div>
              )}

              {/* Step 4: Payment (for learners) */}
              {step === 4 && formData.role === "learner" && (
                <div className="space-y-6">
                  <h2 className="font-heading text-2xl font-bold text-foreground mb-2 flex items-center gap-3">
                    <CreditCard className="w-7 h-7 text-primary" />
                    School Fees Payment
                  </h2>

                  <div className="bg-primary/5 border-2 border-primary/20 rounded-xl p-6">
                    <h3 className="font-bold text-foreground mb-4 text-lg">Banking Details</h3>
                    <div className="space-y-3">
                      {[
                        { label: "Bank Name", value: bankingDetails.bankName },
                        { label: "Account Name", value: bankingDetails.accountName },
                        { label: "Account Number", value: bankingDetails.accountNumber },
                        { label: "Branch Code", value: bankingDetails.branchCode },
                        { label: "Reference", value: `REG-${formData.idNumber || "[YOUR ID]"}` },
                      ].map((item) => (
                        <div key={item.label} className="flex items-center justify-between bg-background rounded-lg p-3 border border-border">
                          <div>
                            <p className="text-xs text-muted-foreground font-medium">{item.label}</p>
                            <p className="font-mono text-sm text-foreground font-bold">{item.value}</p>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(item.value, item.label)}
                            className="h-9 w-9 p-0"
                          >
                            {copiedField === item.label ? <Check className="w-4 h-4 text-primary" /> : <Copy className="w-4 h-4" />}
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-accent/10 border-2 border-accent/30">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="w-6 h-6 text-accent flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-bold text-foreground">Payment Instructions</p>
                        <ul className="text-sm text-muted-foreground mt-2 space-y-1">
                          <li>• Use EFT (Electronic Funds Transfer)</li>
                          <li>• Use your ID number as reference</li>
                          <li>• Upload proof of payment below</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="border-2 border-dashed border-primary/30 rounded-xl p-6 hover:border-primary transition-colors bg-primary/5">
                    <Label htmlFor="proofOfPayment" className="cursor-pointer">
                      <div className="flex items-center gap-4">
                        <div className="p-3 rounded-xl bg-primary text-white">
                          <Upload className="w-8 h-8" />
                        </div>
                        <div className="flex-1">
                          <p className="font-bold text-foreground text-lg">Upload Proof of Payment</p>
                          <p className="text-sm text-muted-foreground">Bank confirmation or screenshot</p>
                        </div>
                        {uploadedFiles.proofOfPayment && <CheckCircle className="w-8 h-8 text-primary" />}
                      </div>
                    </Label>
                    <Input id="proofOfPayment" type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={handleFileUpload("proofOfPayment")} className="hidden" />
                    {uploadedFiles.proofOfPayment && (
                      <p className="text-sm text-primary mt-3 font-bold">{uploadedFiles.proofOfPayment.name}</p>
                    )}
                  </div>
                </div>
              )}

              {/* Final Step - Complete */}
              {((step === 4 && formData.role !== "learner") || (step === 5 && formData.role === "learner")) && (
                <div className="space-y-6 text-center">
                  <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                    <CheckCircle className="w-10 h-10 text-primary" />
                  </div>
                  <h2 className="font-heading text-2xl font-bold text-foreground">Ready to Join!</h2>
                  <p className="text-muted-foreground">
                    Click the button below to complete your registration and access your {formData.role === "learner" ? "Learner" : formData.role === "teacher" ? "Teacher" : formData.role === "admin" ? "Admin" : formData.role === "principal" ? "Principal" : "Grade Head"} Dashboard
                  </p>
                  
                  <div className="bg-primary/5 border-2 border-primary/20 rounded-xl p-4 text-left">
                    <h3 className="font-bold text-foreground mb-2">Your Details:</h3>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      <li><strong>Name:</strong> {formData.firstName} {formData.lastName}</li>
                      <li><strong>Email:</strong> {formData.email}</li>
                      <li><strong>Role:</strong> {roleOptions.find(r => r.value === formData.role)?.label}</li>
                      {formData.role === "learner" && <li><strong>Grade:</strong> {formData.grade}</li>}
                    </ul>
                  </div>

                  <Button 
                    onClick={handleSubmit} 
                    disabled={loading}
                    size="xl"
                    className="w-full"
                  >
                    {loading ? "Creating Account..." : "Complete Registration"}
                  </Button>
                </div>
              )}

              {/* Navigation */}
              {!((step === 4 && formData.role !== "learner") || (step === 5 && formData.role === "learner")) && (
                <div className="flex justify-between mt-8 pt-6 border-t border-border">
                  {step > 1 && (
                    <Button type="button" variant="outline" onClick={() => setStep(step - 1)} size="lg">
                      Previous
                    </Button>
                  )}
                  <Button type="button" className="ml-auto" onClick={nextStep} size="lg">
                    Next Step
                  </Button>
                </div>
              )}
            </div>

            <p className="text-center text-muted-foreground text-sm mt-6">
              Already have an account?{" "}
              <Link to="/login" className="text-primary hover:underline font-bold">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </section>
    </Layout>
  );
}