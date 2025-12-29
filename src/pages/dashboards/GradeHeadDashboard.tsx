import { useState, useEffect } from "react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { 
  User, Users, BarChart3, AlertTriangle, Calendar, Upload,
  ChevronDown, QrCode, CheckCircle, XCircle, TrendingUp, TrendingDown,
  Loader2, BookOpen, FileText
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

interface Profile {
  id: string;
  first_name: string;
  last_name: string;
  grade: string | null;
}

interface LearningMaterial {
  id: string;
  title: string;
  subject: string | null;
  grade: string | null;
  type: string;
}

export default function GradeHeadDashboard() {
  const { toast } = useToast();
  const { profile, user } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  const [showQRScanner, setShowQRScanner] = useState(false);
  const [loading, setLoading] = useState(true);
  const [students, setStudents] = useState<Profile[]>([]);
  const [materials, setMaterials] = useState<LearningMaterial[]>([]);

  const gradeAssigned = profile?.grade || "Grade 11";

  const tabs = [
    { id: "overview", label: "Overview", icon: BarChart3 },
    { id: "students", label: "My Students", icon: Users },
    { id: "materials", label: "Learning Materials", icon: BookOpen },
    { id: "attendance", label: "Attendance", icon: QrCode },
    { id: "timetable", label: "Timetables", icon: Calendar },
  ];

  const fetchData = async () => {
    setLoading(true);
    
    // Fetch students in the assigned grade
    const { data: studentsData } = await supabase
      .from('profiles')
      .select('*')
      .eq('grade', gradeAssigned)
      .order('last_name');
    
    if (studentsData) setStudents(studentsData);

    // Fetch materials for the grade
    const { data: materialsData } = await supabase
      .from('learning_materials')
      .select('*')
      .or(`grade.eq.${gradeAssigned},grade.is.null`)
      .order('created_at', { ascending: false });
    
    if (materialsData) setMaterials(materialsData);

    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleTimetableUpload = () => {
    toast({
      title: "Timetable Uploaded",
      description: `The new timetable has been published and is now visible to all ${gradeAssigned} students and teachers.`,
    });
  };

  // Mock performance data
  const mockClassPerformance = [
    { class: `${gradeAssigned}A`, students: students.length || 38, average: 72, passRate: 89, attendance: 94 },
    { class: `${gradeAssigned}B`, students: 40, average: 68, passRate: 82, attendance: 91 },
    { class: `${gradeAssigned}C`, students: 39, average: 65, passRate: 78, attendance: 88 },
  ];

  const atRiskStudents = students.filter((_, i) => i < 4); // Mock at-risk

  return (
    <Layout>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary/20 to-accent/20 border-b border-border">
          <div className="container mx-auto px-4 py-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center">
                <User className="w-8 h-8 text-primary-foreground" />
              </div>
              <div>
                <h1 className="font-heading text-2xl font-bold text-foreground">
                  {profile ? `${profile.first_name} ${profile.last_name}` : 'Grade Head'}
                </h1>
                <p className="text-muted-foreground">{gradeAssigned} Head • {students.length} Students</p>
              </div>
              <div className="ml-auto flex gap-2">
                <div className="px-4 py-2 rounded-full bg-primary text-primary-foreground text-sm font-bold">
                  {students.length} Students
                </div>
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
                  {/* Stats */}
                  <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="glass-card p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground">Total Students</p>
                          <p className="text-3xl font-bold text-foreground">{students.length}</p>
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
                          <p className="text-sm text-muted-foreground">Materials</p>
                          <p className="text-3xl font-bold text-foreground">{materials.length}</p>
                        </div>
                        <BookOpen className="w-8 h-8 text-primary" />
                      </div>
                    </div>
                  </div>

                  {/* Class Performance */}
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
                      <h3 className="font-heading font-semibold text-foreground mb-4">Quick Actions</h3>
                      <div className="grid sm:grid-cols-2 gap-4">
                        <Button onClick={() => setActiveTab("students")} className="h-auto py-4">
                          <div className="flex flex-col items-center gap-2">
                            <Users className="w-6 h-6" />
                            <span>View Students</span>
                          </div>
                        </Button>
                        <Button variant="accent" onClick={() => setActiveTab("materials")} className="h-auto py-4">
                          <div className="flex flex-col items-center gap-2">
                            <Upload className="w-6 h-6" />
                            <span>Upload Material</span>
                          </div>
                        </Button>
                        <Button variant="outline" onClick={() => setActiveTab("attendance")} className="h-auto py-4">
                          <div className="flex flex-col items-center gap-2">
                            <QrCode className="w-6 h-6" />
                            <span>Take Attendance</span>
                          </div>
                        </Button>
                        <Button variant="outline" onClick={() => setActiveTab("timetable")} className="h-auto py-4">
                          <div className="flex flex-col items-center gap-2">
                            <Calendar className="w-6 h-6" />
                            <span>Timetables</span>
                          </div>
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Students */}
              {activeTab === "students" && (
                <div className="space-y-6">
                  <h2 className="font-heading text-xl font-semibold text-foreground">{gradeAssigned} Students</h2>
                  
                  {students.length > 0 ? (
                    <div className="glass-card overflow-hidden">
                      <table className="w-full">
                        <thead className="bg-secondary">
                          <tr>
                            <th className="px-4 py-3 text-left text-sm font-medium text-foreground">Student Name</th>
                            <th className="px-4 py-3 text-center text-sm font-medium text-foreground">Grade</th>
                            <th className="px-4 py-3 text-center text-sm font-medium text-foreground">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {students.map((student, index) => (
                            <tr key={student.id} className={index % 2 === 0 ? "bg-background" : "bg-secondary/30"}>
                              <td className="px-4 py-3 text-sm font-medium text-foreground">
                                {student.first_name} {student.last_name}
                              </td>
                              <td className="px-4 py-3 text-center text-sm text-muted-foreground">
                                {student.grade}
                              </td>
                              <td className="px-4 py-3 text-center">
                                <Button variant="ghost" size="sm">View</Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="glass-card p-8 text-center">
                      <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">No students registered for {gradeAssigned} yet</p>
                    </div>
                  )}
                </div>
              )}

              {/* Materials */}
              {activeTab === "materials" && (
                <div className="space-y-6">
                  <h2 className="font-heading text-xl font-semibold text-foreground">{gradeAssigned} Learning Materials</h2>
                  
                  {materials.length > 0 ? (
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {materials.map((material) => (
                        <div key={material.id} className="glass-card p-4">
                          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
                            <FileText className="w-5 h-5 text-primary" />
                          </div>
                          <h4 className="font-medium text-foreground text-sm mb-1">{material.title}</h4>
                          <p className="text-xs text-muted-foreground">{material.subject} • {material.type}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="glass-card p-8 text-center">
                      <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">No materials uploaded for {gradeAssigned} yet</p>
                    </div>
                  )}
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

                  <div className="grid sm:grid-cols-3 gap-4">
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
                  <h2 className="font-heading text-xl font-semibold text-foreground">Upload {gradeAssigned} Timetable</h2>
                  
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
            </>
          )}
        </div>
      </div>
    </Layout>
  );
}
