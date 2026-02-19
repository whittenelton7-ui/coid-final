"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Upload, Users, ShieldCheck, FileText, Settings, LogOut, Kanban } from "lucide-react";
import { cn } from "@/lib/utils";
import { useMockData } from "@/context/MockDataContext";

export function Sidebar() {
    const pathname = usePathname();
    const { currentUser } = useMockData();

    // Determine Dashboard Link based on Role
    const dashboardLink = currentUser === 'Lead Broker (Admin)' ? '/' : '/broker-dashboard';

    const NAV_ITEMS = [
        { label: 'Dashboard', icon: LayoutDashboard, href: dashboardLink },
        { label: 'Lead Upload', icon: Upload, href: '/upload' },
        { label: 'Lead Allocation', icon: Users, href: '/allocation' },
        { label: 'Broker Pipeline', icon: Kanban, href: '/pipeline' },
        { label: 'RMA Command Centre', icon: ShieldCheck, href: '/rma-verify' },
    ];

    return (
        <div className="flex h-screen w-64 flex-col bg-[var(--color-sidebar)] text-[var(--color-sidebar-foreground)] border-r border-[var(--color-border)]">
            {/* Brand */}
            <div className="flex h-16 items-center px-6 border-b border-[var(--color-border)]">
                <div className="h-8 w-8 rounded bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center mr-3 text-white font-bold">
                    CAI
                </div>
                <span className="font-bold text-lg tracking-tight text-white">COID Master</span>
            </div>

            {/* Navigation */}
            <nav className="flex-1 space-y-1 px-3 py-4">
                {NAV_ITEMS.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-all duration-200",
                                isActive
                                    ? "bg-blue-600/10 text-blue-400 border-l-4 border-blue-500"
                                    : "text-slate-400 hover:bg-slate-800 hover:text-white"
                            )}
                        >
                            <item.icon className={cn(
                                "mr-3 h-5 w-5 flex-shrink-0 transition-colors",
                                isActive ? "text-blue-500" : "text-slate-500 group-hover:text-white"
                            )} />
                            {item.label}
                        </Link>
                    );
                })}
            </nav>

            {/* User / Footer */}
            <div className="border-t border-[var(--color-border)] p-4">
                <div className="flex items-center">
                    <div className="h-9 w-9 rounded-full bg-slate-700 flex items-center justify-center text-xs text-white">
                        EW
                    </div>
                    <div className="ml-3">
                        <p className="text-sm font-medium text-white truncate w-32" title={currentUser}>{currentUser}</p>
                        <p className="text-xs text-slate-500">
                            {currentUser === 'Lead Broker (Admin)' ? 'Admin' : 'Broker'}
                        </p>
                    </div>
                </div>
                <div className="mt-4 flex justify-between px-2">
                    <button className="text-slate-500 hover:text-white">
                        <Settings className="h-5 w-5" />
                    </button>
                    <button className="text-slate-500 hover:text-red-400">
                        <LogOut className="h-5 w-5" />
                    </button>
                </div>
            </div>
        </div>
    );
}
