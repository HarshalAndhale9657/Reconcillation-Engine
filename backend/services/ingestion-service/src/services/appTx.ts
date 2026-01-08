import { produceMessage } from "@backend/common";

export const logAppTx = async () => {
    let count = 0
    setInterval(async () => {
        const event = {
            transaction_id: `TX${count}`,
            source: "APP",
            amount: 1000,
            status: "PENDING",
            timestamp: new Date().toISOString()
        };
        await produceMessage(event, 'APP')
        count++;
    }, 30000)
}

