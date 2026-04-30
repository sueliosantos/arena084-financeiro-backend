export function monthRange(mes: number | string, ano: number | string) {
  const month = Number(mes);
  const year = Number(ano);

  if (!Number.isInteger(month) || month < 1 || month > 12) {
    throw new Error('Mes invalido');
  }

  if (!Number.isInteger(year) || year < 1900 || year > 2200) {
    throw new Error('Ano invalido');
  }

  const inicio = new Date(Date.UTC(year, month - 1, 1, 0, 0, 0));
  const fim = new Date(Date.UTC(year, month, 1, 0, 0, 0));

  return { inicio, fim, month, year };
}

export function toMonthDate(year: number, month: number, day: number) {
  const lastDay = new Date(Date.UTC(year, month, 0)).getUTCDate();
  return new Date(Date.UTC(year, month - 1, Math.min(day, lastDay), 12, 0, 0));
}

export function sameOrBeforeMonth(date: Date, year: number, month: number) {
  return date.getUTCFullYear() < year || (date.getUTCFullYear() === year && date.getUTCMonth() + 1 <= month);
}

export function sameOrAfterMonth(date: Date, year: number, month: number) {
  return date.getUTCFullYear() > year || (date.getUTCFullYear() === year && date.getUTCMonth() + 1 >= month);
}
