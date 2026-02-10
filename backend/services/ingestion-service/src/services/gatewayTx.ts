import { produceMessage } from "@backend/common";

let gatewayTxInterval: NodeJS.Timeout | null = null;
let count = 0;

export const logGatewayTx = async (): Promise<NodeJS.Timeout> => {
    if (gatewayTxInterval) {
        return gatewayTxInterval; // Already running
    }
    
    gatewayTxInterval = setInterval(async () => {
        const scenario = count % 4;

        let amount = 1000;
        let status = "SUCCESS";

        // Scenario 2: status mismatch from GATEWAY
        if (scenario === 2) {
            status = "FAILED";
        }

        // Scenario 3: amount mismatch from GATEWAY
        if (scenario === 3) {
            amount = 1100;
        }

        const event = {
            transaction_id: `TX${count}`,
            source: "GATEWAY",
            amount,
            status,
            timestamp: new Date().toISOString()
        };
        await produceMessage(event, 'GATEWAY');
        count++;
    }, 30000);
    
    return gatewayTxInterval;
}

export const stopGatewayTx = () => {
    if (gatewayTxInterval) {
        clearInterval(gatewayTxInterval);
        gatewayTxInterval = null;
        count = 0;
    }
}

