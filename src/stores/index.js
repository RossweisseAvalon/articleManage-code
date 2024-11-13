import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)
export default pinia

export * from './modeles/user' // 等价于：
// import { useUserStore } from './modeles/user'
// export { useUserStore }
