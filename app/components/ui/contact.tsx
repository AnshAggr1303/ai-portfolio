"use client"
import { Github, Linkedin, Instagram } from "lucide-react"

export function Contact() {
  // Contact information - Email and social links (no phone number)
  const contactInfo = {
    name: "Ansh Agrawal",
    email: "anshagrawal148@gmail.com",
    handle: "@_anshhagrawal_",
    social: [
      {
        name: "LinkedIn",
        url: "https://linkedin.com/in/ansh-agrawal-dev",
        icon: <Linkedin className="h-5 w-5" />,
      },
      {
        name: "GitHub",
        url: "https://github.com/AnshAggr1303",
        icon: <Github className="h-5 w-5" />,
      },
      {
        name: "Instagram",
        url: "https://instagram.com/_anshhagrawal_",
        icon: <Instagram className="h-5 w-5" />,
      },
    ],
  }

  // Function to handle opening links
  const openLink = (url: string) => {
    window.open(url, "_blank", "noopener,noreferrer")
  }

  return (
    <div className="mx-auto mt-8 w-full">
      <div className="bg-accent w-full overflow-hidden rounded-3xl px-6 py-8 font-sans sm:px-10 md:px-16 md:py-12">
        {/* Header Section */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-foreground text-3xl font-semibold md:text-4xl">Contacts</h2>
          <span className="mt-2 sm:mt-0">{contactInfo.handle}</span>
        </div>

        {/* Email Section */}
        <div className="mt-8 flex flex-col md:mt-10">
          <div className="group mb-6 cursor-pointer" onClick={() => openLink(`mailto:${contactInfo.email}`)}>
            <span className="text-base font-medium text-blue-500 hover:underline sm:text-lg">{contactInfo.email}</span>
          </div>

          {/* Social Links - Horizontal Layout */}
          <div className="flex flex-wrap gap-6">
            {contactInfo.social.map((social, index) => (
              <div
                key={index}
                className="group flex cursor-pointer items-center gap-3 transition-colors hover:text-blue-500"
                onClick={() => openLink(social.url)}
              >
                {social.icon}
                <span className="text-base font-medium hover:underline">{social.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Contact
