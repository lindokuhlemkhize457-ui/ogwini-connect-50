import { useState, useEffect } from "react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  User, BookOpen, FileText, Calendar, Trophy, Bell, 
  Download, Clock, Play, ChevronRight, Star, Lock, Loader2
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

interface LearningMaterial {
  id: string;
  title: string;
  subject: string | null;
  type: string;
  file_url: string;
  grade: string | null;
  description: string | null;
}

interface Quiz {
  id: string;
  title: string;
  subject: string;
  grade: string;
  total_marks: number | null;
  duration_minutes: number | null;
}

interface Mark {
  id: string;
  subject: string;
  assessment_name: string;
  marks_obtained: number;
  total_marks: number;
  term: string | null;
  feedback: string | null;
}

interface Announcement {
  id: string;
  title: string;
  content: string;
  created_at: string;
  type: string;
}

export default function LearnerDashboard() {
  const { profile, registration } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  const [materials, setMaterials] = useState<LearningMaterial[]>([]);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [marks, setMarks] = useState<Mark[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const tabs = [
    { id: "overview", label: "Overview", icon: User },
    { id: "results", label: "Results", icon: Trophy },
    { id: "materials", label: "Learning Materials", icon: BookOpen },
    { id: "quizzes", label: "Quizzes", icon: Play },
    { id: "notifications", label: "Notifications", icon: Bell },
  ];

  const fetchData = async () => {
    setLoading(true);
    
    // Fetch learning materials
    const { data: materialsData } = await supabase
      .from('learning_materials')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (materialsData) setMaterials(materialsData);

    // Fetch published quizzes
    const { data: quizzesData } = await supabase
      .from('quizzes')
      .select('*')
      .eq('status', 'published')
      .order('created_at', { ascending: false });
    
    if (quizzesData) setQuizzes(quizzesData);

    // Fetch announcements
    const { data: announcementsData } = await supabase
      .from('announcements')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10);
    
    if (announcementsData) setAnnouncements(announcementsData);

    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const learnerGrade = profile?.grade || 'Grade 11';
  
  // Filter materials by learner's grade
  const filteredMaterials = materials.filter(m => 
    (!m.grade || m.grade === learnerGrade) &&
    (m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
     m.subject?.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Calculate average from marks
  const average = marks.length > 0 
    ? Math.round(marks.reduce((sum, m) => sum + (m.marks_obtained / m.total_marks * 100), 0) / marks.length)
    : 0;

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
                  {profile ? `${profile.first_name} ${profile.last_name}` : 'Welcome, Learner'}
                </h1>
                <p className="text-muted-foreground">
                  {learnerGrade} • {profile?.id_number || 'Student'}
                </p>
              </div>
              <div className="ml-auto">
                <span className="px-4 py-2 rounded-full bg-primary text-primary-foreground text-sm font-bold flex items-center gap-2">
                  <Star className="w-4 h-4" /> Active
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
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
              {/* Overview Tab */}
              {activeTab === "overview" && (
                <div className="grid lg:grid-cols-3 gap-6">
                  {/* Quick Stats */}
                  <div className="lg:col-span-2 space-y-6">
                    <div className="grid sm:grid-cols-3 gap-4">
                      <div className="glass-card p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                            <Trophy className="w-5 h-5 text-primary" />
                          </div>
                          <div>
                            <p className="text-2xl font-bold text-foreground">{average || '--'}%</p>
                            <p className="text-xs text-muted-foreground">Average Mark</p>
                          </div>
                        </div>
                      </div>
                      <div className="glass-card p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                            <BookOpen className="w-5 h-5 text-accent" />
                          </div>
                          <div>
                            <p className="text-2xl font-bold text-foreground">{filteredMaterials.length}</p>
                            <p className="text-xs text-muted-foreground">Materials Available</p>
                          </div>
                        </div>
                      </div>
                      <div className="glass-card p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                            <Play className="w-5 h-5 text-primary" />
                          </div>
                          <div>
                            <p className="text-2xl font-bold text-foreground">{quizzes.length}</p>
                            <p className="text-xs text-muted-foreground">Quizzes</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Recent Materials */}
                    <div className="glass-card p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-heading font-semibold text-foreground">Recent Materials</h3>
                        <Button variant="ghost" size="sm" onClick={() => setActiveTab("materials")}>
                          View All <ChevronRight className="w-4 h-4 ml-1" />
                        </Button>
                      </div>
                      <div className="space-y-3">
                        {filteredMaterials.slice(0, 3).map((material) => (
                          <div key={material.id} className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
                            <div>
                              <span className="text-sm font-medium text-foreground">{material.title}</span>
                              <p className="text-xs text-muted-foreground">{material.subject} • {material.type}</p>
                            </div>
                            <a href={material.file_url} target="_blank" rel="noopener noreferrer">
                              <Button variant="ghost" size="sm">
                                <Download className="w-4 h-4" />
                              </Button>
                            </a>
                          </div>
                        ))}
                        {filteredMaterials.length === 0 && (
                          <p className="text-center text-muted-foreground py-4">No materials available yet</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Notifications */}
                  <div className="glass-card p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-heading font-semibold text-foreground">Announcements</h3>
                      <span className="w-5 h-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">
                        {announcements.length}
                      </span>
                    </div>
                    <div className="space-y-3">
                      {announcements.slice(0, 5).map((announcement) => (
                        <div
                          key={announcement.id}
                          className="p-3 rounded-lg bg-primary/5 border border-primary/20"
                        >
                          <p className="text-sm font-medium text-foreground">{announcement.title}</p>
                          <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{announcement.content}</p>
                          <p className="text-xs text-muted-foreground mt-2">
                            {new Date(announcement.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      ))}
                      {announcements.length === 0 && (
                        <p className="text-center text-muted-foreground py-4">No announcements</p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Results Tab */}
              {activeTab === "results" && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="font-heading text-xl font-semibold text-foreground">Academic Results</h2>
                    <Button variant="outline" size="sm">
                      <Download className="w-4 h-4 mr-2" /> Download Report
                    </Button>
                  </div>
                  
                  {marks.length > 0 ? (
                    <div className="glass-card overflow-hidden">
                      <table className="w-full">
                        <thead className="bg-secondary">
                          <tr>
                            <th className="px-4 py-3 text-left text-sm font-medium text-foreground">Subject</th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-foreground">Assessment</th>
                            <th className="px-4 py-3 text-center text-sm font-medium text-foreground">Mark</th>
                            <th className="px-4 py-3 text-center text-sm font-medium text-foreground">Percentage</th>
                          </tr>
                        </thead>
                        <tbody>
                          {marks.map((mark, index) => (
                            <tr key={mark.id} className={index % 2 === 0 ? "bg-background" : "bg-secondary/30"}>
                              <td className="px-4 py-3 text-sm font-medium text-foreground">{mark.subject}</td>
                              <td className="px-4 py-3 text-sm text-muted-foreground">{mark.assessment_name}</td>
                              <td className="px-4 py-3 text-center text-sm text-muted-foreground">
                                {mark.marks_obtained}/{mark.total_marks}
                              </td>
                              <td className={`px-4 py-3 text-center text-sm font-bold ${
                                (mark.marks_obtained / mark.total_marks * 100) >= 50 ? "text-primary" : "text-destructive"
                              }`}>
                                {Math.round(mark.marks_obtained / mark.total_marks * 100)}%
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="glass-card p-8 text-center">
                      <Trophy className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="font-heading text-lg font-semibold text-foreground mb-2">No Results Yet</h3>
                      <p className="text-muted-foreground">Your marks will appear here once teachers have captured them.</p>
                    </div>
                  )}
                </div>
              )}

              {/* Learning Materials Tab */}
              {activeTab === "materials" && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between flex-wrap gap-4">
                    <h2 className="font-heading text-xl font-semibold text-foreground">Learning Materials</h2>
                    <Input 
                      placeholder="Search materials..." 
                      className="max-w-xs" 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  
                  {filteredMaterials.length > 0 ? (
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {filteredMaterials.map((material) => (
                        <div key={material.id} className="glass-card p-4 hover:border-primary/50 transition-colors">
                          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
                            <FileText className="w-5 h-5 text-primary" />
                          </div>
                          <h4 className="font-medium text-foreground text-sm mb-1">{material.title}</h4>
                          <p className="text-xs text-muted-foreground mb-3">{material.subject} • {material.type}</p>
                          {material.description && (
                            <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{material.description}</p>
                          )}
                          <a href={material.file_url} target="_blank" rel="noopener noreferrer">
                            <Button variant="outline" size="sm" className="w-full">
                              <Download className="w-4 h-4 mr-2" /> Download
                            </Button>
                          </a>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="glass-card p-8 text-center">
                      <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="font-heading text-lg font-semibold text-foreground mb-2">No Materials Found</h3>
                      <p className="text-muted-foreground">
                        {searchQuery ? 'Try a different search term' : 'Learning materials will appear here when uploaded by teachers.'}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Quizzes Tab */}
              {activeTab === "quizzes" && (
                <div className="space-y-6">
                  <h2 className="font-heading text-xl font-semibold text-foreground">Available Quizzes</h2>
                  
                  {quizzes.length > 0 ? (
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {quizzes.map((quiz) => (
                        <div key={quiz.id} className="glass-card p-6">
                          <h4 className="font-heading font-semibold text-foreground mb-2">{quiz.title}</h4>
                          <p className="text-sm text-muted-foreground mb-2">{quiz.subject} • {quiz.grade}</p>
                          <div className="flex items-center gap-2 mb-4 text-sm text-muted-foreground">
                            <Clock className="w-4 h-4" />
                            {quiz.duration_minutes} minutes
                          </div>
                          <Button className="w-full">
                            <Play className="w-4 h-4 mr-2" /> Start Quiz
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="glass-card p-8 text-center">
                      <Play className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="font-heading text-lg font-semibold text-foreground mb-2">No Quizzes Available</h3>
                      <p className="text-muted-foreground">Quizzes will appear here when published by teachers.</p>
                    </div>
                  )}
                </div>
              )}

              {/* Notifications Tab */}
              {activeTab === "notifications" && (
                <div className="space-y-4">
                  <h2 className="font-heading text-xl font-semibold text-foreground">All Notifications</h2>
                  {announcements.length > 0 ? (
                    announcements.map((announcement) => (
                      <div key={announcement.id} className="glass-card p-4 border-primary/30">
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="font-medium text-foreground">{announcement.title}</p>
                            <p className="text-sm text-muted-foreground mt-1">{announcement.content}</p>
                          </div>
                          <span className="text-xs text-muted-foreground whitespace-nowrap ml-4">
                            {new Date(announcement.created_at).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="glass-card p-8 text-center">
                      <Bell className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="font-heading text-lg font-semibold text-foreground mb-2">No Notifications</h3>
                      <p className="text-muted-foreground">You're all caught up!</p>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </Layout>
  );
}
