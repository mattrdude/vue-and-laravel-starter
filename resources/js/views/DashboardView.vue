<template>
    <div>
        <h1>Dashboard</h1>
        Hello {{ userStore.currentUser.name }}
    </div>
</template>

<script lang="ts" setup>
import { userStore } from '../store/user.ts';
</script>
