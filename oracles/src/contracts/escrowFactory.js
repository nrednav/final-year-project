import web3 from '../web3';
import myconfig from '../../../myconfig.json';

const address = myconfig.addresses.escrow_factory;
const abi = myconfig.abi.escrow_factory;

// console.log(abi, address);

export default new web3.eth.Contract(abi, address);
