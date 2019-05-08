module.exports = {
	networks: {
		development: {
			host: "localhost",     // Localhost (default: none)
			port: 9546,            // Standard Ethereum port (default: none)
			gas: 6000000,
			network_id: "*",       // Any network (default: none)
			websockets: true
		},
		test: {
			host: "localhost",
			port: 8545,
			network_id: "*"
		}
	},
	compilers: {
		solc: {
			version: "0.5.7"
		}
	}
}
