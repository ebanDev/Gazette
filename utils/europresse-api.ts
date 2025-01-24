async function request(apiUrl: string, endpoint: string, data: any) {
    const response = await fetch(`${apiUrl}/${endpoint}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });

    const result = await response.json();
    if (!response.ok) {
        throw { error: result.error || 'Une erreur est survenue' };
    }
    return result;
}

export async function login(apiUrl: string, username: string, password: string, provider: string, ent: string) {
    return await request(apiUrl, 'login', { username, password, provider, ent });
}

export async function search(apiUrl: string, authData: Object, query: string, searchIn: string = "fullText", dateRange: string = "allTime") {
    return await request(apiUrl, 'search', { query, searchIn, dateRange, authData });
}

export async function getArticle(apiUrl: string, authData: Object, id: string) {
    const response = await fetch(`${apiUrl}/article`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id, authData })
    });

    return await response.text();
}

export default {
    login,
    search,
    getArticle
};
