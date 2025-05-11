"use client"

import { Question, Space, Testimonial } from "@/app/generated/prisma/client";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { useEffect, useState } from "react";
import { Loader2, Star, MessageSquare, User, Mail, MapPin, Globe, LinkIcon } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function SpaceInfo({ params } : { params: Promise<{ spaceId: string }>}) {
    const [spaceData, setSpaceData] = useState<Space>();
    const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
    const [questions, setQuestions] = useState<Question[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchSpaceData = async () => {
        try {
            const spaceId = (await params).spaceId;
            const response = await axios.get(`/api/space/${spaceId}`);
            setSpaceData(response.data.message);
            setError(null);
        } catch (err) {
            setError("Failed to load space data");
            console.error(err);
        }
    }

    const fetchTestimonials = async () => {
        try {
            const spaceId = (await params).spaceId;
            const response = await axios.get(`/api/testimonial/${spaceId}`);
            setTestimonials(response.data.message);
            setError(null);
        } catch (err) {
            setError("Failed to load testimonials");
            console.error(err);
        }
    }

    const fetchQuestions = async () => {
        try {
            const spaceId = (await params).spaceId;
            const response = await axios.get(`/api/question?spaceId=${spaceId}`);
            setQuestions(response.data.message);
            setError(null);
        } catch (err) {
            setError("Failed to load questions");
            console.error(err);
        }
    }

    const baseUrl = `${window.location.protocol}//${window.location.host}`
    const spaceName = spaceData?.name?.replaceAll(" ", "-").toLowerCase();
    const profileUrl = `${baseUrl}/testimonial/${spaceName}`

    const copyToClipboard = () => {
        navigator.clipboard.writeText(profileUrl)
        toast.success("Success", {
            description: "URL copied successfully"
        })
    }

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            await Promise.all([
                fetchTestimonials(),
                fetchSpaceData(),
                fetchQuestions()
            ]);
            setLoading(false);
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

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-gray-950 to-gray-900 flex items-center justify-center">
                .
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col items-center gap-4"
                >
                    <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                    <p className="text-gray-400">Loading space data...</p>
                </motion.div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-gray-950 to-gray-900 flex items-center justify-center">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-red-400 text-center"
                >
                    <p>{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="mt-4 px-4 py-2 bg-gray-800 rounded-md hover:bg-gray-700 transition-colors"
                    >
                        Retry
                    </button>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-950 to-gray-900 p-8 pt-32">
            <motion.div
                initial="hidden"
                animate="visible"
                variants={containerVariants}
                className="max-w-6xl mx-auto space-y-12"
            >
                <div className="space-y-3">
                        <h2 className="text-lg font-semibold text-white">Your Profile Link</h2>
                        <div className="flex items-center gap-2">
                            <div className="flex-1 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 p-3 font-mono text-sm">
                                {profileUrl}
                            </div>
                            <Button
                                onClick={copyToClipboard}
                                variant="outline"
                                className="flex items-center gap-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                            >
                                <LinkIcon className="w-4 h-4" />
                                Copy
                            </Button>
                        </div>
                    </div>
                {/* Space Details and Questions Section */}
                <motion.div variants={itemVariants} className="bg-gray-800/30 rounded-xl border border-gray-700 p-8">
                    <div className="text-center mb-8">
                        <motion.h1 
                            className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-gray-100 to-gray-400"
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            {spaceData?.name}
                        </motion.h1>
                        <motion.p 
                            className="text-gray-400 mt-2"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.2 }}
                        >
                            {spaceData?.header}
                        </motion.p>
                        <motion.p 
                            className="text-gray-500 mt-4"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.3 }}
                        >
                            {spaceData?.description}
                        </motion.p>
                    </div>

                    {/* User Preferences */}
                    <motion.div 
                        className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
                        variants={itemVariants}
                    >
                        <div className="flex items-center gap-2">
                            <User className="w-5 h-5 text-gray-400" />
                            <span className="text-gray-300">Name</span>
                            <Switch className="data-[state=checked]:bg-white" checked={spaceData?.userName ?? false} disabled />
                        </div>
                        <div className="flex items-center gap-2">
                            <Mail className="w-5 h-5 text-gray-400" />
                            <span className="text-gray-300">Email</span>
                            <Switch className="data-[state=checked]:bg-white" checked={spaceData?.userEmail ?? false} disabled />
                        </div>
                        <div className="flex items-center gap-2">
                            <MapPin className="w-5 h-5 text-gray-400" />
                            <span className="text-gray-300">Address</span>
                            <Switch className="data-[state=checked]:bg-white" checked={spaceData?.userAddress ?? false} disabled />
                        </div>
                        <div className="flex items-center gap-2">
                            <Globe className="w-5 h-5 text-gray-400" />
                            <span className="text-gray-300">Socials</span>
                            <Switch className="data-[state=checked]:bg-white" checked={spaceData?.userSocials ?? false} disabled />
                        </div>
                    </motion.div>

                    {/* Questions */}
                    <motion.div variants={itemVariants}>
                        <h2 className="text-2xl font-semibold text-gray-200 mb-6 flex items-center gap-2">
                            <MessageSquare className="w-6 h-6" />
                            Questions
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <AnimatePresence>
                                {questions.map((question, index) => (
                                    <motion.div
                                        key={question.id}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                        className="bg-gray-800/50 rounded-lg p-6 border border-gray-700"
                                    >
                                        <p className="text-gray-300">{question.message}</p>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    </motion.div>
                </motion.div>

                {/* Testimonials Section */}
                <motion.div variants={itemVariants}>
                    <h2 className="text-2xl font-semibold text-gray-200 mb-6 flex items-center gap-2">
                        <Star className="w-6 h-6" />
                        Testimonials
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <AnimatePresence>
                            {testimonials.map((testimonial, index) => (
                                <motion.div
                                    key={testimonial.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                >
                                    <Card className="bg-gray-800/30 border-gray-700 hover:bg-gray-800/40 transition-colors">
                                        <CardHeader>
                                            <div className="flex justify-between items-start">
                                                <div className="flex items-center gap-2">
                                                    <User className="w-5 h-5 text-gray-400" />
                                                    <CardTitle className="text-gray-200">
                                                        {testimonial.userName || "Anonymous"}
                                                    </CardTitle>
                                                </div>
                                                <div className="flex">
                                                    {[...Array(testimonial.rating)].map((_, i) => (
                                                        <Star
                                                            key={i}
                                                            className="w-4 h-4 text-yellow-400 fill-yellow-400"
                                                        />
                                                    ))}
                                                </div>
                                            </div>
                                            {testimonial.userEmail && (
                                                <CardDescription className="text-gray-400">
                                                    {testimonial.userEmail}
                                                </CardDescription>
                                            )}
                                        </CardHeader>
                                        <CardContent>
                                            <p className="text-gray-300">{testimonial.review}</p>
                                            {testimonial.userAddress && (
                                                <p className="text-gray-500 mt-2">
                                                    {testimonial.userAddress}
                                                </p>
                                            )}
                                        </CardContent>
                                        {testimonial.userSocials && (
                                            <CardFooter className="text-gray-400 text-sm">
                                                {testimonial.userSocials}
                                            </CardFooter>
                                        )}
                                    </Card>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                </motion.div>
            </motion.div>
        </div>
    );
}