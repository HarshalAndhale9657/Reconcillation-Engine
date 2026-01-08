import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { init } from '@backend/common'

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

(async () => {
    await init();
})();
export default app;