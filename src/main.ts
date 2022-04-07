import { createApp } from 'vue'
import App from './App.vue'
import { router, setupRouter } from './router'
import { setupStore } from './store'
import { setupI18n } from './lang'

import './assets/css/reset.css'
import './assets/font/iconfont.css'

async function bootstrap() {
	const app = createApp(App)
	// Configure store
	setupStore(app)

	// Initialize internal system configuration
	// initAppConfigStore();

	// Register global components
	// registerGlobComp(app);

	// Multilingual configuration
	// Asynchronous case: language files may be obtained from the server side
	await setupI18n(app)

	// Configure routing
	setupRouter(app)

	// router-guard
	// setupRouterGuard(router);

	// Register global directive
	// setupGlobDirectives(app);

	// Configure global error handling
	// setupErrorHandle(app);

	// https://next.router.vuejs.org/api/#isready
	await router.isReady()

	app.mount('#app')
}

bootstrap()
// createApp(App).use(store).use(router).mount("#app")
