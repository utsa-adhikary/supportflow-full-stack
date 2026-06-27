import "chart.js/auto";
import { Bar, Doughnut } from "react-chartjs-2";
import { useState, useEffect } from "react";
import fetchApi from "../../lib/api";

export function BarSkeleton() {
    return (
        <div className="w-full bg-white border border-slate-200 rounded-2xl p-5 shadow-sm animate-pulse flex flex-col h-75">
            {/* Chart Title Placeholder */}
            <div className="h-4 bg-slate-200 rounded w-1/4 mb-6" />

            {/* Chart Visual Simulation */}
            <div className="flex-1 flex items-end gap-4 sm:gap-6 px-2 border-b border-l border-slate-100 pb-2 pl-2">
                {/* Simulated Bars of varied heights */}
                <div className="bg-slate-200 rounded-t-md flex-1 h-[40%]" />
                <div className="bg-slate-200 rounded-t-md flex-1 h-[75%]" />
                <div className="bg-slate-200 rounded-t-md flex-1 h-[55%]" />
                <div className="bg-slate-200 rounded-t-md flex-1 h-[90%]" />
                <div className="bg-slate-200 rounded-t-md flex-1 h-[30%]" />
                <div className="bg-slate-200 rounded-t-md flex-1 h-[65%]" />
            </div>

            {/* X-Axis Labels Placeholder */}
            <div className="flex justify-between items-center mt-3 px-2">
                <div className="h-2.5 bg-slate-200 rounded w-8" />
                <div className="h-2.5 bg-slate-200 rounded w-8" />
                <div className="h-2.5 bg-slate-200 rounded w-8" />
                <div className="h-2.5 bg-slate-200 rounded w-8" />
                <div className="h-2.5 bg-slate-200 rounded w-8" />
                <div className="h-2.5 bg-slate-200 rounded w-8" />
            </div>
        </div>
    );
}

export function CircleSkeleton() {
    return (
        <div className="w-full bg-white border border-slate-200 rounded-2xl p-5 shadow-sm animate-pulse flex flex-col sm:flex-row items-center justify-between gap-6 h-auto sm:h-62.5">
            {/* Left/Top Content: Title & Legend Placeholders */}
            <div className="flex flex-col flex-1 w-full space-y-4 self-start sm:self-center">
                {/* Chart Title */}
                <div className="h-4 bg-slate-200 rounded w-1/2 mb-2" />

                {/* Legend list entries */}
                <div className="space-y-2.5">
                    <div className="flex items-center gap-2">
                        <div className="size-3 rounded-full bg-slate-200 shrink-0" />
                        <div className="h-3 bg-slate-200 rounded w-20" />
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="size-3 rounded-full bg-slate-200 shrink-0" />
                        <div className="h-3 bg-slate-200 rounded w-16" />
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="size-3 rounded-full bg-slate-200 shrink-0" />
                        <div className="h-3 bg-slate-200 rounded w-24" />
                    </div>
                </div>
            </div>

            {/* Right/Bottom Content: Doughnut Ring Placeholder */}
            <div className="relative size-36 sm:size-40 rounded-full border-16 border-slate-200 flex items-center justify-center shrink-0">
                {/* Inner empty cutout of the doughnut chart */}
                <div className="absolute inset-0 m-auto size-full rounded-full border-slate-200" />
            </div>
        </div>
    );
}

export function VelocityBarChart({ stat }) {

    const [showAll, setShowAll] = useState(false);
    const createDates = stat;

    // Get all dates and values as arrays
    const allLabels = Object.keys(createDates.createdAt);
    const allData = Object.values(createDates.createdAt);

    const visibleLabels = showAll ? allLabels : allLabels.slice(-7);
    const visibleData = showAll ? allData : allData.slice(-7);

    const BarChartData = {
        labels: visibleLabels,
        datasets: [{
            label: "Tickets Created",
            data: visibleData,
            backgroundColor: "rgba(59, 130, 246, 0.8)",
            borderRadius: 6,
        }],
    };

    const BarChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: { y: { beginAtZero: true, ticks: { stepSize: 1, precision: 0 } } },
    };

    return (
        <div className="bg-white border border-slate-200 border-l-4 border-l-slate-200 rounded-2xl p-4 sm:p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-slate-700">
                    {showAll ? "All Ticket Creation Velocity" : "Ticket Creation Velocity For Past 7 Days"}
                </h3>

                {/* View More / View Less Button */}
                <button
                    onClick={() => setShowAll(!showAll)}
                    className="text-xs font-medium text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-2.5 py-1.5 rounded-lg transition-colors"
                >
                    {showAll ? "View Past 7 Days" : "View All Dates"}
                </button>
            </div>

            <div className="relative w-full h-48 sm:h-56">
                <Bar data={BarChartData} options={BarChartOptions} />
            </div>
        </div>
    );
}

export function CategoryDoughnutChart({stat}) {

    const categoryData = stat;

    const DoughChartData = {
        labels: Object.keys(categoryData.ticketsByCategory),
        datasets: [{
            label: "Tickets",
            data: Object.values(categoryData.ticketsByCategory),
            backgroundColor: [
                "rgba(59, 130, 246, 0.8)",
                "rgba(16, 185, 129, 0.8)",
                "rgba(245, 158, 11, 0.8)",
                "rgba(239, 68, 68, 0.8)",
                "rgba(139, 92, 246, 0.8)"
            ],
            borderWidth: 2,
        }],
    };

    const DoughChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { position: "bottom", labels: { boxWidth: 12, font: { size: 11 } } } }
    };

    return (
        <div className="bg-white border border-slate-200 border-l-4 border-l-slate-200 rounded-2xl p-4 sm:p-5 shadow-sm h-full">
            <h3 className="text-sm font-semibold text-slate-700 mb-2">Distribution by Category</h3>
            <div className="relative w-full flex-1 min-h-60 flex justify-center items-center">
                <Doughnut data={DoughChartData} options={DoughChartOptions} />
            </div>
        </div>
    );
}