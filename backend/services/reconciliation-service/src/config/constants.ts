import dotenv from "dotenv";

dotenv.config();

export const RECONCILIATION_SERVICE_PORT = process.env.RECONCILIATION_SERVICE_PORT || 3001;