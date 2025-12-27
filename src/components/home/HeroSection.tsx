import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Award, ArrowRight, BookOpen, Users, Calendar, Bot, ShoppingBag, FileText, Trophy, Target, Lightbulb } from "lucide-react";

// School images
import schoolTrophy from "@/assets/school-trophy.jpg";
import schoolCooking from "@/assets/school-cooking-class.jpg";
import schoolStudents from "@/assets/school-students-cooking.jpg";
import schoolLab from "@/assets/school-science-lab.jpg";
import schoolSports from "@/assets/school-sports.jpg";
import schoolClassroom from "@/assets/school-classroom.jpg";

export function HeroSection() {
  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden">
      {/* Single Background Image */}
      <div className="absolute inset-0">
        <img
          src={schoolClassroom}
          alt="Ogwini Comprehensive Technical High School classroom"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 hero-gradient" />
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/20 border border-primary/30 text-primary-foreground mb-6 animate-fade-in backdrop-blur-sm">
            <Award className="w-4 h-4" />
            <span className="text-sm font-medium">Excellence in Technical Education</span>
          </div>

          <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-white mb-6 animate-slide-up drop-shadow-lg">
            Welcome to{" "}
            <span className="text-primary">Ogwini</span>
            <br />
            <span className="text-accent">Comprehensive</span>
            <br />
            Technical High School
          </h1>

          <p className="text-lg sm:text-xl text-white/90 mb-8 max-w-2xl animate-slide-up stagger-1 drop-shadow">
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

export function SchoolGallery() {
  const images = [
    { src: schoolTrophy, title: "Achievements", desc: "Celebrating excellence" },
    { src: schoolCooking, title: "Culinary Arts", desc: "Hands-on learning" },
    { src: schoolStudents, title: "Practical Skills", desc: "Technical training" },
    { src: schoolLab, title: "Science Lab", desc: "Discovery & innovation" },
    { src: schoolSports, title: "Sports", desc: "Physical education" },
    { src: schoolClassroom, title: "Classroom", desc: "Interactive learning" },
  ];

  return (
    <section className="py-16 lg:py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="font-heading text-3xl lg:text-4xl font-bold text-foreground mb-4">
            Life at <span className="text-primary">Ogwini</span>
          </h2>
          <p className="text-muted-foreground">
            Explore our vibrant school community through various activities and programs.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {images.map((image, index) => (
            <div
              key={index}
              className="relative group overflow-hidden rounded-xl aspect-square shadow-lg"
            >
              <img
                src={image.src}
                alt={image.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/90 via-foreground/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                <div>
                  <h4 className="font-heading font-semibold text-white">{image.title}</h4>
                  <p className="text-sm text-white/80">{image.desc}</p>
                </div>
              </div>
            </div>
          ))}
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
      description: "Register online with document uploads and instant grade capacity check.",
    },
    {
      icon: Calendar,
      title: "School Calendar",
      description: "View timetables, weekend classes, and important school dates.",
    },
    {
      icon: Bot,
      title: "OG Assist",
      description: "AI-powered study assistant and support ticket system for learner queries.",
    },
    {
      icon: ShoppingBag,
      title: "School Merchandise",
      description: "Purchase official school merchandise with secure EFT payment.",
    },
    {
      icon: FileText,
      title: "Results Portal",
      description: "Access academic results, download reports, and update your profile.",
    },
  ];

  return (
    <section className="py-20 lg:py-28 bg-secondary/30">
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
              className="bg-card border border-border rounded-xl p-6 hover:border-primary/50 hover:shadow-lg transition-all duration-300 group"
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
    <section className="py-16 lg:py-20 bg-primary text-primary-foreground">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center mx-auto mb-4">
                <stat.icon className="w-7 h-7 text-white" />
              </div>
              <p className="font-heading text-3xl lg:text-4xl font-bold text-white mb-1">
                {stat.value}
              </p>
              <p className="text-white/80 text-sm">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function CTASection() {
  return (
    <section className="py-20 lg:py-28 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center bg-card border border-border rounded-2xl p-8 lg:p-12 shadow-lg">
          <h2 className="font-heading text-3xl lg:text-4xl font-bold text-foreground mb-4">
            Ready to Join Our Community?
          </h2>
          <p className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto">
            Start your journey towards academic excellence and technical skills. Apply now for the upcoming academic year.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button size="lg" asChild>
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
