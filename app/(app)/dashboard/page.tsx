"use client"

import { Button } from "@/components/ui/button";
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function Dashboard() {
    const router = useRouter();
    const handleSpace = async () => {
        const response = await axios.post("/api/dummy-space");
        toast.success("Success", {
            description: response.data.message
        });
        const spaceId = response.data.spaceId;
        router.push(`/space/${spaceId}`);
    }

    return <div className="min-h-screen min-w-full bg-gradient-to-b from-gray-950 to-gray-900 text-white pt-25">
        <Button onClick={handleSpace}>Create a new space</Button>
    </div>
}