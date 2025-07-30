"use client"

import type React from "react"
import { useState } from "react"

export interface ProfileCardProps {
  name: string
  age: number
  location: string
  title: string
  company: string
  bio: string
  tags: string[]
  profileImage: string
}

const ProfileCard: React.FC<ProfileCardProps> = ({ name, age, location, title, company, bio, tags, profileImage }) => {
  const [imageError, setImageError] = useState(false)

  const fallbackSrc = "/profile.png"

  return (
    <div className="mx-auto w-full max-w-5xl py-4 font-inter">
      <div className="grid grid-cols-1 items-center gap-6 md:grid-cols-2">
        {/* Image section */}
        <div className="relative mx-auto aspect-square w-full max-w-sm">
          <div className="relative h-full w-full overflow-hidden rounded-2xl shadow-lg bg-white">
            <div
              className="h-full w-full"
              style={{
                opacity: 0,
                animation: "scaleIn 0.8s cubic-bezier(0.19, 1, 0.22, 1) forwards",
              }}
            >
              {!imageError ? (
                <img
                  src={profileImage || "/profile.png"}
                  alt={name}
                  className="h-full w-full object-cover object-center"
                  onError={() => setImageError(true)}
                />
              ) : (
                <img
                  src={fallbackSrc || "/placeholder.svg"}
                  alt={name}
                  className="h-full w-full object-cover object-center"
                />
              )}
            </div>
          </div>
        </div>

        {/* Text content section */}
        <div className="flex flex-col space-y-2">
          <div
            style={{
              opacity: 0,
              transform: "translateY(20px)",
              animation: "fadeInUp 0.6s ease-out forwards",
            }}
          >
            <h1 className="bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-2xl font-bold text-transparent md:text-3xl tracking-tight leading-tight">
              {name}
            </h1>
            <div className="mt-1 flex flex-col gap-1 md:flex-row md:items-center md:gap-4">
              <p className="text-gray-600 font-medium text-sm">{age} years old</p>
              <div className="bg-gray-300 hidden h-1.5 w-1.5 rounded-full md:block" />
              <p className="text-gray-600 font-medium text-sm">{location}</p>
            </div>
            <p className="text-gray-800 mt-1 text-base font-semibold">{title}</p>
            <p className="text-gray-500 text-sm mt-0.5 font-medium">{company}</p>
          </div>

          <div
            className="text-gray-800 mt-3 leading-relaxed font-medium text-sm"
            style={{
              opacity: 0,
              transform: "translateY(20px)",
              animation: "fadeInUp 0.6s ease-out 0.2s forwards",
            }}
          >
            {bio.split("\n\n").map((paragraph, index) => (
              <p key={index} className={index > 0 ? "mt-2" : ""}>
                {paragraph}
              </p>
            ))}
          </div>

          {/* Tags/Keywords */}
          <div
            className="mt-3 flex flex-wrap gap-1.5"
            style={{
              opacity: 0,
              animation: "fadeIn 0.5s ease-out 0.6s forwards",
            }}
          >
            {tags.map((tag) => (
              <span
                key={tag}
                className="bg-gray-100 text-gray-700 rounded-full px-2.5 py-1 text-xs font-medium hover:bg-gray-200 transition-colors"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        
        .font-inter {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
        }

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
  )
}

export const profileData: ProfileCardProps = {
  name: "Ansh Agrawal",
  age: 20,
  location: "Gurgaon, Haryana, IN",
  title: "Full-Stack Developer",
  company: "AI/ML + SaaS Enthusiast",
  bio: "Hey 👋\n\nI'm Ansh, a full-stack developer currently studying at Manipal University Jaipur. I'm passionate about AI, web technologies, and building innovative, scalable solutions. I've worked on exam proctoring systems, multilingual voice chatbots, and more.",
  tags: ["AI", "developer", "SaaS builder", "GGN"],
  profileImage: "/profile.png",
}

export default ProfileCard
