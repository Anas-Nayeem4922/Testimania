"use client"

import { verifySchema } from "@/schemas/verifySchema"
import { zodResolver } from "@hookform/resolvers/zod"
import { useParams, useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
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
import { motion } from "framer-motion"
import { Loader2, ShieldCheck } from "lucide-react"
import Link from "next/link"
import { signIn } from "next-auth/react"

export default function Verify() {
  const router = useRouter()
  const params = useParams<{ username: string }>()

  const form = useForm<z.infer<typeof verifySchema>>({
    resolver: zodResolver(verifySchema),
    defaultValues: {
      code: "",
    },
  })

  const onSubmit = async (data: z.infer<typeof verifySchema>) => {
    try {
      const response = await axios.post("/api/verify", {
        username: params.username,
        code: data.code,
      })
      toast.success("Success", {
        description: response.data.message,
      })
      const result = await signIn("credentials", {
        redirect: false,
        email: response.data.email,
        password: window.password
      });
      console.log(result);
      if(result?.url) {
        router.replace("/");
      }
      
    } catch (err) {
      const axiosError = err as AxiosError<ApiResponse>
      const errorMessage = axiosError.response?.data.message
      toast.error("Error in verifying the user", {
        description: errorMessage,
      })
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
              Verify Your Account
            </h1>
            <p className="text-gray-400">
              Enter the code sent to your email
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
                  name="code"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="text-gray-300 font-medium">
                        Verification Code
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter your code"
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
                  className="w-full bg-gray-800 hover:bg-gray-700 text-gray-100 font-medium h-11 transition-all duration-300 cursor-pointer shadow-sm"
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
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Verifying...</span>
                    </motion.div>
                  ) : (
                    <motion.div 
                      className="flex items-center justify-center gap-2 cursor-pointer"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <ShieldCheck className="h-4 w-4" />
                      <span>Verify Account</span>
                    </motion.div>
                  )}
                </Button>
              </motion.div>
            </motion.form>
          </Form>
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