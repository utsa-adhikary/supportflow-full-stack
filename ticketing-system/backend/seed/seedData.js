const { getdb } = require("../utils/database");
const bcrypt = require("bcrypt");

async function seedUser() {
    try {
        const userCount = await getdb().collection("users").countDocuments();

        if (userCount === 0) {
            console.log("Users collection is empty. Seeding initial users...");
            const documents = [
                { name: 'Admin User', email: 'admin@support.com', password: 'admin123', role: 'admin' },
                { name: 'Alice Johnson', email: 'alice@example.com', password: 'password123', role: 'customer' },
                { name: 'Bob Smith', email: 'bob@example.com', password: 'password123', role: 'customer' }
            ];

            for (const entry of documents) {
                const passwordHash = await bcrypt.hash(entry.password, 10);
                entry.passwordHash = passwordHash;
                entry.createdAt = new Date();
                delete entry.password;
            }

            await getdb().collection("users").insertMany(documents);
        } else {
            console.log("Users already exist. Skipping user seeding.");
        }

    } catch (error) {
        console.error("Database error during seedUser execution:", error.message);

        throw new Error(`seedUser failed: ${error.message}`);
    }
}

async function seedTicket() {
    try {
        const ticketCount = await getdb().collection("tickets").countDocuments();

        if (ticketCount === 0) {
            console.log("Tickets collection is empty. Seeding initial tickets...");

            const tickets = [
                {
                    title: "Blue screen of death on startup after OS update",
                    category: "Software",
                    description: "User reports a critical system crash (BSOD) immediately after the latest Windows patch was installed. Machine loops on reboot."
                },
                {
                    title: "Office printer jammed and displaying Error 501",
                    category: "Hardware",
                    description: "The main copy room printer is offline. A paper jam was cleared, but the hardware error code 501 persists on the LED screen."
                },
                {
                    title: "Wi-Fi keeps dropping in the conference room",
                    category: "Network",
                    description: "Users report that laptops constantly disconnect from the 'Corporate-Guest' network during meetings in Conference Room B."
                },
                {
                    title: "Overcharged on the monthly SaaS subscription",
                    category: "Billing",
                    description: "The accounts department noticed a discrepancy where we were billed for 50 seats instead of our actual 42 active licenses."
                },
                {
                    title: "Request for a new ergonomic office chair",
                    category: "Others",
                    description: "Employee is requesting an ergonomic assessment and a replacement chair due to recurring lower back pain."
                },
                {
                    title: "VPN connection times out when working from home",
                    category: "Network",
                    description: "Remote employee is unable to establish a secure tunnel. Connection handshakes for 30 seconds before throwing a timeout error."
                },
                {
                    title: "Excel crashes whenever large macros are executed",
                    category: "Software",
                    description: "The finance team is unable to run the Q3 forecasting spreadsheets because Excel freezes and closes without saving."
                },
                {
                    title: "External monitor flickering when connected via HDMI",
                    category: "Hardware",
                    description: "User's secondary display blinks to black every few minutes. Replaced the HDMI cable but the issue remains unresolved."
                },
                {
                    title: "Invoice #1042 paid but account still shows outstanding balance",
                    category: "Billing",
                    description: "Client sent a bank wire confirmation for invoice #1042 last Tuesday, but our automated portal is still sending them late notices."
                },
                {
                    title: "Reset password for company intranet portal",
                    category: "Software",
                    description: "User has been locked out of their internal profile after entering the wrong password three times. Needs an account unlock and reset."
                },
                {
                    title: "Laptop battery drains completely within 45 minutes",
                    category: "Hardware",
                    description: "Company-issued MacBook Pro cannot hold a charge. Battery health report shows maximum capacity is down to 40%."
                },
                {
                    title: "Unable to access the shared network drive (Z:)",
                    category: "Network",
                    description: "The marketing team cannot map the Z:\ drive this morning. They are getting a 'Network path not found' error."
                },
                {
                    title: "Update billing address and primary credit card on file",
                    category: "Billing",
                    description: "Need to update our corporate credit card details before the upcoming auto-renewal deadline on the 20th."
                },
                {
                    title: "Schedule disposal for outdated electronic waste",
                    category: "Others",
                    description: "The IT storage closet is overflowing with decommissioned CRT monitors and old keyboards. Need a certified e-waste pickup."
                },
                {
                    title: "Antivirus software blocking legitimate development tools",
                    category: "Software",
                    description: "The local endpoint protection has flagged local Docker containers as malicious, halting the development team's workflow."
                },
                {
                    title: "IP address conflict detected on the local subnet",
                    category: "Network",
                    description: "An OS alert popped up on multiple workstations stating that another device on the network is using the same IP address."
                },
                {
                    title: "Conference room projector bulb is burned out",
                    category: "Hardware",
                    description: "The ceiling projector powers on and the fans spin up, but no light or image is projected onto the screen."
                }
            ];

            const ticketPerDay = [];

            let available = tickets.length;
            let minReq = 14;
            for (let index = 0; index < 7; index++) {
                minReq -= 2;
                if (index === 6) {
                    ticketPerDay.push(available);
                } else {
                    let value = Math.floor(Math.random() * (available - minReq - 2 + 1)) + 1;
                    ticketPerDay.push(value);
                    available -= value;
                }
            }

            const statusList = ["Open", "InProgress", "Resolved"];
            const priority = ["High", "Medium", "Low"];

            const createdAt = [];

            for (let index = 6; index >= 0; index--) {
                let targetDate = new Date();
                targetDate.setDate(targetDate.getDate() - index);



                for (let i = 0; i < ticketPerDay[6 - index]; i++) {
                    const milisec = Math.floor(Math.random() * (24 * 60 * 60 * 1000));
                    targetDate.setHours(0, 0, 0, 0);
                    createdAt.push(
                        new Date(targetDate.getTime() + milisec)
                    );
                }

            }

            createdAt.sort((a, b) => a - b);

            const createdBy = await getdb().collection("users").find({ role: "customer" }, { projection: { _id: 1 } }).toArray();

            const tktArray = [];

            for (let index = 0; index < tickets.length; index++) {

                const tktObj = {};
                tktObj.ticketNumber = `TKT-${String(index + 1).padStart(3, "0")}`;
                tktObj.title = tickets[index].title;
                tktObj.category = tickets[index].category;
                tktObj.priority = priority[Math.floor(Math.random() * 3)];
                tktObj.description = tickets[index].description;
                tktObj.status = statusList[Math.floor(Math.random() * 3)];
                tktObj.createdBy = createdBy[Math.floor(Math.random() * createdBy.length)]._id;
                tktObj.createdAt = createdAt[index];
                tktObj.resolvedAt = null;
                tktObj.updatedAt = createdAt[index];

                if (tktObj.status === "Open") {

                    const start = new Date(tktObj.createdAt).getTime();
                    const end = new Date().getTime();

                    tktObj.updatedAt = new Date(start + (Math.random() * (end - start)));
                } else if (tktObj.status === "Resolved") {

                    const start = new Date(tktObj.createdAt).getTime();
                    const end = new Date().getTime();

                    tktObj.resolvedAt = new Date(start + (Math.random() * (end - start)));
                    tktObj.updatedAt = tktObj.resolvedAt;

                }

                tktArray.push(tktObj);
            }

            await getdb().collection("tickets").insertMany(tktArray);

        } else {
            console.log("Tickets already exist. Skipping ticket seeding.");
        }

    } catch (error) {
        console.error("Database error during seedTicket execution:", error.message);

        throw new Error(`seedTicket failed: ${error.message}`);
    }
}

module.exports = { seedUser, seedTicket }