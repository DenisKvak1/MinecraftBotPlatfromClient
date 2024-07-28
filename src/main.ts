import {createApp} from 'vue'
import App from './App.vue'
import "./assets/css/index.css"
import router from "@/router";
import pinia from "@/store";
import {library} from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";
import components from "@/components/ui";

library.add(fas);

const app = createApp(App);
components.forEach((component)=>{
    app.component(component.name, component);
})
app.use(router)
app.use(pinia);
app.component('font-awesome-icon', FontAwesomeIcon);
app.mount('#app');