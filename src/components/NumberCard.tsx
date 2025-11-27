import { LearningCard } from "./LearningCard";

interface NumberCardProps {
  number: number;
  color: string;
}

export const NumberCard = ({ number, color }: NumberCardProps) => {
  return (
    <LearningCard className={`${color} min-h-[180px] flex flex-col items-center justify-center`}>
      <div className="text-7xl font-bold text-foreground mb-3">
        {number}
      </div>
      <div className="flex gap-2 flex-wrap justify-center">
        {Array.from({ length: number }).map((_, i) => (
          <div
            key={i}
            className="w-6 h-6 bg-foreground/20 rounded-full"
          />
        ))}
      </div>
    </LearningCard>
  );
};
