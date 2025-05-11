"use client"

import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { spaceSchema, spaceType } from "@/schemas/spaceSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Textarea } from "./ui/textarea";
import { useEffect, useState } from "react";
import { Question, Space } from "@/app/generated/prisma/client";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, Plus, Pencil, Trash2, Save, X, ChevronDown } from "lucide-react";
import { toast } from "sonner";
import { Checkbox } from "./ui/checkbox";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useRouter } from "next/navigation";

export default function SpaceForm({ spaceId }: { spaceId: string }) {
    const [questions, setQuestions] = useState<Question[]>([]);
    const [spaceData, setSpaceData] = useState<Space>()
    const [newQuestion, setNewQuestion] = useState("");
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editingText, setEditingText] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [spaceName, setSpaceName] = useState("");

    const router = useRouter();
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


    const onSubmit = async (data: spaceType) => {
        setIsSubmitting(true);
        try {
            // Handle form submission
            const response = await axios.post(`/api/space?spaceId=${spaceId}`, {
                name: data.name,
                header: data.header,
                description: data.description,
                userName: data.userName,
                userEmail: data.userEmail,
                userSocials: data.userSocials,
                userAddress: data.userAddress,
                questions: questions
            });
            toast.success(response.data.message);
            router.push("/dashboard");
        } catch (error) {
            toast.error("Failed to update space");
        } finally {
            setIsSubmitting(false);
        }
    }

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
      

    const addQuestion = async () => {
        if (!newQuestion.trim()) return;
        setIsLoading(true);
        try {
            await axios.post(`/api/question?spaceId=${spaceId}`, {
                message: newQuestion
            });
            await fetchQuestions();
            setNewQuestion("");
            toast.success("Question added successfully");
        } catch (error) {
            toast.error("Failed to add question");
        } finally {
            setIsLoading(false);
        }
    };

    const updateQuestion = async (id: number) => {
        if (!editingText.trim()) return;
        setIsLoading(true);
        try {
            await axios.put(`/api/question?spaceId=${spaceId}`, {
                id,
                message: editingText
            });
            await fetchQuestions();
            setEditingId(null);
            toast.success("Question updated successfully");
        } catch (error) {
            toast.error("Failed to update question");
        } finally {
            setIsLoading(false);
        }
    };

    const deleteQuestion = async (id: number) => {
        setIsLoading(true);
        try {
            await axios.delete(`/api/question?spaceId=${spaceId}`, {
                data: { id }
            });
            await fetchQuestions();
            toast.success("Question deleted successfully");
        } catch (error) {
            toast.error("Failed to delete question");
        } finally {
            setIsLoading(false);
        }
    };

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

    const userInfoFields = [
        {
            name: "userName" as const,
            label: "Name",
            description: "Collect the user's full name"
        },
        {
            name: "userEmail" as const,
            label: "Email Address",
            description: "Collect the user's email address for verification"
        },
        {
            name: "userSocials" as const,
            label: "Social Media Links",
            description: "Allow users to share their social media profiles"
        },
        {
            name: "userAddress" as const,
            label: "Address",
            description: "Collect the user's physical address"
        }
    ];

    return (
        <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="max-w-2xl mx-auto p-6 space-y-8"
        >
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <motion.div variants={itemVariants}>
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-lg font-semibold">Space name</FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            onChange={(e) => {
                                                field.onChange(e);
                                                setSpaceName(e.target.value);
                                            }}
                                            className="bg-gray-800/50 border-gray-700 focus-visible:border-gray-600 focus-visible:ring-gray-500 text-gray-200 placeholder-gray-500 h-11"
                                        />
                                    </FormControl>
                                    <FormDescription className="text-gray-400">
                                        Public URL is: testimania.ezzcrafts.com/testimonial/{spaceName.replaceAll(" ", "-").toLowerCase() || "your-space"}
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </motion.div>

                    <motion.div variants={itemVariants}>
                        <FormField
                            control={form.control}
                            name="header"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-lg font-semibold">Header title</FormLabel>
                                    <FormControl>
                                        <Input 
                                            placeholder="Would you like to give a shoutout"
                                            className="bg-gray-800/50 border-gray-700 focus-visible:border-gray-600 focus-visible:ring-gray-500 text-gray-200 placeholder-gray-500 h-11"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </motion.div>

                    <motion.div variants={itemVariants}>
                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-lg font-semibold">Your custom message</FormLabel>
                                    <FormControl>
                                        <Textarea 
                                            placeholder="Write a warm message to your customers, and give them simple directions on how to make the best testimonial"
                                            className="bg-gray-800/50 border-gray-700 focus-visible:border-gray-600 focus-visible:ring-gray-500 text-gray-200 placeholder-gray-500 min-h-[100px]"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </motion.div>

                    <motion.div variants={itemVariants}>
                        <Accordion type="single" collapsible className="bg-gray-800/30 rounded-lg border border-gray-700">
                            <AccordionItem value="user-info" className="border-b-0">
                                <AccordionTrigger className="px-4 py-3 text-lg font-semibold text-gray-200 hover:bg-gray-800/50 rounded-t-lg transition-all">
                                    <span className="flex items-center gap-2">
                                        Collect extra information of the user
                                    </span>
                                </AccordionTrigger>
                                <AccordionContent className="px-4 pb-4">
                                    <div className="space-y-4 pt-2">
                                        <p className="text-gray-400 text-sm">
                                            Select which information you want to collect from users
                                        </p>
                                        {userInfoFields.map((field) => (
                                            <motion.div
                                                key={field.name}
                                                initial={{ opacity: 0, y: -10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                className="bg-gray-800/20 rounded-lg p-4 border border-gray-700/50"
                                            >
                                                <FormField
                                                    control={form.control}
                                                    name={field.name}
                                                    render={({ field: formField }) => (
                                                        <FormItem className="space-y-2">
                                                            <div className="flex items-center gap-3">
                                                                <FormControl>
                                                                    <Checkbox
                                                                        checked={formField.value}
                                                                        onCheckedChange={formField.onChange}
                                                                        className="data-[state=checked]:bg-gray-600 data-[state=checked]:border-gray-600"
                                                                    />
                                                                </FormControl>
                                                                <div className="space-y-1">
                                                                    <FormLabel className="text-base font-medium text-gray-200">
                                                                        {field.label}
                                                                    </FormLabel>
                                                                    <FormDescription className="text-sm text-gray-400">
                                                                        {field.description}
                                                                    </FormDescription>
                                                                </div>
                                                            </div>
                                                        </FormItem>
                                                    )}
                                                />
                                            </motion.div>
                                        ))}
                                    </div>
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>
                    </motion.div>

                    <motion.div variants={itemVariants} className="space-y-4">
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-gray-200">Questions</h3>
                            <div className="flex items-start gap-4">
                                <Textarea
                                    value={newQuestion}
                                    onChange={(e) => setNewQuestion(e.target.value)}
                                    placeholder="Add a new question for your customers to answer"
                                    className="bg-gray-800/50 border-gray-700 focus-visible:border-gray-600 focus-visible:ring-gray-500 text-gray-200 placeholder-gray-500 min-h-[80px]"
                                />
                                <Button
                                    onClick={addQuestion}
                                    disabled={isLoading || !newQuestion.trim()}
                                    className="bg-gray-800 hover:bg-gray-700 text-gray-200 px-6"
                                    type="button"
                                >
                                    {isLoading ? (
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                    ) : (
                                        <div className="flex items-center gap-2">
                                            <Plus className="h-4 w-4" />
                                            <span>Add</span>
                                        </div>
                                    )}
                                </Button>
                            </div>
                        </div>

                        <AnimatePresence mode="popLayout">
                            {questions.map((question) => (
                                <motion.div
                                    key={question.id}
                                    initial={{ opacity: 0, y: -20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    className="bg-gray-800/30 rounded-lg p-4 border border-gray-700"
                                >
                                    {editingId === question.id ? (
                                        <div className="flex items-start gap-4">
                                            <Textarea
                                                value={editingText}
                                                onChange={(e) => setEditingText(e.target.value)}
                                                className="bg-gray-800/50 border-gray-700 focus-visible:border-gray-600 focus-visible:ring-gray-500 text-gray-200 min-h-[80px]"
                                            />
                                            <div className="flex gap-2">
                                                <Button
                                                    onClick={() => updateQuestion(question.id)}
                                                    disabled={isLoading}
                                                    size="sm"
                                                    className="bg-gray-700 hover:bg-gray-600"
                                                    type="button"
                                                >
                                                    <Save className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    onClick={() => setEditingId(null)}
                                                    size="sm"
                                                    variant="destructive"
                                                    type="button"
                                                >
                                                    <X className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="flex items-center justify-between">
                                            <p className="text-gray-200">{question.message}</p>
                                            <div className="flex gap-2 ml-4 shrink-0">
                                                <Button
                                                    onClick={() => {
                                                        setEditingId(question.id);
                                                        setEditingText(question.message);
                                                    }}
                                                    size="sm"
                                                    className="bg-gray-700 hover:bg-gray-600"
                                                    type="button"
                                                >
                                                    <Pencil className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    onClick={() => deleteQuestion(question.id)}
                                                    size="sm"
                                                    variant="destructive"
                                                    type="button"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    )}
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </motion.div>

                    <motion.div variants={itemVariants}>
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
                                    <span>Saving...</span>
                                </motion.div>
                            ) : (
                                <motion.div 
                                    className="flex items-center justify-center gap-2"
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    <span>Save Changes</span>
                                </motion.div>
                            )}
                        </Button>
                    </motion.div>
                </form>
            </Form>
        </motion.div>
    );
}