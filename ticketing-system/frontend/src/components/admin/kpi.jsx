import { useState } from "react";
import { FolderOpen, Hourglass, CircleCheckBig, Ticket } from "lucide-react";

function KPIcard({ data }) {
    return (
        <div
            className={`bg-white border border-slate-200 ${data.border} 
            border-l-4 rounded-2xl p-4 sm:p-5 shadow-sm transition-all duration-200 hover:shadow-md`}
        >
            <div className="flex justify-between items-start gap-2">
                <div className="min-w-0">
                    <p className="text-xs sm:text-sm font-medium text-slate-500 truncate">
                        {data.title}
                    </p>
                    <h2 className="text-2xl sm:text-3xl font-bold mt-1 sm:mt-2 text-slate-800">
                        {data.value}
                    </h2>
                </div>

                <div className="p-2 bg-slate-50 rounded-xl text-slate-400 shrink-0 sm:mt-0.5">
                    {data.icon}
                </div>
            </div>
        </div>
    );
}

export default function KPI({ tickets }) {
    const totalOpen = tickets.filter(t => t.status === "Open").length;
    const inProgress = tickets.filter(t => t.status === "InProgress").length;
    const resolvedToday = tickets.filter(t => t.status === "Resolved").length;
    const totalTickets = tickets.length;

    const kpis = [
        {
            title: "Total Open",
            value: totalOpen,
            icon: <FolderOpen className="size-5 sm:size-6 text-rose-500" />,
            border: "border-l-rose-500"
        },
        {
            title: "In Progress",
            value: inProgress,
            icon: <Hourglass className="size-5 sm:size-6 text-amber-500" />,
            border: "border-l-amber-500"
        },
        {
            title: "Resolved Today",
            value: resolvedToday,
            icon: <CircleCheckBig className="size-5 sm:size-6 text-emerald-500" />,
            border: "border-l-emerald-500"
        },
        {
            title: "Total Tickets",
            value: totalTickets,
            icon: <Ticket className="size-5 sm:size-6 text-blue-500" />,
            border: "border-l-blue-500"
        }
    ];

    return (
        <div className="w-full grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-5">
            {kpis.map((item, index) => (
                <KPIcard key={index} data={item} />
            ))}
        </div>
    );
}