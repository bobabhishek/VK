import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import api from '../services/api'

type Product = {
	_id: string
	name: string
	price: number
	image?: string
}

export default function Products() {
	const [products, setProducts] = useState<Product[]>([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)

	useEffect(() => {
		async function fetchProducts() {
			try {
				setLoading(true)
				const { data } = await api.get('/products')
				setProducts(data)
			} catch (err: any) {
				setError(err?.message || 'Failed to load products')
			} finally {
				setLoading(false)
			}
		}
		fetchProducts()
	}, [])

	if (loading) return <p>Loading...</p>
	if (error) return <p className="text-red-600">{error}</p>

	return (
		<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
			{products.map((p) => (
				<motion.div
					key={p._id}
					initial={{ opacity: 0, y: 8 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.25 }}
					className="border rounded-lg overflow-hidden"
				>
					<Link to={`/products/${p._id}`} className="block">
						<div className="aspect-[4/3] bg-gray-100 overflow-hidden">
							{p.image ? (
								<img src={p.image} alt={p.name} className="w-full h-full object-cover" />
							) : (
								<div className="w-full h-full flex items-center justify-center text-gray-400">No Image</div>
							)}
						</div>
						<div className="p-4">
							<h3 className="font-medium">{p.name}</h3>
							<p className="text-gray-600 mt-1">₹ {p.price}</p>
						</div>
					</Link>
				</motion.div>
			))}
		</div>
	)
}


