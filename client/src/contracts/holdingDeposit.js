import web3 from '../web3';
import myconfig from '../../../contracts/build/contracts/HoldingDeposit.json';

const abi = myconfig.abi;

console.log(abi);

export default new web3.eth.Contract(abi);
