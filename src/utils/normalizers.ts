export const decimalFields = <T extends { valor: any }>(item: T) => ({
  ...item,
  valor: Number(item.valor)
});

export function normalizeDate(value?: string | Date | null) {
  const date = value ? new Date(value) : new Date();
  if (Number.isNaN(date.getTime())) throw new Error('Data inválida');
  return date;
}
