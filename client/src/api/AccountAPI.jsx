import axios from 'axios';
import Cookies from 'universal-cookie';

const API_BASE_URL = import.meta.env.VITE_BASE_URL;
const API_BASE_PORT = import.meta.env.VITE_BASE_PORT;

const cookies = new Cookies(null, { path: '/' });
axios.defaults.withCredentials = true;

export default class AccountsAPI {
    static async login(username, password) {
        try {
            const response = await axios.post(`${API_BASE_URL}:${API_BASE_PORT}/api/user/login`, {
                username: username,
                password: password,
            });
            return response;
        } catch (error) {
            return error.response;
        }
    }

    static async register(username, password, userword) {
        try {
            const response = await axios.post(`${API_BASE_URL}:${API_BASE_PORT}/api/user/register`, {
                username: username,
                password: password,
                userword: userword
            });
            return response;
        } catch (error) {
            return error.response;
        }
    }

    static async checkUser() {
        try {
            const response = await axios.get(`${API_BASE_URL}:${API_BASE_PORT}/api/user/me`, {
                withCredentials: true,
                headers: {
                    'X-CSRF-Token': cookies.get('csrf_access_token')
                }
            });
            return response;
        } catch (error) {
            return error.response;
        }
    }

    static async logout() {
        try {
            const response = await axios.post(`${API_BASE_URL}:${API_BASE_PORT}/api/user/logout`, {
                withCredentials: true,
                headers: {
                    'X-CSRF-Token': cookies.get('csrf_access_token')
                }
            });
            return response;
        } catch (error) {
            return error.response;
        }
    }
}
