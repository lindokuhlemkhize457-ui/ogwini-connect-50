import { useState, useEffect } from "react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  User, Users, FileText, Calendar, Mail, Settings,
  CheckCircle, XCircle, Clock, Search, Upload, Send,
  Ticket, Eye, Download, Loader2, RefreshCw
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

interface Registration {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  grade: string | null;
  role: string;
  status: string;
  created_at: string;
  user_id: string | null;
  id_document_url: string | null;
  proof_of_address_url: string | null;
  payment_proof_url: string | null;
  id_number: string | null;
}

interface Profile {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  grade: string | null;
  user_id: string;
}

export default function AdminDashboard() {
  const { toast } = useToast();
  const { profile } = useAuth();
  const [activeTab, setActiveTab] = useState("registrations");
  const [searchQuery, setSearchQuery] = useState("");
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [allUsers, setAllUsers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // Email form state
  const [emailRecipients, setEmailRecipients] = useState("all");
  const [emailSubject, setEmailSubject] = useState("");
  const [emailBody, setEmailBody] = useState("");
  const [sendingEmail, setSendingEmail] = useState(false);

  const tabs = [
    { id: "registrations", label: "Registrations", icon: Users },
    { id: "users", label: "All Users", icon: User },
    { id: "timetables", label: "Timetables", icon: Calendar },
    { id: "communications", label: "Email System", icon: Mail },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  const fetchRegistrations = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('registrations')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching registrations:', error);
      toast({ title: "Error", description: "Failed to load registrations", variant: "destructive" });
    } else {
      setRegistrations(data || []);
    }
    setLoading(false);
  };

  const fetchAllUsers = async () => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching users:', error);
    } else {
      setAllUsers(data || []);
    }
  };

  useEffect(() => {
    fetchRegistrations();
    fetchAllUsers();
  }, []);

  const handleApprove = async (reg: Registration) => {
    setActionLoading(reg.id);
    try {
      // Update registration status
      const { error: regError } = await supabase
        .from('registrations')
        .update({ status: 'approved' })
        .eq('id', reg.id);

      if (regError) throw regError;

      // Create user role
      if (reg.user_id) {
        const { error: roleError } = await supabase
          .from('user_roles')
          .insert({ 
            user_id: reg.user_id, 
            role: reg.role as any 
          });

        if (roleError && !roleError.message.includes('duplicate')) {
          console.error('Role insert error:', roleError);
        }

        // Create profile
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            user_id: reg.user_id,
            first_name: reg.first_name,
            last_name: reg.last_name,
            email: reg.email,
            phone: reg.phone,
            grade: reg.grade,
            id_number: reg.id_number,
          });

        if (profileError && !profileError.message.includes('duplicate')) {
          console.error('Profile insert error:', profileError);
        }
      }

      toast({
        title: "Registration Approved",
        description: `${reg.first_name} ${reg.last_name} has been approved and can now access their dashboard.`,
      });
      
      fetchRegistrations();
    } catch (error) {
      console.error('Approval error:', error);
      toast({
        title: "Error",
        description: "Failed to approve registration",
        variant: "destructive",
      });
    }
    setActionLoading(null);
  };

  const handleReject = async (reg: Registration) => {
    setActionLoading(reg.id);
    try {
      const { error } = await supabase
        .from('registrations')
        .update({ status: 'rejected' })
        .eq('id', reg.id);

      if (error) throw error;

      toast({
        title: "Registration Rejected",
        description: `${reg.first_name} ${reg.last_name}'s registration has been rejected.`,
        variant: "destructive",
      });
      
      fetchRegistrations();
    } catch (error) {
      console.error('Rejection error:', error);
      toast({
        title: "Error",
        description: "Failed to reject registration",
        variant: "destructive",
      });
    }
    setActionLoading(null);
  };

  const handleSendEmail = async () => {
    if (!emailSubject.trim() || !emailBody.trim()) {
      toast({ title: "Missing Fields", description: "Please fill in subject and message", variant: "destructive" });
      return;
    }

    setSendingEmail(true);
    try {
      // Log the email to database
      const { error } = await supabase
        .from('email_logs')
        .insert({
          subject: emailSubject,
          body: emailBody,
          recipients: [emailRecipients],
          status: 'sent',
          sent_at: new Date().toISOString(),
        });

      if (error) throw error;

      toast({
        title: "Email Sent",
        description: `Your message has been sent to ${emailRecipients === 'all' ? 'all users' : emailRecipients}.`,
      });
      
      setEmailSubject("");
      setEmailBody("");
    } catch (error) {
      console.error('Email error:', error);
      toast({
        title: "Error",
        description: "Failed to send email",
        variant: "destructive",
      });
    }
    setSendingEmail(false);
  };

  const pendingCount = registrations.filter(r => r.status === "pending").length;
  const approvedCount = registrations.filter(r => r.status === "approved").length;

  const filteredRegistrations = registrations.filter(r => 
    r.first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.last_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Layout>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <div className="bg-gradient-to-r from-accent/20 to-primary/20 border-b border-border">
          <div className="container mx-auto px-4 py-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-accent flex items-center justify-center">
                <Settings className="w-8 h-8 text-accent-foreground" />
              </div>
              <div>
                <h1 className="font-heading text-2xl font-bold text-foreground">
                  {profile ? `${profile.first_name} ${profile.last_name}` : 'School Administrator'}
                </h1>
                <p className="text-muted-foreground">Admin Dashboard • Ogwini School</p>
              </div>
              <div className="ml-auto flex gap-2">
                <div className="px-4 py-2 rounded-full bg-accent text-accent-foreground text-sm font-bold">
                  {pendingCount} Pending
                </div>
                <div className="px-4 py-2 rounded-full bg-primary text-primary-foreground text-sm font-bold">
                  {approvedCount} Approved
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
              <div className="flex items-center justify-between flex-wrap gap-4">
                <h2 className="font-heading text-xl font-semibold text-foreground">Student & Staff Registrations</h2>
                <div className="flex items-center gap-3">
                  <Button variant="outline" size="sm" onClick={fetchRegistrations}>
                    <RefreshCw className="w-4 h-4 mr-2" /> Refresh
                  </Button>
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
              </div>

              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
              ) : (
                <div className="glass-card overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-secondary">
                        <tr>
                          <th className="px-4 py-3 text-left text-sm font-medium text-foreground">Name</th>
                          <th className="px-4 py-3 text-center text-sm font-medium text-foreground">Role</th>
                          <th className="px-4 py-3 text-center text-sm font-medium text-foreground">Grade</th>
                          <th className="px-4 py-3 text-center text-sm font-medium text-foreground">Date</th>
                          <th className="px-4 py-3 text-center text-sm font-medium text-foreground">Documents</th>
                          <th className="px-4 py-3 text-center text-sm font-medium text-foreground">Payment</th>
                          <th className="px-4 py-3 text-center text-sm font-medium text-foreground">Status</th>
                          <th className="px-4 py-3 text-center text-sm font-medium text-foreground">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredRegistrations.length === 0 ? (
                          <tr>
                            <td colSpan={8} className="px-4 py-8 text-center text-muted-foreground">
                              No registrations found
                            </td>
                          </tr>
                        ) : (
                          filteredRegistrations.map((reg, index) => (
                            <tr key={reg.id} className={index % 2 === 0 ? "bg-background" : "bg-secondary/30"}>
                              <td className="px-4 py-3">
                                <div>
                                  <p className="text-sm font-medium text-foreground">{reg.first_name} {reg.last_name}</p>
                                  <p className="text-xs text-muted-foreground">{reg.email}</p>
                                </div>
                              </td>
                              <td className="px-4 py-3 text-center">
                                <span className="px-2 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary capitalize">
                                  {reg.role.replace('_', ' ')}
                                </span>
                              </td>
                              <td className="px-4 py-3 text-center text-sm text-muted-foreground">{reg.grade || '-'}</td>
                              <td className="px-4 py-3 text-center text-sm text-muted-foreground">
                                {new Date(reg.created_at).toLocaleDateString()}
                              </td>
                              <td className="px-4 py-3 text-center">
                                {reg.id_document_url ? (
                                  <a href={reg.id_document_url} target="_blank" rel="noopener noreferrer">
                                    <CheckCircle className="w-5 h-5 text-primary mx-auto cursor-pointer hover:scale-110 transition-transform" />
                                  </a>
                                ) : (
                                  <XCircle className="w-5 h-5 text-muted-foreground mx-auto" />
                                )}
                              </td>
                              <td className="px-4 py-3 text-center">
                                {reg.payment_proof_url ? (
                                  <a href={reg.payment_proof_url} target="_blank" rel="noopener noreferrer">
                                    <CheckCircle className="w-5 h-5 text-primary mx-auto cursor-pointer hover:scale-110 transition-transform" />
                                  </a>
                                ) : (
                                  <Clock className="w-5 h-5 text-accent mx-auto" />
                                )}
                              </td>
                              <td className="px-4 py-3 text-center">
                                <span className={`px-2 py-1 rounded-full text-xs font-bold ${
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
                                    <Button 
                                      variant="ghost" 
                                      size="sm" 
                                      onClick={() => handleApprove(reg)} 
                                      disabled={actionLoading === reg.id}
                                      title="Approve"
                                    >
                                      {actionLoading === reg.id ? (
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                      ) : (
                                        <CheckCircle className="w-4 h-4 text-primary" />
                                      )}
                                    </Button>
                                    <Button 
                                      variant="ghost" 
                                      size="sm" 
                                      onClick={() => handleReject(reg)} 
                                      disabled={actionLoading === reg.id}
                                      title="Reject"
                                    >
                                      <XCircle className="w-4 h-4 text-destructive" />
                                    </Button>
                                  </div>
                                )}
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* All Users */}
          {activeTab === "users" && (
            <div className="space-y-6">
              <h2 className="font-heading text-xl font-semibold text-foreground">All Registered Users</h2>
              <div className="glass-card overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-secondary">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-medium text-foreground">Name</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-foreground">Email</th>
                        <th className="px-4 py-3 text-center text-sm font-medium text-foreground">Grade</th>
                        <th className="px-4 py-3 text-center text-sm font-medium text-foreground">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {allUsers.length === 0 ? (
                        <tr>
                          <td colSpan={4} className="px-4 py-8 text-center text-muted-foreground">
                            No users found
                          </td>
                        </tr>
                      ) : (
                        allUsers.map((user, index) => (
                          <tr key={user.id} className={index % 2 === 0 ? "bg-background" : "bg-secondary/30"}>
                            <td className="px-4 py-3 text-sm font-medium text-foreground">{user.first_name} {user.last_name}</td>
                            <td className="px-4 py-3 text-sm text-muted-foreground">{user.email}</td>
                            <td className="px-4 py-3 text-center text-sm text-muted-foreground">{user.grade || '-'}</td>
                            <td className="px-4 py-3 text-center">
                              <Button variant="ghost" size="sm">
                                <Eye className="w-4 h-4" />
                              </Button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
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
                  <select 
                    className="w-full h-11 px-4 rounded-lg bg-secondary border border-input text-foreground mt-1"
                    value={emailRecipients}
                    onChange={(e) => setEmailRecipients(e.target.value)}
                  >
                    <option value="all">All Users</option>
                    <option value="learners">All Learners</option>
                    <option value="parents">All Parents</option>
                    <option value="teachers">All Teachers</option>
                    <option value="grade_heads">Grade Heads</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground">Subject</label>
                  <Input 
                    placeholder="Email subject line" 
                    value={emailSubject}
                    onChange={(e) => setEmailSubject(e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground">Message</label>
                  <textarea
                    placeholder="Type your email message..."
                    className="w-full h-40 px-4 py-3 rounded-lg bg-secondary border border-input text-foreground resize-none focus:outline-none focus:ring-2 focus:ring-primary mt-1"
                    value={emailBody}
                    onChange={(e) => setEmailBody(e.target.value)}
                  />
                </div>
                <Button 
                  className="w-full" 
                  onClick={handleSendEmail}
                  disabled={sendingEmail}
                >
                  {sendingEmail ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4 mr-2" />
                  )}
                  Send Email
                </Button>
              </div>
            </div>
          )}

          {/* Settings */}
          {activeTab === "settings" && (
            <div className="space-y-6">
              <h2 className="font-heading text-xl font-semibold text-foreground">System Settings</h2>
              <div className="glass-card p-8 text-center">
                <Settings className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-heading text-lg font-semibold text-foreground mb-2">School Configuration</h3>
                <p className="text-muted-foreground mb-4">Manage academic years, terms, and system settings.</p>
                <div className="grid sm:grid-cols-2 gap-4 max-w-md mx-auto">
                  <Button variant="outline">Academic Year</Button>
                  <Button variant="outline">Term Settings</Button>
                  <Button variant="outline">Grade Structure</Button>
                  <Button variant="outline">Subject List</Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
