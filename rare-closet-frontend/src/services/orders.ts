import api from './api'

export type OrderPayload = {
	orderItems: Array<{ product: string; name?: string; qty: number; price: number }>
	shippingAddress?: any
	paymentMethod?: string
	itemsPrice?: number
	shippingPrice?: number
	taxPrice?: number
	totalPrice: number
}

export async function createOrder(payload: OrderPayload) {
	const { data } = await api.post('/orders', payload)
	return data
}

export async function getOrderById(id: string) {
	const { data } = await api.get(`/orders/${id}`)
	return data
}


