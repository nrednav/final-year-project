import web3 from '../web3';
import myconfig from '../../../myconfig.json';

const address = myconfig.addresses.holding_deposit_factory;
const abi = myconfig.abi.holding_deposit_factory;

// console.log(abi, address);

export default new web3.eth.Contract(abi, address);
