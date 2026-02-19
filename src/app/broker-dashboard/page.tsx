"use client";

import React from 'react';
import { useMockData } from "@/context/MockDataContext";
import { Activity, ArrowUpRight, DollarSign, Users, FileText, ShieldCheck, LucideIcon } from "lucide-react";
import Link from "next/link";
import { AchievementTracker } from "@/components/dashboard/AchievementTracker";

// Decoupled Stat Card - Guaranteed to render unconditionally
function BrokerStatCard({ title, value, icon: Icon, trend, trendColor }: { title: string, value: string | number, icon: LucideIcon, trend: string, trendColor: string }) {
    return (
        <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6 shadow-lg backdrop-blur-sm transition-all hover:border-blue-500/50 hover:bg-slate-800/80 h-full flex flex-col justify-between">
            <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-slate-400">{title}</h3>
                <Icon className="h-5 w-5 text-slate-500" />
            </div>
            <div className="mt-4 flex items-baseline gap-2">
                <span className="text-3xl font-bold text-white">{value}</span>
            </div>
            <div className="mt-4">
                <span className={`text-xs font-medium ${trendColor}`}>{trend}</span>
            </div>
        </div>
    );
}

export default function BrokerDashboard() {
    const { leads, currentUser } = useMockData();

    // Safe counts with strict fallback to 0
    const allocated = leads.filter(l => l.brokerOwner === currentUser && l.status === 'Allocated').length || 0;
    const pendingNoa = leads.filter(l => l.brokerOwner === currentUser && l.status === 'Pending NOA').length || 0;
    const preparingDocs = leads.filter(l => l.brokerOwner === currentUser && l.status === 'Preparing Docs').length || 0;
    const awaitingRma = leads.filter(l => l.brokerOwner === currentUser && l.status === 'Awaiting RMA Review').length || 0;
    const pendingSigs = leads.filter(l => l.brokerOwner === currentUser && l.status === 'Pending Client Signature').length || 0;

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-1 space-y-2">
                    <h2 className="text-3xl font-bold tracking-tight text-white">Broker Workspace</h2>
                    <p className="text-slate-400">Welcome back, {currentUser}. Here is your active deal flow.</p>

                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mt-6">
                        <Link href="/pipeline?filter=Allocated">
                            <BrokerStatCard title="New Allocations" value={allocated} icon={Users} trend="New" trendColor="text-blue-400" />
                        </Link>
                        <Link href="/pipeline?filter=Pending NOA">
                            <BrokerStatCard title="Pending NOA" value={pendingNoa} icon={Activity} trend="Requires Action" trendColor="text-amber-400" />
                        </Link>
                        <Link href="/pipeline?filter=Preparing Docs">
                            <BrokerStatCard title="Preparing Docs" value={preparingDocs} icon={FileText} trend="Action Req" trendColor="text-indigo-400" />
                        </Link>
                        <Link href="/pipeline?filter=Awaiting RMA Review">
                            <BrokerStatCard title="Awaiting RMA" value={awaitingRma} icon={ShieldCheck} trend="Blocked" trendColor="text-cyan-400" />
                        </Link>
                        <Link href="/pipeline?filter=Pending Client Signature">
                            <BrokerStatCard title="Pending Sigs" value={pendingSigs} icon={DollarSign} trend="Client Action" trendColor="text-purple-400" />
                        </Link>
                    </div>

                    <div className="mt-8">
                        <Link href="/pipeline">
                            <button className="w-full md:w-auto px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-lg shadow-indigo-900/20 flex items-center justify-center transition-all hover:scale-105">
                                <Activity className="mr-2 h-5 w-5" />
                                Open Pipeline Workspace
                                <ArrowUpRight className="ml-2 h-5 w-5" />
                            </button>
                        </Link>
                    </div>
                </div>
                <div className="w-full md:w-80 flex-shrink-0">
                    <AchievementTracker />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <ActionCard title="Lead Library" description="Access shared pool of unallocated leads" />
                <ActionCard title="Commission Statements" description="View monthly earnings reports" />
                <ActionCard title="Support Ticket" description="Log technical or admin issues" />
            </div>
        </div>
    );
}

function ActionCard({ title, description }: { title: string; description: string }) {
    return (
        <button className="group relative overflow-hidden rounded-xl border border-slate-800 bg-slate-900/30 p-6 text-left hover:border-blue-500/50 hover:bg-slate-800/50 transition-all">
            <div className="relative z-10">
                <h3 className="font-semibold text-white group-hover:text-blue-400 transition-colors">{title}</h3>
                <p className="text-sm text-slate-400 mt-1">{description}</p>
            </div>
            <div className="absolute -right-10 -bottom-10 h-32 w-32 rounded-full bg-blue-500/5 blur-2xl group-hover:bg-blue-500/10 transition-all" />
        </button>
    )
}