import { Send } from "lucide-react";
import { useContext, useState, useEffect, useRef } from "react";
import { MyContext } from "../../App";

export default function ChatSec({ targetTkt, setTargetTkt, id }) {
    const [profile] = useContext(MyContext);
    const [myMsg, setMyMsg] = useState('');
    const chatEndRef = useRef(null);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [targetTkt?.messages]);

    const handleSend = () => {
        if (myMsg.trim() === "") return;

        const currentTickets = JSON.parse(localStorage.getItem("tickets")) || [];
        const targetIndex = currentTickets.findIndex((tkt) => tkt.id === id);

        if (targetIndex !== -1) {
            currentTickets[targetIndex].messages = [
                ...(targetTkt.messages || []),
                {
                    id: crypto.randomUUID(),
                    sender: `${profile}`,
                    timestamp: `${new Date().toLocaleTimeString('en-GB', {
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: false
                    })}`,
                    text: myMsg.trim()
                }
            ];
        }

        localStorage.setItem("tickets", JSON.stringify(currentTickets));
        setTargetTkt(currentTickets[targetIndex]);
        setMyMsg('');
    };

    return (
        <section className="w-full h-150 border border-slate-200 rounded-2xl overflow-hidden bg-white flex flex-col shadow-sm">
            {/* Header */}
            <header className="w-full px-5 py-4 bg-[#EEF4FF] text-[#1E3A8A] border-b border-[#D7E5FF] shrink-0">
                <div className="flex flex-col">
                    <h2 className="text-sm font-bold uppercase tracking-wider">
                        {targetTkt.messages.length === 0 ? "Start Conversation" : "Support Conversation"}
                    </h2>
                    <p className="text-xs text-[#5B76B6] mt-0.5">
                        Communicate with the support team in real time
                    </p>
                </div>
            </header>

            {/* Chat View */}
            <div className="flex-1 overflow-y-auto p-4 bg-[#F8FAFC] flex flex-col gap-4 scrollbar-thin">
                {targetTkt.messages.length === 0 ? (
                    <div className="m-auto flex flex-col items-center gap-2 text-center">
                        <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-xl">
                            💬
                        </div>
                        <div>
                            <h3 className="text-xs font-semibold text-zinc-700">No Messages Yet</h3>
                            <p className="text-[11px] text-zinc-400 mt-0.5 max-w-45">
                                Start the conversation with your support team
                            </p>
                        </div>
                    </div>
                ) : (
                    targetTkt.messages.map((msgobj, key) => {
                        const isMyMsg = msgobj.sender === profile;
                        return (
                            <div
                                className={`flex flex-col gap-1 max-w-[85%] ${isMyMsg ? "items-end self-end" : "items-start self-start"}`}
                                key={key}
                            >
                                {/* Message bubble */}
                                <div
                                    className={
                                        isMyMsg
                                            ? "px-3.5 py-2.5 rounded-2xl rounded-br-xs bg-linear-to-br from-[#2563EB] to-[#1D4ED8] text-white text-xs leading-relaxed wrap-break-word shadow-xs"
                                            : "px-3.5 py-2.5 rounded-2xl rounded-bl-xs bg-[#ECFEFF] border border-[#A5F3FC] text-[#155E75] text-xs leading-relaxed wrap-break-word shadow-xs"
                                    }
                                >
                                    <p className="whitespace-pre-wrap">{msgobj.text}</p>
                                </div>

                                <div className={`flex items-center gap-1.5 px-1 mt-0.5 text-[10px] text-zinc-400 ${isMyMsg ? "flex-row-reverse" : "flex-row"}`}>
                                    <div className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-[9px] ${isMyMsg ? "bg-blue-100 text-[#0C447C]" : "bg-[#EEEDFE] text-[#3C3489]"}`}>
                                        {msgobj.sender === "user" ? "U" : "A"}
                                    </div>
                                    <span className="font-semibold text-zinc-600 capitalize">{msgobj.sender}</span>
                                    <span>•</span>
                                    <span>{msgobj.timestamp}</span>
                                </div>
                            </div>
                        );
                    })
                )}
                <div ref={chatEndRef} />
            </div>

            <div className="w-full p-3 border-t border-zinc-200 bg-white flex items-center gap-2 shrink-0">
                <input
                    type="text"
                    placeholder="Type your message..."
                    value={myMsg}
                    className="flex-1 border border-zinc-300 rounded-xl px-3 py-2.5 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition text-xs text-slate-700"
                    onChange={(e) => setMyMsg(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                />
                <button
                    className="bg-linear-to-r from-[#2563EB] to-[#1D4ED8] hover:opacity-95 text-white p-2.5 rounded-xl font-medium shadow-xs transition active:scale-[0.98] disabled:opacity-40 disabled:pointer-events-none"
                    disabled={!myMsg.trim()}
                    onClick={handleSend}
                >
                    <Send size={15} />
                </button>
            </div>
        </section>
    );
}