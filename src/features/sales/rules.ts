export function mergeSaleItems(items: Array<{ productId: string; quantity: number }>) {
  const quantities = new Map<string, number>();
  for (const item of items) quantities.set(item.productId, (quantities.get(item.productId) ?? 0) + item.quantity);
  return [...quantities.entries()].map(([productId, quantity]) => ({ productId, quantity }));
}

export function hasEnoughStock(currentStock: number, requestedQuantity: number) {
  return currentStock >= requestedQuantity;
}
