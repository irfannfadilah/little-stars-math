import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface LearningCardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}

export const LearningCard = ({ children, className, onClick }: LearningCardProps) => {
  return (
    <div
      onClick={onClick}
      className={cn(
        "bg-card rounded-3xl p-6 shadow-[var(--shadow-card)] hover:scale-105 transition-all duration-300 cursor-pointer border-4 border-border",
        className
      )}
    >
      {children}
    </div>
  );
};
