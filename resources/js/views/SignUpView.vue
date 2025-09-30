<template>
    <h1>Sign Up</h1>
    <form @submit.prevent="signUp">
        <div>
            <label for="email">Name</label>
            <input v-model="form.name" type="text" />
        </div>
        <div>
            <label for="email">Email</label>
            <input v-model="form.email" type="email" />
        </div>
        <div>
            <label for="password">Password</label>
            <input v-model="form.password" type="password" />
        </div>
        <button @click="signUp">Sign Up</button>
    </form>
</template>

<script lang="ts" setup>
import {apiSignUp} from "../services/api.ts";
import router from "../router";
import {ref} from "vue";

const form = ref({
    email: null,
    password: null,
});

async function signUp() {
    const user = {
        name:form.value.name,
        email:form.value.email,
        password:form.value.password
    };

    await apiSignUp(user);
    router.push('/dashboard');
}
</script>
