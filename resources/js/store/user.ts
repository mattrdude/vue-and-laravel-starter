import { reactive } from "vue";
import type { User } from "../types/User";

export const userStore = reactive({
    currentUser: null as User | null,

    setUser(user: any) {
        this.currentUser = user;
    },

    clearUser() {
        this.currentUser = null;
    },
});
