import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
  process.exit(1);
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
});

const bootstrapApp = async () => {
  try {
    const app = express();
    app.use(cors());
    app.use(express.json());

    app.get("/", (_req, res) => {
      res.send("Backend up and running");
    });

    const PORT = process.env.PORT || 4000;

    app.listen(PORT, () => {
      console.log(`Backend available on port: ${PORT}`);
    });
  } catch (error) {
    console.error("Startup error:", error);
    process.exit(1);
  }
};

bootstrapApp().then();
