export default function (value) {
  return new Intl.NumberFormat('ru-RU', { style: 'decimal' }).format(value);
}
