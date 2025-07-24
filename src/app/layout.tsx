// src/app/layout.tsx
import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Ansh Agrawal - AI Portfolio',
  description: 'Chat with AI-powered version of Ansh Agrawal - Full Stack Developer & AI Enthusiast',
  keywords: ['Ansh Agrawal', 'AI Portfolio', 'Full Stack Developer', 'Next.js', 'Gemini AI'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}