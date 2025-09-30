<template>
    <form id="login-form" @submit.prevent="onFormSubmit">
        <h1>Login</h1>
        <div>
            <label>Email</label>
            <input type="email" v-model="form.email" />
        </div>
        <div>
            <label>Password</label>
            <input type="password" v-model="form.password" />
        </div>
        <input type="submit" value="submit" />
    </form>
</template>

<script lang="ts" setup>
    import { apiFetch } from "../services/api.ts";
    import { ref, onMounted } from 'vue';
    import { apiFetchCurrentUser, apiLogin } from '../services/api.ts';
    import { userStore } from '../store/user.ts';
    import router from "../router";

    const form = ref({
        email: 'test@test.com',
        password: null,
    });

    interface User {
        id: number;
        name: string;
        email: string;
    }

    const user = {};
    const error = ref<string | null>(null);

    async function checkMe() {
        const r = await apiFetchCurrentUser();
    }

    async function onFormSubmit() {
        error.value = null;
        console.log('what?')
        try {
            user.email = form.value.email;
            user.password = form.value.password;

            //No need to use await on response.json using apiFetch
            const response = await apiLogin(user);

            userStore.setUser(response.user);

            router.push("/dashboard"); // or any route you want

        } catch (err) {
            console.log(err);
            error.value = err.message;
        }
    }
</script>
