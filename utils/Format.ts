export function formatNumber(value: number): string {
  if (value >= 10000000) {
    return (value / 1000000).toFixed(0) + "M";
  } else if (value >= 10000) {
    return (value / 1000).toFixed(0) + "k";
  } else {
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  }
}
