import { Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { deleteToast } from "./Toasts";
import fetchApi from "../../lib/api";

export default function DeleteTicket({ id, setTargetTkt, setDeleteTkt }) {

    const navigate = useNavigate();

    async function handleDelete() {

        try {
            const options = {
                method: "DELETE"
            }

            const data = await fetchApi(`/api/tickets/${id}`, options);

            if (data.success === true) {
                setTargetTkt({})
                navigate("/dashboard");
            } else {
                throw data;
            }

            deleteToast("Successfully Deleted");

        } catch (error) {
            console.error(error);
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4 backdrop-blur-sm">

            <div className="w-full max-w-md rounded-3xl border border-zinc-200 bg-white p-6 shadow-2xl">

                {/* Header */}
                <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">

                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 border border-red-200">
                            <Trash2 className="h-6 w-6 text-red-600" />
                        </div>

                        <div>
                            <h2 className="text-lg font-semibold text-zinc-900">
                                Delete Ticket
                            </h2>
                            <p className="text-sm text-zinc-500">
                                This action cannot be undone.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="mt-6 rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
                    <p className="text-sm leading-relaxed text-zinc-600">
                        Are you sure you want to permanently delete this ticket?
                    </p>
                </div>

                <div className="mt-6 flex items-center justify-end gap-3">

                    <button
                        onClick={() => setDeleteTkt(false)}
                        className="rounded-xl border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-100"
                    >
                        Cancel
                    </button>

                    <button
                        onClick={() => handleDelete()}
                        className="rounded-xl bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700 active:scale-95"
                    >
                        Delete Ticket
                    </button>
                </div>
            </div>
        </div>
    );
}