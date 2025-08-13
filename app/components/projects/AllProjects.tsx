"use client"

import { Card, Carousel } from "@/components/projects/apple-cards-carousel"
import { data } from "@/components/projects/Data"

export default function AllProjects() {
  const cards = data.map((card, index) => <Card key={card.src} card={card} index={index} layout={true} />)

  console.log(data[0])

  return (
    <div className="w-full h-full pt-8">
      <h2 className="max-w-7xl mx-auto text-xl md:text-3xl font-bold font-sans project-heading">
        My Projects
      </h2>
      <Carousel items={cards} />
    </div>
  )
}