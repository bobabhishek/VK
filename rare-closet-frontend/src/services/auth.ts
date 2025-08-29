import api, { setAuthToken } from './api'

export type AuthResponse = {
	_id: string
	name: string
	email: string
	phone?: string
	isAdmin?: boolean
	token: string
}

export async function login(email: string, password: string) {
	const { data } = await api.post<AuthResponse>('/users/login', { email, password })
	setAuthToken(data.token)
	localStorage.setItem('user', JSON.stringify(data))
	return data
}

export async function register(name: string, email: string, phone: string, password: string) {
	const { data } = await api.post<AuthResponse>('/users/register', { name, email, phone, password })
	setAuthToken(data.token)
	localStorage.setItem('user', JSON.stringify(data))
	return data
}

export function logout() {
	setAuthToken(null)
	localStorage.removeItem('user')
}

export function getCurrentUser(): AuthResponse | null {
	try {
		const raw = localStorage.getItem('user')
		return raw ? JSON.parse(raw) : null
	} catch {
		return null
	}
}


