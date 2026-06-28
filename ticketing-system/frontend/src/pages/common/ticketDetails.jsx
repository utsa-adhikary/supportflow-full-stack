import { Link, useParams } from "react-router-dom";
import { TktMetadata, TktMetadataSkeleton } from "../../components/UI/tktMetadata";
import { ArrowLeft } from 'lucide-react';
import ChatSec from "../../components/UI/chatSec";
import { useContext, useState, useEffect } from "react";
import { ProfileContext } from "../../App";
import DeleteTicket from "../../components/UI/deletePopUp";
import { TicketActions, TicketActionsSkeleton } from "../../components/UI/tktAction";
import Sidebar from "../../components/UI/sidebar";
import Header from "../../components/UI/Header";
import fetchApi from "../../lib/api";
import { TicketCardSkeleton } from "../../components/UI/ticketCard";

export default function TktDetails() {

    const { profile } = useContext(ProfileContext);
    const { id } = useParams();
    const [loading, setLoading] = useState(true);
    const [showSidebar, setShowSidebar] = useState(false);
    const [messages, setMessages] = useState([]);
    const [deleteTkt, setDeleteTkt] = useState(false);
    const [targetTkt, setTargetTkt] = useState({});

    useEffect(() => {
        (async () => {
            try {
                const tktData = await fetchApi(`/api/tickets/${id}`);

                if (tktData.success === true) {
                    setTargetTkt(tktData.ticket);
                } else {
                    throw { tktData }
                }
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    if (!targetTkt) {
        return (
            <main className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
                <div className="text-center max-w-sm bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
                    <h2 className="text-sm font-bold text-slate-900">Record Not Indexable</h2>
                    <p className="text-xs text-slate-500 mt-1 mb-4">The selected reference signature does not exist in local indexing arrays.</p>
                    <Link to={`/${profile}/dashboard`} className="inline-flex px-4 py-2 bg-slate-900 text-white text-xs font-semibold rounded-xl transition">
                        Return to Dashboard
                    </Link>
                </div>
            </main>
        );
    }

    return (
        <main className="flex h-screen w-screen bg-slate-50 overflow-hidden">

            <Sidebar showSidebar={showSidebar} setShowSidebar={setShowSidebar} />

            <div className="flex-1 flex flex-col h-full min-w-0 transition-all duration-300 md:pl-65 lg:pl-70 xl:pl-80">

                <div className="sticky top-0 z-40 bg-white border-b border-slate-200 shrink-0">
                    <Header showSidebar={showSidebar} setShowSidebar={setShowSidebar} />
                </div>

                <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 max-w-350 w-full mx-auto flex flex-col gap-6 scrollbar-thin">

                    <section className="w-full flex items-center gap-3.5 bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
                        <Link
                            to={'/dashboard'}
                            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
                        >
                            <ArrowLeft size={18} />
                        </Link>
                        <div className="min-w-0">
                            <h1 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                                Ticket Console
                            </h1>
                            <p className="text-xs text-slate-400 truncate">
                                Inspect diagnostic specifications and manage active user support communications pipeline channels.
                            </p>
                        </div>
                    </section>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start w-full">

                        <div className="lg:col-span-2 flex flex-col gap-6 min-w-0 w-full">

                            {loading ? <TicketCardSkeleton /> : <TktMetadata targetTkt={targetTkt} />}

                            {loading ? <TicketActionsSkeleton /> :
                                <TicketActions
                                    id={id}
                                    targetTkt={targetTkt}
                                    setTargetTkt={setTargetTkt}
                                    setDeleteTkt={setDeleteTkt}
                                />}

                        </div>

                        <div className="lg:col-span-1 w-full lg:sticky lg:top-6">
                            <ChatSec id={id} messages={messages} setMessages={setMessages} />
                        </div>

                    </div>
                </div>
            </div>

            {deleteTkt && (
                <DeleteTicket
                    id={id}
                    setTargetTkt={setTargetTkt}
                    setDeleteTkt={setDeleteTkt}
                />
            )}
        </main>
    );
}