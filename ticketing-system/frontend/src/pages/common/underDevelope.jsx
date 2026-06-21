import { Link } from "react-router-dom";
import { Compass } from "lucide-react";
import { useContext } from "react";
import { MyContext } from "../../App";

export default function UnderProcess() {
    const [profile] = useContext(MyContext);

    return (
        <main className="w-full min-h-screen bg-slate-50 flex justify-center items-center p-4 sm:p-6 md:p-8">
            <div className="w-full max-w-md bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 text-center flex flex-col items-center">
                
                <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 mb-5">
                    <Compass size={28} className="animate-spin [animation-duration:8s]" />
                    <span className="absolute top-1 right-1 flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                    </span>
                </div>

                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                    Pipeline Under Process
                </h1>
                
                <p className="text-xs text-slate-400 mt-2 mb-6 leading-relaxed max-w-xs mx-auto">
                    This sector is an officially registered pathway, but configuration setups are running background verification operations.
                </p>

                <div className="w-full bg-slate-100 h-1 rounded-full overflow-hidden mb-6">
                    <div className="bg-blue-600 h-full w-1/3 rounded-full animate-[loading_1.5s_infinite_ease-in-out]"></div>
                </div>

                <Link
                    to={`/${profile || "user"}/dashboard`}
                    className="inline-flex px-4 py-2.5 text-xs font-bold rounded-xl border border-slate-200 text-slate-600 bg-white hover:bg-slate-50 hover:text-slate-800 transition duration-150 active:scale-95 w-full justify-center"
                >
                    Go Back Home
                </Link>
                
            </div>
        </main>
    );
}