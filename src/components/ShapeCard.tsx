import { LearningCard } from "./LearningCard";

interface ShapeCardProps {
  name: string;
  color: string;
  shape: "square" | "rectangle" | "triangle" | "circle";
}

export const ShapeCard = ({ name, color, shape }: ShapeCardProps) => {
  const renderShape = () => {
    const baseClasses = `${color} border-4 border-foreground/30`;
    
    switch (shape) {
      case "square":
        return <div className={`w-24 h-24 ${baseClasses}`} />;
      case "rectangle":
        return <div className={`w-32 h-20 ${baseClasses}`} />;
      case "triangle":
        return (
          <div className="w-0 h-0 border-l-[48px] border-r-[48px] border-b-[83px] border-l-transparent border-r-transparent border-b-current"
            style={{ color: color.includes('bg-') ? color.replace('bg-', '') : color }}
          />
        );
      case "circle":
        return <div className={`w-24 h-24 rounded-full ${baseClasses}`} />;
    }
  };

  return (
    <LearningCard className="min-h-[200px] flex flex-col items-center justify-center gap-4">
      {renderShape()}
      <p className="text-2xl font-bold text-foreground">{name}</p>
    </LearningCard>
  );
};
