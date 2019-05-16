import web3 from '../web3';
import escrow from '../../../contracts/build/contracts/Escrow.json';

const abi = escrow.abi;

export default new web3.eth.Contract(abi);
