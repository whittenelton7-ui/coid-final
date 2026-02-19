"use client";

import { useState } from "react";
import { Lead, useMockData } from "@/context/MockDataContext";
import { Button } from "@/components/ui/Button";
import { X, FileText, CheckCircle, AlertTriangle, Download, Eye } from "lucide-react";
import { Checklist } from "./Checklist";

interface DocumentReviewModalProps {
    lead: Lead;
    onClose: () => void;
}

export function DocumentReviewModal({ lead, onClose }: DocumentReviewModalProps) {
    const { updateLeadStatus } = useMockData();
    const [activeTab, setActiveTab] = useState<'NOA' | 'PACK'>('NOA');
    const [isRejectionReasonOpen, setIsRejectionReasonOpen] = useState(false);
    const [rejectionReason, setRejectionReason] = useState("");

    const handleApprove = () => {
        updateLeadStatus(lead.id, 'Pending Client Signature');
        onClose();
    };

    const handleReject = () => {
        // In a real app we would save the rejection reason
        console.log(`Rejecting ${lead.id} with reason: ${rejectionReason}`);
        updateLeadStatus(lead.id, 'Preparing Docs');
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="bg-slate-900 border border-slate-800 rounded-xl shadow-2xl w-full max-w-5xl h-[90vh] flex flex-col overflow-hidden">

                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-slate-800 bg-slate-900">
                    <div>
                        <div className="flex items-center space-x-3 mb-1">
                            <h2 className="text-xl font-bold text-white">{lead.companyName}</h2>
                            <span className="px-2 py-0.5 rounded text-xs font-medium bg-blue-900/30 text-blue-400 border border-blue-800">
                                {lead.currentClass}
                            </span>
                        </div>
                        <p className="text-sm text-slate-400">
                            Proposed: <span className="text-amber-400 font-semibold">{lead.recommendationType || 'Generic Recommendation'}</span>
                        </p>
                    </div>
                    <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors">
                        <X className="h-6 w-6" />
                    </button>
                </div>

                {/* Body - Split View */}
                <div className="flex-1 flex overflow-hidden">

                    {/* Left: Sidebar / Metadata */}
                    <div className="w-80 border-r border-slate-800 bg-slate-950/50 p-6 overflow-y-auto hidden md:block">
                        <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-4">Document Manifest</h3>

                        <div className="space-y-3">
                            <div
                                className={`p-3 rounded-lg border cursor-pointer transition-all ${activeTab === 'NOA' ? 'bg-slate-800 border-blue-500/50' : 'bg-slate-900 border-slate-800 hover:border-slate-700'}`}
                                onClick={() => setActiveTab('NOA')}
                            >
                                <div className="flex items-start">
                                    <FileText className="h-5 w-5 text-purple-400 mt-0.5 mr-3" />
                                    <div>
                                        <div className="text-sm font-medium text-slate-200">Notice of Assessment</div>
                                        <div className="text-xs text-slate-500 mt-1">Uploaded: Yesterday</div>
                                    </div>
                                </div>
                            </div>

                            <div
                                className={`p-3 rounded-lg border cursor-pointer transition-all ${activeTab === 'PACK' ? 'bg-slate-800 border-blue-500/50' : 'bg-slate-900 border-slate-800 hover:border-slate-700'}`}
                                onClick={() => setActiveTab('PACK')}
                            >
                                <div className="flex items-start">
                                    <FileText className="h-5 w-5 text-indigo-400 mt-0.5 mr-3" />
                                    <div>
                                        <div className="text-sm font-medium text-slate-200">Recommendation Pack</div>
                                        <div className="text-xs text-slate-500 mt-1">Uploaded: 2 hours ago</div>
                                        <div className="flex gap-1 mt-2">
                                            <span className="text-[10px] bg-slate-950 px-1 rounded text-slate-400">CF-1B</span>
                                            <span className="text-[10px] bg-slate-950 px-1 rounded text-slate-400">CF-2A</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8">
                            <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-2">Checklist</h3>
                            <Checklist />
                        </div>
                    </div>

                    {/* Right: Mock PDF Viewer */}
                    <div className="flex-1 bg-slate-900 flex flex-col">
                        {/* Viewer Toolbar */}
                        <div className="h-12 border-b border-slate-800 flex items-center justify-between px-4 bg-slate-900">
                            <div className="flex items-center space-x-2 text-sm text-slate-400">
                                <span className="font-medium text-slate-200">{activeTab === 'NOA' ? 'W.As. 182 - Notice of Assessment.pdf' : 'RMA Recommendation Bundle_v2.pdf'}</span>
                                <span className="text-slate-600">|</span>
                                <span>Page 1 of {activeTab === 'NOA' ? '1' : '14'}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Button size="sm" variant="ghost" className="h-8 w-8 p-0"><Download className="h-4 w-4" /></Button>
                                <Button size="sm" variant="ghost" className="h-8 w-8 p-0"><Eye className="h-4 w-4" /></Button>
                            </div>
                        </div>

                        {/* Document Content Area */}
                        <div className="flex-1 p-8 bg-slate-950/30 overflow-y-auto flex justify-center">
                            <div className="w-full max-w-3xl bg-white min-h-[800px] shadow-lg rounded-sm p-12 text-slate-800 relative">
                                {/* Watermark / Mock Content */}
                                <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                                    <div className="text-9xl font-black text-slate-900 rotate-12">COPY</div>
                                </div>

                                {/* Mock Document Content based on Active Tab */}
                                {activeTab === 'NOA' ? (
                                    <div className="space-y-6">
                                        <div className="flex justify-between items-start border-b-2 border-slate-800 pb-4 mb-8">
                                            <div>
                                                <h1 className="text-2xl font-bold uppercase tracking-widest text-slate-900">Notice of Assessment</h1>
                                                <p className="text-sm font-medium mt-1">Compensation for Occupational Injuries and Diseases Act</p>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-xs font-bold uppercase text-slate-500">Form W.As. 182</div>
                                                <div className="text-xl font-mono mt-1">Ref: {lead.id}</div>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-8 text-sm">
                                            <div className="space-y-1">
                                                <div className="font-bold uppercase text-xs text-slate-500">Employer</div>
                                                <div className="font-semibold">{lead.companyName}</div>
                                                <div>123 Industrial Way</div>
                                                <div>Cape Town, 8001</div>
                                            </div>
                                            <div className="text-right space-y-1">
                                                <div className="font-bold uppercase text-xs text-slate-500">Date of Issue</div>
                                                <div>14 Feb 2026</div>
                                                <div className="font-bold uppercase text-xs text-slate-500 mt-2">Class</div>
                                                <div>{lead.currentClass}</div>
                                            </div>
                                        </div>

                                        <div className="mt-8 border text-sm">
                                            <div className="bg-slate-100 p-2 font-bold border-b flex justify-between">
                                                <span>Description</span>
                                                <span>Amount</span>
                                            </div>
                                            <div className="p-2 flex justify-between border-b">
                                                <span>Assessment for 2025/2026</span>
                                                <span>R 45,230.00</span>
                                            </div>
                                            <div className="p-2 flex justify-between border-b bg-yellow-50">
                                                <span>Interest / Penalties</span>
                                                <span>R 0.00</span>
                                            </div>
                                            <div className="p-2 flex justify-between font-bold text-lg">
                                                <span>Total Due</span>
                                                <span>R 45,230.00</span>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-6">
                                        <div className="text-center mb-12">
                                            <h1 className="text-3xl font-serif text-slate-900">Motivated Recommendation</h1>
                                            <div className="w-24 h-1 bg-slate-900 mx-auto mt-4"></div>
                                        </div>

                                        <div className="space-y-4 font-serif leading-relaxed">
                                            <p>
                                                <strong>Subject:</strong> Proposal for {lead.recommendationType || 'Reclassification'} regarding {lead.companyName}.
                                            </p>
                                            <p>
                                                Currently registered under Class <strong>{lead.currentClass}</strong>, the entity's primary business activities have evolved significantly over the past financial year.
                                            </p>
                                            <p>
                                                Based on the attached operational analysis and site visit report, we submit that the risk profile is more accurately reflected by the proposed classification.
                                            </p>
                                        </div>

                                        <div className="mt-12 p-6 border border-dashed border-slate-300 rounded bg-slate-50">
                                            <h3 className="font-bold text-xs uppercase text-slate-400 mb-4">Supporting Documentation Attached</h3>
                                            <div className="grid grid-cols-2 gap-4 text-sm">
                                                <div className="flex items-center"><FileText className="h-4 w-4 mr-2" /> CF-1B Registration Form</div>
                                                <div className="flex items-center"><FileText className="h-4 w-4 mr-2" /> CF-2A Return of Earnings</div>
                                                <div className="flex items-center"><FileText className="h-4 w-4 mr-2" /> CIPC Registration</div>
                                                <div className="flex items-center"><FileText className="h-4 w-4 mr-2" /> Operational Photos</div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="p-6 border-t border-slate-800 bg-slate-950">
                    {isRejectionReasonOpen ? (
                        <div className="space-y-3 animate-in fade-in slide-in-from-bottom-2">
                            <label className="text-sm font-medium text-slate-300">Rejection Notes for Broker:</label>
                            <textarea
                                value={rejectionReason}
                                onChange={(e) => setRejectionReason(e.target.value)}
                                placeholder="If rejecting, please provide notes for the broker..."
                                className="w-full bg-slate-900 border border-slate-700 rounded-md p-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-red-500 min-h-[80px]"
                            />
                            <div className="flex justify-end space-x-3">
                                <Button onClick={() => setIsRejectionReasonOpen(false)} variant="ghost">
                                    Cancel
                                </Button>
                                <Button onClick={handleReject} variant="danger">
                                    Confirm Rejection & Return to Broker
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-center justify-between">
                            {lead.status === 'Pending CF Submission' ? (
                                // READ-ONLY MODE for Final Submission
                                <>
                                    <div className="text-sm text-amber-500 font-medium italic flex items-center">
                                        <CheckCircle className="mr-2 h-4 w-4" />
                                        Docs Locked for CF Submission. Read Only.
                                    </div>
                                    <Button onClick={onClose} variant="ghost" className="border border-slate-700">
                                        Close Viewer
                                    </Button>
                                </>
                            ) : (
                                // EDIT/APPROVAL MODE
                                <>
                                    <div className="text-sm text-slate-500 italic">
                                        Please review all documents carefully before approving.
                                    </div>
                                    <div className="flex items-center space-x-4">
                                        <Button
                                            onClick={() => setIsRejectionReasonOpen(true)}
                                            variant="danger"
                                            className="bg-red-950/30 text-red-400 border border-red-900/50 hover:bg-red-900/50"
                                        >
                                            <AlertTriangle className="mr-2 h-4 w-4" />
                                            Reject / Require Changes
                                        </Button>
                                        <div className="h-8 w-px bg-slate-800"></div>
                                        <Button
                                            onClick={handleApprove}
                                            className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-900/20 px-8"
                                        >
                                            <CheckCircle className="mr-2 h-5 w-5" />
                                            Approve Documents
                                        </Button>
                                    </div>
                                </>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
