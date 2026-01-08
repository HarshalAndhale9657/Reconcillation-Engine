import { logAppTx } from './appTx'
import { logGatewayTx } from './gatewayTx'
import { logBankTx } from './bankTx'
async function run() {
    setTimeout(logAppTx, 1000);
    setTimeout(logGatewayTx, 2000);
    setTimeout(logBankTx, 3000);
}

run()