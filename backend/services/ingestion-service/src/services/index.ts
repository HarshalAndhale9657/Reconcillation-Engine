import { logAppTx } from './appTx'
import { logGatewayTx } from './gatewayTx'
import { logBankTx } from './bankTx'

async function run() {
    setTimeout(logAppTx, 1000);
    setTimeout(logGatewayTx, 2000);
    setTimeout(logBankTx, 3000);

    // Exit process after 5 minutes (300000 ms)
    setTimeout(() => {
        console.log('Shutting down after 5 minutes');
        process.exit(0);
    }, 300000);
}

run()