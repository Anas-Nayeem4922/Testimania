"use client"

import { Testimonial } from "@/app/generated/prisma/client";
import TestimonialCarousel from "@/components/ui/carousel";
import axios from "axios";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";


export default function iFrame({ params } : { params: Promise<{ spaceId: string }>}) {
    const [testimonials, setTestimonials] = useState<Testimonial[]>([]);

    const fetchTestimonials = async () => {
        try {
            const spaceId = (await params).spaceId;
            const response = await axios.get(`/api/wall-of-love?spaceId=${spaceId}`);
            setTestimonials(response.data.message);
        } catch (error) {
            console.error("Failed to fetch testimonials:", error);
        }
    }
    
    useEffect(() => {
        fetchTestimonials();
    }, [params]);

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-950 to-gray-900 py-16 px-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-7xl mx-auto"
            >
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="text-center mb-16"
                >
                    <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400 mb-4">
                        Wall of Love
                    </h1>
                    <p className="text-gray-400 text-lg">
                        See what others are saying about us
                    </p>
                </motion.div>

                <TestimonialCarousel testimonials={testimonials} />
            </motion.div>
        </div>
    );
}