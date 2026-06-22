// Convert USD prices in the catalog to INR for display.
// Catalog prices are in USD. Multiply by the rate to display in Indian Rupees.
export const USD_TO_INR = 83;

export function formatINR(price: number): string {
  return "₹" + Math.round(price).toLocaleString("en-IN");
}
