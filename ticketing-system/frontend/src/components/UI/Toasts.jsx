import toast from "react-hot-toast";

export function deleteToast(message) {
    toast(message, {
        icon: "🗑️",
        style: {
            background: "#FFF7ED",
            color: "#9A3412",
            border: "1px solid #FDBA74",
        },
    });
}

export function profileSwitchToast(message, type) {
    const styles = {
        admin: {
            icon: "🛡️",
            background: "#EFF6FF",
            color: "#1D4ED8",
            border: "1px solid #93C5FD",
        },

        user: {
            icon: "👤",
            background: "#F5F3FF",
            color: "#6D28D9",
            border: "1px solid #C4B5FD",
        },
    };

    const current = styles[type];

    toast(message, {
        icon: current.icon,
        style: {
            background: current.background,
            color: current.color,
            border: current.border,
        },
    });
}