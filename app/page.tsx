"use client"

import User from "@/components/User";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export default function Home() {
  const session = useSession();
  const [isverified, setIsVerified] = useState(false);
  const [username, setUsername] = useState("");
  useEffect(() => {
    axios.post("/api/verify-email", {
      email: session.data?.user?.email
    }).then((response) => {
      setIsVerified(response.data.isVerified);
      setUsername(response.data.username);
    }).catch((err) => {
      console.log(err);
    })
  }, [isverified, username]);
  return <div className="min-h-screen bg-gradient-to-b from-gray-950 to-gray-900 flex p-4 text-white">
    <User email={
      session.status === "unauthenticated" ? session.status : session.data?.user?.email
    } isVerified={isverified} username={username}/>
  </div>
}