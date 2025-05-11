"use client";

import Hero from "@/components/Hero";
import { LandingPageSection } from "@/components/LandingPageSection";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

export default function Home() {
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: false
  });

  return (
    <div className="min-h-screen min-w-full bg-gradient-to-b from-gray-950 to-gray-900 text-white overflow-hidden">
      <motion.div
        initial={{ opacity: 1 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <Hero />
      </motion.div>
      
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 100 }}
        animate={{ 
          opacity: inView ? 1 : 0,
          y: inView ? 0 : 100
        }}
        transition={{
          duration: 0.8,
          ease: "easeOut"
        }}
        className="scroll-smooth"
      >
        <LandingPageSection />
      </motion.div>
    </div>
  );
}