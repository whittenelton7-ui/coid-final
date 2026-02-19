"use client";

import { useState, useEffect } from "react";
import { X, Save, Building, Phone, Mail, User } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Lead, useMockData } from "@/context/MockDataContext";

interface LeadDetailModalProps {
    lead: Lead;
    onClose: () => void;
}

export function LeadDetailModal({ lead, onClose }: LeadDetailModalProps) {
    const { updateContactDetails } = useMockData();
    const [name, setName] = useState(lead.rmaData?.contactName || '');
    const [phone, setPhone] = useState(lead.rmaData?.contactPhone || '');
    const [email, setEmail] = useState(lead.rmaData?.contactEmail || '');
    const [isSaving, setIsSaving] = useState(false);

    // Update local state if lead prop changes
    useEffect(() => {
        if (lead.rmaData) {
            setName(lead.rmaData.contactName || '');
            setPhone(lead.rmaData.contactPhone || '');
            setEmail(lead.rmaData.contactEmail || '');
        }
    }, [lead]);

    const handleSave = () => {
        setIsSaving(true);
        // Simulate network delay
        setTimeout(() => {
            updateContactDetails(lead.id, name, phone, email);
            setIsSaving(false);
            onClose();
        }, 500);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="bg-slate-900 border border-slate-800 rounded-lg shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">

                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-slate-800 bg-slate-900/50">
                    <div>
                        <h2 className="text-xl font-bold text-white flex items-center">
                            <Building className="mr-2 h-5 w-5 text-blue-400" />
                            {lead.companyName}
                        </h2>
                        <p className="text-sm text-slate-400">Lead Details & Contact Management</p>
                    </div>
                    <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
                        <X className="h-6 w-6" />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 space-y-8 overflow-y-auto">

                    {/* Read-Only Employer Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-slate-950/50 rounded-lg border border-slate-800/50">
                        <div>
                            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Current Class</label>
                            <p className="text-white font-medium mt-1">{lead.currentClass}</p>
                        </div>
                        <div>
                            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Target Class</label>
                            <p className="text-blue-400 font-medium mt-1">{lead.targetClass}</p>
                        </div>
                        <div>
                            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Wage Bill</label>
                            <p className="text-white font-medium mt-1">R {lead.wageBill.toLocaleString()}</p>
                        </div>
                        <div>
                            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">RMA Products</label>
                            <div className="flex flex-wrap gap-1 mt-1">
                                {lead.rmaData?.products.map((p, i) => (
                                    <span key={i} className="text-xs bg-slate-800 text-slate-300 px-2 py-0.5 rounded-full">
                                        {p}
                                    </span>
                                )) || <span className="text-slate-500 italic">None</span>}
                            </div>
                        </div>
                    </div>

                    {/* Editable Contact Info */}
                    <div className="space-y-4">
                        <h3 className="text-md font-semibold text-white flex items-center border-b border-slate-800 pb-2">
                            <User className="mr-2 h-4 w-4 text-emerald-400" />
                            Contact Information
                        </h3>

                        <div className="grid grid-cols-1 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-300">Contact Name</label>
                                <div className="relative">
                                    <User className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="w-full bg-slate-950 border border-slate-700 rounded-md py-2 pl-9 pr-4 text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                                        placeholder="Enter contact name"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-300">Phone Number</label>
                                    <div className="relative">
                                        <Phone className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                                        <input
                                            type="text"
                                            value={phone}
                                            onChange={(e) => setPhone(e.target.value)}
                                            className="w-full bg-slate-950 border border-slate-700 rounded-md py-2 pl-9 pr-4 text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                                            placeholder="Enter phone number"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-300">Email Address</label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="w-full bg-slate-950 border border-slate-700 rounded-md py-2 pl-9 pr-4 text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                                            placeholder="Enter email address"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>

                {/* Footer */}
                <div className="p-6 border-t border-slate-800 bg-slate-900/50 flex justify-end gap-3">
                    <Button variant="ghost" onClick={onClose} disabled={isSaving}>Cancel</Button>
                    <Button variant="primary" onClick={handleSave} disabled={isSaving} className="bg-blue-600 hover:bg-blue-700 text-white min-w-[120px]">
                        {isSaving ? 'Saving...' : (
                            <>
                                <Save className="mr-2 h-4 w-4" />
                                Save & Close
                            </>
                        )}
                    </Button>
                </div>

            </div>
        </div>
    );
}
