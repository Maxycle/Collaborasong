import { createPinia } from 'pinia';
import { useTrackStore } from './modules/tracks';
import { useSessionStore } from './modules/sessionStore';

const pinia = createPinia();
pinia.use(useTrackStore);
pinia.use(useSessionStore);

export default pinia;
