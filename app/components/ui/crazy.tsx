"use client"
import { Photos, type PhotoItem } from "./photos"

const Crazy = () => {
  const funPhotos: PhotoItem[] = [
    {
      src: "/kedarnath.jpg",
      alt: "Ansh during Kedarnath trek",
      caption: "Exploring Kedarnath – one of the most unforgettable treks I've done!",
    },
  ]

  return (
    <div className="mx-auto w-full">
      <div className="mb-8">
        <h2 className="text-foreground text-3xl font-semibold md:text-4xl">Kedarnath Trek</h2>
      </div>
      <Photos photos={funPhotos} />
    </div>
  )
}

export default Crazy
