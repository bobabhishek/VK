import { useEffect, useState } from 'react'
import { setAuthToken } from '../services/api'

export default function TokenBanner() {
	const [token, setToken] = useState<string>('')
	useEffect(() => {
		const t = localStorage.getItem('token') || ''
		setToken(t)
	}, [])

	return (
		<div className="bg-amber-50 border-b border-amber-200">
			<div className="container-responsive py-2 flex items-center gap-2">
				<input
					type="text"
					placeholder="Paste JWT token to access protected routes"
					value={token}
					onChange={(e) => setToken(e.target.value)}
					className="flex-1 rounded border px-3 py-1 text-sm"
				/>
				<button
					onClick={() => setAuthToken(token)}
					className="text-sm bg-brand-accent text-white px-3 py-1 rounded"
				>
					Save Token
				</button>
			</div>
		</div>
	)
}


