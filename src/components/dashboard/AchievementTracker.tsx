import { Trophy } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";

export function AchievementTracker() {
    return (
        <Card className="bg-gradient-to-br from-indigo-900/50 to-blue-900/50 border-indigo-800/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-indigo-100">Catalyst Partner</CardTitle>
                <div className="flex h-2 w-2 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </div>
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold text-white">Active</div>
                <p className="text-xs text-indigo-200 mt-1">AI Workflow Engine: Online</p>
                <div className="mt-4 flex items-center space-x-2">
                    <div className="h-1.5 w-full bg-indigo-950 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-500 w-full rounded-full shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                    </div>
                </div>
                <p className="text-[10px] text-right mt-1 text-emerald-400 font-mono">FSCA DB CONNECTED</p>
            </CardContent>
        </Card>
    );
}
