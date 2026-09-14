const CART_KEY = "cart_v1";

export function getCart() {
  const c = localStorage.getItem(CART_KEY);
  return c ? JSON.parse(c) : [];
}

export function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

export function addToCart(product, quantity = 1) {
  const cart = getCart();
  const found = cart.find(i => i.id === product.id);
  if (found) found.quantity += quantity;
  else cart.push({ id: product.id, name: product.name, price: product.price, quantity });
  saveCart(cart);
}

export function updateQty(productId, quantity) {
  const cart = getCart().map(i => i.id === productId ? { ...i, quantity } : i);
  saveCart(cart);
}

export function removeFromCart(productId) {
  const cart = getCart().filter(i => i.id !== productId);
  saveCart(cart);
}

export function clearCart() {
  localStorage.removeItem(CART_KEY);
}