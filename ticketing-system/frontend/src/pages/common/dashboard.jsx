import Header from "../../components/UI/Header";
import Sidebar from "../../components/UI/sidebar";
import { TicketView, TicketViewSkeleton } from "../../components/UI/ticketView";
import fetchApi from "../../lib/api";
import { useNavigate } from "react-router-dom";
import { useState, useEffect, useContext } from "react";
import { KPI, KPISkeleton } from "../../components/admin/kpi";
import { VelocityBarChart, CategoryDoughnutChart, BarSkeleton, CircleSkeleton } from "../../components/admin/chart";
import { ProfileContext } from "../../App";

export default function Dashboard() {

    const [showSidebar, setShowSidebar] = useState(false);
    const navigate = useNavigate();
    const [tickets, setTickets] = useState([]);
    const [stat, setStat] = useState(null);
    const [loading, setLoading] = useState(true);
    const { profile } = useContext(ProfileContext);

    useEffect(() => {
        (async () => {
            try {
                if (profile.role === "admin") {
                    const data = await fetchApi("/api/admin/stats");

                    if (data.success === true) {
                        setStat(data.stat);
                    } else {
                        throw data;
                    }
                }

                const ticketData = await fetchApi("/api/tickets");

                if (ticketData.success === true) {
                    setTickets(ticketData.tickets.toReversed());
                } else {
                    throw ticketData;
                }
            }
            catch (err) {
                console.log(err);
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    return (
        <>
            <main className="flex min-h-screen bg-slate-50">

                <Sidebar showSidebar={showSidebar} setShowSidebar={setShowSidebar} />

                {profile.role === "admin" ?

                    <div className="flex-1 flex flex-col md:pl-65 lg:pl-70 xl:pl-80 transition-all duration-300 min-w-0">

                        <Header showSidebar={showSidebar} setShowSidebar={setShowSidebar} />

                        <div className="flex-1 p-4 sm:p-6 lg:p-8 max-w-400 w-full mx-auto flex flex-col gap-6">

                            {
                                profile.role === "admin"
                                &&
                                <section aria-label="System KPI Overviews">
                                    {loading ? <KPISkeleton /> : <KPI stat={stat} />}
                                </section>
                            }

                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">

                                {
                                    profile.role === "admin"
                                    &&
                                    <div className="lg:col-span-2 order-1 min-w-0">
                                        {loading ? <BarSkeleton /> : <VelocityBarChart stat={stat} />}
                                    </div>
                                }

                                {
                                    profile.role === "admin"
                                    &&
                                    <div className="w-full lg:col-span-1 order-2 lg:sticky lg:top-24">
                                        {loading ? <CircleSkeleton /> : <CategoryDoughnutChart stat={stat} />}
                                    </div>
                                }

                                <div className="lg:col-span-2 order-3 min-w-0">
                                    {loading ? <TicketViewSkeleton /> : <TicketView tickets={tickets} />}
                                </div>

                            </div>

                        </div>
                    </div>

                    :

                    <div className="flex-1 flex flex-col md:ml-65 lg:ml-70 xl:ml-80">

                        <Header
                            showSidebar={showSidebar}
                            setShowSidebar={setShowSidebar}
                        />

                        <div className="flex-1 p-3 sm:p-4 md:p-5 lg:p-6">
                            {loading ? <TicketViewSkeleton /> : <TicketView tickets={tickets} />}
                        </div>

                    </div>
                }
            </main>
        </>
    )
}
