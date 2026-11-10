/**
 * project-catalog.ts – portfolio project data (single source of truth)
 * Defines the PortfolioProject shape and the four featured projects used by
 * the project carousel/dialogs (AllProjects → ProjectContent), the chat
 * system prompt (PROJECT_KNOWLEDGE), and the saved-answer fallback in
 * /api/chat's route.ts.
 */
/**
 * PortfolioProject – one showcase entry.
 *
 * Field roles: `explanation` and `links` are what the chat side renders —
 * the getProjects tool card opens these entries in AllProjects, and the
 * LLM's system prompt / offline fallback quote them as markdown; the
 * remaining fields (problem, architecture, results, techStack) render
 * inside the detail dialog via ProjectContent; an absent `image` falls
 * back to generated SVG artwork in the card.
 */
export type PortfolioProject = {
  title: string;
  category: string;
  tagline: string;
  problem: string;
  architecture: { title: string; description: string }[];
  results: { value: string; label: string }[];
  image?: string;
  description: string;
  explanation: string;
  techStack: string[];
  links: { name: string; url: string }[];
};

/**
 * PROJECTS – the four featured projects, in a fixed order that must stay
 * aligned with visuals[] / ProjectArtwork indices in AllProjects.tsx
 * (Lively, SCP, Skin Lesion, Rozgaar AI), since cards look them up by index.
 */
export const PROJECTS: PortfolioProject[] = [
  {
    title: 'Lively',
    category: 'Voice AI · GenAI',
    tagline: 'A voice sales agent that listens, remembers, and acts.',
    problem: 'A sales conversation needs more than an answer to the latest question. Lively keeps track of the buyer’s needs and deal context so qualification, objection handling, booking, and human handoff can happen within the same conversation.',
    architecture: [
      { title: 'Real-time conversation', description: 'The React and TypeScript interface connects to Agora RTC for the live voice interaction, while the Python and FastAPI backend supports the agent workflow.' },
      { title: 'Context and grounded answers', description: 'Persistent deal memory carries customer context across turns. RAG retrieves product and pricing information for the agent’s answers.' },
      { title: 'Streaming and provider fallback', description: 'Groq generates the primary response, with NVIDIA NIM available as fallback. WebSockets support live communication with the interface.' },
      { title: 'Actions and handoff', description: 'The workflow covers lead qualification, objection handling, demo booking, CRM logging, and escalation to a human with the conversation context.' },
    ],
    results: [{ value: '50+', label: 'Conversations tested, including prompt-injection attempts' }, { value: 'Live demo', label: 'Public deployment available to explore' }],
    image: '/lively-preview.svg',
    description:
      'Real-time voice AI sales agent for lead qualification, objection handling, demo booking, CRM logging, and human escalation. Persistent deal memory, RAG over product and pricing data, and automatic LLM failover between Groq and NVIDIA NIM. Tested on more than 50 conversations, including prompt-injection attempts.',
    explanation:
      'Lively listens to a buyer in a live voice call and adapts the sales conversation. Agora handles real-time audio; a Python/FastAPI backend maintains deal state, retrieves product and pricing context with RAG, and streams answers from Groq with NVIDIA NIM fallback. It can qualify leads, address objections, book demos, log CRM activity, and escalate to a human with conversation context. The public demo is at https://lively-psi.vercel.app/. Testing covered more than 50 conversations, including prompt-injection attempts.',
    techStack: ['Python', 'FastAPI', 'PostgreSQL', 'React', 'TypeScript', 'Agora RTC', 'Groq', 'NVIDIA NIM', 'RAG', 'WebSockets', 'Docker'],
    links: [
      { name: 'Live app', url: 'https://lively-psi.vercel.app/' },
      { name: 'GitHub', url: 'https://github.com/anishsmit23/lively' },
    ],
  },
  {
    title: 'SCP Smart Coordinates Predictor',
    category: 'Deep Learning · Forecasting',
    tagline: 'Six possible paths for the next move.',
    problem: 'Pedestrians and cyclists can take several plausible paths. SCP studies this uncertainty by predicting six future trajectories from motion features and information about nearby agents.',
    architecture: [
      { title: 'Motion data', description: 'The pipeline uses nuScenes motion features to represent the observed movement of pedestrians or cyclists.' },
      { title: 'Sequence modeling', description: 'LSTM and Transformer encoder-decoder components model movement over time in PyTorch.' },
      { title: 'Social context and goals', description: 'Social pooling incorporates nearby agents. A goal-conditioned decoder produces six possible future trajectories.' },
      { title: 'Evaluation', description: 'Evaluation on nuScenes-mini reports average displacement error (ADE) across predicted positions and final displacement error (FDE) at the final position. TensorBoard is part of the development stack.' },
    ],
    results: [{ value: '0.615 m', label: 'Average displacement error on nuScenes-mini' }, { value: '0.919 m', label: 'Final displacement error on nuScenes-mini' }, { value: '6', label: 'Future trajectories per pedestrian or cyclist' }],
    description:
      'An LSTM and Transformer encoder-decoder with social pooling and a goal-conditioned decoder. Predicts six future trajectories per pedestrian or cyclist from motion features. Achieved ADE 0.615 m and FDE 0.919 m on nuScenes-mini.',
    explanation:
      'SCP forecasts how pedestrians or cyclists may move. Its PyTorch pipeline combines LSTM and Transformer encoder-decoder components, social pooling for nearby agents, and a goal-conditioned decoder. It produces six possible future trajectories rather than a single path. On nuScenes-mini, it achieved 0.615 m average displacement error (ADE) and 0.919 m final displacement error (FDE).',
    techStack: ['Python', 'PyTorch', 'LSTM', 'Transformer', 'Social Pooling', 'nuScenes', 'TensorBoard'],
    links: [{ name: 'GitHub', url: 'https://github.com/anishsmit23/scp-smart-coordinates-predictor' }],
  },
  {
    title: 'Skin Lesion Segmentation & Classification',
    category: 'Computer Vision · Research',
    tagline: 'Locate a lesion, then study its classification.',
    problem: 'This B.Tech major project studies two connected computer vision tasks: identifying the lesion region in an image and classifying lesions into seven classes. It compares several model families across the project’s datasets.',
    architecture: [
      { title: 'Data and image processing', description: 'The project uses ISIC 2018, HAM10000, and PH2, with OpenCV and Albumentations in the image processing and augmentation stack.' },
      { title: 'Segmentation comparison', description: 'Attention U-Net, TransUNet, and FAT-Net are compared for predicting the lesion region. Dice and intersection over union (IoU) measure segmentation overlap.' },
      { title: 'Seven-class classification', description: 'The classifier comparison includes ConvNeXt-T, EfficientNetV2-S, and DINOv2. A top-two soft-vote ensemble combines classifier outputs.' },
      { title: 'Model evaluation', description: 'The PyTorch-based project evaluates segmentation and classification separately. The reported numbers are project evaluation results and do not establish clinical performance.' },
    ],
    results: [{ value: '0.914', label: 'TransUNet Dice score on ISIC 2018' }, { value: '0.854', label: 'TransUNet IoU on ISIC 2018' }, { value: '92.8%', label: 'Top-two soft-vote classifier accuracy' }],
    description:
      'B.Tech major project comparing lesion segmentation models (Attention U-Net, TransUNet, FAT-Net) and seven-class classifiers (ConvNeXt-T, EfficientNetV2-S, DINOv2). TransUNet reached Dice 0.914 and IoU 0.854 on ISIC 2018; the top-two soft-vote classifier reached 92.8% accuracy.',
    explanation:
      'This B.Tech project studies both lesion localization and seven-class diagnosis. The segmentation comparison includes Attention U-Net, TransUNet, and FAT-Net; the classification comparison includes ConvNeXt-T, EfficientNetV2-S, and DINOv2. It uses ISIC 2018, HAM10000, and PH2 data. TransUNet reached Dice 0.914 and IoU 0.854 on ISIC 2018, while a top-two soft-vote classifier reached 92.8% accuracy. These are project evaluation results, not clinical claims.',
    techStack: ['Python', 'PyTorch', 'timm', 'Albumentations', 'OpenCV', 'scikit-learn', 'ISIC 2018', 'HAM10000', 'PH2'],
    links: [{ name: 'GitHub', url: 'https://github.com/anishsmit23/Skin-disease-DL-Framework-Project' }],
  },
  {
    title: 'Rozgaar AI',
    category: 'Agentic AI · Automation',
    tagline: 'Five agents coordinating a job application workflow.',
    problem: 'Job discovery, ranking, résumé work, email, and application tracking involve several dependent steps. Rozgaar AI coordinates those stages while keeping long-running tasks asynchronous and each user’s data scoped to their account.',
    architecture: [
      { title: 'Five-agent orchestration', description: 'LangGraph coordinates agents for job discovery, ranking, résumé work, email, and tracking. FastAPI exposes the workflow.' },
      { title: 'Persistent workflow state', description: 'An eight-stage PostgreSQL state machine records progress through the application pipeline.' },
      { title: 'Background execution', description: 'Celery and Redis run scoring, LLM calls, and uploads asynchronously. SSE streams task updates to the client.' },
      { title: 'User-scoped data', description: 'JWT-scoped data and per-user ChromaDB collections isolate users. MinIO, Groq, and Docker Compose are also part of the application stack.' },
    ],
    results: [{ value: '5', label: 'LangGraph agents in the application pipeline' }, { value: '8', label: 'Stages in the PostgreSQL state machine' }, { value: '48% → 73%', label: 'Improvement in pytest coverage' }],
    description:
      'A five-agent LangGraph pipeline for job discovery, ranking, résumé, email, and tracking, backed by an eight-stage PostgreSQL state machine. Celery and Redis run scoring, LLM calls, and uploads asynchronously. Per-user ChromaDB collections, JWT-scoped data, and SSE task streaming; pytest coverage rose from 48% to 73%.',
    explanation:
      'Rozgaar AI automates stages of a job application with five LangGraph agents for discovery, ranking, résumé work, email, and tracking. FastAPI exposes the workflow; an eight-stage PostgreSQL state machine tracks progress, while Celery and Redis run scoring, LLM requests, and uploads asynchronously. Per-user ChromaDB collections and JWT-scoped data isolate users, and SSE streams task updates. Pytest coverage improved from 48% to 73%.',
    techStack: ['Python', 'LangGraph', 'FastAPI', 'Celery', 'PostgreSQL', 'Redis', 'ChromaDB', 'MinIO', 'Groq', 'Docker Compose'],
    links: [{ name: 'GitHub', url: 'https://github.com/anishsmit23/ROZGAAR-AI' }],
  },
];

/**
 * PROJECT_KNOWLEDGE – flattened markdown digest of every project
 * (title, explanation, purpose, architecture steps, stack, links)
 * interpolated into the chat system prompt, so catalog edits flow into
 * the model's answers without manual sync.
 */
export const PROJECT_KNOWLEDGE = PROJECTS.map(
  (project) =>
    `### ${project.title}\n${project.explanation}\nPurpose: ${project.problem}\nArchitecture: ${project.architecture.map((step) => `${step.title}: ${step.description}`).join(' ')}\nStack: ${project.techStack.join(', ')}.\nLinks: ${project.links.map((link) => `${link.name}: ${link.url}`).join('; ')}`
).join('\n\n');
