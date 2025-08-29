import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import api from '../services/api'
import { addItem } from '../services/cart'
import { motion } from 'framer-motion'

type Product = {
	_id: string
	name: string
	price: number
	description?: string
	image?: string
}

export default function Product() {
	const { id } = useParams<{ id: string }>()
	const [product, setProduct] = useState<Product | null>(null)
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)

	useEffect(() => {
		async function fetchProduct() {
			try {
				setLoading(true)
				const { data } = await api.get(`/products/${id}`)
				setProduct(data)
			} catch (err: any) {
				setError(err?.message || 'Failed to load product')
			} finally {
				setLoading(false)
			}
		}
		if (id) fetchProduct()
	}, [id])

	if (loading) return <p>Loading...</p>
	if (error) return <p className="text-red-600">{error}</p>
	if (!product) return <p>Not found</p>

	return (
		<div className="grid md:grid-cols-2 gap-8">
			<div className="aspect-square bg-gray-100 overflow-hidden rounded-lg">
				{product.image ? (
					<img src={product.image} alt={product.name} className="w-full h-full object-cover" />
				) : (
					<div className="w-full h-full flex items-center justify-center text-gray-400">No Image</div>
				)}
			</div>
			<div>
				<motion.h1 initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-2xl font-semibold">
					{product.name}
				</motion.h1>
				<p className="mt-2 text-gray-600">₹ {product.price}</p>
				<p className="mt-4 text-gray-700">{product.description || 'No description.'}</p>
				<button
					onClick={async () => { if (product?._id) await addItem(product._id, 1) }}
					className="mt-6 bg-brand-accent text-white px-4 py-2 rounded-md"
				>
					Add to Cart
				</button>
			</div>
		</div>
	)
}


