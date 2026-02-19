import { Lead } from "@/context/MockDataContext";

export interface DocumentPack {
    leadId: string;
    generatedAt: string;
    documents: {
        id: string;
        type: 'LOA' | 'CF-1B' | 'CF-2A' | 'RMA-REG';
        title: string;
        content: string; // HTML or Markdown content simulating the doc
        status: 'Ready' | 'Review Required';
        flags: string[];
    }[];
}

export const generateDocumentPack = (lead: Lead): DocumentPack => {
    const timestamp = new Date().toLocaleString();
    const isClassUnknown = lead.targetClass === 'To Determine' || lead.targetClass === 'Class Unknown';
    const flags: string[] = [];

    if (isClassUnknown) {
        flags.push("Target Class is undefined. Manual modification required.");
    }

    // 1. Letter of Appointment (LOA)
    const loaContent = `
**LETTER OF APPOINTMENT**

**Date:** ${new Date().toLocaleDateString()}

**To:** The Compensation Commissioner
**Subject:** Appointment of ${lead.brokerOwner} as Broker of Record

Dear Commissioner,

We, **${lead.companyName}**, hereby appoint **${lead.brokerOwner}** as our exclusive intermediary for all COID-related matters.

This appointment authorizes them to:
1. Access our records via the CompEasy system.
2. Submit Return of Earnings (W.As.8) on our behalf.
3. Handle all assessment queries and reclassifications.

**Current Wage Bill:** R ${lead.wageBill.toLocaleString()}
**Current Class:** ${lead.currentClass}

Signed,
__________________________
Authorized Signatory
${lead.companyName}
    `;

    // 2. CF-2A Return of Earnings (Simplified Simulation)
    const cf2aContent = `
**CF-2A: RETURN OF EARNINGS**

**Employer:** ${lead.companyName}
**Registration No:** [Pending Lookup]

**Section A: Earnings Declaration**
------------------------------------------------
1. Total Earnings (Provisional):  R ${lead.wageBill.toLocaleString()}
2. Actual Earnings (Previous):    R ${(lead.wageBill * 0.9).toLocaleString()} (Est.)
3. Directors/Members Earnings:    R 0.00

**Section B: Classification**
------------------------------------------------
**Current Nature of Business:** [ derived from ${lead.currentClass} ]
**Proposed Classification:** ${lead.targetClass} ${isClassUnknown ? '⚠️ (MANUAL REVIEW)' : ''}

**Declaration:**
I, the undersigned, confirm that the particulars furnished in this return are true and correct.

Signed: __________________________
    `;

    // 3. CF-1B Reclassification Application
    const cf1bContent = `
**CF-1B: APPLICATION FOR RECLASSIFICATION**

**Entity:** ${lead.companyName}

**Motivation for Change:**
The entity's nature of business has shifted from the operations defined under **${lead.currentClass}** to those better described by **${lead.targetClass}**.

**Operational Evidence:**
- [To be attached: Site Photos]
- [To be attached: Process Flowchart]

We request the Commissioner to review this classification effective from the current financial year.
    `;

    // 4. RMA Registration Form
    const rmaRegContent = `
**RMA EMPLOYER REGISTRATION APPLICATION**

**Applicant:** ${lead.companyName}
**Trading As:** ${lead.companyName}

**Contact:** ${lead.rmaData?.contactName || '[MISSING CONTACT]'}
**Email:** ${lead.rmaData?.contactEmail || '[MISSING EMAIL]'}

**Selected Products:**
${lead.rmaData?.products.map(p => `- [x] ${p}`).join('\n') || '- [ ] No Products Selected'}

**Banking Details for Debit Order:**
Bank: ____________________
Acc No: __________________
    `;

    return {
        leadId: lead.id,
        generatedAt: timestamp,
        documents: [
            {
                id: `DOC-LOA-${lead.id}`,
                type: 'LOA',
                title: 'Letter of Appointment',
                content: loaContent.trim(),
                status: 'Ready',
                flags: []
            },
            {
                id: `DOC-CF1B-${lead.id}`,
                type: 'CF-1B',
                title: 'CF-1B Reclassification',
                content: cf1bContent.trim(),
                status: 'Ready',
                flags: []
            },
            {
                id: `DOC-CF2A-${lead.id}`,
                type: 'CF-2A',
                title: 'CF-2A Return of Earnings',
                content: cf2aContent.trim(),
                status: isClassUnknown ? 'Review Required' : 'Ready',
                flags: flags
            },
            {
                id: `DOC-REG-${lead.id}`,
                type: 'RMA-REG',
                title: 'RMA Registration',
                content: rmaRegContent.trim(),
                status: 'Ready',
                flags: !lead.rmaData ? ['Missing RMA Data'] : []
            }
        ]
    };
};
