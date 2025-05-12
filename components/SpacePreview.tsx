"use client"

import { Question } from "@/app/generated/prisma/client";
import { spaceType } from "@/schemas/spaceSchema";
import { motion, AnimatePresence } from "framer-motion";
import { Star, User, Mail, MapPin, Globe, MessageSquare } from "lucide-react";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";

export default function SpacePreview({
    formData,
    questions
}: {
    formData: spaceType,
    questions: Question[]
}) {
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
            className="bg-gray-800/30 rounded-xl border border-gray-700 p-6 overflow-y-auto h-full"
        >
            <div className="space-y-8">
                <motion.div variants={itemVariants} className="text-center">
                    <h2 className="text-2xl font-bold mb-3 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">
                        {formData.name || "Your Space Name"}
                    </h2>
                    <p className="text-gray-300 text-lg">
                        {formData.header || "Your Header Title"}
                    </p>
                    <p className="text-gray-400 mt-4">
                        {formData.description || "Your description will appear here..."}
                    </p>
                </motion.div>

                <motion.div variants={itemVariants} className="space-y-6">
                    <div className="flex items-center gap-2 mb-4">
                        <Star className="w-5 h-5 text-yellow-400" />
                        <h3 className="text-lg font-semibold text-gray-200">Rating</h3>
                    </div>
                    <div className="flex gap-1 mb-6">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                                key={star}
                                className="w-6 h-6 text-yellow-400 fill-yellow-400"
                            />
                        ))}
                    </div>

                    <div className="space-y-4">
                        <Label className="text-gray-200">Your Review</Label>
                        <Textarea
                            disabled
                            placeholder="Share your experience..."
                            className="bg-gray-900/50 border-gray-700 min-h-[100px]"
                        />
                    </div>

                    <AnimatePresence>
                        {formData.userName && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                className="space-y-2"
                            >
                                <Label className="flex items-center gap-2 text-gray-300">
                                    <User className="w-4 h-4" />
                                    Your Name
                                </Label>
                                <Input
                                    disabled
                                    placeholder="John Doe"
                                    className="bg-gray-900/50 border-gray-700"
                                />
                            </motion.div>
                        )}

                        {formData.userEmail && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                className="space-y-2"
                            >
                                <Label className="flex items-center gap-2 text-gray-300">
                                    <Mail className="w-4 h-4" />
                                    Your Email
                                </Label>
                                <Input
                                    disabled
                                    placeholder="john@example.com"
                                    className="bg-gray-900/50 border-gray-700"
                                />
                            </motion.div>
                        )}

                        {formData.userAddress && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                className="space-y-2"
                            >
                                <Label className="flex items-center gap-2 text-gray-300">
                                    <MapPin className="w-4 h-4" />
                                    Your Address
                                </Label>
                                <Input
                                    disabled
                                    placeholder="123 Main St, City"
                                    className="bg-gray-900/50 border-gray-700"
                                />
                            </motion.div>
                        )}

                        {formData.userSocials && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                className="space-y-2"
                            >
                                <Label className="flex items-center gap-2 text-gray-300">
                                    <Globe className="w-4 h-4" />
                                    Your Social Links
                                </Label>
                                <Input
                                    disabled
                                    placeholder="https://twitter.com/username"
                                    className="bg-gray-900/50 border-gray-700"
                                />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>

                {questions.length > 0 && (
                    <motion.div variants={itemVariants} className="space-y-6">
                        <div className="flex items-center gap-2">
                            <MessageSquare className="w-5 h-5 text-blue-400" />
                            <h3 className="text-lg font-semibold text-gray-200">Additional Questions</h3>
                        </div>
                        <Card className="bg-gray-800/30 border-gray-700">
                            <CardContent className="space-y-4 pt-6">
                                {questions.map((question, index) => (
                                    <motion.div
                                        key={question.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                        className="space-y-2"
                                    >
                                        <Label className="text-gray-300">{question.message}</Label>
                                        <Textarea
                                            disabled
                                            placeholder="Your answer..."
                                            className="bg-gray-900/50 border-gray-700"
                                        />
                                    </motion.div>
                                ))}
                            </CardContent>
                        </Card>
                    </motion.div>
                )}

                <motion.div variants={itemVariants}>
                    <Button
                        disabled
                        className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white"
                    >
                        Submit Review
                    </Button>
                </motion.div>
            </div>
        </motion.div>
    );
}
