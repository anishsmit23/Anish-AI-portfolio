'use client';
/**
 * skills.tsx – Skills & expertise section
 * Groups skills into five themed categories, each rendered as a row of
 * badge chips with staggered entrance animations. Doubles as the "getSkills"
 * chat tool card.
 */

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { Code, Cpu, PenTool, Users } from 'lucide-react';

/** Full skills matrix (categories → chips → accent colors) with staggered reveal. */
const Skills = () => {
  // One entry per rendered section: label, icon, chip list and accent colors.
  const skillsData = [
    {
      category: 'Languages',
      icon: <Code className="h-5 w-5" />,
      skills: [
        'Python', 'SQL', 'JavaScript', 'TypeScript',
      ],
      color: 'bg-blue-50 text-blue-600 border border-blue-200',
    },
    {
      category: 'ML & Deep Learning',
      icon: <Cpu className="h-5 w-5" />,
      skills: [
        'PyTorch', 'TensorFlow', 'Hugging Face Transformers', 'LSTM',
        'Transformers', 'LoRA fine-tuning', 'XGBoost', 'ONNX',
      ],
      color: 'bg-emerald-50 text-emerald-600 border border-emerald-200',
    },
    {
      category: 'GenAI & Agents',
      icon: <PenTool className="h-5 w-5" />,
      skills: ['LangGraph', 'LangChain', 'RAG', 'ChromaDB', 'Multi-agent systems', 'Prompt engineering', 'LLM routing and failover', 'Prompt-injection defense', 'Groq', 'NVIDIA NIM', 'Gemini'],
      color: 'bg-indigo-50 text-indigo-600 border border-indigo-200',
    },
    {
      category: 'Backend, Data & MLOps',
      icon: <Users className="h-5 w-5" />,
      skills: [
        'FastAPI', 'Flask', 'REST APIs', 'WebSockets', 'SSE', 'JWT/Auth',
        'Celery', 'Redis', 'PostgreSQL', 'SQLite', 'MinIO/S3', 'Agora RTC', 'Docker', 'Docker Compose',
        'AWS EC2', 'VPC', 'IAM', 'Secrets Manager', 'SSM', 'Terraform', 'Git', 'pytest', 'MLflow',
      ],
      color: 'bg-amber-50 text-amber-600 border border-amber-200',
    },
    {
      category: 'Core Strengths',
      icon: <Cpu className="h-5 w-5" />,
      skills: [
        'Production GenAI systems', 'Real-time voice agents', 'RAG pipelines',
        'Model evaluation', 'API design', 'Cloud deployment', 'Research synthesis',
      ],
      color: 'bg-purple-50 text-purple-600 border border-purple-200',
    },
  ];

  // Animation variants
  // Parent: reveals its children one after another (0.1s between sections).
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  // Section rows: rise + fade with an expo-out curve.
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: [0.19, 1, 0.22, 1] },
    },
  };

  // Individual skill chips: quick pop (scale 0.9 → 1) once their section starts.
  const badgeVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.3, ease: 'easeOut' },
    },
  };

  return (
    <motion.div
      initial={{ scale: 0.98, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.19, 1, 0.22, 1] }}
      className="mx-auto w-full max-w-5xl"
    >
      <Card className="w-full rounded-none border-none bg-transparent px-0 pb-8 shadow-none">
        <CardHeader className="px-0 pb-1">
          <CardTitle className="text-foreground px-0 text-3xl font-bold sm:text-4xl">
            Skills & Expertise
          </CardTitle>
        </CardHeader>

        <CardContent className="px-0">
          <motion.div
            className="space-y-8 px-0"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {skillsData.map((section, index) => (
              <motion.div
                key={index}
                className="border-border/60 space-y-4 border-b px-0 pb-6 last:border-b-0 last:pb-0"
                variants={itemVariants}
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-muted-foreground">{section.icon}</span>
                  <h3 className="text-accent-foreground text-lg font-semibold">
                    {section.category}
                  </h3>
                </div>

                {/* Own staggered container so each section's badges cascade in. */}
                <motion.div
                  className="flex flex-wrap gap-2"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  {section.skills.map((skill, idx) => (
                    <motion.div
                      key={idx}
                      variants={badgeVariants}
                      whileHover={{
                        scale: 1.04,
                        transition: { duration: 0.2 },
                      }}
                    >
                      <Badge variant="secondary" className="border-border bg-secondary text-secondary-foreground rounded-lg border px-3 py-1.5 font-normal">
                        {skill}
                      </Badge>
                    </motion.div>
                  ))}
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default Skills;
