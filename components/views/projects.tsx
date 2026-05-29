"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  ExternalLink,
  Star,
  Sparkles,
  Rocket,
  Briefcase,
  Zap,
  DollarSignIcon,
  Building2,
  Tag,
  Users,
  FolderGit2,
  Heart,
} from "lucide-react";
import { useProjects } from "@/hooks/useProject";
import { ProjectType } from "@/schema/project";
import { useState, useEffect } from "react";

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.2,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 25,
      mass: 0.8,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.9,
    y: 20,
    transition: { duration: 0.2 },
  },
};

// Helper functions
const formatPrice = (price: string) => {
  if (!price) return "$0";
  if (price.startsWith("$")) return price;
  return `$${price}`;
};



export default function ProjectsPage() {
  const { data, error, isLoading } = useProjects();
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [likedProjects, setLikedProjects] = useState<Set<number>>(new Set());
  const [currentYear, setCurrentYear] = useState<number | null>(null);

  useEffect(() => {
    setCurrentYear(new Date().getFullYear());
    const savedLikes = localStorage.getItem("likedProjects");
    if (savedLikes) {
      try {
        setLikedProjects(new Set(JSON.parse(savedLikes)));
      } catch (e) {
        console.error("Failed to parse saved likes", e);
      }
    }
  }, []);

  const handleLike = (projectId: number) => {
    setLikedProjects((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(projectId)) {
        newSet.delete(projectId);
      } else {
        newSet.add(projectId);
      }
      localStorage.setItem("likedProjects", JSON.stringify(Array.from(newSet)));
      return newSet;
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <div className="relative">
          <div className="w-12 h-12 border border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
          <motion.div
            animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <div className="w-2 h-2 bg-blue-500 rounded-full" />
          </motion.div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-linear-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="text-5xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-white mb-2">
            Failed to Load Projects
          </h2>
          <p className="text-slate-400 text-sm mb-6">
            Unable to fetch projects at this moment.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="inline-flex items-center gap-2 px-4 py-2 bg-linear-to-r from-blue-600 to-indigo-600 text-white text-sm font-medium rounded-sm hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300"
          >
            Try Again
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </motion.div>
      </div>
    );
  }

  // Safely extract unique categories
  const allCategories =
    data && Array.isArray(data)
      ? Array.from(
          new Set(
            data.flatMap((project: ProjectType) =>
              project.project_tags
                ? project.project_tags.split(",").map((tag) => tag.trim())
                : [],
            ),
          ),
        )
      : [];

  // Filter projects
  const filteredProjects =
    data && Array.isArray(data) && selectedCategory !== "all"
      ? data.filter((project: ProjectType) =>
          project.project_tags
            ? project.project_tags
                .split(",")
                .map((tag) => tag.trim())
                .includes(selectedCategory)
            : false,
        )
      : data || [];

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-950 via-slate-900 to-slate-950 overflow-x-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-linear(to_right,#4f4f4f15_1px,transparent_1px),linear-linear(to_bottom,#4f4f4f15_1px,transparent_1px)] bg-size:40px-40px" />
        <motion.div
          animate={{ x: [0, 100, 0], y: [0, 50, 0] }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute top-20 left-20 w-72 h-72 bg-blue-500/20 rounded-full blur-[100px]"
        />
        <motion.div
          animate={{ x: [0, -80, 0], y: [0, -60, 0] }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-20 right-20 w-72 h-72 bg-purple-500/20 rounded-full blur-[100px]"
        />
      </div>

      {/* Hero Section */}
      <section className="relative pt-24 pb-8 px-4 z-10">
        <div className="container mx-auto max-w-5xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/20 mb-4"
          >
            <Rocket className="h-3 w-3 text-blue-400" />
            <span className="text-[11px] text-blue-400 font-medium tracking-wide uppercase">
              Portfolio
            </span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="text-3xl sm:text-4xl font-bold mb-2 bg-linear-to-r from-white via-blue-400 to-purple-400 bg-clip-text text-transparent"
          >
            Featured Work
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="text-slate-400 text-sm max-w-xl mx-auto"
          >
            A showcase of enterprise-grade applications and innovative solutions
          </motion.p>
        </div>
      </section>

      {/* Stats Bar */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
        className="py-4 border-y border-slate-800/50 bg-slate-900/20 z-10 relative mb-8"
      >
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-4 gap-4 max-w-2xl mx-auto">
            {[
              { icon: FolderGit2, label: "Projects", value: data?.length || 0 },
              { icon: Tag, label: "Categories", value: allCategories.length },
              {
                icon: Briefcase,
                label: "Clients",
                value: data?.filter((p) => p.project_client).length || 0,
              },
              { icon: Zap, label: "Support", value: "24/7" },
            ].map((stat, idx) => (
              <motion.div
                key={stat.label}
                whileHover={{ y: -2 }}
                className="text-center"
              >
                <stat.icon className="h-4 w-4 text-blue-400 mx-auto mb-1" />
                <div className="text-lg font-bold text-white">{stat.value}</div>
                <div className="text-[10px] text-slate-500 uppercase tracking-wide">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Projects Grid - 3 columns with professional borders */}
      <section className="py-6 px-4 z-10 relative">
        <div className="container mx-auto max-w-6xl">
          {filteredProjects && filteredProjects.length > 0 ? (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
            >
              {filteredProjects.map((project: ProjectType) => (
                <motion.div
                  key={project.id}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  whileHover={{ y: -6, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  layout
                  className="group relative bg-linear-to-br from-slate-900/50 to-slate-900/30 backdrop-blur-sm rounded-sm overflow-hidden border border-transparent hover:border-blue-500/50 transition-all duration-300"
                  style={{
                    boxShadow:
                      "0 20px 35px -10px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.05)",
                  }}
                >
                  {/* Gradient Border Effect on Hover */}
                  <div
                    className="absolute inset-0 rounded-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                    style={{
                      background:
                        "linear-gradient(135deg, rgba(59, 130, 246, 0.2), rgba(139, 92, 246, 0.2))",
                    }}
                  />

                  {/* Inner Border Glow */}
                  <div className="absolute inset-px rounded-sm bg-linear-to-br from-slate-900/80 to-slate-900/40 pointer-events-none" />

                  {/* Image Section */}
                  <div className="relative h-40 overflow-hidden rounded-t-xl">
                    <Image
                      src={project.image}
                      alt={project.project_name || "Project image"}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 33vw, 25vw"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-slate-950 via-slate-950/40 to-transparent" />

                    {/* Price Badge */}
                    <div className="absolute top-2 right-2">
                      <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-sm text-[10px] font-medium bg-green-500/20 text-green-400 backdrop-blur-sm border border-green-500/30">
                        <DollarSignIcon className="h-2.5 w-2.5" />
                        {project.price}
                      </span>
                    </div>

                    {/* Category Badge */}
                    <div className="absolute bottom-2 left-2">
                      <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-sm text-[10px] font-medium bg-blue-500/20 text-blue-400 backdrop-blur-sm border border-blue-500/30">
                        {project.project_tags?.split(",")[0]?.trim() ||
                          "Project"}
                      </span>
                    </div>

                    {/* View Link */}
                    <motion.div
                      initial={{ opacity: 0, x: 5 }}
                      transition={{ duration: 0.2 }}
                      className="absolute bottom-2 right-2"
                    >
                      <Link
                        href={project.project_link || "#"}
                        target="_blank"
                        className="p-1.5 bg-slate-800/90 backdrop-blur rounded-sm hover:bg-slate-700 transition-colors border border-slate-600/50"
                      >
                        <ExternalLink className="h-3 w-3 text-slate-300" />
                      </Link>
                    </motion.div>
                  </div>

                  {/* Content */}
                  <div className="p-3 relative z-10">
                    {/* Title */}
                    <h3 className="text-sm font-semibold text-white group-hover:text-blue-400 transition-colors truncate">
                      {project.project_name || "Untitled Project"}
                    </h3>

                    {/* Client */}
                    {project.project_client && (
                      <div className="flex items-center gap-1 mt-0.5">
                        <Building2 className="h-2.5 w-2.5 text-slate-500" />
                        <p className="text-[10px] text-slate-400 truncate">
                          {project.project_client}
                        </p>
                      </div>
                    )}

                    {/* Description */}
                    {project.project_desc && (
                      <p className="text-slate-300 text-[11px] mt-1.5 line-clamp-2 leading-relaxed">
                        {project.project_desc}
                      </p>
                    )}

                    {/* Tech Stack */}
                    {project.project_skills && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {project.project_skills
                          .split(",")
                          .slice(0, 3)
                          .map((skill, i) => (
                            <span
                              key={`${skill}-${i}`}
                              className="px-1.5 py-0.5 text-[9px] font-mono bg-slate-800/80 text-slate-300 rounded border border-slate-700"
                            >
                              {skill.trim()}
                            </span>
                          ))}
                        {project.project_skills.split(",").length > 3 && (
                          <span className="px-1.5 py-0.5 text-[9px] font-medium bg-slate-800/80 text-slate-400 rounded border border-slate-700">
                            +{project.project_skills.split(",").length - 3}
                          </span>
                        )}
                      </div>
                    )}

                    {/* Tags */}
                    {project.project_tags && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {project.project_tags
                          .split(",")
                          .slice(0, 3)
                          .map((tag, i) => (
                            <span
                              key={`${tag}-${i}`}
                              className="px-1.5 py-0.5 text-[9px] font-medium bg-blue-500/10 text-blue-400 rounded border border-blue-500/20"
                            >
                              {tag.trim()}
                            </span>
                          ))}
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex items-center gap-2 mt-3 pt-2 border-t border-slate-700/30">
                      <Link
                        href={project.project_link || "#"}
                        target="_blank"
                        className="flex-1 inline-flex items-center justify-center gap-1.5 px-2 py-1.5 bg-linear-to-r from-blue-600 to-indigo-600 text-white text-[11px] font-medium rounded-sm hover:shadow-md hover:shadow-blue-500/25 transition-all duration-300 group/btn border border-blue-400/20"
                      >
                        View Project{" "}
                        <ArrowRight className="h-2.5 w-2.5 group-hover/btn:translate-x-0.5 transition-transform" />
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-16"
            >
              <div className="text-4xl mb-3">📁</div>
              <h3 className="text-base font-semibold text-white mb-1">
                No Projects Found
              </h3>
              <p className="text-slate-400 text-xs mb-4">
                {selectedCategory !== "all"
                  ? `No projects in "${selectedCategory}"`
                  : "No projects available"}
              </p>
            </motion.div>
          )}
        </div>
      </section>
    </div>
  );
}
