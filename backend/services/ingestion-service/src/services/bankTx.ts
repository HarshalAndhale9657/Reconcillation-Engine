import { produceMessage } from "@backend/common";
const SEC = 1000
export const logBankTx = async () => {
    let count = 0
    setInterval(async () => {
        const event = {
            transaction_id: `TX${count}`,
            source: "BANK",
            amount: 1000,
            status: "PENDING",
            timestamp: new Date().toISOString()
        };
        await produceMessage(event, 'BANK')
        count++;
    }, 30 * SEC)
}
