import { Calendar, Hash, Tag, Radio, FileText } from 'lucide-react';

export function TktMetadataSkeleton() {
    return (
        <section className="w-full bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden relative animate-pulse">
            {/* Absolute side accent bar simulator */}
            <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-slate-200" />

            <div className="p-4 sm:p-5 pl-5 sm:pl-6 flex flex-col gap-4 sm:gap-5">

                {/* Header Section: ID & Priority Badges */}
                <div className="flex flex-wrap items-center justify-between gap-2.5">
                    {/* ID Badge */}
                    <div className="h-6 w-24 bg-slate-200 rounded-lg" />

                    {/* Priority Badge */}
                    <div className="h-6 w-28 bg-slate-200 rounded-full" />
                </div>

                {/* Title & Status Row */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 border-b border-slate-100 pb-3">
                    {/* Title Placeholder */}
                    <div className="space-y-2 flex-1 w-full sm:max-w-[75%]">
                        <div className="h-5 bg-slate-200 rounded w-5/6" />
                        <div className="h-5 bg-slate-200 rounded w-1/2 block sm:hidden" /> {/* extra line space on mobile if needed */}
                    </div>

                    {/* Status Badge */}
                    <div className="h-6 w-24 bg-slate-200 rounded-full shrink-0" />
                </div>

                {/* Description Textblock Placeholder */}
                <div className="flex flex-col gap-2">
                    {/* Title Label */}
                    <div className="h-3 bg-slate-200 rounded w-36" />
                    {/* Content Box */}
                    <div className="bg-slate-50 border border-slate-100 p-3 rounded-xl space-y-2">
                        <div className="h-3.5 bg-slate-200 rounded w-full" />
                        <div className="h-3.5 bg-slate-200 rounded w-11/12" />
                        <div className="h-3.5 bg-slate-200 rounded w-4/5" />
                    </div>
                </div>

                {/* Metadata Grid Footer */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                    {/* Category Column */}
                    <div className="flex flex-col gap-2">
                        <div className="h-3 bg-slate-200 rounded w-16" />
                        <div className="h-4 bg-slate-200 rounded w-32" />
                    </div>

                    {/* Date Column */}
                    <div className="flex flex-col gap-2">
                        <div className="h-3 bg-slate-200 rounded w-24" />
                        <div className="h-4 bg-slate-200 rounded w-28" />
                    </div>
                </div>

            </div>
        </section>
    );
}

export function TktMetadata({ targetTkt }) {

    const statusStyles = {
        Open: {
            badge: "bg-blue-50 text-blue-700 border-blue-200",
            dot: "bg-blue-500",
            accent: "bg-blue-500",
        },
        Resolved: {
            badge: "bg-emerald-50 text-emerald-700 border-emerald-200",
            dot: "bg-emerald-500",
            accent: "bg-emerald-500",
        },
        InProgress: {
            badge: "bg-purple-50 text-purple-700 border-purple-200",
            dot: "bg-purple-500",
            accent: "bg-purple-500",
        },
    };

    const priorityStyles = {
        High: {
            badge: "bg-rose-50 text-rose-700 border-rose-200",
            dot: "bg-rose-500",
        },
        Medium: {
            badge: "bg-yellow-50 text-yellow-700 border-yellow-200",
            dot: "bg-yellow-500",
        },
        Low: {
            badge: "bg-teal-50 text-teal-700 border-teal-200",
            dot: "bg-teal-500",
        },
    };

    const currentStatus = statusStyles[targetTkt.status] || {
        badge: "bg-slate-50 text-slate-600 border-slate-200",
        dot: "bg-slate-400",
        accent: "bg-slate-400"
    };

    return (
        <section className="w-full bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden relative transition-all duration-200">
            <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${currentStatus.accent}`} />

            <div className="p-4 sm:p-5 pl-5 sm:pl-6 flex flex-col gap-4 sm:gap-5">
                <div className="flex flex-wrap items-center justify-between gap-2.5">
                    <div className="flex items-center gap-1.5 min-w-0">
                        <Hash size={14} className="text-slate-400 shrink-0" />
                        <span className="text-xs font-mono font-semibold text-slate-600 bg-slate-50 border border-slate-200/60 rounded-lg px-2.5 py-0.5 tracking-wider truncate max-w-full">
                            {targetTkt.ticketNumber}
                        </span>
                    </div>

                    <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 border rounded-full uppercase tracking-wider shrink-0 ${priorityStyles[targetTkt.priority]?.badge || "bg-slate-50 text-slate-600 border-slate-200"}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${priorityStyles[targetTkt.priority]?.dot || "bg-slate-400"}`} />
                        {targetTkt.priority} Priority
                    </span>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 border-b border-slate-100 pb-3">
                    <h2 className="text-base sm:text-lg font-bold text-slate-900 leading-snug tracking-tight sm:max-w-[75%]">
                        {targetTkt.title}
                    </h2>

                    <span className={`shrink-0 w-fit h-fit flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider px-2.5 py-1 border rounded-full ${currentStatus.badge}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${currentStatus.dot} animate-pulse`} />
                        {targetTkt.status}
                    </span>
                </div>

                {targetTkt.description && (
                    <div className="flex flex-col gap-1.5">
                        <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 flex items-center gap-1.5">
                            <FileText size={12} /> Brief Specification Overview
                        </h4>
                        <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-wrap bg-slate-50/50 p-3 rounded-xl border border-slate-100">
                            {targetTkt.description}
                        </p>
                    </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                    <div className="flex flex-col gap-1">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 flex items-center gap-1.5">
                            <Tag size={12} /> Category
                        </span>
                        <span className="text-sm font-semibold text-slate-700">
                            {targetTkt.category || "General Enquiries"}
                        </span>
                    </div>

                    <div className="flex flex-col gap-1">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 flex items-center gap-1.5">
                            <Calendar size={12} /> Date Submitted
                        </span>
                        <span className="text-sm font-semibold text-slate-700">
                            {new Date(targetTkt.createdAt).toLocaleDateString("en-GB", { day: 'numeric', month: 'short', year: 'numeric' })}
                        </span>
                    </div>
                </div>
            </div>
        </section>
    );
}