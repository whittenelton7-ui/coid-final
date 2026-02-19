"use client";

import { useMockData } from "@/context/MockDataContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { ProgressRing } from "@/components/dashboard/ProgressRing";
import { AchievementTracker } from "@/components/dashboard/AchievementTracker";
import { Activity, ArrowUpRight, CheckCircle2, DollarSign, Users, Archive } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Upload } from "lucide-react";
import { useState } from "react";

export default function Dashboard() {
  const { stats: globalStats, pipeline, recentActivity, leads, currentUser } = useMockData();

  // GLOBAL VIEW - No Role Filtering
  // Calculated from entire 'leads' array
  const totalUploaded = leads.filter(l => l.status === 'New').length;
  const totalArchived = leads.filter(l => l.status === 'Archived').length;
  const sentToRma = leads.filter(l => l.status === 'Sent to RMA').length;
  const rmaVerified = leads.filter(l => l.status === 'RMA Verified').length;
  const totalAllocated = leads.filter(l => ['Allocated', 'Pending NOA', 'Awaiting RMA NOA Check', 'Preparing Docs', 'Awaiting RMA Review', 'Pending Client Signature'].includes(l.status)).length;
  const totalConverted = leads.filter(l => l.status === 'Pending CF Submission').length;

  // BROKER SPECIFIC STATS
  const myLeads = leads.filter(l => l.brokerOwner === currentUser);
  const myPendingNOA = myLeads.filter(l => l.status === 'Pending NOA').length;
  const myPreparing = myLeads.filter(l => l.status === 'Preparing Docs').length;
  const myAwaitingRMA = myLeads.filter(l => ['Awaiting RMA Review', 'Awaiting RMA NOA Check'].includes(l.status)).length;
  const myPendingSigs = myLeads.filter(l => l.status === 'Pending Client Signature').length;

  const isAdmin = currentUser === 'Lead Broker (Admin)';

  return (
    <div className="space-y-8">
      {/* Welcome & Achievement */}
      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-1 space-y-2">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-bold tracking-tight text-white">
              {isAdmin ? "Executive Dashboard" : "Broker Workspace"}
            </h2>
          </div>
          <p className="text-slate-400">
            {isAdmin ? "Global System Overview (Operational Alias Active)" : `Welcome back, ${currentUser}. Here is your active deal flow.`}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-4 mt-6">
            {isAdmin ? (
              // ADMIN / GLOBAL CARDS
              <>
                <StatCard title="Unprocessed Leads" value={totalUploaded.toLocaleString()} icon={Users} trend="Queue" trendColor="text-slate-400" href="/upload?filter=New" />
                <StatCard title="Archived Leads" value={totalArchived.toLocaleString()} icon={Archive} trend="History" trendColor="text-slate-600" href="#" />
                <StatCard title="Sent to RMA" value={sentToRma.toLocaleString()} icon={Activity} trend="Processing" trendColor="text-blue-400" href="/upload?filter=Sent to RMA" />
                <StatCard title="RMA Verified" value={rmaVerified.toLocaleString()} icon={CheckCircle2} trend="Ready" trendColor="text-indigo-400" href="/allocation" />
                <StatCard title="Total Allocated" value={totalAllocated.toLocaleString()} icon={Activity} trend="In Pipeline" trendColor="text-amber-400" href="/pipeline" />
                <StatCard title="Total Converted" value={totalConverted.toLocaleString()} icon={DollarSign} trend="Revenue" trendColor="text-emerald-400" href="/pipeline?filter=Approved" />
              </>
            ) : (
              // BROKER / MICRO DASHBOARD
              <>
                <StatCard
                  title="New Allocations"
                  value={(leads.filter(l => l.brokerOwner === currentUser && l.status === 'Allocated').length || 0).toString()}
                  icon={Users}
                  trend="New"
                  trendColor="text-blue-400"
                  href="/pipeline?filter=Allocated"
                />
                <StatCard title="Pending NOA" value={myPendingNOA.toString()} icon={Activity} trend="Requires Action" trendColor="text-amber-400" href="/pipeline?filter=Pending NOA" />
                <StatCard title="Preparing Docs" value={myPreparing.toString()} icon={Users} trend="Action Req" trendColor="text-indigo-400" href="/pipeline?filter=Preparing Docs" />
                <StatCard title="Awaiting RMA" value={myAwaitingRMA.toString()} icon={CheckCircle2} trend="Blocked" trendColor="text-cyan-400" href="/pipeline?filter=Awaiting RMA Review" />
                <StatCard title="Pending Sigs" value={myPendingSigs.toString()} icon={DollarSign} trend="Client Action" trendColor="text-purple-400" href="/pipeline?filter=Pending Client Signature" />
              </>
            )}
          </div>

          {/* BROKER PRIMARY ACTION */}
          {!isAdmin && (
            <div className="mt-8">
              <Link href="/pipeline">
                <button className="w-full md:w-auto px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-lg shadow-indigo-900/20 flex items-center justify-center transition-all hover:scale-105">
                  <Activity className="mr-2 h-5 w-5" />
                  Open Pipeline Workspace
                  <ArrowUpRight className="ml-2 h-5 w-5" />
                </button>
              </Link>
            </div>
          )}

        </div>
        <div className="w-full md:w-80 flex-shrink-0">
          <AchievementTracker />
        </div>
      </div>

      {/* Pipeline Visualization & Recent Activity - ONLY SHOW FOR ADMIN */}
      {
        isAdmin && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle className="text-lg font-medium text-slate-200">Pipeline Stages</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap justify-between items-center gap-4 px-4">
                  {/* Dynamic Pipeline Stages - GLOBAL VIEW */}
                  {[
                    { id: 'New', label: 'Uploaded', count: totalUploaded, color: 'text-slate-400' },
                    { id: 'Sent to RMA', label: 'Sent to RMA', count: sentToRma, color: 'text-blue-400' },
                    { id: 'RMA Verified', label: 'RMA Verified', count: rmaVerified, color: 'text-indigo-400' },
                    { id: 'Allocated', label: 'Allocated', count: totalAllocated, color: 'text-amber-400' },
                    { id: 'Approved', label: 'Converted', count: totalConverted, color: 'text-emerald-400' }
                  ].map((stage) => {
                    // Calculate percentage relative to TOTAL leads for visualization (avoid div by zero)
                    const percent = leads.length > 0 ? Math.round((stage.count / leads.length) * 100) : 0;
                    return (
                      <Link
                        key={stage.id}
                        href={`/pipeline?filter=${stage.id}`}
                        className="flex flex-col items-center space-y-2 hover:scale-105 transition-transform cursor-pointer"
                      >
                        <span className={`text-xs font-medium uppercase tracking-wider ${stage.color}`}>{stage.label}</span>
                        <ProgressRing
                          progress={percent}
                          radius={35}
                          stroke={4}
                          color={stage.color.replace('text-', 'text-')}
                        />
                        <span className="text-sm font-bold text-white">{stage.count}</span>
                      </Link>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle className="text-lg font-medium text-slate-200">Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {recentActivity.map((item) => (
                    <div key={item.id} className="flex items-start">
                      <div className="mt-1 h-2 w-2 rounded-full bg-blue-500 mr-4 ring-4 ring-blue-500/20" />
                      <div className="flex-1 space-y-1">
                        <p className="text-sm font-medium text-white leading-none">{item.description}</p>
                        <div className="flex justify-between items-center">
                          <p className="text-xs text-slate-500 capitalize">{item.type}</p>
                          <span className="text-xs text-slate-500">{item.timestamp}</span>
                        </div>
                      </div>
                      {item.status === 'completed' && <CheckCircle2 className="h-4 w-4 text-emerald-500 ml-2" />}
                    </div>
                  ))}
                  <button className="w-full text-center text-xs text-blue-400 hover:text-blue-300 transition-colors mt-2">
                    View All Activity
                  </button>
                </div>
              </CardContent>
            </Card>
          </div>
        )
      }

      {/* Quick Actions - Visible to all or just Admin? User didn't specify, likely OK for all */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <ActionCard title="Upload New List" description="Import Excel/CSV for new employers" />
        <ActionCard title="Generate CF-2A" description="Create compliance docs for allocation" />
        <ActionCard title="RMA Sync" description="Manually trigger RMA data refresh" />
      </div>
    </div >
  );
}

// export function StatCard({title, value, icon: Icon, trend, trendColor, href }: any) {
export function StatCard({ title, value, icon: Icon, trend, trendColor, href }: any) {
  const Content = (
    <Card className="bg-slate-900/40 border-slate-800/60 backdrop-blur-sm hover:border-slate-700 transition-all h-full cursor-pointer hover:bg-slate-800/40">
      <CardContent className="p-6">
        <div className="flex items-center justify-between space-y-0 pb-2">
          <p className="text-sm font-medium text-slate-400">{title}</p>
          <Icon className="h-4 w-4 text-slate-500" />
        </div>
        <div className="text-2xl font-bold text-white">{value || "0"}</div>
        <p className={`text-xs ${trendColor} flex items-center mt-1`}>
          {trend} <ArrowUpRight className="h-3 w-3 ml-1" />
        </p>
      </CardContent>
    </Card>
  );

  if (href) {
    return <Link href={href}>{Content}</Link>;
  }

  return Content;
}

function ActionCard({ title, description }: any) {
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
