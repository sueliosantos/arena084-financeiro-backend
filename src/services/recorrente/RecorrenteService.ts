import prismaClient from '../../prisma';
import { decimalFields, normalizeDate } from '../../utils/normalizers';

function normalizeDiaPagamento(value: any) {
  if (value === undefined || value === null || value === '') return null;
  const dia = Number(value);
  if (!Number.isInteger(dia) || dia < 1 || dia > 31) throw new Error('Dia de pagamento inválido');
  return dia;
}

class RecorrenteService {
  async listar() {
    const recorrentes = await prismaClient.recorrente.findMany({
      include: { categoria: true },
      orderBy: [{ categoria: { nome: 'asc' } }, { descricao: 'asc' }]
    });

    return recorrentes.map(decimalFields);
  }

  async criar(data: any) {
    const recorrente = await prismaClient.recorrente.create({
      data: {
        descricao: String(data.descricao || '').trim(),
        valor: Number(data.valor),
        tipo: data.tipo,
        categoriaId: Number(data.categoriaId),
        dataInicio: normalizeDate(data.dataInicio),
        dataFim: data.dataFim ? normalizeDate(data.dataFim) : null,
        diaPagamento: normalizeDiaPagamento(data.diaPagamento),
        ativo: data.ativo ?? true
      },
      include: { categoria: true }
    });

    return decimalFields(recorrente);
  }

  async atualizar(id: number, payload: any) {
    if (!id) throw new Error('Recorrente inválido');

    if (payload.aplicarAPartir) {
      const aplicarAPartir = normalizeDate(payload.aplicarAPartir);
      const anteriorFim = new Date(aplicarAPartir);
      anteriorFim.setUTCDate(anteriorFim.getUTCDate() - 1);

      const recorrenteAtual = await prismaClient.recorrente.findUnique({
        where: { id },
        include: { categoria: true }
      });
      if (!recorrenteAtual) throw new Error('Recorrente não encontrado');

      await prismaClient.recorrente.update({
        where: { id },
        data: { dataFim: anteriorFim, ativo: false }
      });

      const novo = await prismaClient.recorrente.create({
        data: {
          descricao: payload.descricao !== undefined ? String(payload.descricao || '').trim() : recorrenteAtual.descricao,
          valor: payload.valor !== undefined ? Number(payload.valor) : recorrenteAtual.valor,
          tipo: payload.tipo || recorrenteAtual.tipo,
          categoriaId: payload.categoriaId !== undefined ? Number(payload.categoriaId) : recorrenteAtual.categoriaId,
          dataInicio: aplicarAPartir,
          dataFim: payload.dataFim ? normalizeDate(payload.dataFim) : null,
          diaPagamento: payload.diaPagamento !== undefined ? normalizeDiaPagamento(payload.diaPagamento) : recorrenteAtual.diaPagamento,
          ativo: payload.ativo ?? true
        },
        include: { categoria: true }
      });

      return decimalFields(novo);
    }

    const data: any = {};
    for (const field of ['descricao', 'tipo', 'ativo']) {
      if (payload[field] !== undefined) data[field] = payload[field];
    }
    if (payload.valor !== undefined) data.valor = Number(payload.valor);
    if (payload.categoriaId !== undefined) data.categoriaId = Number(payload.categoriaId);
    if (payload.dataInicio !== undefined) data.dataInicio = normalizeDate(payload.dataInicio);
    if (payload.dataFim !== undefined) data.dataFim = payload.dataFim ? normalizeDate(payload.dataFim) : null;
    if (payload.diaPagamento !== undefined) data.diaPagamento = normalizeDiaPagamento(payload.diaPagamento);

    const recorrente = await prismaClient.recorrente.update({
      where: { id },
      data,
      include: { categoria: true }
    });

    return decimalFields(recorrente);
  }

  async remover(id: number) {
    if (!id) throw new Error('Recorrente inválido');
    await prismaClient.recorrente.delete({ where: { id } });
    return { deleted: true };
  }
}

export { RecorrenteService };
