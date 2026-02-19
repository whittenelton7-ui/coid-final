"use client";

import { X, FileText, Download, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Lead } from "@/context/MockDataContext";

interface NoaViewerModalProps {
    lead: Lead;
    onClose: () => void;
}

export function NoaViewerModal({ lead, onClose }: NoaViewerModalProps) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4">
            <div className="w-full max-w-4xl h-[80vh] bg-slate-900 border border-slate-700 rounded-lg shadow-2xl flex flex-col animate-in fade-in zoom-in duration-200">

                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-slate-800 bg-slate-950/50 rounded-t-lg">
                    <div className="flex items-center space-x-3">
                        <div className="bg-amber-500/10 p-2 rounded-lg border border-amber-500/20">
                            <FileText className="h-5 w-5 text-amber-500" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-white">Notice of Assessment (NOA) Viewer</h2>
                            <p className="text-xs text-slate-400">Document Source: <span className="text-slate-200">{lead.companyName}</span></p>
                        </div>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white" title="Download Original">
                            <Download className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white" title="Open in New Tab">
                            <ExternalLink className="h-4 w-4" />
                        </Button>
                        <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors ml-2 p-1 hover:bg-slate-800 rounded">
                            <X className="h-5 w-5" />
                        </button>
                    </div>
                </div>

                {/* Simulated PDF Viewer Body */}
                <div className="flex-1 bg-slate-950 p-8 overflow-y-auto flex items-center justify-center relative">
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-900/50 via-slate-950 to-slate-950 pointer-events-none" />

                    <div className="w-full max-w-2xl aspect-[1/1.414] bg-white text-black shadow-2xl relative flex flex-col">
                        {/* Mock PDF Header */}
                        <div className="h-24 border-b border-gray-200 p-8 flex justify-between items-start">
                            <div className="space-y-2">
                                <div className="h-4 w-32 bg-gray-800" />
                                <div className="h-2 w-48 bg-gray-300" />
                            </div>
                            <div className="h-12 w-12 bg-gray-200 rounded-full" />
                        </div>

                        {/* Mock PDF Content */}
                        <div className="p-12 space-y-6 flex-1">
                            <div className="space-y-2">
                                <div className="h-4 w-3/4 bg-gray-200" />
                                <div className="h-4 w-full bg-gray-200" />
                                <div className="h-4 w-5/6 bg-gray-200" />
                            </div>

                            <div className="h-32 bg-gray-100 rounded border border-gray-200 flex items-center justify-center">
                                <span className="text-gray-400 text-sm font-mono">Assessment Data Table</span>
                            </div>

                            <div className="space-y-2">
                                <div className="h-4 w-full bg-gray-200" />
                                <div className="h-4 w-full bg-gray-200" />
                                <div className="h-4 w-2/3 bg-gray-200" />
                            </div>
                        </div>

                        {/* Mock PDF Footer */}
                        <div className="h-16 border-t border-gray-200 p-8 flex items-center justify-between">
                            <div className="h-2 w-24 bg-gray-300" />
                            <div className="h-2 w-8 bg-gray-300" />
                        </div>

                        {/* Overlay Text */}
                        <div className="absolute inset-0 flex items-center justify-center bg-black/5 backdrop-blur-[1px]">
                            <div className="bg-slate-900/90 text-white px-6 py-4 rounded-xl border border-slate-700 shadow-2xl backdrop-blur-md text-center">
                                <p className="font-bold text-lg mb-1">Simulated Preview</p>
                                <p className="text-sm text-slate-400">Notice of Assessment for {lead.companyName}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-slate-800 bg-slate-900 flex justify-end">
                    <Button
                        onClick={onClose}
                        className="bg-slate-800 hover:bg-slate-700 text-white border border-slate-700"
                    >
                        Close Viewer
                    </Button>
                </div>
            </div>
        </div>
    );
}
