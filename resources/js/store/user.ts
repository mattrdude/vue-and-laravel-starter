import { reactive } from "vue";

export const userStore = reactive({
    currentUser: null as any,

    setUser(user: any) {
        this.currentUser = user;
    },

    clearUser() {
        this.currentUser = null;
    },
});
