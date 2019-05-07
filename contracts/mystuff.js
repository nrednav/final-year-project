const fs = require('fs');

const myconfig = JSON.parse(fs.readFileSync("myconfig.json"));
console.log("Read file, contents are ...");
console.log(myconfig);

myconfig.addresses.escrow = "0x12345"

console.log("Modified file, contents are now ...");
console.log(myconfig);

fs.writeFile("myconfig.json", JSON.stringify(myconfig, null, 4), (err) => {
	if (err) console.error(err);
	console.log("Writing to file ...");
});
