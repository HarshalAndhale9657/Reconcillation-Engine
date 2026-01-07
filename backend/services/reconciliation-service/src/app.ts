import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { AppError, errorHandler } from "@backend/common";
import { NODE_ENV } from "./config/constants";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());


// Error handling middleware (must be last)
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    errorHandler(err, req, res, next, NODE_ENV);
});

export default app;