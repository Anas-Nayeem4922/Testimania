"use client"

import { Testimonial } from "@/app/generated/prisma/client";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Star, ThumbsUp, User, Mail, MapPin, Globe } from "lucide-react";
import { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader } from "./card";


export default function TestimonialCarousel({ testimonials }: { testimonials: Testimonial[]}) {
    const [currentIndex, setCurrentIndex] = useState(0);

    const nextSlide = () => {
        setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    };

    const previousSlide = () => {
        setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    };

    if (!testimonials.length) {
        return (
            <div className="text-center text-gray-400">
                No testimonials available yet.
            </div>
        );
    }

    return (
        <div className="relative max-w-4xl mx-auto px-4">
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentIndex}
                    initial={{ opacity: 0, x: 100 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    transition={{ type: "spring", damping: 25, stiffness: 200 }}
                    className="relative"
                >
                    <Card className="bg-gray-800/30 border-gray-700">
                        <CardHeader className="relative">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="h-12 w-12 rounded-full bg-gray-700 flex items-center justify-center">
                                        <User className="h-6 w-6 text-gray-300" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-semibold text-gray-200">
                                            {testimonials[currentIndex].userName || "Anonymous"}
                                        </h3>
                                        {testimonials[currentIndex].userEmail && (
                                            <p className="text-gray-400 flex items-center gap-2">
                                                <Mail className="h-4 w-4" />
                                                {testimonials[currentIndex].userEmail}
                                            </p>
                                        )}
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    {testimonials[currentIndex].isLiked && (
                                        <motion.div
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            className="text-blue-400"
                                        >
                                            <ThumbsUp className="h-5 w-5" />
                                        </motion.div>
                                    )}
                                    <div className="flex">
                                        {[...Array(testimonials[currentIndex].rating)].map((_, i) => (
                                            <Star
                                                key={i}
                                                className="h-5 w-5 text-yellow-400 fill-yellow-400"
                                            />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="pt-6">
                            <p className="text-gray-300 text-lg leading-relaxed">
                                {testimonials[currentIndex].review}
                            </p>
                            {testimonials[currentIndex].userAddress && (
                                <div className="mt-4 flex items-center gap-2 text-gray-400">
                                    <MapPin className="h-4 w-4" />
                                    {testimonials[currentIndex].userAddress}
                                </div>
                            )}
                        </CardContent>
                        {testimonials[currentIndex].userSocials && (
                            <CardFooter className="border-t border-gray-700/50">
                                <div className="flex items-center gap-2 text-gray-400">
                                    <Globe className="h-4 w-4" />
                                    {testimonials[currentIndex].userSocials}
                                </div>
                            </CardFooter>
                        )}
                    </Card>
                </motion.div>
            </AnimatePresence>

            <div className="flex justify-center gap-4 mt-8">
                <button
                    onClick={previousSlide}
                    className="p-2 rounded-full bg-gray-800 hover:bg-gray-700 transition-colors"
                >
                    <ChevronLeft className="h-6 w-6 text-gray-300" />
                </button>
                <button
                    onClick={nextSlide}
                    className="p-2 rounded-full bg-gray-800 hover:bg-gray-700 transition-colors"
                >
                    <ChevronRight className="h-6 w-6 text-gray-300" />
                </button>
            </div>

            <div className="flex justify-center gap-2 mt-4">
                {testimonials.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrentIndex(index)}
                        className={`w-2 h-2 rounded-full transition-colors ${
                            index === currentIndex ? "bg-blue-500" : "bg-gray-600"
                        }`}
                    />
                ))}
            </div>
        </div>
    );
}
