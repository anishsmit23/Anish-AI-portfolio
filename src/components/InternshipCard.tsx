'use client';
/**
 * InternshipCard.tsx – About / experience summary card
 * Combines avatar, current roles, education, focus areas, core stack and
 * achievements into one animated card that ends with a mailto CTA. Also used
 * as the chat tool output for the "getInternship" tool.
 */

import { motion } from 'framer-motion';
import { Building2, GraduationCap, Mail } from 'lucide-react';
import Image from 'next/image';

/** Self-contained profile card rendered as a chat tool output. */
const InternshipCard = () => {
  // Opens the visitor's mail client in a new tab, pre-addressed to Anish.
  const openMail = () => window.open('mailto:anishhyd995@gmail.com', '_blank');

  return (
    // Entrance animation: fade in while sliding up 40px over 0.5s.
    <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="border-border bg-card mx-auto mt-8 w-full max-w-4xl rounded-3xl border px-6 py-8 font-sans sm:px-10 md:px-16 md:py-12">
      <div className="mb-8 flex items-center gap-4">
        <Image src="/anish-avatar.png" alt="Anish's avatar" width={64} height={64} className="h-16 w-16 rounded-full object-cover object-[50%_55%]" />
        <div><h2 className="text-foreground text-2xl font-semibold">Anish</h2><p className="text-muted-foreground text-sm">Junior AI/ML Engineer</p></div>
      </div>
      {/* Two-column fact grid (experience + education) that collapses to one column below sm. */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div className="flex items-start gap-3"><Building2 className="mt-1 h-5 w-5 text-blue-500" /><div><p className="text-foreground text-sm font-medium">Experience</p><p className="text-muted-foreground text-sm">Junior AI/ML Engineer at ElectraWireless Pvt. Ltd. and AI/ML Subject Matter Expert at House of Couton Pvt. Ltd.</p></div></div>
        <div className="flex items-start gap-3"><GraduationCap className="mt-1 h-5 w-5 text-green-500" /><div><p className="text-foreground text-sm font-medium">Education</p><p className="text-muted-foreground text-sm">B.Tech in Artificial Intelligence & Machine Learning at Sikkim Manipal Institute of Technology, 2023–2027 (expected); minor in Industry 4.0.</p></div></div>
      </div>
      <div className="mt-8"><p className="text-foreground mb-2 text-lg font-semibold">Focus</p><p className="text-foreground text-sm">Production GenAI, agentic systems, RAG, real-time voice agents, deep learning, and reliable cloud-backed ML applications.</p></div>
      <div className="mt-8"><p className="text-foreground mb-2 text-lg font-semibold">Core stack</p><p className="text-foreground text-sm">Python, FastAPI, PyTorch, TensorFlow, LangGraph, LangChain, Docker, AWS, PostgreSQL, Redis, Terraform, and pytest.</p></div>
      <div className="mt-8"><p className="text-foreground mb-2 text-lg font-semibold">Achievements</p><p className="text-foreground text-sm">Agora Conversational Agentic Hackathon finalist (top 35 of 900 teams across India). Amazon ML Challenge algorithm reached an F1 score above 95%.</p></div>
      {/* Primary CTA — reuses the same mailto target as openMail(). */}
      <div className="mt-10 flex justify-center"><button onClick={openMail} className="flex cursor-pointer items-center gap-2 rounded-full bg-black px-6 py-3 font-semibold text-white transition-colors duration-300 hover:bg-zinc-800"><Mail className="h-4 w-4" />Contact me</button></div>
    </motion.div>
  );
};

export default InternshipCard;
