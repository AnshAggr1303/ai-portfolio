/* eslint-disable @typescript-eslint/no-unused-vars */
import Image from 'next/image';
import { Image as Img } from 'lucide-react';
import { ChevronRight, ChevronLeft, Link } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { useRouter } from 'next/navigation';

const PROJECT_CONTENT: ProjectProps[] = [
  {
    title: 'Study Buddy',
    description:
      'A real-time voice assistant for academic support with contextual memory, agentic behavior, and web search. Built using Gemini 2.0/2.5, Supabase, and DuckDuckGo API.',
    techStack: [
      'Next.js',
      'Gemini 2.0/2.5',
      'Supabase',
      'VAD',
      'DuckDuckGo API',
      'Ngrok',
      'REST APIs',
      'Web Speech API'
    ],
    date: '2025',
    links: [
      {
        name: 'GitHub',
        url: 'https://github.com/AnshAggr1303/Agentic-Chatbot-System',
      }
    ],
    images: [
      { src: '/studypreview.png', alt: 'Study Buddy Preview 1' },
      { src: '/studypreview.png', alt: 'Study Buddy Preview 2' },
      { src: '/studypreview.png', alt: 'Study Buddy Preview 3' }
    ],
  },
  {
    title: 'Multilingual RAG Chatbot',
    description:
      'A multilingual, voice-enabled chatbot using LLaMA, FAISS, Vosk, and LangChain. Supports speech/text interaction with contextual vector retrieval.',
    techStack: [
      'Python',
      'LLaMA LLM',
      'FAISS',
      'Fasttext',
      'FastAPI',
      'LangChain',
      'VOSK',
      'React',
      'AWS'
    ],
    date: '2025',
    links: [
      {
        name: 'GitHub',
        url: 'https://github.com/AnshAggr1303/HackerzStreet-25',
      }
    ],
    images: [
      { src: '/ragpreview.png', alt: 'Multilingual RAG Chatbot Preview 1' },
      { src: '/ragpreview.png', alt: 'Multilingual RAG Chatbot Preview 2' },
      { src: '/ragpreview.png', alt: 'Multilingual RAG Chatbot Preview 3' }
    ],
  },
  {
    title: 'AI Cheat Detection System',
    description:
      'AI-based cheating detection system for online and offline exams using computer vision and behavior analysis. Integrated with the college website.',
    techStack: [
      'Python',
      'TensorFlow/Keras',
      'OpenCV',
      'YOLO',
      'FastAPI',
      'Flask',
      'DeepSpeech',
      'PostgreSQL',
      'React.js'
    ],
    date: '2025',
    links: [],
    images: [
      { src: '/cheatpreview.png', alt: 'AI Cheat Detection System Preview 1' },
      { src: '/cheatpreview.png', alt: 'AI Cheat Detection System Preview 2' },
      { src: '/cheatpreview.png', alt: 'AI Cheat Detection System Preview 3' }
    ],
  },
  {
    title: 'Helping Vision',
    description:
      'Smart glasses designed for the visually impaired using ultrasonic sensors and Arduino. Provides real-time haptic feedback for obstacle detection.',
    techStack: [
      'Arduino Nano',
      'Ultrasonic Sensors',
      'Vibrating Motors',
      'Battery Module',
      'Arduino IDE',
      'C/C++'
    ],
    date: '2024',
    links: [],
    images: [],
  }
];

interface ProjectProps {
  title: string;
  description?: string;
  techStack?: string[];
  date?: string;
  links?: { name: string; url: string }[];
  images?: { src: string; alt: string }[];
}

const ProjectContent = ({ project }: { project: ProjectProps }) => {
  const router = useRouter();
  const projectData = PROJECT_CONTENT.find((p) => p.title === project.title);

  const handleBackClick = () => {
    router.push('/projects'); // Navigate back to projects page
    // Alternative: router.push('/'); // Navigate back to home page
    // Alternative: router.back(); // Go back in browser history
  };

  if (!projectData) {
    return <div>Project details not available</div>;
  }

  return (
    <div className="space-y-10">
      {/* Back Button */}
      <button 
        onClick={handleBackClick}
        className="flex items-center gap-2 text-neutral-500 hover:text-white transition-colors mb-6"
      >
        <ChevronLeft className="w-4 h-4" />
        Back to Projects
      </button>

      <div className="rounded-3xl bg-[#F5F5F7] p-8 dark:bg-[#1D1D1F]">
        <div className="space-y-6">
          <div className="flex items-center gap-2 text-sm text-neutral-500 dark:text-neutral-400">
            <span>{projectData.date}</span>
          </div>

          <p className="text-white font-sans text-base leading-relaxed md:text-lg">
            {projectData.description}
          </p>

          <div className="pt-4">
            <h3 className="mb-3 text-sm tracking-wide text-neutral-500 uppercase dark:text-neutral-400">
              Technologies
            </h3>
            <div className="flex flex-wrap gap-2">
              {projectData.techStack && projectData.techStack.map((tech, index) => (
                <span
                  key={index}
                  className="rounded-full bg-neutral-200 px-3 py-1 text-sm text-neutral-800 dark:bg-neutral-800 dark:text-neutral-200"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {projectData.links && projectData.links.length > 0 && (
        <div className="mb-24">
          <div className="px-6 mb-4 flex items-center gap-2">
            <h3 className="text-sm tracking-wide text-neutral-500 dark:text-neutral-400">
              Links
            </h3>
            <Link className="text-muted-foreground w-4" />
          </div>
          <Separator className="my-4" />
          <div className="space-y-3">
            {projectData.links.map((link, index) => (
              <a
                key={index}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group bg-[#F5F5F7] flex items-center justify-between rounded-xl p-4 transition-colors hover:bg-[#E5E5E7] dark:bg-neutral-800 dark:hover:bg-neutral-700"
              >
                <span className="font-light capitalize text-white">{link.name}</span>
                <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </a>
            ))}
          </div>
        </div>
      )}

      {projectData.images && projectData.images.length > 0 && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-4">
            {projectData.images.map((image, index) => (
              <div
                key={index}
                className="relative aspect-video overflow-hidden rounded-2xl"
              >
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  className="object-cover transition-transform"
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export const data = [
  {
    category: 'AI Assistant',
    title: 'Study Buddy',
    src: '/studypreview.png',
    content: <ProjectContent project={{ title: 'Study Buddy' }} />,
  },
  {
    category: 'Multilingual Chatbot',
    title: 'Multilingual RAG Chatbot',
    src: '/ragpreview.png',
    content: <ProjectContent project={{ title: 'Multilingual RAG Chatbot' }} />,
  },
  {
    category: 'Proctoring AI',
    title: 'AI Cheat Detection System',
    src: '/cheatpreview.png',
    content: <ProjectContent project={{ title: 'AI Cheat Detection System' }} />,
  },
  {
    category: 'Assistive Tech',
    title: 'Helping Vision',
    src: '/visionpreview.png',
    content: <ProjectContent project={{ title: 'Helping Vision' }} />,
  },
];