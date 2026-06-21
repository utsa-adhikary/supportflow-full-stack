import { useState, useEffect } from "react";
import Header from "../../components/UI/Header";
import TicketView from "../../components/UI/ticketView";
import KPI from "../../components/admin/kpi";
import { VelocityBarChart, CategoryDoughnutChart } from "../../components/admin/chart";
import Sidebar from "../../components/UI/sidebar";

export default function AdminDashboard() {
    const [showSidebar, setShowSidebar] = useState(false);
    const [tickets, setTickets] = useState([]);

    useEffect(() => {
        (async () => {
            try {
                const response = await fetch("http://localhost:8000/api/tickets");

                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }

                const ticketData = await response.json();

                setTickets(ticketData.toReversed());

            } catch (error) {
                console.error("Failed to fetch ticket:", error.message);
            }
        })();
    }, []);

    return (
        <main className="flex min-h-screen bg-slate-50">

            <Sidebar showSidebar={showSidebar} setShowSidebar={setShowSidebar} />

            <div className="flex-1 flex flex-col md:pl-65 lg:pl-70 xl:pl-80 transition-all duration-300 min-w-0">

                <Header showSidebar={showSidebar} setShowSidebar={setShowSidebar} />

                <div className="flex-1 p-4 sm:p-6 lg:p-8 max-w-400 w-full mx-auto flex flex-col gap-6">

                    <section aria-label="System KPI Overviews">
                        <KPI tickets={tickets} />
                    </section>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">

                        <div className="lg:col-span-2 order-1 min-w-0">
                            <VelocityBarChart tickets={tickets} />
                        </div>

                        <div className="w-full lg:col-span-1 order-2 lg:sticky lg:top-24">
                            <CategoryDoughnutChart tickets={tickets} />
                        </div>

                        <div className="lg:col-span-2 order-3 min-w-0">
                            <TicketView tickets={tickets} setTickets={setTickets} />
                        </div>

                    </div>

                </div>
            </div>
        </main>
    );
}