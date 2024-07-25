import {createRouter, createWebHistory} from 'vue-router';
import MainPage from "@/pages/MainPage.vue";
import ControlBotPage from "@/pages/ControlBotPage.vue";

const routes = [
    {
        path: '/',
        name: 'Home',
        component: MainPage,
    },
    {
        path: '/:botName',
        name: 'ControlBot',
        component: ControlBotPage
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;
