import {useAuthStore} from "../store/auth";

async function request(apiUrl: string, endpoint: string, data: any) {
    const response = await fetch(`${apiUrl}/${endpoint}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });

    return await response.json();
}

export async function login(apiUrl: string, username: string, password: string, provider: string, ent: string) {
    return await request(apiUrl, 'login', { username, password, provider, ent });
}

export async function search(apiUrl: string, cookies: Object, query: string, searchIn: string = "fullText", dateRange: string = "allTime") {
    return await request(apiUrl, 'search', { query, searchIn, dateRange, cookies });
}

export async function getArticle(apiUrl: string, cookies: Object, id: string) {
    const response = await fetch(`${apiUrl}/article`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id, cookies })
    });

    return await response.text();
}

export default {
    login,
    search,
    getArticle
};