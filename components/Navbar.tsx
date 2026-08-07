"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Menu,
  X,
  ChevronDown,
  LogOut,
  Home,
  User,
  BrainCircuit,
  FolderKanban,
  MessageSquare,
  LayoutDashboard,
  FileText,
  Settings,
  Bell,
  PlusCircle,
  Sparkles,
  Zap,
  Shield,
  Activity,
  Radar,
  Target,
  Compass,
  Orbit,
  Globe,
  Cpu,
  Eye,
} from "lucide-react";

import { useState, useRef, useEffect, useCallback } from "react";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import { useAuth } from "./provider/authContext";
import { supabase } from "@/utils/supabase/supabase";

// Advanced Navigation Structure with  DNA
export const navLinks = [
  {
    to: "/",
    label: "Home",
    description: "Welcome to my developer portfolio",
    linear: "from-cyan-400 to-blue-500",
    glow: "cyan",
  },
  {
    to: "/about",
    label: "About",
    description: "Learn more about my background and journey",
    linear: "from-purple-400 to-pink-500",
    glow: "purple",
  },
  {
    to: "/skills",
    label: "Skills",
    description: "Frontend, backend, databases, and DevOps",
    linear: "from-emerald-400 to-teal-500",
    glow: "emerald",
  },
  {
    to: "/projects",
    label: "Projects",
    description: "Explore my full stack applications",
    linear: "from-orange-400 to-red-500",
    glow: "orange",
  },
  {
    to: "/contact",
    label: "Contact",
    description: "Get in touch for collaborations",
    linear: "from-rose-400 to-pink-500",
    glow: "rose",
  },
];

const UserLinks = [
  {
    to: "/dashboard",
    label: "Dashboard",
    description: "Overview & Analytics",
    icon: LayoutDashboard,
  },
  {
    to: "/dashboard/applications",
    label: "Applications",
    description: "Track your applications",
    icon: FileText,
  },
  {
    to: "/dashboard/messages",
    label: "Messages",
    description: "Conversations & Updates",
    icon: MessageSquare,
  },
  {
    to: "/settings",
    label: "Settings",
    description: "Preferences & Security",
    icon: Settings,
  },
];

const particleConfigs = Array.from({ length: 50 }, (_, index) => ({
  id: index,
  size: 1 + ((index * 17) % 30) / 10,
  duration: 3 + ((index * 23) % 50) / 10,
  delay: ((index * 19) % 50) / 10,
  startX: (index * 29) % 100,
  startY: (index * 37) % 100,
  opacity: 0.2 + ((index * 13) % 30) / 100,
  driftX: ((index % 5) - 2) * 18,
}));

// Advanced 3D Tilt Effect Component
const TiltCard = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 400, damping: 30 });
  const mouseYSpring = useSpring(y, { stiffness: 400, damping: 30 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["7deg", "-7deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-7deg", "7deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// Advanced Particle System
const UserSection = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particleConfigs.map((particle) => {
        return (
          <motion.div
            key={particle.id}
            className="absolute rounded-full"
            style={{
              width: particle.size,
              height: particle.size,
              background: `radial-gradient(circle, rgba(6, 182, 212, ${particle.opacity}), rgba(59, 130, 246, 0))`,
              left: `${particle.startX}%`,
              top: `${particle.startY}%`,
            }}
            animate={{
              y: [0, -100, -200],
              x: [0, particle.driftX, 0],
              opacity: [0, 1, 0],
              scale: [0, 1.5, 0],
            }}
            transition={{
              duration: particle.duration,
              repeat: Infinity,
              delay: particle.delay,
              ease: "linear",
            }}
          />
        );
      })}
    </div>
  );
};

// Glowing Orb Effect
const GlowingOrb = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <motion.div
      className="fixed pointer-events-none z-50"
      style={{
        left: mousePosition.x - 150,
        top: mousePosition.y - 150,
      }}
      animate={{
        scale: [1, 1.2, 1],
      }}
      transition={{
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    >
      <div className="w-72 h-72 rounded-full bg-linear-to-r from-cyan-500/10 via-blue-500/10 to-purple-500/10 blur-3xl" />
    </motion.div>
  );
};

export const Navbar = () => {
  const { profile, user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const [isHoveringLogo, setIsHoveringLogo] = useState(false);
  const [notificationCount, setNotificationCount] = useState(3);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);

  // Handle scroll effect with threshold
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Handle click outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(e.target as Node)
      ) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Close on route change
  useEffect(() => {
    setMobileOpen(false);
    setUserMenuOpen(false);
  }, [pathname]);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut({ scope: "local" });
    if (!error) {
      setUserMenuOpen(false);
      setMobileOpen(false);
      router.replace("/login");
      router.refresh();
    }
  };

  // Animated text for logo
  const logoTextVariants = {
    initial: { opacity: 0, y: -20 },
    animate: { opacity: 1, y: 0 },
    hover: {
      textShadow: "0 0 20px rgba(6, 182, 212, 0.5)",
      transition: { duration: 0.3 },
    },
  };

  return (
    <>
      <GlowingOrb />

      <nav
        className={`fixed top-0 w-full z-50 transition-all duration-700 ${
          scrolled
            ? "bg-black/90 backdrop-blur-2xl border-b border-white/10 shadow-2xl shadow-black/50"
            : "bg-linear-to-b from-black/50 to-transparent backdrop-blur-sm"
        }`}
      >
        {/* Animated linear Border */}
        <motion.div
          className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-cyan-500/80 to-transparent"
          animate={{
            opacity: [0.5, 1, 0.5],
            scaleX: [0.9, 1, 0.9],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Noise Texture */}
        <div
          className="absolute inset-0 opacity-5 pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
            backgroundRepeat: "repeat",
          }}
        />

        <div className="container mx-auto flex h-16 items-center justify-between px-4 relative">
          {/* Advanced Logo with 3D Effect */}
          <TiltCard className="relative">
            <Link
              href="/"
              ref={logoRef as any}
              onMouseEnter={() => setIsHoveringLogo(true)}
              onMouseLeave={() => setIsHoveringLogo(false)}
              className="group relative flex items-center gap-2 overflow-hidden"
            >
              {/* Logo Glow Effect */}
              <motion.div
                className="absolute inset-0 bg-linear-to-r from-cyan-500/20 via-blue-500/20 to-purple-500/20 rounded-lg blur-xl"
                animate={{
                  opacity: isHoveringLogo ? 1 : 0,
                  scale: isHoveringLogo ? 1.2 : 0.8,
                }}
                transition={{ duration: 0.3 }}
              />

              <motion.span
                variants={logoTextVariants}
                initial="initial"
                animate="animate"
                whileHover="hover"
                className="relative font-display text-xl font-bold bg-linear-to-r from-white via-white to-gray-400 bg-clip-text text-transparent"
              >
                Liaqat{" "}
                <span className="text-transparent bg-linear-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text">
                  Dev
                </span>
              </motion.span>

              {/* Animated underline with pulse */}
              <motion.div
                className="absolute -bottom-1 left-0 right-0 h-0.5 bg-linear-to-r from-cyan-500 via-blue-500 to-purple-500 rounded-full"
                initial={{ scaleX: 0 }}
                whileHover={{ scaleX: 1 }}
                transition={{ duration: 0.3 }}
              />

              {/* Pulse Ring */}
              <motion.div
                className="absolute -inset-2 rounded-full border border-cyan-500/30"
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.5, 0, 0.5],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            </Link>
          </TiltCard>

          {/* Desktop Navigation with Advanced Effects */}
          <div className="hidden lg:flex items-center gap-1">
            {(user ? UserLinks : navLinks).map((link, index) => {
              const active = pathname === link.to;
              return (
                <Link
                  key={link.to}
                  href={link.to}
                  onMouseEnter={() => setHoveredLink(link.to)}
                  onMouseLeave={() => setHoveredLink(null)}
                  className="relative group"
                >
                  <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`relative px-4 py-2 rounded-sm text-sm font-medium transition-all duration-300 ${
                      active
                        ? "text-cyan-400"
                        : "text-gray-400 hover:text-white"
                    }`}
                  >
                    {/* Active Background with Animation */}
                    {active && (
                      <motion.div
                        layoutId="activeNav"
                        className="absolute inset-0 bg-linear-to-r from-cyan-500/20 via-blue-500/20 to-purple-500/20 rounded-sm border border-cyan-500/30"
                        transition={{
                          type: "spring",
                          stiffness: 500,
                          damping: 30,
                        }}
                      />
                    )}

                    {/* Label */}
                    <span className="relative z-10">{link.label}</span>

                    {/* Active Indicator Dot */}
                    {active && (
                      <motion.div
                        layoutId="activeDot"
                        className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-cyan-400"
                        transition={{
                          type: "spring",
                          stiffness: 500,
                          damping: 30,
                        }}
                      />
                    )}

                    {/* Hover Glow Effect */}
                    {hoveredLink === link.to && !active && (
                      <motion.div
                        layoutId="hoverNav"
                        className="absolute inset-0 bg-linear-to-r from-cyan-500/10 via-blue-500/10 to-purple-500/10 rounded-sm"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      />
                    )}
                  </motion.div>

                  {/* Advanced Tooltip with Arrow */}
                  <AnimatePresence>
                    {hoveredLink === link.to && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.9 }}
                        transition={{ duration: 0.2 }}
                        className="absolute top-full left-1/2 -translate-x-1/2 mt-3"
                      >
                        <div className="relative">
                          {/* Arrow */}
                          <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-3 h-3 rotate-45 bg-gray-900/95 border-l border-t border-white/10" />
                          {/* Content */}
                          <div className="relative px-4 py-2 bg-gray-900/95 backdrop-blur-xl rounded-lg border border-white/10 shadow-2xl">
                            <p className="text-xs text-gray-300 whitespace-nowrap">
                              {link.description}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Link>
              );
            })}
          </div>

          {/* Right Section with Advanced Components */}
          <div className="hidden lg:flex items-center gap-3">
            {user ? (
              <>
                {/* Advanced Notification Center */}
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="relative group"
                >
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    className="relative p-2 rounded-sm hover:bg-white/5 transition-all"
                    animate={{
                      boxShadow:
                        notificationCount > 0
                          ? "0 0 10px rgba(6, 182, 212, 0.5)"
                          : "none",
                    }}
                  >
                    <Bell className="h-5 w-5 text-gray-400 group-hover:text-cyan-400 transition-colors" />

                    {/* Animated Notification Badge */}
                    {notificationCount > 0 && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute -top-1 -right-1"
                      >
                        <div className="relative">
                          <div className="absolute inset-0 rounded-full bg-red-500 animate-ping" />
                          <div className="relative min-w-4.5 h-4.5 px-1 rounded-full bg-linear-to-r from-red-500 to-pink-500 flex items-center justify-center">
                            <span className="text-[10px] font-bold text-white">
                              {notificationCount > 9 ? "9+" : notificationCount}
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </motion.button>

                  {/* Notification Preview on Hover */}
                  <AnimatePresence>
                    {notificationCount > 0 && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        whileHover={{ opacity: 1, y: 0 }}
                        className="absolute top-full right-0 mt-2 w-80 rounded-sm bg-gray-900/95 backdrop-blur-xl border border-white/10 shadow-2xl overflow-hidden"
                      >
                        <div className="p-3 border-b border-white/10">
                          <p className="text-sm font-medium">Notifications</p>
                        </div>
                        <div className="p-2">
                          {[1, 2, 3].map((i) => (
                            <div
                              key={i}
                              className="px-3 py-2 rounded-lg hover:bg-white/5 transition-colors"
                            >
                              <p className="text-xs text-gray-300">
                                New notification {i}
                              </p>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>

                {/* Advanced Create Button */}
                <Link
                  href="/dashboard/jobs/create"
                  className="group relative overflow-hidden"
                >
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="relative flex items-center gap-2 px-4 py-2 rounded-sm text-sm font-medium bg-linear-to-r from-cyan-500/20 via-blue-500/20 to-purple-500/20 border border-cyan-500/30 text-cyan-400 overflow-hidden"
                  >
                    {/* Button Glow Effect */}
                    <motion.div
                      className="absolute inset-0 bg-linear-to-r from-cyan-500 via-blue-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      style={{ filter: "blur(10px)" }}
                    />

                    <PlusCircle className="h-4 w-4 relative z-10 group-hover:rotate-90 transition-transform duration-300" />
                    <span className="relative z-10">Post Job</span>
                  </motion.div>
                </Link>

                {/* Advanced User Menu */}
                <div className="relative" ref={userMenuRef}>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-2 p-1.5 rounded-sm hover:bg-white/5 transition-all group"
                  >
                    <div className="relative">
                      {/* Avatar Ring Animation */}
                      <motion.div
                        className="absolute inset-0 rounded-full bg-linear-to-r from-cyan-500 via-blue-500 to-purple-500"
                        animate={{
                          rotate: 360,
                        }}
                        transition={{
                          duration: 3,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                        style={{ padding: 2 }}
                      />
                      <div className="relative h-8 w-8 rounded-full bg-linear-to-br from-cyan-500 via-blue-500 to-purple-600 flex items-center justify-center text-white font-medium shadow-lg">
                        {user.email?.[0].toUpperCase() || "U"}
                      </div>

                      {/* Online Status */}
                      <motion.div
                        className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-green-500 ring-2 ring-black"
                        animate={{
                          scale: [1, 1.2, 1],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                        }}
                      />
                    </div>

                    <ChevronDown
                      className={`h-3.5 w-3.5 text-gray-400 transition-all duration-300 ${
                        userMenuOpen ? "rotate-180" : "group-hover:rotate-12"
                      }`}
                    />
                  </motion.button>

                  {/* Advanced Dropdown Menu */}
                  <AnimatePresence>
                    {userMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{
                          duration: 0.2,
                          type: "spring",
                          stiffness: 400,
                        }}
                        className="absolute top-full right-0 mt-2 w-72 rounded-sm bg-gray-900/95 backdrop-blur-xl border border-white/10 shadow-2xl overflow-hidden z-50"
                      >
                        {/* User Info Header with linear */}
                        <div className="relative p-4 border-b border-white/10 bg-linear-to-r from-cyan-500/10 via-blue-500/10 to-purple-500/10">
                          <motion.div
                            className="absolute inset-0 bg-linear-to-r from-cyan-500/5 via-blue-500/5 to-purple-500/5"
                            animate={{
                              x: ["0%", "100%", "0%"],
                            }}
                            transition={{
                              duration: 3,
                              repeat: Infinity,
                              ease: "linear",
                            }}
                          />

                          <div className="relative">
                            <p className="text-sm font-bold bg-linear-to-r from-white to-gray-300 bg-clip-text text-transparent">
                              {profile?.first_name && profile?.last_name
                                ? `${profile.first_name} ${profile.last_name}`
                                : user.email?.split("@")[0] || "User"}
                            </p>
                            <p className="text-xs text-gray-400 truncate mt-1">
                              {user.email}
                            </p>
                            <div className="flex items-center gap-2 mt-2">
                              <div className="relative">
                                <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                                <div className="absolute inset-0 w-1.5 h-1.5 rounded-full bg-green-500 animate-ping" />
                              </div>
                              <span className="text-xs text-green-400 font-medium">
                                Active Now
                              </span>
                              <div className="w-px h-3 bg-white/10 mx-1" />
                              <span className="text-xs text-gray-400">
                                User{" "}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Menu Items */}
                        <div className="p-2">
                          <button
                            type="button"
                            onClick={handleLogout}
                            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-red-400 hover:bg-red-500/10 transition-all group"
                          >
                            <motion.div
                              whileHover={{ rotate: 180 }}
                              transition={{ duration: 0.3 }}
                            >
                              <LogOut className="h-4 w-4" />
                            </motion.div>
                            <span>Sign Out</span>
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </>
            ) : (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Link
                  href="/login"
                  className="group relative overflow-hidden px-5 py-2 rounded-sm text-sm font-medium border border-white/10 text-gray-300 hover:text-white transition-all duration-300"
                >
                  <span className="relative z-10">Login</span>
                  <motion.div
                    className="absolute inset-00"
                    initial={{ x: "-100%" }}
                    whileHover={{ x: 0 }}
                    transition={{ duration: 0.3 }}
                  />
                </Link>
              </motion.div>
            )}
          </div>

          {/* Mobile Controls */}
          <div className="flex lg:hidden items-center gap-2">
            {user && (
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="relative p-2 rounded-sm hover:bg-white/5"
              >
                <Bell className="h-5 w-5" />
                {notificationCount > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-4 h-4 px-1 rounded-full bg-linear-to-r from-red-500 to-pink-500 text-[8px] font-bold text-white flex items-center justify-center">
                    {notificationCount}
                  </span>
                )}
              </motion.button>
            )}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setMobileOpen(!mobileOpen)}
              className="p-2 rounded-sm hover:bg-white/5 transition-all"
            >
              {mobileOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </motion.button>
          </div>
        </div>
      </nav>

      {/* Advanced Mobile Menu with Slide-in Animation */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-16 right-0 bottom-0 w-full max-w-sm bg-black/95 backdrop-blur-2xl border-l border-white/10 shadow-2xl z-40 lg:hidden overflow-y-auto"
          >
            {/* Mobile Menu Header with Particle Effect */}
            <div className="relative p-4 border-b border-white/10 bg-linear-to-r from-cyan-500/5 via-blue-500/5 to-purple-500/5">
              <UserSection />
              <p className="text-xs text-cyan-400 font-mono">Liaqat Dev</p>
            </div>

            <div className="p-4 flex flex-col gap-2">
              {user ? (
                <>
                  {/* User Profile Card */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-3 p-3 mb-3 rounded-sm bg-linear-to-r from-cyan-500/10 via-blue-500/10 to-purple-500/10 border border-white/10"
                  >
                    <div className="relative">
                      <div
                        className="absolute inset-0 rounded-full bg-linear-to-r from-cyan-500 to-purple-500 animate-spin"
                        style={{ animationDuration: "2s" }}
                      />
                      <div className="relative h-12 w-12 rounded-full bg-linear-to-br from-cyan-500 via-blue-500 to-purple-600 flex items-center justify-center text-white font-medium shadow-lg">
                        {user.email?.[0].toUpperCase() || "U"}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-white truncate">
                        {profile?.first_name && profile?.last_name
                          ? `${profile.first_name} ${profile.last_name}`
                          : user.email?.split("@")[0] || "User"}
                      </p>
                      <p className="text-xs text-gray-400 truncate">
                        {user.email}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                        <span className="text-xs text-green-400">Active</span>
                      </div>
                    </div>
                  </motion.div>

                  {/* Navigation Links with Stagger Animation */}
                  {UserLinks.map((link, index) => (
                    <motion.div
                      key={link.to}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Link
                        href={link.to}
                        onClick={() => setMobileOpen(false)}
                        className="group block px-3 py-3 rounded-sm hover:bg-white/5 transition-all"
                      >
                        <div className="font-medium group-hover:text-cyan-400 transition-colors">
                          {link.label}
                        </div>
                        <div className="text-xs text-gray-500 group-hover:text-gray-400 transition-colors">
                          {link.description}
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </>
              ) : (
                <>
                  {/* Navigation Links with Stagger Animation */}
                  {navLinks.map((link, index) => (
                    <motion.div
                      key={link.to}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Link
                        href={link.to}
                        onClick={() => setMobileOpen(false)}
                        className="group block px-3 py-3 rounded-sm hover:bg-white/5 transition-all"
                      >
                        <div className="font-medium group-hover:text-cyan-400 transition-colors">
                          {link.label}
                        </div>
                        <div className="text-xs text-gray-500 group-hover:text-gray-400 transition-colors">
                          {link.description}
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </>
              )}

              <div className="border-t border-white/10 my-3" />

              {!user ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <Link
                    href="/login"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center justify-center px-3 py-3 rounded-sm text-sm font-medium bg-linear-to-r from-cyan-500/20 via-blue-500/20 to-purple-500/20 border border-cyan-500/30 text-cyan-400 transition-all"
                  >
                    <span>Login to Liaqat Dev</span>
                    <Sparkles className="h-4 w-4 ml-2" />
                  </Link>
                </motion.div>
              ) : (
                <motion.button
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  type="button"
                  onClick={handleLogout}
                  className="flex items-center justify-center gap-2 px-3 py-3 rounded-sm text-sm font-medium text-red-400 hover:bg-red-500/10 transition-all group"
                >
                  <LogOut className="h-4 w-4 group-hover:rotate-180 transition-transform duration-300" />
                  Sign Out
                </motion.button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Advanced Particle Background */}
      <UserSection />
    </>
  );
};
