import { createRouter, createWebHistory } from 'vue-router';
import HomeView from './views/HomeView.vue';
import LoginView from "./views/LoginView.vue";
import DashboardView from "./views/DashboardView.vue";
import { userStore } from './store/user.ts';
import SignUpView from "./views/SignUpView.vue";

const routes = [
    { path: '/', component: HomeView },
    { path: '/login', component: LoginView, meta: { guestOnly: true } },
    { path: '/dashboard', component: DashboardView, meta: { requiresAuth: true } },
    { path: '/sign-up', component: SignUpView, meta: { guestOnly: true } },
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

// run before each route change
// router.beforeEach(async (to, from, next) => {
//     await fetchCurrentUser()
//     next()
// })


router.beforeEach(async (to, from, next) => {


    if (to.meta.requiresAuth && !userStore.currentUser) {
        return next('/login'); // redirect to login if not logged in
    }

    // Redirect logged-in users away from guest-only pages
    if (to.meta.guestOnly && userStore.currentUser) {
        return next('/dashboard');
    }

    next(); // allow navigation
});

export default router
