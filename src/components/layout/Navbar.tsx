"use client";

import { usePathname } from "next/navigation";
import { Bell, Search } from "lucide-react";
import { useMockData } from "@/context/MockDataContext";

export function Navbar() {
    const pathname = usePathname();
    const { currentUser, setCurrentUser } = useMockData();

    const getPageTitle = (path: string) => {
        switch (path) {
            case '/': return 'Dashboard';
            case '/upload': return 'Lead Upload';
            case '/allocation': return 'Lead Allocation';
            case '/pipeline': return 'Broker Pipeline';
            case '/rma-verify': return 'RMA Verification';
            case '/document-center': return 'Document Center';
            default: return 'Dashboard';
        }
    };

    return (
        <header className="flex h-16 items-center justify-between border-b border-[var(--color-border)] bg-[var(--color-background)]/50 backdrop-blur px-6 lg:px-8">
            <div className="flex items-center flex-1">
                <h1 className="text-lg font-semibold text-white">{getPageTitle(pathname)}</h1>
            </div>

            <div className="flex items-center space-x-4">
                <div className="flex items-center mr-4 bg-slate-900/50 rounded-md border border-slate-800 px-3 py-1.5">
                    <span className="text-xs text-slate-400 mr-2">View As:</span>
                    <select
                        value={currentUser}
                        onChange={(e) => setCurrentUser(e.target.value)}
                        className="bg-transparent text-sm text-white focus:outline-none border-none cursor-pointer"
                    >
                        <option value="Lead Broker (Admin)" className="bg-slate-900">Lead Broker (Admin)</option>
                        <option value="Internal Broker (Operational)" className="bg-slate-900">Internal Broker (Operational)</option>
                        <option value="Broker Alpha" className="bg-slate-900">Broker Alpha</option>
                        <option value="Broker Bravo" className="bg-slate-900">Broker Bravo</option>
                    </select>
                </div>

                <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
                    <input
                        type="text"
                        placeholder="Search leads..."
                        className="h-9 w-64 rounded-md border border-[var(--color-border)] bg-slate-900/50 py-1 pl-9 pr-4 text-sm text-[var(--color-foreground)] focus:outline-none focus:ring-1 focus:ring-blue-500 placeholder:text-slate-600"
                    />
                </div>

                <button className="relative rounded-full p-2 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors">
                    <Bell className="h-5 w-5" />
                    <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-red-500 ring-2 ring-[var(--color-background)]" />
                </button>
            </div>
        </header>
    );
}
