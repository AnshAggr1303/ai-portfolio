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
  { key: 'Me', color: '#329696', icon: Laugh },
  { key: 'Projects', color: '#3E9858', icon: Briefcase },
  { key: 'Skills', color: '#856ED9', icon: Layers },
  { key: 'Fun', color: '#B95F9D', icon: PartyPopper },
  { key: 'Contact', color: '#C19433', icon: User2 },
] as const;