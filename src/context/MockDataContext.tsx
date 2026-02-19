"use client";

import React, { createContext, useContext, ReactNode, useState } from 'react';
import { useToast } from './ToastContext';

// Types
export type LeadStatus = 'New' | 'Sent to RMA' | 'RMA Verified' | 'Allocated' | 'Pending NOA' | 'Preparing Docs' | 'Awaiting RMA Review' | 'Pending Client Signature' | 'Awaiting Signed Documents' | 'Pending CF Submission' | 'CF Submitted' | 'Approved & Closed' | 'Archived';

export type GroupRiskStatus = 'Not Started' | 'Interested' | 'Quote Started' | 'Rejected' | 'N/A';

export interface RMAData {
    isExistingClient: 'Yes' | 'No' | 'Pending';
    products: string[]; // 'Funeral Cover', 'Augmentation +', etc.
    activeTransfer: boolean;
    alreadyAllocatedToRMA?: 'Yes' | 'No';
    rmaIncumbentName?: string;
    contactName: string;
    contactPhone: string;
    contactEmail: string;
}

export interface Lead {
    id: string;
    companyName: string;
    currentClass: string;
    targetClass: string;
    wageBill: number;
    status: LeadStatus;
    brokerOwner: string;
    rmaData?: RMAData;
    groupRiskStatus?: GroupRiskStatus;
    recommendationType?: 'Reclassification' | 'Transfer' | 'Consolidation' | null;
    // New fields for Bulk Upload
    industry?: string;
    potentialSaving?: number;
    heuristicData?: any; // For flexible data storage from CSV
}

export interface BrokerStats {
    totalLeads: number;
    activePipeline: number;
    converted: number;
    conversionRate: number;
}

export interface PipelineStage {
    id: string;
    label: string;
    count: number;
    value: number; // In ZAR
    color: string;
}

export interface Activity {
    id: string;
    type: 'upload' | 'verification' | 'allocation' | 'compliance' | 'update';
    description: string;
    timestamp: string;
    status: 'completed' | 'pending' | 'failed';
}

interface DashboardData {
    stats: BrokerStats;
    pipeline: PipelineStage[];
    recentActivity: Activity[];
    leads: Lead[];
    currentUser: string;
    setCurrentUser: (user: string) => void;
    addLead: (lead: Lead) => void;
    updateLeadStatus: (id: string, status: LeadStatus) => void;
    updateLeadRMAData: (id: string, rmaData: RMAData) => void;
    assignBroker: (id: string, brokerName: string) => void;
    updateContactDetails: (id: string, contactName: string, contactPhone: string, contactEmail: string) => void;
    updateGroupRiskStatus: (id: string, status: GroupRiskStatus) => void;
    updateLeadRecommendation: (id: string, type: NonNullable<Lead['recommendationType']>) => void;
    addBulkLeads: (newLeads: Partial<Lead>[]) => void;
}

const MOCK_LEADS: Lead[] = [
    {
        id: 'L001',
        companyName: 'Apex Mining Solutions',
        currentClass: 'Class V',
        targetClass: 'Class XIII',
        wageBill: 45000000,
        status: 'New',
        brokerOwner: 'Unallocated',
        groupRiskStatus: 'Not Started',
    },
    {
        id: 'L002',
        companyName: 'Blue Sky Logistics',
        currentClass: 'Class VIII',
        targetClass: 'Other',
        wageBill: 12500000,
        status: 'Sent to RMA',
        brokerOwner: 'Unallocated',
        groupRiskStatus: 'Not Started',
    },
    {
        id: 'L003',
        companyName: 'ConstructCo Ltd',
        currentClass: 'Class IV',
        targetClass: 'Class XIII',
        wageBill: 85000000,
        status: 'RMA Verified',
        brokerOwner: 'Elton Whitten',
        rmaData: {
            isExistingClient: 'Yes',
            products: ['Funeral Cover', 'Group Risk'],
            activeTransfer: false,
            contactName: 'Sarah Jenkins',
            contactPhone: '082 555 1234',
            contactEmail: 'sarah.j@constructco.sa',
        },
        groupRiskStatus: 'Not Started',
    }
];


const DEFAULT_DATA: DashboardData = {
    stats: {
        totalLeads: 1250,
        activePipeline: 450,
        converted: 320,
        conversionRate: 25.6,
    },
    pipeline: [
        { id: '1', label: 'Lead Uploaded', count: 1250, value: 0, color: 'text-slate-400' },
        { id: '2', label: 'RMA Verified', count: 980, value: 0, color: 'text-blue-400' },
        { id: '3', label: 'Enriched', count: 850, value: 45000000, color: 'text-indigo-400' },
        { id: '4', label: 'Allocated', count: 600, value: 32000000, color: 'text-amber-400' },
        { id: '5', label: 'Converted', count: 320, value: 18000000, color: 'text-emerald-400' },
    ],
    recentActivity: [
        { id: 'a1', type: 'compliance', description: 'Generated CF-2A for Mining Corp', timestamp: '10 mins ago', status: 'completed' },
        { id: 'a2', type: 'allocation', description: 'Allocated 50 leads to Sub-Broker A', timestamp: '1 hour ago', status: 'completed' },
        { id: 'a3', type: 'verification', description: 'RMA Data Enrichment Batch #204', timestamp: '3 hours ago', status: 'pending' },
        { id: 'a4', type: 'upload', description: 'Lead List Upload: Manufacturing Sector', timestamp: '5 hours ago', status: 'completed' },
    ],
    leads: [],
    currentUser: 'Lead Broker',
    setCurrentUser: () => { },
    addLead: () => { },
    updateLeadStatus: () => { },
    updateLeadRMAData: () => { },
    assignBroker: () => { },
    updateContactDetails: () => { },
    updateGroupRiskStatus: () => { },
    updateLeadRecommendation: () => { },
    addBulkLeads: () => { },
}

const MockDataContext = createContext<DashboardData>(DEFAULT_DATA);

export const MockDataProvider = ({ children }: { children: ReactNode }) => {
    const [leads, setLeads] = useState<Lead[]>(MOCK_LEADS);
    const [stats, setStats] = useState<BrokerStats>(DEFAULT_DATA.stats);
    const [recentActivity, setRecentActivity] = useState<Activity[]>(DEFAULT_DATA.recentActivity);
    const [currentUser, setCurrentUser] = useState<string>('Lead Broker (Admin)');
    const { showToast } = useToast();

    const addActivity = (type: Activity['type'], description: string) => {
        setRecentActivity(prev => [{
            id: Math.random().toString(36).substr(2, 9),
            type,
            description,
            timestamp: 'Just now',
            status: 'completed'
        }, ...prev.slice(0, 4)]);
    };

    const addLead = (lead: Lead) => {
        setLeads(prev => [lead, ...prev]);
        setStats(prev => ({ ...prev, totalLeads: prev.totalLeads + 1, activePipeline: prev.activePipeline + 1 }));
        addActivity('upload', `Uploaded new lead: ${lead.companyName}`);
    };

    const addBulkLeads = (newLeads: Partial<Lead>[]) => {
        const fullLeads: Lead[] = newLeads.map((l, index) => ({
            id: `L-BULK-${Date.now()}-${index}`,
            companyName: l.companyName || 'Unknown Company',
            currentClass: l.currentClass || 'Unknown',
            targetClass: l.targetClass || 'Unknown',
            wageBill: l.wageBill || 0,
            status: 'New',
            brokerOwner: 'Unallocated',
            ...l, // Override defaults with any provided partial data
        } as Lead));

        setLeads(prev => [...fullLeads, ...prev]);
        setStats(prev => ({ ...prev, totalLeads: prev.totalLeads + fullLeads.length }));
        addActivity('upload', `Bulk user import: ${fullLeads.length} leads added.`);
        showToast(`✅ Successfully imported ${fullLeads.length} leads`, 'success');
    };

    const updateLeadStatus = (id: string, status: LeadStatus) => {
        setLeads(prev => prev.map(l => l.id === id ? { ...l, status } : l));
        addActivity('update', `Updated status for lead ${id} to ${status}`);
    };

    const updateLeadRMAData = (id: string, rmaData: RMAData) => {
        setLeads(prev => prev.map(l => l.id === id ? { ...l, rmaData, status: 'RMA Verified' } : l));
        addActivity('verification', `Enriched RMA data for lead ${id}`);
    };

    const assignBroker = (id: string, brokerName: string) => {
        setLeads(prev => prev.map(l => l.id === id ? { ...l, brokerOwner: brokerName, status: 'Allocated' } : l));
        addActivity('allocation', `Allocated lead ${id} to ${brokerName}`);
    };

    const updateContactDetails = (id: string, contactName: string, contactPhone: string, contactEmail: string) => {
        setLeads(prev => prev.map(l => {
            if (l.id === id) {
                const currentRMA = l.rmaData || {
                    isExistingClient: 'Pending',
                    products: [],
                    activeTransfer: false,
                    contactName: '',
                    contactPhone: '',
                    contactEmail: ''
                };
                return {
                    ...l,
                    rmaData: {
                        ...currentRMA,
                        contactName,
                        contactPhone,
                        contactEmail
                    }
                };
            }
            return l;
        }));
        showToast(`✅ Contact details updated for lead ${id}`, 'success');
        addActivity('update', `Updated contact info for lead ${id}`);
    };

    const updateGroupRiskStatus = (id: string, status: GroupRiskStatus) => {
        setLeads(prev => prev.map(l => l.id === id ? { ...l, groupRiskStatus: status } : l));
        addActivity('update', `Updated Group Risk status for lead ${id} to ${status}`);
    };

    const updateLeadRecommendation = (id: string, type: NonNullable<Lead['recommendationType']>) => {
        setLeads(prev => prev.map(l => l.id === id ? { ...l, recommendationType: type } : l));
        addActivity('update', `Updated Recommendation Type for lead ${id} to ${type}`);
    };

    return (
        <MockDataContext.Provider value={{
            stats,
            pipeline: DEFAULT_DATA.pipeline,
            recentActivity,
            leads,
            currentUser,
            setCurrentUser,
            addLead,
            updateLeadStatus,
            updateLeadRMAData,
            assignBroker,
            updateContactDetails,
            updateGroupRiskStatus,
            updateLeadRecommendation,
            addBulkLeads
        }}>
            {children}
        </MockDataContext.Provider>
    );
};

export const useMockData = () => useContext(MockDataContext);
