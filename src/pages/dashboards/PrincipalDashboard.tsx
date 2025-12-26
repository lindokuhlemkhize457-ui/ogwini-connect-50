import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { 
  User, Users, BarChart3, Star, MessageSquare, Send,
  TrendingUp, TrendingDown, School, Bell, ChevronRight
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const mockPrincipal = {
  name: "Dr. M. Naidoo",
  title: "Principal",
};

const mockGradePerformance = [
  { grade: "Grade 8", students: 180, average: 68, passRate: 88, trend: "up" },
  { grade: "Grade 9", students: 175, average: 65, passRate: 82, trend: "down" },
  { grade: "Grade 10", students: 168, average: 62, passRate: 79, trend: "up" },
  { grade: "Grade 11", students: 156, average: 69, passRate: 84, trend: "up" },
  { grade: "Grade 12", students: 142, average: 72, passRate: 91, trend: "up" },
];

const mockTeacherRatings = [
  { id: 1, name: "Mrs. N. Dlamini", subject: "Mathematics", rating: 4.8, responses: 45, impact: "positive" },
  { id: 2, name: "Mr. J. Pillay", subject: "Physical Sciences", rating: 4.6, responses: 38, impact: "positive" },
  { id: 3, name: "Ms. T. Mokoena", subject: "English", rating: 4.2, responses: 52, impact: "positive" },
  { id: 4, name: "Mr. B. Zulu", subject: "Life Sciences", rating: 3.8, responses: 41, impact: "neutral" },
  { id: 5, name: "Mrs. P. Govender", subject: "Accounting", rating: 3.2, responses: 35, impact: "negative" },
];

const mockStaffMembers = [
  { id: 1, name: "Mrs. N. Dlamini", role: "Teacher", department: "Mathematics" },
  { id: 2, name: "Mr. S. Zondi", role: "Grade Head", department: "Grade 11" },
  { id: 3, name: "Ms. L. Mbeki", role: "Admin", department: "Office" },
  { id: 4, name: "Mr. K. Naicker", role: "Deputy Principal", department: "Administration" },
];

export default function PrincipalDashboard() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("overview");
  const [staffMessage, setStaffMessage] = useState("");
  const [selectedStaff, setSelectedStaff] = useState<string[]>([]);

  const tabs = [
    { id: "overview", label: "School Overview", icon: School },
    { id: "grades", label: "Grade Performance", icon: BarChart3 },
    { id: "teachers", label: "Teacher Ratings", icon: Star },
    { id: "communicate", label: "Staff Communication", icon: MessageSquare },
  ];

  const totalStudents = mockGradePerformance.reduce((sum, g) => sum + g.students, 0);
  const schoolAverage = Math.round(mockGradePerformance.reduce((sum, g) => sum + g.average, 0) / mockGradePerformance.length);
  const schoolPassRate = Math.round(mockGradePerformance.reduce((sum, g) => sum + g.passRate, 0) / mockGradePerformance.length);

  const sendStaffMessage = () => {
    if (!staffMessage.trim()) return;
    toast({
      title: "Message Sent",
      description: `Your message has been sent to ${selectedStaff.length || "all"} staff members.`,
    });
    setStaffMessage("");
    setSelectedStaff([]);
  };

  return (
    <Layout>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary/20 to-accent/20 border-b border-border">
          <div className="container mx-auto px-4 py-8">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-full bg-primary flex items-center justify-center">
                <User className="w-10 h-10 text-primary-foreground" />
              </div>
              <div>
                <h1 className="font-heading text-3xl font-bold text-foreground">{mockPrincipal.name}</h1>
                <p className="text-muted-foreground text-lg">{mockPrincipal.title} • Ogwini Comprehensive Technical High School</p>
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
              {/* Key Stats */}
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="glass-card p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Total Enrollment</p>
                      <p className="text-3xl font-bold text-foreground">{totalStudents}</p>
                    </div>
                    <Users className="w-8 h-8 text-primary" />
                  </div>
                </div>
                <div className="glass-card p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">School Average</p>
                      <p className="text-3xl font-bold text-foreground">{schoolAverage}%</p>
                    </div>
                    <TrendingUp className="w-8 h-8 text-primary" />
                  </div>
                </div>
                <div className="glass-card p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Overall Pass Rate</p>
                      <p className="text-3xl font-bold text-foreground">{schoolPassRate}%</p>
                    </div>
                    <BarChart3 className="w-8 h-8 text-accent" />
                  </div>
                </div>
                <div className="glass-card p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Teaching Staff</p>
                      <p className="text-3xl font-bold text-foreground">48</p>
                    </div>
                    <School className="w-8 h-8 text-primary" />
                  </div>
                </div>
              </div>

              {/* Grade Summary */}
              <div className="glass-card p-6">
                <h3 className="font-heading font-semibold text-foreground mb-4">Grade Performance Summary</h3>
                <div className="space-y-4">
                  {mockGradePerformance.map((grade) => (
                    <div key={grade.grade} className="flex items-center gap-4">
                      <span className="w-20 font-medium text-foreground text-sm">{grade.grade}</span>
                      <div className="flex-1 h-4 bg-secondary rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${grade.passRate >= 85 ? "bg-primary" : grade.passRate >= 70 ? "bg-accent" : "bg-destructive"}`}
                          style={{ width: `${grade.passRate}%` }}
                        />
                      </div>
                      <span className="w-16 text-right text-sm text-muted-foreground">{grade.passRate}%</span>
                      {grade.trend === "up" ? (
                        <TrendingUp className="w-4 h-4 text-primary" />
                      ) : (
                        <TrendingDown className="w-4 h-4 text-destructive" />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="grid sm:grid-cols-3 gap-4">
                <Button variant="outline" className="h-auto py-4" onClick={() => setActiveTab("grades")}>
                  <div className="flex flex-col items-center gap-2">
                    <BarChart3 className="w-6 h-6" />
                    <span>View All Grades</span>
                  </div>
                </Button>
                <Button variant="outline" className="h-auto py-4" onClick={() => setActiveTab("teachers")}>
                  <div className="flex flex-col items-center gap-2">
                    <Star className="w-6 h-6" />
                    <span>Teacher Ratings</span>
                  </div>
                </Button>
                <Button variant="outline" className="h-auto py-4" onClick={() => setActiveTab("communicate")}>
                  <div className="flex flex-col items-center gap-2">
                    <MessageSquare className="w-6 h-6" />
                    <span>Message Staff</span>
                  </div>
                </Button>
              </div>
            </div>
          )}

          {/* Grade Performance */}
          {activeTab === "grades" && (
            <div className="space-y-6">
              <h2 className="font-heading text-xl font-semibold text-foreground">Detailed Grade Performance</h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {mockGradePerformance.map((grade) => (
                  <div key={grade.grade} className="glass-card p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-heading text-lg font-semibold text-foreground">{grade.grade}</h3>
                      {grade.trend === "up" ? (
                        <span className="flex items-center gap-1 text-primary text-sm">
                          <TrendingUp className="w-4 h-4" /> Improving
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-destructive text-sm">
                          <TrendingDown className="w-4 h-4" /> Declining
                        </span>
                      )}
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-center mb-4">
                      <div>
                        <p className="text-2xl font-bold text-foreground">{grade.students}</p>
                        <p className="text-xs text-muted-foreground">Students</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-foreground">{grade.average}%</p>
                        <p className="text-xs text-muted-foreground">Average</p>
                      </div>
                      <div>
                        <p className={`text-2xl font-bold ${grade.passRate >= 85 ? "text-primary" : grade.passRate >= 70 ? "text-accent" : "text-destructive"}`}>
                          {grade.passRate}%
                        </p>
                        <p className="text-xs text-muted-foreground">Pass Rate</p>
                      </div>
                    </div>
                    <Button variant="outline" className="w-full" size="sm">
                      View Full Report <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Teacher Ratings */}
          {activeTab === "teachers" && (
            <div className="space-y-6">
              <h2 className="font-heading text-xl font-semibold text-foreground">Teacher Performance Ratings</h2>
              <p className="text-muted-foreground">Based on anonymous student feedback</p>
              
              <div className="glass-card overflow-hidden">
                <table className="w-full">
                  <thead className="bg-secondary">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-medium text-foreground">Teacher</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-foreground">Subject</th>
                      <th className="px-4 py-3 text-center text-sm font-medium text-foreground">Rating</th>
                      <th className="px-4 py-3 text-center text-sm font-medium text-foreground">Responses</th>
                      <th className="px-4 py-3 text-center text-sm font-medium text-foreground">Impact</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockTeacherRatings.map((teacher, index) => (
                      <tr key={teacher.id} className={index % 2 === 0 ? "bg-background" : "bg-secondary/30"}>
                        <td className="px-4 py-3 text-sm font-medium text-foreground">{teacher.name}</td>
                        <td className="px-4 py-3 text-sm text-muted-foreground">{teacher.subject}</td>
                        <td className="px-4 py-3 text-center">
                          <div className="flex items-center justify-center gap-1">
                            <Star className={`w-4 h-4 ${teacher.rating >= 4 ? "text-accent fill-accent" : "text-muted-foreground"}`} />
                            <span className="font-bold text-foreground">{teacher.rating}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-center text-sm text-muted-foreground">{teacher.responses}</td>
                        <td className="px-4 py-3 text-center">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            teacher.impact === "positive" ? "bg-primary/10 text-primary" :
                            teacher.impact === "neutral" ? "bg-accent/10 text-accent" :
                            "bg-destructive/10 text-destructive"
                          }`}>
                            {teacher.impact.charAt(0).toUpperCase() + teacher.impact.slice(1)}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Staff Communication */}
          {activeTab === "communicate" && (
            <div className="max-w-2xl mx-auto space-y-6">
              <h2 className="font-heading text-xl font-semibold text-foreground">Staff Communication</h2>
              
              <div className="glass-card p-6 space-y-4">
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">Select Recipients</label>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      variant={selectedStaff.length === 0 ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedStaff([])}
                    >
                      All Staff
                    </Button>
                    {mockStaffMembers.map((staff) => (
                      <Button
                        key={staff.id}
                        variant={selectedStaff.includes(staff.name) ? "default" : "outline"}
                        size="sm"
                        onClick={() => {
                          if (selectedStaff.includes(staff.name)) {
                            setSelectedStaff(selectedStaff.filter(s => s !== staff.name));
                          } else {
                            setSelectedStaff([...selectedStaff, staff.name]);
                          }
                        }}
                      >
                        {staff.name}
                      </Button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">Message</label>
                  <textarea
                    value={staffMessage}
                    onChange={(e) => setStaffMessage(e.target.value)}
                    placeholder="Type your message to staff..."
                    className="w-full h-32 px-4 py-3 rounded-lg bg-secondary border border-input text-foreground resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div className="flex gap-2">
                  <Button className="flex-1" onClick={sendStaffMessage} disabled={!staffMessage.trim()}>
                    <Send className="w-4 h-4 mr-2" /> Send Message
                  </Button>
                  <Button variant="outline">
                    <Bell className="w-4 h-4 mr-2" /> Summon to Office
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
