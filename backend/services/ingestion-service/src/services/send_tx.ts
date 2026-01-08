import { produceMessage } from "@backend/common";

const logPayment = async () => {
    let count = 0
    setInterval(async () => {
        const event = {
            transaction_id: `TX${count}`,
            source: "APP",
            amount: 1000,
            status: "PENDING",
            timestamp: new Date().toISOString()
        };
        await produceMessage(event)
        count++;
    }, 5000)
}

logPayment()