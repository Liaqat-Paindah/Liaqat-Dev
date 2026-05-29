// app/contact/page.tsx
"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  ArrowRight,
  Mail,
  MapPin,
  Phone,
  Send,
  CheckCircle,
  Sparkles,
  Clock,
  MessageSquare,
  User,
  Briefcase,
} from "lucide-react";
import { useFormik } from "formik";
import * as Yup from "yup";

type Contact = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

const ContactSchema = Yup.object({
  name: Yup.string().required("Name is required"),
  email: Yup.string().required("Email"),
  subject: Yup.string().required("Subject is required"),
  message: Yup.string()
    .required("Message is required")
    .min(20, "The message should be more than 20 characters"),
});

export default function ContactPage() {
  const {
    values,
    errors,
    touched,
    handleBlur,
    handleChange,
    isSubmitting,
    setFieldValue,
    handleSubmit,
  } = useFormik<Contact>({
    initialValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
    validationSchema: ContactSchema,
    onSubmit: async () => {},
  });

  const contactInfo = [
    {
      icon: Mail,
      label: "Email",
      value: "liaqat.paindah@gmail.com",
      href: "mailto:liaqat.paindah@gmail.com",
    },
    {
      icon: Phone,
      label: "Phone",
      value: "+93 (0) 702-079-812",
      href: "tel:+93702079812",
    },
    { icon: MapPin, label: "Location", value: "Kabul, Afghanistan", href: "#" },
    {
      icon: Clock,
      label: "Response Time",
      value: "Within 24 hours",
      href: "#",
    },
  ];

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-950 via-slate-900 to-slate-950 overflow-hidden relative">
      {/* Background */}
      <div className="fixed inset-0 z-0 opacity-20 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-size:50px_50px" />
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
      </div>

      {/* Navigation */}
      <div className="fixed top-0 left-0 right-0 z-20 bg-slate-950/80 backdrop-blur-md border-b border-slate-800">
        <div className="container mx-auto max-w-6xl px-4 py-4">
          <div className="flex items-center justify-between">
            <Link
              href="/"
              className="text-xl font-bold bg-linear-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"
            >
              LP
            </Link>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-sm text-slate-300 text-sm hover:bg-slate-800/50 hover:text-white transition-all duration-300"
            >
              <ArrowRight className="h-4 w-4 rotate-180" />
              Back
            </Link>
          </div>
        </div>
      </div>

      <div className="relative z-10 pt-24 pb-16 px-4">
        <div className="container mx-auto max-w-6xl">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-linear-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 mb-4">
              <Sparkles className="h-3.5 w-3.5 text-blue-400" />
              <span className="text-xs text-blue-400 font-medium">
                Get in Touch
              </span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold bg-linear-to-r from-white via-blue-400 to-purple-400 bg-clip-text text-transparent">
              Let's Connect
            </h1>
            <p className="text-slate-400 mt-3">
              Have a project? Let's discuss how I can help
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="space-y-6"
            >
              <div className="bg-slate-900/40 border border-slate-700 rounded-sm p-6">
                <h2 className="text-xl font-semibold text-white mb-4">
                  Contact Information
                </h2>
                <div className="space-y-4">
                  {contactInfo.map((info, idx) => (
                    <motion.a
                      key={info.label}
                      href={info.href}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + idx * 0.05 }}
                      whileHover={{ x: 5 }}
                      className="flex items-center gap-4 p-3 rounded-sm bg-slate-800/30 border border-slate-700/50 hover:border-blue-500/30 transition-all duration-300 group"
                    >
                      <div className="p-2 rounded-sm bg-blue-500/10 group-hover:bg-blue-500/20 transition-colors">
                        <info.icon className="h-5 w-5 text-blue-400" />
                      </div>
                      <div>
                        <p className="text-xs text-slate-500">{info.label}</p>
                        <p className="text-white text-sm">{info.value}</p>
                      </div>
                    </motion.a>
                  ))}
                </div>
              </div>

              {/* Availability */}
              <div className="bg-linear-to-r from-blue-600/10 to-purple-600/10 border border-blue-500/20 rounded-sm p-6 text-center">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20 mb-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-xs text-green-400">
                    Available for work
                  </span>
                </div>
                <p className="text-slate-300 text-sm">
                  Open to full-time positions and freelance opportunities
                </p>
              </div>
            </motion.div>

            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="relative group"
            >
              <div className="absolute -inset-0.5 bg-linear-to-r from-blue-600 to-purple-600 rounded-sm blur-xl opacity-20 group-hover:opacity-40 transition duration-500" />
              <div className="relative bg-slate-900/60 backdrop-blur-sm border border-slate-700 rounded-sm p-6">
                <h2 className="text-xl font-semibold text-white mb-4">
                  Send a Message
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm text-slate-400 mb-1">
                      Full Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                      <input
                        type="text"
                        value={values.name}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className="w-full pl-9 pr-3 py-2.5 bg-slate-800/50 border border-slate-700 rounded-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
                        placeholder="John Doe"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm text-slate-400 mb-1">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                      <input
                        type="email"
                        value={values.email}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className="w-full pl-9 pr-3 py-2.5 bg-slate-800/50 border border-slate-700 rounded-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
                        placeholder="john@example.com"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm text-slate-400 mb-1">
                      Subject
                    </label>
                    <div className="relative">
                      <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                      <input
                        type="text"
                        value={values.subject}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className="w-full pl-9 pr-3 py-2.5 bg-slate-800/50 border border-slate-700 rounded-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
                        placeholder="Project Inquiry"
                      />
                    </div>
                      {errors.subject && touched.subject && (<><div className="text-red-400 text-sm py-1">{errors.subject}</div></>)}

                  </div>
                  <div>
                    <label className="block text-sm text-slate-400 mb-1">
                      Message
                    </label>
                    <div className="relative">
                      <MessageSquare className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                      <textarea
                        value={values.message}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        rows={4}
                        className="w-full pl-9 pr-3 py-2.5 bg-slate-800/50 border border-slate-700 rounded-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 transition-colors resize-none"
                        placeholder="Tell me about your project..."
                      />
                    </div>
                  </div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-linear-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-sm hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        <CheckCircle className="h-4 w-4" />
                        Sent Message
                      </>
                    )}
                  </button>
                </form>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
