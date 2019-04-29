module.exports = {
	networks: {
		development: {
			host: "localhost",     // Localhost (default: none)
			port: 9546,            // Standard Ethereum port (default: none)
			gas: 4500000,
			network_id: "*",       // Any network (default: none)
			websockets: true
		}
	},
	compilers: {
		solc: {
			version: "0.5.7"
		}
	}
}
