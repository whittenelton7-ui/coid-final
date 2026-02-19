"use client";

import { Lead } from "@/context/MockDataContext";
import { DocumentPack, generateDocumentPack } from "@/utils/documentEngine";
import { useState, useEffect } from "react";
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/Dialog"; // Removed: Using custom overlay
import { Button } from "@/components/ui/Button";
import { FileText, AlertTriangle, Check, Download, X } from "lucide-react";
import { cn } from "@/lib/utils";

// Since we don't have a Dialog component in the codebase yet (based on file list), 
// I will build a custom Modal overlay here to match the requested design without relying on unverified generic components.

interface DocumentModalProps {
    isOpen: boolean;
    onClose: () => void;
    lead: Lead;
    onConfirm: () => void;
}

export function DocumentModal({ isOpen, onClose, lead, onConfirm }: DocumentModalProps) {
    const [pack, setPack] = useState<DocumentPack | null>(null);
    const [activeTab, setActiveTab] = useState<'CF-1B' | 'CF-2A' | 'RMA-REG'>('CF-1B');

    useEffect(() => {
        if (isOpen && lead) {
            const fullPack = generateDocumentPack(lead);
            // Show all docs (Heuristic Preview)
            setPack(fullPack);

            // Set initial active tab
            setActiveTab('CF-1B');
        }
    }, [isOpen, lead]);

    if (!isOpen || !pack) return null;

    const activeDoc = pack.documents.find(d => d.type === activeTab);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-xl shadow-2xl flex flex-col max-h-[90vh]">

                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-slate-800">
                    <div>
                        <h2 className="text-xl font-bold text-white flex items-center">
                            <FileText className="mr-2 h-5 w-5 text-blue-400" />
                            Preview Document Templates
                        </h2>
                        <p className="text-sm text-slate-400 mt-1">Review heuristic data for <strong>{lead.companyName}</strong> before downloading.</p>
                    </div>
                    <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors">
                        <X className="h-6 w-6" />
                    </button>
                </div>

                {/* Body */}
                <div className="flex flex-1 overflow-hidden">
                    {/* Sidebar / Tabs */}
                    <div className="w-64 bg-slate-950/50 border-r border-slate-800 p-4 space-y-2">
                        {pack.documents.map(doc => (
                            <button
                                key={doc.id}
                                onClick={() => setActiveTab(doc.type as any)}
                                className={cn(
                                    "w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-all flex items-center justify-between group",
                                    activeTab === doc.type
                                        ? "bg-blue-600/10 text-blue-400 border border-blue-500/30"
                                        : "text-slate-400 hover:bg-slate-800 hover:text-white"
                                )}
                            >
                                <span>{doc.title}</span>
                                {doc.status === 'Review Required' && (
                                    <AlertTriangle className="h-4 w-4 text-amber-500" />
                                )}
                            </button>
                        ))}
                    </div>

                    {/* Preview Area */}
                    <div className="flex-1 p-8 overflow-y-auto bg-slate-950">
                        {activeDoc && (
                            <div className="max-w-2xl mx-auto bg-white text-slate-900 p-8 rounded-sm shadow-sm min-h-[500px] font-serif text-sm leading-relaxed whitespace-pre-wrap">
                                {activeDoc.content}
                            </div>
                        )}
                        {activeDoc?.flags.length ? (
                            <div className="max-w-2xl mx-auto mt-4 p-4 bg-amber-900/20 border border-amber-500/30 rounded-lg flex items-start">
                                <AlertTriangle className="h-5 w-5 text-amber-500 mr-3 mt-0.5 flex-shrink-0" />
                                <div>
                                    <h4 className="text-amber-400 font-medium text-sm">Attention Required</h4>
                                    <ul className="list-disc list-inside text-xs text-amber-200/80 mt-1">
                                        {activeDoc.flags.map((flag, i) => <li key={i}>{flag}</li>)}
                                    </ul>
                                </div>
                            </div>
                        ) : null}
                    </div>
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-slate-800 bg-slate-900 flex justify-end gap-3">
                    <Button variant="ghost" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button
                        onClick={() => {
                            // Just close logic, maybe trigger a toast in parent, but here we just call onConfirm which in parent will act as close/download
                            onConfirm();
                        }}
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                        <Download className="mr-2 h-4 w-4" />
                        Download Templates
                    </Button>
                </div>
            </div>
        </div>
    );
}
