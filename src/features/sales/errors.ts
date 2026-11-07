export class ProductNotFoundError extends Error {}
export class InsufficientStockError extends Error {
  constructor(public readonly productName: string) { super("Insufficient stock"); }
}
export class SaleTotalOverflowError extends Error {}
