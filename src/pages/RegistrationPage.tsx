import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { User, Mail, Phone, MapPin, School, Upload, CheckCircle, AlertCircle, FileText, CreditCard, Copy, Check } from "lucide-react";

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
  parentIdNumber: string;
  parentAddress: string;
}

interface UploadedFiles {
  idDocument: File | null;
  proofOfAddress: File | null;
  lastReport: File | null;
  proofOfPayment: File | null;
}

const grades = [
  { name: "Grade 8", available: true, spots: 45 },
  { name: "Grade 9", available: true, spots: 32 },
  { name: "Grade 10", available: true, spots: 28 },
  { name: "Grade 11", available: false, spots: 0 },
  { name: "Grade 12", available: true, spots: 15 },
];

const bankingDetails = {
  bankName: "FNB (First National Bank)",
  accountName: "Ogwini Comprehensive Technical High School",
  accountNumber: "62890547123",
  branchCode: "250655",
  reference: "REG-[YOUR ID NUMBER]",
};

export default function RegistrationPage() {
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [copiedField, setCopiedField] = useState<string | null>(null);
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
    parentIdNumber: "",
    parentAddress: "",
  });

  const [uploadedFiles, setUploadedFiles] = useState<UploadedFiles>({
    idDocument: null,
    proofOfAddress: null,
    lastReport: null,
    proofOfPayment: null,
  });

  const validateIdNumber = (id: string) => /^\d{13}$/.test(id);
  const validatePhone = (phone: string) => /^(\+27|0)\d{9}$/.test(phone.replace(/\s/g, ""));
  const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileUpload = (field: keyof UploadedFiles) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setUploadedFiles({ ...uploadedFiles, [field]: file });
    if (file) {
      toast({
        title: "File Uploaded",
        description: `${file.name} has been uploaded successfully.`,
      });
    }
  };

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    toast({
      title: "Copied!",
      description: `${field} copied to clipboard.`,
    });
    setTimeout(() => setCopiedField(null), 2000);
  };

  const selectedGrade = grades.find(g => g.name === formData.gradeApplying);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateIdNumber(formData.idNumber)) {
      toast({ title: "Invalid ID Number", description: "Please enter a valid 13-digit SA ID number.", variant: "destructive" });
      return;
    }
    if (!validatePhone(formData.phone)) {
      toast({ title: "Invalid Phone Number", description: "Please enter a valid SA phone number.", variant: "destructive" });
      return;
    }
    if (!validateEmail(formData.email)) {
      toast({ title: "Invalid Email", description: "Please enter a valid email address.", variant: "destructive" });
      return;
    }
    if (!uploadedFiles.idDocument || !uploadedFiles.proofOfAddress || !uploadedFiles.lastReport) {
      toast({ title: "Missing Documents", description: "Please upload all required documents.", variant: "destructive" });
      return;
    }
    if (!uploadedFiles.proofOfPayment) {
      toast({ title: "Missing Payment Proof", description: "Please upload your proof of payment.", variant: "destructive" });
      return;
    }

    toast({
      title: "Application Submitted!",
      description: "You will receive a confirmation email with your acceptance status and start date.",
    });
    setStep(6);
  };

  const nextStep = () => {
    if (step === 1) {
      if (!formData.firstName || !formData.lastName || !formData.idNumber || !formData.gradeApplying) {
        toast({ title: "Required Fields", description: "Please fill in all required fields.", variant: "destructive" });
        return;
      }
      if (!validateIdNumber(formData.idNumber)) {
        toast({ title: "Invalid ID Number", description: "Please enter a valid 13-digit SA ID number.", variant: "destructive" });
        return;
      }
      if (!selectedGrade?.available) {
        toast({ title: "Grade Full", description: "The selected grade is full. Please select a different grade.", variant: "destructive" });
        return;
      }
    }
    if (step === 2) {
      if (!validatePhone(formData.phone) || !validateEmail(formData.email)) {
        toast({ title: "Invalid Contact Info", description: "Please check your phone number and email.", variant: "destructive" });
        return;
      }
    }
    if (step === 4) {
      if (!uploadedFiles.idDocument || !uploadedFiles.proofOfAddress || !uploadedFiles.lastReport) {
        toast({ title: "Missing Documents", description: "Please upload all required documents.", variant: "destructive" });
        return;
      }
    }
    setStep(step + 1);
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
              Complete the registration form, upload documents, and submit your payment to secure your place.
            </p>
          </div>

          {/* Progress Steps */}
          <div className="flex justify-center gap-2 mt-8 flex-wrap">
            {["Personal", "Contact", "Parent", "Documents", "Payment", "Complete"].map((label, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold text-xs ${
                      step > i + 1 ? "bg-primary text-primary-foreground" :
                      step === i + 1 ? "bg-primary text-primary-foreground" :
                      "bg-secondary text-muted-foreground"
                    }`}
                  >
                    {step > i + 1 ? <CheckCircle className="w-4 h-4" /> : i + 1}
                  </div>
                  <span className="text-xs text-muted-foreground mt-1 hidden sm:block">{label}</span>
                </div>
                {i < 5 && <div className={`w-8 h-0.5 rounded ${step > i + 1 ? "bg-primary" : "bg-secondary"}`} />}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Form */}
      <section className="py-12 lg:py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            {step === 6 ? (
              <div className="glass-card p-8 text-center">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-primary" />
                </div>
                <h2 className="font-heading text-2xl font-bold text-foreground mb-2">Application Submitted!</h2>
                <p className="text-muted-foreground mb-4">
                  Thank you for applying to Ogwini Comprehensive Technical High School.
                </p>
                <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 text-left mb-4">
                  <h3 className="font-semibold text-foreground mb-2">What happens next:</h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• Your application will be reviewed within 5 business days</li>
                    <li>• You will receive an email at <strong className="text-foreground">{formData.email}</strong></li>
                    <li>• The email will contain your acceptance letter, start date, and stationery list</li>
                    <li>• Login credentials will be sent for portal access</li>
                  </ul>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="glass-card p-8">
                {/* Step 1: Personal Information */}
                {step === 1 && (
                  <div className="space-y-6">
                    <h2 className="font-heading text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
                      <User className="w-5 h-5 text-primary" />
                      Student Personal Information
                    </h2>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="firstName">First Name *</Label>
                        <Input id="firstName" name="firstName" value={formData.firstName} onChange={handleChange} required placeholder="Enter first name" />
                      </div>
                      <div>
                        <Label htmlFor="lastName">Last Name *</Label>
                        <Input id="lastName" name="lastName" value={formData.lastName} onChange={handleChange} required placeholder="Enter last name" />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="idNumber">SA ID Number *</Label>
                      <Input id="idNumber" name="idNumber" value={formData.idNumber} onChange={handleChange} required maxLength={13} placeholder="13-digit ID number" />
                    </div>
                    <div>
                      <Label htmlFor="dateOfBirth">Date of Birth *</Label>
                      <Input id="dateOfBirth" name="dateOfBirth" type="date" value={formData.dateOfBirth} onChange={handleChange} required />
                    </div>
                    <div>
                      <Label htmlFor="gradeApplying">Grade Applying For *</Label>
                      <select id="gradeApplying" name="gradeApplying" value={formData.gradeApplying} onChange={handleChange} required className="w-full h-11 px-4 rounded-lg bg-secondary border border-input text-foreground focus:outline-none focus:ring-2 focus:ring-primary">
                        <option value="">Select a grade</option>
                        {grades.map((grade) => (
                          <option key={grade.name} value={grade.name} disabled={!grade.available}>
                            {grade.name} {grade.available ? `(${grade.spots} spots available)` : "(FULL)"}
                          </option>
                        ))}
                      </select>
                    </div>
                    {selectedGrade && !selectedGrade.available && (
                      <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/20">
                        <div className="flex items-start gap-3">
                          <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="text-sm font-medium text-destructive">Grade Full</p>
                            <p className="text-xs text-muted-foreground mt-1">
                              {formData.gradeApplying} is currently full. Please select a different grade or contact the school office.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Step 2: Contact Information */}
                {step === 2 && (
                  <div className="space-y-6">
                    <h2 className="font-heading text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
                      <Mail className="w-5 h-5 text-primary" />
                      Contact Information
                    </h2>
                    <div>
                      <Label htmlFor="email">Email Address *</Label>
                      <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} required placeholder="student@example.com" />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone Number *</Label>
                      <Input id="phone" name="phone" value={formData.phone} onChange={handleChange} required placeholder="0XX XXX XXXX" />
                    </div>
                    <div>
                      <Label htmlFor="address">Home Address *</Label>
                      <Input id="address" name="address" value={formData.address} onChange={handleChange} required placeholder="Full residential address" />
                    </div>
                    <div>
                      <Label htmlFor="previousSchool">Previous School *</Label>
                      <Input id="previousSchool" name="previousSchool" value={formData.previousSchool} onChange={handleChange} required placeholder="Name of previous school" />
                    </div>
                  </div>
                )}

                {/* Step 3: Parent/Guardian Information */}
                {step === 3 && (
                  <div className="space-y-6">
                    <h2 className="font-heading text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
                      <School className="w-5 h-5 text-primary" />
                      Parent/Guardian Information
                    </h2>
                    <div>
                      <Label htmlFor="parentName">Parent/Guardian Full Name *</Label>
                      <Input id="parentName" name="parentName" value={formData.parentName} onChange={handleChange} required placeholder="Enter full name" />
                    </div>
                    <div>
                      <Label htmlFor="parentIdNumber">Parent/Guardian ID Number *</Label>
                      <Input id="parentIdNumber" name="parentIdNumber" value={formData.parentIdNumber} onChange={handleChange} required maxLength={13} placeholder="13-digit ID number" />
                    </div>
                    <div>
                      <Label htmlFor="parentPhone">Parent/Guardian Phone *</Label>
                      <Input id="parentPhone" name="parentPhone" value={formData.parentPhone} onChange={handleChange} required placeholder="0XX XXX XXXX" />
                    </div>
                    <div>
                      <Label htmlFor="parentEmail">Parent/Guardian Email *</Label>
                      <Input id="parentEmail" name="parentEmail" type="email" value={formData.parentEmail} onChange={handleChange} required placeholder="parent@example.com" />
                    </div>
                    <div>
                      <Label htmlFor="parentAddress">Parent/Guardian Address</Label>
                      <Input id="parentAddress" name="parentAddress" value={formData.parentAddress} onChange={handleChange} placeholder="If different from student" />
                    </div>
                    <div className="p-4 rounded-lg bg-accent/10 border border-accent/20">
                      <p className="text-sm text-muted-foreground">
                        <strong className="text-foreground">Note:</strong> Parent and learner will use the same login credentials to access the portal.
                      </p>
                    </div>
                  </div>
                )}

                {/* Step 4: Document Upload */}
                {step === 4 && (
                  <div className="space-y-6">
                    <h2 className="font-heading text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
                      <Upload className="w-5 h-5 text-primary" />
                      Upload Supporting Documents
                    </h2>
                    
                    <div className="space-y-4">
                      <div className="border-2 border-dashed border-border rounded-lg p-4 hover:border-primary/50 transition-colors">
                        <Label htmlFor="idDocument" className="cursor-pointer">
                          <div className="flex items-center gap-3">
                            <FileText className="w-8 h-8 text-muted-foreground" />
                            <div>
                              <p className="font-medium text-foreground">Student ID / Birth Certificate *</p>
                              <p className="text-xs text-muted-foreground">PDF, JPG or PNG (max 5MB)</p>
                            </div>
                            {uploadedFiles.idDocument && (
                              <CheckCircle className="w-5 h-5 text-primary ml-auto" />
                            )}
                          </div>
                        </Label>
                        <Input id="idDocument" type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={handleFileUpload("idDocument")} className="hidden" />
                        {uploadedFiles.idDocument && <p className="text-xs text-primary mt-2">{uploadedFiles.idDocument.name}</p>}
                      </div>

                      <div className="border-2 border-dashed border-border rounded-lg p-4 hover:border-primary/50 transition-colors">
                        <Label htmlFor="proofOfAddress" className="cursor-pointer">
                          <div className="flex items-center gap-3">
                            <MapPin className="w-8 h-8 text-muted-foreground" />
                            <div>
                              <p className="font-medium text-foreground">Proof of Address *</p>
                              <p className="text-xs text-muted-foreground">Utility bill or bank statement (max 5MB)</p>
                            </div>
                            {uploadedFiles.proofOfAddress && (
                              <CheckCircle className="w-5 h-5 text-primary ml-auto" />
                            )}
                          </div>
                        </Label>
                        <Input id="proofOfAddress" type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={handleFileUpload("proofOfAddress")} className="hidden" />
                        {uploadedFiles.proofOfAddress && <p className="text-xs text-primary mt-2">{uploadedFiles.proofOfAddress.name}</p>}
                      </div>

                      <div className="border-2 border-dashed border-border rounded-lg p-4 hover:border-primary/50 transition-colors">
                        <Label htmlFor="lastReport" className="cursor-pointer">
                          <div className="flex items-center gap-3">
                            <FileText className="w-8 h-8 text-muted-foreground" />
                            <div>
                              <p className="font-medium text-foreground">Latest School Report *</p>
                              <p className="text-xs text-muted-foreground">Previous school report card (max 5MB)</p>
                            </div>
                            {uploadedFiles.lastReport && (
                              <CheckCircle className="w-5 h-5 text-primary ml-auto" />
                            )}
                          </div>
                        </Label>
                        <Input id="lastReport" type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={handleFileUpload("lastReport")} className="hidden" />
                        {uploadedFiles.lastReport && <p className="text-xs text-primary mt-2">{uploadedFiles.lastReport.name}</p>}
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 5: Payment */}
                {step === 5 && (
                  <div className="space-y-6">
                    <h2 className="font-heading text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
                      <CreditCard className="w-5 h-5 text-primary" />
                      School Fees Payment (EFT)
                    </h2>

                    <div className="bg-primary/5 border border-primary/20 rounded-lg p-6">
                      <h3 className="font-semibold text-foreground mb-4">Banking Details</h3>
                      <div className="space-y-3">
                        {[
                          { label: "Bank Name", value: bankingDetails.bankName },
                          { label: "Account Name", value: bankingDetails.accountName },
                          { label: "Account Number", value: bankingDetails.accountNumber },
                          { label: "Branch Code", value: bankingDetails.branchCode },
                          { label: "Reference", value: `REG-${formData.idNumber || "[YOUR ID NUMBER]"}` },
                        ].map((item) => (
                          <div key={item.label} className="flex items-center justify-between bg-background/50 rounded-lg p-3">
                            <div>
                              <p className="text-xs text-muted-foreground">{item.label}</p>
                              <p className="font-mono text-sm text-foreground">{item.value}</p>
                            </div>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => copyToClipboard(item.value, item.label)}
                              className="h-8 w-8 p-0"
                            >
                              {copiedField === item.label ? <Check className="w-4 h-4 text-primary" /> : <Copy className="w-4 h-4" />}
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="p-4 rounded-lg bg-accent/10 border border-accent/20">
                      <div className="flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-foreground">Important Payment Instructions</p>
                          <ul className="text-xs text-muted-foreground mt-1 space-y-1">
                            <li>• Use EFT (Electronic Funds Transfer) only</li>
                            <li>• Use your ID number as reference: REG-{formData.idNumber || "[ID]"}</li>
                            <li>• Upload your proof of payment below</li>
                            <li>• Allow 24-48 hours for payment verification</li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    <div className="border-2 border-dashed border-border rounded-lg p-4 hover:border-primary/50 transition-colors">
                      <Label htmlFor="proofOfPayment" className="cursor-pointer">
                        <div className="flex items-center gap-3">
                          <Upload className="w-8 h-8 text-muted-foreground" />
                          <div>
                            <p className="font-medium text-foreground">Upload Proof of Payment *</p>
                            <p className="text-xs text-muted-foreground">Bank confirmation or screenshot (max 5MB)</p>
                          </div>
                          {uploadedFiles.proofOfPayment && (
                            <CheckCircle className="w-5 h-5 text-primary ml-auto" />
                          )}
                        </div>
                      </Label>
                      <Input id="proofOfPayment" type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={handleFileUpload("proofOfPayment")} className="hidden" />
                      {uploadedFiles.proofOfPayment && <p className="text-xs text-primary mt-2">{uploadedFiles.proofOfPayment.name}</p>}
                    </div>
                  </div>
                )}

                {/* Navigation */}
                <div className="flex justify-between mt-8 pt-6 border-t border-border">
                  {step > 1 && (
                    <Button type="button" variant="outline" onClick={() => setStep(step - 1)}>
                      Previous
                    </Button>
                  )}
                  {step < 5 ? (
                    <Button type="button" className="ml-auto" onClick={nextStep}>
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
