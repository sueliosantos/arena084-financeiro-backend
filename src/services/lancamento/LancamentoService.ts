import prismaClient from '../../prisma';
import { monthRange } from '../../utils/date';
import { decimalFields, normalizeDate } from '../../utils/normalizers';
import { recorrenteValidoNoMes, simularRecorrente } from '../../utils/recorrencia';
import { parseWhatsAppMessage } from '../../utils/whatsappParser';

type ListarLancamentoFiltros = {
  tipo?: string;
  status?: string;
};

class LancamentoService {
  async listarPorMes(mes: number | string, ano: number | string, filtros: ListarLancamentoFiltros = {}) {
    const { inicio, fim, month, year } = monthRange(mes, ano);
    const tipo = filtros.tipo === 'RECEITA' || filtros.tipo === 'DESPESA' ? filtros.tipo : undefined;
    const status = filtros.status === 'PAGO' || filtros.status === 'PENDENTE' ? filtros.status : undefined;
    const where: any = {
      data: { gte: inicio, lt: fim },
      ...(tipo ? { tipo } : {}),
      ...(status ? { status } : {})
    };
    const recorrenteWhere: any = {
      ativo: true,
      dataInicio: { lt: fim },
      OR: [{ dataFim: null }, { dataFim: { gte: inicio } }],
      ...(tipo ? { tipo } : {})
    };

    const [lancamentos, recorrentes, recorrentesMaterializados] = await Promise.all([
      prismaClient.lancamento.findMany({
        where,
        include: { categoria: true },
        orderBy: { data: 'desc' }
      }),
      prismaClient.recorrente.findMany({
        where: recorrenteWhere,
        include: { categoria: true },
        orderBy: { descricao: 'asc' }
      }),
      prismaClient.lancamento.findMany({
        where: {
          data: { gte: inicio, lt: fim },
          recorrenteId: { not: null },
          ...(tipo ? { tipo } : {})
        },
        select: { recorrenteId: true }
      })
    ]);

    const materializados = new Set(recorrentesMaterializados.map((item) => item.recorrenteId));
    const simulados = recorrentes
      .filter((item) => recorrenteValidoNoMes(item, year, month))
      .map((item) => simularRecorrente(item, year, month))
      .filter((item) => !status || item.status === status)
      .filter((item) => !materializados.has(item.recorrenteId));
    const reais = lancamentos.map(decimalFields);

    return [...simulados, ...reais].sort((a: any, b: any) => new Date(b.data).getTime() - new Date(a.data).getTime());
  }

  async criar(data: any) {
    if (data.mensagem) return this.criarWhatsApp(data.mensagem);

    const lancamento = await prismaClient.lancamento.create({
      data: {
        tipo: data.tipo,
        valor: Number(data.valor),
        descricao: String(data.descricao || '').trim(),
        observacao: data.observacao ? String(data.observacao).trim() : null,
        data: normalizeDate(data.data),
        status: data.status || 'PENDENTE',
        contabiliza: data.contabiliza ?? true,
        categoriaId: Number(data.categoriaId),
        origem: data.origem || 'MANUAL'
      },
      include: { categoria: true }
    });

    return decimalFields(lancamento);
  }

  async criarWhatsApp(mensagem: string) {
    const parsed = parseWhatsAppMessage(mensagem);
    const categoria = await prismaClient.categoria.upsert({
      where: { nome_tipo: { nome: parsed.categoriaNome, tipo: parsed.tipo as any } },
      update: {},
      create: { nome: parsed.categoriaNome, tipo: parsed.tipo as any }
    });

    const lancamento = await prismaClient.lancamento.create({
      data: {
        tipo: parsed.tipo as any,
        valor: parsed.valor,
        descricao: parsed.descricao,
        observacao: null,
        data: parsed.data,
        status: parsed.status as any,
        contabiliza: true,
        categoriaId: categoria.id,
        origem: 'WHATSAPP'
      },
      include: { categoria: true }
    });

    return decimalFields(lancamento);
  }

  async atualizar(id: number, payload: any) {
    if (!id) throw new Error('Lançamento inválido');

    const data: any = {};
    for (const field of ['tipo', 'descricao', 'status', 'origem', 'observacao', 'contabiliza']) {
      if (payload[field] !== undefined) data[field] = payload[field];
    }
    if (payload.valor !== undefined) data.valor = Number(payload.valor);
    if (payload.data !== undefined) data.data = normalizeDate(payload.data);
    if (payload.categoriaId !== undefined) data.categoriaId = Number(payload.categoriaId);

    const lancamento = await prismaClient.lancamento.update({
      where: { id },
      data,
      include: { categoria: true }
    });

    return decimalFields(lancamento);
  }

  async remover(id: number) {
    if (!id) throw new Error('Lançamento inválido');
    await prismaClient.lancamento.delete({ where: { id } });
    return { deleted: true };
  }

  async materializarRecorrente(payload: any) {
    const recorrenteId = Number(payload.recorrenteId);
    const mes = Number(payload.mes);
    const ano = Number(payload.ano);
    if (!recorrenteId) throw new Error('Recorrente inválido');

    const { month, year } = monthRange(mes, ano);
    const recorrente = await prismaClient.recorrente.findUnique({
      where: { id: recorrenteId },
      include: { categoria: true }
    });

    if (!recorrente || !recorrenteValidoNoMes(recorrente, year, month)) {
      throw new Error('Recorrente não encontrado para este mês');
    }

    const simulado = simularRecorrente(recorrente, year, month);
    const dataReferencia = normalizeDate(payload.data || simulado.data);

    const lancamento = await prismaClient.lancamento.upsert({
      where: {
        recorrenteId_data: {
          recorrenteId,
          data: dataReferencia
        }
      },
      create: {
        tipo: recorrente.tipo,
        valor: payload.valor !== undefined ? Number(payload.valor) : recorrente.valor,
        descricao: recorrente.descricao,
        observacao: payload.observacao ? String(payload.observacao).trim() : null,
        data: dataReferencia,
        status: payload.status || 'PENDENTE',
        contabiliza: payload.contabiliza ?? true,
        categoriaId: recorrente.categoriaId,
        recorrenteId,
        origem: 'RECORRENTE'
      },
      update: {
        status: payload.status,
        valor: payload.valor !== undefined ? Number(payload.valor) : undefined,
        data: payload.data !== undefined ? dataReferencia : undefined,
        contabiliza: payload.contabiliza,
        observacao: payload.observacao !== undefined ? String(payload.observacao || '').trim() || null : undefined
      },
      include: { categoria: true }
    });

    return decimalFields(lancamento);
  }
}

export { LancamentoService };
