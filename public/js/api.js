// This function remains the same as before
const request = async (url, options = {}) => {
    try {
        const response = await fetch(url, options);
        if (!response.ok) {
            const data = await response.json().catch(() => ({ message: 'An unknown error occurred.' }));
            throw new Error(data.message);
        }
        // Handle cases with no JSON body, like logout
        if (response.status === 204 || response.headers.get('content-length') === '0') {
            return null;
        }
        return response.json();
    } catch (error) {
        console.error(`API Error on ${options.method || 'GET'} ${url}:`, error);
        throw error;
    }
};

// --- Auth API ---
export const login = (email, password) => request('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
});

export const register = (displayName, email, password) => request('/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ displayName, email, password }),
});

export const logout = () => request('/api/auth/logout', { method: 'POST' });
export const getCurrentUser = () => request('/api/auth/me');

export const uploadProfilePicture = (formData) => request('/api/auth/profile-picture', {
    method: 'POST',
    body: formData,
});

// --- Site API ---
export const getSites = () => request('/api/sites');
export const getSiteDetails = (siteName) => request(`/api/sites/${siteName}`);
export const uploadNewSite = (formData) => request('/api/sites', {
    method: 'POST',
    body: formData,
});
export const deleteSite = (siteName) => request(`/api/sites/${siteName}`, {
    method: 'DELETE'
});
