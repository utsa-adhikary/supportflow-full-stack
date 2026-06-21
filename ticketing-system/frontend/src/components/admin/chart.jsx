import "chart.js/auto";
import { Bar, Doughnut } from "react-chartjs-2";
import { useState } from "react";


function extractChartData(tickets) {
    if (!tickets || tickets.length === 0) {
        return { createDates: {}, categoryData: {} };
    }

    const categoryData = {};
    const createDates = {};

    
    const sortedTickets = [...tickets].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

    
    const dates = sortedTickets.map(t => new Date(t.createdAt));
    const oldestDate = new Date(Math.min(...dates));
    const now = new Date();

    let current = new Date(oldestDate);
    while (current <= now) {
        const formattedDate = current.toLocaleDateString("en-GB", {
            day: "numeric",
            month: "short",
            timeZone: "UTC",
        });
        createDates[formattedDate] = 0;
        current.setDate(current.getDate() + 1);
    }

    
    sortedTickets.forEach(ticket => {

        if (categoryData[ticket.category]) {
            categoryData[ticket.category]++;
        } else {
            categoryData[ticket.category] = 1;
        }

        const dateObj = new Date(ticket.createdAt);
        const formattedDate = dateObj.toLocaleDateString("en-GB", {
            day: "numeric",
            month: "short",
            timeZone: "UTC",
        });

        if (createDates.hasOwnProperty(formattedDate)) {
            createDates[formattedDate]++;
        } else {
            createDates[formattedDate] = 1;
        }
    });

    return { createDates, categoryData };
}

export function VelocityBarChart({ tickets }) {
    const [showAll, setShowAll] = useState(false);
    const { createDates } = extractChartData(tickets);

    // Get all dates and values as arrays
    const allLabels = Object.keys(createDates);
    const allData = Object.values(createDates);

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
        <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-sm flex flex-col w-full">
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

export function CategoryDoughnutChart({ tickets }) {
    const { categoryData } = extractChartData(tickets);

    const DoughChartData = {
        labels: Object.keys(categoryData),
        datasets: [{
            label: "Tickets",
            data: Object.values(categoryData),
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
        <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-sm flex flex-col w-full h-full">
            <h3 className="text-sm font-semibold text-slate-700 mb-2">Distribution by Category</h3>
            <div className="relative w-full flex-1 min-h-60 flex justify-center items-center">
                <Doughnut data={DoughChartData} options={DoughChartOptions} />
            </div>
        </div>
    );
}