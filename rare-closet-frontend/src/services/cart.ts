import api from './api'

export async function getMyCart() {
	const { data } = await api.get('/cart/my')
	return data
}

export async function addItem(productId: string, qty: number) {
	const { data } = await api.post('/cart/items', { productId, qty })
	return data
}

export async function removeItem(productId: string) {
	const { data } = await api.delete(`/cart/items/${productId}`)
	return data
}

export async function clearCart() {
	const { data } = await api.delete('/cart/clear')
	return data
}


