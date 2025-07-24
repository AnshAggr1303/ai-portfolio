'use client';

import React, { useState } from 'react';

export interface ProfileCardProps {
  name: string;
  age: number;
  location: string;
  title: string;
  company: string;
  bio: string;
  tags: string[];
  profileImage: string;
}

const ProfileCard: React.FC<ProfileCardProps> = ({
  name,
  age,
  location,
  title,
  company,
  bio,
  tags,
  profileImage,
}) => {
  const [imageError, setImageError] = useState(false);

  const fallbackSrc =
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face';

  return (
    <div className="mx-auto w-full max-w-5xl py-6 font-sans">
      <div className="grid grid-cols-1 items-center gap-10 md:grid-cols-2">
        {/* Image section */}
        <div className="relative mx-auto aspect-square w-full max-w-sm">
          <div className="relative h-full w-full overflow-hidden rounded-2xl border-2 border-gray-100 shadow-lg bg-white">
            <div
              className="h-full w-full"
              style={{
                transform: 'scale(0.92)',
                opacity: 0,
                animation: 'scaleIn 0.8s cubic-bezier(0.19, 1, 0.22, 1) forwards',
              }}
            >
              {!imageError ? (
                <img
                  src={profileImage}
                  alt={name}
                  className="h-full w-full object-cover object-center"
                  onError={() => setImageError(true)}
                />
              ) : (
                <img
                  src={fallbackSrc}
                  alt={name}
                  className="h-full w-full object-cover object-center"
                />
              )}
            </div>
          </div>
        </div>

        {/* Text content section */}
        <div className="flex flex-col space-y">
          <div
            style={{
              opacity: 0,
              transform: 'translateY(20px)',
              animation: 'fadeInUp 0.6s ease-out forwards',
            }}
          >
            <h1 className="bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-xl font-semibold text-transparent md:text-3xl">
              {name}
            </h1>
            <div className="mt-1 flex flex-col gap-1 md:flex-row md:items-center md:gap-4">
              <p className="text-gray-600">{age} years old</p>
              <div className="bg-gray-300 hidden h-1.5 w-1.5 rounded-full md:block" />
              <p className="text-gray-600">{location}</p>
            </div>
            <p className="text-gray-700 mt-2 text-base font-medium">{title}</p>
            <p className="text-gray-500 text-sm">{company}</p>
          </div>

          <p
            className="text-gray-900 mt-6 leading-relaxed whitespace-pre-line"
            style={{
              opacity: 0,
              transform: 'translateY(20px)',
              animation: 'fadeInUp 0.6s ease-out 0.2s forwards',
            }}
          >
            {bio}
          </p>

          {/* Tags/Keywords */}
          <div
            className="mt-4 flex flex-wrap gap-2"
            style={{
              opacity: 0,
              animation: 'fadeIn 0.5s ease-out 0.6s forwards',
            }}
          >
            {tags.map((tag) => (
              <span
                key={tag}
                className="bg-gray-100 text-gray-700 rounded-full px-3 py-1 text-sm"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes scaleIn {
          to {
            transform: scale(1);
            opacity: 1;
          }
        }

        @keyframes fadeInUp {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeIn {
          to {
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};

export const profileData: ProfileCardProps = {
  name: "Ansh Agrawal",
  age: 20,
  location: "Gurgaon, Haryana, IN",
  title: "Full-Stack Developer",
  company: "AI/ML + SaaS Enthusiast",
  bio: "Hey 👋\n\nI'm Ansh, a full-stack developer currently studying at Manipal University Jaipur. I'm passionate about AI, web technologies, and building innovative, scalable solutions. I've worked on exam proctoring systems, multilingual voice chatbots, and more.",
  tags: ["AI", "developer", "SaaS builder", "GGN"],
  profileImage: "/profile.png",
};

export default ProfileCard;