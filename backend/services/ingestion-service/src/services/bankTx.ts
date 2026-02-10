import { produceMessage } from "@backend/common";
const SEC = 1000

let bankTxInterval: NodeJS.Timeout | null = null;
let count = 0;

export const logBankTx = async (): Promise<NodeJS.Timeout> => {
    if (bankTxInterval) {
        return bankTxInterval; // Already running
    }
    
    bankTxInterval = setInterval(async () => {
        const scenario = count % 4;

        let amount = 1000;
        let status = "SUCCESS";

        // Scenario 1: introduce amount mismatch from BANK
        if (scenario === 1) {
            amount = 1100;
        }

        const event = {
            transaction_id: `TX${count}`,
            source: "BANK",
            amount,
            status,
            timestamp: new Date().toISOString()
        };
        await produceMessage(event, 'BANK');
        count++;
    }, 30 * SEC);
    
    return bankTxInterval;
}

export const stopBankTx = () => {
    if (bankTxInterval) {
        clearInterval(bankTxInterval);
        bankTxInterval = null;
        count = 0;
    }
}
