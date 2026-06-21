import { Link } from "react-router-dom";
import { AlertCircle, ArrowLeft } from "lucide-react";
import { useContext } from "react";
import { MyContext } from "../../App";

export default function NotFound() {
    const [profile] = useContext(MyContext);

    return (
        <main className="w-full min-h-screen bg-slate-50 flex justify-center items-center p-4 sm:p-6 md:p-8">
            <div className="w-full max-w-md bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 text-center flex flex-col items-center">
                
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-50 text-rose-600 mb-5">
                    <AlertCircle size={28} />
                </div>

                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                    Page Not Found
                </h1>
                
                <p className="text-xs text-slate-400 mt-2 mb-6 leading-relaxed max-w-xs mx-auto">
                    The destination pathway you are searching for doesn't exist or has been moved to an alternative indexing array.
                </p>

                <Link
                    to={`/${profile || "user"}/dashboard`}
                    className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-xl bg-blue-600 text-white hover:bg-blue-700 shadow-xs transition duration-150 active:scale-95 w-full justify-center"
                >
                    <ArrowLeft size={14} />
                    Return to Dashboard
                </Link>
                
            </div>
        </main>
    );
}