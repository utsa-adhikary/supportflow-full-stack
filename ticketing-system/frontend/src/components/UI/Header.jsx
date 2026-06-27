import { useContext } from "react";
import { Link, NavLink } from "react-router-dom";
import { PanelLeftOpen, User, ShieldUser, Plus } from "lucide-react";
import { ProfileContext } from "../../App";
import { profileSwitchToast } from "./Toasts";
import { CircleUserRound } from "lucide-react";

export default function Header({ showSidebar, setShowSidebar }) {

    const { profile } = useContext(ProfileContext);

    return (
        <header className="sticky top-0 z-30 w-full bg-slate-50/95 backdrop-blur-sm border-b border-slate-200 shadow-sm px-3 sm:px-4 md:px-6 lg:px-8 xl:px-10 py-3 flex items-center justify-between gap-3">

            {/* Left */}
            <div className="flex items-center gap-2 sm:gap-3">

                <button
                    className="md:hidden size-9 sm:size-10 border border-slate-300 bg-white hover:bg-slate-100 transition-all duration-200 flex justify-center items-center rounded-xl shadow-sm"
                    onClick={() => setShowSidebar(!showSidebar)}
                >
                    <PanelLeftOpen className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>

                <div className="font-bold text-slate-900">
                    <h1 className="text-lg sm:text-xl md:text-2xl">
                        SupportFlow
                    </h1>
                </div>

            </div>

            {/* Right */}
            <div className="flex items-center gap-2 sm:gap-3">

                {/* Create Ticket */}
                {profile.role === "customer" && (
                    <Link to="/tickets/new">
                        <button className="bg-blue-500 hover:bg-blue-600 text-white px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl flex items-center gap-2 shadow-sm transition-all">

                            <Plus className="w-4 h-4 sm:w-5 sm:h-5" />

                            <span className="hidden sm:block text-sm font-medium">
                                Create Ticket
                            </span>

                        </button>
                    </Link>
                )}

                {/* Profile */}
                <Link to="/profile">
                        <CircleUserRound className="w-7 h-7" />
                </Link>

            </div>

        </header>
    );
}