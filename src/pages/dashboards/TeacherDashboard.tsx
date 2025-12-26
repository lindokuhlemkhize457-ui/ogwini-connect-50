import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  User, BookOpen, FileText, Users, Upload, MessageSquare, 
  ClipboardCheck, BarChart3, Bell, Send, Plus, CheckCircle
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const mockTeacher = {
  name: "Mrs. N. Dlamini",
  subject: "Mathematics",
  classes: ["10A", "10B", "11A", "12A"],
  employeeId: "TCH2020015",
};

const mockClasses = [
  { id: "10A", name: "Grade 10A", students: 35, subject: "Mathematics" },
  { id: "10B", name: "Grade 10B", students: 32, subject: "Mathematics" },
  { id: "11A", name: "Grade 11A", students: 38, subject: "Mathematics" },
  { id: "12A", name: "Grade 12A", students: 28, subject: "Mathematics" },
];

const mockStudents = [
  { id: 1, name: "Thabo Mkhize", class: "11A", mark: 78, attendance: 95 },
  { id: 2, name: "Nomsa Khumalo", class: "11A", mark: 85, attendance: 98 },
  { id: 3, name: "Sipho Nkosi", class: "11A", mark: 62, attendance: 88 },
  { id: 4, name: "Zanele Dube", class: "11A", mark: 91, attendance: 100 },
  { id: 5, name: "Bongani Cele", class: "11A", mark: 45, attendance: 75 },
];

export default function TeacherDashboard() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedClass, setSelectedClass] = useState("11A");
  const [uploadType, setUploadType] = useState<"notes" | "marks" | null>(null);
  const [notificationMessage, setNotificationMessage] = useState("");

  const tabs = [
    { id: "overview", label: "Overview", icon: BarChart3 },
    { id: "classes", label: "My Classes", icon: Users },
    { id: "marks", label: "Marks & Feedback", icon: ClipboardCheck },
    { id: "upload", label: "Upload Content", icon: Upload },
    { id: "communicate", label: "Communicate", icon: MessageSquare },
  ];

  const handleUpload = () => {
    toast({
      title: "Content Uploaded",
      description: "Your content has been uploaded and is now available to students.",
    });
    setUploadType(null);
  };

  const sendNotification = () => {
    if (!notificationMessage.trim()) return;
    toast({
      title: "Notification Sent",
      description: `Your message has been sent to ${selectedClass} students.`,
    });
    setNotificationMessage("");
  };

  return (
    <Layout>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <div className="bg-card border-b border-border">
          <div className="container mx-auto px-4 py-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center">
                <User className="w-8 h-8 text-accent" />
              </div>
              <div>
                <h1 className="font-heading text-2xl font-bold text-foreground">{mockTeacher.name}</h1>
                <p className="text-muted-foreground">{mockTeacher.subject} Teacher • {mockTeacher.employeeId}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="bg-card border-b border-border sticky top-0 z-10">
          <div className="container mx-auto px-4">
            <div className="flex gap-1 overflow-x-auto py-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                    activeTab === tab.id
                      ? "bg-accent text-accent-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="container mx-auto px-4 py-8">
          {/* Overview */}
          {activeTab === "overview" && (
            <div className="grid lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <div className="grid sm:grid-cols-4 gap-4">
                  {mockClasses.map((cls) => (
                    <div key={cls.id} className="glass-card p-4 text-center">
                      <p className="font-heading text-2xl font-bold text-foreground">{cls.students}</p>
                      <p className="text-xs text-muted-foreground">{cls.name}</p>
                    </div>
                  ))}
                </div>

                <div className="glass-card p-6">
                  <h3 className="font-heading font-semibold text-foreground mb-4">Quick Actions</h3>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <Button onClick={() => { setActiveTab("upload"); setUploadType("notes"); }} className="h-auto py-4">
                      <div className="flex flex-col items-center gap-2">
                        <Upload className="w-6 h-6" />
                        <span>Upload Notes</span>
                      </div>
                    </Button>
                    <Button variant="accent" onClick={() => { setActiveTab("upload"); setUploadType("marks"); }} className="h-auto py-4">
                      <div className="flex flex-col items-center gap-2">
                        <ClipboardCheck className="w-6 h-6" />
                        <span>Enter Marks</span>
                      </div>
                    </Button>
                    <Button variant="outline" onClick={() => setActiveTab("communicate")} className="h-auto py-4">
                      <div className="flex flex-col items-center gap-2">
                        <MessageSquare className="w-6 h-6" />
                        <span>Send Notification</span>
                      </div>
                    </Button>
                    <Button variant="outline" onClick={() => setActiveTab("marks")} className="h-auto py-4">
                      <div className="flex flex-col items-center gap-2">
                        <BarChart3 className="w-6 h-6" />
                        <span>View Performance</span>
                      </div>
                    </Button>
                  </div>
                </div>
              </div>

              <div className="glass-card p-6">
                <h3 className="font-heading font-semibold text-foreground mb-4">At-Risk Students</h3>
                <div className="space-y-3">
                  {mockStudents.filter(s => s.mark < 50 || s.attendance < 80).map((student) => (
                    <div key={student.id} className="p-3 rounded-lg bg-destructive/10 border border-destructive/20">
                      <p className="text-sm font-medium text-foreground">{student.name}</p>
                      <p className="text-xs text-muted-foreground">{student.class} • Mark: {student.mark}% • Attendance: {student.attendance}%</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* My Classes */}
          {activeTab === "classes" && (
            <div className="space-y-6">
              <div className="flex gap-2 flex-wrap">
                {mockClasses.map((cls) => (
                  <Button
                    key={cls.id}
                    variant={selectedClass === cls.id ? "default" : "outline"}
                    onClick={() => setSelectedClass(cls.id)}
                  >
                    {cls.name}
                  </Button>
                ))}
              </div>

              <div className="glass-card overflow-hidden">
                <table className="w-full">
                  <thead className="bg-secondary">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-medium text-foreground">Student Name</th>
                      <th className="px-4 py-3 text-center text-sm font-medium text-foreground">Current Mark</th>
                      <th className="px-4 py-3 text-center text-sm font-medium text-foreground">Attendance</th>
                      <th className="px-4 py-3 text-center text-sm font-medium text-foreground">Status</th>
                      <th className="px-4 py-3 text-center text-sm font-medium text-foreground">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockStudents.filter(s => s.class === selectedClass).map((student, index) => (
                      <tr key={student.id} className={index % 2 === 0 ? "bg-background" : "bg-secondary/30"}>
                        <td className="px-4 py-3 text-sm font-medium text-foreground">{student.name}</td>
                        <td className={`px-4 py-3 text-center text-sm font-bold ${student.mark >= 60 ? "text-primary" : "text-destructive"}`}>
                          {student.mark}%
                        </td>
                        <td className={`px-4 py-3 text-center text-sm ${student.attendance >= 80 ? "text-muted-foreground" : "text-destructive"}`}>
                          {student.attendance}%
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            student.mark >= 60 && student.attendance >= 80
                              ? "bg-primary/10 text-primary"
                              : "bg-destructive/10 text-destructive"
                          }`}>
                            {student.mark >= 60 && student.attendance >= 80 ? "Safe" : "At Risk"}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <Button variant="ghost" size="sm">
                            <MessageSquare className="w-4 h-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Marks & Feedback */}
          {activeTab === "marks" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="font-heading text-xl font-semibold text-foreground">Enter Marks</h2>
                <select
                  value={selectedClass}
                  onChange={(e) => setSelectedClass(e.target.value)}
                  className="h-10 px-4 rounded-lg bg-secondary border border-input text-foreground"
                >
                  {mockClasses.map((cls) => (
                    <option key={cls.id} value={cls.id}>{cls.name}</option>
                  ))}
                </select>
              </div>

              <div className="glass-card overflow-hidden">
                <table className="w-full">
                  <thead className="bg-secondary">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-medium text-foreground">Student</th>
                      <th className="px-4 py-3 text-center text-sm font-medium text-foreground">Test 1</th>
                      <th className="px-4 py-3 text-center text-sm font-medium text-foreground">Test 2</th>
                      <th className="px-4 py-3 text-center text-sm font-medium text-foreground">Assignment</th>
                      <th className="px-4 py-3 text-center text-sm font-medium text-foreground">Feedback</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockStudents.filter(s => s.class === selectedClass).map((student, index) => (
                      <tr key={student.id} className={index % 2 === 0 ? "bg-background" : "bg-secondary/30"}>
                        <td className="px-4 py-3 text-sm font-medium text-foreground">{student.name}</td>
                        <td className="px-4 py-3 text-center">
                          <Input type="number" className="w-20 mx-auto text-center" placeholder="%" />
                        </td>
                        <td className="px-4 py-3 text-center">
                          <Input type="number" className="w-20 mx-auto text-center" placeholder="%" />
                        </td>
                        <td className="px-4 py-3 text-center">
                          <Input type="number" className="w-20 mx-auto text-center" placeholder="%" />
                        </td>
                        <td className="px-4 py-3 text-center">
                          <Button variant="ghost" size="sm" title="Request meeting">
                            <MessageSquare className="w-4 h-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="flex justify-end">
                <Button onClick={() => toast({ title: "Marks Saved", description: "Student marks have been updated." })}>
                  <CheckCircle className="w-4 h-4 mr-2" /> Save Marks
                </Button>
              </div>
            </div>
          )}

          {/* Upload Content */}
          {activeTab === "upload" && (
            <div className="max-w-2xl mx-auto space-y-6">
              <h2 className="font-heading text-xl font-semibold text-foreground">Upload Learning Material</h2>
              
              <div className="glass-card p-6 space-y-4">
                <div>
                  <Label>Content Type</Label>
                  <select className="w-full h-11 px-4 rounded-lg bg-secondary border border-input text-foreground mt-1">
                    <option value="notes">Class Notes</option>
                    <option value="worksheet">Worksheet</option>
                    <option value="past-paper">Past Paper</option>
                    <option value="study-guide">Study Guide</option>
                  </select>
                </div>
                <div>
                  <Label>Title</Label>
                  <Input placeholder="e.g., Algebra Chapter 5 Notes" />
                </div>
                <div>
                  <Label>Select Class(es)</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {mockClasses.map((cls) => (
                      <label key={cls.id} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-secondary cursor-pointer hover:bg-secondary/80">
                        <input type="checkbox" className="rounded" />
                        <span className="text-sm">{cls.name}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div>
                  <Label>Duration</Label>
                  <select className="w-full h-11 px-4 rounded-lg bg-secondary border border-input text-foreground mt-1">
                    <option value="term">Current Term</option>
                    <option value="year">Full Year</option>
                    <option value="permanent">Permanent</option>
                  </select>
                </div>
                <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                  <Upload className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                  <p className="text-sm text-foreground mb-1">Drag and drop files here</p>
                  <p className="text-xs text-muted-foreground mb-3">PDF, DOC, PPT (max 25MB)</p>
                  <Button variant="outline" size="sm">Browse Files</Button>
                </div>
                <Button className="w-full" onClick={handleUpload}>
                  <Upload className="w-4 h-4 mr-2" /> Upload Content
                </Button>
              </div>
            </div>
          )}

          {/* Communicate */}
          {activeTab === "communicate" && (
            <div className="max-w-2xl mx-auto space-y-6">
              <h2 className="font-heading text-xl font-semibold text-foreground">Send Notification</h2>
              
              <div className="glass-card p-6 space-y-4">
                <div>
                  <Label>Select Recipients</Label>
                  <select
                    value={selectedClass}
                    onChange={(e) => setSelectedClass(e.target.value)}
                    className="w-full h-11 px-4 rounded-lg bg-secondary border border-input text-foreground mt-1"
                  >
                    <option value="all">All My Classes</option>
                    {mockClasses.map((cls) => (
                      <option key={cls.id} value={cls.id}>{cls.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <Label>Message</Label>
                  <textarea
                    value={notificationMessage}
                    onChange={(e) => setNotificationMessage(e.target.value)}
                    placeholder="Type your message to students..."
                    className="w-full h-32 px-4 py-3 rounded-lg bg-secondary border border-input text-foreground resize-none focus:outline-none focus:ring-2 focus:ring-primary mt-1"
                  />
                </div>
                <div className="p-4 rounded-lg bg-accent/10 border border-accent/20">
                  <p className="text-sm text-muted-foreground">
                    <strong className="text-foreground">Note:</strong> This notification will be sent to all subscribed students in the selected class(es). They will receive it on the portal and as a push notification if enabled.
                  </p>
                </div>
                <Button className="w-full" onClick={sendNotification} disabled={!notificationMessage.trim()}>
                  <Send className="w-4 h-4 mr-2" /> Send Notification
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
