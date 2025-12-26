import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  User, BookOpen, FileText, Calendar, Trophy, Bell, 
  Download, Clock, Play, ChevronRight, Star, Lock
} from "lucide-react";

// Mock data - would come from database when Cloud is enabled
const mockLearner = {
  name: "Thabo Mkhize",
  grade: "Grade 11",
  class: "11A",
  studentNumber: "OGW2024001",
  photo: null,
  subscribed: true,
};

const mockResults = [
  { subject: "Mathematics", term1: 78, term2: 82, term3: null, average: 80 },
  { subject: "Physical Sciences", term1: 85, term2: 79, term3: null, average: 82 },
  { subject: "English Home Language", term1: 72, term2: 75, term3: null, average: 73 },
  { subject: "Technical Drawing", term1: 88, term2: 91, term3: null, average: 89 },
  { subject: "Life Orientation", term1: 90, term2: 88, term3: null, average: 89 },
];

const mockNotifications = [
  { id: 1, title: "Math Assignment Due", message: "Complete exercise 4.3 by Friday", date: "2 hours ago", read: false },
  { id: 2, title: "Parent Meeting", message: "Scheduled for next Thursday at 6pm", date: "1 day ago", read: false },
  { id: 3, title: "Science Lab", message: "Remember to bring lab coat tomorrow", date: "2 days ago", read: true },
];

const mockQuizzes = [
  { id: 1, subject: "Mathematics", level: 5, completed: 4, total: 20 },
  { id: 2, subject: "Physical Sciences", level: 3, completed: 2, total: 20 },
  { id: 3, subject: "English", level: 7, completed: 6, total: 20 },
];

const mockMaterials = [
  { id: 1, title: "Algebra Notes - Term 1", subject: "Mathematics", type: "PDF", size: "2.3 MB" },
  { id: 2, title: "Physics Formulae Sheet", subject: "Physical Sciences", type: "PDF", size: "1.1 MB" },
  { id: 3, title: "Technical Drawing Guidelines", subject: "Technical Drawing", type: "PDF", size: "4.5 MB" },
];

export default function LearnerDashboard() {
  const [activeTab, setActiveTab] = useState("overview");

  const tabs = [
    { id: "overview", label: "Overview", icon: User },
    { id: "results", label: "Results", icon: Trophy },
    { id: "materials", label: "Learning Materials", icon: BookOpen },
    { id: "quizzes", label: "Quizzes", icon: Play },
    { id: "calendar", label: "Calendar", icon: Calendar },
    { id: "notifications", label: "Notifications", icon: Bell },
  ];

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
                <h1 className="font-heading text-2xl font-bold text-foreground">{mockLearner.name}</h1>
                <p className="text-muted-foreground">{mockLearner.grade} • {mockLearner.class} • {mockLearner.studentNumber}</p>
              </div>
              {mockLearner.subscribed && (
                <span className="ml-auto px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium flex items-center gap-1">
                  <Star className="w-4 h-4" /> Subscribed
                </span>
              )}
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
                        <p className="text-2xl font-bold text-foreground">82%</p>
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
                        <p className="text-2xl font-bold text-foreground">5</p>
                        <p className="text-xs text-muted-foreground">Subjects</p>
                      </div>
                    </div>
                  </div>
                  <div className="glass-card p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Clock className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-foreground">95%</p>
                        <p className="text-xs text-muted-foreground">Attendance</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Recent Results */}
                <div className="glass-card p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-heading font-semibold text-foreground">Recent Results</h3>
                    <Button variant="ghost" size="sm" onClick={() => setActiveTab("results")}>
                      View All <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  </div>
                  <div className="space-y-3">
                    {mockResults.slice(0, 3).map((result) => (
                      <div key={result.subject} className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
                        <span className="text-sm font-medium text-foreground">{result.subject}</span>
                        <span className={`text-sm font-bold ${result.average >= 80 ? "text-primary" : result.average >= 60 ? "text-accent" : "text-destructive"}`}>
                          {result.average}%
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Notifications */}
              <div className="glass-card p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-heading font-semibold text-foreground">Notifications</h3>
                  <span className="w-5 h-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">
                    {mockNotifications.filter(n => !n.read).length}
                  </span>
                </div>
                <div className="space-y-3">
                  {mockNotifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-3 rounded-lg ${notification.read ? "bg-secondary/30" : "bg-primary/5 border border-primary/20"}`}
                    >
                      <p className="text-sm font-medium text-foreground">{notification.title}</p>
                      <p className="text-xs text-muted-foreground mt-1">{notification.message}</p>
                      <p className="text-xs text-muted-foreground mt-2">{notification.date}</p>
                    </div>
                  ))}
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
              <div className="glass-card overflow-hidden">
                <table className="w-full">
                  <thead className="bg-secondary">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-medium text-foreground">Subject</th>
                      <th className="px-4 py-3 text-center text-sm font-medium text-foreground">Term 1</th>
                      <th className="px-4 py-3 text-center text-sm font-medium text-foreground">Term 2</th>
                      <th className="px-4 py-3 text-center text-sm font-medium text-foreground">Term 3</th>
                      <th className="px-4 py-3 text-center text-sm font-medium text-foreground">Average</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockResults.map((result, index) => (
                      <tr key={result.subject} className={index % 2 === 0 ? "bg-background" : "bg-secondary/30"}>
                        <td className="px-4 py-3 text-sm font-medium text-foreground">{result.subject}</td>
                        <td className="px-4 py-3 text-center text-sm text-muted-foreground">{result.term1}%</td>
                        <td className="px-4 py-3 text-center text-sm text-muted-foreground">{result.term2}%</td>
                        <td className="px-4 py-3 text-center text-sm text-muted-foreground">{result.term3 ?? "-"}</td>
                        <td className={`px-4 py-3 text-center text-sm font-bold ${result.average >= 80 ? "text-primary" : result.average >= 60 ? "text-accent" : "text-destructive"}`}>
                          {result.average}%
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Learning Materials Tab */}
          {activeTab === "materials" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="font-heading text-xl font-semibold text-foreground">Learning Materials</h2>
                <Input placeholder="Search materials..." className="max-w-xs" />
              </div>
              {!mockLearner.subscribed ? (
                <div className="glass-card p-8 text-center">
                  <Lock className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="font-heading text-lg font-semibold text-foreground mb-2">Access Restricted</h3>
                  <p className="text-muted-foreground mb-4">Subscribe for R20/month to access all learning materials.</p>
                  <Button>Subscribe Now</Button>
                </div>
              ) : (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {mockMaterials.map((material) => (
                    <div key={material.id} className="glass-card p-4 hover:border-primary/50 transition-colors">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
                        <FileText className="w-5 h-5 text-primary" />
                      </div>
                      <h4 className="font-medium text-foreground text-sm mb-1">{material.title}</h4>
                      <p className="text-xs text-muted-foreground mb-3">{material.subject} • {material.size}</p>
                      <Button variant="outline" size="sm" className="w-full">
                        <Download className="w-4 h-4 mr-2" /> Download
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Quizzes Tab */}
          {activeTab === "quizzes" && (
            <div className="space-y-6">
              <h2 className="font-heading text-xl font-semibold text-foreground">Subject Quizzes</h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {mockQuizzes.map((quiz) => (
                  <div key={quiz.id} className="glass-card p-6">
                    <h4 className="font-heading font-semibold text-foreground mb-2">{quiz.subject}</h4>
                    <div className="flex items-center gap-2 mb-4">
                      <span className="text-sm text-muted-foreground">Level {quiz.level} of {quiz.total}</span>
                    </div>
                    <div className="w-full h-2 bg-secondary rounded-full mb-4">
                      <div
                        className="h-full bg-primary rounded-full transition-all"
                        style={{ width: `${(quiz.completed / quiz.total) * 100}%` }}
                      />
                    </div>
                    <Button className="w-full">
                      <Play className="w-4 h-4 mr-2" /> Continue Quiz
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Calendar Tab */}
          {activeTab === "calendar" && (
            <div className="glass-card p-6">
              <h2 className="font-heading text-xl font-semibold text-foreground mb-4">School Calendar</h2>
              <p className="text-muted-foreground">Calendar view with timetables, weekend classes, and important dates will be displayed here.</p>
            </div>
          )}

          {/* Notifications Tab */}
          {activeTab === "notifications" && (
            <div className="space-y-4">
              <h2 className="font-heading text-xl font-semibold text-foreground">All Notifications</h2>
              {mockNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`glass-card p-4 ${notification.read ? "" : "border-primary/30"}`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-medium text-foreground">{notification.title}</p>
                      <p className="text-sm text-muted-foreground mt-1">{notification.message}</p>
                    </div>
                    <span className="text-xs text-muted-foreground">{notification.date}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
