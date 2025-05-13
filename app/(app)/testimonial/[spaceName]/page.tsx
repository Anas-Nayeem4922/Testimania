"use client"

import { Question, Space } from "@/app/generated/prisma/client";
import { testimonialSchema, testimonialType } from "@/schemas/testimonialSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { motion, AnimatePresence } from "framer-motion";
import { Star, Loader2, Send } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

export default function Testimonial({ params } : { params: Promise<{ spaceName: string }> }) {
    const [space, setSpace] = useState<Space>();
    const [questions, setQuestions] = useState<Question[]>([]);
    const [rating, setRating] = useState(5);
    const [hoveredStar, setHoveredStar] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    const form = useForm<testimonialType>({
        resolver: zodResolver(testimonialSchema),
        defaultValues: {
            rating: 5,
            review: "",
            userAddress: "",
            userEmail: "",
            userName: "",
            userSocials: ""
        }
    });

    const onSubmit = async (data: testimonialType) => {
        setIsSubmitting(true);
        try {
            data.rating = rating;
            const response = await axios.post(`/api/testimonial/${space?.id}`, data);
            toast.success("Success", {
                description: response.data.message
            });
            form.reset();
        } catch (error) {
            toast.error("Failed to create testimonial");
        } finally {
            setIsSubmitting(false);
        }
    }
    
    const fetchSpaceData = async () => {
        const spaceName = (await params).spaceName.replaceAll(" ", "-").toLowerCase();
        const response = await axios.get(`/api/get-space-data?spaceName=${spaceName}`);
        setSpace(response.data.message);
    }

    const fetchQuestions = async () => {
        if (space?.id) {
            const response = await axios.get(`/api/question?spaceId=${space.id}`);
            setQuestions(response.data.message);
        }
    }

    useEffect(() => {
        fetchSpaceData();
    }, []);

    useEffect(() => {
        fetchQuestions();
    }, [space?.id]);

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
        <div className="min-h-screen pt-28 bg-gradient-to-b from-gray-950 to-gray-900 p-8">
            <motion.div
                initial="hidden"
                animate="visible"
                variants={containerVariants}
                className="max-w-2xl mx-auto space-y-8"
            >
                <motion.div variants={itemVariants}>
                    <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-gray-100 to-gray-400 mb-4">
                        {space?.name || "Loading..."}
                    </h1>
                    <p className="text-gray-400 mb-8">{space?.header}</p>
                </motion.div>

                <motion.div variants={itemVariants} className="bg-gray-800/30 rounded-lg p-6 border border-gray-700 space-y-4">
                    <h2 className="text-xl font-semibold text-gray-200 mb-4">Questions</h2>
                    <AnimatePresence>
                        {questions.map((question, index) => (
                            <motion.div
                                key={question.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                transition={{ delay: index * 0.1 }}
                                className="text-gray-300 mb-2"
                            >
                                {question.message}
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </motion.div>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <motion.div variants={itemVariants} className="space-y-2">
                            <FormLabel className="text-gray-200">Rating</FormLabel>
                            <div className="flex gap-1">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <motion.button
                                        key={star}
                                        type="button"
                                        whileHover={{ scale: 1.2 }}
                                        whileTap={{ scale: 0.9 }}
                                        onClick={() => setRating(star)}
                                        onMouseEnter={() => setHoveredStar(star)}
                                        onMouseLeave={() => setHoveredStar(0)}
                                        className="focus:outline-none"
                                    >
                                        <Star
                                            className={`w-8 h-8 ${
                                                star <= (hoveredStar || rating)
                                                    ? "text-yellow-400 fill-yellow-400"
                                                    : "text-gray-500"
                                            }`}
                                        />
                                    </motion.button>
                                ))}
                            </div>
                        </motion.div>

                        <AnimatePresence>
                            {space?.userName && (
                                <motion.div
                                    variants={itemVariants}
                                    initial="hidden"
                                    animate="visible"
                                    exit="hidden"
                                >
                                    <FormField
                                        control={form.control}
                                        name="userName"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-gray-200">Name</FormLabel>
                                                <FormControl>
                                                    <Input required={true}
                                                        placeholder="Enter your name"
                                                        className="bg-gray-800/50 border-gray-700 focus-visible:border-gray-600 focus-visible:ring-gray-500 text-gray-200 placeholder-gray-500"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </motion.div>
                            )}

                            {space?.userEmail && (
                                <motion.div variants={itemVariants}>
                                    <FormField
                                        control={form.control}
                                        name="userEmail"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-gray-200">Email</FormLabel>
                                                <FormControl>
                                                    <Input required={true}
                                                        type="email"
                                                        placeholder="Enter your email"
                                                        className="bg-gray-800/50 border-gray-700 focus-visible:border-gray-600 focus-visible:ring-gray-500 text-gray-200 placeholder-gray-500"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </motion.div>
                            )}

                            {space?.userAddress && (
                                <motion.div variants={itemVariants}>
                                    <FormField
                                        control={form.control}
                                        name="userAddress"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-gray-200">Address</FormLabel>
                                                <FormControl>
                                                    <Input required={true}
                                                        placeholder="Enter your address"
                                                        className="bg-gray-800/50 border-gray-700 focus-visible:border-gray-600 focus-visible:ring-gray-500 text-gray-200 placeholder-gray-500"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </motion.div>
                            )}

                            {space?.userSocials && (
                                <motion.div variants={itemVariants}>
                                    <FormField
                                        control={form.control}
                                        name="userSocials"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-gray-200">Social Media Links</FormLabel>
                                                <FormControl>
                                                    <Input required={true}
                                                        placeholder="Enter your social media links"
                                                        className="bg-gray-800/50 border-gray-700 focus-visible:border-gray-600 focus-visible:ring-gray-500 text-gray-200 placeholder-gray-500"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <motion.div variants={itemVariants}>
                            <FormField
                                control={form.control}
                                name="review"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-gray-200">Your Review</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder="Share your experience..."
                                                className="bg-gray-800/50 border-gray-700 focus-visible:border-gray-600 focus-visible:ring-gray-500 text-gray-200 placeholder-gray-500 min-h-[150px]"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </motion.div>

                        <motion.div
                            variants={itemVariants}
                            className="pt-4"
                        >
                            <Button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full bg-gray-800 hover:bg-gray-700 text-gray-100 font-medium h-11"
                            >
                                {isSubmitting ? (
                                    <motion.div 
                                        className="flex items-center justify-center gap-2"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                    >
                                        <Loader2 className="h-4 w-4 animate-spin"/>
                                        <span>Submitting...</span>
                                    </motion.div>
                                ) : (
                                    <motion.div 
                                        className="flex items-center justify-center gap-2"
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        <Send className="h-4 w-4" />
                                        <span>Submit Review</span>
                                    </motion.div>
                                )}
                            </Button>
                        </motion.div>
                    </form>
                </Form>
            </motion.div>
        </div>
    );
}