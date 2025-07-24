'use client';

import React from 'react';
import { ChevronRight } from 'lucide-react';

export function Contact() {
  // Contact information
  const contactInfo = {
    name: 'Ansh Agrawal',
    email: 'ansh@example.com',
    handle: '@ansh.agrawal',
    socials: [
      {
        name: 'LinkedIn',
        url: 'https://www.linkedin.com/in/ansh-agrawal/',
      },
      {
        name: 'Youtube',
        url: 'https://www.youtube.com/@ansh',
      },
      {
        name: 'Instagram',
        url: 'https://www.instagram.com/ansh.agrawal/',
      },
      {
        name: 'Discord',
        url: 'https://discord.com/users/ansh',
      },
      {
        name: 'Github',
        url: 'https://github.com/ansh',
      },
      {
        name: 'X',
        url: 'https://x.com/ansh',
      },
    ],
  };

  // Function to handle opening links
  const openLink = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="mx-auto mt-8 w-full">
      <div className="bg-accent w-full overflow-hidden rounded-3xl px-6 py-8 font-sans sm:px-10 md:px-16 md:py-12">
        {/* Header Section */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-foreground text-3xl font-semibold md:text-4xl">
            Contacts
          </h2>
          <span className="mt-2 sm:mt-0">
            {contactInfo.handle}
          </span>
        </div>

        {/* Email Section */}
        <div className="mt-8 flex flex-col md:mt-10">
          <div
            className="group mb-5 cursor-pointer"
            onClick={() => openLink(`mailto:${contactInfo.email}`)}
          >
            <div className="flex items-center gap-1">
              <span className="text-base font-medium text-blue-500 hover:underline sm:text-lg">
                {contactInfo.email}
              </span>
              <ChevronRight className="h-5 w-5 text-blue-500 transition-transform duration-300 group-hover:translate-x-1" />
            </div>
          </div>

          {/* Social Links */}
          <div className="flex flex-wrap gap-x-6 gap-y-5 sm:gap-x-8">
            {contactInfo.socials.map((social) => (
              <button
                key={social.name}
                className="text-muted-foreground hover:text-foreground cursor-pointer text-sm transition-colors"
                onClick={() => openLink(social.url)}
                title={social.name}
              >
                {social.name}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Contact;