export default function (value, currency) {
  if (currency === 'KZT') {
    return `${new Intl.NumberFormat('ru-RU').format(value)} ₸`;
  }

  if (currency === 'RUB') {
    return `${new Intl.NumberFormat('ru-RU').format(value)} ₽`;
  }

  return `${new Intl.NumberFormat('ru-RU').format(value)} $`;
}
