import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { User, Mail, Phone, Calendar, MapPin, School, Upload, CheckCircle, AlertCircle } from "lucide-react";

interface FormData {
  firstName: string;
  lastName: string;
  idNumber: string;
  dateOfBirth: string;
  email: string;
  phone: string;
  address: string;
  previousSchool: string;
  gradeApplying: string;
  parentName: string;
  parentPhone: string;
  parentEmail: string;
}

const grades = ["Grade 8", "Grade 9", "Grade 10", "Grade 11", "Grade 12"];

export default function RegistrationPage() {
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    idNumber: "",
    dateOfBirth: "",
    email: "",
    phone: "",
    address: "",
    previousSchool: "",
    gradeApplying: "",
    parentName: "",
    parentPhone: "",
    parentEmail: "",
  });

  const validateIdNumber = (id: string) => {
    return /^\d{13}$/.test(id);
  };

  const validatePhone = (phone: string) => {
    return /^(\+27|0)\d{9}$/.test(phone.replace(/\s/g, ""));
  };

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!validateIdNumber(formData.idNumber)) {
      toast({
        title: "Invalid ID Number",
        description: "Please enter a valid 13-digit South African ID number.",
        variant: "destructive",
      });
      return;
    }

    if (!validatePhone(formData.phone)) {
      toast({
        title: "Invalid Phone Number",
        description: "Please enter a valid South African phone number.",
        variant: "destructive",
      });
      return;
    }

    if (!validateEmail(formData.email)) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }

    // Simulate submission
    toast({
      title: "Application Submitted!",
      description: "You will receive an email with your class placement within 5 business days.",
    });
    setStep(4);
  };

  return (
    <Layout>
      {/* Header */}
      <section className="py-16 lg:py-20 bg-card">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <span className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
              Student Registration
            </span>
            <h1 className="font-heading text-4xl lg:text-5xl font-bold text-foreground mb-4">
              Apply to <span className="text-primary">Ogwini</span>
            </h1>
            <p className="text-muted-foreground">
              Complete the online registration form below. You will be notified about your class placement via email.
            </p>
          </div>

          {/* Progress Steps */}
          <div className="flex justify-center gap-4 mt-8">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center gap-2">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm ${
                    step >= s
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-muted-foreground"
                  }`}
                >
                  {step > s ? <CheckCircle className="w-5 h-5" /> : s}
                </div>
                {s < 3 && <div className={`w-12 h-1 rounded ${step > s ? "bg-primary" : "bg-secondary"}`} />}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Form */}
      <section className="py-12 lg:py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            {step === 4 ? (
              <div className="glass-card p-8 text-center">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-primary" />
                </div>
                <h2 className="font-heading text-2xl font-bold text-foreground mb-2">Application Submitted!</h2>
                <p className="text-muted-foreground mb-4">
                  Thank you for applying to Ogwini Comprehensive Technical High School. We have received your application and will review it shortly.
                </p>
                <p className="text-sm text-muted-foreground">
                  You will receive an email at <strong className="text-foreground">{formData.email}</strong> with your class placement within 5 business days. If the grade is full, you will be placed on a waiting list.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="glass-card p-8">
                {step === 1 && (
                  <div className="space-y-6">
                    <h2 className="font-heading text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
                      <User className="w-5 h-5 text-primary" />
                      Student Information
                    </h2>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="firstName">First Name *</Label>
                        <Input
                          id="firstName"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleChange}
                          required
                          placeholder="Enter first name"
                        />
                      </div>
                      <div>
                        <Label htmlFor="lastName">Last Name *</Label>
                        <Input
                          id="lastName"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleChange}
                          required
                          placeholder="Enter last name"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="idNumber">SA ID Number *</Label>
                      <Input
                        id="idNumber"
                        name="idNumber"
                        value={formData.idNumber}
                        onChange={handleChange}
                        required
                        maxLength={13}
                        placeholder="13-digit ID number"
                      />
                    </div>
                    <div>
                      <Label htmlFor="dateOfBirth">Date of Birth *</Label>
                      <Input
                        id="dateOfBirth"
                        name="dateOfBirth"
                        type="date"
                        value={formData.dateOfBirth}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="gradeApplying">Grade Applying For *</Label>
                      <select
                        id="gradeApplying"
                        name="gradeApplying"
                        value={formData.gradeApplying}
                        onChange={handleChange}
                        required
                        className="w-full h-11 px-4 rounded-lg bg-secondary border border-input text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      >
                        <option value="">Select a grade</option>
                        {grades.map((grade) => (
                          <option key={grade} value={grade}>{grade}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                )}

                {step === 2 && (
                  <div className="space-y-6">
                    <h2 className="font-heading text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
                      <Mail className="w-5 h-5 text-primary" />
                      Contact Information
                    </h2>
                    <div>
                      <Label htmlFor="email">Email Address *</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        placeholder="student@example.com"
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone Number *</Label>
                      <Input
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                        placeholder="0XX XXX XXXX"
                      />
                    </div>
                    <div>
                      <Label htmlFor="address">Home Address *</Label>
                      <Input
                        id="address"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        required
                        placeholder="Full residential address"
                      />
                    </div>
                    <div>
                      <Label htmlFor="previousSchool">Previous School *</Label>
                      <Input
                        id="previousSchool"
                        name="previousSchool"
                        value={formData.previousSchool}
                        onChange={handleChange}
                        required
                        placeholder="Name of previous school"
                      />
                    </div>
                  </div>
                )}

                {step === 3 && (
                  <div className="space-y-6">
                    <h2 className="font-heading text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
                      <School className="w-5 h-5 text-primary" />
                      Parent/Guardian Information
                    </h2>
                    <div>
                      <Label htmlFor="parentName">Parent/Guardian Full Name *</Label>
                      <Input
                        id="parentName"
                        name="parentName"
                        value={formData.parentName}
                        onChange={handleChange}
                        required
                        placeholder="Enter full name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="parentPhone">Parent/Guardian Phone *</Label>
                      <Input
                        id="parentPhone"
                        name="parentPhone"
                        value={formData.parentPhone}
                        onChange={handleChange}
                        required
                        placeholder="0XX XXX XXXX"
                      />
                    </div>
                    <div>
                      <Label htmlFor="parentEmail">Parent/Guardian Email *</Label>
                      <Input
                        id="parentEmail"
                        name="parentEmail"
                        type="email"
                        value={formData.parentEmail}
                        onChange={handleChange}
                        required
                        placeholder="parent@example.com"
                      />
                    </div>

                    <div className="p-4 rounded-lg bg-accent/10 border border-accent/20">
                      <div className="flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-foreground">Important Notice</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            If the grade you're applying for is full, you will be placed on a waiting list and notified when a spot becomes available.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex justify-between mt-8 pt-6 border-t border-border">
                  {step > 1 && (
                    <Button type="button" variant="outline" onClick={() => setStep(step - 1)}>
                      Previous
                    </Button>
                  )}
                  {step < 3 ? (
                    <Button type="button" className="ml-auto" onClick={() => setStep(step + 1)}>
                      Next Step
                    </Button>
                  ) : (
                    <Button type="submit" className="ml-auto">
                      Submit Application
                    </Button>
                  )}
                </div>
              </form>
            )}
          </div>
        </div>
      </section>
    </Layout>
  );
}
