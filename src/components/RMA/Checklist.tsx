"use client";

import { useState } from "react";
import { CheckCircle } from "lucide-react";

export function Checklist() {
    const [items, setItems] = useState([
        { id: 1, label: 'Company Name Match', checked: true },
        { id: 2, label: 'Registration Number Match', checked: true },
        { id: 3, label: 'Rates Correctly Applied', checked: true },
        { id: 4, label: 'Officer Signature Present', checked: true },
    ]);

    const toggle = (id: number) => {
        setItems(items.map(i => i.id === id ? { ...i, checked: !i.checked } : i));
    };

    return (
        <ul className="space-y-2 text-sm text-slate-400">
            {items.map(item => (
                <li key={item.id} className="flex items-center cursor-pointer hover:text-slate-200" onClick={() => toggle(item.id)}>
                    {item.checked ? (
                        <CheckCircle className="h-3 w-3 text-emerald-500 mr-2" />
                    ) : (
                        <div className="h-3 w-3 rounded-full border border-slate-600 mr-2" />
                    )}
                    {item.label}
                </li>
            ))}
        </ul>
    );
}
