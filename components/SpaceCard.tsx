"use client";

import { Space } from "@/app/generated/prisma/client";
import { Edit2, Trash2, Calendar } from "lucide-react";
import { Button } from "./ui/button";
import { motion } from "framer-motion";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";

interface SpaceCardProps {
  space: Space;
  onEdit: () => void;
  onDelete: () => void;
}

export function SpaceCard({ space, onEdit, onDelete }: SpaceCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        type: "spring",
        stiffness: 100,
        damping: 20,
      }}
    >
      <Card className="bg-gray-800/50 border-gray-700 hover:bg-gray-800/70 transition-colors duration-300">
        <CardHeader className="relative">
          <div className="absolute right-4 top-4 flex gap-2">
            <Button
              size="sm"
              variant="ghost"
              className="text-gray-400 hover:text-gray-200 hover:bg-gray-700/50"
              onClick={onEdit}
            >
              <Edit2 className="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
              onClick={onDelete}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
          <CardTitle className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-gray-100 to-gray-400">
            {space.name || "Untitled Space"}
          </CardTitle>
          <CardDescription className="text-gray-200 mt-2 text-lg">
            {space.header || "No header available"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-gray-400 text-sm">
            {space.description || "No description available"}
          </p>
        </CardContent>
      </Card>
    </motion.div>
  );
}