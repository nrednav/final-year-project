import web3 from '../web3';

// Import escrow contract address
import myconfig from '../../../myconfig.json';
console.log(myconfig);

const verifier_address = myconfig.addresses.verifier_oracle;
const verifier_abi = myconfig.abi.verifier_oracle;

console.log(verifier_address);
console.log(verifier_abi);

export default new web3.eth.Contract(verifier_abi, verifier_address);
