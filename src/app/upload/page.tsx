"use client";

import { useMockData } from "@/context/MockDataContext";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Upload, Send, X } from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation";
import { Suspense, useState } from "react";
import { BulkUploadModal } from "@/components/Admin/BulkUploadModal";

export default function LeadUploadPage() {
    return (
        <Suspense fallback={<div className="text-white">Loading...</div>}>
            <LeadUploadContent />
        </Suspense>
    );
}

function LeadUploadContent() {
    const { leads, updateLeadStatus, addLead } = useMockData();
    const searchParams = useSearchParams();
    const router = useRouter();
    const filter = searchParams.get('filter');

    // Filter leads. Default to 'New' if no filter or if filter is 'New'. 
    // If filter is explicitly something else, use that (e.g. debugging).
    // Actually, user standard is "Clicking New Leads routes to /upload?filter=New".
    const targetStatus = filter || 'New';
    const displayedLeads = leads.filter(l => l.status === targetStatus);

    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

    const handleFileUpload = () => {
        setIsUploadModalOpen(true);
    };

    const clearFilter = () => {
        router.push('/upload');
    };

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-white">Lead Upload</h2>
                    <p className="text-slate-400">Import new employer lists and prepare them for RMA verification.</p>
                </div>
                <div className="flex gap-2">
                    {filter && (
                        <Button variant="ghost" onClick={clearFilter} className="text-red-400 hover:bg-slate-800">
                            <X className="mr-2 h-4 w-4" />
                            Clear Filter
                        </Button>
                    )}
                    <Button onClick={handleFileUpload}>
                        <Upload className="mr-2 h-4 w-4" />
                        Upload CSV
                    </Button>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="text-white">
                        {filter ? `Leads: ${filter}` : 'New Leads Pending Action'}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="relative overflow-x-auto">
                        <table className="w-full text-sm text-left text-slate-400">
                            <thead className="text-xs text-slate-200 uppercase bg-slate-900/50">
                                <tr>
                                    <th className="px-6 py-3">Company Name</th>
                                    <th className="px-6 py-3">Current Class</th>
                                    <th className="px-6 py-3">Wage Bill</th>
                                    <th className="px-6 py-3">Broker</th>
                                    <th className="px-6 py-3 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {displayedLeads.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-4 text-center text-slate-500 italic">
                                            No leads found with status '{targetStatus}'.
                                            {filter ? <span className="ml-1 cursor-pointer text-blue-400 hover:underline" onClick={clearFilter}>View All New</span> : " Upload a list to get started."}
                                        </td>
                                    </tr>
                                ) : (
                                    displayedLeads.map((lead) => (
                                        <tr key={lead.id} className="border-b border-slate-800 hover:bg-slate-800/20 transition-colors">
                                            <td className="px-6 py-4 font-medium text-white">{lead.companyName}</td>
                                            <td className="px-6 py-4">{lead.currentClass}</td>
                                            <td className="px-6 py-4">R {lead.wageBill.toLocaleString('en-US')}</td>
                                            <td className="px-6 py-4">{lead.brokerOwner}</td>
                                            <td className="px-6 py-4 text-right space-x-2">
                                                <Button
                                                    size="sm"
                                                    variant="secondary"
                                                    className="text-red-400 hover:text-red-300 hover:bg-red-950/30 border border-transparent hover:border-red-900/50"
                                                    onClick={() => updateLeadStatus(lead.id, 'Archived')}
                                                >
                                                    <X className="mr-2 h-3 w-3" />
                                                    Archive
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="primary"
                                                    onClick={() => updateLeadStatus(lead.id, 'Sent to RMA')}
                                                >
                                                    <Send className="mr-2 h-3 w-3" />
                                                    Send to RMA
                                                </Button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>

            <BulkUploadModal
                isOpen={isUploadModalOpen}
                onClose={() => setIsUploadModalOpen(false)}
            />
        </div>
    );
}
