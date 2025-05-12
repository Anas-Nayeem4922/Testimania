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
                staggerChildren: 0.15,
                delayChildren: 0.2
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
                damping: 12
            }
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-black flex items-center justify-center">
                hello
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center gap-6"
                >
                    <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
                    <p className="text-gray-400 text-lg">Loading space data...</p>
                </motion.div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-black flex items-center justify-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center"
                >
                    <p className="text-red-400 text-xl mb-6">{error}</p>
                    <Button
                        onClick={() => window.location.reload()}
                        className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white"
                    >
                        Try Again
                    </Button>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-black p-8 pt-32">
            <motion.div
                initial="hidden"
                animate="visible"
                variants={containerVariants}
                className="max-w-7xl mx-auto"
            >
                .
                {/* Profile Link Section */}
                <motion.div 
                    variants={itemVariants}
                    className="mb-8 bg-gray-800/30 rounded-xl border border-gray-700/50 p-6"
                >
                    <h2 className="text-xl font-semibold text-gray-200 mb-4">Share this with your users to gather testimonials</h2>
                    <div className="flex items-center gap-3">
                        <div className="flex-1 bg-gray-900/50 rounded-lg border border-gray-700/50 p-3 font-mono text-sm text-gray-300">
                            {profileUrl}
                        </div>
                        <Button
                            onClick={copyToClipboard}
                            className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white"
                        >
                            <LinkIcon className="w-4 h-4 mr-2" />
                            Copy Link
                        </Button>
                    </div>
                </motion.div>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Space Details Section */}
                    <motion.div 
                        variants={itemVariants}
                        className="lg:w-2/5"
                    >
                        <div className="bg-gray-800/30 rounded-xl border border-gray-700/50 p-8 sticky top-32">
                            <motion.div
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-center mb-8"
                            >
                                <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">
                                    {spaceData?.name}
                                </h1>
                                <p className="text-gray-300 mt-3">{spaceData?.header}</p>
                                <p className="text-gray-500 mt-4">{spaceData?.description}</p>
                            </motion.div>

                            {/* User Preferences */}
                            <div className="grid grid-cols-2 gap-4 mb-8">
                                {[
                                    { icon: User, label: "Name", value: spaceData?.userName },
                                    { icon: Mail, label: "Email", value: spaceData?.userEmail },
                                    { icon: MapPin, label: "Address", value: spaceData?.userAddress },
                                    { icon: Globe, label: "Socials", value: spaceData?.userSocials }
                                ].map(({ icon: Icon, label, value }, index) => (
                                    <motion.div
                                        key={label}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                        className="flex items-center gap-2 bg-gray-900/30 p-3 rounded-lg"
                                    >
                                        <Icon className="w-5 h-5 text-gray-400" />
                                        <span className="text-gray-300">{label}</span>
                                        <Switch 
                                            className="data-[state=checked]:bg-gradient-to-r from-purple-500 to-blue-500" 
                                            checked={value ?? false} 
                                            disabled 
                                        />
                                    </motion.div>
                                ))}
                            </div>

                            {/* Questions */}
                            <div>
                                <h2 className="text-xl font-semibold text-gray-200 mb-4 flex items-center gap-2">
                                    <MessageSquare className="w-5 h-5" />
                                    Questions
                                </h2>
                                <div className="space-y-3">
                                    <AnimatePresence>
                                        {questions.map((question, index) => (
                                            <motion.div
                                                key={question.id}
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: index * 0.1 }}
                                                className="bg-gray-900/30 rounded-lg p-4 border border-gray-700/50"
                                            >
                                                <p className="text-gray-300">{question.message}</p>
                                            </motion.div>
                                        ))}
                                    </AnimatePresence>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Testimonials Section */}
                    <motion.div 
                        variants={itemVariants}
                        className="lg:w-3/5"
                    >
                        <h2 className="text-2xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400 mb-6 flex items-center gap-2">
                            <Star className="w-6 h-6 text-purple-400" />
                            Testimonials
                        </h2>
                        <div className="space-y-6">
                            <AnimatePresence>
                                {testimonials.map((testimonial, index) => (
                                    <motion.div
                                        key={testimonial.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                    >
                                        <Card className="bg-gray-800/30 border-gray-700/50 hover:bg-gray-800/40 transition-all duration-300">
                                            <CardHeader>
                                                <div className="flex justify-between items-start">
                                                    <div className="space-y-2">
                                                        {testimonial.userName && (
                                                            <div className="flex items-center gap-2">
                                                                <User className="w-4 h-4 text-gray-400" />
                                                                <CardTitle className="text-gray-200">
                                                                    Name: {testimonial.userName}
                                                                </CardTitle>
                                                            </div>
                                                        )}
                                                        {testimonial.userEmail && (
                                                            <div className="flex items-center gap-2">
                                                                <Mail className="w-4 h-4 text-gray-400" />
                                                                <CardDescription className="text-gray-400">
                                                                    Email: {testimonial.userEmail}
                                                                </CardDescription>
                                                            </div>
                                                        )}
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
                                            </CardHeader>
                                            <CardContent className="space-y-3">
                                                <p className="text-gray-300">{testimonial.review}</p>
                                                {testimonial.userAddress && (
                                                    <div className="flex items-center gap-2 text-gray-400">
                                                        <MapPin className="w-4 h-4" />
                                                        Address: {testimonial.userAddress}
                                                    </div>
                                                )}
                                            </CardContent>
                                            {testimonial.userSocials && (
                                                <CardFooter>
                                                    <div className="flex items-center gap-2 text-gray-400">
                                                        <Globe className="w-4 h-4" />
                                                        Socials: {testimonial.userSocials}
                                                    </div>
                                                </CardFooter>
                                            )}
                                        </Card>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    </motion.div>
                </div>
            </motion.div>
        </div>
    );
}