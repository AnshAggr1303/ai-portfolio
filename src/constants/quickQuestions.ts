import {
  Briefcase,
  Laugh,
  Layers,
  PartyPopper,
  User2,
} from 'lucide-react';

/* ---------- quick-question data ---------- */
export const questions = {
  Me: 'Who are you? I want to know more about you.',
  Projects: 'What are your projects? What are you working on right now?',
  Skills: 'What are your skills? Give me a list of your soft and hard skills.',
  Fun: "What's the craziest thing you've ever done? What are your hobbies?",
  Contact: 'How can I contact you?',
} as const;

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
] as const;