import { createApp } from 'vue'
import router from './router.js'
import App from './App.vue'
import { createPinia } from 'pinia'
import './assets/main.css'
import { useSessionStore } from "@/stores/modules/sessionStore"
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

import { createI18n } from 'vue-i18n'
import fr from "./locales/fr.json"
import en from "./locales/en.json"

import { library } from "@fortawesome/fontawesome-svg-core"
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome"
import { faEyeSlash, faEye, faPaperPlane, faEnvelope, faPenFancy, faMusic } from "@fortawesome/free-solid-svg-icons"

const app = createApp(App)
const pinia = createPinia()

library.add(faEyeSlash, faEye, faPaperPlane, faEnvelope, faPenFancy, faMusic)

app.use(pinia)
// Load JWT from local storage on refresh
const loadAuthToken = async () => {
	const authToken = localStorage.getItem("authToken")
	console.log("authToken main1", authToken)

	const authTokenExists = authToken !== "undefined" && authToken !== null

	if (authTokenExists) {
		await useSessionStore(pinia).loginUserWithToken(authToken)
		console.log("authToken main2", authToken)
	}
}

const vuetify = createVuetify({
	components,
	directives
})

const i18n = createI18n({
	locale: 'en', // Default to 'en' until we determine the actual language
	fallbackLocale: 'en',
	messages: { fr, en }, // You can initialize with basic messages if you want
	legacy: false
})

const getCountryCode = async () => {
	try {
		const response = await fetch('https://ipapi.co/json/');
		const data = await response.json();
		return data.country_code;
	} catch (error) {
		console.error('Error fetching country code:', error);
		return null;
	}
};

const countryToLanguageMap = {
	US: 'en',
	FR: 'fr',
	ES: 'es',
	DE: 'de',
	// Add more mappings as needed
};

const getLanguageFromCountry = (countryCode) => {
	return countryToLanguageMap[countryCode] || 'en'; // Default to 'en' if country code is not mapped
};

const setLanguage = async () => {
	const countryCode = await getCountryCode();
	const language = getLanguageFromCountry(countryCode);

	// Load the messages dynamically if not already loaded
	if (!i18n.global.availableLocales.includes(language)) {
		const messages = await import(`./locales/${language}.json`);
		i18n.global.setLocaleMessage(language, messages);
	}
	// Update the i18n instance with the detected language
	i18n.global.locale.value = language;
}

setLanguage();

loadAuthToken().then(() => {
	app
		.component("FontAwesomeIcon", FontAwesomeIcon)
		.use(router)
		.use(vuetify)
		.use(i18n)
		.mount("#app")
})
