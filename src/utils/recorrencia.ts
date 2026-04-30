import { sameOrAfterMonth, sameOrBeforeMonth, toMonthDate } from './date';

export function recorrenteValidoNoMes(recorrente: any, year: number, month: number) {
  const inicioOk = sameOrBeforeMonth(new Date(recorrente.dataInicio), year, month);
  const fimOk = !recorrente.dataFim || sameOrAfterMonth(new Date(recorrente.dataFim), year, month);
  return recorrente.ativo && inicioOk && fimOk;
}

export function simularRecorrente(recorrente: any, year: number, month: number) {
  const dia = recorrente.diaPagamento || new Date(recorrente.dataInicio).getUTCDate();

  return {
    id: `recorrente-${recorrente.id}-${year}-${String(month).padStart(2, '0')}`,
    tipo: recorrente.tipo,
    valor: Number(recorrente.valor),
    descricao: recorrente.descricao,
    data: toMonthDate(year, month, dia).toISOString(),
    status: 'PENDENTE',
    contabiliza: true,
    observacao: null,
    categoriaId: recorrente.categoriaId,
    categoria: recorrente.categoria,
    recorrenteId: recorrente.id,
    origem: 'RECORRENTE',
    simulado: true
  };
}
