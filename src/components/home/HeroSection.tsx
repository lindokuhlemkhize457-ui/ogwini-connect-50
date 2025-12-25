import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Award, ArrowRight, BookOpen, Users, Calendar, Clock, FileText, ShoppingBag, Bot, Trophy, Target, Lightbulb } from "lucide-react";
import heroImage from "@/assets/hero-students.jpg";

export function HeroSection() {
  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="Ogwini students celebrating"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 hero-gradient" />
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/20 border border-primary/30 text-primary mb-6 animate-fade-in">
            <Award className="w-4 h-4" />
            <span className="text-sm font-medium">Excellence in Technical Education</span>
          </div>

          <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-foreground mb-6 animate-slide-up">
            Welcome to{" "}
            <span className="text-primary">Ogwini</span>
            <br />
            <span className="text-accent">Comprehensive</span>
            <br />
            Technical High School
          </h1>

          <p className="text-lg sm:text-xl text-muted-foreground mb-8 max-w-2xl animate-slide-up stagger-1">
            Empowering learners with practical skills, academic excellence, and character development. Building tomorrow's leaders through quality technical education.
          </p>

          <div className="flex flex-wrap gap-4 animate-slide-up stagger-2">
            <Button variant="hero" size="xl" asChild>
              <Link to="/registration" className="flex items-center gap-2">
                Apply Now
                <ArrowRight className="w-5 h-5" />
              </Link>
            </Button>
            <Button variant="heroOutline" size="xl" asChild>
              <Link to="/about">Learn More</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

export function FeaturesSection() {
  const features = [
    {
      icon: BookOpen,
      title: "Digital Learning",
      description: "Access notes, past papers, and timetables online anytime, anywhere.",
    },
    {
      icon: Users,
      title: "Easy Registration",
      description: "Register online and get instant class placement notifications.",
    },
    {
      icon: Calendar,
      title: "Parent Meetings",
      description: "Stay informed about school meetings with automated reminders.",
    },
    {
      icon: Bot,
      title: "OG Assist",
      description: "AI-powered study assistant with educational resources and YouTube links.",
    },
    {
      icon: ShoppingBag,
      title: "School Merchandise",
      description: "Purchase official school merchandise online with easy payment.",
    },
    {
      icon: FileText,
      title: "Results Portal",
      description: "Access academic results and progress reports securely online.",
    },
  ];

  return (
    <section className="py-20 lg:py-28 bg-card">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-12 lg:mb-16">
          <h2 className="font-heading text-3xl lg:text-4xl font-bold text-foreground mb-4">
            Why Choose <span className="text-primary">Ogwini</span>?
          </h2>
          <p className="text-muted-foreground">
            Our digital platform saves time, reduces costs, and enhances communication between students, parents, and teachers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="glass-card p-6 hover:border-primary/50 transition-all duration-300 group"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <feature.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-heading font-semibold text-lg text-foreground mb-2">
                {feature.title}
              </h3>
              <p className="text-muted-foreground text-sm">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function StatsSection() {
  const stats = [
    { icon: Users, value: "1,500+", label: "Students" },
    { icon: Trophy, value: "95%", label: "Pass Rate" },
    { icon: Target, value: "50+", label: "Years of Excellence" },
    { icon: Lightbulb, value: "20+", label: "Technical Programs" },
  ];

  return (
    <section className="py-16 lg:py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <stat.icon className="w-7 h-7 text-primary" />
              </div>
              <p className="font-heading text-3xl lg:text-4xl font-bold text-foreground mb-1">
                {stat.value}
              </p>
              <p className="text-muted-foreground text-sm">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function CTASection() {
  return (
    <section className="py-20 lg:py-28 bg-primary/5 border-y border-primary/20">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-heading text-3xl lg:text-4xl font-bold text-foreground mb-4">
            Ready to Join Our Community?
          </h2>
          <p className="text-muted-foreground text-lg mb-8">
            Start your journey towards academic excellence and technical skills. Apply now for the upcoming academic year.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button variant="hero" size="lg" asChild>
              <Link to="/registration">Start Registration</Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link to="/about">Explore Our School</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
