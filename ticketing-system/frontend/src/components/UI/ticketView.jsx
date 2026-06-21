import { useContext, useState } from "react";
import TicketCard from "./ticketCard";
import FilterPopup from "./filter";
import { Search, Filter, Ticket, X } from "lucide-react";
import { MyContext } from "../../App";

export default function TicketView({ tickets, setTickets }) {
    const [profile] = useContext(MyContext);
    const [search, setSearch] = useState(false);
    const [searchText, setSearchText] = useState("");
    const [openFilter, setOpenFilter] = useState(false);
    const [filters, setFilters] = useState({
        category: [],
        priority: [],
        status: []
    });

    const filteredTickets = tickets.filter((ticket) => {
        if (filters.category.length === 0 && filters.priority.length === 0 && filters.status.length === 0) {
            return ticket;
        }
        const validTkt = (filters.category.length !== 0 ? filters.category.includes(ticket.category) : true) &&
            (filters.priority.length !== 0 ? filters.priority.includes(ticket.priority) : true) &&
            (filters.status.length !== 0 ? filters.status.includes(ticket.status) : true)
        return validTkt;
    })


    const SearchedTkt = filteredTickets.filter((ticket) =>
        Object.values(ticket).some((value) =>
            value?.toString().toLowerCase().includes(searchText.toLowerCase())
        )
    );


    return (
        <main className="w-full flex-1 bg-white border border-slate-200 rounded-xl md:rounded-2xl shadow-sm overflow-hidden flex flex-col">

            <section className="sticky top-0 z-10 bg-white border-b border-slate-200 px-4 py-4 md:px-6 min-h-18.25 flex items-center">
                <div className="w-full flex items-center justify-between gap-4 relative">

                    <div className={`transition-all duration-200 shrink-0 ${search
                        ? "opacity-0 pointer-events-none -translate-x-2.5 sm:opacity-100 sm:pointer-events-auto sm:translate-x-0"
                        : "opacity-100 translate-x-0"
                        }`}>
                        <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-slate-800 tracking-tight">
                            {profile === "user" ? "My Tickets" : "All Tickets"}
                        </h1>
                        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                            {SearchedTkt.length === tickets.length
                                ? `${tickets.length} available`
                                : `${SearchedTkt.length} found of ${tickets.length}`}
                        </p>
                    </div>

                    <div className={`flex items-center gap-2 transition-all duration-300 ${search
                        ? "absolute inset-y-0 left-0 right-0 bg-white sm:relative sm:bg-transparent sm:w-auto"
                        : "flex-1 justify-end sm:flex-initial"
                        }`}>

                        <div className={`flex items-center overflow-hidden border bg-slate-50 rounded-xl transition-all duration-300 ${search
                            ? "w-full sm:w-60 md:w-72 shadow-inner border-slate-300 bg-white"
                            : "w-10 border-slate-200 ml-auto sm:ml-0"
                            }`}>
                            <button
                                onClick={() => {
                                    setSearch(!search);
                                    if (search) setSearchText(""); // Safe wipe lookup clear
                                }}
                                className="size-10 flex items-center justify-center text-slate-500 hover:text-slate-700 hover:bg-slate-100/80 transition shrink-0"
                            >
                                {search ? <X className="size-4.5 text-slate-400 hover:text-slate-600" /> : <Search className="size-4.5" />}
                            </button>

                            <input
                                type="text"
                                placeholder="Search tickets..."
                                value={searchText}
                                onChange={(e) => setSearchText(e.target.value)}
                                className={`bg-transparent outline-none text-sm text-slate-700 placeholder:text-slate-400 w-full transition-opacity duration-200 ${search ? "opacity-100 px-2" : "opacity-0 w-0"
                                    }`}
                            />
                        </div>

                        <button
                            className={`size-10 flex items-center justify-center border rounded-xl transition shrink-0 ${openFilter
                                ? "border-slate-400 bg-slate-100 text-slate-800"
                                : "border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100"
                                }`}
                            onClick={() => setOpenFilter(true)}
                        >
                            <Filter className="size-4.5" />
                        </button>

                    </div>
                </div>
            </section>

            <section className="flex-1 overflow-y-auto bg-slate-50/50 p-4 md:p-6 scrollbar-thin">

                {SearchedTkt.length === 0 ? (

                    <div className="w-full py-16 sm:py-24 border-2 border-dashed border-slate-200 rounded-2xl flex items-center justify-center bg-white shadow-sm max-w-5xl mx-auto">
                        <div className="text-center max-w-sm px-4">
                            <div className="size-16 mx-auto rounded-2xl bg-slate-50 flex items-center justify-center border border-slate-100 text-slate-400">
                                <Ticket className="size-8" />
                            </div>
                            <h2 className="text-base sm:text-lg font-semibold text-slate-700 mt-4">
                                No Tickets Found
                            </h2>
                            <p className="text-xs sm:text-sm text-slate-400 mt-1.5 leading-relaxed">
                                {searchText
                                    ? "We couldn't find any tickets matching your search parameters."
                                    : "Your submitted dynamic tickets will populate safely right here."}
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col gap-3 max-w-5xl mx-auto">
                        {SearchedTkt.map((data, key) => (
                            <TicketCard
                                key={key}
                                data={data}
                            />
                        ))}
                    </div>
                )}

            </section>

            {openFilter && (
                <FilterPopup
                    setOpenFilter={setOpenFilter}
                    filters={filters}
                    setFilters={setFilters}
                />
            )}

        </main>
    );
}