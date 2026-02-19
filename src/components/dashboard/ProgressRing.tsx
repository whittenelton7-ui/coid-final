import { cn } from "@/lib/utils";

interface ProgressRingProps {
    radius?: number;
    stroke?: number;
    progress: number;
    className?: string;
    color?: string;
}

export function ProgressRing({ radius = 60, stroke = 8, progress, className, color = "text-blue-500" }: ProgressRingProps) {
    const normalizedRadius = radius - stroke * 2;
    const circumference = normalizedRadius * 2 * Math.PI;
    const strokeDashoffset = circumference - (progress / 100) * circumference;

    return (
        <div className={cn("relative flex items-center justify-center", className)}>
            <svg
                height={radius * 2}
                width={radius * 2}
                className="rotate-[-90deg]"
            >
                <circle
                    stroke="currentColor"
                    fill="transparent"
                    strokeWidth={stroke}
                    r={normalizedRadius}
                    cx={radius}
                    cy={radius}
                    className="text-slate-800"
                />
                <circle
                    stroke="currentColor"
                    fill="transparent"
                    strokeWidth={stroke}
                    strokeDasharray={circumference + ' ' + circumference}
                    style={{ strokeDashoffset }}
                    strokeLinecap="round"
                    r={normalizedRadius}
                    cx={radius}
                    cy={radius}
                    className={cn("transition-all duration-1000 ease-out", color)}
                />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center text-xl font-bold">
                {progress}%
            </div>
        </div>
    );
}
