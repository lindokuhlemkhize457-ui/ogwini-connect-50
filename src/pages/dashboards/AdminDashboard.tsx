import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  User, Users, FileText, Calendar, Mail, Settings,
  CheckCircle, XCircle, Clock, Search, Upload, Send,
  Ticket, Eye
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const mockAdmin = {
  name: "Ms. L. Mbeki",
  title: "School Administrator",
};

const mockRegistrations = [
  { id: 1, name: "Zinhle Mthethwa", grade: "Grade 8", date: "2024-01-15", status: "pending", documents: true, payment: true },
  { id: 2, name: "Siyanda Nkosi", grade: "Grade 9", date: "2024-01-14", status: "pending", documents: true, payment: false },
  { id: 3, name: "Thando Dlamini", grade: "Grade 10", date: "2024-01-13", status: "approved", documents: true, payment: true },
  { id: 4, name: "Nomvula Cele", grade: "Grade 8", date: "2024-01-12", status: "rejected", documents: false, payment: false },
];

const mockTickets = [
  { id: "TKT001", student: "Thabo Mkhize", issue: "Cannot access past papers", date: "2024-01-16", status: "open", priority: "medium" },
  { id: "TKT002", student: "Zanele Dube", issue: "Password reset request", date: "2024-01-15", status: "in-progress", priority: "low" },
  { id: "TKT003", student: "Sipho Nkosi", issue: "Incorrect marks displayed", date: "2024-01-14", status: "resolved", priority: "high" },
];

export default function AdminDashboard() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("registrations");
  const [searchQuery, setSearchQuery] = useState("");

  const tabs = [
    { id: "registrations", label: "Registrations", icon: Users },
    { id: "tickets", label: "Support Tickets", icon: Ticket },
    { id: "timetables", label: "Timetables", icon: Calendar },
    { id: "communications", label: "Email System", icon: Mail },
    { id: "users", label: "User Management", icon: Settings },
  ];

  const handleApprove = (id: number) => {
    toast({
      title: "Registration Approved",
      description: "Acceptance email has been sent to the student.",
    });
  };

  const handleReject = (id: number) => {
    toast({
      title: "Registration Rejected",
      description: "Rejection notification has been sent.",
      variant: "destructive",
    });
  };

  const pendingCount = mockRegistrations.filter(r => r.status === "pending").length;
  const openTickets = mockTickets.filter(t => t.status !== "resolved").length;

  return (
    <Layout>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <div className="bg-card border-b border-border">
          <div className="container mx-auto px-4 py-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center">
                <Settings className="w-8 h-8 text-accent" />
              </div>
              <div>
                <h1 className="font-heading text-2xl font-bold text-foreground">{mockAdmin.name}</h1>
                <p className="text-muted-foreground">{mockAdmin.title}</p>
              </div>
              <div className="ml-auto flex gap-2">
                <div className="px-3 py-1 rounded-full bg-accent/10 text-accent text-sm font-medium">
                  {pendingCount} Pending Registrations
                </div>
                <div className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
                  {openTickets} Open Tickets
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
          {/* Registrations */}
          {activeTab === "registrations" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="font-heading text-xl font-semibold text-foreground">Student Registrations</h2>
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search registrations..."
                    className="pl-10 w-64"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>

              <div className="glass-card overflow-hidden">
                <table className="w-full">
                  <thead className="bg-secondary">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-medium text-foreground">Student</th>
                      <th className="px-4 py-3 text-center text-sm font-medium text-foreground">Grade</th>
                      <th className="px-4 py-3 text-center text-sm font-medium text-foreground">Date</th>
                      <th className="px-4 py-3 text-center text-sm font-medium text-foreground">Documents</th>
                      <th className="px-4 py-3 text-center text-sm font-medium text-foreground">Payment</th>
                      <th className="px-4 py-3 text-center text-sm font-medium text-foreground">Status</th>
                      <th className="px-4 py-3 text-center text-sm font-medium text-foreground">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockRegistrations.map((reg, index) => (
                      <tr key={reg.id} className={index % 2 === 0 ? "bg-background" : "bg-secondary/30"}>
                        <td className="px-4 py-3 text-sm font-medium text-foreground">{reg.name}</td>
                        <td className="px-4 py-3 text-center text-sm text-muted-foreground">{reg.grade}</td>
                        <td className="px-4 py-3 text-center text-sm text-muted-foreground">{reg.date}</td>
                        <td className="px-4 py-3 text-center">
                          {reg.documents ? (
                            <CheckCircle className="w-5 h-5 text-primary mx-auto" />
                          ) : (
                            <XCircle className="w-5 h-5 text-destructive mx-auto" />
                          )}
                        </td>
                        <td className="px-4 py-3 text-center">
                          {reg.payment ? (
                            <CheckCircle className="w-5 h-5 text-primary mx-auto" />
                          ) : (
                            <Clock className="w-5 h-5 text-accent mx-auto" />
                          )}
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            reg.status === "approved" ? "bg-primary/10 text-primary" :
                            reg.status === "pending" ? "bg-accent/10 text-accent" :
                            "bg-destructive/10 text-destructive"
                          }`}>
                            {reg.status.charAt(0).toUpperCase() + reg.status.slice(1)}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-center">
                          {reg.status === "pending" && (
                            <div className="flex justify-center gap-2">
                              <Button variant="ghost" size="sm" title="View">
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button variant="ghost" size="sm" onClick={() => handleApprove(reg.id)} title="Approve">
                                <CheckCircle className="w-4 h-4 text-primary" />
                              </Button>
                              <Button variant="ghost" size="sm" onClick={() => handleReject(reg.id)} title="Reject">
                                <XCircle className="w-4 h-4 text-destructive" />
                              </Button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Support Tickets */}
          {activeTab === "tickets" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="font-heading text-xl font-semibold text-foreground">Support Tickets (OG Assist)</h2>
                <div className="flex gap-2">
                  <Button variant={true ? "default" : "outline"} size="sm">All</Button>
                  <Button variant="outline" size="sm">Open</Button>
                  <Button variant="outline" size="sm">Resolved</Button>
                </div>
              </div>

              <div className="space-y-4">
                {mockTickets.map((ticket) => (
                  <div key={ticket.id} className={`glass-card p-4 ${ticket.status === "open" ? "border-accent/30" : ""}`}>
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-mono text-sm text-primary">{ticket.id}</span>
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                            ticket.priority === "high" ? "bg-destructive/10 text-destructive" :
                            ticket.priority === "medium" ? "bg-accent/10 text-accent" :
                            "bg-secondary text-muted-foreground"
                          }`}>
                            {ticket.priority}
                          </span>
                        </div>
                        <h4 className="font-medium text-foreground">{ticket.issue}</h4>
                        <p className="text-sm text-muted-foreground">From: {ticket.student} • {ticket.date}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          ticket.status === "open" ? "bg-accent/10 text-accent" :
                          ticket.status === "in-progress" ? "bg-primary/10 text-primary" :
                          "bg-secondary text-muted-foreground"
                        }`}>
                          {ticket.status}
                        </span>
                        <Button variant="outline" size="sm">Respond</Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Timetables */}
          {activeTab === "timetables" && (
            <div className="max-w-2xl mx-auto space-y-6">
              <h2 className="font-heading text-xl font-semibold text-foreground">Upload School Timetables</h2>
              
              <div className="glass-card p-6 space-y-4">
                <div>
                  <label className="text-sm font-medium text-foreground">Select Grade</label>
                  <select className="w-full h-11 px-4 rounded-lg bg-secondary border border-input text-foreground mt-1">
                    <option value="all">All Grades</option>
                    <option value="8">Grade 8</option>
                    <option value="9">Grade 9</option>
                    <option value="10">Grade 10</option>
                    <option value="11">Grade 11</option>
                    <option value="12">Grade 12</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground">Timetable Type</label>
                  <select className="w-full h-11 px-4 rounded-lg bg-secondary border border-input text-foreground mt-1">
                    <option value="class">Class Timetable</option>
                    <option value="exam">Exam Timetable</option>
                    <option value="weekend">Weekend Classes</option>
                    <option value="events">School Events</option>
                  </select>
                </div>
                <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                  <Upload className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                  <p className="text-sm text-foreground mb-1">Upload Timetable File</p>
                  <p className="text-xs text-muted-foreground mb-3">PDF or Image (max 10MB)</p>
                  <Button variant="outline" size="sm">Browse Files</Button>
                </div>
                <Button className="w-full" onClick={() => toast({ title: "Timetable Published", description: "The timetable is now visible to students." })}>
                  <Upload className="w-4 h-4 mr-2" /> Publish Timetable
                </Button>
              </div>
            </div>
          )}

          {/* Communications */}
          {activeTab === "communications" && (
            <div className="max-w-2xl mx-auto space-y-6">
              <h2 className="font-heading text-xl font-semibold text-foreground">Send Email Notifications</h2>
              
              <div className="glass-card p-6 space-y-4">
                <div>
                  <label className="text-sm font-medium text-foreground">Recipients</label>
                  <select className="w-full h-11 px-4 rounded-lg bg-secondary border border-input text-foreground mt-1">
                    <option value="all">All Users</option>
                    <option value="students">All Students</option>
                    <option value="parents">All Parents</option>
                    <option value="teachers">All Teachers</option>
                    <option value="subscribed">Subscribed Users (R20/month)</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground">Subject</label>
                  <Input placeholder="Email subject line" />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground">Message</label>
                  <textarea
                    placeholder="Type your email message..."
                    className="w-full h-40 px-4 py-3 rounded-lg bg-secondary border border-input text-foreground resize-none focus:outline-none focus:ring-2 focus:ring-primary mt-1"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground">Attachments (optional)</label>
                  <div className="border-2 border-dashed border-border rounded-lg p-4 text-center mt-1">
                    <Button variant="outline" size="sm">Attach Files</Button>
                  </div>
                </div>
                <Button className="w-full" onClick={() => toast({ title: "Email Sent", description: "Your message has been sent to all selected recipients." })}>
                  <Send className="w-4 h-4 mr-2" /> Send Email
                </Button>
              </div>
            </div>
          )}

          {/* User Management */}
          {activeTab === "users" && (
            <div className="space-y-6">
              <h2 className="font-heading text-xl font-semibold text-foreground">User Management</h2>
              <div className="glass-card p-8 text-center">
                <Settings className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-heading text-lg font-semibold text-foreground mb-2">User Management System</h3>
                <p className="text-muted-foreground mb-4">Manage user accounts, reset passwords, and configure permissions.</p>
                <p className="text-sm text-accent">This feature requires backend connection with Lovable Cloud.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
