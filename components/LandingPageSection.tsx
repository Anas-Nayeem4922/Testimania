"use client";
import React from "react";
import { BackgroundBeams } from "./ui/background-beams";
import { TextGenerateEffect } from "./ui/text-generate-effect";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const words = "Add testimonials to your website with no coding!";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: "easeOut",
    },
  },
};

export function LandingPageSection() {
  return (
    <div className="min-h-screen w-full rounded-md bg-neutral-950 relative antialiased px-4 py-16 md:px-8">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="max-w-7xl mx-auto space-y-24"
      >
        <motion.div 
          variants={itemVariants}
          className="flex flex-col justify-center items-center mb-16 text-center"
        >
          <TextGenerateEffect words={words} />
        </motion.div>

        <motion.div 
          variants={itemVariants}
          className="grid md:grid-cols-2 gap-12 items-center"
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="relative group"
          >
            <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg blur opacity-25 group-hover:opacity-75 transition duration-1000"></div>
            <img 
              src="https://firebasestorage.googleapis.com/v0/b/testimonialto.appspot.com/o/assets%2Ffeatures%2FEasy%20to%20manage%20(1).png?alt=media&token=5d3ae5f2-e35b-4e35-8070-acde541c18ec" 
              alt="Dashboard" 
              className="relative rounded-lg shadow-2xl w-full"
            />
          </motion.div>
          <motion.div 
            variants={itemVariants}
            className="space-y-6"
          >
            <h2 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">
              A dashboard to manage all testimonials
            </h2>
            <p className="text-gray-400 text-lg leading-relaxed">
              You will have a simple & clean dashboard to manage all testimonials in one place. It's like your email inbox, but it's designed for your social proof!
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-3 rounded-lg text-white font-medium group"
            >
              Learn More
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </motion.button>
          </motion.div>
        </motion.div>

        <motion.div 
          variants={itemVariants}
          className="grid md:grid-cols-2 gap-12 items-center"
        >
          <motion.div className="space-y-6 order-2 md:order-1">
            <h2 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-amber-400 to-orange-400">
                The best testimonials all in one place
            </h2>
            <p className="text-gray-400 text-lg leading-relaxed">
              Treat the Wall of Love as the place to showcase all your favorite testimonials. You can embed it to your website in under a minute. No coding knowledge required!
            </p>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="relative group order-1 md:order-2"
          >
            <div className="absolute -inset-1 bg-gradient-to-r from-amber-600 to-orange-600 rounded-lg blur opacity-25 group-hover:opacity-75 transition duration-1000"></div>
            <img src="https://firebasestorage.googleapis.com/v0/b/testimonialto.appspot.com/o/assets%2Ffeatures%2Fwall-of-love.png?alt=media&token=74e955e5-a21b-4cc6-ab05-d497b7fb313a" alt="Wall of Love" className="relative rounded-lg shadow-2xl w-full"/>
          </motion.div>
        </motion.div>

        <motion.div 
          variants={itemVariants}
          className="grid md:grid-cols-2 gap-12 items-center"
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="relative group"
          >
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-teal-600 rounded-lg blur opacity-25 group-hover:opacity-75 transition duration-1000"></div>
            <img src="https://firebasestorage.googleapis.com/v0/b/testimonialto.appspot.com/o/assets%2Ffeatures%2Flanding-page.png?alt=media&token=269a1a1c-4539-4d94-aa9e-ed0425eb1fce" className="relative rounded-lg shadow-2xl w-full" alt="" />
            
          </motion.div>
          <motion.div className="space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-teal-400">
              Blazing Fast Performance
            </h2>
            <p className="text-gray-400 text-lg leading-relaxed">
              Experience lightning-fast load times and smooth animations. Our platform is optimized for speed and efficiency, ensuring your testimonials look great and load quickly.
            </p>
          </motion.div>
        </motion.div>
      </motion.div>
      <BackgroundBeams />
    </div>
  );
}
