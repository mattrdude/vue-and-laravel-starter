import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import { apiFetchCurrentUser } from "./services/api.js";
import { userStore } from "./store/user";

const app = createApp(App);

// fetch the current user before mounting
await apiFetchCurrentUser().then(user => {
    userStore.setUser(user);
});

app.use(router);
app.mount("#app");
