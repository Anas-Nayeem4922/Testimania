"use client"

import type { Testimonial } from "@/app/generated/prisma/client"
import TestimonialCarousel from "@/components/ui/carousel"
import axios from "axios"
import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { BentoGrid, TestimonialBentoItem } from "@/components/ui/bento-grid"

export default function iFrame({ params }: { params: Promise<{ slug: string[] }> }) {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [layout, setLayout] = useState<string>("")
  const [spaceId, setSpaceId] = useState<string>("")

  const fetchTestimonials = async () => {
    try {
      if ((await params).slug && (await params).slug.length > 0) {
        const currentSpaceId = (await params).slug[0]
        setSpaceId(currentSpaceId)

        if ((await params).slug.length > 1) {
          setLayout((await params).slug[1])
        }

        const response = await axios.get(`/api/wall-of-love?spaceId=${currentSpaceId}`)
        setTestimonials(response.data.message)
      } else {
        console.error("No spaceId provided in the URL")
      }
    } catch (error) {
      console.error("Failed to fetch testimonials:", error)
    }
  }

  useEffect(() => {
    fetchTestimonials()
  }, [params])

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 to-gray-900 py-16 px-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-7xl mx-auto">

        {testimonials.length > 0 ? (
          layout === "carousel" && <TestimonialCarousel testimonials={testimonials} /> ||
          layout === "masonry" && <div className="text-white">
             <BentoGrid className="max-w-7xl mx-auto">
              {testimonials.map((testimonial, i) => (
                <TestimonialBentoItem
                  key={testimonial.id || i}
                  testimonial={testimonial}
                  className={i === 3 || i === 5 ? "md:col-span-2" : ""}
                />
              ))}
            </BentoGrid>
          </div> ||
          <div className="text-white">No valid layout given</div>
        ) : (
          <div className="text-center text-gray-400">Loading testimonials...</div>
        )}
      </motion.div>
    </div>
  )
}
