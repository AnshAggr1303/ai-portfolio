"use client"
import { motion } from "framer-motion"
import { Download } from "lucide-react"

export function Resume() {
  // Resume details
  const resumeDetails = {
    title: "Ansh Agrawal's Resume",
    description: "Full Stack Developer • AI Enthusiast",
    fileType: "PDF",
    lastUpdated: "January 2025",
    fileSize: "0.9 MB",
    previewImageSrc: "/resume_ansh_preview.png",
    downloadUrl: "/ANSH-AGRAWAL-CV.pdf",
  }

  const handleDownload = () => {
    // Create a link element
    const link = document.createElement("a")
    link.href = resumeDetails.downloadUrl
    link.download = resumeDetails.downloadUrl.split("/").pop() || "resume.pdf"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="mx-auto w-full py-8 font-sans">
      <motion.div
        onClick={handleDownload}
        className="group relative cursor-pointer overflow-hidden rounded-xl bg-accent p-0 transition-all duration-300"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.0, ease: "easeOut" }}
        whileHover={{ scale: 1.01 }}
      >
        {/* Preview Image */}
        <div className="aspect-[3/4] w-full overflow-hidden rounded-t-xl">
          <img
            src={resumeDetails.previewImageSrc || "/placeholder.svg"}
            alt="Resume Preview"
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>

        {/* Details area */}
        <div className="p-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium text-foreground">{resumeDetails.title}</h3>
              <p className="text-sm text-muted-foreground">{resumeDetails.description}</p>
              <div className="mt-1 flex text-xs text-muted-foreground">
                <span>{resumeDetails.fileType}</span>
                <span className="mx-2">•</span>
                <span>Updated {resumeDetails.lastUpdated}</span>
                <span className="mx-2">•</span>
                <span>{resumeDetails.fileSize}</span>
              </div>
            </div>
            {/* Download indicator */}
            <motion.div
              className="flex h-10 w-10 items-center justify-center rounded-full bg-black text-primary-foreground group-hover:bg-black/80"
              initial={{ scale: 1 }}
            >
              <Download className="h-5 w-5" />
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default Resume
