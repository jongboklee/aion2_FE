"use client";

import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
}

export default function Card({
  children,
  className,
  hover = false,
  onClick,
}: CardProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        "bg-white dark:bg-gray-800 rounded-lg shadow-md p-6",
        hover && "hover:shadow-lg transition-shadow cursor-pointer",
        onClick && "cursor-pointer",
        className
      )}
    >
      {children}
    </div>
  );
}

