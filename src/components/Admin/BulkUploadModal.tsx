"use client";

import { useState } from "react";
import { useMockData, Lead } from "@/context/MockDataContext";
import { X, Upload, FileText, CheckCircle, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface BulkUploadModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function BulkUploadModal({ isOpen, onClose }: BulkUploadModalProps) {
    const { addBulkLeads } = useMockData();
    const [file, setFile] = useState<File | null>(null);
    const [parsedLeads, setParsedLeads] = useState<Partial<Lead>[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);

    if (!isOpen) return null;

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        setError(null);
        setParsedLeads([]);

        if (selectedFile) {
            if (!selectedFile.name.endsWith('.csv')) {
                setError("Please upload a valid CSV file.");
                return;
            }
            setFile(selectedFile);
            parseCSV(selectedFile);
        }
    };

    const parseCSV = (file: File) => {
        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const text = event.target?.result as string;
                if (!text) {
                    setError("File is empty.");
                    return;
                }

                const lines = text.split(/\r?\n/); // Handle both \n and \r\n
                const leads: Partial<Lead>[] = [];

                // Expecting header: EMPLOYER NAME,FUND NAME,Current Class,Proposed Class,Est. Annual Saving (R)

                lines.forEach((line, index) => {
                    if (index === 0) return; // Skip Header
                    if (!line.trim()) return; // Skip empty lines

                    // Simple CSV split (note: this doesn't handle commas inside quotes, but fits the MVP/strict req)
                    const cols = line.split(',');

                    if (cols.length >= 5) {
                        const companyName = cols[0]?.trim();
                        const industry = cols[1]?.trim();
                        const currentClass = cols[2]?.trim();
                        const targetClass = cols[3]?.trim();
                        // Clean currency string to number
                        const savingStr = cols[4]?.trim().replace(/[^0-9.-]+/g, "");
                        const potentialSaving = parseFloat(savingStr) || 0;

                        if (companyName) {
                            leads.push({
                                companyName,
                                industry,
                                currentClass: currentClass || 'Unknown',
                                targetClass: targetClass || 'Unknown',
                                potentialSaving,
                                heuristicData: {
                                    originalCurrentClass: currentClass,
                                    originalProposedClass: targetClass
                                }
                            });
                        }
                    }
                });

                if (leads.length === 0) {
                    setError("No valid leads found in CSV. Check format.");
                } else {
                    setParsedLeads(leads);
                }

            } catch (err) {
                console.error("CSV Parse Error", err);
                setError("Failed to parse CSV file.");
            }
        };
        reader.onerror = () => {
            setError("Error reading file.");
        };
        reader.readAsText(file);
    };

    const handleImport = () => {
        if (parsedLeads.length === 0) return;

        setIsProcessing(true);
        // Simulate a small delay for UX
        setTimeout(() => {
            addBulkLeads(parsedLeads);
            setIsProcessing(false);
            onClose();
        }, 800);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-slate-900 border border-slate-800 rounded-xl w-full max-w-2xl shadow-2xl flex flex-col max-h-[90vh]">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-slate-800">
                    <div>
                        <h2 className="text-xl font-bold text-white flex items-center gap-2">
                            <Upload className="h-5 w-5 text-indigo-500" />
                            Bulk Import Catalyst Leads
                        </h2>
                        <p className="text-sm text-slate-400 mt-1">
                            Upload a CSV file to ingest multiple leads at once.
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-slate-500 hover:text-white transition-colors"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 flex-1 overflow-y-auto">
                    {/* File Drop Area */}
                    <div className="border-2 border-dashed border-slate-700 rounded-xl bg-slate-900/50 hover:bg-slate-800/50 transition-colors p-8 text-center relative mb-6">
                        <input
                            type="file"
                            accept=".csv"
                            onChange={handleFileChange}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                        />
                        <div className="flex flex-col items-center justify-center pointer-events-none">
                            <div className="bg-indigo-500/10 p-4 rounded-full mb-4">
                                <FileText className="h-8 w-8 text-indigo-400" />
                            </div>
                            <h3 className="text-lg font-medium text-white mb-1">
                                {file ? file.name : "Drop CSV file here or click to upload"}
                            </h3>
                            <p className="text-sm text-slate-500">
                                Required columns: EMPLOYER NAME, FUND NAME, Current Class, Proposed Class, Est. Annual Saving (R)
                            </p>
                        </div>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="bg-red-900/20 border border-red-900/50 text-red-200 p-4 rounded-lg flex items-center gap-3 mb-6">
                            <AlertCircle className="h-5 w-5 text-red-400 flex-shrink-0" />
                            <p className="text-sm">{error}</p>
                        </div>
                    )}

                    {/* Preview Table */}
                    {parsedLeads.length > 0 && !error && (
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <h3 className="text-sm font-semibold text-slate-300">
                                    Preview ({parsedLeads.length} leads found)
                                </h3>
                                <span className="text-xs text-emerald-400 flex items-center gap-1">
                                    <CheckCircle className="h-3 w-3" /> Ready to Import
                                </span>
                            </div>

                            <div className="border border-slate-800 rounded-lg overflow-hidden">
                                <div className="overflow-x-auto max-h-[240px]">
                                    <table className="w-full text-left text-sm text-slate-400">
                                        <thead className="bg-slate-950 text-slate-200 sticky top-0 z-10">
                                            <tr>
                                                <th className="p-3 font-medium">Company</th>
                                                <th className="p-3 font-medium">Industry</th>
                                                <th className="p-3 font-medium">Current</th>
                                                <th className="p-3 font-medium">Proposed</th>
                                                <th className="p-3 font-medium text-right">Saving</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-800">
                                            {parsedLeads.slice(0, 50).map((lead, idx) => (
                                                <tr key={idx} className="hover:bg-slate-800/30">
                                                    <td className="p-3 text-white font-medium">{lead.companyName}</td>
                                                    <td className="p-3">{lead.industry}</td>
                                                    <td className="p-3 text-xs bg-slate-800/50 rounded px-2">{lead.currentClass}</td>
                                                    <td className="p-3 text-xs bg-indigo-900/20 text-indigo-300 rounded px-2">{lead.targetClass}</td>
                                                    <td className="p-3 text-right text-emerald-400 font-mono">
                                                        R {lead.potentialSaving?.toLocaleString()}
                                                    </td>
                                                </tr>
                                            ))}
                                            {parsedLeads.length > 50 && (
                                                <tr>
                                                    <td colSpan={5} className="p-3 text-center text-xs text-slate-500 italic">
                                                        ...and {parsedLeads.length - 50} more
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-slate-800 flex justify-end gap-3 bg-slate-900/50">
                    <Button variant="ghost" onClick={onClose} disabled={isProcessing}>
                        Cancel
                    </Button>
                    <Button
                        onClick={handleImport}
                        disabled={parsedLeads.length === 0 || !!error || isProcessing}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white min-w-[120px]"
                    >
                        {isProcessing ? 'Importing...' : `Import ${parsedLeads.length} Leads`}
                    </Button>
                </div>
            </div>
        </div>
    );
}
