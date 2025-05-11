"use client"

import SpaceForm from "@/components/SpaceForm";
import { useParams } from "next/navigation"

export default function Space() {
    const { spaceId } = useParams<{ spaceId: string }>();
    
    return <div className="min-h-screen min-w-full bg-gradient-to-b from-gray-950 to-gray-900 text-white pt-25">
        <SpaceForm spaceId={spaceId}/>
    </div>
}