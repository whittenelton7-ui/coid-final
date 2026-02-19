"use client";

import { Button } from "@/components/ui/Button";
import { Download, FileText, CheckCircle, X } from "lucide-react";
import { Lead } from "@/context/MockDataContext";
import { useMockData } from "@/context/MockDataContext";
import { useState } from "react";

interface DownloadPackModalProps {
    lead: Lead | null;
    isOpen: boolean;
    onClose: () => void;
}

export function DownloadPackModal({ lead, isOpen, onClose }: DownloadPackModalProps) {
    const { updateLeadStatus } = useMockData();
    const [isDownloading, setIsDownloading] = useState(false);

    if (!lead || !isOpen) return null;

    const handleDownload = () => {
        setIsDownloading(true);
        // Simulate download delay
        setTimeout(() => {
            updateLeadStatus(lead.id, 'Awaiting Signed Documents');
            setIsDownloading(false);
            onClose();
        }, 1500);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="w-full max-w-[500px] bg-slate-900 border border-slate-700 rounded-lg shadow-2xl flex flex-col">

                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-slate-800">
                    <div className="flex items-center space-x-3">
                        <div className="bg-indigo-500/20 p-2 rounded-lg">
                            <Download className="h-6 w-6 text-indigo-400" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-white">Download Approved Pack</h2>
                            <p className="text-sm text-slate-400 mt-1">Ready for client signature.</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors">
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 space-y-4">
                    <div className="bg-slate-950/50 rounded-lg p-4 border border-slate-800 space-y-3">
                        <div className="flex items-center justify-between group">
                            <div className="flex items-center space-x-3">
                                <FileText className="h-5 w-5 text-emerald-500" />
                                <span className="text-sm font-medium text-slate-200">CF-1B (Compensation Fund)</span>
                            </div>
                            <CheckCircle className="h-5 w-5 text-emerald-500" />
                        </div>
                        <div className="flex items-center justify-between group">
                            <div className="flex items-center space-x-3">
                                <FileText className="h-5 w-5 text-emerald-500" />
                                <span className="text-sm font-medium text-slate-200">CF-2A (Return of Earnings)</span>
                            </div>
                            <CheckCircle className="h-5 w-5 text-emerald-500" />
                        </div>
                        <div className="flex items-center justify-between group">
                            <div className="flex items-center space-x-3">
                                <FileText className="h-5 w-5 text-emerald-500" />
                                <span className="text-sm font-medium text-slate-200">RMA Registration Form</span>
                            </div>
                            <CheckCircle className="h-5 w-5 text-emerald-500" />
                        </div>
                    </div>

                    <div className="bg-amber-900/20 border border-amber-900/30 rounded p-3 text-xs text-amber-200/80">
                        <strong>Note:</strong> All documents must be signed by the client before submission to the Compensation Fund.
                    </div>
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-slate-800 flex justify-between">
                    <Button
                        type="button"
                        variant="ghost"
                        onClick={onClose}
                        className="text-slate-400 hover:text-white hover:bg-slate-800"
                    >
                        Cancel
                    </Button>
                    <Button
                        type="button"
                        variant="primary"
                        onClick={handleDownload}
                        disabled={isDownloading}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white min-w-[200px]"
                    >
                        {isDownloading ? (
                            <span className="flex items-center">
                                <Download className="mr-2 h-4 w-4 animate-bounce" /> Downloading...
                            </span>
                        ) : (
                            <span className="flex items-center">
                                <Download className="mr-2 h-4 w-4" /> Download Pack & Await Signatures
                            </span>
                        )}
                    </Button>
                </div>
            </div>
        </div>
    );
}
