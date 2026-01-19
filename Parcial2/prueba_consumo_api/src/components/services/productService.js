const API_URL = 'https://fakestoreapi.com/products';

export async function fetchProducts() {
    const response = await fetch(API_URL);
    if (!response.ok) {
        throw new Error('Error al cargar productos');
    }
    const data = await response.json();
    return data;
}
