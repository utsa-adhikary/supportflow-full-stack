import { NavLink, useNavigate } from "react-router-dom";
import { LogOut, LayoutDashboard, Ticket, ChartSpline, Settings, PanelLeftClose, Plus } from "lucide-react";
import { useContext } from "react";
import { MyContext } from "../../App";

export default function Sidebar({ showSidebar, setShowSidebar }) {

    const [profile] = useContext(MyContext);
    const navigate = useNavigate();

    async function handleLogOut() {
        try {
            const response = await fetch(`http://localhost:8000/api/auth/logOut`, {
                credentials: "include"
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();

            console.log(data);

            if (!data.success) {
                console.log("failed");

                return;
            }

            navigate("/auth");

            // success Toast
            (() => toast.success(`Suvvessfully loggedOut`))();

            return data;

        } catch (error) {
            console.error(error.message);
        }
    }

    return (
        <aside className={`fixed top-0 left-0 z-50 w-screen h-screen bg-black/20 backdrop-blur-[2px] md:w-fit md:bg-white md:backdrop-blur-none transition-all duration-300 ${showSidebar ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"} md:opacity-100 md:pointer-events-auto`}>

            <div className={`h-screen bg-white border-r border-slate-200 shadow-2xl md:shadow-none p-3 sm:p-4 lg:p-5 flex flex-col gap-2 transition-transform duration-300 w-[80vw] max-w-80 sm:w-70 md:w-65 lg:w-70 xl:w-[320px] ${showSidebar ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}>

                {/* Header */}
                <div className="flex justify-between items-start gap-2">

                    <div className="flex-1 px-1 sm:px-2 pt-1 pb-3 sm:pb-4 border-b border-slate-100">

                        <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-slate-800">
                            Workspace
                        </h2>

                        <p className="text-xs sm:text-sm text-slate-500 mt-1">
                            Manage your support system
                        </p>

                    </div>

                    <button
                        className="md:hidden w-8 sm:w-10 aspect-square border border-slate-300 bg-white hover:bg-slate-100 transition-all duration-200 flex justify-center items-center rounded-xl shadow-sm"
                        onClick={() => setShowSidebar(!showSidebar)}
                    >
                        <PanelLeftClose className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>

                </div>

                {/* Create Ticket */}
                {profile === "user" && (
                    <NavLink to="/tickets/new">
                        <button className="w-full bg-blue-500 hover:bg-blue-600 text-white px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl flex justify-center items-center gap-2 transition-all duration-200 shadow-sm">

                            <Plus className="w-4 h-4 sm:w-5 sm:h-5" />

                            <span className="text-sm sm:text-base font-medium">
                                Create Ticket
                            </span>

                        </button>
                    </NavLink>
                )}

                {/* Menu */}
                <div className="flex flex-col gap-1 mt-2">

                    <NavLink
                        to={`/${profile}/dashboard`}
                        className={({ isActive }) => `group w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-2xl flex items-center gap-2 sm:gap-3 transition-all duration-200 ${isActive ? "bg-slate-900 text-white shadow-lg shadow-slate-300/40" : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"}`}
                        onClick={() => setShowSidebar(false)}
                    >
                        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center">
                            <LayoutDashboard className="w-4 h-4 sm:w-5 sm:h-5" />
                        </div>

                        <p className="text-sm sm:text-[15px] lg:text-base font-semibold tracking-wide">
                            Dashboard
                        </p>
                    </NavLink>

                    <NavLink
                        to={`/tickets/`}
                        className={({ isActive }) => `group w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-2xl flex items-center gap-2 sm:gap-3 transition-all duration-200 ${isActive ? "bg-slate-900 text-white shadow-lg shadow-slate-300/40" : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"}`}
                        onClick={() => setShowSidebar(false)}
                    >
                        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center">
                            <Ticket className="w-4 h-4 sm:w-5 sm:h-5" />
                        </div>

                        <p className="text-sm sm:text-[15px] lg:text-base font-semibold tracking-wide">
                            Tickets
                        </p>
                    </NavLink>

                    <NavLink
                        to={`/${profile}/Analytics`}
                        className={({ isActive }) => `group w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-2xl flex items-center gap-2 sm:gap-3 transition-all duration-200 ${isActive ? "bg-slate-900 text-white shadow-lg shadow-slate-300/40" : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"}`}
                        onClick={() => setShowSidebar(false)}
                    >
                        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center">
                            <ChartSpline className="w-4 h-4 sm:w-5 sm:h-5" />
                        </div>

                        <p className="text-sm sm:text-[15px] lg:text-base font-semibold tracking-wide">
                            Analytics
                        </p>
                    </NavLink>

                    <NavLink
                        to={`/${profile}/Settings`}
                        className={({ isActive }) => `group w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-2xl flex items-center gap-2 sm:gap-3 transition-all duration-200 ${isActive ? "bg-slate-900 text-white shadow-lg shadow-slate-300/40" : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"}`}
                        onClick={() => setShowSidebar(false)}
                    >
                        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center">
                            <Settings className="w-4 h-4 sm:w-5 sm:h-5" />
                        </div>

                        <p className="text-sm sm:text-[15px] lg:text-base font-semibold tracking-wide">
                            Settings
                        </p>
                    </NavLink>

                </div>

                {/* Logout */}
                <button

                    onClick={() => handleLogOut()}

                    className="w-full mt-auto px-3 sm:px-4 py-2.5 sm:py-3 rounded-2xl flex items-center gap-2 sm:gap-3 bg-red-50 text-red-600 hover:bg-red-100 border border-red-100 transition-all duration-200">

                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-white flex items-center justify-center">
                        <LogOut className="w-4 h-4 sm:w-5 sm:h-5" />
                    </div>

                    <p className="text-sm sm:text-[15px] lg:text-base font-semibold tracking-wide">
                        Log Out
                    </p>

                </button>

            </div>

        </aside>
    );
}