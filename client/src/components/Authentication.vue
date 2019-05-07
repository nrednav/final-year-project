<template>
	<div class="authentication">
		<h1 class="heading white--text">Authentication</h1>

		<v-alert v-model="formInvalid" dismissible type="error">
			<span><b>Please correct the following error(s):- </b></span>
			<ul>
				<li v-for="(error, index) in errors" :key="index">
					{{ error }}
				</li>
			</ul>
		</v-alert>

		<v-container class="my-5 mx-5">
			<v-layout align-center justify-center column>
				<v-flex>
					<v-card elevation="4" class="auth_container primary" id="auth_container">
						<div class="form-container register-container">
							<form>
								<h1 class="pb-4">Register</h1>
								<input type="text" placeholder="First Name" v-model="register_details.fname" />
								<input type="text" placeholder="Last Name" v-model="register_details.lname"/>
								<div id="acc_addr" class="white--text text-xs-left pt-2 pb-2">
									Selected Account:
									<span class="grey--text">{{ selected_addr }} </span>
								</div>
								<input type="email" placeholder="Email" v-model="register_details.email"/>
								<input type="password" placeholder="Password" v-model="register_details.password"/>
								<v-btn round outline color="p_blue"
															v-on:click="register">REGISTER</v-btn>
							</form>
						</div>
						<div class="form-container login-container">
							<form action="#">
								<h1 class="pb-4">Login</h1>
								<input type="email" placeholder="Email" v-model="login_details.email"/>
								<input type="password" placeholder="Password" v-model="login_details.password">
								<div id="acc_addr" class="white--text text-xs-left pt-2 pb-2">
									Selected Account:
									<span class="grey--text">{{ selected_addr }}</span>
								</div >
								<v-btn round outline color="p_blue"
															v-on:click="login">
									LOGIN
								</v-btn>
							</form>
						</div>
						<div class="overlay-container">
							<div class="overlay">
								<div class="overlay-panel overlay-left">
									<h1>Welcome</h1>
									<v-btn round outline color="white"
																v-on:click="load_login_form">
										LOGIN
									</v-btn>
								</div>
								<div class="overlay-panel overlay-right">
									<h1>Hello</h1>
									<v-btn id="bob" round outline color="white"
																			v-on:click="load_register_form">
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
import web3 from '../web3'
import axios from 'axios'

const authUri = 'http://localhost:3000/api/auth'

export default {
	data () {
		return {
			selected_addr: '',
			login_details: {
				email: '',
				password: ''
			},
			register_details: {
				fname: '',
				lname: '',
				email: '',
				password: ''
			},
			formInvalid: false,
			errors: []
		}
	},
	methods: {
		load_login_form: function () {
			const container = document.getElementById('auth_container')
			this.$router.push('/login')
			container.classList.remove('right-panel-active')
		},
		load_register_form: function () {
			const container = document.getElementById('auth_container')
			this.$router.push('/register')
			container.classList.add('right-panel-active')
		},
		async load_accounts () {
			if (window.ethereum !== 'undefined') {
				let addresses = await window.ethereum.enable()
				this.selected_addr = addresses[0]
			} else {
				alert('Please download and install the Metamask browser addon to continue')
			}
		},
		isRegisterFormEmpty () {
			this.errors = []
			if (this.register_details.fname === '' ||
				this.register_details.lname === '' ||
				this.register_details.email === '' ||
				this.register_details.password === '') {
				this.formInvalid = true
				this.errors.push('One or more fields have been left empty')
				return true
			}
			this.formInvalid = false
			return false
		},
		isLoginFormEmpty () {
			this.errors = []
			if (this.login_details.email === '' || this.login_details.password === '') {
				this.formInvalid = true
				this.errors.push('One or more fields have been left empty')
				return true
			}
			this.formInvalid = false
			return false
		},
		login () {
			if (!this.isLoginFormEmpty()) {
				if (this.selected_addr !== '') {
					const body = {
						email: this.login_details.email,
						password: this.login_details.password,
						account_address: this.selected_addr
					}

					axios.post(authUri + '/login', body)
						.then(res => {
							if (res.statusText === 'OK') {
								localStorage.token = res.data.token
								this.login_details = {
									email: '',
									password: ''
								}
								this.$store.dispatch('update_user_status', { type: '' })
								this.$router.push('/select-profile')
							}
						})
						.catch(err => {
							console.log(err)
							this.errors = []
							this.errors.push('Incorrect email or password entered')
							this.formInvalid = true
						})
				} else {
					alert('Please login to metamask to continue')
				}
			}
		},
		register: function () {
			if (!this.isRegisterFormEmpty()) {
				if (this.selected_addr !== '') {
					const body = {
						email: this.register_details.email,
						password: this.register_details.password,
						name: this.register_details.fname + ' ' + this.register_details.lname,
						account_address: this.selected_addr
					}

					axios.post('http://localhost:3000/api/auth/register', body).then((res) => {
						// console.log(res)
						if (res.data.error === 'email taken') {
							this.errors = []
							this.errors.push('Sorry, that email address is already taken.')
							this.formInvalid = true
						} else if (res.data.error === 'none') {
							this.addToScreeningDb(res.data.user_id)
						}
					})
						.catch((err) => {
							console.log(err)
							this.errors = []
							this.errors.push('Invalid first name, last name, account address or email address')
							this.formInvalid = true
						})
				} else {
					alert('Please login to metamask to continue')
				}
			}
		},
		async addToScreeningDb (userId) {
			let userUid = await web3.utils.sha3(this.selected_addr + this.register_details.email)
			const body = {
				account_address: this.selected_addr,
				uid: userUid,
				user_id: userId
			}

			axios.post('http://localhost:3000/api/screening/add-report', body)
				.then((res) => {
					this.clearForm()
				})
				.catch(error => {
					console.log(error)
				})
		},

		clearForm () {
			this.register_details = {
				fname: '',
				lname: '',
				email: '',
				password: ''
			}

			if (this.register_details.fname === '') {
				this.load_login_form()
			}
		}
	},
	mounted () {
		this.load_accounts()
		if (this.$route.path === '/register') {
			this.load_register_form()
		}
		window.ethereum.on('accountsChanged', (accounts) => {
			this.selected_addr = accounts[0]
		})
	}
}
</script>

<style>

.auth_container {
	background-color: #1e232a;
	border-radius: 10px;
	/* box-shadow: 0px 5px 5px rgba(0, 0, 0, 0.25), 0px 5px 5px rgba(0, 0, 0, 0.22); */
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
	background: -webkit-linear-gradient(#3699db, #ff6161);
	background: linear-gradient(#3699db, #ff6161);
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

#acc_addr {
	background-color: #2a313b;
	border-radius: 10px;
	color: #fff;
	border: none;
	padding: 12px 15px;
	margin: 8px 0;
	width: 100%;
	word-wrap: break-word;
}
</style>
