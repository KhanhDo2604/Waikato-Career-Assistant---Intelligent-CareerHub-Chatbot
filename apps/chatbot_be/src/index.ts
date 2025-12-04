import express from "express";
import cors from "cors";
import http from "http";
import dotenv from "dotenv";

import chatbotRoute from "./routes/chatbot.route.js";
import dashboardRoute from "./routes/dashboard.route.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5173;

// Define allowed origins for CORS
const allowedOrigins: string[] = [
  process.env.CLIENT_URL || "",
  "http://localhost:5173",
];

const corsOptions = {
  origin: function (
    origin: string | undefined,
    callback: (err: Error | null, allow?: boolean) => void
  ) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true,
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

app.use(express.json());

app.use("/api/chatbot", chatbotRoute);
app.use("/api/dashboard", dashboardRoute);

const server = http.createServer(app);

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
