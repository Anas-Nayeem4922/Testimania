"use client"

import { Question, Space } from "@/app/generated/prisma/client";
import SpaceForm from "@/components/SpaceForm";
import SpacePreview from "@/components/SpacePreview";
import { spaceSchema, spaceType } from "@/schemas/spaceSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useParams } from "next/navigation"
import { useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function SpacePage() {
    const { spaceId } = useParams<{ spaceId: string }>();
    const [questions, setQuestions] = useState<Question[]>([]);
    const [spaceData, setSpaceData] = useState<Space>();

    const form = useForm<spaceType>({
        resolver: zodResolver(spaceSchema),
        defaultValues: {
            name: "",
            header: "",
            description: "",
            userName: false,
            userEmail: false,
            userSocials: false,
            userAddress: false
        }
    });

    const formData = useWatch({ control: form.control });

    const fetchQuestions = async () => {
        try {
            const response = await axios.get(`/api/question?spaceId=${spaceId}`);
            setQuestions(response.data.message);
        } catch (error) {
            toast.error("Failed to fetch questions");
        }
    };

    const fetchSpaceData = async () => {
        try {
            const response = await axios.get(`/api/space/${spaceId}`);
            setSpaceData(response.data.message);
        } catch (error) {
            toast.error("Failed to fetch default space data");
        }
    }

    useEffect(() => {
        if (!spaceId) return;
        fetchQuestions();
        fetchSpaceData();
    }, [spaceId]);

    useEffect(() => {
        if (spaceData) {
            form.reset({
                name: spaceData.name || "",
                header: spaceData.header || "",
                description: spaceData.description || "",
                userName: spaceData.userName || false,
                userAddress: spaceData.userAddress || false,
                userSocials: spaceData.userSocials || false,
                userEmail: spaceData.userEmail || false
            });
        }
    }, [spaceData, form]);

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-950 to-gray-900 text-white">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="container mx-auto px-4 py-8 pt-32"
            >
                <motion.h1
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-4xl font-bold text-center mb-12 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400"
                >
                    Customize Your Space
                </motion.h1>

                {/* Desktop View */}
                <div className="hidden lg:flex gap-8">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="w-1/2"
                    >
                        <SpaceForm
                            spaceId={spaceId}
                            fetchQuestions={fetchQuestions}
                            form={form}
                            questions={questions}
                        />
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="w-1/2 sticky top-32 h-[calc(100vh-8rem)]"
                    >
                        <SpacePreview formData={formData as spaceType} questions={questions} />
                    </motion.div>
                </div>

                {/* Mobile View */}
                <div className="lg:hidden">
                    <Tabs defaultValue="edit" className="w-full">
                        <TabsList className="grid w-full grid-cols-2 mb-8">
                            <TabsTrigger value="edit">Edit</TabsTrigger>
                            <TabsTrigger value="preview">Preview</TabsTrigger>
                        </TabsList>
                        <TabsContent value="edit">
                            <SpaceForm
                                spaceId={spaceId}
                                fetchQuestions={fetchQuestions}
                                form={form}
                                questions={questions}
                            />
                        </TabsContent>
                        <TabsContent value="preview">
                            <SpacePreview formData={formData as spaceType} questions={questions} />
                        </TabsContent>
                    </Tabs>
                </div>
            </motion.div>
        </div>
    );
}
