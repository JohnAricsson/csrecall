"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { ReactNode } from "react";
import { cn } from "@/lib/utils";

const SPRING_CFG = { stiffness: 300, damping: 20 };

export function TiltCard({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);

  const rotateX = useSpring(
    useTransform(mouseY, [0, 1], [7, -7]),
    SPRING_CFG
  );
  const rotateY = useSpring(
    useTransform(mouseX, [0, 1], [-7, 7]),
    SPRING_CFG
  );

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0.5);
    mouseY.set(0.5);
  };

  return (
    <motion.div
      style={{
        perspective: "1000px",
        transformStyle: "preserve-3d",
      }}
      className={cn("w-full h-full", className)}
    >
      <motion.div
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
        className="w-full h-full will-change-transform"
      >
        {children}
      </motion.div>
    </motion.div>
  );
}
