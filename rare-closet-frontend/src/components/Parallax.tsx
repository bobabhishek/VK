import { ReactNode, useCallback, useEffect, useRef, useState } from 'react'

type ParallaxProps = {
	children: ReactNode
	strength?: number // global multiplier
	className?: string
}

// Usage: Wrap any absolutely-positioned children. Each child can set data-depth="0.1" etc.
export default function Parallax({ children, strength = 1, className }: ParallaxProps) {
	const containerRef = useRef<HTMLDivElement | null>(null)
	const [offset, setOffset] = useState({ x: 0, y: 0 })

	const onMouseMove = useCallback((e: MouseEvent) => {
		const el = containerRef.current
		if (!el) return
		const rect = el.getBoundingClientRect()
		const nx = (e.clientX - rect.left) / rect.width // 0..1
		const ny = (e.clientY - rect.top) / rect.height // 0..1
		setOffset({ x: (nx - 0.5) * 2, y: (ny - 0.5) * 2 }) // -1..1
	}, [])

	useEffect(() => {
		const el = containerRef.current
		if (!el) return
		el.addEventListener('mousemove', onMouseMove)
		return () => el.removeEventListener('mousemove', onMouseMove)
	}, [onMouseMove])

	// Apply transform to children via data-depth attribute
	const transformedChildren = Array.isArray(children) ? children : [children]

	return (
		<div ref={containerRef} className={className} style={{ perspective: 800 }}>
			{transformedChildren.map((child: any, idx: number) => {
				const depthAttr = child?.props?.['data-depth']
				const depth = typeof depthAttr === 'number' ? depthAttr : parseFloat(depthAttr || '0') || 0
				const dx = -(offset.x * depth * 10 * strength)
				const dy = -(offset.y * depth * 10 * strength)
				const style = {
					transform: `translate3d(${dx.toFixed(1)}px, ${dy.toFixed(1)}px, 0px)`,
					transformStyle: 'preserve-3d' as const,
					backfaceVisibility: 'hidden' as const,
					position: 'absolute' as const,
					left: 0,
					top: 0,
					width: '100%',
					height: '100%',
					...(child?.props?.style || {}),
				}
				return (
					<div key={idx} data-depth={depth} className={child?.props?.className} style={style}>
						{child}
					</div>
				)
			})}
		</div>
	)
}


