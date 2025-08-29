import { useEffect, useMemo, useState } from 'react'
import { getMyCart, clearCart } from '../services/cart'
import { createOrder } from '../services/orders'

export default function Checkout() {
	const [items, setItems] = useState<any[]>([])
	const [placing, setPlacing] = useState(false)
	const [message, setMessage] = useState<string | null>(null)

	useEffect(() => {
		getMyCart().then((c) => setItems(c?.items || []))
	}, [])

	const totals = useMemo(() => {
		const itemsPrice = items.reduce((s, i) => s + i.price * i.qty, 0)
		const shippingPrice = itemsPrice > 1000 ? 0 : 99
		const taxPrice = Math.round(itemsPrice * 0.1 * 100) / 100
		const totalPrice = Math.round((itemsPrice + shippingPrice + taxPrice) * 100) / 100
		return { itemsPrice, shippingPrice, taxPrice, totalPrice }
	}, [items])

	const placeOrder = async () => {
		try {
			setPlacing(true)
			setMessage(null)
			const orderItems = items.map((i) => ({ product: i.product, qty: i.qty, price: i.price, name: i.name }))
			const order = await createOrder({ orderItems, ...totals, paymentMethod: 'COD' })
			await clearCart()
			setMessage(`Order placed: ${order._id}`)
			setItems([])
		} catch (e: any) {
			setMessage(e?.response?.data?.message || e?.message || 'Failed to place order')
		} finally {
			setPlacing(false)
		}
	}

	return (
		<div className="space-y-4">
			<h1 className="text-xl font-semibold">Checkout</h1>
			{items.length === 0 ? (
				<p className="text-gray-600">No items to checkout.</p>
			) : (
				<>
					<div className="border rounded p-4">
						{items.map((i) => (
							<div key={i.product} className="flex items-center justify-between py-2">
								<p>{i.name}</p>
								<p>₹ {i.price} × {i.qty}</p>
							</div>
						))}
						<div className="border-t mt-3 pt-3 space-y-1 text-sm">
							<p className="flex justify-between"><span>Items</span><span>₹ {totals.itemsPrice.toFixed(2)}</span></p>
							<p className="flex justify-between"><span>Shipping</span><span>₹ {totals.shippingPrice.toFixed(2)}</span></p>
							<p className="flex justify-between"><span>Tax</span><span>₹ {totals.taxPrice.toFixed(2)}</span></p>
							<p className="flex justify-between font-semibold"><span>Total</span><span>₹ {totals.totalPrice.toFixed(2)}</span></p>
						</div>
					</div>
					<button onClick={placeOrder} disabled={placing} className="bg-brand-accent text-white px-4 py-2 rounded">
						{placing ? 'Placing...' : 'Place Order'}
					</button>
				</>
			)}
			{message ? <p className="text-sm text-gray-700">{message}</p> : null}
		</div>
	)
}


