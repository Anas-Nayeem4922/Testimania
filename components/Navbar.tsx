"use client";
import {
  Navbar,
  NavBody,
  MobileNav,
  NavbarLogo,
  MobileNavHeader,
} from "@/components/ui/resizable-navbar";
import { useEffect, useState } from "react";
import User from "./User";
import { useSession } from "next-auth/react";
import axios from "axios";

export function NavbarDemo({ children } : { children: React.ReactNode }) {

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

  return (
    <div className="relative w-full">
      <Navbar>
        {/* Desktop Navigation */}
        <NavBody>
          <NavbarLogo />
          <div className="flex items-center gap-4">
            <User email={
                session.status === "unauthenticated" ? session.status : session.data?.user?.email
              } isVerified={isverified} username={username}/>
          </div>
        </NavBody>

        {/* Mobile Navigation */}
        <MobileNav>
          <MobileNavHeader>
            <NavbarLogo />
            <User email={
                session.status === "unauthenticated" ? session.status : session.data?.user?.email
              } isVerified={isverified} username={username}/>
          </MobileNavHeader>
        </MobileNav>
      </Navbar>
      {/* Navbar */}
      {children}
    </div>
  );
}
