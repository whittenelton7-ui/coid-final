"use client";

import { useMockData, Lead } from "@/context/MockDataContext";
import { Button } from "@/components/ui/Button";
import { Kanban, FileText, CheckCircle, Clock, X, Upload, ShieldCheck, Download, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSearchParams, useRouter } from "next/navigation";
import { Suspense, useState } from "react";
import { DocumentModal } from "@/components/pipeline/DocumentModal";
import { LeadDetailModal } from "@/components/pipeline/LeadDetailModal";
import { RecommendationUploadModal } from "@/components/pipeline/RecommendationUploadModal";
import { DownloadPackModal } from "@/components/pipeline/DownloadPackModal";
import { useToast } from "@/context/ToastContext";

export default function PipelinePage() {
    return (
        <Suspense fallback={<div className="text-white">Loading pipeline...</div>}>
            <PipelineContent />
        </Suspense>
    );
}

function PipelineContent() {
    const { leads, updateLeadStatus, updateGroupRiskStatus, currentUser } = useMockData();
    const { showToast } = useToast();
    const searchParams = useSearchParams();
    const router = useRouter();
    const filter = searchParams.get('filter');

    // Modal State
    const [isDocumentModalOpen, setIsDocumentModalOpen] = useState(false);
    const [isRecUploadModalOpen, setIsRecUploadModalOpen] = useState(false);
    const [isSimpleUploadModalOpen, setIsSimpleUploadModalOpen] = useState(false);
    const [simpleUploadType, setSimpleUploadType] = useState<'NOA' | 'SIGNED_DOCS'>('NOA');

    const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
    const [detailLead, setDetailLead] = useState<Lead | null>(null);

    // Filter leads based on Role - Admin sees all, others see own
    const roleFilteredLeads = currentUser === 'Lead Broker (Admin)'
        ? leads
        : leads.filter(l => l.brokerOwner === currentUser);

    // NEW 9-COLUMN KANBAN DEFINITION - RESTORED FULL WORKFLOW
    const kanbanColumns = [
        { id: 'Allocated', title: 'Allocated', icon: Users, color: 'text-blue-400', leads: roleFilteredLeads.filter(l => l.status === 'Allocated') },
        { id: 'Pending NOA', title: 'Pending NOA', icon: FileText, color: 'text-amber-400', leads: roleFilteredLeads.filter(l => l.status === 'Pending NOA') },
        // RMA NOA Check Removed - Direct to Preparing Docs
        { id: 'Preparing Docs', title: 'Preparing Docs', icon: FileText, color: 'text-indigo-400', leads: roleFilteredLeads.filter(l => l.status === 'Preparing Docs') },
        { id: 'Awaiting RMA Review', title: 'Awaiting RMA', icon: ShieldCheck, color: 'text-cyan-400', leads: roleFilteredLeads.filter(l => l.status === 'Awaiting RMA Review') },
        { id: 'Pending Client Signature', title: 'Pending Client Sig', icon: Download, color: 'text-purple-400', leads: roleFilteredLeads.filter(l => l.status === 'Pending Client Signature') },
        { id: 'Awaiting Signed Documents', title: 'Awaiting Signatures', icon: Clock, color: 'text-amber-400', leads: roleFilteredLeads.filter(l => l.status === 'Awaiting Signed Documents') },
        { id: 'Pending CF Submission', title: 'Ready for Submission', icon: Upload, color: 'text-teal-400', leads: roleFilteredLeads.filter(l => l.status === 'Pending CF Submission') },
        { id: 'CF Submitted', title: 'CF Submitted / Upsell', icon: CheckCircle, color: 'text-emerald-400', leads: roleFilteredLeads.filter(l => l.status === 'CF Submitted') },
    ];

    // Apply URL Filter if present
    const displayedColumns = filter
        ? kanbanColumns.filter(col => col.id === filter)
        : kanbanColumns;

    // --- Action Handlers ---

    const handleRequestNOA = (lead: Lead) => {
        updateLeadStatus(lead.id, 'Pending NOA');
        showToast(`✅ NOA Requested for ${lead.companyName}`, 'success');
    };

    const handleUploadNOA = (lead: Lead) => {
        setSelectedLead(lead);
        setSimpleUploadType('NOA');
        setIsSimpleUploadModalOpen(true);
    };

    const handleOpenPreview = (lead: Lead) => {
        setSelectedLead(lead);
        setIsDocumentModalOpen(true);
    };

    const handleDownloadTemplates = (lead: Lead) => {
        showToast(`⬇️ Templates downloaded for ${lead.companyName}`, 'success');
    };

    const handleOpenRecUpload = (lead: Lead) => {
        setSelectedLead(lead);
        setIsRecUploadModalOpen(true);
    };

    // Handler for "View & Download Pack"
    const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false);
    const handleOpenDownloadPack = (lead: Lead) => {
        setSelectedLead(lead);
        setIsDownloadModalOpen(true);
    };

    const handleUploadSignedDocs = (lead: Lead) => {
        setSelectedLead(lead);
        setSimpleUploadType('SIGNED_DOCS');
        setIsSimpleUploadModalOpen(true);
    };

    const handleSimpleUploadConfirm = () => {
        if (selectedLead) {
            // Simulate upload delay
            setTimeout(() => {
                if (simpleUploadType === 'NOA') {
                    updateLeadStatus(selectedLead.id, 'Preparing Docs');
                    showToast(`✅ NOA uploaded for ${selectedLead.companyName}. Ready for Doc Gen.`, 'success');
                } else {
                    // Signed Docs
                    updateLeadStatus(selectedLead.id, 'Pending CF Submission');
                    showToast(`✅ Signed Docs uploaded for ${selectedLead.companyName}`, 'success');
                }
                setIsSimpleUploadModalOpen(false);
            }, 500);
        }
    }

    const handleDetailClick = (lead: Lead) => {
        setDetailLead(lead);
    };

    const clearFilter = () => {
        router.push('/pipeline');
    };

    return (
        <div className="space-y-4 h-full flex flex-col">
            <div className="flex items-center justify-between flex-shrink-0 mb-2">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight text-white flex items-center">
                        <Kanban className="mr-3 h-6 w-6 text-indigo-500" />
                        Broker Pipeline
                    </h2>
                    <p className="text-slate-400 text-sm">Task Board. Viewing as: <span className="text-blue-400 font-semibold">{currentUser}</span></p>
                </div>
                {filter && (
                    <Button variant="outline" onClick={clearFilter} className="border-red-500/50 text-red-400 hover:bg-red-950/30 h-8 text-xs">
                        <X className="mr-2 h-3 w-3" />
                        Clear Filter: {filter}
                    </Button>
                )}
            </div>

            <div className="flex-1 overflow-x-auto pb-4">
                <div className={`flex gap-6 h-full ${filter ? 'max-w-md' : ''}`}>
                    {displayedColumns.map((col) => (
                        <div key={col.id} className="flex flex-col h-full bg-slate-900/30 rounded-xl border border-slate-800/50 min-w-[320px] shrink-0">
                            <div className="p-4 border-b border-slate-800/50 flex items-center justify-between">
                                <h3 className="font-semibold text-slate-200 flex items-center">
                                    <col.icon className={cn("mr-2 h-4 w-4", col.color)} />
                                    {col.title}
                                </h3>
                                <span className="bg-slate-800 text-slate-400 text-xs px-2 py-0.5 rounded-full">
                                    {col.leads.length}
                                </span>
                            </div>

                            <div className="p-4 space-y-3 overflow-y-auto flex-1">
                                {col.leads.length === 0 ? (
                                    <div className="text-center py-10 text-slate-600">
                                        <p className="text-sm">No leads in this stage</p>
                                    </div>
                                ) : (
                                    col.leads.map((lead) => (
                                        <KanbanCard
                                            key={lead.id}
                                            lead={lead}
                                            // Action Logic based on Columns - RESTORED FULL FLOW
                                            actions={
                                                col.id === 'Allocated' ? (
                                                    <Button size="sm" variant="secondary" className="w-full text-xs h-8" onClick={() => handleRequestNOA(lead)}>
                                                        <FileText className="mr-1.5 h-3 w-3" /> Request NOA
                                                    </Button>
                                                ) : col.id === 'Pending NOA' ? (
                                                    <div className="flex flex-col gap-2">
                                                        <Button size="sm" variant="primary" className="w-full text-xs h-8 bg-amber-600 hover:bg-amber-700 text-white" onClick={() => handleUploadNOA(lead)}>
                                                            <Upload className="mr-1.5 h-3 w-3" /> Upload NOA
                                                        </Button>
                                                        <Button size="sm" variant="ghost" className="w-full text-xs h-8 text-slate-400 hover:text-white" onClick={() => updateLeadStatus(lead.id, 'Preparing Docs')}>
                                                            Skip NOA Upload
                                                        </Button>
                                                    </div>
                                                ) : col.id === 'Preparing Docs' ? (
                                                    <div className="flex flex-col gap-2">
                                                        <Button size="sm" variant="secondary" className="w-full text-xs h-8" onClick={() => handleOpenPreview(lead)} title="Preview & Download">
                                                            <Download className="mr-1.5 h-3 w-3" /> Preview Templates
                                                        </Button>
                                                        <Button size="sm" variant="primary" className="w-full text-xs h-8 bg-indigo-600 hover:bg-indigo-700 text-white" onClick={() => handleOpenRecUpload(lead)}>
                                                            <Upload className="mr-1.5 h-3 w-3" /> Upload Final Docs
                                                        </Button>
                                                    </div>
                                                ) : col.id === 'Awaiting RMA Review' ? (
                                                    <div className="w-full text-center py-1 bg-cyan-900/20 border border-cyan-900/50 rounded text-cyan-400 text-xs font-medium">
                                                        Read Only: Awaiting RMA
                                                    </div>
                                                ) : col.id === 'Pending Client Signature' ? (
                                                    <Button size="sm" variant="primary" className="w-full text-xs h-8 bg-purple-600 hover:bg-purple-700 text-white" onClick={() => handleOpenDownloadPack(lead)}>
                                                        <Download className="mr-1.5 h-3 w-3" /> View & Download Pack
                                                    </Button>
                                                ) : col.id === 'Awaiting Signed Documents' ? (
                                                    <Button size="sm" variant="primary" className="w-full text-xs h-8 bg-amber-600 hover:bg-amber-700 text-white" onClick={() => handleUploadSignedDocs(lead)}>
                                                        <Upload className="mr-1.5 h-3 w-3" /> Upload Signed Docs
                                                    </Button>
                                                ) : col.id === 'Pending CF Submission' ? (
                                                    <div className="w-full text-center py-1 bg-teal-900/20 border border-teal-900/50 rounded text-teal-400 text-xs font-medium">
                                                        RMA Submitting to CF
                                                    </div>
                                                ) : col.id === 'CF Submitted' ? (
                                                    <div className="mt-3 pt-3 border-t border-slate-700/50 space-y-3">
                                                        <div className="alert alert-success bg-emerald-900/20 border border-emerald-900/50 text-emerald-400 text-xs p-2 rounded text-center font-bold">
                                                            SUBMITTED TO CF
                                                        </div>
                                                        <div className="space-y-1">
                                                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Group Risk Upsell</label>
                                                            <select
                                                                className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1.5 text-xs text-slate-300 focus:ring-1 focus:ring-blue-500 outline-none"
                                                                value={lead.groupRiskStatus || 'Not Started'}
                                                                onChange={(e) => updateGroupRiskStatus(lead.id, e.target.value as any)}
                                                            >
                                                                <option value="Not Started">Not Started</option>
                                                                <option value="Interested">Interested</option>
                                                                <option value="Quote Started">Quote Started</option>
                                                                <option value="Rejected">Rejected</option>
                                                                <option value="N/A">N/A</option>
                                                            </select>
                                                        </div>
                                                        <Button
                                                            size="sm"
                                                            className="w-full text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700"
                                                            onClick={() => updateLeadStatus(lead.id, 'Approved & Closed')}
                                                        >
                                                            Close Lead
                                                        </Button>
                                                    </div>
                                                ) : null
                                            }
                                            onDetailClick={() => setDetailLead(lead)}
                                            showUpsell={false}
                                        />
                                    ))
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Document Generation Modal */}
            {selectedLead && (
                <DocumentModal
                    isOpen={isDocumentModalOpen}
                    onClose={() => setIsDocumentModalOpen(false)}
                    lead={selectedLead}
                    onConfirm={() => {
                        handleDownloadTemplates(selectedLead);
                        setIsDocumentModalOpen(false);
                    }}
                />
            )}

            {/* Modals */}
            {isRecUploadModalOpen && selectedLead && (
                <RecommendationUploadModal
                    lead={selectedLead}
                    onClose={() => setIsRecUploadModalOpen(false)}
                />
            )}

            {/* Simple Upload Modal for NOA and Signed Docs */}
            {isSimpleUploadModalOpen && selectedLead && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
                    <div className="bg-slate-900 border border-slate-800 rounded-lg p-6 max-w-md w-full shadow-xl">
                        <h3 className="text-lg font-bold text-white mb-2">
                            {simpleUploadType === 'NOA' ? 'Upload NOA' : 'Upload Signed Application'}
                        </h3>
                        <p className="text-sm text-slate-400 mb-6">
                            Please upload the {simpleUploadType === 'NOA' ? 'Notice of Assessment' : 'Signed Application Pack'} for <strong>{selectedLead.companyName}</strong>.
                        </p>

                        <div className="border-2 border-dashed border-slate-700 rounded-lg p-8 text-center bg-slate-800/30 mb-6 cursor-pointer hover:bg-slate-800/50 transition-colors" onClick={handleSimpleUploadConfirm}>
                            <Upload className="mx-auto h-8 w-8 text-slate-500 mb-2" />
                            <p className="text-sm text-slate-300">Click to select files</p>
                            <p className="text-xs text-slate-500 mt-1">PDF, JPG, PNG up to 10MB</p>
                        </div>

                        <div className="flex justify-end gap-3">
                            <Button variant="ghost" onClick={() => setIsSimpleUploadModalOpen(false)}>Cancel</Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Lead Detail Modal */}
            {detailLead && (
                <LeadDetailModal
                    lead={detailLead}
                    onClose={() => setDetailLead(null)}
                />
            )}
            {/* Download Pack Modal */}
            {selectedLead && (
                <DownloadPackModal
                    lead={selectedLead}
                    isOpen={isDownloadModalOpen}
                    onClose={() => setIsDownloadModalOpen(false)}
                />
            )}
        </div>
    );
}

function KanbanCard({ lead, actions, onDetailClick, showUpsell }: { lead: Lead, actions: React.ReactNode, onDetailClick: () => void, showUpsell?: boolean }) {
    const { updateGroupRiskStatus } = useMockData();
    return (
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-4 shadow-sm hover:border-slate-700 transition-all group">
            <div className="flex justify-between items-start mb-2">
                <span className="text-xs font-medium text-slate-500">{lead.id}</span>
                <span className="text-xs text-blue-400 bg-blue-900/20 px-1.5 py-0.5 rounded">
                    {lead.currentClass}
                </span>
            </div>
            <button
                onClick={onDetailClick}
                className="font-semibold text-white mb-1 truncate hover:text-blue-400 text-left w-full transition-colors"
                title={lead.companyName}
            >
                {lead.companyName}
            </button>
            <p className="text-xs text-slate-400 mb-3 truncate">Owner: {lead.brokerOwner}</p>

            <div className="flex flex-wrap gap-1 mb-3">
                {lead.rmaData?.products.slice(0, 2).map((p, i) => (
                    <span key={i} className="text-[10px] bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded">
                        {p}
                    </span>
                ))}
            </div>

            {/* Action Area */}
            <div className="mt-3 pt-3 border-t border-slate-800">
                {actions}
            </div>

            {showUpsell && (
                <div className="mt-3 pt-3 border-t border-slate-800">
                    <label className="text-[10px] uppercase text-slate-500 font-bold mb-1 block">Group Risk Upsell</label>
                    <select
                        className="w-full bg-slate-950 border border-slate-700 text-xs text-slate-300 rounded px-2 py-1.5 focus:ring-1 focus:ring-blue-500 outline-none"
                        value={lead.groupRiskStatus || 'Not Started'}
                        onChange={(e) => updateGroupRiskStatus(lead.id, e.target.value as any)}
                    >
                        <option value="Not Started">Not Started</option>
                        <option value="Interested">Interested</option>
                        <option value="Quote Started">Quote Started</option>
                        <option value="Rejected">Rejected</option>
                        <option value="N/A">N/A</option>
                    </select>
                </div>
            )}
        </div>
    );
}
