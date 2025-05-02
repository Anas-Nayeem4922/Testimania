"use client"

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { AlertCircle, Check, LogOut, User2, UserPlus, UserRound } from "lucide-react"
import { signOut } from "next-auth/react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import axios from "axios"
import { toast } from "sonner"

export default function User({ email, isVerified, username }: { email?: string | null, isVerified: boolean, username: string }) {
    const router = useRouter();
    
    const dropdownVariants = {
        hidden: { opacity: 0, y: -5, scale: 0.95 },
        visible: {
            opacity: 1, 
            y: 0, 
            scale: 1,
            transition: {
                duration: 0.2,
                ease: "easeOut",
                staggerChildren: 0.05
            }
        }
    };
    
    const itemVariants = {
        hidden: { opacity: 0, x: -5 },
        visible: { 
            opacity: 1, 
            x: 0,
            transition: { duration: 0.2 }
        }
    };

    const handleVerification = async () => {
        const response = await axios.post("/api/resend-verification-mail", {
            email,
            username
        })
        toast.success("Success", {
            description: response.data.message
        })
        router.push(`/verify/${username}`);
    }
    return (
        <div className="relative">
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <motion.div 
                        className="relative flex items-center justify-center w-10 h-10 text-sm font-semibold rounded-full cursor-pointer bg-gray-800 border border-gray-700 text-gray-200 hover:bg-gray-700 transition-all duration-200 shadow-sm"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        {email === "unauthenticated" ? (
                            <User2 className="h-5 w-5 text-gray-300" />
                        ) : (
                            <div className="uppercase">
                                {email?.charAt(0)}
                            </div>
                        )}
                        
                        {/* Verification status indicator */}
                        {email !== "unauthenticated" && (
                            <motion.div 
                                className={`absolute -top-1 -right-1 flex items-center justify-center w-4 h-4 rounded-full ${isVerified ? 'bg-emerald-500' : 'bg-red-500'}`}
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                            >
                                {isVerified ? (
                                    <Check className="h-3 w-3 text-white" />
                                ) : (
                                    <AlertCircle className="h-3 w-3 text-white" />
                                )}
                            </motion.div>
                        )}
                    </motion.div>
                </DropdownMenuTrigger>
                
                <DropdownMenuContent className="w-56 bg-gray-900 border border-gray-800 shadow-[0_4px_30px_rgba(0,0,0,0.3)] rounded-lg p-1 animate-in fade-in-50 data-[side=bottom]:slide-in-from-top-2">
                    <motion.div
                        variants={dropdownVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        <DropdownMenuLabel className="text-gray-300 font-medium px-3 py-2">
                            <motion.div variants={itemVariants}>
                                My Account
                            </motion.div>
                        </DropdownMenuLabel>
                        
                        <DropdownMenuSeparator className="bg-gray-800" />
                        
                        {email === "unauthenticated" ? (
                            <>
                                <Link href="/signup">
                                    <DropdownMenuItem className="flex items-center gap-2 px-3 py-2 text-gray-300 hover:text-white focus:text-white hover:bg-gray-800 focus:bg-gray-800 rounded-md cursor-pointer transition-colors">
                                        <motion.div variants={itemVariants} className="flex items-center gap-2 w-full">
                                            <UserPlus className="h-4 w-4 text-gray-400" />
                                            <span>Sign up</span>
                                        </motion.div>
                                    </DropdownMenuItem>
                                </Link>
                                
                                <Link href="/signin">
                                    <DropdownMenuItem className="flex items-center gap-2 px-3 py-2 text-gray-300 hover:text-white focus:text-white hover:bg-gray-800 focus:bg-gray-800 rounded-md cursor-pointer transition-colors">
                                        <motion.div variants={itemVariants} className="flex items-center gap-2 w-full">
                                            <UserRound className="h-4 w-4 text-gray-400" />
                                            <span>Sign in</span>
                                        </motion.div>
                                    </DropdownMenuItem>
                                </Link>
                            </>
                        ) : (
                            <>
                                {!isVerified && (
                                    <DropdownMenuItem className="flex items-center gap-2 px-3 py-2 text-yellow-300 hover:text-yellow-200 focus:text-yellow-200 hover:bg-gray-800 focus:bg-gray-800 rounded-md cursor-pointer transition-colors" onClick={() => {
                                        handleVerification()
                                    }}>
                                        <motion.div variants={itemVariants} className="flex items-center gap-2 w-full">
                                            <AlertCircle className="h-4 w-4" />
                                            <span>Please verify your email</span>
                                        </motion.div>
                                    </DropdownMenuItem>
                                )}
                                
                                <DropdownMenuItem 
                                    className="flex items-center gap-2 px-3 py-2 text-gray-300 hover:text-white focus:text-white hover:bg-gray-800 focus:bg-gray-800 rounded-md cursor-pointer transition-colors"
                                    onClick={() => {
                                        signOut();
                                        router.push("/");
                                    }}
                                >
                                    <motion.div variants={itemVariants} className="flex items-center gap-2 w-full">
                                        <LogOut className="h-4 w-4 text-gray-400" />
                                        <span>Log out</span>
                                    </motion.div>
                                </DropdownMenuItem>
                            </>
                        )}
                    </motion.div>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    )
}