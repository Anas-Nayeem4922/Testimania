"use client"

import { Space } from "@/app/generated/prisma/client";
import { CardSpotlightDemo } from "@/components/Card";
import { SpaceCard } from "@/components/SpaceCard";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { BookHeart, PartyPopper, Plus, Star } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Separator } from "@/components/ui/separator";
import { BackgroundBeams } from "@/components/ui/background-beams";

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

    const handleDelete = async (spaceId: string) => {
        try {
            await axios.delete(`/api/space?spaceId=${spaceId}`);
            toast.success("Space deleted successfully");
            fetchSpaces();
        } catch (error) {
            toast.error("Failed to delete space");
        }
    };

    const handleEdit = (spaceId: string) => {
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
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                type: "spring",
                stiffness: 100,
                damping: 10
            }
        }
    };

    return (
            <motion.div 
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="min-h-screen pt-32 bg-gradient-to-b from-gray-950 to-gray-900 p-8"
        >
            <motion.h1 
                variants={itemVariants}
                className="text-4xl font-extrabold mb-12 text-transparent bg-clip-text bg-gradient-to-r from-gray-100 to-gray-400"
            >
                Overview
            </motion.h1>

            <motion.div 
                variants={itemVariants}
                className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16"
            >
                <CardSpotlightDemo heading="Total Spaces" count={totalSpace} icon={<PartyPopper/>}/>
                <CardSpotlightDemo heading="Total Testimonials" count={totalTestimonial} icon={<BookHeart/>}/>
                <CardSpotlightDemo heading="Average Rating" count={rating} icon={<Star/>}/>
            </motion.div>

            <motion.div variants={itemVariants} className="mb-7">
                <Separator className="opacity-30"/>
            </motion.div>

            <motion.div variants={itemVariants} className="mb-8 flex justify-between items-center">
                <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-gray-100 to-gray-400">
                    Your Spaces
                </h2>
                <Button 
                    onClick={handleSpace}
                    className="cursor-pointer bg-gray-800 hover:bg-gray-700 text-gray-100"
                >
                    <Plus className="w-5 h-5 mr-2" />
                    Create Space
                </Button>
            </motion.div>

            {isLoading ? (
                <motion.div
                    variants={itemVariants}
                    className="text-gray-400 text-center py-12"
                >
                    Loading...
                </motion.div>
            ) : totalSpace === 0 ? (
                <motion.div
                    variants={itemVariants}
                    className="text-center py-12 bg-gray-800/30 rounded-lg border border-gray-700"
                >
                    <p className="text-gray-400 mb-4">You don't have any spaces yet 😔</p>
                    <Button 
                        onClick={handleSpace}
                        className="bg-gray-800 hover:bg-gray-700 cursor-pointer text-gray-100"
                    >
                        <Plus className="w-5 h-5 mr-2" />
                        Create your first space 
                    </Button>
                </motion.div>
            ) : (
                <motion.div 
                    variants={itemVariants}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                    {spaces.map((space) => (
                        <SpaceCard
                            key={space.id}
                            space={space}
                            onEdit={() => handleEdit(space.id)}
                            onDelete={() => handleDelete(space.id)}
                        />
                    ))}
                </motion.div>
            )}
            {/* <BackgroundBeams/> */}
        </motion.div>
        
    );
}