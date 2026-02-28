// const API_URL = "https://i5qohtp440.execute-api.ap-south-1.amazonaws.com";
const API_URL = "https://3sl97g6wna.execute-api.ap-south-1.amazonaws.com/prod";
const l_API_URL = "http://localhost:8000";

// Custom error class for API errors
class ApiError extends Error {
    constructor(message, status, data) {
        super(message);
        this.name = 'ApiError';
        this.status = status;
        this.data = data;
    }
}

export async function apiRequest(endpoint, options = {}, baseUrl = l_API_URL) {
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
        const response = await fetch(`${baseUrl}${endpoint}`, config);

        // Handle empty responses
        const text = await response.text();
        const data = text ? JSON.parse(text) : {};

        if (response.ok) {
            return data;
        }

        // Create a descriptive error
        let detail = `Error ${response.status}`;

        if (typeof data.detail === 'string') {
            detail = data.detail;
        } else if (Array.isArray(data.detail)) {
            // Handle Pydantic validation errors
            detail = data.detail.map(err => err.msg || err.message).join(', ');
        } else if (data.message) {
            detail = data.message;
        }

        throw new ApiError(detail, response.status, data);
    } catch (error) {
        console.error('API Request Error:', error);
        throw error;
    }
}

export const authApi = {
    login: (credentials) => apiRequest('/auth/login', { method: 'POST', body: credentials }, API_URL),
    signup: (userData) => apiRequest('/auth/signup', { method: 'POST', body: userData }, API_URL),
};

export const chatApi = {
    sendMessage: (prompt, chatId = null, complianceModules = null) => apiRequest('/predict', {
        method: 'POST',
        body: {
            prompt,
            chat_id: chatId,
            compliance_modules: complianceModules
        }
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

export const fundApi = {
    getFundMetrics: (schemeCode) => apiRequest(`/api/v1/fund-metrics/${encodeURIComponent(schemeCode)}`, { method: 'GET' }),
    listFunds: (category, limit = 10) => apiRequest(`/api/v1/mutual-funds?category=${category}&limit=${limit}`, { method: 'GET' }),
    getFundDetails: (fundCode) => apiRequest(`/api/v1/fund-details/${encodeURIComponent(fundCode)}`, { method: 'GET' }),
};
