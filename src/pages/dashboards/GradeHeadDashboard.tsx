import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { 
  User, Users, BarChart3, AlertTriangle, Calendar, Upload,
  ChevronDown, QrCode, CheckCircle, XCircle, TrendingUp, TrendingDown
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const mockGradeHead = {
  name: "Mr. S. Zondi",
  grade: "Grade 11",
  totalStudents: 156,
  totalClasses: 4,
};

const mockClassPerformance = [
  { class: "11A", students: 38, average: 72, passRate: 89, attendance: 94 },
  { class: "11B", students: 40, average: 68, passRate: 82, attendance: 91 },
  { class: "11C", students: 39, average: 65, passRate: 78, attendance: 88 },
  { class: "11D", students: 39, average: 70, passRate: 85, attendance: 92 },
];

const mockAtRiskStudents = [
  { id: 1, name: "Bongani Cele", class: "11A", average: 42, attendance: 75, issue: "Low marks & attendance" },
  { id: 2, name: "Thobile Ngcobo", class: "11B", average: 48, attendance: 82, issue: "Failing 3 subjects" },
  { id: 3, name: "Mandla Sithole", class: "11C", average: 38, attendance: 68, issue: "Critical attendance" },
  { id: 4, name: "Noxolo Mthembu", class: "11D", average: 45, attendance: 90, issue: "Math & Science failing" },
];

const mockTopPerformers = [
  { id: 1, name: "Zanele Dube", class: "11A", average: 91 },
  { id: 2, name: "Siyabonga Ndlovu", class: "11B", average: 88 },
  { id: 3, name: "Nomsa Khumalo", class: "11C", average: 87 },
];

export default function GradeHeadDashboard() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("overview");
  const [showQRScanner, setShowQRScanner] = useState(false);

  const tabs = [
    { id: "overview", label: "Overview", icon: BarChart3 },
    { id: "classes", label: "Class Performance", icon: Users },
    { id: "students", label: "At-Risk Students", icon: AlertTriangle },
    { id: "attendance", label: "Attendance", icon: QrCode },
    { id: "timetable", label: "Timetables", icon: Calendar },
  ];

  const handleTimetableUpload = () => {
    toast({
      title: "Timetable Uploaded",
      description: "The new timetable has been published and is now visible to all Grade 11 students and teachers.",
    });
  };

  return (
    <Layout>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <div className="bg-card border-b border-border">
          <div className="container mx-auto px-4 py-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="w-8 h-8 text-primary" />
              </div>
              <div>
                <h1 className="font-heading text-2xl font-bold text-foreground">{mockGradeHead.name}</h1>
                <p className="text-muted-foreground">{mockGradeHead.grade} Head • {mockGradeHead.totalStudents} Students • {mockGradeHead.totalClasses} Classes</p>
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
                      ? "bg-primary text-primary-foreground"
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
            <div className="space-y-6">
              {/* Stats */}
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="glass-card p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Total Students</p>
                      <p className="text-3xl font-bold text-foreground">{mockGradeHead.totalStudents}</p>
                    </div>
                    <Users className="w-8 h-8 text-primary" />
                  </div>
                </div>
                <div className="glass-card p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Grade Average</p>
                      <p className="text-3xl font-bold text-foreground">69%</p>
                    </div>
                    <TrendingUp className="w-8 h-8 text-primary" />
                  </div>
                </div>
                <div className="glass-card p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Pass Rate</p>
                      <p className="text-3xl font-bold text-foreground">84%</p>
                    </div>
                    <BarChart3 className="w-8 h-8 text-accent" />
                  </div>
                </div>
                <div className="glass-card p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">At-Risk Students</p>
                      <p className="text-3xl font-bold text-destructive">{mockAtRiskStudents.length}</p>
                    </div>
                    <AlertTriangle className="w-8 h-8 text-destructive" />
                  </div>
                </div>
              </div>

              {/* Class Performance Chart Placeholder */}
              <div className="grid lg:grid-cols-2 gap-6">
                <div className="glass-card p-6">
                  <h3 className="font-heading font-semibold text-foreground mb-4">Class Performance Comparison</h3>
                  <div className="space-y-4">
                    {mockClassPerformance.map((cls) => (
                      <div key={cls.class} className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="font-medium text-foreground">{cls.class}</span>
                          <span className="text-muted-foreground">{cls.average}% avg</span>
                        </div>
                        <div className="h-3 bg-secondary rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${cls.average >= 70 ? "bg-primary" : cls.average >= 50 ? "bg-accent" : "bg-destructive"}`}
                            style={{ width: `${cls.average}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="glass-card p-6">
                  <h3 className="font-heading font-semibold text-foreground mb-4">Top Performers</h3>
                  <div className="space-y-3">
                    {mockTopPerformers.map((student, index) => (
                      <div key={student.id} className="flex items-center gap-3 p-3 rounded-lg bg-primary/5 border border-primary/20">
                        <span className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">
                          {index + 1}
                        </span>
                        <div>
                          <p className="font-medium text-foreground">{student.name}</p>
                          <p className="text-xs text-muted-foreground">{student.class}</p>
                        </div>
                        <span className="ml-auto text-primary font-bold">{student.average}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Class Performance */}
          {activeTab === "classes" && (
            <div className="space-y-6">
              <h2 className="font-heading text-xl font-semibold text-foreground">Class Performance Details</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {mockClassPerformance.map((cls) => (
                  <div key={cls.class} className="glass-card p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-heading text-lg font-semibold text-foreground">{cls.class}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        cls.passRate >= 85 ? "bg-primary/10 text-primary" : 
                        cls.passRate >= 70 ? "bg-accent/10 text-accent" : 
                        "bg-destructive/10 text-destructive"
                      }`}>
                        {cls.passRate}% Pass Rate
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <p className="text-2xl font-bold text-foreground">{cls.students}</p>
                        <p className="text-xs text-muted-foreground">Students</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-foreground">{cls.average}%</p>
                        <p className="text-xs text-muted-foreground">Average</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-foreground">{cls.attendance}%</p>
                        <p className="text-xs text-muted-foreground">Attendance</p>
                      </div>
                    </div>
                    <Button variant="outline" className="w-full mt-4" size="sm">
                      View Full Report
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* At-Risk Students */}
          {activeTab === "students" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="font-heading text-xl font-semibold text-foreground">At-Risk Students</h2>
                <span className="px-3 py-1 rounded-full bg-destructive/10 text-destructive text-sm font-medium">
                  {mockAtRiskStudents.length} Students Need Attention
                </span>
              </div>
              <div className="glass-card overflow-hidden">
                <table className="w-full">
                  <thead className="bg-secondary">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-medium text-foreground">Student</th>
                      <th className="px-4 py-3 text-center text-sm font-medium text-foreground">Class</th>
                      <th className="px-4 py-3 text-center text-sm font-medium text-foreground">Average</th>
                      <th className="px-4 py-3 text-center text-sm font-medium text-foreground">Attendance</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-foreground">Issue</th>
                      <th className="px-4 py-3 text-center text-sm font-medium text-foreground">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockAtRiskStudents.map((student, index) => (
                      <tr key={student.id} className={index % 2 === 0 ? "bg-background" : "bg-secondary/30"}>
                        <td className="px-4 py-3 text-sm font-medium text-foreground">{student.name}</td>
                        <td className="px-4 py-3 text-center text-sm text-muted-foreground">{student.class}</td>
                        <td className="px-4 py-3 text-center text-sm text-destructive font-bold">{student.average}%</td>
                        <td className={`px-4 py-3 text-center text-sm font-bold ${student.attendance < 80 ? "text-destructive" : "text-muted-foreground"}`}>
                          {student.attendance}%
                        </td>
                        <td className="px-4 py-3 text-sm text-muted-foreground">{student.issue}</td>
                        <td className="px-4 py-3 text-center">
                          <Button variant="outline" size="sm">Intervene</Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Attendance */}
          {activeTab === "attendance" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="font-heading text-xl font-semibold text-foreground">Attendance Management</h2>
                <Button onClick={() => setShowQRScanner(!showQRScanner)}>
                  <QrCode className="w-4 h-4 mr-2" /> {showQRScanner ? "Close Scanner" : "Open QR Scanner"}
                </Button>
              </div>

              {showQRScanner && (
                <div className="glass-card p-8 text-center">
                  <div className="w-64 h-64 bg-secondary rounded-xl mx-auto mb-4 flex items-center justify-center">
                    <QrCode className="w-24 h-24 text-muted-foreground" />
                  </div>
                  <p className="text-muted-foreground">Point camera at student's QR code to mark attendance</p>
                </div>
              )}

              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {mockClassPerformance.map((cls) => (
                  <div key={cls.class} className="glass-card p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-foreground">{cls.class}</span>
                      <span className={`text-sm font-bold ${cls.attendance >= 90 ? "text-primary" : cls.attendance >= 80 ? "text-accent" : "text-destructive"}`}>
                        {cls.attendance}%
                      </span>
                    </div>
                    <div className="h-2 bg-secondary rounded-full">
                      <div
                        className={`h-full rounded-full ${cls.attendance >= 90 ? "bg-primary" : cls.attendance >= 80 ? "bg-accent" : "bg-destructive"}`}
                        style={{ width: `${cls.attendance}%` }}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">{cls.students} students</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Timetables */}
          {activeTab === "timetable" && (
            <div className="max-w-2xl mx-auto space-y-6">
              <h2 className="font-heading text-xl font-semibold text-foreground">Upload Grade Timetable</h2>
              
              <div className="glass-card p-6 space-y-4">
                <div>
                  <label className="text-sm font-medium text-foreground">Timetable Type</label>
                  <select className="w-full h-11 px-4 rounded-lg bg-secondary border border-input text-foreground mt-1">
                    <option value="class">Class Timetable</option>
                    <option value="exam">Exam Timetable</option>
                    <option value="weekend">Weekend Classes</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground">Term/Period</label>
                  <select className="w-full h-11 px-4 rounded-lg bg-secondary border border-input text-foreground mt-1">
                    <option value="term1">Term 1</option>
                    <option value="term2">Term 2</option>
                    <option value="term3">Term 3</option>
                    <option value="term4">Term 4</option>
                  </select>
                </div>
                <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                  <Upload className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                  <p className="text-sm text-foreground mb-1">Upload Timetable File</p>
                  <p className="text-xs text-muted-foreground mb-3">PDF, Excel, or Image (max 10MB)</p>
                  <Button variant="outline" size="sm">Browse Files</Button>
                </div>
                <Button className="w-full" onClick={handleTimetableUpload}>
                  <Upload className="w-4 h-4 mr-2" /> Publish Timetable
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
