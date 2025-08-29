import { useState } from 'react'
import { login, register } from '../services/auth'
import { useNavigate } from 'react-router-dom'

export default function Auth() {
	const [mode, setMode] = useState<'login' | 'register'>('login')
	const [name, setName] = useState('')
	const [email, setEmail] = useState('')
	const [phone, setPhone] = useState('')
	const [password, setPassword] = useState('')
	const [error, setError] = useState<string | null>(null)
	const navigate = useNavigate()

	const submit = async (e: React.FormEvent) => {
		e.preventDefault()
		try {
			setError(null)
			if (mode === 'login') {
				await login(email, password)
			} else {
				await register(name, email, phone, password)
			}
			navigate('/')
		} catch (e: any) {
			setError(e?.response?.data?.message || e?.message || 'Failed')
		}
	}

	return (
		<div className="max-w-md mx-auto">
			<h1 className="text-xl font-semibold mb-4">{mode === 'login' ? 'Login' : 'Register'}</h1>
			<form onSubmit={submit} className="space-y-3">
				{mode === 'register' ? (
					<input value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" className="w-full border rounded px-3 py-2" />
				) : null}
				<input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" className="w-full border rounded px-3 py-2" />
				{mode === 'register' ? (
					<input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Phone" className="w-full border rounded px-3 py-2" />
				) : null}
				<input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" className="w-full border rounded px-3 py-2" />
				<button type="submit" className="w-full bg-brand-accent text-white rounded py-2">
					{mode === 'login' ? 'Login' : 'Create account'}
				</button>
			</form>
			{error ? <p className="text-sm text-red-600 mt-2">{error}</p> : null}
			<button onClick={() => setMode(mode === 'login' ? 'register' : 'login')} className="text-sm text-gray-600 mt-3">
				{mode === 'login' ? 'Create an account' : 'Already have an account? Login'}
			</button>
		</div>
	)
}


