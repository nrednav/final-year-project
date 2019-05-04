import '@fortawesome/fontawesome-free/css/all.css'
import Vue from 'vue'
import Vuetify from 'vuetify'
import 'vuetify/src/stylus/main.styl'

Vue.use(Vuetify, {
	iconfont: 'fa',
	theme: {
		primary: '#1E232A',
		p_dark: '#181C22',
		p_text: '#697A94',
		p_red: '#FF6161',
		p_blue: '#3699DB',
		p_green: '#4FC44B',
		p_yellow: '#F0DC59',
		p_purple: '#8A53DB',
		p_orange: '#FF9061',
		p_input: '#2A313B',
		p_input_text: '#707070'
	}
})
