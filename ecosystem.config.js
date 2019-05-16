module.exports = {
	apps : [
		{
			name: 'server',
			cwd: './server',
			script: 'npm -- run dev',
			output: '../logs/server/output.log',
			error: '../logs/server/error.log',
			// Options reference: https://pm2.io/doc/en/runtime/reference/ecosystem-file/
			instances: 1,
			autorestart: true,
			watch: true,
			max_memory_restart: '1G',
			env: {
				NODE_ENV: 'development'
			},
			env_production: {
				NODE_ENV: 'production'
			}
		},
		{
			name: 'client',
			cwd: './client',
			script: 'yarn',
			args: 'serve',
			interpreter: '/bin/bash',
			output: '../logs/client/output.log',
			error: '../logs/client/error.log',
			// Options reference: https://pm2.io/doc/en/runtime/reference/ecosystem-file/
			instances: 1,
			autorestart: true,
			watch: true,
			max_memory_restart: '1G',
			env: {
				NODE_ENV: 'development'
			},
			env_production: {
				NODE_ENV: 'production'
			}
		},
		{
			name: 'verifier_oracle',
			cwd: './oracles',
			script: 'npm -- run verifier',
			output: '../logs/oracles/verifier/output.log',
			error: '../logs/oracles/verifier/error.log',
			// Options reference: https://pm2.io/doc/en/runtime/reference/ecosystem-file/
			instances: 1,
			autorestart: true,
			watch: false,
			max_memory_restart: '1G',
			env: {
				NODE_ENV: 'development'
			},
			env_production: {
				NODE_ENV: 'production'
			}
		},
		{
			name: 'hd_oracle',
			cwd: './oracles',
			script: 'npm -- run hd',
			output: '../logs/oracles/hd/output.log',
			error: '../logs/oracles/hd/error.log',
			// Options reference: https://pm2.io/doc/en/runtime/reference/ecosystem-file/
			instances: 1,
			autorestart: true,
			watch: false,
			max_memory_restart: '1G',
			env: {
				NODE_ENV: 'development'
			},
			env_production: {
				NODE_ENV: 'production'
			}
		},
		{
			name: 'escrow_oracle',
			cwd: './oracles',
			script: 'npm -- run escrow',
			output: '../logs/oracles/escrow/output.log',
			error: '../logs/oracles/escrow/error.log',
			// Options reference: https://pm2.io/doc/en/runtime/reference/ecosystem-file/
			instances: 1,
			autorestart: true,
			watch: false,
			max_memory_restart: '1G',
			env: {
				NODE_ENV: 'development'
			},
			env_production: {
				NODE_ENV: 'production'
			}
		}
	],

	deploy : {
		production : {
			user : 'node',
			host : '212.83.163.1',
			ref  : 'origin/master',
			repo : 'git@github.com:repo.git',
			path : '/var/www/production',
			'post-deploy' : 'npm install && pm2 reload ecosystem.config.js --env production'
		}
	}
};
