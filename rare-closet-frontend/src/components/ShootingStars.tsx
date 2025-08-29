import { useEffect, useRef } from 'react'

export default function ShootingStars({ density = 40 }: { density?: number }) {
	const canvasRef = useRef<HTMLCanvasElement | null>(null)

	useEffect(() => {
		const canvas = canvasRef.current
		if (!canvas) return
		const ctx = canvas.getContext('2d')!
		let raf = 0
		let width = (canvas.width = canvas.offsetWidth)
		let height = (canvas.height = canvas.offsetHeight)

		const onResize = () => {
			width = canvas.width = canvas.offsetWidth
			height = canvas.height = canvas.offsetHeight
		}
		window.addEventListener('resize', onResize)

		const stars = Array.from({ length: density }).map(() => ({
			x: Math.random() * width,
			y: Math.random() * height,
			vx: -1 - Math.random() * 2,
			vy: 0.2 + Math.random() * 0.5,
			size: Math.random() * 1.5 + 0.3,
			life: Math.random() * 1,
		}))

		const draw = () => {
			ctx.clearRect(0, 0, width, height)
			ctx.fillStyle = 'rgba(255,255,255,0.9)'
			for (const s of stars) {
				s.x += s.vx
				s.y += s.vy
				s.life -= 0.002
				if (s.x < -10 || s.y > height + 10 || s.life < 0) {
					s.x = width + Math.random() * 30
					s.y = Math.random() * height * 0.7
					s.life = 1
				}
				ctx.beginPath()
				ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2)
				ctx.fill()
			}
			raf = requestAnimationFrame(draw)
		}
		draw()

		return () => {
			cancelAnimationFrame(raf)
			window.removeEventListener('resize', onResize)
		}
	}, [density])

	return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
}


