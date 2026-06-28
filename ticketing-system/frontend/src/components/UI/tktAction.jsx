import { useState, useContext, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ChevronDown, Trash2, Shield, User, LoaderCircle } from "lucide-react";
import toast from "react-hot-toast";
import { ProfileContext } from "../../App";
import fetchApi from "../../lib/api";

export function TicketActionsSkeleton() {
    return (
        <section className="w-full bg-white border border-slate-200 rounded-2xl shadow-sm p-5 animate-pulse">
            <div className="flex flex-col gap-4">

                {/* Header Row (Shared Icon + Title Layout) */}
                <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                    {/* Console Icon */}
                    <div className="size-4 bg-slate-200 rounded shrink-0" />
                    {/* Section Title */}
                    <div className="h-3.5 bg-slate-200 rounded w-44" />
                </div>

                {/* Main Content Area */}
                <div className="space-y-4 py-1">
                    {/* Top segment block (Matches dropdown label/paragraph description) */}
                    <div className="space-y-2">
                        <div className="h-3 bg-slate-200 rounded w-28" />

                        {/* Dynamic content placeholder mimicking a dropdown box / body text */}
                        <div className="h-9 w-full bg-slate-50 border border-slate-200/60 rounded-xl" />
                    </div>
                </div>

                {/* Action Buttons Row */}
                <div className="flex items-center gap-2.5 pt-1">
                    {/* Primary Action Button (Apply Changes / Mark Resolved) */}
                    <div className="h-9 flex-1 bg-slate-200 rounded-xl" />

                    {/* Secondary Action Button (Delete Trash Icon) */}
                    <div className="size-9 bg-slate-200 rounded-xl shrink-0" />
                </div>

            </div>
        </section>
    );
}

export function TicketActions({ id, targetTkt, setTargetTkt, setDeleteTkt }) {
    const { profile } = useContext(ProfileContext);
    const [disableAnimate, setDisableAnimate] = useState(false);
    const navigate = useNavigate();

    const [status, setStatus] = useState("");

    useEffect(() => {
        if (targetTkt.status) {
            setStatus(targetTkt.status);
        }
    }, []);

    async function applyChange() {

        try {

            setDisableAnimate(true);

            const option = {
                method: "PATCH",
                body: JSON.stringify({ status: `${status}`, priority: targetTkt.priority, category: targetTkt.category })
            }

            const data = await fetchApi(`/api/tickets/${id}`, option);

            if (data.success === true) {
                setTargetTkt({ ...targetTkt, status: `${status}` });
                setDisableAnimate(false);
            } else {
                setDisableAnimate(false);
                throw data;
            }

            (() => toast.success("Changes Applied Successfully"))();

        } catch (error) {
            console.error(error);
        }
    }

    async function handleResolve() {

        try {
            setDisableAnimate(true);
            const option = {
                method: "PATCH",
                body: JSON.stringify({ status: "Resolved" })
            }

            const data = await fetchApi(`/api/tickets/${id}`, option);

            if (data.success === true) {
                setTargetTkt({ ...targetTkt, status: "Resolved" });
                setDisableAnimate(false);
            } else {
                setDisableAnimate(false);
                throw data;
            }

            (() => toast.success("Ticket Resolved"))();

        } catch (error) {
            console.error(error);
        }

    }

    return (
        <section className="w-full bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden p-5 transition-all duration-200">
            {profile.role === "admin" ? (

                <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                        <Shield size={15} className="text-slate-400" />
                        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                            Admin Properties Console
                        </h3>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="mb-1.5 block text-xs font-semibold text-slate-400 uppercase tracking-wide">
                                Ticket Status Lifecycle
                            </label>

                            <div className="relative">
                                <select
                                    value={status}
                                    onChange={(e) => setStatus(e.target.value)}
                                    className="w-full rounded-xl border border-slate-300 pl-3.5 pr-10 py-2.5 bg-white text-xs font-medium text-slate-700 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all appearance-none"
                                >
                                    <option value="Open">Open</option>
                                    <option value="InProgress">In Progress</option>
                                    <option value="Resolved">Resolved</option>
                                </select>

                                <ChevronDown
                                    size={14}
                                    className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-2.5 pt-1">
                        <button
                            className="flex-1 flex justify-center rounded-xl bg-indigo-600 hover:bg-indigo-700 text-xs font-semibold text-white py-2.5 px-4 transition-all active:scale-[0.98] disabled:bg-indigo-400 disabled:cursor-not-allowed disabled:active:scale-100 disabled:opacity-60 shadow-xs"
                            disabled={status === targetTkt.status || disableAnimate}
                            onClick={() => applyChange()}
                        >
                            {disableAnimate ? <LoaderCircle className="animate-spin" /> : "Apply Changes"}
                        </button>

                        <button
                            className="group flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-rose-200 bg-rose-50 text-rose-600 transition hover:bg-rose-100 active:scale-95"
                            onClick={() => setDeleteTkt(true)}
                            title="Delete Ticket"
                        >
                            <Trash2 size={15} className="transition-transform group-hover:scale-105" />
                        </button>
                    </div>
                </div>
            ) : (

                <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                        <User size={15} className="text-slate-400" />
                        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                            User Management Action
                        </h3>
                    </div>

                    <div>
                        <p className="text-xs text-slate-500 leading-relaxed">
                            If your inquiry has been completed successfully, finalize the operational visibility lifecycle tracking loop below.
                        </p>
                    </div>

                    <div className="flex items-center gap-2.5">
                        <button
                            onClick={() => handleResolve()}
                            disabled={targetTkt.status === "Resolved" || disableAnimate}
                            className={`flex-1 flex justify-center rounded-xl py-2.5 px-4 text-xs font-bold transition-all duration-150 active:scale-[0.98]
                                ${targetTkt.status === "Resolved"
                                    ? "bg-emerald-50 text-emerald-700 border border-emerald-200/80 pointer-events-none"
                                    : "bg-indigo-600 text-white hover:bg-indigo-700 shadow-xs"
                                }`}
                        >
                            {disableAnimate ? <LoaderCircle className="animate-spin" /> : targetTkt.status === "Resolved" ? "✓ Resolved" : "Mark as Resolved"}
                        </button>

                        <button
                            onClick={() => setDeleteTkt(true)}
                            className="group flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-rose-200 bg-rose-50 text-rose-600 transition hover:bg-rose-100 active:scale-95"
                            title="Delete Ticket"
                        >
                            <Trash2 size={15} className="transition-transform group-hover:scale-105" />
                        </button>
                    </div>
                </div>
            )}
        </section>
    );
}