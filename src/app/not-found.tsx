"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Star, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";

export default function NotFound() {
  const { data } = useSession();

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 text-center">
      <motion.div
        initial={{ rotate: 0 }}
        animate={{ rotate: 360 }}
        transition={{ duration: 4, ease: "linear" }}
        className="mb-8"
      >
        <Star className="w-24 h-24 text-yellow-400" />
      </motion.div>
      <h1 className="text-4xl font-bold mb-4">Oops! Page Not Found</h1>
      <p className="text-xl mb-8">
        Looks like this page got a one-star review and decided to leave.
      </p>
      <Button asChild>
        <Link href={data ? "/home" : "/"}>
          <Home className="mr-2 h-4 w-4" />
          Return Home
        </Link>
      </Button>
    </div>
  );
}
