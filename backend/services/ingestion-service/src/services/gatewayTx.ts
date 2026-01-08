import { produceMessage } from "@backend/common";

export const logGatewayTx = async () => {
    let count = 0
    setInterval(async () => {
        const event = {
            transaction_id: `TX${count}`,
            source: "GATEWAY",
            amount: 1000,
            status: "PENDING",
            timestamp: new Date().toISOString()
        };
        await produceMessage(event, 'GATEWAY')
        count++;
    }, 30000)
}

