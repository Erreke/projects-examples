export default function(value) {
  return new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency: "USD"
  }).format(value);
}
