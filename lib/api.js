const API_URL = "https://i5qohtp440.execute-api.ap-south-1.amazonaws.com";

export async function apiRequest(endpoint, options = {}) {
    const { method = 'GET', body, headers = {}, ...customConfig } = options;

    // Get token from sessionStorage
    const token = typeof window !== 'undefined' ? sessionStorage.getItem('token') : null;

    const config = {
        method,
        headers: {
            'Content-Type': 'application/json',
            ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
            ...headers,
        },
        ...customConfig,
        body: body ? JSON.stringify(body) : undefined,
    };

    try {
        const response = await fetch(`${API_URL}${endpoint}`, config);

        // Handle empty responses
        const text = await response.text();
        const data = text ? JSON.parse(text) : {};

        if (response.ok) {
            return data;
        }

        // Create a descriptive error
        const error = new Error(data.detail || data.message || `Error ${response.status}: ${response.statusText}`);
        error.status = response.status;
        error.data = data;
        throw error;
    } catch (error) {
        console.error('API Request Error:', error);
        throw error;
    }
}

export const authApi = {
    login: (credentials) => apiRequest('/auth/login', { method: 'POST', body: credentials }),
    signup: (userData) => apiRequest('/auth/signup', { method: 'POST', body: userData }),
};

export const chatApi = {
    sendMessage: (prompt, chatId = null) => apiRequest('/predict', {
        method: 'POST',
        body: { prompt, chat_id: chatId }
    }),
    getHistory: () => apiRequest('/chats', { method: 'GET' }),
    createChat: (title = "New Chat") => apiRequest('/chats', {
        method: 'POST',
        body: { title }
    }),
    getChatMessages: (timestamp) => apiRequest(`/chats/${encodeURIComponent(timestamp)}`, { method: 'GET' }),
    deleteChat: (timestamp) => apiRequest('/chats/delete', {
        method: 'POST',
        body: { timestamp }
    }),
    deleteAllHistory: () => apiRequest('/chats/delete', {
        method: 'POST',
        body: { timestamp: 'all' }
    }),
};
