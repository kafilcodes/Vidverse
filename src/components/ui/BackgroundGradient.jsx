'use client';

import { cn } from "@/lib/utils";
import React from "react";
import { motion } from "framer-motion";

export const BackgroundGradient = ({
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
    <div className={cn("relative p-[2px] group", containerClassName)}>
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
          "absolute inset-0 rounded-2xl z-[1] opacity-30 group-hover:opacity-60 blur-xl transition duration-500 will-change-transform",
          // Golden gradient instead of original colors
          "bg-[radial-gradient(circle_farthest-side_at_0_100%,#fbbf24,transparent),radial-gradient(circle_farthest-side_at_100%_0,#f59e0b,transparent),radial-gradient(circle_farthest-side_at_100%_100%,#eab308,transparent),radial-gradient(circle_farthest-side_at_0_0,#fbbf24,#0a0a0a)]"
        )}
      />
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
          "absolute inset-0 rounded-2xl z-[1] will-change-transform opacity-20 group-hover:opacity-40",
          // Golden gradient with lower opacity
          "bg-[radial-gradient(circle_farthest-side_at_0_100%,#fbbf24,transparent),radial-gradient(circle_farthest-side_at_100%_0,#f59e0b,transparent),radial-gradient(circle_farthest-side_at_100%_100%,#eab308,transparent),radial-gradient(circle_farthest-side_at_0_0,#fbbf24,#0a0a0a)]"
        )}
      />
      <div className={cn("relative z-10", className)}>{children}</div>
    </div>
  );
};
