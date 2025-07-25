import {
  Briefcase,
  Laugh,
  Layers,
  PartyPopper,
  User2,
  MoreHorizontal,
} from 'lucide-react';

/* ---------- Updated quick-question data with more specific prompts ---------- */
export const questions = {
  Me: 'Show me your profile', // More specific
  Projects: 'Show me your projects', // More specific
  Skills: 'Show me your skills', // More specific
  Fun: 'Show me your adventure photos', // More specific
  Contact: 'Show me your contact details', // More specific
  More: 'Show me more options', // Already specific
} as const;

/* ---------- Additional questions for the More section ---------- */
export const moreQuestions = [
  {
    id: 'resume',
    question: 'Show me your resume',
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
  },
  {
    id: 'philosophy',
    question: 'What is your work philosophy and approach?',
    label: 'Philosophy'
  },
  {
    id: 'experience',
    question: 'Tell me about your professional experience',
    label: 'Experience'
  },
  {
    id: 'education',
    question: 'What is your educational background?',
    label: 'Education'
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