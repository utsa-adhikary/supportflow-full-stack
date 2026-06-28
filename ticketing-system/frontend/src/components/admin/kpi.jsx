import { useState, useEffect } from "react";
import { FolderOpen, Hourglass, CircleCheckBig, Ticket } from "lucide-react";
import fetchApi from "../../lib/api";

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

export function KPI({ stat }) {

    console.log("KPI stat:", stat);

    if (!stat) {
        return <KPISkeleton />;
    }

    const totalOpen = stat.ticketsByStatus.Open;
    const inProgress = stat.ticketsByStatus.InProgress;
    const resolvedToday = stat.resolvedToday;
    const totalTickets = stat.totalTickets;

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

export function KPISkeleton() {
    return (
        <div className="w-full grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-5">
            {Array.from({ length: 4 }).map((_, index) => (
                <div
                    key={index}
                    className="bg-white border border-slate-200 border-l-4 border-l-slate-200 rounded-2xl p-4 sm:p-5 shadow-sm animate-pulse"
                >
                    <div className="flex justify-between items-start gap-2">
                        {/* Title and Value */}
                        <div className="min-w-0 flex-1 space-y-2">
                            {/* Title Placeholder */}
                            <div className="h-3 sm:h-4 bg-slate-200 rounded w-2/3" />
                            {/* Value Placeholder */}
                            <div className="h-7 sm:h-9 bg-slate-200 rounded w-1/2 mt-1 sm:mt-2" />
                        </div>

                        {/* Icon Placeholder */}
                        <div className="p-2 bg-slate-100 rounded-xl size-9 sm:size-10 shrink-0 sm:mt-0.5" />
                    </div>
                </div>
            ))}
        </div>
    );
}