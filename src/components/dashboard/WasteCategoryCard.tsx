import { cn } from "@/lib/utils";

interface WasteCategoryCardProps {
  category: 'yellow' | 'red' | 'blue' | 'white' | 'sharps';
  label: string;
  amount: string;
  unit: string;
  percentage: number;
}

const categoryStyles = {
  yellow: {
    bg: "bg-waste-yellow-bg",
    border: "border-waste-yellow/30",
    bar: "bg-waste-yellow",
    text: "text-yellow-700",
  },
  red: {
    bg: "bg-waste-red-bg",
    border: "border-waste-red/30",
    bar: "bg-waste-red",
    text: "text-red-700",
  },
  blue: {
    bg: "bg-waste-blue-bg",
    border: "border-waste-blue/30",
    bar: "bg-waste-blue",
    text: "text-blue-700",
  },
  white: {
    bg: "bg-waste-white",
    border: "border-waste-white-border",
    bar: "bg-gray-400",
    text: "text-gray-700",
  },
  sharps: {
    bg: "bg-waste-sharps-bg",
    border: "border-waste-sharps/30",
    bar: "bg-waste-sharps",
    text: "text-purple-700",
  },
};

export function WasteCategoryCard({ category, label, amount, unit, percentage }: WasteCategoryCardProps) {
  const styles = categoryStyles[category];

  return (
    <div className={cn(
      "p-4 rounded-xl border-2 transition-all duration-300 hover:scale-[1.02] animate-slide-up",
      styles.bg,
      styles.border
    )}>
      <div className="flex items-center justify-between mb-3">
        <span className={cn("font-semibold text-sm", styles.text)}>{label}</span>
        <span className={cn("text-xs font-medium", styles.text)}>{percentage}%</span>
      </div>
      <p className={cn("text-2xl font-display font-bold mb-2", styles.text)}>
        {amount} <span className="text-sm font-normal">{unit}</span>
      </p>
      <div className="w-full h-2 bg-white/60 rounded-full overflow-hidden">
        <div 
          className={cn("h-full rounded-full transition-all duration-500", styles.bar)}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
