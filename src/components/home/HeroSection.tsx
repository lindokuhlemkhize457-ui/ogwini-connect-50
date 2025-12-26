import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Award, ArrowRight, BookOpen, Users, Calendar, Bot, ShoppingBag, FileText, Trophy, Target, Lightbulb, ChevronLeft, ChevronRight } from "lucide-react";

// School images
import schoolTrophy from "@/assets/school-trophy.jpg";
import schoolCooking from "@/assets/school-cooking-class.jpg";
import schoolStudents from "@/assets/school-students-cooking.jpg";
import schoolLab from "@/assets/school-science-lab.jpg";
import schoolSports from "@/assets/school-sports.jpg";
import schoolClassroom from "@/assets/school-classroom.jpg";

const heroImages = [
  { src: schoolLab, alt: "Science laboratory practical" },
  { src: schoolClassroom, alt: "Classroom learning" },
  { src: schoolSports, alt: "Sports activities" },
  { src: schoolCooking, alt: "Culinary arts class" },
  { src: schoolTrophy, alt: "School achievements" },
];

export function HeroSection() {
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const nextImage = () => setCurrentImage((prev) => (prev + 1) % heroImages.length);
  const prevImage = () => setCurrentImage((prev) => (prev - 1 + heroImages.length) % heroImages.length);

  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden">
      {/* Background Image Carousel */}
      <div className="absolute inset-0">
        {heroImages.map((image, index) => (
          <img
            key={index}
            src={image.src}
            alt={image.alt}
            className={`absolute w-full h-full object-cover transition-opacity duration-1000 ${
              index === currentImage ? "opacity-100" : "opacity-0"
            }`}
          />
        ))}
        <div className="absolute inset-0 hero-gradient" />
      </div>

      {/* Image Navigation */}
      <button
        onClick={prevImage}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-background/20 backdrop-blur-sm border border-border/30 flex items-center justify-center text-foreground hover:bg-background/40 transition-colors"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      <button
        onClick={nextImage}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-background/20 backdrop-blur-sm border border-border/30 flex items-center justify-center text-foreground hover:bg-background/40 transition-colors"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      {/* Image Indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {heroImages.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentImage(index)}
            className={`w-2 h-2 rounded-full transition-all ${
              index === currentImage ? "bg-primary w-6" : "bg-foreground/50"
            }`}
          />
        ))}
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
              className="relative group overflow-hidden rounded-xl aspect-square"
            >
              <img
                src={image.src}
                alt={image.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                <div>
                  <h4 className="font-heading font-semibold text-foreground">{image.title}</h4>
                  <p className="text-sm text-muted-foreground">{image.desc}</p>
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
