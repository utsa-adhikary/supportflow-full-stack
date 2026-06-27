import { useNavigate } from "react-router-dom";
import { Shapes, Ticket } from "lucide-react";

export function TicketCard({ data }) {

    const dateObj = new Date(data.createdAt);

    const formattedDate = dateObj.toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        timeZone: "UTC",
    });

    const cardLeftBorders = {
        High: "border-l-4 border-l-red-500",
        Medium: "border-l-4 border-l-orange-500",
        Low: "border-l-4 border-l-gray-400",
    };

    const priorityColors = {
        Low: "bg-emerald-50 text-emerald-700 border-emerald-200",
        Medium: "bg-amber-50 text-amber-700 border-amber-200",
        High: "bg-red-50 text-red-700 border-red-200",
    };

    const statusStyles = {
        Open: {
            badge: "bg-blue-100 text-blue-700 border-blue-200",
        },
        Resolved: {
            badge: "bg-green-100 text-green-700 border-green-200",
        },
        Pending: {
            badge: "bg-yellow-100 text-yellow-700 border-yellow-200",
        },
        Closed: {
            badge: "bg-gray-200 text-gray-700 border-gray-300",
        },
        InProgress: {
            badge: "bg-purple-100 text-purple-700 border-purple-200",
        }
    };

    const navigate = useNavigate();

    return (
        <>
            {/* Desktop Card */}
            <div className="hidden lg:block mb-4">
                <div
                    onClick={() => navigate(`/tickets/${data._id}`)}
                    className={`group w-full bg-white border border-slate-200 rounded-2xl p-5 flex justify-between items-center gap-8 shadow-sm hover:shadow-lg hover:border-slate-300 transition-all duration-300 cursor-pointer ${cardLeftBorders[data.priority] || ""}`}
                >
                    {/* Left Side */}
                    <div className="flex items-center gap-5 min-w-0">
                        {/* Ticket Icon */}
                        <div className="size-12 rounded-xl bg-slate-100 flex items-center justify-center shrink-0">
                            <Ticket size={20} />
                        </div>

                        {/* Content */}
                        <div className="min-w-0">
                            <h2 className="text-base font-semibold text-slate-800 truncate">
                                {data.title}
                            </h2>
                            <div className="flex items-center gap-1.5 mt-1 text-sm text-slate-500">
                                <Shapes size={16} />
                                <span className="truncate">
                                    {data.category}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Right Side*/}
                    <div className="flex items-center gap-6 shrink-0">
                        {/* Status Badge */}
                        <div className={`px-3 py-1 rounded-full text-sm font-medium border backdrop-blur-sm ${statusStyles[data.status]?.badge || "bg-slate-50 text-slate-700 border-slate-200"}`}>
                            {data.status}
                        </div>

                        {/* Date */}
                        <div className="text-sm text-slate-500 font-medium">
                            {formattedDate}
                        </div>

                        {/* Priority Badge */}
                        <div className={`px-3 py-1 rounded-full text-sm font-medium border backdrop-blur-sm ${priorityColors[data.priority] || "bg-slate-50 text-slate-700 border-slate-200"}`}>
                            {data.priority}
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile Card */}
            <div className="lg:hidden p-4">
                <div
                    onClick={() => navigate(`/tickets/${data._id}`)}
                    className={`group w-full bg-white border border-slate-200 rounded-2xl p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-sm hover:shadow-lg hover:border-slate-300 transition-all duration-300 cursor-pointer ${cardLeftBorders[data.priority] || ""}`}
                >
                    <div className="flex items-center gap-4 w-full sm:w-auto">
                        {/* left icon */}
                        <div className="min-w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center">
                            <Ticket />
                        </div>

                        {/* content */}
                        <div className="flex-1 min-w-0">
                            <h2 className="text-base font-semibold text-slate-800 truncate">
                                {data.title}
                            </h2>
                            <div className="flex items-center gap-1 mt-1 text-sm text-slate-500">
                                <Shapes size={16} />
                                <span className="truncate">
                                    {data.category}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Right side  */}
                    <div className="w-full sm:w-auto flex flex-wrap sm:flex-nowrap justify-start sm:justify-end items-center gap-3">
                        {/* status */}
                        <div className={`px-3 py-1 rounded-full text-sm font-medium border backdrop-blur-sm ${statusStyles[data.status]?.badge || "bg-slate-50 text-slate-700 border-slate-200"}`}>
                            {data.status}
                        </div>

                        {/* date */}
                        <div className="text-sm text-slate-500">
                            {formattedDate}
                        </div>

                        {/* priority */}
                        <div className={`px-3 py-1 rounded-full text-sm font-medium border backdrop-blur-sm ${priorityColors[data.priority] || "bg-slate-50 text-slate-700 border-slate-200"}`}>
                            {data.priority}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export function TicketCardSkeleton() {
    return (
        <>
            {/* Desktop Skeleton */}
            <div className="hidden lg:block mb-4">
                <div className="w-full bg-white border border-slate-200 rounded-2xl p-5 flex justify-between items-center gap-8 shadow-sm">
                    {/* Left Side */}
                    <div className="flex items-center gap-5 min-w-0 flex-1 animate-pulse">
                        {/* Ticket Icon Placeholder */}
                        <div className="size-12 rounded-xl bg-slate-200 shrink-0" />

                        {/* Content Placeholders */}
                        <div className="min-w-0 flex-1 space-y-2">
                            <div className="h-4 bg-slate-200 rounded w-1/3" />
                            <div className="h-3 bg-slate-200 rounded w-1/4" />
                        </div>
                    </div>

                    {/* Right Side */}
                    <div className="flex items-center gap-6 shrink-0 animate-pulse">
                        {/* Status Badge Placeholder */}
                        <div className="h-7 w-20 bg-slate-200 rounded-full" />

                        {/* Date Placeholder */}
                        <div className="h-4 w-12 bg-slate-200 rounded" />

                        {/* Priority Badge Placeholder */}
                        <div className="h-7 w-16 bg-slate-200 rounded-full" />
                    </div>
                </div>
            </div>

            {/* Mobile Skeleton */}
            <div className="lg:hidden p-4">
                <div className="w-full bg-white border border-slate-200 rounded-2xl p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-sm">
                    {/* Left Side */}
                    <div className="flex items-center gap-4 w-full sm:w-auto flex-1 animate-pulse">
                        {/* Icon Placeholder */}
                        <div className="size-12 rounded-xl bg-slate-200 shrink-0" />

                        {/* Content Placeholders */}
                        <div className="flex-1 min-w-0 space-y-2">
                            <div className="h-4 bg-slate-200 rounded w-1/2" />
                            <div className="h-3 bg-slate-200 rounded w-1/3" />
                        </div>
                    </div>

                    {/* Right Side */}
                    <div className="w-full sm:w-auto flex flex-wrap sm:flex-nowrap justify-start sm:justify-end items-center gap-3 animate-pulse">
                        {/* Status Placeholder */}
                        <div className="h-7 w-16 bg-slate-200 rounded-full" />

                        {/* Date Placeholder */}
                        <div className="h-4 w-12 bg-slate-200 rounded" />

                        {/* Priority Placeholder */}
                        <div className="h-7 w-16 bg-slate-200 rounded-full" />
                    </div>
                </div>
            </div>
        </>
    );
}