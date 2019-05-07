import web3 from '../web3';
import myconfig from '../../../myconfig.json';

const address = myconfig.addresses.verifier_oracle;
const abi = myconfig.abi.verifier_oracle;

export default new web3.eth.Contract(abi, address);
