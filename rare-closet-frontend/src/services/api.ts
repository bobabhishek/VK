import axios from 'axios'

const api = axios.create({
	baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
})

api.interceptors.request.use((config) => {
	const token = localStorage.getItem('token')
	if (token) {
		const headers = (config.headers || {}) as Record<string, any>
		headers.Authorization = `Bearer ${token}`
		config.headers = headers as any
	}
	return config
})

export function setAuthToken(token: string | null) {
	if (token) {
		localStorage.setItem('token', token)
	} else {
		localStorage.removeItem('token')
	}
}

export default api


