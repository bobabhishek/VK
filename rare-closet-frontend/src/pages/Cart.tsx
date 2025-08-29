import { useEffect, useState } from 'react'
import { getMyCart, removeItem, clearCart } from '../services/cart'
import { Link } from 'react-router-dom'

type CartItem = { product: string; name: string; image?: string; price: number; qty: number }

export default function Cart() {
	const [items, setItems] = useState<CartItem[]>([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)

	useEffect(() => {
		async function load() {
			try {
				setLoading(true)
				const data = await getMyCart()
				setItems(data?.items || [])
			} catch (e: any) {
				setError(e?.message || 'Failed to load cart')
			} finally {
				setLoading(false)
			}
		}
		load()
	}, [])

	const handleRemove = async (productId: string) => {
		await removeItem(productId)
		setItems((prev) => prev.filter((i) => i.product !== productId))
	}

	const handleClear = async () => {
		await clearCart()
		setItems([])
	}

	const subtotal = items.reduce((sum, i) => sum + i.price * i.qty, 0)

	if (loading) return <p>Loading...</p>
	if (error) return <p className="text-red-600">{error}</p>

	return (
		<div>
			<h1 className="text-xl font-semibold">Your Cart</h1>
			{items.length === 0 ? (
				<p className="text-gray-600 mt-2">Cart is empty.</p>
			) : (
				<div className="mt-4 space-y-4">
					{items.map((i) => (
						<div key={i.product} className="flex items-center justify-between border p-3 rounded">
							<div className="flex items-center gap-3">
								<div className="size-16 bg-gray-100 rounded overflow-hidden">
									{i.image ? <img src={i.image} className="w-full h-full object-cover" /> : null}
								</div>
								<div>
									<p className="font-medium">{i.name}</p>
									<p className="text-sm text-gray-600">₹ {i.price} × {i.qty}</p>
								</div>
							</div>
							<button onClick={() => handleRemove(i.product)} className="text-sm text-red-600">Remove</button>
						</div>
					))}
					<div className="flex items-center justify-between border-t pt-4">
						<p className="font-semibold">Subtotal</p>
						<p>₹ {subtotal.toFixed(2)}</p>
					</div>
					<div className="flex items-center gap-3">
						<button onClick={handleClear} className="px-3 py-2 rounded border">Clear Cart</button>
						<Link to="/checkout" className="px-3 py-2 rounded bg-brand-accent text-white">Checkout</Link>
					</div>
				</div>
			)}
		</div>
	)
}


