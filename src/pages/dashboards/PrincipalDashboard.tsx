import { useState, useEffect } from "react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { 
  User, Users, BarChart3, Star, MessageSquare, Send,
  TrendingUp, TrendingDown, School, Bell, ChevronRight, Loader2
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

interface Registration {
  id: string;
  role: string;
  status: string;
  grade: string | null;
}

interface Profile {
  id: string;
  first_name: string;
  last_name: string;
  grade: string | null;
}

export default function PrincipalDashboard() {
  const { toast } = useToast();
  const { profile, user } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  const [staffMessage, setStaffMessage] = useState("");
  const [selectedStaff, setSelectedStaff] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [allProfiles, setAllProfiles] = useState<Profile[]>([]);

  const tabs = [
    { id: "overview", label: "School Overview", icon: School },
    { id: "grades", label: "Grade Performance", icon: BarChart3 },
    { id: "staff", label: "Staff Overview", icon: Users },
    { id: "communicate", label: "Communication", icon: MessageSquare },
  ];

  const fetchData = async () => {
    setLoading(true);
    
    const { data: regData } = await supabase
      .from('registrations')
      .select('*')
      .eq('status', 'approved');
    
    if (regData) setRegistrations(regData);

    const { data: profileData } = await supabase
      .from('profiles')
      .select('*');
    
    if (profileData) setAllProfiles(profileData);

    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Calculate stats
  const learnerCount = registrations.filter(r => r.role === 'learner').length;
  const teacherCount = registrations.filter(r => r.role === 'teacher').length;
  const gradeHeadCount = registrations.filter(r => r.role === 'grade_head').length;

  const gradePerformance = [
    { grade: "Grade 8", students: registrations.filter(r => r.grade === 'Grade 8').length, average: 68, passRate: 88, trend: "up" },
    { grade: "Grade 9", students: registrations.filter(r => r.grade === 'Grade 9').length, average: 65, passRate: 82, trend: "down" },
    { grade: "Grade 10", students: registrations.filter(r => r.grade === 'Grade 10').length, average: 62, passRate: 79, trend: "up" },
    { grade: "Grade 11", students: registrations.filter(r => r.grade === 'Grade 11').length, average: 69, passRate: 84, trend: "up" },
    { grade: "Grade 12", students: registrations.filter(r => r.grade === 'Grade 12').length, average: 72, passRate: 91, trend: "up" },
  ];

  const totalStudents = learnerCount;
  const schoolAverage = 67;
  const schoolPassRate = 85;

  const sendStaffMessage = async () => {
    if (!staffMessage.trim()) return;
    
    try {
      await supabase
        .from('announcements')
        .insert({
          title: `Message from Principal`,
          content: staffMessage,
          type: 'announcement',
          created_by: user?.id,
          target_audience: selectedStaff.length > 0 ? selectedStaff : ['teachers', 'grade_heads', 'admin'],
        });

      toast({
        title: "Message Sent",
        description: `Your message has been sent to ${selectedStaff.length || "all"} staff members.`,
      });
      setStaffMessage("");
      setSelectedStaff([]);
    } catch (error) {
      toast({ title: "Error", description: "Failed to send message", variant: "destructive" });
    }
  };

  const staffMembers = allProfiles.slice(0, 5);

  return (
    <Layout>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary to-primary/80 border-b border-border">
          <div className="container mx-auto px-4 py-8">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center">
                <User className="w-10 h-10 text-primary" />
              </div>
              <div className="text-white">
                <h1 className="font-heading text-3xl font-bold">
                  {profile ? `${profile.first_name} ${profile.last_name}` : 'Principal'}
                </h1>
                <p className="text-white/80 text-lg">Principal • Ogwini Comprehensive Technical High School</p>
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
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : (
            <>
              {/* Overview */}
              {activeTab === "overview" && (
                <div className="space-y-6">
                  {/* Key Stats */}
                  <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="glass-card p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground">Total Learners</p>
                          <p className="text-3xl font-bold text-foreground">{totalStudents}</p>
                        </div>
                        <Users className="w-8 h-8 text-primary" />
                      </div>
                    </div>
                    <div className="glass-card p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground">Teaching Staff</p>
                          <p className="text-3xl font-bold text-foreground">{teacherCount + gradeHeadCount}</p>
                        </div>
                        <School className="w-8 h-8 text-primary" />
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
                          <p className="text-sm text-muted-foreground">Pass Rate</p>
                          <p className="text-3xl font-bold text-foreground">{schoolPassRate}%</p>
                        </div>
                        <BarChart3 className="w-8 h-8 text-accent" />
                      </div>
                    </div>
                  </div>

                  {/* Grade Summary */}
                  <div className="glass-card p-6">
                    <h3 className="font-heading font-semibold text-foreground mb-4">Grade Performance Summary</h3>
                    <div className="space-y-4">
                      {gradePerformance.map((grade) => (
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
                    <Button variant="outline" className="h-auto py-4" onClick={() => setActiveTab("staff")}>
                      <div className="flex flex-col items-center gap-2">
                        <Users className="w-6 h-6" />
                        <span>Staff Overview</span>
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
                    {gradePerformance.map((grade) => (
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
                            <p className="text-2xl font-bold text-foreground">{grade.students || 0}</p>
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

              {/* Staff Overview */}
              {activeTab === "staff" && (
                <div className="space-y-6">
                  <h2 className="font-heading text-xl font-semibold text-foreground">Staff Overview</h2>
                  
                  <div className="grid sm:grid-cols-3 gap-4 mb-6">
                    <div className="glass-card p-6 text-center">
                      <p className="text-3xl font-bold text-foreground">{teacherCount}</p>
                      <p className="text-sm text-muted-foreground">Teachers</p>
                    </div>
                    <div className="glass-card p-6 text-center">
                      <p className="text-3xl font-bold text-foreground">{gradeHeadCount}</p>
                      <p className="text-sm text-muted-foreground">Grade Heads</p>
                    </div>
                    <div className="glass-card p-6 text-center">
                      <p className="text-3xl font-bold text-foreground">{registrations.filter(r => r.role === 'admin').length}</p>
                      <p className="text-sm text-muted-foreground">Administrators</p>
                    </div>
                  </div>

                  <div className="glass-card overflow-hidden">
                    <table className="w-full">
                      <thead className="bg-secondary">
                        <tr>
                          <th className="px-4 py-3 text-left text-sm font-medium text-foreground">Name</th>
                          <th className="px-4 py-3 text-center text-sm font-medium text-foreground">Grade</th>
                          <th className="px-4 py-3 text-center text-sm font-medium text-foreground">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {staffMembers.map((staff, index) => (
                          <tr key={staff.id} className={index % 2 === 0 ? "bg-background" : "bg-secondary/30"}>
                            <td className="px-4 py-3 text-sm font-medium text-foreground">{staff.first_name} {staff.last_name}</td>
                            <td className="px-4 py-3 text-center text-sm text-muted-foreground">{staff.grade || '-'}</td>
                            <td className="px-4 py-3 text-center">
                              <Button variant="ghost" size="sm">View</Button>
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
                        <Button
                          variant={selectedStaff.includes('teachers') ? "default" : "outline"}
                          size="sm"
                          onClick={() => {
                            if (selectedStaff.includes('teachers')) {
                              setSelectedStaff(selectedStaff.filter(s => s !== 'teachers'));
                            } else {
                              setSelectedStaff([...selectedStaff, 'teachers']);
                            }
                          }}
                        >
                          Teachers
                        </Button>
                        <Button
                          variant={selectedStaff.includes('grade_heads') ? "default" : "outline"}
                          size="sm"
                          onClick={() => {
                            if (selectedStaff.includes('grade_heads')) {
                              setSelectedStaff(selectedStaff.filter(s => s !== 'grade_heads'));
                            } else {
                              setSelectedStaff([...selectedStaff, 'grade_heads']);
                            }
                          }}
                        >
                          Grade Heads
                        </Button>
                        <Button
                          variant={selectedStaff.includes('admin') ? "default" : "outline"}
                          size="sm"
                          onClick={() => {
                            if (selectedStaff.includes('admin')) {
                              setSelectedStaff(selectedStaff.filter(s => s !== 'admin'));
                            } else {
                              setSelectedStaff([...selectedStaff, 'admin']);
                            }
                          }}
                        >
                          Admin
                        </Button>
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
            </>
          )}
        </div>
      </div>
    </Layout>
  );
}
