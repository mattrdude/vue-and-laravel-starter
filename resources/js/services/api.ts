import router from "../router";
import { userStore } from "../store/user.ts";

interface FetchOptions extends RequestInit {
    headers?: Record<string, string>;
}

export async function apiFetch<T = any>(url: string, options: FetchOptions = {}): Promise<T> {
    const response = await fetch(url, {
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
            ...(options.headers || {}),
        },
        ...options,
    });

    if (response.ok) {
        return (await response.json()) as T;
    } else {
        throw new Error("API Error.");
    }
}

export async function apiFetchCurrentUser() {
    try {
        const user = await apiFetch("/user/me");
        userStore.setUser(user);
        return user;
    } catch {
        userStore.clearUser();
        return null;
    }
}

export async function apiSignUp(user) {
    const csrfToken = getCsrfToken();

    const response = await apiFetch("/user/signup", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "X-CSRF-TOKEN": csrfToken,
            "Accept": "application/json",
        },
        body: JSON.stringify(user),
    });

    userStore.setUser(response.user);

    await refreshCsrf();

    if (response.status === 401) {
        throw new Error("Error.");
    } else {
        router.push("/dashboard");
    }
    return response;
}

export async function apiLogin(user) {
    await fetch("/sanctum/csrf-cookie", { credentials: "include" });

    const response = await apiFetch<User>("/user/login", {
        method: "POST",
        headers: {
            "X-CSRF-TOKEN": getCsrfToken(),
        },
        credentials: "include",
        body: JSON.stringify(user),
    });

    await refreshCsrf();

    if (response.status === 401) {
        userStore.clearUser();
        router.push("/login");
        throw new Error("Error.");
    } else {
        return response;
    }
}

export async function apiLogout() {
    await fetch("/sanctum/csrf-cookie", { credentials: "include" });

    await apiFetch("/user/logout", {
        method: "POST",
        headers: {
            "Accept": "application/json",
            "X-CSRF-TOKEN": getCsrfToken(),
        },
    });

    await refreshCsrf();

    userStore.clearUser();
}

async function refreshCsrf() {
    const response = await fetch('/csrf-token');
    const data = await response.json();
    document.querySelector('meta[name="csrf-token"]')?.setAttribute('content',data.csrf_token);
}

function getCsrfToken() {
    return document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || "";
}
