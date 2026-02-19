"use client";

import { useMockData, Lead } from "@/context/MockDataContext";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Users, ArrowRight, CheckCircle2, X } from "lucide-react";
import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";

const BROKERS = [
    "Internal Broker (Operational)",
    "Broker Alpha",
    "Broker Bravo",
    "Broker Charlie",
    "Broker Delta",
    "Broker Echo"
];

export default function AllocationPage() {
    return (
        <Suspense fallback={<div className="text-white">Loading allocation data...</div>}>
            <AllocationContent />
        </Suspense>
    );
}

function AllocationContent() {
    const { leads, assignBroker } = useMockData();
    const searchParams = useSearchParams();
    const router = useRouter();
    const filter = searchParams.get('filter');

    // Default to 'RMA Verified' if no filter. 
    // If filter is provided (e.g. ?filter=Allocated), show those.
    // Note: Use matching strictly if filter exists.
    const targetStatus = filter || 'RMA Verified';
    const displayedLeads = leads.filter(l => l.status === targetStatus);

    const clearFilter = () => {
        router.push('/allocation');
    };

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-white flex items-center">
                        <Users className="mr-3 h-8 w-8 text-amber-500" />
                        Lead Allocation
                    </h2>
                    <p className="text-slate-400">Assign verified leads to sub-brokers for engagement.</p>
                </div>
                {filter && (
                    <Button variant="ghost" onClick={clearFilter} className="text-red-400 hover:bg-slate-800">
                        <X className="mr-2 h-4 w-4" />
                        Clear Filter
                    </Button>
                )}
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="text-white">
                        {filter ? `Leads: ${filter}` : 'Verified Leads Awaiting Allocation'}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="relative overflow-x-auto">
                        <table className="w-full text-sm text-left text-slate-400">
                            <thead className="text-xs text-slate-200 uppercase bg-slate-900/50">
                                <tr>
                                    <th className="px-6 py-3">Company</th>
                                    <th className="px-6 py-3">RMA Products</th>
                                    <th className="px-6 py-3">Existing Client?</th>
                                    <th className="px-6 py-3">Contact</th>
                                    <th className="px-6 py-3">Assign Broker</th>
                                    <th className="px-6 py-3 text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {displayedLeads.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-4 text-center text-slate-500 italic">
                                            No leads found with status '{targetStatus}'.
                                        </td>
                                    </tr>
                                ) : (
                                    displayedLeads.map((lead) => (
                                        <AllocationRow key={lead.id} lead={lead} onAllocate={assignBroker} />
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

function AllocationRow({ lead, onAllocate }: { lead: Lead, onAllocate: (id: string, broker: string) => void }) {
    const [selectedBroker, setSelectedBroker] = useState(BROKERS[0]);

    return (
        <tr className="border-b border-slate-800 hover:bg-slate-800/20 transition-colors">
            <td className="px-6 py-4 font-medium text-white">
                {lead.companyName}
                <div className="text-xs text-slate-500 mt-0.5">{lead.currentClass} → {lead.targetClass}</div>
            </td>
            <td className="px-6 py-4">
                <div className="flex flex-wrap gap-1">
                    {lead.rmaData?.products.map((p, i) => (
                        <span key={i} className="inline-flex items-center rounded-full bg-blue-900/30 px-2 py-0.5 text-xs font-medium text-blue-400">
                            {p}
                        </span>
                    ))}
                </div>
            </td>
            <td className="px-6 py-4">
                <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${lead.rmaData?.isExistingClient === 'Yes' ? 'bg-emerald-900/30 text-emerald-400' : 'bg-slate-800 text-slate-400'
                    }`}>
                    {lead.rmaData?.isExistingClient}
                </span>
            </td>
            <td className="px-6 py-4">
                <div className="text-white">{lead.rmaData?.contactName}</div>
                <div className="text-xs text-slate-500">{lead.rmaData?.contactEmail}</div>
            </td>
            <td className="px-6 py-4">
                <select
                    className="bg-slate-950 border border-slate-700 rounded-md px-3 py-1.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                    value={selectedBroker}
                    onChange={(e) => setSelectedBroker(e.target.value)}
                >
                    {BROKERS.map(b => <option key={b} value={b}>{b}</option>)}
                </select>
            </td>
            <td className="px-6 py-4 text-right">
                <Button
                    size="sm"
                    variant="primary"
                    onClick={() => onAllocate(lead.id, selectedBroker)}
                >
                    Allocate <ArrowRight className="ml-2 h-3 w-3" />
                </Button>
            </td>
        </tr>
    );
}
