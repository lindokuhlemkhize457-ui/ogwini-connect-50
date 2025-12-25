import { Layout } from "@/components/layout/Layout";
import { Award, Target, Eye, History, Users, Lightbulb } from "lucide-react";

const values = [
  { icon: Award, title: "Excellence", description: "Striving for the highest standards in all we do." },
  { icon: Target, title: "Integrity", description: "Acting with honesty and strong moral principles." },
  { icon: Users, title: "Respect", description: "Valuing diversity and treating everyone with dignity." },
  { icon: Lightbulb, title: "Innovation", description: "Embracing new ideas and creative solutions." },
];

const timeline = [
  { year: "1970", title: "School Founded", description: "Ogwini Comprehensive Technical High School was established to serve the community." },
  { year: "1985", title: "Technical Wing Added", description: "Expanded facilities to include technical and vocational training programs." },
  { year: "2000", title: "Modernization", description: "Major upgrades to laboratories and computer facilities." },
  { year: "2015", title: "Excellence Award", description: "Recognized as one of the top technical schools in KwaZulu-Natal." },
  { year: "2024", title: "Digital Transformation", description: "Launched comprehensive digital learning platform for students and parents." },
];

export default function AboutPage() {
  return (
    <Layout>
      {/* Hero */}
      <section className="py-20 lg:py-28 bg-card">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <span className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
              About Us
            </span>
            <h1 className="font-heading text-4xl lg:text-5xl font-bold text-foreground mb-6">
              Building Tomorrow's <span className="text-primary">Leaders</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              For over 50 years, Ogwini Comprehensive Technical High School has been at the forefront of technical education, empowering learners with practical skills and academic excellence.
            </p>
          </div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="py-16 lg:py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="glass-card p-8">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                <Eye className="w-6 h-6 text-primary" />
              </div>
              <h2 className="font-heading text-2xl font-bold text-foreground mb-4">Our Vision</h2>
              <p className="text-muted-foreground">
                To be a leading institution in technical education, producing skilled, innovative, and responsible citizens who contribute positively to society and drive economic development in South Africa.
              </p>
            </div>
            <div className="glass-card p-8">
              <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mb-4">
                <Target className="w-6 h-6 text-accent" />
              </div>
              <h2 className="font-heading text-2xl font-bold text-foreground mb-4">Our Mission</h2>
              <p className="text-muted-foreground">
                To provide quality technical and academic education that equips learners with the knowledge, skills, and values necessary to succeed in a rapidly changing world while fostering a culture of lifelong learning.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 lg:py-20 bg-card">
        <div className="container mx-auto px-4">
          <h2 className="font-heading text-3xl font-bold text-foreground text-center mb-12">Our Core Values</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value) => (
              <div key={value.title} className="text-center">
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <value.icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="font-heading font-semibold text-foreground mb-2">{value.title}</h3>
                <p className="text-sm text-muted-foreground">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-16 lg:py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-3 justify-center mb-12">
            <History className="w-8 h-8 text-primary" />
            <h2 className="font-heading text-3xl font-bold text-foreground">Our History</h2>
          </div>
          <div className="max-w-3xl mx-auto">
            {timeline.map((item, index) => (
              <div key={item.year} className="flex gap-6 pb-8 last:pb-0">
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-sm">
                    {item.year.slice(-2)}
                  </div>
                  {index < timeline.length - 1 && (
                    <div className="w-0.5 flex-1 bg-border mt-2" />
                  )}
                </div>
                <div className="pb-8">
                  <span className="text-sm text-primary font-medium">{item.year}</span>
                  <h3 className="font-heading font-semibold text-foreground mt-1">{item.title}</h3>
                  <p className="text-muted-foreground text-sm mt-1">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
}
