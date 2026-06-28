const express = require("express");
const { connectdb, getdb } = require("./utils/database");
const authRouter = require("./routes/authRoutes");
const ticketRouter = require("./routes/ticketRoutes");
const msgRouter = require("./routes/msgRoutes");
const adminRouter = require("./routes/adminRoutes");
const seedData = require("./seed/seedData");
require("dotenv").config({ quiet: true});

const cors = require('cors');
const app = express();

const corsOptions = {
    origin: process.env.CLIENT_ORIGIN,
    credentials: true,
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));

app.use(express.json());

app.use("/api/auth", authRouter);
app.use("/api", ticketRouter);
app.use("/api/tickets/", msgRouter);
app.use("/api/admin", adminRouter);

async function startServer(MONGO_URI, PORT) {
    try {
        await connectdb(MONGO_URI);
        app.listen(PORT, async () => {
            console.log(`Server Running on PORT ${PORT}`);

            try {
                console.log("Starting data seeding...");
                await seedData.seedUser();
                await seedData.seedTicket();
                console.log("Seeding completed successfully!");
            } catch (seedError) {
                console.error("Error during data seeding:", seedError);
            }

        });
    } catch (error) {
        console.log(error);
    }
}

startServer(process.env.MONGO_URI, process.env.PORT);
