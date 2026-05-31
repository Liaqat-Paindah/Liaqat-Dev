"use client";

import { useState, useEffect, useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
} from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  Mail,
  MapPin,
  Calendar,
  Briefcase,
  Code2,
  Server,
  Database,
  Cloud,
  Shield,
  GitBranch,
  Award,
  Users,
  Rocket,
  CheckCircle,
  TrendingUp,
  Zap,
  Clock,
  Layers,
  Microscope,
  Sparkles,
  Download,
  ExternalLink,
  Star,
  Heart,
  Globe,
  Smartphone,
  Monitor,
  Cpu,
  Network,
  Lock,
  BarChart3,
  Activity,
  Target,
  Eye,
  FolderGit2,
  Coffee,
  Brain,
  Boxes,
  Workflow,
  Timer,
  Terminal,
  Hexagon,
  Orbit,
  DollarSignIcon,
  Building2,
  GraduationCapIcon,
  ChevronRight,
} from "lucide-react";

// Professional color scheme - Nexus inspired
const colors = {
  primary: "#3b82f6",
  primaryDark: "#2563eb",
  secondary: "#8b5cf6",
  accent: "#06b6d4",
  dark: "#0f172a",
  darker: "#020617",
  slate: "#1e293b",
  slateLight: "#334155",
  text: "#f1f5f9",
  textMuted: "#94a3b8",
  glow: "rgba(59, 130, 246, 0.4)",
};

// Professional animation variants - smooth and elegant
const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] },
};

const fadeInLeft = {
  initial: { opacity: 0, x: -40 },
  animate: { opacity: 1, x: 0 },
  transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] },
};

const fadeInRight = {
  initial: { opacity: 0, x: 40 },
  animate: { opacity: 1, x: 0 },
  transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] },
};

const staggerContainer = {
  animate: { transition: { staggerChildren: 0.08 } },
};

const scaleOnHover = {
  whileHover: { scale: 1.02, transition: { duration: 0.2, ease: "easeOut" } },
};

const floatAnimation = {
  animate: {
    y: [0, -8, 0],
    transition: { duration: 4, repeat: Infinity, ease: "easeInOut" },
  },
};

// Enhanced project data with images and more details
const projectsData = [
  {
    name: "Kimia Omran",
    url: "https://kimiaomran.com",
    description: "Engineering Management System",
    fullDescription:
      "Comprehensive platform for managing engineering projects, resources, and team collaboration with real-time analytics.",
    image:
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=500&fit=crop",
    logo: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=100&h=100&fit=crop",
    category: "Enterprise",
    features: [
      "Project tracking with Gantt charts",
      "Resource allocation & capacity planning",
      "Task management & time tracking",
      "Real-time reporting dashboard",
      "Team collaboration tools",
      "Budget & cost management",
    ],
    technologies: ["React", "Node.js", "PostgreSQL", "D3.js", "Redis"],

    color: "from-blue-600/20 to-cyan-600/20",
    badgeColor: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  },
  {
    name: "HRS MgtWell",
    url: "https://www.hrs.mgtwell.com",
    description: "HR Management System",
    fullDescription:
      "All-in-one HRIS platform for employee management, payroll integration, and performance analytics with AI-powered insights.",
    image:
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=500&fit=crop",
    logo: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=100&h=100&fit=crop",
    category: "HR Tech",
    features: [
      "Employee lifecycle management",
      "Leave & attendance tracking",
      "Payroll integration",
      "Performance review system",
      "Recruitment pipeline",
      "Analytics & reporting",
    ],
    technologies: ["Laravel", "Vue.js", "MySQL", "Redis", "Tailwind"],

    color: "from-purple-600/20 to-pink-600/20",
    badgeColor: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  },
  {
    name: "Ayandaha",
    url: "https://ayandaha.com",
    description: "Educational Consulting System",
    fullDescription:
      "Next-generation educational platform connecting students with consultants, universities, and career opportunities.",
    image:
      "https://images.unsplash.com/photo-1513258496099-48168024aec0?w=800&h=500&fit=crop",
    logo: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=100&h=100&fit=crop",
    category: "EdTech",
    features: [
      "Student profiles & portfolios",
      "Course & university matching",
      "Consultation booking system",
      "Progress tracking & analytics",
      "Document management",
      "Scholarship finder",
    ],
    technologies: ["Next.js", "TypeScript", "MongoDB", "Supabase", "Stripe"],

    color: "from-green-600/20 to-emerald-600/20",
    badgeColor: "bg-green-500/20 text-green-400 border-green-500/30",
  },
  {
    name: "HRS Ardho",
    url: "https://hrs.ardho.org",
    description: "HRMIS Platform",
    fullDescription:
      "Enterprise-grade multi-tenant HRIS platform with role-based access, advanced analytics, and automated workflows.",
    image:
      "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&h=500&fit=crop",
    logo: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=100&h=100&fit=crop",
    category: "Enterprise",
    features: [
      "Multi-tenant architecture",
      "Role-based access control",
      "Advanced analytics dashboard",
      "Automated report generation",
      "Workflow automation",
      "Integration APIs",
    ],
    technologies: ["Node.js", "React", "PostgreSQL", "Docker", "AWS"],

    color: "from-orange-600/20 to-red-600/20",
    badgeColor: "bg-orange-500/20 text-orange-400 border-orange-500/30",
  },
];

// Helper component for Building icon (not imported)
const Building = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M3 21h18M5 21V7a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v14M9 21V11h6v10" />
    <path d="M9 7h6v2H9z" />
  </svg>
);
const DollarSign = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M12 2v20M17 7H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
  </svg>
);
const GraduationCap = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
    <path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5" />
  </svg>
);

export default function HomePage() {
  const { scrollYProgress } = useScroll();
  const [activeSection, setActiveSection] = useState("hero");
  const [hoveredProject, setHoveredProject] = useState<number | null>(null);
  const [currentYear, setCurrentYear] = useState<number | null>(null);
  const [typedText, setTypedText] = useState("");
  const heroRef = useRef(null);
  const skillsRef = useRef(null);
  const experienceRef = useRef(null);
  const projectsRef = useRef(null);

  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0.8]);
  const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.95]);

  // Typing animation effect
  useEffect(() => {
    const fullText = "Senior Full Stack Developer";
    let index = 0;
    const timer = setInterval(() => {
      if (index <= fullText.length) {
        setTypedText(fullText.slice(0, index));
        index++;
      } else {
        clearInterval(timer);
      }
    }, 80);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const sections = ["hero", "skills", "experience", "projects"];
    const observers = sections.map((section) => {
      const ref = {
        hero: heroRef,
        skills: skillsRef,
        experience: experienceRef,
        projects: projectsRef,
      }[section];
      if (ref?.current) {
        const observer = new IntersectionObserver(
          ([entry]) => {
            if (entry.isIntersecting) setActiveSection(section);
          },
          { threshold: 0.3 },
        );
        observer.observe(ref.current);
        return observer;
      }
      return null;
    });
    return () => observers.forEach((observer) => observer?.disconnect());
  }, []);

  useEffect(() => {
    setCurrentYear(new Date().getFullYear());
  }, []);

  // Skills data from CV
  const skills = {
    frontend: {
      icon: Monitor,
      title: "Frontend",
      items: [
        "React.js",
        "Next.js",
        "Vue.js",
        "TypeScript",
        "Tailwind CSS",
        "Bootstrap",
        "Chart.js",
        "D3.js",
      ],
    },
    backend: {
      icon: Server,
      title: "Backend",
      items: [
        "Node.js",
        "Express.js",
        "Laravel",
        "PHP",
        "REST APIs",
        "Microservices",
        "Event-Driven Architecture",
      ],
    },
    database: {
      icon: Database,
      title: "Database",
      items: [
        "PostgreSQL",
        "MySQL",
        "MongoDB",
        "Redis",
        "Supabase",
        "Query Optimization",
        "Indexing",
      ],
    },
    devops: {
      icon: Cloud,
      title: "DevOps & Tools",
      items: [
        "Docker",
        "Kubernetes",
        "Nginx",
        "GitHub Actions",
        "CI/CD",
        "DigitalOcean",
        "AWS ECS",
      ],
    },
    security: {
      icon: Shield,
      title: "Security",
      items: [
        "JWT",
        "OAuth2",
        "RBAC",
        "Row Level Security",
        "XSS/CSRF Protection",
        "SQL Injection Prevention",
      ],
    },
    tools: {
      icon: GitBranch,
      title: "Development Tools",
      items: [
        "Git",
        "Postman",
        "Agile Development",
        "Performance Monitoring",
        "System Design",
      ],
    },
  };

  const experiences = [
    {
      company: "Allneeda.com",
      location: "Remote USA",
      period: "May 2025 – Feb 2026",
      role: "Full Stack Engineer",
      achievements: [
        "Architected scalable web apps using Next.js 15+ with App Router, achieving Core Web Vitals >95%",
        "Engineered high-performance RESTful APIs with JWT, OAuth2, and RBAC for multi-tenant security",
        "Integrated Supabase real-time subscriptions with WebSockets for live dashboards",
        "Developed geospatial systems using Google Maps APIs for radius-based search and polygon filtering",
        "Secured applications against XSS, CSRF, SQL injection - zero critical vulnerabilities",
      ],
      technologies: [
        "Next.js",
        "React",
        "Node.js",
        "Supabase",
        "Google Maps API",
        "Chart.js",
      ],
    },
    {
      company: "MgtWell Consulting Services",
      location: "Kabul, Afghanistan",
      period: "Feb 2023 – Present",
      role: "Software Developer",
      achievements: [
        "Designed interactive web apps using React and Laravel with scalable interfaces",
        "Implemented API integrations, authentication, and payment gateways",
        "Developed Google Maps features for location-based services on Android/iOS",
        "Led testing, QA, and mentoring junior developers",
      ],
      technologies: [
        "React",
        "Laravel",
        "PHP",
        "Google APIs",
        "Payment Gateways",
      ],
    },
    {
      company: "ARDHO",
      location: "Kabul, Afghanistan",
      period: "May 2024 – Dec 2024",
      role: "System Developer",
      achievements: [
        "Designed microservices with Laravel/Node.js using Event-Driven Architecture with Redis",
        "Integrated Clerk (MFA), Stripe payments, and Uploadthing with AWS S3",
        "Orchestrated Docker deployments on AWS ECS Fargate with blue-green deployment",
        "Optimized SSR with Next.js/Nuxt.js using CDN caching via Cloudflare",
      ],
      technologies: [
        "Laravel",
        "Node.js",
        "Redis",
        "Docker",
        "AWS ECS",
        "Stripe",
      ],
    },
    {
      company: "Gulnegar Co.",
      location: "Kabul, Afghanistan",
      period: "Sep 2021 – Dec 2022",
      role: "Full Stack Developer",
      achievements: [
        "Developed SPAs and SSR with Vue 3 and Next.js using Webpack module federation",
        "Built modular APIs with Laravel and Node.js using Repository pattern",
        "Integrated Resend emails, Twilio SMS/OTP, and Stripe Connect",
        "Optimized frontend performance with Core Web Vitals monitoring",
      ],
      technologies: [
        "Vue 3",
        "Next.js",
        "Laravel",
        "Node.js",
        "Stripe Connect",
        "Twilio",
      ],
    },
    {
      company: "Tawangaran Co.",
      location: "Kabul, Afghanistan",
      period: "Jul 2017 – Jul 2020",
      role: "Full Stack Developer",
      achievements: [
        "Designed RESTful APIs for system integration",
        "Developed responsive UIs with HTML5, CSS3, JavaScript, Tailwind",
        "Enhanced performance through code splitting and lazy loading",
        "Implemented security best practices (SQL injection, XSS, HTTPS)",
      ],
      technologies: [
        "HTML5",
        "CSS3",
        "JavaScript",
        "Tailwind CSS",
        "REST APIs",
      ],
    },
  ];

  const stats = [
    { label: "Years Experience", value: "6+", icon: Timer },
    { label: "Projects Delivered", value: "14+", icon: FolderGit2 },
    { label: "Technologies", value: "30+", icon: Cpu },
    { label: "Happy Clients", value: "12+", icon: Users },
  ];

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-950 via-slate-900 to-slate-950 overflow-x-hidden">
      {/* Animated Grid Background */}
      <div className="fixed inset-0 z-0 opacity-20 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-linear(to_right,#4f4f4f2e_1px,transparent_1px),linear-linear(to_bottom,#4f4f4f2e_1px,transparent_1px)]bg-size-[50px_50px]" />
        <motion.div
          animate={{ x: [0, 100, 0], y: [0, 50, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-0 -left-40 w-80 h-80 bg-blue-500/30 rounded-full blur-[100px]"
        />
        <motion.div
          animate={{ x: [0, -100, 0], y: [0, -50, 0] }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-0 -right-40 w-80 h-80 bg-purple-500/30 rounded-full blur-[100px]"
        />
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-120 h-120 bg-cyan-500/10 rounded-full blur-[120px]"
        />
      </div>

      {/* Hero Section */}
      <section
        ref={heroRef}
        className="relative min-h-screen flex items-center justify-center px-4 z-10"
      >
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
            className="absolute top-20 left-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl"
          />
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
            className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"
          />
        </div>
        <motion.div
          style={{ opacity, scale }}
          className="relative z-10 max-w-6xl mx-auto text-center"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-linear-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 mb-6 backdrop-blur-sm"
          >
            <Sparkles className="h-3.5 w-3.5 text-blue-400 animate-pulse" />
            <span className="text-xs text-blue-400 font-medium">
              Available for opportunities
            </span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-4 bg-linear-to-r from-white via-blue-400 to-purple-400 bg-clip-text text-transparent"
          >
            Liaqat Paindah
          </motion.h1>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-xl sm:text-2xl text-slate-300 mb-6"
          >
            <span className="border-r-2 border-blue-400 pr-1">{typedText}</span>
            <span className="animate-pulse">|</span>
          </motion.div>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-slate-400 max-w-2xl mx-auto mb-8"
          >
            6+ years of experience designing, architecting, and delivering
            scalable, high-performance web applications with modern JavaScript
            frameworks and cloud-native architectures.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-wrap items-center justify-center gap-3 mb-8"
          >
            <Link
              href="/contact"
              className="group inline-flex items-center gap-2 px-5 py-2.5 bg-linear-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-sm hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300"
            >
              Get In Touch{" "}
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="cv.pdf"
              download
              className="inline-flex items-center gap-2 px-5 py-2.5 border border-slate-600 text-slate-300 font-medium rounded-sm hover:bg-slate-800/50 hover:border-blue-500/50 transition-all duration-300"
            >
              <Download className="h-4 w-4" /> Download CV
            </Link>
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="flex flex-wrap items-center justify-center gap-4 text-slate-400 text-sm"
          >
            <span className="flex items-center gap-1.5">
              <Mail className="h-3.5 w-3.5" /> liaqat.paindah@gmail.com
            </span>
          </motion.div>
        </motion.div>
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <div className="w-6 h-10 rounded-full border-2 border-slate-600 flex justify-center">
            <div className="w-1 h-2 bg-blue-400 rounded-full mt-2 animate-bounce" />
          </div>
        </motion.div>
      </section>

      {/* Stats Section */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="py-12 border-y border-slate-800 bg-slate-900/30 z-10 relative"
      >
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {stats.map((stat, idx) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{
                  delay: idx * 0.1,
                  duration: 0.5,
                  type: "spring",
                  stiffness: 200,
                }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
                className="text-center"
              >
                <stat.icon className="h-8 w-8 text-blue-400 mx-auto mb-2" />
                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ delay: idx * 0.1 + 0.2 }}
                  className="text-2xl font-bold text-white"
                >
                  {stat.value}
                </motion.div>
                <div className="text-xs text-slate-400">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Advanced Projects Section - Nexus Inspired */}
      <section ref={projectsRef} className="py-20 px-4 z-10 relative">
        <div className="container mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 mb-4">
              <Rocket className="h-3.5 w-3.5 text-blue-400" />
              <span className="text-xs text-blue-400 font-medium">
                Featured Work
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-linear-to-r from-white to-slate-400 bg-clip-text text-transparent">
              Flagship Projects
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              Enterprise-grade applications that push the boundaries of modern
              web development
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 px-8">
            {projectsData.map((project, idx) => (
              <motion.div
                key={project.name}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{
                  delay: idx * 0.15,
                  duration: 0.6,
                  type: "spring",
                  stiffness: 100,
                }}
                viewport={{ once: true, margin: "-100px" }}
                onHoverStart={() => setHoveredProject(idx)}
                onHoverEnd={() => setHoveredProject(null)}
                className="group relative"
              >
                {/* Glow effect on hover */}
                <motion.div
                  animate={{ opacity: hoveredProject === idx ? 1 : 0 }}
                  transition={{ duration: 0.3 }}
                  className={`absolute -inset-0.5 bg-linear-to-r ${project.color} rounded-sm blur-xl`}
                />

                <motion.div
                  whileHover={{ y: -4 }}
                  transition={{ duration: 0.2 }}
                  className="relative bg-slate-900/80 backdrop-blur-sm border border-slate-700/50 rounded-sm overflow-hidden hover:border-slate-600/50 transition-all duration-500"
                >
                  {/* Project Image with Overlay */}
                  <div className="relative h-56 md:h-64 overflow-hidden">
                    <Image
                      src={project.image}
                      alt={project.name}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-slate-950 via-slate-950/60 to-transparent" />
                    <div className="absolute top-4 left-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium backdrop-blur-sm ${project.badgeColor} border`}
                      >
                        <Orbit className="h-3 w-3" />
                        {project.category}
                      </span>
                    </div>
                    <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <Link
                        href={project.url}
                        target="_blank"
                        className="p-2 bg-slate-800/80 backdrop-blur rounded-full hover:bg-slate-700 transition-colors"
                      >
                        <ExternalLink className="h-4 w-4 text-white" />
                      </Link>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors">
                          {project.name}
                        </h3>
                        <p className="text-sm text-slate-400">
                          {project.description}
                        </p>
                      </div>
                      <div className="w-10 h-10 rounded-sm bg-slate-800/50 border border-slate-700 flex items-center justify-center overflow-hidden">
                        <Image
                          src={project.logo}
                          alt={`${project.name} logo`}
                          width={32}
                          height={32}
                          className="rounded-sm"
                        />
                      </div>
                    </div>

                    <p className="text-slate-300 text-sm mb-4 line-clamp-2">
                      {project.fullDescription}
                    </p>
                    {/* Features List */}
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {project.features.slice(0, 4).map((feature, i) => (
                        <motion.span
                          key={feature}
                          initial={{ opacity: 0, scale: 0.8 }}
                          whileInView={{ opacity: 1, scale: 1 }}
                          transition={{ delay: i * 0.05 }}
                          className="px-2 py-0.5 text-[10px] font-medium bg-slate-800 text-slate-300 rounded-md"
                        >
                          {feature}
                        </motion.span>
                      ))}
                      {project.features.length > 4 && (
                        <span className="px-2 py-0.5 text-[10px] font-medium bg-slate-800 text-slate-400 rounded-md">
                          +{project.features.length - 4}
                        </span>
                      )}
                    </div>

                    {/* Tech Stack */}
                    <div className="flex flex-wrap gap-1.5 mb-5">
                      {project.technologies.map((tech, i) => (
                        <motion.span
                          key={tech}
                          initial={{ opacity: 0 }}
                          whileInView={{ opacity: 1 }}
                          transition={{ delay: i * 0.03 }}
                          className="px-2 py-0.5 text-[10px] font-mono bg-blue-500/10 text-blue-400 rounded border border-blue-500/20"
                        >
                          {tech}
                        </motion.span>
                      ))}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-3 pt-3 border-t border-slate-700/50">
                      <Link
                        href={project.url}
                        target="_blank"
                        className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 bg-linear-to-r from-blue-600 to-indigo-600 text-white text-sm font-medium rounded-sm hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300 group/btn"
                      >
                        Visit Project{" "}
                        <ArrowRight className="h-3.5 w-3.5 group-hover/btn:translate-x-1 transition-transform" />
                      </Link>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        className="p-2 border border-slate-600 rounded-sm hover:bg-slate-800 transition-colors"
                      >
                        <Star className="h-4 w-4 text-slate-400" />
                      </motion.button>
                    </div>
                  </div>

                  {/* Animated border on hover */}
                  <motion.div
                    animate={{ opacity: hoveredProject === idx ? 1 : 0 }}
                    className="absolute inset-0 rounded-sm pointer-events-none border border-blue-500/0 transition-all duration-500"
                  />
                </motion.div>
              </motion.div>
            ))}
          </div>

          {/* View All Projects CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-center mt-12"
          >
            <Link
              href="/projects"
              className="inline-flex items-center gap-2 px-6 py-3 border border-slate-600 text-slate-300 font-medium rounded-sm hover:bg-slate-800/50 hover:border-blue-500/50 transition-all duration-300 group"
            >
              View All Projects{" "}
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Skills Section */}
      <section ref={skillsRef} className="py-20 px-4 z-10 relative">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-white mb-3">
              Technical Expertise
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              Comprehensive skill set across modern web technologies
            </p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {Object.values(skills).map((category, idx) => (
              <motion.div
                key={category.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05, duration: 0.5 }}
                viewport={{ once: true }}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className="bg-slate-900/50 border border-slate-800 rounded-sm p-5 backdrop-blur-sm"
              >
                <div className="flex items-center gap-2 mb-4">
                  <motion.div
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.5 }}
                    className="p-1.5 rounded-sm bg-blue-500/10"
                  >
                    <category.icon className="h-4 w-4 text-blue-400" />
                  </motion.div>
                  <h3 className="text-base font-semibold text-white">
                    {category.title}
                  </h3>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {category.items.map((skill, i) => (
                    <motion.span
                      key={skill}
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      transition={{ delay: idx * 0.05 + i * 0.02 }}
                      whileHover={{
                        scale: 1.05,
                        backgroundColor: "rgba(59, 130, 246, 0.2)",
                      }}
                      className="px-2 py-0.5 text-xs font-medium bg-slate-800 text-slate-300 rounded-md cursor-default transition-all duration-200"
                    >
                      {skill}
                    </motion.span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Experience Section */}
      <section
        ref={experienceRef}
        className="py-20 px-4 bg-slate-900/30 z-10 relative"
      >
        <div className="container mx-auto max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-white mb-3">
              Professional Experience
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              6+ years of progressive experience in full-stack development
            </p>
          </motion.div>

          <div className="relative">
            <div className="absolute left-0 md:left-1/2 transform md:-translate-x-px top-0 bottom-0 w-px bg-linear-to-b from-blue-500 via-purple-500 to-transparent" />

            {experiences.map((exp, idx) => (
              <motion.div
                key={exp.company}
                initial={{ opacity: 0, x: idx % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1, duration: 0.5 }}
                viewport={{ once: true }}
                className={`relative flex flex-col md:flex-row gap-4 mb-8 ${idx % 2 === 0 ? "md:pr-[50%]" : "md:pl-[50%] md:flex-row-reverse"}`}
              >
                <motion.div
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  transition={{
                    delay: idx * 0.1 + 0.2,
                    type: "spring",
                    stiffness: 200,
                  }}
                  className="absolute left-0 md:left-1/2 transform -translate-x-1/2 w-3 h-3 rounded-full bg-blue-500 border-2 border-slate-900"
                />
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                  className="flex-1 bg-slate-800/50 border border-slate-700 rounded-sm p-5 hover:border-slate-600 transition-all backdrop-blur-sm"
                >
                  <div className="flex flex-wrap items-start justify-between gap-2 mb-3">
                    <div>
                      <h3 className="text-lg font-semibold text-white">
                        {exp.role}
                      </h3>
                      <p className="text-blue-400 text-sm">{exp.company}</p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1 text-xs text-slate-400">
                        <Calendar className="h-3 w-3" />
                        {exp.period}
                      </div>
                      <div className="flex items-center gap-1 text-xs text-slate-500 mt-1">
                        <MapPin className="h-3 w-3" />
                        {exp.location}
                      </div>
                    </div>
                  </div>
                  <ul className="space-y-1.5 mb-3">
                    {exp.achievements.map((achievement, i) => (
                      <motion.li
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.1 + i * 0.05 }}
                        className="flex items-start gap-2 text-sm text-slate-300"
                      >
                        <CheckCircle className="h-3.5 w-3.5 text-blue-400 mt-0.5 shrink-0" />
                        <span>{achievement}</span>
                      </motion.li>
                    ))}
                  </ul>
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {exp.technologies.map((tech, i) => (
                      <motion.span
                        key={tech}
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ delay: idx * 0.1 + i * 0.03 }}
                        className="px-2 py-0.5 text-[10px] font-medium bg-slate-700/50 text-slate-300 rounded"
                      >
                        {tech}
                      </motion.span>
                    ))}
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 border-t border-slate-800 bg-slate-900/20 z-10 relative">
        <div className="container mx-auto max-w-3xl text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
            whileHover={{ scale: 1.02 }}
            className="bg-linear-to-r from-blue-600/10 via-indigo-600/10 to-purple-600/10 border border-slate-700 rounded-sm p-8 backdrop-blur-sm"
          >
            <h2 className="text-2xl font-bold text-white mb-3">
              Ready to Build Something Great?
            </h2>
            <p className="text-slate-400 mb-6">
              Let's discuss how my expertise can help bring your next project to
              life
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/contact"
                className="group inline-flex items-center gap-2 px-5 py-2.5 bg-linear-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-sm hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300"
              >
                Start a Conversation
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

    </div>
  );
}
