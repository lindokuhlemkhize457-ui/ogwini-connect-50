import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { BookOpen, FileText, Calendar, Download, Clock, Search, GraduationCap, Calculator, FlaskConical, Globe, Cpu, Wrench } from "lucide-react";

const subjects = [
  { name: "Mathematics", icon: Calculator },
  { name: "Physical Science", icon: FlaskConical },
  { name: "Life Sciences", icon: Globe },
  { name: "Technical Drawing", icon: Cpu },
  { name: "Electrical Technology", icon: Wrench },
  { name: "Engineering Graphics", icon: FileText },
];

const pastPapers = [
  { subject: "Mathematics", grade: "Grade 12", year: "2024", type: "November Exam" },
  { subject: "Physical Science", grade: "Grade 12", year: "2024", type: "November Exam" },
  { subject: "Mathematics", grade: "Grade 11", year: "2024", type: "November Exam" },
  { subject: "Technical Drawing", grade: "Grade 12", year: "2024", type: "November Exam" },
  { subject: "Mathematics", grade: "Grade 12", year: "2023", type: "November Exam" },
  { subject: "Life Sciences", grade: "Grade 12", year: "2023", type: "November Exam" },
];

const timetables = [
  { title: "Grade 8 Timetable", term: "Term 1 2025" },
  { title: "Grade 9 Timetable", term: "Term 1 2025" },
  { title: "Grade 10 Timetable", term: "Term 1 2025" },
  { title: "Grade 11 Timetable", term: "Term 1 2025" },
  { title: "Grade 12 Timetable", term: "Term 1 2025" },
  { title: "Exam Timetable", term: "June 2025" },
];

export default function AcademicsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<"papers" | "timetables">("papers");

  const filteredPapers = pastPapers.filter(
    (paper) =>
      paper.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      paper.grade.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Layout>
      {/* Header */}
      <section className="py-16 lg:py-20 bg-card">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <span className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
              Academic Resources
            </span>
            <h1 className="font-heading text-4xl lg:text-5xl font-bold text-foreground mb-4">
              Learn & <span className="text-primary">Excel</span>
            </h1>
            <p className="text-muted-foreground">
              Access past exam papers, timetables, and educational resources to help you succeed in your studies.
            </p>
          </div>
        </div>
      </section>

      {/* Subjects */}
      <section className="py-12 lg:py-16 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="font-heading text-2xl font-bold text-foreground mb-6">Our Subjects</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {subjects.map((subject) => (
              <div key={subject.name} className="glass-card p-4 text-center hover:border-primary/50 transition-colors">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-3">
                  <subject.icon className="w-6 h-6 text-primary" />
                </div>
                <p className="text-sm font-medium text-foreground">{subject.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tabs */}
      <section className="py-12 lg:py-16 bg-card" id="past-papers">
        <div className="container mx-auto px-4">
          {/* Tab Headers */}
          <div className="flex gap-4 mb-8">
            <button
              onClick={() => setActiveTab("papers")}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${
                activeTab === "papers"
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-muted-foreground hover:text-foreground"
              }`}
            >
              <FileText className="w-4 h-4" />
              Past Papers
            </button>
            <button
              onClick={() => setActiveTab("timetables")}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${
                activeTab === "timetables"
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-muted-foreground hover:text-foreground"
              }`}
            >
              <Calendar className="w-4 h-4" />
              Timetables
            </button>
          </div>

          {activeTab === "papers" && (
            <>
              {/* Search */}
              <div className="relative max-w-md mb-6">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search by subject or grade..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full h-11 pl-11 pr-4 rounded-xl bg-secondary border border-input text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              {/* Papers Grid */}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredPapers.map((paper, index) => (
                  <div key={index} className="glass-card p-5 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <FileText className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{paper.subject}</p>
                        <p className="text-sm text-muted-foreground">
                          {paper.grade} • {paper.year}
                        </p>
                      </div>
                    </div>
                    <Button size="sm" variant="ghost">
                      <Download className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </>
          )}

          {activeTab === "timetables" && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4" id="timetables">
              {timetables.map((timetable, index) => (
                <div key={index} className="glass-card p-5 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                      <Calendar className="w-5 h-5 text-accent" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{timetable.title}</p>
                      <p className="text-sm text-muted-foreground">{timetable.term}</p>
                    </div>
                  </div>
                  <Button size="sm" variant="ghost">
                    <Download className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Info Banner */}
      <section className="py-12 lg:py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="glass-card p-8 flex flex-col lg:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center">
                <GraduationCap className="w-7 h-7 text-primary" />
              </div>
              <div>
                <h3 className="font-heading font-semibold text-lg text-foreground">Need Help with Your Studies?</h3>
                <p className="text-muted-foreground text-sm">Use OG Assist for personalized study tips and educational videos.</p>
              </div>
            </div>
            <Button>Open OG Assist</Button>
          </div>
        </div>
      </section>
    </Layout>
  );
}
