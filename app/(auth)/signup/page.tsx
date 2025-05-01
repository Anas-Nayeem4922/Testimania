"use client"

import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { zodResolver } from "@hookform/resolvers/zod"
import { signupSchema } from "@/schemas/signupSchema"
import { useDebounceCallback } from "usehooks-ts"
import { z } from "zod"
import axios, { AxiosError } from "axios"
import { ApiResponse } from "@/types/ApiResponse"
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
import { Loader2, UserPlus, Check, X } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"

export default function Signup() {
    const [username, setUsername] = useState("")
    const [usernameMessage, setUsernameMessage] = useState("")
    const [isCheckingUsername, setIsCheckingUsername] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const debounced = useDebounceCallback(setUsername, 500)
    const router = useRouter()

    useEffect(() => {
        const checkUniqueUsername = async () => {
            if(username) {
                setIsCheckingUsername(true)
                setUsernameMessage("")
                try {
                    const response = await axios.get(`/api/check-unique-username?username=${username}`)
                    setUsernameMessage(response.data.message)
                } catch (err) {
                    const AxiosError = err as AxiosError<ApiResponse>
                    setUsernameMessage(
                        AxiosError.response?.data.message ?? "Error checking username"
                    )
                } finally {
                    setIsCheckingUsername(false)
                }
            }
        }
        checkUniqueUsername()
    }, [username])

    const onSubmit = async (data: z.infer<typeof signupSchema>) => {
        try {
            setIsSubmitting(true)
            const response = await axios.post("/api/signup", data)
            toast.success("Success", {
                description: response.data.message
            })
            window.password = data.password
            router.replace(`/verify/${username}`)
        } catch (err) {
            const axiosError = err as AxiosError<ApiResponse>
            const errorMessage = axiosError.response?.data.message
            toast.error("Error in signing up", {
                description: errorMessage
            })
            setIsSubmitting(false)
        }
    }

    const form = useForm<z.infer<typeof signupSchema>>({
        resolver: zodResolver(signupSchema),
        defaultValues: {
            username: "",
            email: "",
            password: ""
        }
    })

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2
            }
        }
    }

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
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-950 to-gray-900 flex items-center justify-center p-4">
            <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ 
                    duration: 0.6,
                    ease: [0.22, 1, 0.36, 1]
                }}
                className="w-full max-w-md"
            >
                <div className="bg-gray-900 rounded-xl border border-gray-800 shadow-[0_4px_30px_rgba(0,0,0,0.2)] p-8">
                    <motion.div 
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ 
                            delay: 0.3,
                            duration: 0.5,
                            ease: "easeOut"
                        }}
                        className="text-center space-y-2 mb-8"
                    >
                        <h1 className="text-3xl font-bold text-gray-100">
                            Create Account
                        </h1>
                        <p className="text-gray-400">
                            Join Inkognito to start your anonymous journey
                        </p>
                    </motion.div>

                    <Form {...form}>
                        <motion.form 
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                            onSubmit={form.handleSubmit(onSubmit)} 
                            className="space-y-5"
                        >
                            <motion.div variants={itemVariants}>
                                <FormField
                                    control={form.control}
                                    name="username"
                                    render={({ field }) => (
                                        <FormItem className="space-y-2">
                                            <FormLabel className="text-gray-300 font-medium">Username</FormLabel>
                                            <FormControl>
                                                <div className="relative">
                                                    <Input 
                                                        placeholder="Choose a username" 
                                                        className="bg-gray-800/50 border-gray-700 focus-visible:border-gray-600 focus-visible:ring-gray-500 text-gray-200 placeholder-gray-500 h-11 transition-all duration-200"
                                                        {...field} 
                                                        onChange={(e) => {
                                                            field.onChange(e)
                                                            debounced(e.target.value)
                                                        }}
                                                    />
                                                    <motion.div 
                                                        className="absolute right-3 top-3"
                                                        initial={{ opacity: 0, scale: 0.5 }}
                                                        animate={{ opacity: 1, scale: 1 }}
                                                        exit={{ opacity: 0, scale: 0.5 }}
                                                        transition={{ duration: 0.2 }}
                                                    >
                                                        {isCheckingUsername && (
                                                            <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
                                                        )}
                                                        {!isCheckingUsername && usernameMessage && (
                                                            usernameMessage === "Username is available" ? (
                                                                <Check className="h-5 w-5 text-emerald-500" />
                                                            ) : (
                                                                <X className="h-5 w-5 text-red-500" />
                                                            )
                                                        )}
                                                    </motion.div>
                                                </div>
                                            </FormControl>
                                            {usernameMessage && (
                                                <motion.p 
                                                    initial={{ opacity: 0, y: -10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    className={`text-sm ${
                                                        usernameMessage === "Username is available" 
                                                            ? "text-emerald-500" 
                                                            : "text-red-500"
                                                    }`}
                                                >
                                                    {usernameMessage}
                                                </motion.p>
                                            )}
                                            <FormMessage className="text-red-500" />
                                        </FormItem>
                                    )}
                                />
                            </motion.div>

                            <motion.div variants={itemVariants}>
                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem className="space-y-2">
                                            <FormLabel className="text-gray-300 font-medium">Email</FormLabel>
                                            <FormControl>
                                                <Input 
                                                    placeholder="Enter your email" 
                                                    className="bg-gray-800/50 border-gray-700 focus-visible:border-gray-600 focus-visible:ring-gray-500 text-gray-200 placeholder-gray-500 h-11 transition-all duration-200"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage className="text-red-500" />
                                        </FormItem>
                                    )}
                                />
                            </motion.div>

                            <motion.div variants={itemVariants}>
                                <FormField
                                    control={form.control}
                                    name="password"
                                    render={({ field }) => (
                                        <FormItem className="space-y-2">
                                            <FormLabel className="text-gray-300 font-medium">Password</FormLabel>
                                            <FormControl>
                                                <Input 
                                                    type="password" 
                                                    placeholder="Create a password" 
                                                    className="bg-gray-800/50 border-gray-700 focus-visible:border-gray-600 focus-visible:ring-gray-500 text-gray-200 placeholder-gray-500 h-11 transition-all duration-200"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage className="text-red-500" />
                                        </FormItem>
                                    )}
                                />
                            </motion.div>

                            <motion.div
                                variants={itemVariants}
                                className="pt-2"
                            >
                                <Button 
                                    className="w-full bg-gray-800 hover:bg-gray-700 text-gray-100 font-medium h-11 transition-all duration-300 shadow-sm cursor-pointer"
                                    type="submit" 
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? (
                                        <motion.div 
                                            className="flex items-center justify-center gap-2"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                        >
                                            <Loader2 className="h-4 w-4 animate-spin"/>
                                            <span>Creating account...</span>
                                        </motion.div>
                                    ) : (
                                        <motion.div 
                                            className="flex items-center justify-center gap-2 cursor-pointer"
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                        >
                                            <UserPlus className="h-4 w-4" />
                                            <span>Create Account</span>
                                        </motion.div>
                                    )}
                                </Button>
                            </motion.div>
                        </motion.form>
                    </Form>

                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.7, duration: 0.5 }}
                        className="mt-6 text-center text-gray-400"
                    >
                        <p>
                            Already have an account?{' '}
                            <Link 
                                href="/signin" 
                                className="text-gray-300 hover:text-white transition-colors"
                            >
                                Sign in
                            </Link>
                        </p>
                    </motion.div>
                </div>
                
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8, duration: 0.5 }}
                    className="mt-6 text-center"
                >
                    <Link 
                        href="/"
                        className="text-gray-500 hover:text-gray-400 text-sm transition-colors"
                    >
                        Return to home
                    </Link>
                </motion.div>
            </motion.div>
        </div>
    )
}