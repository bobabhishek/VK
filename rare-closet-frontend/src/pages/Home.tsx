import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import Parallax from '../components/Parallax'
import ShootingStars from '../components/ShootingStars'

export default function Home() {
	return (
		<div className="space-y-12">
			<section className="relative min-h-[70vh] overflow-hidden rounded-2xl bg-gradient-to-br from-[#00331f] via-[#001f3f] to-[#00331f]">
				{/* Stars & Parallax background */}
				<ShootingStars density={60} />
				<Parallax strength={1.2} className="absolute inset-0">
					<div data-depth={0.05} className="absolute inset-0" />
					<div data-depth={0.1} className="absolute inset-0" />
					<div data-depth={0.08} className="absolute inset-0" />
				</Parallax>

				{/* Foreground content */}
				<div className="relative z-10 flex min-h-[70vh] items-center justify-center text-center px-6">
					<div className="max-w-2xl">
						<motion.h1
							initial={{ opacity: 0, y: 8 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.35 }}
							className="text-white text-4xl sm:text-5xl font-bold tracking-wide"
						>
							Discover Unique Fashion
						</motion.h1>
						<motion.p
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							transition={{ delay: 0.15, duration: 0.35 }}
							className="mt-4 text-white/80"
						>
							Curated pieces, rare finds, and timeless style.
						</motion.p>
						<motion.div
							initial={{ opacity: 0, y: 6 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: 0.3, duration: 0.3 }}
							className="mt-8"
						>
							<Link to="/products" className="inline-block bg-white/10 backdrop-blur px-6 py-3 rounded-md text-white border border-white/20 hover:bg-white/20">
								Shop Now
							</Link>
						</motion.div>
					</div>
				</div>
				{/* Gradient fade footer */}
				<div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/60 to-transparent" />
			</section>

			{/* Existing content below hero if needed */}
		</div>
	)
}


