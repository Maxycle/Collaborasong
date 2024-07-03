import { createPinia } from 'pinia';
import { useTrackStore } from './modules/tracks';
import { useSessionStore } from './modules/sessionStore';
import { useChatroomStore } from './modules/chatroomStore';

const pinia = createPinia();
pinia.use(useTrackStore);
pinia.use(useSessionStore);
pinia.use(useChatroomStore);

export default pinia;
