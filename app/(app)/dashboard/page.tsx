"use client"

import { Space } from "@/app/generated/prisma/client";
import { CardSpotlightDemo } from "@/components/Card";
import { SpaceCard } from "@/components/SpaceCard";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import axios from "axios";
import { BookHeart, PartyPopper, Plus, Star } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

export default function Dashboard() {
    const [totalSpace, setTotalSpace] = useState<number>(0);
    const [totalTestimonial, setTotalTestimonial] = useState<number>(0);
    const [rating, setRating] = useState<number>(0);
    const [spaces, setSpaces] = useState<Space[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    
    const router = useRouter();

    const handleSpace = async () => {
        try {
            const response = await axios.post("/api/dummy-space");
            toast.success("Success", {
                description: response.data.message
            });
            const spaceId = response.data.spaceId;
            router.push(`/space/${spaceId}`);
        } catch (error) {
            toast.error("Failed to create space");
        }
    }

    const handleDelete = async (e: React.MouseEvent, spaceId: string) => {
        e.preventDefault(); 
        e.stopPropagation(); 
        try {
            await axios.delete(`/api/space?spaceId=${spaceId}`);
            toast.success("Space deleted successfully");
            fetchSpaces();
        } catch (error) {
            toast.error("Failed to delete space");
        }
    };

    const handleEdit = (e: React.MouseEvent, spaceId: string) => {
        e.preventDefault(); 
        e.stopPropagation(); 
        router.push(`/space/${spaceId}`);
    };

    const fetchSpaces = async () => {
        try {
            const response = await axios.get("/api/space");
            setSpaces(response.data.message);
            setTotalSpace(response.data.message.length);
        } catch (error) {
            console.error(error);
            toast.error("Failed to fetch spaces");
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                await fetchSpaces();
                const testimonialResponse = await axios.get("/api/testimonial");
                setTotalTestimonial(testimonialResponse.data.totalTestimonials);
                setRating(testimonialResponse.data.averageRating);
            } catch (error) {
                console.error(error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.15
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                type: "spring",
                stiffness: 100,
                damping: 12,
                duration: 0.6
            }
        }
    };

    const cardContainerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.3
            }
        }
    };

    return (
        <motion.div 
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="min-h-screen pt-32 bg-gradient-to-b from-gray-950 via-gray-900 to-black p-8"
        >
            <motion.div
                variants={itemVariants}
                className="relative mb-12"
            >
                <motion.h1 
                    className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400"
                    animate={{ 
                        backgroundPosition: ["0%", "100%"],
                        transition: { 
                            duration: 8,
                            repeat: Infinity,
                            repeatType: "reverse"
                        }
                    }}
                    style={{ backgroundSize: "200% auto" }}
                >
                    Overview
                </motion.h1>
                <div className="absolute -bottom-4 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500 to-transparent" />
            </motion.div>

            <motion.div 
                variants={itemVariants}
                className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16"
            >
                <AnimatePresence>
                    <motion.div whileHover={{ scale: 1.02 }} transition={{ type: "spring", stiffness: 400 }}>
                        <CardSpotlightDemo heading="Total Spaces" count={totalSpace} icon={<PartyPopper/>}/>
                    </motion.div>
                    <motion.div whileHover={{ scale: 1.02 }} transition={{ type: "spring", stiffness: 400 }}>
                        <CardSpotlightDemo heading="Total Testimonials" count={totalTestimonial} icon={<BookHeart/>}/>
                    </motion.div>
                    <motion.div whileHover={{ scale: 1.02 }} transition={{ type: "spring", stiffness: 400 }}>
                        <CardSpotlightDemo heading="Average Rating" count={rating} icon={<Star/>}/>
                    </motion.div>
                </AnimatePresence>
            </motion.div>

            <motion.div variants={itemVariants} className="mb-8 flex justify-between items-center">
                <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                    Your Spaces
                </h2>
                <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <Button 
                        onClick={handleSpace}
                        className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white shadow-lg hover:shadow-purple-500/25 transition-all duration-300"
                    >
                        <Plus className="w-5 h-5 mr-2" />
                        Create Space
                    </Button>
                    <div className="absolute mt-6 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500 to-transparent" />
                </motion.div>
            </motion.div>

            {isLoading ? (
                <motion.div
                    variants={itemVariants}
                    className="flex items-center justify-center py-12"
                >
                    <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
                </motion.div>
            ) : totalSpace === 0 ? (
                <motion.div
                    variants={itemVariants}
                    className="text-center py-16 bg-gradient-to-r from-gray-800/30 to-purple-900/20 rounded-xl border border-purple-500/20 backdrop-blur-sm"
                >
                    <p className="text-gray-300 text-lg mb-6">You don't have any spaces yet 😔</p>
                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <Button 
                            onClick={handleSpace}
                            className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white shadow-lg hover:shadow-purple-500/25 transition-all duration-300"
                        >
                            <Plus className="w-5 h-5 mr-2" />
                            Create your first space
                        </Button>
                    </motion.div>
                </motion.div>
            ) : (
                <motion.div 
                    variants={cardContainerVariants}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                    {spaces.map((space) => (
                        <Link key={space.id} href={`/user/space/${space.id}`}>
                            <SpaceCard
                                space={space}
                                onEdit={(e: React.MouseEvent) => handleEdit(e, space.id)}
                                onDelete={(e: React.MouseEvent) => handleDelete(e, space.id)}
                            />
                        </Link>
                    ))}
                </motion.div>
            )}
        </motion.div>
    );
}
