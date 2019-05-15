import web3 from '../web3';
import hd from '../../../contracts/build/contracts/HoldingDeposit.json';

const abi = hd.abi;

export default new web3.eth.Contract(abi);
