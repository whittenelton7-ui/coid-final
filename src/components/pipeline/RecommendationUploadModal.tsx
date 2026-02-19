"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Lead, useMockData } from "@/context/MockDataContext";
import { Upload, FileText, CheckCircle, X } from "lucide-react";
import { useToast } from "@/context/ToastContext";

interface RecommendationUploadModalProps {
    lead: Lead;
    onClose: () => void;
}

export function RecommendationUploadModal({ lead, onClose }: RecommendationUploadModalProps) {
    const { updateLeadRecommendation, updateLeadStatus } = useMockData();
    const { showToast } = useToast();
    // Explicitly type to NonNullable to satisfy context requirement
    const [recommendationType, setRecommendationType] = useState<NonNullable<Lead['recommendationType']>>('Reclassification');
    const [isUploading, setIsUploading] = useState(false);

    const handleUpload = () => {
        setIsUploading(true);
        // Simulate upload delay
        setTimeout(() => {
            updateLeadRecommendation(lead.id, recommendationType);
            updateLeadStatus(lead.id, 'Awaiting RMA Review');
            showToast(`✅ Recommendation Pack uploaded for ${lead.companyName}`, 'success');
            setIsUploading(false);
            onClose();
        }, 800);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="bg-slate-900 border border-slate-800 rounded-lg p-6 max-w-md w-full shadow-xl animate-in fade-in zoom-in duration-200">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <h3 className="text-lg font-bold text-white">Upload Recommendation</h3>
                        <p className="text-sm text-slate-400">For {lead.companyName}</p>
                    </div>
                    <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors">
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <div className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-300">Recommendation Type</label>
                        <select
                            className="w-full bg-slate-950 border border-slate-700 rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                            value={recommendationType}
                            onChange={(e) => setRecommendationType(e.target.value as any)}
                        >
                            <option value="Reclassification">Reclassification</option>
                            <option value="Transfer">Transfer</option>
                            <option value="Consolidation">Consolidation</option>
                        </select>
                        <p className="text-xs text-slate-500">
                            Select the type of recommendation you are submitting to RMA.
                        </p>
                    </div>

                    <div className="border-2 border-dashed border-slate-700 rounded-lg p-8 text-center bg-slate-800/30 cursor-pointer hover:bg-slate-800/50 transition-colors group">
                        <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                            <Upload className="h-6 w-6 text-blue-400" />
                        </div>
                        <p className="text-sm text-slate-300 font-medium">Click to upload documents</p>
                        <p className="text-xs text-slate-500 mt-1">CF-1B, CF-2A, and RMA Regulation forms</p>
                    </div>

                    <div className="flex justify-end gap-3 pt-2">
                        <Button variant="ghost" onClick={onClose} disabled={isUploading}>
                            Cancel
                        </Button>
                        <Button
                            className="bg-blue-600 hover:bg-blue-700 text-white min-w-[140px]"
                            onClick={handleUpload}
                            disabled={isUploading}
                        >
                            {isUploading ? (
                                <>Processing...</>
                            ) : (
                                <>
                                    <Upload className="mr-2 h-4 w-4" />
                                    Upload & Send
                                </>
                            )}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
