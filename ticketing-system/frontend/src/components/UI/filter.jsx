import { X } from "lucide-react";
import { useState } from "react";

export default function FilterPopup({ setOpenFilter, filters, setFilters }) {

    const selectedBtnClass = "bg-slate-900 text-white border border-slate-900 shadow-xs";
    const normalBtnClass = "bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100 hover:text-slate-900";

    const categories = ["Hardware", "Software", "Billing", "Network", "Others"];
    const priorities = ["High", "Medium", "Low"];
    const statuses = ["Open", "Resolved", "InProgress"];

    const [currentFilter, setCurrentFilter] = useState(() => filters);    

    return (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/40 backdrop-blur-xs p-0 md:p-4 md:items-center transition-opacity duration-200">

            {/* popup  */}
            <section className="w-full max-w-lg bg-white rounded-t-2xl md:rounded-2xl shadow-xl overflow-hidden transform transition-all duration-300 animate-in fade-in slide-in-from-bottom-8 md:max-h-[90vh] flex flex-col">

                {/* header */}
                <header className="flex items-center justify-between border-b border-slate-100 px-5 py-4 shrink-0">
                    <div>
                        <h2 className="text-base font-bold text-slate-950 tracking-tight">Filters</h2>
                        <p className="text-xs text-slate-400 mt-0.5">
                            Filter tickets quickly
                        </p>
                    </div>

                    <button
                        className="grid h-8 w-8 place-items-center rounded-xl border border-slate-200 text-slate-500 hover:text-slate-800 bg-slate-50 hover:bg-slate-100 transition-all active:scale-95"
                        onClick={() => 
                            {
                                setOpenFilter(false);
                                setCurrentFilter(filters);
                            }}
                    >
                        <X size={16} />
                    </button>
                </header>

                <div className="overflow-y-auto px-5 py-5 space-y-6 scrollbar-thin max-h-[60vh] md:max-h-[55vh]">

                    {/* category */}
                    <div>
                        <h3 className="mb-2.5 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                            Category
                        </h3>

                        <div className="flex flex-wrap gap-2">
                            {categories.map((item) => {

                                const isSelected = currentFilter.category.includes(item);

                                return (
                                    <button
                                        key={item}
                                        className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition-all duration-150 active:scale-95 ${isSelected ? selectedBtnClass : normalBtnClass}`}
                                        onClick={() => {
                                            if (isSelected) {
                                                const unselect = currentFilter.category.filter(filter => filter !== item);
                                                setCurrentFilter({ ...currentFilter, category: [...unselect] });
                                            }
                                            else
                                                setCurrentFilter({ ...currentFilter, category: [...currentFilter.category, item] })
                                        }}
                                    >
                                        {item}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* priority */}
                    <div>
                        <h3 className="mb-2.5 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                            Priority
                        </h3>

                        <div className="flex flex-wrap gap-2">
                            {priorities.map((item) => {

                                const isSelected = currentFilter.priority.includes(item);

                                return (
                                    <button
                                        key={item}
                                        className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition-all duration-150 active:scale-95 ${isSelected ? selectedBtnClass : normalBtnClass}`}
                                        onClick={() => {
                                            if (isSelected) {
                                                const unselect = currentFilter.priority.filter(filter => filter !== item);
                                                setCurrentFilter({ ...currentFilter, priority: [...unselect] });
                                            }
                                            else
                                                setCurrentFilter({ ...currentFilter, priority: [...currentFilter.priority, item] })
                                        }}
                                    >
                                        {item}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* status */}
                    <div>
                        <h3 className="mb-2.5 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                            Status
                        </h3>

                        <div className="flex flex-wrap gap-2">
                            {statuses.map((item) => {

                                const isSelected = currentFilter.status.includes(item);

                                return (
                                    <button
                                        key={item}
                                        className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition-all duration-150 active:scale-95 ${isSelected ? selectedBtnClass : normalBtnClass}`}
                                        onClick={() => {
                                            if (isSelected) {
                                                const unselect = currentFilter.status.filter(filter => filter !== item);
                                                setCurrentFilter({ ...currentFilter, status: [...unselect] });
                                            }
                                            else
                                                setCurrentFilter({ ...currentFilter, status: [...currentFilter.status, item] })
                                        }}
                                    >
                                        {item}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* footer */}
                <footer className="flex gap-3 border-t border-slate-100 p-4 bg-slate-50/50 shrink-0">
                    <button
                        className="flex-1 bg-white rounded-xl border border-slate-200 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-50 hover:text-slate-800 transition duration-150 active:scale-95"
                        onClick={() => {
                            setCurrentFilter({ category: [], priority: [], status: [] })
                            setFilters({ category: [], priority: [], status: [] })
                        }}
                    >
                        Reset
                    </button>

                    <button
                        className="flex-1 rounded-xl bg-blue-600 py-2.5 text-xs font-bold text-white hover:bg-blue-700 shadow-xs transition duration-150 active:scale-95"
                        onClick={() => {
                            // setCurrentFilter({ category: [], priority: [], status: [] })
                            setFilters(currentFilter);
                            setOpenFilter(false);
                        }}
                    >
                        Apply Filters
                    </button>
                </footer>
            </section >
        </div >
    );
}