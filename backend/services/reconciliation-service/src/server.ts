import { RECONCILIATION_SERVICE_PORT } from "./config/constants";
import app from "./app";        



app.listen(RECONCILIATION_SERVICE_PORT, () => {
    console.log(`Reconciliation service is running on port ${RECONCILIATION_SERVICE_PORT}`);
});
