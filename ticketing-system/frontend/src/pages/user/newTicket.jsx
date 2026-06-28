import { ArrowLeft } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import fetchApi from "../../lib/api";

export default function NewTicket() {

    const navigate = useNavigate();

    async function handleSubmit(event) {

        event.preventDefault();

        if (validateForm()) {
            const formData = new FormData(event.currentTarget);

            const formValues = Object.fromEntries(formData.entries());

            const option = {

                method: "POST",
                body: JSON.stringify(formValues)
            }

            try {
                const data = await fetchApi('/api/tickets', option);

                if (data.success === true) {
                    setTitle(""); setCategory(""); setPriority(""); setDescription("");
                } else {
                    throw data;
                }

                navigate("/dashboard");

                // success Toast
                (() => toast.success("Ticket Created Successfully."))();

            } catch (error) {
                console.error(error);
            }

        } else {
            handleTitleError(title); handleCategoryError(category); handlePriorityError(priority); handleDescriptionError(description);

            // Error Toast
            (() => toast.error("Fill The Inputs"))();
        }
    }

    function handleCancel() {
        setTitle(""); setCategory(""); setPriority(""); setDescription("");
        setTitleError(""); setCategoryError(""); setPriorityError(""); setDescriptionError("");
    }

    function validateForm() {
        return (title.trim().length >= 5 && category !== "" && priority !== "" && description.trim().length >= 5);
    }

    function handleTitleError(title) {
        const trimmedTitle = title.trim();

        if (trimmedTitle.length === 0) {
            setTitleError("Fill the title");
            return;
        }

        if (trimmedTitle.length < 5) {
            setTitleError("Minimum 5 characters required");
            return;
        }

        setTitleError("");
    }

    function handleCategoryError(category) {
        if (category === "") {
            setCategoryError("Select a Category");
        } else {
            setCategoryError("");
        }
    }

    function handlePriorityError(priority) {
        if (priority === "") {
            setPriorityError("Select a Priority");
        } else {
            setPriorityError("");
        }
    }

    function handleDescriptionError(description) {
        const trimmedDescription = description.trim();

        if (trimmedDescription.length === 0) {
            setDescriptionError("Fill the Description");
            return;
        }

        if (trimmedDescription.length < 20) {
            setDescriptionError("Minimum 20 characters required");
            return;
        }

        setDescriptionError("");
    }

    const [title, setTitle] = useState("");
    const [category, setCategory] = useState("");
    const [priority, setPriority] = useState("");
    const [description, setDescription] = useState("");

    const [titleError, setTitleError] = useState("");
    const [categoryError, setCategoryError] = useState("");
    const [priorityError, setPriorityError] = useState("");
    const [descriptionError, setDescriptionError] = useState("");

    return (
        <>
            <main className="w-full min-h-screen bg-slate-50 flex justify-center items-center p-4 sm:p-6 md:p-8">
                <form
                    className="w-full max-w-2xl bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden"
                    onSubmit={(e) => handleSubmit(e)}
                >

                    {/* heading */}
                    <section className="border-b border-slate-100 px-6 py-5 flex flex-col justify-center items-start gap-3">
                        <div className="text-slate-600 transition-colors hover:text-slate-900">
                            <Link to={"/dashboard"} className="flex justify-start items-center gap-2" >
                                <ArrowLeft size={16} />
                                <p className="text-xs font-medium">Back to Dashboard</p>
                            </Link>
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
                                Create New Ticket
                            </h1>
                            <p className="text-xs text-slate-400 mt-0.5">
                                Fill in the details below to raise a support request.
                            </p>
                        </div>
                    </section>

                    {/* content */}
                    <section className="p-6 space-y-5">

                        {/* ticket title */}
                        <div>
                            <label
                                htmlFor="title"
                                className="flex items-center gap-1 text-xs font-semibold text-slate-700 uppercase tracking-wide mb-1.5"
                            >
                                <span>Ticket Title</span>
                                <span className="text-rose-500">*</span>
                            </label>

                            <input
                                type="text"
                                id="title"
                                name="title"
                                value={title}
                                placeholder="Brief summary of the issue"
                                className={`w-full rounded-xl border px-3.5 py-2.5 text-xs font-medium bg-white text-slate-800 outline-none transition-all duration-150 focus:ring-4 focus:ring-blue-50
                                    ${titleError ? "border-rose-400 focus:border-rose-500 focus:ring-rose-50" : "border-slate-300 focus:border-blue-500"}`}
                                onChange={(e) => setTitle(e.target.value)}
                                onBlur={(e) => handleTitleError(e.target.value)}
                                onFocus={() => setTitleError("")}
                            />

                            {titleError && <p className="text-[11px] font-medium text-rose-500 mt-1">{titleError}</p>}
                        </div>

                        {/* category + priority */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                            {/* category */}
                            <div>
                                <label
                                    htmlFor="category"
                                    className="flex items-center gap-1 text-xs font-semibold text-slate-700 uppercase tracking-wide mb-1.5"
                                >
                                    <span>Category</span>
                                    <span className="text-rose-500">*</span>
                                </label>

                                <select
                                    id="category"
                                    name="category"
                                    value={category}
                                    className={`w-full rounded-xl border px-3.5 py-2.5 text-xs font-medium bg-white text-slate-800 outline-none transition-all duration-150 focus:ring-4 focus:ring-blue-50 appearance-none
                                        ${categoryError ? "border-rose-400 focus:border-rose-500 focus:ring-rose-50" : "border-slate-300 focus:border-blue-500"}`}
                                    onChange={(e) => setCategory(e.target.value)}
                                    onBlur={(e) => handleCategoryError(e.target.value)}
                                    onFocus={() => setCategoryError("")}
                                >
                                    <option value="" disabled hidden>Select Category</option>

                                    <option value="Hardware">Hardware</option>
                                    <option value="Software">Software</option>
                                    <option value="Billing">Billing</option>
                                    <option value="Network">Network</option>
                                    <option value="Other">Other</option>
                                </select>

                                {categoryError && <p className="text-[11px] font-medium text-rose-500 mt-1">{categoryError}</p>}
                            </div>

                            {/* priority */}
                            <div>
                                <label
                                    htmlFor="priority"
                                    className="flex items-center gap-1 text-xs font-semibold text-slate-700 uppercase tracking-wide mb-1.5"
                                >
                                    <span>Priority</span>
                                    <span className="text-rose-500">*</span>
                                </label>

                                <select
                                    id="priority"
                                    name="priority"
                                    value={priority}
                                    className={`w-full rounded-xl border px-3.5 py-2.5 text-xs font-medium bg-white text-slate-800 outline-none transition-all duration-150 focus:ring-4 focus:ring-blue-50 appearance-none
                                        ${priorityError ? "border-rose-400 focus:border-rose-500 focus:ring-rose-50" : "border-slate-300 focus:border-blue-500"}`}
                                    onChange={(e) => setPriority(e.target.value)}
                                    onBlur={(e) => handlePriorityError(e.target.value)}
                                    onFocus={() => setPriorityError("")}
                                >
                                    <option value="" disabled hidden>Select Priority</option>

                                    <option value="Low">Low</option>
                                    <option value="Medium">Medium</option>
                                    <option value="High">High</option>
                                </select>

                                {priorityError && <p className="text-[11px] font-medium text-rose-500 mt-1">{priorityError}</p>}
                            </div>
                        </div>

                        {/* description */}
                        <div>
                            <label
                                htmlFor="description"
                                className="flex items-center gap-1 text-xs font-semibold text-slate-700 uppercase tracking-wide mb-1.5"
                            >
                                <span>Description</span>
                                <span className="text-rose-500">*</span>
                            </label>

                            <textarea
                                id="description"
                                name="description"
                                value={description}
                                rows="5"
                                placeholder="Describe your issue in detail..."
                                className={`w-full rounded-xl border px-3.5 py-2.5 text-xs font-medium bg-white text-slate-800 outline-none resize-none transition-all duration-150 focus:ring-4 focus:ring-blue-50
                                    ${descriptionError ? "border-rose-400 focus:border-rose-500 focus:ring-rose-50" : "border-slate-300 focus:border-blue-500"}`}
                                onChange={(e) => setDescription(e.target.value)}
                                onBlur={(e) => handleDescriptionError(e.target.value)}
                                onFocus={() => setDescriptionError("")}
                            />

                            {descriptionError && <p className="text-[11px] font-medium text-rose-500 mt-1">{descriptionError}</p>}
                        </div>

                    </section>

                    {/* footer */}
                    <section className="border-t border-slate-100 px-6 py-4 flex justify-end items-center gap-3 bg-slate-50/50">

                        <button
                            type="button"
                            className="px-4 py-2 text-xs font-bold rounded-xl border border-slate-200 text-slate-600 bg-white hover:bg-slate-50 hover:text-slate-800 transition duration-150 active:scale-95"
                            onClick={() => { handleCancel(); navigate("/dashboard") }}
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            className="px-4 py-2 text-xs font-bold rounded-xl bg-blue-600 text-white hover:bg-blue-700 shadow-xs transition duration-150 active:scale-95"
                        //  disabled={!validateForm()}
                        >
                            Submit Ticket
                        </button>

                    </section>

                </form>

            </main >
        </>
    )
}