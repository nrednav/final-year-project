const fs = require("fs");
//const web3 = require("./web3.js");
const axios = require("axios");

//import Web3 from 'web3';
const Web3 = require("web3");
const web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:10546"));

console.log(web3);

async function runStuff() {

	const myconfig = JSON.parse(fs.readFileSync("../../contracts/myconfig.json"));
	let to = myconfig.addresses.buyer;

	const from = "0x8a23c7c42333ed6be5a68c24031cd7a737fbcbe8";
	let result = await web3.eth.personal.unlockAccount(from, String(1234), 600);
	console.log(result);

	const tx = await web3.eth.sendTransaction({
		from: from,
		to: to,
		value: web3.utils.toWei('100', 'ether')
	});
	console.log(tx);
}

runStuff();
//let tx = await web3.eth.sendTransaction({
//	from: eth.coinbase,
//	to: to,
//	value: web3.toWei('10', 'ether')
//});
