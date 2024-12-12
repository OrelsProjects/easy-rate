import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { cn } from "@/lib/utils";

const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME as string;
const LOGO = "/logo.png";

export interface LogoProps {
  size?: "sm" | "md" | "lg" | "xl";
  animate?: boolean;
  className?: string;
}

const sizeVariants = {
  sm: { width: 24, height: 24, textSize: "text-lg" },
  md: { width: 36, height: 36, textSize: "text-xl" },
  lg: { width: 48, height: 48, textSize: "text-2xl" },
  xl: { width: 64, height: 64, textSize: "text-3xl" },
};

export default function Logo({ size = "sm", animate, className }: LogoProps) {
  const { width, height, textSize } = sizeVariants[size];

  const animation = animate
    ? {
        whileHover: { scale: 1.05 },
        whileTap: { scale: 0.95 },
      }
    : {};

  return (
    <motion.div
      className={cn("flex items-center gap-2 mr-4", className)}
      {...animation}
    >
      <Image src={LOGO} alt={APP_NAME} width={width} height={height} />
      <span className={cn("font-semibold", textSize)}>{APP_NAME}</span>
    </motion.div>
  );
}
