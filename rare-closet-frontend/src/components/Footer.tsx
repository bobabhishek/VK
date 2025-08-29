import { motion } from 'framer-motion'

export default function Footer() {
	return (
		<motion.footer
			initial={{ opacity: 0 }}
			whileInView={{ opacity: 1 }}
			viewport={{ once: true }}
			transition={{ duration: 0.3 }}
			className="border-t"
		>
			<div className="container-responsive py-6 text-sm text-gray-600 flex items-center justify-between">
				<p>© {new Date().getFullYear()} Rare Closet</p>
				<p className="text-gray-400">Crafted with ♥</p>
			</div>
		</motion.footer>
	)
}


