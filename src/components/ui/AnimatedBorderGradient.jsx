'use client';

import { cn } from "@/lib/utils";
import React from "react";
import { motion } from "framer-motion";

export const AnimatedBorderGradient = ({
  children,
  className,
  containerClassName,
  animate = true,
}) => {
  const variants = {
    initial: {
      backgroundPosition: "0 50%",
    },
    animate: {
      backgroundPosition: ["0, 50%", "100% 50%", "0 50%"],
    },
  };

  return (
    <div className={cn("relative group", containerClassName)}>
      {/* Animated border gradient */}
      <motion.div
        variants={animate ? variants : undefined}
        initial={animate ? "initial" : undefined}
        animate={animate ? "animate" : undefined}
        transition={
          animate
            ? {
                duration: 5,
                repeat: Infinity,
                repeatType: "reverse",
              }
            : undefined
        }
        style={{
          backgroundSize: animate ? "400% 400%" : undefined,
        }}
        className={cn(
          "absolute inset-0 rounded-2xl z-[1] opacity-40 group-hover:opacity-70 transition duration-500 will-change-transform",
          "bg-[conic-gradient(from_0deg_at_50%_50%,#fbbf24_0deg,#f59e0b_90deg,#eab308_180deg,#fbbf24_270deg,#f59e0b_360deg)]",
          "blur-[2px]"
        )}
      />
      {/* Border mask */}
      <div className="absolute inset-[2px] rounded-2xl bg-neutral-900/90 z-[2]" />
      <div className={cn("relative z-10", className)}>{children}</div>
    </div>
  );
};
