"use client";

import { useState } from "react";
import { useMockData, Lead, RMAData } from "@/context/MockDataContext";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { ShieldCheck, Save, X, FileCheck } from "lucide-react";
import { DocumentReviewModal } from "@/components/RMA/DocumentReviewModal";

export default function RMAVerifyPage() {
    const { leads, updateLeadRMAData, updateLeadStatus, updateLeadRecommendation } = useMockData();
    const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
    const [activeTab, setActiveTab] = useState<'Enrichment' | 'Approval' | 'Submission'>('Enrichment');
    const [reviewingLead, setReviewingLead] = useState<Lead | null>(null);

    // Filter leads based on Tab
    const displayedLeads = leads.filter(l => {
        if (activeTab === 'Enrichment') return l.status === 'Sent to RMA';
        if (activeTab === 'Approval') return l.status === 'Awaiting RMA Review';
        if (activeTab === 'Submission') return l.status === 'Pending CF Submission';
        return false;
    });

    const handleApproveDocs = (lead: Lead) => {
        updateLeadStatus(lead.id, 'Pending Client Signature');
    };

    const handleRejectDocs = (lead: Lead) => {
        updateLeadStatus(lead.id, 'Preparing Docs');
    };

    const handleSubmitCF = (lead: Lead) => {
        updateLeadStatus(lead.id, 'Approved & Closed');
    };

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-white flex items-center">
                        <ShieldCheck className="mr-3 h-8 w-8 text-blue-500" />
                        RMA Command Centre
                    </h2>
                    <p className="text-slate-400">Secure Interface for RMA Backend Teams.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* List of Leads */}
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <div className="flex items-center space-x-4 border-b border-slate-800 pb-1 overflow-x-auto">
                            <button
                                onClick={() => { setActiveTab('Enrichment'); setSelectedLead(null); }}
                                className={`text-sm font-medium pb-2 border-b-2 transition-colors whitespace-nowrap ${activeTab === 'Enrichment' ? 'border-blue-500 text-blue-400' : 'border-transparent text-slate-400 hover:text-slate-200'}`}
                            >
                                Data Enrichment ({leads.filter(l => l.status === 'Sent to RMA').length})
                            </button>
                            <button
                                onClick={() => { setActiveTab('Approval'); setSelectedLead(null); }}
                                className={`text-sm font-medium pb-2 border-b-2 transition-colors whitespace-nowrap ${activeTab === 'Approval' ? 'border-amber-500 text-amber-400' : 'border-transparent text-slate-400 hover:text-slate-200'}`}
                            >
                                Doc Approval ({leads.filter(l => l.status === 'Awaiting RMA Review').length})
                            </button>
                            <button
                                onClick={() => { setActiveTab('Submission'); setSelectedLead(null); }}
                                className={`text-sm font-medium pb-2 border-b-2 transition-colors whitespace-nowrap ${activeTab === 'Submission' ? 'border-emerald-500 text-emerald-400' : 'border-transparent text-slate-400 hover:text-slate-200'}`}
                            >
                                CF Submissions ({leads.filter(l => l.status === 'Pending CF Submission').length})
                            </button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="relative overflow-x-auto mt-4">
                            <table className="w-full text-sm text-left text-slate-400">
                                <thead className="text-xs text-slate-200 uppercase bg-slate-900/50">
                                    <tr>
                                        <th className="px-4 py-3">Company</th>
                                        <th className="px-4 py-3">Details</th>
                                        <th className="px-4 py-3 text-right">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {displayedLeads.length === 0 ? (
                                        <tr>
                                            <td colSpan={3} className="px-4 py-4 text-center text-slate-500 italic">
                                                No tasks found in {activeTab} queue.
                                            </td>
                                        </tr>
                                    ) : (
                                        displayedLeads.map((lead) => (
                                            <tr key={lead.id} className="border-b border-slate-800 hover:bg-slate-800/20 transition-colors">
                                                <td className="px-4 py-4 font-medium text-white">
                                                    {lead.companyName}
                                                    <div className="text-xs text-slate-500">{lead.currentClass}</div>
                                                </td>
                                                <td className="px-4 py-4">
                                                    {activeTab === 'Approval' && (
                                                        <span className="text-xs bg-slate-800 text-slate-300 px-2 py-1 rounded">
                                                            rec: {lead.recommendationType || 'N/A'}
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="px-4 py-4 text-right space-x-2">
                                                    {activeTab === 'Enrichment' && (
                                                        <div className="flex space-x-2 justify-end">
                                                            <Button
                                                                size="sm"
                                                                variant={selectedLead?.id === lead.id ? "primary" : "secondary"}
                                                                onClick={() => setSelectedLead(lead)}
                                                            >
                                                                Enrich Data
                                                            </Button>
                                                        </div>
                                                    )}
                                                    {activeTab === 'Approval' && (
                                                        <Button
                                                            size="sm"
                                                            variant="primary"
                                                            className="bg-indigo-600 hover:bg-indigo-700 text-white"
                                                            onClick={() => setReviewingLead(lead)}
                                                        >
                                                            <FileCheck className="mr-1.5 h-3 w-3" />
                                                            Review Uploaded Docs
                                                        </Button>
                                                    )}
                                                    {activeTab === 'Submission' && (
                                                        <div className="flex space-x-2 justify-end">
                                                            <Button
                                                                size="sm"
                                                                variant="secondary"
                                                                className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700"
                                                                onClick={() => setReviewingLead(lead)}
                                                            >
                                                                <FileCheck className="mr-1.5 h-3 w-3" />
                                                                Review Signed Docs
                                                            </Button>
                                                            <Button
                                                                size="sm"
                                                                variant="primary"
                                                                className="bg-blue-600 hover:bg-blue-700 text-white"
                                                                onClick={() => updateLeadStatus(lead.id, 'CF Submitted')}
                                                            >
                                                                Submit to CF & Close
                                                            </Button>
                                                        </div>
                                                    )}
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>

                {/* Enrichment / Verification Form */}
                <div className="lg:col-span-1">
                    {activeTab === 'Enrichment' && (
                        selectedLead ? (
                            <EnrichmentForm
                                lead={selectedLead}
                                onSave={(data) => {
                                    updateLeadRMAData(selectedLead.id, data);
                                    setSelectedLead(null);
                                }}
                                onCancel={() => setSelectedLead(null)}
                            />
                        ) : (
                            <div className="h-full border-2 border-dashed border-slate-800 rounded-xl flex items-center justify-center p-12 text-center text-slate-500">
                                <p>Select a lead to begin enrichment.</p>
                            </div>
                        )
                    )}
                    {activeTab !== 'Enrichment' && (
                        <div className="h-full border-2 border-dashed border-slate-800 rounded-xl flex items-center justify-center p-12 text-center text-slate-500">
                            <p>No extra details required for {activeTab}.</p>
                        </div>
                    )}
                </div>
            </div>
            {/* Document Review Modal - Rendered outside the grid to ensure it sits on top */}
            {reviewingLead && (
                <DocumentReviewModal
                    lead={reviewingLead}
                    onClose={() => setReviewingLead(null)}
                />
            )}
        </div>
    );
}

function EnrichmentForm({ lead, onSave, onCancel }: { lead: Lead, onSave: (data: RMAData) => void, onCancel: () => void }) {
    const [formData, setFormData] = useState<RMAData>(lead.rmaData || {
        isExistingClient: 'Pending',
        products: [],
        activeTransfer: false,
        alreadyAllocatedToRMA: 'No',
        rmaIncumbentName: '',
        contactName: '',
        contactPhone: '',
        contactEmail: ''
    });

    const PRODUCTS = ['Funeral Cover', 'Augmentation +', 'Group Risk', 'COID'];

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
    };

    const handleProductChange = (product: string) => {
        setFormData(prev => {
            const current = prev.products;
            if (current.includes(product)) {
                return { ...prev, products: current.filter(p => p !== product) };
            } else {
                return { ...prev, products: [...current, product] };
            }
        });
    };

    // Conditional Logic Helpers
    const isExistingClient = formData.isExistingClient === 'Yes';
    const isAllocated = formData.alreadyAllocatedToRMA === 'Yes';
    const isContactRequired = formData.isExistingClient !== 'No';

    return (
        <Card className="bg-slate-900 border-blue-900/50 shadow-lg shadow-blue-900/10 h-fit">
            <CardHeader>
                <CardTitle className="text-white text-lg">
                    Enriching: {lead.companyName}
                </CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Existing Client Toggle */}
                    <div className="space-y-2">
                        <label className="text-xs font-medium text-slate-300">Existing RMA Client?</label>
                        <select
                            className="w-full bg-slate-950 border border-slate-700 rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                            value={formData.isExistingClient}
                            onChange={(e) => setFormData({ ...formData, isExistingClient: e.target.value as any })}
                        >
                            <option value="Pending">Select...</option>
                            <option value="Yes">Yes</option>
                            <option value="No">No</option>
                        </select>
                    </div>

                    {/* Conditional Products - Show if Existing Client is YES */}
                    {isExistingClient && (
                        <div className="space-y-2 p-3 bg-blue-950/20 rounded-md border border-blue-900/30">
                            <label className="text-xs font-medium text-blue-300">Active Products</label>
                            <div className="space-y-1">
                                {PRODUCTS.map(p => (
                                    <label key={p} className="flex items-center space-x-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            className="accent-blue-500 rounded border-slate-700 bg-slate-900"
                                            checked={formData.products.includes(p)}
                                            onChange={() => handleProductChange(p)}
                                        />
                                        <span className="text-sm text-slate-300">{p}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    )}

                    <hr className="border-slate-800 my-4" />

                    {/* Allocated to RMA Toggle - INDEPENDENT of Existing Client */}
                    <div className="space-y-2">
                        <label className="text-xs font-medium text-slate-300">Already Allocated to RMA Broker?</label>
                        <select
                            className="w-full bg-slate-950 border border-slate-700 rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                            value={formData.alreadyAllocatedToRMA || 'No'}
                            onChange={(e) => setFormData({ ...formData, alreadyAllocatedToRMA: e.target.value as any })}
                        >
                            <option value="No">No</option>
                            <option value="Yes">Yes</option>
                        </select>
                    </div>

                    {/* Conditional Incumbent Name - Show if Allocated is YES */}
                    {isAllocated && (
                        <div className="space-y-2">
                            <label className="text-xs font-medium text-amber-300">RMA Incumbent Name</label>
                            <input
                                type="text"
                                className="w-full bg-slate-950 border border-amber-900/50 rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                                placeholder="Enter incumbent broker name..."
                                value={formData.rmaIncumbentName || ''}
                                onChange={(e) => setFormData({ ...formData, rmaIncumbentName: e.target.value })}
                            />
                        </div>
                    )}

                    <hr className="border-slate-800 my-4" />

                    {/* Contact Details - Optional if Existing Client is NO */}
                    <div className="space-y-2">
                        <label className="text-xs font-medium text-slate-300">
                            Contact Person {isContactRequired ? '*' : '(Optional)'}
                        </label>
                        <input
                            type="text"
                            required={isContactRequired}
                            className="w-full bg-slate-950 border border-slate-700 rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-blue-500 invalid:border-red-500"
                            value={formData.contactName}
                            onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-medium text-slate-300">
                            Email Address {isContactRequired ? '*' : '(Optional)'}
                        </label>
                        <input
                            type="email"
                            required={isContactRequired}
                            className="w-full bg-slate-950 border border-slate-700 rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-blue-500 invalid:border-red-500"
                            value={formData.contactEmail}
                            onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-medium text-slate-300">
                            Phone Number {isContactRequired ? '*' : '(Optional)'}
                        </label>
                        <input
                            type="tel"
                            required={isContactRequired}
                            className="w-full bg-slate-950 border border-slate-700 rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-blue-500 invalid:border-red-500"
                            value={formData.contactPhone}
                            onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                        />
                    </div>

                    <div className="pt-4 flex gap-2">
                        <Button type="submit" className="w-full">
                            <Save className="mr-2 h-4 w-4" />
                            Save & Verify
                        </Button>
                        <Button type="button" variant="ghost" onClick={onCancel}>
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}
