import { useState } from "react";
import Header from "../../components/UI/Header";
import Sidebar from "../../components/UI/sidebar";
import TicketView from "../../components/UI/ticketView";
import fetchApi from "../../lib/api";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function UserDashboard() {

    const [showSidebar, setShowSidebar] = useState(false);
    const [tickets, setTickets] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        (async () => {
            try {
                const ticketData = await fetchApi("/api/tickets");                
                setTickets(ticketData.tickets.toReversed());
            }
            catch (err) {
                console.log(err);
                if (err.status === 401) {
                    navigate("/auth");
                }
            }
        })();
    }, []);

    return (
        <>
            <main className="flex min-h-screen bg-slate-100">

                <Sidebar
                    showSidebar={showSidebar}
                    setShowSidebar={setShowSidebar}
                />

                <div className="flex-1 flex flex-col md:ml-65 lg:ml-70 xl:ml-80">

                    <Header
                        showSidebar={showSidebar}
                        setShowSidebar={setShowSidebar}
                    />

                    <div className="flex-1 p-3 sm:p-4 md:p-5 lg:p-6">
                        <TicketView
                            tickets={tickets}
                            setTickets={setTickets}
                        />
                    </div>

                </div>

            </main>
        </>
    )
}
