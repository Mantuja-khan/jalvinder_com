// Convert USD prices in the catalog to INR for display.
// Catalog prices are in USD. Multiply by the rate to display in Indian Rupees.
export const USD_TO_INR = 83;

export function formatINR(usd: number): string {
  const inr = Math.round(usd * USD_TO_INR);
  return "₹" + inr.toLocaleString("en-IN");
}
