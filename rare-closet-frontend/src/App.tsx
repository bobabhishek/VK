import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import Navbar from './components/Navbar.tsx'
import TokenBanner from './components/TokenBanner.tsx'
import Footer from './components/Footer.tsx'
import Home from './pages/Home.tsx'
import Products from './pages/Products.tsx'
import Product from './pages/Product.tsx'
import Cart from './pages/Cart.tsx'
import Checkout from './pages/Checkout.tsx'
import Auth from './pages/Auth.tsx'

function App() {
	const location = useLocation()
	return (
		<div className="min-h-screen flex flex-col">
			<TokenBanner />
			<Navbar />
			<AnimatePresence mode="wait">
				<motion.main
					key={location.pathname}
					initial={{ opacity: 0, y: 8 }}
					animate={{ opacity: 1, y: 0 }}
					exit={{ opacity: 0, y: -8 }}
					transition={{ duration: 0.2 }}
					className="flex-1 container-responsive py-8"
				>
					<Routes>
						<Route path="/" element={<Home />} />
						<Route path="/products" element={<Products />} />
						<Route path="/products/:id" element={<Product />} />
						<Route path="/cart" element={<Cart />} />
						<Route path="/checkout" element={<Checkout />} />
						<Route path="/auth" element={<Auth />} />
					</Routes>
				</motion.main>
			</AnimatePresence>
			<Footer />
		</div>
	)
}

export default App
