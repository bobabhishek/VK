import { NavLink } from 'react-router-dom'
import { motion } from 'framer-motion'

const linkClasses = ({ isActive }: { isActive: boolean }) =>
	`px-3 py-2 rounded-md text-sm font-medium ${isActive ? 'text-brand-accent' : 'text-gray-700 hover:text-brand-accent'}`

export default function Navbar() {
	return (
		<motion.header
			initial={{ y: -16, opacity: 0 }}
			animate={{ y: 0, opacity: 1 }}
			transition={{ duration: 0.25 }}
			className="border-b bg-white/70 backdrop-blur sticky top-0 z-40"
		>
			<div className="container-responsive h-16 flex items-center justify-between">
				<NavLink to="/" className="text-lg font-semibold">
					<span className="text-brand-accent">Rare</span> Closet
				</NavLink>
				<nav className="flex items-center gap-2">
					<NavLink to="/" className={linkClasses} end>
						Home
					</NavLink>
					<NavLink to="/products" className={linkClasses}>
						Products
					</NavLink>
					<NavLink to="/cart" className={linkClasses}>
						Cart
					</NavLink>
				</nav>
			</div>
		</motion.header>
	)
}


