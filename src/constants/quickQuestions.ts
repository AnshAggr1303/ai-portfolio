import {
  Briefcase,
  Laugh,
  Layers,
  PartyPopper,
  User2,
  MoreHorizontal,
} from 'lucide-react';

/* ---------- quick-question data ---------- */
export const questions = {
  Me: 'Who are you? I want to know more about you.',
  Projects: 'What are your projects? What are you working on right now?',
  Skills: 'What are your skills? Give me a list of your soft and hard skills.',
  Fun: "What's the craziest thing you've ever done? What are your hobbies?",
  Contact: 'How can I contact you?',
  More: 'Show me more options',
} as const;

/* ---------- Additional questions for the More section ---------- */
export const moreQuestions = [
  {
    id: 'resume',
    question: 'Can I see your resume? Show me your resume.',
    label: 'Resume'
  },
  {
    id: 'achievements',
    question: 'What are your achievements and certifications?',
    label: 'Achievements'
  },
  {
    id: 'goals',
    question: 'What are your career goals and aspirations?',
    label: 'Goals'
  },
  {
    id: 'availability',
    question: 'Are you available for new opportunities?',
    label: 'Availability'
  },
  {
    id: 'learning',
    question: 'What are you currently learning or want to learn?',
    label: 'Learning'
  }
];

export const categoryButtons = [
  { 
    key: 'Me', 
    color: '#329696', 
    icon: Laugh,
    label: 'About Me',
    prompt: questions.Me
  },
  { 
    key: 'Projects', 
    color: '#3E9858', 
    icon: Briefcase,
    label: 'Projects',
    prompt: questions.Projects
  },
  { 
    key: 'Skills', 
    color: '#856ED9', 
    icon: Layers,
    label: 'Skills',
    prompt: questions.Skills
  },
  { 
    key: 'Fun', 
    color: '#B95F9D', 
    icon: PartyPopper,
    label: 'Fun Facts',
    prompt: questions.Fun
  },
  { 
    key: 'Contact', 
    color: '#C19433', 
    icon: User2,
    label: 'Contact',
    prompt: questions.Contact
  },
  { 
    key: 'More', 
    color: '#6B7280', 
    icon: MoreHorizontal,
    label: 'More',
    prompt: questions.More
  },
] as const;