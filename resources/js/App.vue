<template>
    <div>
        <header>
            <router-link to="/">Home</router-link> |
            <span v-if="userStore.currentUser != null">
                <a href="#" @click="logout">Logout</a> |
                <router-link to="/dashboard">Dashboard</router-link>
            </span>
            <span v-if="userStore.currentUser == null">
                <router-link to="/login">Login</router-link> |
                <router-link to="/sign-up">Sign Up</router-link></span>
        </header>
        <main>
            <router-view/>
        </main>
    </div>
</template>

<script lang="ts" setup>
    import { userStore } from './store/user.ts';
    import {apiLogout} from "./services/api.ts";
    import router from "./router";

    async function logout() {
        await apiLogout();
        router.push('/');
    }
</script>
