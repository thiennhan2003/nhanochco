import axios from 'axios';

const API_URL = 'http://localhost:8080/api/v1/auth';

export const login = async (email, password) => {
    try {
        const response = await axios.post(`${API_URL}/login`, { email, password });
        return response.data; // Trả về accessToken và refreshToken
    } catch (error) {
        console.error('Login failed:', error.response?.data || error.message);
        throw error;
    }
};
