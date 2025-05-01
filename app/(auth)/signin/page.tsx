"use client"

import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { signinSchema } from "@/schemas/signinSchema"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
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
import { Loader2, LogIn } from "lucide-react"
import Link from "next/link"
import { signIn } from "next-auth/react"
import { motion } from "framer-motion"

export default function Signin() {
    const router = useRouter()
    const form = useForm<z.infer<typeof signinSchema>>({
        resolver: zodResolver(signinSchema),
        defaultValues: {
            email: "",
            password: ""
        }
    })

    const onSubmit = async (data: z.infer<typeof signinSchema>) => {
        const result = await signIn("credentials", {
            redirect: false,
            email: data.email,
            password: data.password
        })
        if (result?.error) {
            if (result.error === 'CredentialsSignin') {
              toast.error("Login Failed", {
                description: 'Incorrect username or password',
              });
            } else {
              toast.error("Error", {
                description: result.error
              });
            }
        }
        if(result?.url) {
            router.replace("/");
        }
    }

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
                            Welcome Back
                        </h1>
                        <p className="text-gray-400">
                            Sign in to continue your anonymous journey
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
                                                    placeholder="Enter your password" 
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
                                    disabled={form.formState.isSubmitting}
                                >
                                    {form.formState.isSubmitting ? (
                                        <motion.div 
                                            className="flex items-center justify-center gap-2"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                        >
                                            <Loader2 className="h-4 w-4 animate-spin"/>
                                            <span>Signing in...</span>
                                        </motion.div>
                                    ) : (
                                        <motion.div 
                                            className="flex items-center justify-center gap-2"
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                        >
                                            <LogIn className="h-4 w-4" />
                                            <span>Sign In</span>
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
                            Don&apos;t have an account?{' '}
                            <Link 
                                href="/signup" 
                                className="text-gray-300 hover:text-white transition-colors"
                            >
                                Sign up
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