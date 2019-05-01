<template>
	<div class="authentication">
		<h1 class="heading white--text">Authentication</h1>

		<v-container class="my-5 mx-5">
			<v-layout align-center justify-center column>
				<v-flex>
					<v-card class="auth_container primary" id="auth_container">
						<div class="form-container register-container">
							<form action="#">
								<h1 class="pb-4">Register</h1>
								<input type="text" placeholder="First Name" />
								<input type="text" placeholder="Last Name" />
								<input type="email" placeholder="Email" />
								<input type="password" placeholder="Password" />
								<v-btn round outline color="p_blue">REGISTER</v-btn>
							</form>
						</div>
						<div class="form-container login-container">
							<form action="#">
								<h1 class="pb-4">Login</h1>
								<input type="email" placeholder="Email" />
								<input type="password" placeholder="Password" />
								<v-btn round outline color="p_blue">LOGIN</v-btn>
							</form>
						</div>
						<div class="overlay-container">
							<div class="overlay">
								<div class="overlay-panel overlay-left">
									<h1>Welcome</h1>
									<v-btn round outline color="white" v-on:click="login">
										LOGIN
									</v-btn>
								</div>
								<div class="overlay-panel overlay-right">
									<h1>Hello</h1>
									<v-btn id="bob" round outline color="white" v-on:click="register">
										REGISTER
									</v-btn>
								</div>
							</div>
						</div>
					</v-card>
				</v-flex>
			</v-layout>
		</v-container>
	</div>
</template>

<script>
export default {
	data () {
		return {
			account_addresses: ['0x001', '0x002']
		}
	},
	methods: {
		login: function () {
			const container = document.getElementById('auth_container')
			this.$router.push('/login')
			container.classList.remove('right-panel-active')
		},
		register: function () {
			const container = document.getElementById('auth_container')
			this.$router.push('/register')
			container.classList.add('right-panel-active')
		}
	},
	mounted () {
		if (this.$route.path === '/register') {
			this.register()
		}
	}
}
</script>

<style>

.auth_container {
	background-color: #1e232a;
	border-radius: 10px;
	box-shadow: 0 10px 10px rgba(0, 0, 0, 0.25), 0 10px 10px rgba(0, 0, 0, 0.22);
	position: relative;
	overflow: hidden;
	width: 768px;
	max-width: 100%;
	min-height: 480px;
}

.form-container {
	position: absolute;
	top: 0;
	height: 100%;
	transition: all 0.6s ease-in-out;
}

.login-container {
	left: 0;
	width: 50%;
	z-index: 2;
}

.register-container {
	left: 0;
	width: 50%;
	opacity: 0;
	z-index: 1;
}

.auth_container.right-panel-active .login-container {
	transform: translateX(100%);
}

.auth_container.right-panel-active .register-container {
	transform: translateX(100%);
	opacity: 1;
	z-index: 5;
	animation: show 0.6s;
}

@keyframes show {
	0%,
	49.99% {
		opacity: 0;
		z-index: 1;
	}

	50%,
	100% {
		opacity: 1;
		z-index: 5;
	}
}

.overlay-container {
	position: absolute;
	top: 0;
	left: 50%;
	width: 50%;
	height: 100%;
	overflow: hidden;
	transition: transform 0.6s ease-in-out;
	z-index: 100;
}

.auth_container.right-panel-active .overlay-container {
	transform: translateX(-100%);
}

.overlay {
	background: #ff6161;
	background: -webkit-linear-gradient(to right, #3699db, #ff6161);
	background: linear-gradient(to right, #3699db, #ff6161);
	background-repeat: no-repeat;
	background-size: cover;
	background-position: 0 0;
	color: #fff;
	position: relative;
	left: -100%;
	height: 100%;
	width: 200%;
	transform: translateX(0);
	transition: transform 0.6s ease-in-out;
}

.auth_container.right-panel-active .overlay {
	transform: translateX(50%);
}

.overlay-panel {
	position: absolute;
	display: flex;
	align-items: center;
	justify-content: center;
	flex-direction: column;
	padding: 0 40px;
	text-align: center;
	top: 0;
	height: 100%;
	width: 50%;
	transform: translateX(0);
	transition: transform 0.6s ease-in-out;
}

.overlay-left {
	transform: translateX(-20%);
}

.auth_container.right-panel-active .overlay-left {
	transform: translateX(0);
}

.overlay-right {
	right: 0;
	transform: translateX(0);
}

.auth_container.right-panel-active .overlay-right {
	transform: translateX(20%);
}

.auth_container form {
	background-color: #1e232a;
	display: flex;
	align-items: center;
	justify-content: center;
	flex-direction: column;
	padding: 0 50px;
	height: 100%;
	text-align: center;
}

.auth_container input {
	background-color: #2a313b;
	border-radius: 10px;
	color: #fff;
	border: none;
	padding: 12px 15px;
	margin: 8px 0;
	width: 100%;
}

.auth_container form h1 {
	color: #697a94;
}
</style>
